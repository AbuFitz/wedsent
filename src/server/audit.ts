import type { Q } from "./db";
export async function audit(q: Q, e: { weddingId?: string; actor: "owner" | "guest" | "system" | "operator"; actorId?: string; action: string; targetKind?: string; targetId?: string; metadata?: object }) {
  await q.query(
    `insert into audit_events(wedding_id, actor_kind, actor_id, action, target_kind, target_id, metadata) values ($1,$2,$3,$4,$5,$6,$7)`,
    [e.weddingId ?? null, e.actor, e.actorId ?? null, e.action, e.targetKind ?? null, e.targetId ?? null, e.metadata ?? {}],
  );
}
