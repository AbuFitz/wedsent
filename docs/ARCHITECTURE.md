# Wedsent architecture — initial contracts

## Core stance

One coherent Next.js/TypeScript application with modular domain boundaries, PostgreSQL (e.g. managed Postgres), private object storage, scoped authentication and a background job provider for asynchronous media/email. Avoid stitching multiple SaaS clones into one runtime. Where external projects are studied, rewrite/adapt narrowly through stable interfaces and document licences.

## Logical modules

- `identity`: owners, collaborators, sessions, role grants, revocation.
- `weddings`: wedding settings, time zone, locale, publication status, ownership.
- `events`: ceremonies/functions, time, venue, schedule, invited audience.
- `studio`: template catalogue, versioned appearance/content schema, draft, preview, history.
- `publishing`: slug/link resolution, live version, caching, share-card renderer.
- `guests`: people, households, invitations, allocations, token capabilities.
- `rsvp`: per-person per-event attendance and optional answers, response history, deadline policy.
- `comms`: templates, transactional email, delivery log, reminder jobs and opt-outs.
- `commerce`: one-time purchase, webhooks, idempotency, entitlements, refunds.
- `media`: images, crops, audio catalogue, derived assets, licence metadata.
- `photo-hall`: separate feature/entitlement, upload session, staging, moderation, albums, downloads, retention.
- `operator`: scoped support diagnostics, issue log, audit trail, takedown workflows.

## Schema sketch (Postgres)

- `users(id, email, created_at)`
- `weddings(id, owner_user_id, slug, title, timezone, locale, state, published_version_id, rsvp_deadline, created_at)`
- `wedding_members(wedding_id, user_id, role, invited_at, revoked_at)`
- `wedding_events(id, wedding_id, title, event_type, starts_at, ends_at, venue_id, visibility, sort_order)`
- `venues(id, wedding_id, name, address, maps_url, notes)`
- `design_templates(id, version, family, layout_spec, token_spec, availability)`
- `wedding_design_versions(id, wedding_id, template_id, template_version, content_json, appearance_json, state, created_at)`
- `households(id, wedding_id, display_name, contact_preference)`
- `guests(id, wedding_id, household_id, display_name, contact_email, contact_phone, is_child, status)`
- `invitations(id, wedding_id, household_id, mode, token_digest, issued_at, revoked_at, expires_at)`
- `event_invitees(event_id, guest_id, invitation_id, plus_one_policy, max_extra_guests)`
- `event_responses(id, event_id, guest_id, attending_status, response_at, response_source, version)`
- `response_answers(id, response_id, question_id, answer_json)`
- `guest_questions(id, wedding_id, event_id, prompt, input_kind, required, data_classification)`
- `delivery_events(id, wedding_id, invitation_id, channel, provider_id, state, timestamp)`
- `payments(id, wedding_id, provider, external_id, amount_minor, currency, status)`
- `media_assets(id, wedding_id, storage_key, kind, bytes, metadata_json, rights_status, created_at)`
- `photo_halls(id, wedding_id, state, access_policy, approval_mode, upload_deadline, retention_until)`
- `photo_submissions(id, hall_id, media_asset_id, uploaded_by_kind, uploaded_by_ref, moderation_state, reviewed_by, reviewed_at)`
- `audit_events(id, wedding_id, actor_kind, actor_id, action, target_kind, target_id, timestamp, metadata_json)`

These are domain contracts, not finalized migrations. Foreign keys, uniqueness, check constraints, indexes, row-level security, encryption decisions, token lifecycle and data subject request processing need formal implementation before release.

## RSVP correctness invariants

1. A person can have at most one current answer per event (unique event_id + guest_id); append history for change tracking.
2. An invitation represents a delivery/access unit. It does **not** represent a person or attendee count.
3. Guest identities are wedding-scoped. All queries must enforce tenant scoping in both server logic and database policy.
4. Attendance is per event, and 'no response' is different from 'declined'.
5. Plus-ones are either explicit guest records or counted provisional slots with a defined conversion rule; no arbitrary free-text count that breaches allocation.
6. Changes after deadline follow configurable host policy and have an audit trail.
7. Private token values are high entropy, hashed at rest, revocable, and are never included in social preview metadata.
8. Avoid putting identifying guest data into analytics events, cached public HTML, or client-visible admin payloads.
9. API writes are idempotent and concurrency-safe; double submission cannot double-count attendance.

## Invitation design contract

`WeddingDesign = { schemaVersion, templateId, templateVersion, content, appearance, media, sectionOrder, motion, audio }`

- Template renderer is a pure, deterministic mapping from validated design data to public invitation UI.
- No arbitrary CSS or HTML from public customers. Slots and token ranges are constrained by template rules.
- Content is separate from template and persists when switching looks.
- Published version is immutable; edits create a draft that can publish atomically.
- Preview fixtures include empty image, ultra-long names, Arabic RTL, mixed English/Arabic, 300+ guest lists (dashboard), low-end mobile, offline/error and reduced motion.
- Static OG cards use safe non-private event metadata. Personal salutation is fetched through authenticated token navigation, not OG previews.

## Services/integrations

- Stripe Checkout or equivalent for one-time payment; verify webhook signatures and event idempotency before granting publish entitlement.
- Resend/React Email or equivalent for transactional email; do not promise delivery until provider confirms and log bounces.
- Storage: private originals, derived thumbnails, short-lived signed download URLs; sanitize metadata/EXIF on guest-facing derivatives.
- Music: curated and commercially cleared catalogue, explicit play/mute, licence records and rights restrictions.
- Maps: external directions link in MVP; avoid unnecessary geocoding dependencies.
- WhatsApp: native share intent in MVP; no unofficial automation or scraping. Business API later only with consent, templates and explicit cost model.

## Photo Hall security and operations

- Distinct photographer, guest-uploader, moderator and viewer capabilities; none inherit wedding-edit permissions.
- Presigned upload intents with type/size limits, malware scanning, quota and rate limits.
- Upload -> quarantine -> metadata scrub/transcode/thumbnail -> moderation -> approved album.
- Unapproved media must never be viewable via predictable public storage URLs.
- Bulk photographer ingestion supports resumability and checksums; ownership and download rights explicitly recorded.
- The couple controls release; one-button 'publish selected' and 'notify guests' are separate actions.
- Support takedown requests, legal holds when required, retention/deletion jobs and an export route.
- If future opt-in face search is considered, do a separate privacy/legal review; it is excluded from baseline.

## Studio layout principles

Desktop: thin global shell + calm left section nav + central context editor + large right preview. Mobile: full-width preview with switchable sheet, no sidebars forced into a tiny viewport. Minimal dashboard cards; exception-driven guest list and practical next actions.

## Build sequence

P01 repository scaffold, conventions, CI and test harness
P02 data model + tenant access + auth
P03 template schema + three art-directed designs and preview
P04 studio setup/edit/publish lifecycle
P05 households, invitations, RSVP, event counts, exports
P06 media/audio/assets and OG rendering
P07 one-off checkout, email, share and reminders
P08 privacy, performance, accessibility, security and real-user pilot
P09 optional photo hall after invitation MVP is stable

Do not claim a packet is done until end-to-end browser/API/data tests prove it.
