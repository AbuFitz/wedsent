import { z } from "zod";
import { getDb, type Q } from "./db";
import { AppError, bad, conflict, notFound } from "./errors";
import { sha256 } from "./crypto";
import { audit } from "./audit";
import { assertOwner, type Content } from "./weddings";
import { toCsv } from "@/lib/csv";

export const AnswerInput = z.object({
  guestId: z.string().uuid(),
  eventId: z.string().uuid(),
  status: z.enum(["attending", "declined"]),
  note: z.string().trim().max(240).nullable().optional(),
  /** Version the client last saw for this answer (0 = no answer yet). Optional safety check. */
  version: z.number().int().min(0).optional(),
});
export const RespondInput = z.object({ answers: z.array(AnswerInput).min(1).max(100), idempotencyKey: z.string().min(8).max(80) });
export type Answer = z.infer<typeof AnswerInput>;

type Resolved = { invitationId: string; weddingId: string; householdId: string; householdName: string; deadline: Date | null; allowAfter: boolean; content: Content; slug: string };

async function resolve(q: Q, token: string, lock = false): Promise<Resolved> {
  const r = await q.query(
    `select i.id invitation_id, i.wedding_id, i.household_id, h.display_name, w.rsvp_deadline, w.allow_changes_after_deadline, w.slug, v.content
     from invitations i
     join households h on h.id = i.household_id
     join weddings w on w.id = i.wedding_id and w.state = 'published'
     join design_versions v on v.id = w.published_version_id
     where i.token_digest = $1 and i.revoked_at is null and (i.expires_at is null or i.expires_at > now())
     ${lock ? "for update of i" : ""}`,
    [sha256(token)],
  );
  const x = r.rows[0];
  if (!x) throw notFound("This invitation link is not active. Ask the couple for a new one.");
  return { invitationId: x.invitation_id, weddingId: x.wedding_id, householdId: x.household_id, householdName: x.display_name, deadline: x.rsvp_deadline ? new Date(x.rsvp_deadline) : null, allowAfter: x.allow_changes_after_deadline, content: x.content, slug: x.slug };
}

/** What a guest may see: their own household, the events they are invited to, current answers. Nothing else. */
export async function guestView(token: string) {
  const db = await getDb();
  const r = await resolve(db, token);
  db.query(`update invitations set last_opened_at = now() where id=$1 and (last_opened_at is null or last_opened_at < now() - interval '10 minutes')`, [r.invitationId]).catch(() => {});
  const guests = (await db.query(`select id, display_name, is_child from guests where household_id=$1 order by created_at`, [r.householdId])).rows;
  const ids = guests.map((g) => g.id);
  const events = (await db.query(
    `select distinct e.id, e.title, e.starts_on, e.starts_at_local, e.venue, e.city, e.sort_order from wedding_events e
     join event_invitees ei on ei.event_id = e.id where ei.guest_id = any($1::uuid[]) order by e.sort_order, e.starts_on`, [ids])).rows;
  const invited = (await db.query(`select event_id, guest_id from event_invitees where guest_id = any($1::uuid[])`, [ids])).rows;
  const answers = (await db.query(`select event_id, guest_id, status, note, version from event_responses where guest_id = any($1::uuid[])`, [ids])).rows;
  const locked = !!r.deadline && r.deadline.getTime() < Date.now() && !r.allowAfter;
  return {
    household: { name: r.householdName },
    content: r.content,
    deadline: r.deadline?.toISOString() ?? null,
    locked,
    guests: guests.map((g) => ({ id: g.id, name: g.display_name, child: g.is_child })),
    events: events.map((e) => ({ id: e.id, title: e.title, startsOn: e.starts_on, startsAt: e.starts_at_local, venue: e.venue, city: e.city })),
    invited: invited.map((i) => ({ eventId: i.event_id, guestId: i.guest_id })),
    answers: answers.map((a) => ({ eventId: a.event_id, guestId: a.guest_id, status: a.status, note: a.note, version: a.version })),
  };
}

