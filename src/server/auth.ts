import { cookies } from "next/headers";
import { getDb, type Q } from "./db";
import { hashPassword, newToken, sha256, verifyPassword } from "./crypto";
import { AppError, bad } from "./errors";

const COOKIE = "wd_session";
const DAYS = 30;

export type User = { id: string; email: string };

export async function rateLimit(q: Q, key: string, max: number, windowSec: number) {
  const r = await q.query<{ count: number }>(
    `insert into rate_limits(key, count, window_start) values ($1, 1, now())
     on conflict (key) do update set
       count = case when rate_limits.window_start < now() - make_interval(secs => $2) then 1 else rate_limits.count + 1 end,
       window_start = case when rate_limits.window_start < now() - make_interval(secs => $2) then now() else rate_limits.window_start end
     returning count`,
    [key, windowSec],
  );
  if (r.rows[0].count > max) throw new AppError(429, "rate_limited", "Too many attempts. Wait a few minutes and try again.");
}

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;

export async function createSession(q: Q, userId: string) {
  const token = newToken(32);
  await q.query(`insert into sessions(user_id, token_digest, expires_at) values ($1,$2, now() + make_interval(days => $3))`, [userId, sha256(token), DAYS]);
  return token;
}

export async function signUp(emailRaw: string, password: string, ip = "unknown") {
  const email = emailRaw.trim().toLowerCase();
  if (!emailOk(email)) throw bad("Enter a valid email address.");
  if (password.length < 10) throw bad("Use at least 10 characters for your password.");
  const db = await getDb();
  await rateLimit(db, `signup:${ip}`, 10, 3600);
  const hash = await hashPassword(password);
  return db.tx(async (q) => {
    const exists = await q.query(`select 1 from users where email = $1`, [email]);
    if (exists.rowCount) throw new AppError(409, "email_taken", "An account with this email already exists. Sign in instead.");
    const u = await q.query<User>(`insert into users(email, password_hash) values ($1,$2) returning id, email`, [email, hash]);
    const token = await createSession(q, u.rows[0].id);
    return { user: u.rows[0], token };
  });
}

export async function signIn(emailRaw: string, password: string, ip = "unknown") {
  const email = emailRaw.trim().toLowerCase();
  const db = await getDb();
  await rateLimit(db, `login:${email}`, 8, 900);
  await rateLimit(db, `login-ip:${ip}`, 40, 900);
  const r = await db.query<User & { password_hash: string }>(`select id, email, password_hash from users where email = $1`, [email]);
  const row = r.rows[0];
  // Always run a hash comparison so response time does not reveal which emails exist.
  const ok = await verifyPassword(password, row?.password_hash ?? "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$AAAA");
  if (!row || !ok) throw new AppError(401, "bad_credentials", "Email or password is incorrect.");
  const token = await createSession(db, row.id);
  return { user: { id: row.id, email: row.email }, token };
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: DAYS * 86400 });
}
export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE);
}

export async function userFromToken(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  const db = await getDb();
  const r = await db.query<User>(
    `select u.id, u.email from sessions s join users u on u.id = s.user_id
     where s.token_digest = $1 and s.revoked_at is null and s.expires_at > now()`,
    [sha256(token)],
  );
  return r.rows[0] ?? null;
}

export async function currentUser(): Promise<User | null> {
  return userFromToken((await cookies()).get(COOKIE)?.value);
}
export async function requireUser(): Promise<User> {
  const u = await currentUser();
  if (!u) throw new AppError(401, "unauthenticated", "Sign in to continue.");
  return u;
}
export async function signOut() {
  const t = (await cookies()).get(COOKIE)?.value;
  if (t) await (await getDb()).query(`update sessions set revoked_at = now() where token_digest = $1`, [sha256(t)]);
  await clearSessionCookie();
}
