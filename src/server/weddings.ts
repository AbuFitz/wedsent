import { z } from "zod";
import { DESIGN_IDS } from "@/engine/registry";
import { getDb, type Q } from "./db";
import { AppError, bad, conflict, forbidden, notFound } from "./errors";
import { audit } from "./audit";

export const ContentSchema = z.object({
  names: z.string().trim().max(60),
  occasion: z.string().trim().max(30),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
  time: z.string().regex(/^\d{2}:\d{2}$/).or(z.literal("")),
  venue: z.string().trim().max(80),
  city: z.string().trim().max(80),
  message: z.string().max(300),
  dress: z.string().trim().max(80),
  rsvpBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).or(z.literal("")),
  address: z.string().trim().max(160).default(""),
  photo: z.object({
    // Only server-held media or bundled library art. Never data: URLs or third-party hosts.
    src: z.string().regex(/^(\/media\/[0-9a-f-]{36}|\/art\/[a-z0-9-]+\.(webp|jpg))$/),
    fx: z.number().min(0).max(100),
    fy: z.number().min(0).max(100),
  }).nullable().default(null),
  design: z.enum(DESIGN_IDS),
  palette: z.string().max(30).default(""),
  type: z.string().max(30).default(""),
  intro: z.string().max(120).default(""),
});
export type Content = z.infer<typeof ContentSchema>;

export async function assertOwner(q: Q, userId: string, weddingId: string) {
  const r = await q.query(`select 1 from weddings where id = $1 and owner_user_id = $2`, [weddingId, userId]);
  if (!r.rowCount) throw notFound("Wedding not found"); // do not reveal other tenants' ids exist
}

export async function getOrCreateWedding(userId: string, seed: Content) {
  const db = await getDb();
  return db.tx(async (q) => {
    const ex = await q.query<{ id: string }>(`select id from weddings where owner_user_id = $1 order by created_at limit 1`, [userId]);
    if (ex.rowCount) return ex.rows[0].id;
    const w = await q.query<{ id: string }>(`insert into weddings(owner_user_id) values ($1) returning id`, [userId]);
    await q.query(`insert into design_versions(wedding_id, state, version, content) values ($1,'draft',0,$2)`, [w.rows[0].id, seed]);
    await audit(q, { weddingId: w.rows[0].id, actor: "owner", actorId: userId, action: "wedding.created" });
    return w.rows[0].id;
  });
}

export async function getDraft(userId: string, weddingId: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const w = await db.query(`select id, slug, state, rsvp_deadline, allow_changes_after_deadline, published_version_id from weddings where id=$1`, [weddingId]);
  const d = await db.query(`select rev, content from design_versions where wedding_id=$1 and state='draft'`, [weddingId]);
  return { wedding: w.rows[0], rev: d.rows[0].rev as number, content: d.rows[0].content as Content };
}

/** Optimistic concurrency: caller supplies the rev it last saw. */
export async function saveDraft(userId: string, weddingId: string, content: unknown, expectedRev: number) {
  const parsed = ContentSchema.safeParse(content);
  if (!parsed.success) throw bad("Some details are not valid.", parsed.error.flatten());
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  const r = await db.query<{ rev: number }>(
    `update design_versions set content=$3, rev = rev + 1 where wedding_id=$1 and state='draft' and rev=$2 returning rev`,
    [weddingId, expectedRev, parsed.data],
  );
  if (!r.rowCount) {
    const cur = await db.query(`select rev, content from design_versions where wedding_id=$1 and state='draft'`, [weddingId]);
    throw conflict("stale_draft", "This invitation changed somewhere else. Reload to see the latest version.", { rev: cur.rows[0].rev, content: cur.rows[0].content });
  }
  await db.query(`update weddings set updated_at = now() where id=$1`, [weddingId]);
  return { rev: r.rows[0].rev };
}

const RESERVED = new Set(["admin", "api", "app", "studio", "invite", "login", "signin", "signup", "w", "r", "www", "help", "pricing"]);
export function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export async function checkPublishReady(content: Content) {
  const problems: string[] = [];
  if (!content.names.trim()) problems.push("Add your names.");
  if (!content.date) problems.push("Choose the date.");
  if (!content.venue.trim()) problems.push("Add the venue.");
  return problems;
}

