import { z } from "zod";
import { getDb } from "./db";
import { AppError, bad, notFound } from "./errors";
import { assertOwner } from "./weddings";

export const PublicReplyInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  status: z.enum(["attending", "declined"]),
  eventId: z.string().uuid().nullable(),
  note: z.string().trim().max(240).optional(),
  // Honeypot is filled only by bots, not by users.
  website: z.string().max(200).optional(),
});

/** Public responses are unverified and are never treated as confirmed invited places. */
export async function publicReply(slug: string, raw: unknown) {
  const parsed = PublicReplyInput.safeParse(raw);
  if (!parsed.success) throw bad("Check your name, email and reply.", parsed.error.flatten());
  const input = parsed.data;
  if (input.website) return { ok: true };
  const db = await getDb();
  return db.tx(async (q) => {
    const wedding = await q.query<{ id: string; rsvp_deadline: Date | null; allow_changes_after_deadline: boolean }>(
      `select id, rsvp_deadline, allow_changes_after_deadline from weddings where slug=$1 and state='published' for update`, [slug]);
    const w = wedding.rows[0];
    if (!w) throw notFound("This wedding is not accepting replies.");
    if (w.rsvp_deadline && new Date(w.rsvp_deadline).getTime() < Date.now() && !w.allow_changes_after_deadline)
      throw new AppError(403, "deadline_passed", "Replies have closed. Please contact the couple.");
    if (input.eventId) {
      const event = await q.query(`select 1 from wedding_events where wedding_id=$1 and id=$2 and visibility='everyone'`, [w.id, input.eventId]);
      if (!event.rowCount) throw bad("This event requires a personal invitation link.");
    } else {
      const events = await q.query(`select 1 from wedding_events where wedding_id=$1 limit 1`, [w.id]);
      if (events.rowCount) throw bad("Choose a public event to reply to.");
    }
    await q.query(`insert into public_rsvps(wedding_id,event_id,name,email,status,note) values($1,$2,$3,$4,$5,$6)`,
      [w.id, input.eventId, input.name, input.email.toLowerCase(), input.status, input.note || null]);
    return { ok: true, unverified: true };
  });
}

export async function publicReplySummary(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const rows = await db.query(`select p.id, p.name, p.email, p.status, p.note, p.created_at, e.title as event_title
    from public_rsvps p left join wedding_events e on e.id=p.event_id where p.wedding_id=$1 order by p.created_at desc limit 500`, [weddingId]);
  return rows.rows;
}
