import { z } from "zod";
import { decryptToken, sha256 } from "./crypto";
import { getDb } from "./db";
import { AppError, bad } from "./errors";
import { assertOwner } from "./weddings";

const Selection = z.array(z.string().uuid()).min(1).max(25).refine((ids) => new Set(ids).size === ids.length);
type Mail = { id: string; token: string; to: string; household: string };

export async function sendInvitationEmails(ownerId: string, weddingId: string, selected: unknown, appOrigin: string) {
  const ids = Selection.safeParse(selected);
  if (!ids.success) throw bad("Select 1–25 different households.");
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new AppError(503, "email_not_configured", "Automated email isn't connected yet.");
  const origin = new URL(appOrigin).origin;
  const db = await getDb();
  await assertOwner(db, ownerId, weddingId);
  const pending = await db.tx(async (q) => {
    const w = await q.query(`select state from weddings where id=$1 and owner_user_id=$2`, [weddingId, ownerId]);
    if (w.rows[0]?.state !== "published") throw bad("Publish your invitation before sending emails.");
    const messages: Mail[] = [];
    for (const hid of ids.data) {
      const hs = await q.query<{name:string; token_enc:string}>(
        `select h.display_name name,i.token_enc from households h join invitations i
         on i.household_id=h.id and i.wedding_id=h.wedding_id and i.revoked_at is null
         where h.id=$1 and h.wedding_id=$2 and (i.expires_at is null or i.expires_at>now())
         for update of h`, [hid, weddingId]);
      if (!hs.rowCount) throw bad("A selected household has no active link. Refresh and try again.");
      const h = hs.rows[0];
      const addresses = await q.query<{email:string}>(`select distinct lower(trim(email)) email from guests
        where wedding_id=$1 and household_id=$2 and email is not null and trim(email)<>''`, [weddingId, hid]);
      if (!addresses.rowCount) throw bad(`“${h.name}” has no email address. Add one or share manually.`);
      for (const { email } of addresses.rows) {
        const logicalKey = sha256(`invite-email:v1:${h.token_enc}:${email}`);
        const created = await q.query<{id:string}>(`insert into message_deliveries
          (wedding_id,household_id,channel,category,recipient,state,provider,delivery_key)
          values($1,$2,'email','invitation',$3,'queued','resend',$4)
          on conflict do nothing returning id`, [weddingId, hid, email, logicalKey]);
        if (created.rowCount) messages.push({ id: created.rows[0].id, token: decryptToken(h.token_enc), to: email, household: h.name });
      }
    }
    if (messages.length > 25) throw bad("Send up to 25 recipients at once. Select fewer households.");
    return messages;
  });
  let accepted = 0, failed = 0;
  for (const msg of pending) {
    const claim = await db.query(`update message_deliveries set state='sending',attempts=attempts+1
      where id=$1 and wedding_id=$2 and state='queued' returning id`, [msg.id, weddingId]);
    if (!claim.rowCount) continue;
    const active = await db.query(`select 1 from invitations where wedding_id=$1 and token_digest=$2
      and revoked_at is null and (expires_at is null or expires_at>now())`, [weddingId, sha256(msg.token)]);
    if (!active.rowCount) {
      await db.query(`update message_deliveries set state='cancelled' where id=$1`, [msg.id]);
      continue;
    }
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST", signal: AbortSignal.timeout(12000),
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `wedsent-invite-${msg.id}` },
        body: JSON.stringify({ from, to: [msg.to], subject: `You're invited — ${msg.household}`,
          text: `You're invited to a wedding celebration. Open your personal invitation and reply:\n\n${origin}/r/${msg.token}\n\nThis invitation is intended for your household. Please don't forward your private link.` }),
      });
      if (!response.ok) throw new Error(`Provider returned ${response.status}`);
      const result = await response.json() as {id?:string};
      if (!result.id) throw new Error("Provider returned no message ID");
      await db.query(`update message_deliveries set state='sent',provider_message_id=$2,sent_at=now(),last_error=null where id=$1`, [msg.id, result.id]);
      accepted++;
    } catch (err) {
      await db.query(`update message_deliveries set state='failed',last_error=$2 where id=$1`,
        [msg.id, err instanceof Error ? err.message.slice(0,250) : "Provider error"]);
      failed++;
    }
  }
  return { queued: pending.length, accepted, failed, nothingNew: pending.length === 0 };
}
