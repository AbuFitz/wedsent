# Backend v1 — as built

## Stack and decisions
- Next.js 16 route handlers + server modules in `src/server/`. One app, one database. No microservices.
- **Postgres via `pg`** when `DATABASE_URL` is set (works with Supabase/Neon/any). **Embedded Postgres (PGlite)** when it is not, in dev and tests only; in production without `DATABASE_URL` every API returns `503 backend_not_configured` rather than silently using ephemeral storage.
- Plain SQL migrations in `db/migrations/`, applied on first connection and recorded in `schema_migrations`.
- Own auth (not a vendor): keeps one data store, no extra service. Magic links and reset need email, so they are deferred.
- Zod validates every write. Errors are `{error:{code,message,details}}` with stable codes.
- CSRF: cookies are `HttpOnly; SameSite=Lax; Secure` in production; writes also reject a mismatching `Origin`.

## Schema (see `db/migrations/001_init.sql`)
users, sessions, weddings, design_versions (one mutable draft + immutable published snapshots), wedding_events, households, guests, invitations, event_invitees, event_responses, response_history, audit_events, idempotency_keys, rate_limits, entitlements.
- Every wedding-owned row carries `wedding_id`; composite foreign keys (`(wedding_id, id)`) make cross-tenant references impossible at the database level.
- `event_responses` is unique per `(event_id, guest_id)` and can only reference an existing `event_invitees` row, so "answered an event they were not invited to" cannot exist.
- No row = no reply; `declined` is an explicit answer.
- Row-level security is **not** used (single server role); isolation is enforced by owner checks in every service function plus the composite keys. Revisit if Supabase client access is ever exposed.

## Guest link model
`token = 24 random bytes (base64url)`. DB stores `sha256(token)` for lookup and `AES-256-GCM(token)` (key from `APP_SECRET`) so hosts can re-copy links. One active invitation per household (partial unique index). Reset revokes and mints a new one in a transaction. Link pages set `noindex`, `no-referrer`, and contain no guest or couple data in server HTML.

## RSVP rules implemented
Transactional, `SELECT … FOR UPDATE` on the invitation (re-validates revocation inside the transaction), idempotency key per submission, per-answer `version` for stale detection, history row only when an answer actually changes, deadline enforced server-side with a host override path, all writes audited.

## API (all JSON, cookie session unless stated)
`POST /api/auth/{signup,login,logout}`, `GET /api/me`, `GET|PUT /api/wedding`, `POST /api/wedding/publish`, `GET|POST /api/wedding/events`, `DELETE /api/wedding/events/:id`, `GET|POST /api/wedding/households`, `PATCH|DELETE /api/wedding/households/:id`, `POST …/:id/rotate`, `POST /api/wedding/import`, `GET /api/wedding/rsvps[?format=csv]`, `POST /api/wedding/responses`, `PUT /api/wedding/policy`; public: `GET /api/w/:slug`, `GET /api/r/:token`, `POST /api/r/:token/respond` (rate limited).

## Tests
`npm test` runs `tests/platform.test.ts` against in-memory Postgres: auth and rate limit, tenant isolation, stale draft, publish immutability and idempotency, public payload privacy, per-person counts, idempotent double submit, version conflict, cross-household/event attack attempts, Walima-only guests, rotation, revoke-vs-reply race, deadline policy, CSV import/export.
Browser e2e: `WEDSENT_PGLITE=memory next dev -p 3113` then `PW_PATH=<global playwright> node tests/e2e/flow.mjs http://localhost:3113 <outdir>`.
Not covered: true multi-connection concurrency (PGlite is single-connection; run the suite against a real Postgres with `DATABASE_URL` before launch), load, accessibility audits.

## Adaptation log (open-source research → decisions)
| Source | Licence | Decision | What we did |
| --- | --- | --- | --- |
| OpenInvite (rayhe) | MIT | ADAPT PATTERN | Per-guest bearer link + RSVP state model, re-done in Postgres with digest tokens, event scoping and transactions. No code copied. |
| PicPeak | MIT | ADAPT PATTERN (tests) | Revoke-vs-redeem race and token-event-binding tests reproduced for guest links. Gallery code not imported. |
| Guestroll | MIT | RESEARCH, for Photo Hall | Moderation-before-visible, per-event/IP limits, storage adapter boundary. Not started. |
| InviteKit | MIT | RESEARCH | Audit still pending (see SOURCE_CODE_AUDIT). |
| K-Invites, Attimo, Wedding RSVP, Convite, Eventdrop, Ente | restricted / unknown / AGPL | RESEARCH ONLY | Ideas only; nothing copied. |
| Motion | MIT | ADOPTED (dependency) | Animation engine for openings and UI. |
| Howler, React Email, Konva | MIT | PLANNED | Music, email templates, crop tooling — when those slices start. |
No third-party source has been copied into the repository. Dependencies added this slice: `pg`, `@electric-sql/pglite` (Apache-2.0), `zod`, `vitest`, `tsx` (dev).

## Next backend slices
1. Real Postgres run + deploy once `DATABASE_URL` exists. 2. Stripe Checkout + webhook (idempotent entitlement) after D01. 3. Resend + reminders queue + bounce webhook. 4. Media (invitation photos) with private storage. 5. Music catalogue. 6. Photo Hall (R4).