/** Atomically snapshot the draft as an immutable published version. Idempotent per draft rev. */
export async function publish(userId: string, weddingId: string, slugWanted?: string) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  return db.tx(async (q) => {
    await q.query(`select id from weddings where id=$1 for update`, [weddingId]);
    const w = (await q.query(`select slug, state from weddings where id=$1`, [weddingId])).rows[0];
    const d = (await q.query(`select rev, content from design_versions where wedding_id=$1 and state='draft'`, [weddingId])).rows[0];
    const problems = await checkPublishReady(d.content);
    if (problems.length) throw new AppError(422, "not_ready", "Finish these before publishing.", problems);
    if (process.env.REQUIRE_PAYMENT === "true") {
      const e = await q.query(`select 1 from entitlements where wedding_id=$1 and kind='publish'`, [weddingId]);
      if (!e.rowCount) throw new AppError(402, "payment_required", "Publishing needs a completed payment.");
    }
    let slug: string = w.slug;
    if (!slug) {
      slug = slugify(slugWanted || d.content.names || "wedding");
      if (slug.length < 3 || RESERVED.has(slug)) slug = `${slug || "our"}-wedding`.slice(0, 48);
      for (let i = 0; i < 6; i++) {
        const cand = i === 0 ? slug : `${slug.slice(0, 40)}-${Math.random().toString(36).slice(2, 6)}`;
        const taken = await q.query(`select 1 from weddings where slug=$1`, [cand]);
        if (!taken.rowCount) { slug = cand; break; }
        if (i === 5) throw conflict("slug_taken", "Try a different link name.");
      }
    }
    const last = (await q.query(`select coalesce(max(version),0) v from design_versions where wedding_id=$1 and state='published'`, [weddingId])).rows[0].v as number;
    const prev = last ? (await q.query(`select content from design_versions where wedding_id=$1 and state='published' and version=$2`, [weddingId, last])).rows[0] : null;
    let versionId: string;
    if (prev && JSON.stringify(prev.content) === JSON.stringify(d.content)) {
      versionId = (await q.query(`select id from design_versions where wedding_id=$1 and state='published' and version=$2`, [weddingId, last])).rows[0].id;
    } else {
      versionId = (await q.query(`insert into design_versions(wedding_id,state,version,content) values ($1,'published',$2,$3) returning id`, [weddingId, last + 1, d.content])).rows[0].id;
    }
    await q.query(`update weddings set slug=$2, state='published', published_version_id=$3, updated_at=now() where id=$1`, [weddingId, slug, versionId]);
    await audit(q, { weddingId, actor: "owner", actorId: userId, action: "wedding.published", targetKind: "design_version", targetId: versionId });
    return { slug, versionId };
  });
}

export async function getPublishedBySlug(slug: string) {
  const db = await getDb();
  const r = await db.query(
    `select w.id, w.slug, v.content from weddings w join design_versions v on v.id = w.published_version_id
     where w.slug = $1 and w.state = 'published'`,
    [slug.toLowerCase()],
  );
  if (!r.rowCount) return null;
  // Public payload: design content only. Never guests, tokens or events marked invited-only.
  const events = await db.query(`select id, title, to_char(starts_on,'YYYY-MM-DD') as "startsOn", to_char(starts_at_local,'HH24:MI') as "startsAt", venue, address, city from wedding_events where wedding_id=$1 and visibility='everyone' order by starts_on nulls last, starts_at_local nulls last, sort_order`, [r.rows[0].id]);
  return { slug: r.rows[0].slug as string, content: r.rows[0].content as Content, events: events.rows };
}

export async function setDeadlinePolicy(userId: string, weddingId: string, deadline: string | null, allowAfter: boolean) {
  const db = await getDb();
  await assertOwner(db, userId, weddingId);
  await db.query(`update weddings set rsvp_deadline=$2, allow_changes_after_deadline=$3 where id=$1`, [weddingId, deadline, allowAfter]);
  await audit(db, { weddingId, actor: "owner", actorId: userId, action: "rsvp.policy_changed", metadata: { deadline, allowAfter } });
}

export { forbidden };
