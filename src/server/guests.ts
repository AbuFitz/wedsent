import { z } from "zod";
import { getDb, type Q } from "./db";
import { assertOwner } from "./weddings";
import { audit } from "./audit";
import { bad, notFound } from "./errors";
import { decryptToken, encryptToken, newToken, sha256 } from "./crypto";

const Name = z.string().trim().min(1).max(120);
export const EventInput = z.object({
  title: Name.max(80),
  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  startsAt: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  venue: z.string().trim().max(80).default(""),
  city: z.string().trim().max(80).default(""),
  address: z.string().trim().max(160).default(""),
  visibility: z.enum(["invited", "everyone"]).default("invited"),
});
export const GuestInput = z.object({ name: Name, email: z.string().trim().email().max(254).nullable().optional().or(z.literal("")), child: z.boolean().default(false) });
export const HouseholdInput = z.object({
  name: Name,
  guests: z.array(GuestInput).min(1).max(12),
  eventIds: z.array(z.string().uuid()).max(20),
});

const parse = <T>(s: z.ZodType<T>, v: unknown) => {
  const r = s.safeParse(v);
  if (!r.success) throw bad("Some details are not valid.", r.error.flatten());
  return r.data;
};

/* ---------- events ---------- */
export async function listEvents(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return (await db.query(`select id, title, to_char(starts_on,'YYYY-MM-DD') as starts_on, to_char(starts_at_local,'HH24:MI') as starts_at_local, venue, address, city, visibility, sort_order from wedding_events where wedding_id=$1 order by starts_on nulls last, starts_at_local nulls last, sort_order, created_at`, [weddingId])).rows;
}
export async function createEvent(userId: string, weddingId: string, input: unknown) {
  const e = parse(EventInput, input);
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query(
    `insert into wedding_events(wedding_id,title,starts_on,starts_at_local,venue,city,address,visibility,sort_order)
     values ($1,$2,$3,$4,$5,$6,$7,$8,(select coalesce(max(sort_order),0)+1 from wedding_events where wedding_id=$1)) returning id`,
    [weddingId, e.title, e.startsOn ?? null, e.startsAt ?? null, e.venue, e.city, e.address, e.visibility],
  );
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "event.created", targetKind: "event", targetId: r.rows[0].id });
  return r.rows[0].id as string;
}
export async function updateEvent(userId: string, weddingId: string, eventId: string, input: unknown) {
  const e = parse(EventInput, input);
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query(
    `update wedding_events set title=$3, starts_on=$4, starts_at_local=$5, venue=$6, city=$7, address=$8, visibility=$9 where id=$1 and wedding_id=$2`,
    [eventId, weddingId, e.title, e.startsOn ?? null, e.startsAt ?? null, e.venue, e.city, e.address, e.visibility],
  );
  if (!r.rowCount) throw notFound("Event not found");
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "event.updated", targetKind: "event", targetId: eventId });
}
export async function deleteEvent(userId: string, weddingId: string, eventId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query(`delete from wedding_events where id=$1 and wedding_id=$2`, [eventId, weddingId]);
  if (!r.rowCount) throw notFound("Event not found");
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "event.deleted", targetKind: "event", targetId: eventId });
}

/* ---------- households ---------- */
async function assertEventsBelong(q: Q, weddingId: string, eventIds: string[]) {
  if (!eventIds.length) return;
  const r = await q.query(`select count(*)::int n from wedding_events where wedding_id=$1 and id = any($2::uuid[])`, [weddingId, eventIds]);
  if (r.rows[0].n !== new Set(eventIds).size) throw bad("One of the selected events does not belong to this wedding.");
}

async function issueInvitation(q: Q, weddingId: string, householdId: string) {
  // 128-bit opaque capability: 22 URL-safe characters instead of the old 32.
  // Existing 24-byte invitation tokens remain valid until their owners rotate them.
  const token = newToken(16);
  await q.query(`insert into invitations(wedding_id, household_id, token_digest, token_enc) values ($1,$2,$3,$4)`, [weddingId, householdId, sha256(token), encryptToken(token)]);
  return token;
}

export async function createHouseholdTx(q: Q, weddingId: string, input: z.infer<typeof HouseholdInput>) {
  await assertEventsBelong(q, weddingId, input.eventIds);
  const h = await q.query<{ id: string }>(`insert into households(wedding_id, display_name) values ($1,$2) returning id`, [weddingId, input.name]);
  const hid = h.rows[0].id;
  for (const g of input.guests) {
    const gr = await q.query<{ id: string }>(`insert into guests(wedding_id, household_id, display_name, email, is_child) values ($1,$2,$3,$4,$5) returning id`, [weddingId, hid, g.name, g.email || null, g.child]);
    for (const ev of new Set(input.eventIds)) await q.query(`insert into event_invitees(wedding_id,event_id,guest_id) values ($1,$2,$3)`, [weddingId, ev, gr.rows[0].id]);
  }
  await issueInvitation(q, weddingId, hid);
  return hid;
}

