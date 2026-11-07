import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";

export type Row = Record<string, any>;
export interface Q {
  /** Run one or more statements without parameters (migrations). */
  exec(sql: string): Promise<void>;
  query<T = Row>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>;
}
export interface Db extends Q {
  tx<T>(fn: (q: Q) => Promise<T>): Promise<T>;
  kind: "pg" | "pglite";
}

const globalForDb = globalThis as unknown as { __wedsentDb?: Promise<Db> };

async function migrate(db: Db) {
  await db.query(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);
  const dir = path.join(process.cwd(), "db", "migrations");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    const done = await db.query(`select 1 from schema_migrations where name = $1`, [f]);
    if (done.rowCount) continue;
    await db.tx(async (q) => {
      await q.exec(readFileSync(path.join(dir, f), "utf8"));
      await q.query(`insert into schema_migrations(name) values ($1)`, [f]);
    });
  }
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url, max: 5, ssl: url.includes("localhost") ? undefined : { rejectUnauthorized: false } });
    const db: Db = {
      kind: "pg",
      exec: async (sql) => { await pool.query(sql); },
      query: async (sql, params) => {
        const r = await pool.query(sql, params as any[]);
        return { rows: r.rows, rowCount: r.rowCount ?? 0 };
      },
      tx: async (fn) => {
        const c = await pool.connect();
        try {
          await c.query("begin");
          const r = await fn({
            exec: async (sql) => { await c.query(sql); },
            query: async (sql, params) => {
              const x = await c.query(sql, params as any[]);
              return { rows: x.rows, rowCount: x.rowCount ?? 0 };
            },
          });
          await c.query("commit");
          return r;
        } catch (e) {
          await c.query("rollback").catch(() => {});
          throw e;
        } finally {
          c.release();
        }
      },
    };
    await migrate(db);
    return db;
  }
  // Local development and tests: embedded Postgres (WASM). Never used when DATABASE_URL is set.
  const { PGlite } = await import("@electric-sql/pglite");
  let dataDir: string | undefined;
  if (process.env.WEDSENT_PGLITE !== "memory" && process.env.NODE_ENV !== "production") {
    dataDir = path.join(process.cwd(), ".data", "pglite");
    mkdirSync(path.dirname(dataDir), { recursive: true });
  }
  const lite = new PGlite(dataDir);
  const wrap = (c: { query: Function; exec: Function }): Q => ({
    exec: async (sql) => { await c.exec(sql); },
    query: async (sql, params) => {
      const r = await c.query(sql, params as any[]);
      return { rows: r.rows as any, rowCount: r.rows.length || r.affectedRows || 0 };
    },
  });
  const db: Db = {
    kind: "pglite",
    exec: wrap(lite).exec,
    query: wrap(lite).query,
    tx: (fn) => lite.transaction((t) => fn(wrap(t))),
  };
  await migrate(db);
  return db;
}

export function getDb(): Promise<Db> {
  return (globalForDb.__wedsentDb ??= connect());
}

/** True when a durable database is configured (or we are in local dev). */
export function hasDurableDb() {
  return !!process.env.DATABASE_URL || process.env.NODE_ENV !== "production";
}
