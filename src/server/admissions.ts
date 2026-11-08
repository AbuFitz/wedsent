import { z } from "zod";
import { getDb } from "./db";
import { assertOwner } from "./weddings";
import { audit } from "./audit";
import { bad, conflict, notFound } from "./errors";
import { newToken, sha256 } from "./crypto";

const Id = z.string().uuid();
const PassInput = z.object({ eventId: Id, householdId: Id, rotate: z.boolean().default(false) });
const CheckinInput = z.object({ eventId: Id, token: z.string().min(20).max(256), guestIds: z.array(Id).min(1).max(30) });

/** QR credentials are scoped to ONE household and ONE wedding event, never to the whole guest list. */
export async function issueAdmissionPass(userId: string, weddingId: string, input: unknown) {
  const parsed = PassInput.safeParse(input);
  if (!parsed.success) throw bad("Choose a valid household and event.");
  const { eventId, householdId, rotate } = parsed.data;
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    const eligible = await q.query(
      `select 1 from event_invitees ei join guests g on g.id=ei.guest_id and g.wedding_id=ei.wedding_id
       where ei.wedding_id=$1 and ei.event_id=$2 and g.household_id=$3 limit 1`,
      [weddingId, eventId, householdId],
    );
    if (!eligible.rowCount) throw bad("This household has no invitation to that event.");
    // Serialise competing issuance/rotation requests on the household row.
    await q.query(`select id from households where wedding_id=$1 and id=$2 for update`, [weddingId, householdId]);
    const previous = await q.query<{ id: string }>(
      `select id from admission_passes where wedding_id=$1 and event_id=$2 and household_id=$3 and revoked_at is null order by issued_at desc`,
      [weddingId, eventId, householdId],
    );
    if (previous.rowCount && !rotate) throw conflict("pass_exists", "An active QR pass already exists. Rotate it if you need a replacement.");
    if (previous.rowCount) await q.query(
      `update admission_passes set revoked_at=now() where wedding_id=$1 and event_id=$2 and household_id=$3 and revoked_at is null`,
      [weddingId, eventId, householdId],
    );
    const token = newToken(32);
    const pass = await q.query<{ id: string }>(
      `insert into admission_passes(wedding_id,event_id,household_id,token_digest) values($1,$2,$3,$4) returning id`,
      [weddingId, eventId, householdId, sha256(token)],
    );
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: previous.rowCount ? "pass.rotated" : "pass.issued", targetKind: "admission_pass", targetId: pass.rows[0].id });
    return { id: pass.rows[0].id, token, eventId, householdId };
  });
}

export async function listAdmissionPasses(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return (await db.query(
    `select p.id, p.event_id, e.title as event_title, p.household_id, h.display_name as household_name,
            p.issued_at, p.expires_at, p.revoked_at,
            (select count(*)::int from guest_checkins c where c.event_id=p.event_id and c.pass_id=p.id) as checked_in
     from admission_passes p join wedding_events e on e.id=p.event_id
     join households h on h.id=p.household_id where p.wedding_id=$1 order by p.issued_at desc`, [weddingId],
  )).rows;
}

export async function checkinGuests(userId: string, weddingId: string, input: unknown) {
  const parsed = CheckinInput.safeParse(input);
  if (!parsed.success) throw bad("Select an event, valid QR code and the arriving guests.");
  const { eventId, token, guestIds } = parsed.data;
  if (new Set(guestIds).size !== guestIds.length) throw bad("Choose each guest only once.");
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    const p = await q.query<{ id: string; household_id: string; revoked_at: string | null; expires_at: string | null }>(
      `select id, household_id, revoked_at, expires_at from admission_passes where wedding_id=$1 and event_id=$2 and token_digest=$3 for update`,
      [weddingId, eventId, sha256(token)],
    );
    if (!p.rowCount) throw notFound("QR pass not recognised for this event.");
    const pass = p.rows[0];
    if (pass.revoked_at || (pass.expires_at && new Date(pass.expires_at).getTime() <= Date.now())) {
      await q.query(`insert into checkin_attempts(wedding_id,event_id,pass_id,outcome,guest_ids) values($1,$2,$3,'revoked',$4)`, [weddingId, eventId, pass.id, guestIds]);
      return { admitted: [], alreadyCheckedIn: [], rejected: guestIds, reason: "pass_inactive" };
    }
    const eligible = await q.query<{ guest_id: string }>(
      `select ei.guest_id from event_invitees ei join guests g on g.id=ei.guest_id and g.wedding_id=ei.wedding_id
       left join event_responses r on r.event_id=ei.event_id and r.guest_id=ei.guest_id
       where ei.wedding_id=$1 and ei.event_id=$2 and g.household_id=$3 and ei.guest_id=any($4::uuid[])
       and (r.status is null or r.status='attending')`,
      [weddingId, eventId, pass.household_id, guestIds],
    );
    const allowed = new Set(eligible.rows.map((r) => r.guest_id));
    const rejected = guestIds.filter((id) => !allowed.has(id));
    const admitted: string[] = [];
    const alreadyCheckedIn: string[] = [];
    for (const id of guestIds.filter((g) => allowed.has(g))) {
      const result = await q.query<{ guest_id: string }>(
        `insert into guest_checkins(wedding_id,event_id,guest_id,pass_id,method) values($1,$2,$3,$4,'qr')
         on conflict(event_id,guest_id) do nothing returning guest_id`, [weddingId, eventId, id, pass.id],
      );
      (result.rowCount ? admitted : alreadyCheckedIn).push(id);
    }
    await q.query(
      `insert into checkin_attempts(wedding_id,event_id,pass_id,outcome,guest_ids) values($1,$2,$3,$4,$5)`,
      [weddingId, eventId, pass.id, admitted.length ? "admitted" : rejected.length ? "not_eligible" : "duplicate", guestIds],
    );
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "guests.checked_in", targetKind: "admission_pass", targetId: pass.id, metadata: { eventId, admitted, alreadyCheckedIn, rejected } });
    return { admitted, alreadyCheckedIn, rejected };
  });
}

export async function listCheckins(userId: string, weddingId: string, eventId?: string) {
  if (eventId && !Id.safeParse(eventId).success) throw bad("Invalid event ID.");
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const event = eventId ? await db.query(`select 1 from wedding_events where wedding_id=$1 and id=$2`, [weddingId, eventId]) : null;
  if (event && !event.rowCount) throw notFound("Event not found.");
  return (await db.query(
    `select c.id, c.event_id, c.guest_id, g.display_name as guest_name, g.household_id,
            h.display_name as household_name, c.checked_in_at, c.method
     from guest_checkins c join guests g on g.id=c.guest_id join households h on h.id=g.household_id
     where c.wedding_id=$1 and ($2::uuid is null or c.event_id=$2::uuid) order by c.checked_in_at desc`,
    [weddingId, eventId ?? null],
  )).rows;
}
