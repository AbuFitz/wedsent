# Status — 2026-11-07

Legend: **Working** = exercised by automated tests or the browser e2e script in this repo. **Partial** = built but missing pieces. **Not built**.

## Working (real server + database)
- Accounts: sign up / sign in / sign out, scrypt password hashes, DB-backed sessions (digest only), login rate limits.
- Wedding draft with optimistic concurrency (`rev`); Studio autosaves to the account; a signed-out local draft is claimed on first sign-up.
- Publish: immutable versioned snapshots, stable slug, unchanged re-publish is a no-op, draft edits never go live implicitly.
- Events (visibility: invited-only or public), households, guests (children flagged), per-guest per-event invitations.
- Guest links: high-entropy token, digest lookup, encrypted-at-rest so the host can re-copy; reset/rotate kills the old link immediately; link views show only that household's invited events.
- RSVP: per-person per-event answers, versioned, history table, idempotency keys, deadline policy (host can still correct after the deadline), host manual entry, in-transaction revocation re-check.
- Host dashboard: counts of people per event (attending / declined / no reply / invited), CSV import with review and duplicate detection, CSV export with formula-injection guard.
- Tests: `npm test` (22 backend tests on embedded Postgres), `tests/e2e/flow.mjs` (browser, 12 checks).

## Partial
- Studio: 3 designs, 4 tabs. One event only inside the invitation content; multi-event editing lives in the dashboard.
- Guest page: opens, shows design, reply flow works; not yet showing the per-event schedule inside the invitation.
- Printing: A5 browser-print layout only.
- Deployment: see below.

## Not built
- Payments (needs price decision D01 and Stripe keys). `REQUIRE_PAYMENT=true` already gates publishing on an `entitlements` row.
- Email/reminders (needs a provider key). WhatsApp is a share link only, by design (D07).
- Email sign-in links and password reset (need email).
- Music, photo upload, Photo Hall, operator console, collaborators/roles, OG share images, custom domains, data-retention jobs.

## Needs owner input
1. **Database for deployments.** The app needs `DATABASE_URL` (Postgres). The only Supabase projects visible to this session belong to another product (onesimplesite). Choose: new dedicated Supabase project (may incur cost), or a schema in an existing one. Until set, the deployed site serves the marketing pages and the signed-out Studio only; account features return "backend not connected".
2. **Price and hosting term** (D01/D02), refund policy.
3. **Email provider** (Resend recommended) and sending domain.
4. **Framer**: keep everything in the Next.js app (recommended) or build marketing/pricing pages in Framer.
5. Domain/brand clearance (D13).
