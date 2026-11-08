import { getDb } from "./db";
import { assertOwner } from "./weddings";
import { audit } from "./audit";
import { AppError, bad, notFound } from "./errors";

export const MAX_MUSIC_BYTES = 8_000_000;

/** Only MPEG Layer III files; extension and supplied content-type are not sufficient. */
export function isMp3(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return true; // ID3 tag
  return bytes[0] === 0xff && (bytes[1] & 0xfe) === 0xfa; // MPEG frame, Layer III
}

export async function saveMusic(userId: string, weddingId: string, bytes: Uint8Array, rightsConfirmed: boolean) {
  if (!rightsConfirmed) throw bad("Confirm you own or have permission to use this recording.");
  if (!bytes.length || !isMp3(bytes)) throw bad("Choose a valid MP3 audio file.");
  if (bytes.length > MAX_MUSIC_BYTES) throw new AppError(413, "too_large", "Use an MP3 smaller than 8 MB.");
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const n = await db.query<{ n: number }>("select count(*)::int n from music_assets where wedding_id=$1", [weddingId]);
  if (n.rows[0].n >= 8) throw new AppError(429, "music_limit", "You have reached the eight-track upload limit.");
  const r = await db.query<{ id: string }>("insert into music_assets(wedding_id,mime,bytes,data,rights_confirmed_at) values($1,'audio/mpeg',$2,$3,now()) returning id", [weddingId, bytes.length, Buffer.from(bytes)]);
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "music.uploaded", targetKind: "music", targetId: r.rows[0].id, metadata: { bytes: bytes.length } });
  return { id: r.rows[0].id, src: `/music/${r.rows[0].id}` };
}

/** The audio URL is intentionally shareable with anyone who can view the published invitation. */
export async function readMusic(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw notFound("Audio not found");
  const db = await getDb();
  const r = await db.query<{ data: Buffer }>("select data from music_assets where id=$1", [id]);
  if (!r.rowCount) throw notFound("Audio not found");
  return r.rows[0].data;
}