async function writeAnswers(q: Q, weddingId: string, answers: Answer[], source: "guest" | "host", allowedGuestIds: string[] | null) {
  const changed: string[] = [];
  for (const a of answers) {
    if (allowedGuestIds && !allowedGuestIds.includes(a.guestId)) throw bad("That person is not part of this invitation.");
    const inv = await q.query(`select 1 from event_invitees where wedding_id=$1 and event_id=$2 and guest_id=$3`, [weddingId, a.eventId, a.guestId]);
    if (!inv.rowCount) throw bad("That person is not invited to that event.");
    const cur = await q.query<{ version: number; status: string; note: string | null }>(`select version, status, note from event_responses where event_id=$1 and guest_id=$2 for update`, [a.eventId, a.guestId]);
    const have = cur.rows[0];
    if (a.version !== undefined && a.version !== (have?.version ?? 0)) throw conflict("stale_answer", "Someone in your household already updated this answer. Review the latest and try again.");
    if (have && have.status === a.status && (have.note ?? null) === (a.note ?? null)) continue; // no-op, keeps history clean
    const next = (have?.version ?? 0) + 1;
    if (have) await q.query(`update event_responses set status=$3, note=$4, version=$5, source=$6, responded_at=now() where event_id=$1 and guest_id=$2`, [a.eventId, a.guestId, a.status, a.note ?? null, next, source]);
    else await q.query(`insert into event_responses(wedding_id,event_id,guest_id,status,note,version,source) values ($1,$2,$3,$4,$5,$6,$7)`, [weddingId, a.eventId, a.guestId, a.status, a.note ?? null, next, source]);
    await q.query(`insert into response_history(wedding_id,event_id,guest_id,status,note,source,version) values ($1,$2,$3,$4,$5,$6,$7)`, [weddingId, a.eventId, a.guestId, a.status, a.note ?? null, source, next]);
    changed.push(`${a.guestId}:${a.eventId}`);
  }
  return changed;
}

/** Guest reply. Re-validates the link INSIDE the transaction (revocation race), enforces deadline, idempotent per key. */
export async function respond(token: string, input: unknown) {
  const v = RespondInput.safeParse(input);
  if (!v.success) throw bad("Some answers are not valid.", v.error.flatten());
  const db = await getDb();
  return db.tx(async (q) => {
    const r = await resolve(q, token, true);
    const scope = `rsvp:${r.invitationId}`;
    const prior = await q.query(`select response from idempotency_keys where scope=$1 and key=$2`, [scope, v.data.idempotencyKey]);
    if (prior.rowCount) return { ...prior.rows[0].response, replayed: true };
    if (r.deadline && r.deadline.getTime() < Date.now() && !r.allowAfter) throw new AppError(403, "deadline_passed", "Replies closed on the reply-by date. Contact the couple to change your answer.");
    const ids = (await q.query<{ id: string }>(`select id from guests where household_id=$1`, [r.householdId])).rows.map((g) => g.id);
    const changed = await writeAnswers(q, r.weddingId, v.data.answers, "guest", ids);
    const out = { ok: true, changed: changed.length };
    await q.query(`insert into idempotency_keys(scope,key,response) values ($1,$2,$3)`, [scope, v.data.idempotencyKey, out]);
    await audit(q, { weddingId: r.weddingId, actor: "guest", actorId: r.householdId, action: "rsvp.submitted", targetKind: "household", targetId: r.householdId, metadata: { changed: changed.length } });
    return out;
  });
}

/** Host enters or corrects answers on a household's behalf. Allowed after the deadline; audited as host. */
export async function hostRecord(userId: string, weddingId: string, answers: unknown) {
  const v = z.array(AnswerInput).min(1).max(100).safeParse(answers);
  if (!v.success) throw bad("Some answers are not valid.", v.error.flatten());
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    const changed = await writeAnswers(q, weddingId, v.data, "host", null);
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "rsvp.host_recorded", metadata: { changed: changed.length } });
    return { ok: true, changed: changed.length };
  });
}

/** Counts are PEOPLE per event. A link is not a headcount. */
export async function eventCounts(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query(
    `select e.id, e.title, e.sort_order,
       count(ei.guest_id)::int invited,
       count(*) filter (where er.status='attending')::int attending,
       count(*) filter (where er.status='declined')::int declined,
       count(*) filter (where ei.guest_id is not null and er.id is null)::int no_reply
     from wedding_events e
     left join event_invitees ei on ei.event_id = e.id
     left join event_responses er on er.event_id = e.id and er.guest_id = ei.guest_id
     where e.wedding_id = $1 group by e.id order by e.sort_order, e.created_at`, [weddingId]);
  return r.rows.map((x) => ({ eventId: x.id as string, title: x.title as string, invited: x.invited as number, attending: x.attending as number, declined: x.declined as number, noReply: x.no_reply as number }));
}

export async function exportCsv(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query(
    `select h.display_name household, g.display_name guest, g.email, g.is_child, e.title event, er.status, er.note, er.responded_at
     from guests g join households h on h.id = g.household_id
     join event_invitees ei on ei.guest_id = g.id join wedding_events e on e.id = ei.event_id
     left join event_responses er on er.event_id = e.id and er.guest_id = g.id
     where g.wedding_id = $1 order by h.display_name, g.display_name, e.sort_order`, [weddingId]);
  return toCsv([["Household", "Guest", "Email", "Child", "Event", "Reply", "Note", "Replied at"], ...r.rows.map((x) => [x.household, x.guest, x.email, x.is_child ? "yes" : "", x.event, x.status ?? "no reply", x.note, x.responded_at ? new Date(x.responded_at).toISOString() : ""])]);
}