export async function createHousehold(userId: string, weddingId: string, input: unknown) {
  const v = parse(HouseholdInput, input);
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    const id = await createHouseholdTx(q, weddingId, v);
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "household.created", targetKind: "household", targetId: id });
    return id;
  });
}

/** CSV rows (already reviewed by the host) -> households grouped by household name, invited to the chosen events. */
export async function importHouseholds(userId: string, weddingId: string, rows: { household: string; guest: string; email: string; child: boolean }[], eventIds: string[]) {
  if (rows.length > 500) throw bad("Import up to 500 guests at a time.");
  const groups = new Map<string, typeof rows>();
  for (const r of rows) groups.set(r.household, [...(groups.get(r.household) ?? []), r]);
  const oversized = [...groups].find(([, guests]) => guests.length > 12);
  if (oversized) throw bad(`“${oversized[0]}” has ${oversized[1].length} people. A household can contain up to 12. Split this household before importing; no guests have been added.`);
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    let n = 0;
    for (const [name, gs] of groups) {
      const v = parse(HouseholdInput, { name, eventIds, guests: gs.map((g) => ({ name: g.guest, email: g.email || null, child: g.child })) });
      await createHouseholdTx(q, weddingId, v);
      n += v.guests.length;
    }
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "guests.imported", metadata: { guests: n, households: groups.size } });
    return { households: groups.size, guests: n };
  });
}

export async function listHouseholds(userId: string, weddingId: string, origin: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const hs = (await db.query(
    `select h.id, h.display_name, i.token_enc, i.last_opened_at from households h
     left join invitations i on i.household_id = h.id and i.revoked_at is null
     where h.wedding_id=$1 order by h.created_at, h.display_name`, [weddingId])).rows;
  const gs = (await db.query(`select id, household_id, display_name, email, is_child from guests where wedding_id=$1 order by created_at`, [weddingId])).rows;
  const inv = (await db.query(`select event_id, guest_id from event_invitees where wedding_id=$1`, [weddingId])).rows;
  const rs = (await db.query(`select event_id, guest_id, status, note from event_responses where wedding_id=$1`, [weddingId])).rows;
  return hs.map((h) => ({
    id: h.id as string,
    name: h.display_name as string,
    link: h.token_enc ? `${origin}/r/${decryptToken(h.token_enc)}` : null,
    lastOpenedAt: h.last_opened_at as string | null,
    guests: gs.filter((g) => g.household_id === h.id).map((g) => ({
      id: g.id as string, name: g.display_name as string, email: g.email as string | null, child: g.is_child as boolean,
      events: inv.filter((x) => x.guest_id === g.id).map((x) => ({ eventId: x.event_id as string, status: (rs.find((r) => r.guest_id === g.id && r.event_id === x.event_id)?.status ?? null) as string | null })),
    })),
  }));
}

export async function setHouseholdEvents(userId: string, weddingId: string, householdId: string, eventIds: string[]) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    await assertEventsBelong(q, weddingId, eventIds);
    const own = await q.query(`select 1 from households where id=$1 and wedding_id=$2`, [householdId, weddingId]);
    if (!own.rowCount) throw notFound("Household not found");
    const guests = (await q.query<{ id: string }>(`select id from guests where household_id=$1`, [householdId])).rows;
    const ids = guests.map((g) => g.id);
    // Removing an invitation removes any answer for it (cascade); adding keeps existing answers.
    await q.query(`delete from event_invitees where wedding_id=$1 and guest_id = any($2::uuid[]) and not (event_id = any($3::uuid[]))`, [weddingId, ids, eventIds]);
    for (const g of ids) for (const e of new Set(eventIds)) await q.query(`insert into event_invitees(wedding_id,event_id,guest_id) values ($1,$2,$3) on conflict do nothing`, [weddingId, e, g]);
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "household.events_changed", targetKind: "household", targetId: householdId, metadata: { eventIds } });
  });
}

export async function deleteHousehold(userId: string, weddingId: string, householdId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query(`delete from households where id=$1 and wedding_id=$2`, [householdId, weddingId]);
  if (!r.rowCount) throw notFound("Household not found");
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "household.deleted", targetKind: "household", targetId: householdId });
}

/** Revoke the current link and mint a new one (e.g. a link was forwarded). Other households are unaffected. */
export async function rotateInvitation(userId: string, weddingId: string, householdId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    const own = await q.query(`select 1 from households where id=$1 and wedding_id=$2 for update`, [householdId, weddingId]);
    if (!own.rowCount) throw notFound("Household not found");
    await q.query(`update invitations set revoked_at=now() where household_id=$1 and revoked_at is null`, [householdId]);
    await issueInvitation(q, weddingId, householdId);
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "invitation.rotated", targetKind: "household", targetId: householdId });
  });
}
