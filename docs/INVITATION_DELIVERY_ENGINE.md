# Invitation delivery engine — implementation and reliability contract

## Source-level research, 9 November 2026

This document distinguishes what is actually implemented from recommendations for the next vertical slices.

| Source | Code/contract examined | What Wedsent should adopt | Boundary |
| --- | --- | --- | --- |
| [OpenInvite](https://github.com/rayhe/open-invite), locally reviewed `functions/index.js` and `README.md` | Email send function, Resend email-ID lookup, signed webhook to guest delivery status | Persist provider message IDs and reconcile asynchronous delivery events | MIT repository; adapt approach, not its Firebase schema or presentation |
| [Guestroll](https://github.com/Depado/guestroll), locally reviewed `src/lib/mail/settings.ts`, `src/app/api/admin/mail/retry/route.ts` and `src/lib/webhooks/queue.ts` | Queue/retry operational separation and explicit unconfigured-provider states | No fake sent status; retry controls with bounded attempts | Research pattern; do not copy entire self-hosted mail architecture |
| [Resend email idempotency](https://resend.com/changelog/idempotency-keys/) | Provider accepts an idempotency key for 24 hours, with conflict states for changed payloads | Each **delivery attempt** gets a stable provider idempotency key; do not rely on 24-hour provider deduplication as the only safety mechanism | Primary API guidance; all provider calls must stay server-side |
| [Resend OpenAPI](https://github.com/resend/resend-openapi/blob/main/resend.yaml) | Batch send and webhook endpoints, signed event headers | Verify signatures, store provider message IDs, reconcile status in transactions | Payload/event shapes must be confirmed during integration |
| [WhatsApp Business Policy](https://whatsappbusiness.com/policy/) | Opt-in and approved business-initiated templates | Keep native owner-driven sharing as launch default; automated WhatsApp is a separate opt-in integration | Do not imply native share yields recipient or delivered status |

## As-built today

- Published `/w/:slug` public invitation, `/r/:token` household-specific capability link.
- Household RSVPs are permission-scoped per person and event. Public-link submissions remain unverified and cannot create restricted-event entitlements.
- `message_deliveries` in `005_operations.sql` stores channel, category, recipient, state, attempts, provider ID, sent and delivered timestamps.
- `GET /api/wedding/deliveries` returns at most 250 recent records, owner-only; dashboard Sending tab displays them. A native share does not generate a delivery row.
- Cross-tenant API service test confirms owner-only read, empty state and queued-vs-sent distinction.
- Owner-selected `POST /api/wedding/deliveries/send` now reserves distinct email deliveries per active invitation and recipient, rechecks the link before sending, and records Resend acceptance or failure. The UI hides this action without provider keys. This is synchronous and bounded, not a background worker or a verified delivery/bounce integration.

## Next implementation slices and correctness conditions

### A. Transactional email invitation queue

1. Require a published wedding and active household invitation. A household's link must be resolved from its current token at send time, not cached when the message was queued.
2. Only explicit recipient emails from that household are eligible. Canonicalise and deduplicate within the household and the selected batch. Never silently email everyone when no household IDs are selected.
3. An authenticated owner queues a bounded batch. Within a transaction, reserve immutable delivery rows with a unique logical send key (wedding + invitation generation + recipient + category), preventing repeated clicks from duplicating queued invitations.
4. Work is processed in limited batches by a server-only worker; secrets stay out of React and query parameters. No successful API response means an email was delivered.
5. Provider sends use a stable idempotency key and a stored retry policy; ambiguous network failure must be reconciled against provider ID rather than blindly resent.
6. A revoked invitation is cancelled before sending. Venue or date updates should target only relevant guest/event recipients and require a separate send action.

### B. Webhook reconciliation

1. Verify the provider's signed raw request and reject missing/invalid signatures before touching the database.
2. Deduplicate webhook event IDs and match provider message ID against the wedding-scoped delivery record.
3. Accept legal forward state transitions only. Webhooks can arrive out of order; a late `sent` must not downgrade `delivered` or `failed`.
4. Store bounce/complaint outcomes without exposing detailed provider error strings to guests.
5. Delivery history belongs to the owner; access to `/r/:token` must never include recipient emails, webhook IDs or provider credentials.

### C. Reminders

- Only pending people for their invited events are candidates. Do not send to everyone in a household because one person has not replied.
- Require explicit host action or a configured reminder schedule; respect cutoffs, dedupe windows, opt-outs and cancellation.
- A native WhatsApp share or mailto draft is **not** a send event; the dashboard should say "shared externally / delivery unverified" only if the owner explicitly records that action.

### D. Open sharing

- Self-identified public replies are separate from named entitlements. Names alone do not authenticate identity.
- Couple can review, reject or reconcile public replies against existing guests; reconciliation is audited and must never silently allocate restricted places.
- A household link is a bearer capability; guests should not need a Wedsent account, but links must remain rotatable and private.

## Verification gate before calling automated sending live

Run a real provider test against a verified sending domain: one household, multiple emails, duplicate click, missing address, revoked token, timeout retry, bounce, duplicate/out-of-order signed webhooks, wrong-owner access, changed ceremony, and a guest RSVP visible in the owner dashboard. Capture actual mobile screenshots and browser results separately from automated unit tests.

**Known external dependencies:** verified sending domain, Resend send key, Resend webhook signing secret, server-only worker/cron secret. Until these exist, automated delivery is not live.
