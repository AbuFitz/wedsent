import { getDb } from "./db";
import { assertOwner } from "./weddings";
import { audit } from "./audit";
import { AppError, bad, notFound } from "./errors";

const MAX = 2_500_000;
const MAX_PER_WEDDING = 40;

/** Identify the real image type from magic bytes. The declared Content-Type is never trusted. */
export function sniff(b: Uint8Array): "image/jpeg" | "image/png" | "image/webp" | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

export async function saveMedia(userId: string, weddingId: string, bytes: Uint8Array) {
  if (!bytes.length) throw bad("That file is empty.");
  if (bytes.length > MAX) throw new AppError(413, "too_large", "That photo is too large. Use one under 2.5 MB.");
  const mime = sniff(bytes);
  if (!mime) throw bad("Use a JPEG, PNG or WebP photo.");
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const n = (await db.query(`select count(*)::int n from media where wedding_id=$1`, [weddingId])).rows[0].n;
  if (n >= MAX_PER_WEDDING) throw new AppError(429, "media_limit", "You have reached the photo limit for this wedding. Delete one you no longer use.");
  const r = await db.query(`insert into media(wedding_id, mime, bytes, data) values ($1,$2,$3,$4) returning id`, [weddingId, mime, bytes.length, Buffer.from(bytes)]);
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "media.uploaded", targetKind: "media", targetId: r.rows[0].id, metadata: { bytes: bytes.length, mime } });
  return { id: r.rows[0].id as string, src: `/media/${r.rows[0].id}` };
}

/** Public by design: invitation photos are shown to guests. The id is an unguessable UUID. */
export async function readMedia(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw notFound("Not found");
  const db = await getDb();
  const r = await db.query(`select mime, data from media where id=$1`, [id]);
  if (!r.rowCount) throw notFound("Not found");
  return { mime: r.rows[0].mime as string, data: r.rows[0].data as Buffer };
}
