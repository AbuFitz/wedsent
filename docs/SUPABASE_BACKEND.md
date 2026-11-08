# Wedsent backend — Supabase

## Connected database

- Supabase project: `stqjxkcgepejozskyhdu` (London / `eu-west-2`).
- Existing application migrations `001_init.sql` through `004_public_rsvp.sql` and `004_music_library.sql` have been applied to the project.
- Operational migration `005_operations.sql` is applied: staff, admission credentials, guest check-ins, scan attempts, delivery tracking, payment orders and webhook-event idempotency.
- Every public table has RLS enabled. `anon` and `authenticated` have no table privileges or policies: this app uses the server's existing first-party session authentication and parameterised database queries. Never use a Supabase publishable/anon key as a substitute for the server database credential.

## Deployment setup required

Configure the following **server-only** variables in the Wedsent Vercel project, for each environment that should serve authenticated functionality:

1. `DATABASE_URL` — Supabase **transaction pooler** Postgres connection URI from **Project → Connect → Transaction pooler**. Store only in Vercel secrets / environment variable settings, never in source control. In serverless production, this URI is preferable to a direct IPv6-only connection. Its actual password is not available through the Supabase project-management connector.
2. `APP_SECRET` — at least 32 random bytes of persistent secret material, shared across all deployments of a given environment. Changing it invalidates the ability to decrypt existing invitation links. Back up securely.
3. `REQUIRE_PAYMENT` — `true` only after a real signed provider webhook, order-to-entitlement transition and commercial configuration are implemented and tested. The table alone is not payment processing.

The backend intentionally returns `503 backend_not_configured` in production without `DATABASE_URL`, so it cannot silently save customer data in a temporary local database.

## Routes implemented

- `GET /api/wedding/passes`: owner-only listing with event, household, and scan count.
- `POST /api/wedding/passes`: issue a cryptographically random event-and-household credential: `{eventId, householdId}`. `{rotate:true}` revokes old active credentials and replaces them. The bearer token is returned only at issuance. Persist it securely in the QR or pass UI; it is not recoverable from the server.
- `GET /api/wedding/checkins?eventId=<uuid>`: owner-only attendance log, optionally scoped to an event.
- `POST /api/wedding/checkins`: `{eventId, token, guestIds:[...]}`. Validates pass scope, invitation, household and RSVP; supports split arrivals and reports `admitted`, `alreadyCheckedIn` and `rejected` separately. A unique `(event_id,guest_id)` index prevents double admission under concurrent scans.

These routes are backend primitives, **not** a completed staff scanner, wallet pass issuer, email sender or payment checkout. Staff roles, offline synchronisation, delivery providers, wallet signing certificates, and webhooks require separate implementation before being marketed as working.
