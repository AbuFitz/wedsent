import { getDb } from "./db";
import { assertOwner } from "./weddings";

/** Delivery history is intentionally owner-only. External WhatsApp share actions do not create a 'sent' record. */
export async function listDeliveries(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const { rows } = await db.query<{
    id: string; household_id: string | null; household_name: string | null;
    channel: "email" | "whatsapp"; category: string; recipient: string;
    state: string; attempts: number; created_at: string;
    sent_at: string | null; delivered_at: string | null;
  }>(`select d.id, d.household_id, h.display_name as household_name,
        d.channel, d.category, d.recipient, d.state, d.attempts,
        d.created_at, d.sent_at, d.delivered_at
      from message_deliveries d
      left join households h on h.id=d.household_id and h.wedding_id=d.wedding_id
      where d.wedding_id=$1
      order by d.created_at desc, d.id desc limit 250`, [weddingId]);
  return rows.map((r) => ({
    id: r.id, householdId: r.household_id, householdName: r.household_name,
    channel: r.channel, category: r.category, recipient: r.recipient,
    state: r.state, attempts: r.attempts, createdAt: r.created_at,
    sentAt: r.sent_at, deliveredAt: r.delivered_at,
  }));
}
