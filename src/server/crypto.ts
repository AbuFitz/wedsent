import { createCipheriv, createDecipheriv, createHash, randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(_scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const newToken = (bytes = 24) => randomBytes(bytes).toString("base64url");

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}
export async function verifyPassword(pw: string, stored: string) {
  const [alg, s, k] = stored.split("$");
  if (alg !== "scrypt" || !s || !k) return false;
  const key = await scrypt(pw, Buffer.from(s, "base64"), 64);
  const want = Buffer.from(k, "base64");
  return key.length === want.length && timingSafeEqual(key, want);
}

function secret() {
  const s = process.env.APP_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("APP_SECRET must be set in production");
  return createHash("sha256").update(s ?? "wedsent-dev-only-secret").digest();
}
/** Guest link tokens are looked up by digest but stored encrypted so hosts can re-copy links. */
export function encryptToken(t: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", secret(), iv);
  const enc = Buffer.concat([c.update(t, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64url")).join(".");
}
export function decryptToken(blob: string) {
  const [iv, tag, enc] = blob.split(".").map((p) => Buffer.from(p, "base64url"));
  const d = createDecipheriv("aes-256-gcm", secret(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}
