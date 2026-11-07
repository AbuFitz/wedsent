# Wedsent decision register and release evidence

**Rule:** Unresolved commercial, rights, privacy and integration decisions are visible. Do not silently invent policy. Continue other implementation work unless a decision truly blocks that slice.

## Commercial / operating decisions

| ID | Decision | Current provisional direction | Gate / owner decision needed |
| --- | --- | --- | --- |
| D01 | Flat one-off price | One price; prior research floated £49, **not approved** | Validate market/willingness-to-pay, payment fees, refund policy and VAT handling before charging |
| D02 | Hosting duration | Fixed published period + transparent expiry/export window | Decide exact term; test cost envelope and guest access after expiry |
| D03 | Guest/event limit | Fair usage but avoid surprise per-guest charges | Load test and abuse budget before declaring unlimited |
| D04 | Photo Hall inclusion | Separate optional post-wedding module; not core launch dependency | Pilot with photographer; define storage, egress, retention and cost/price fit |
| D05 | Music | Curated commercial-rights-cleared library, optional mute/play | Secure track sync/use/distribution licences; no unrestricted popular-song upload promise |
| D06 | Photos and client uploads | Private storage, terms grant only necessary service permission | Photographer distribution rights, takedown and consent policy |
| D07 | WhatsApp communication | Native share intent at launch; no automated sends | Official Business API + opt-in/provider budget if later offered |
| D08 | Private invitation links | Capability based, revocable, event-scoped; host chooses public/private | Define forwarded-link recovery and household change policy |
| D09 | Guest retention | Minimal data, scheduled deletion/export | Define periods, lawful basis, privacy notice and deletion request workflow with legal review |
| D10 | AI designer | Optional future assist; core flow works without AI | Rights, output QA, image safety, costs, disclosure and human override |
| D11 | Culture and language | Opt-in labels, ceremonies and bilingual content; never auto-assume | Validate samples with real couples across traditions; localisation pipeline |
| D12 | Operator access | Scoped support with audit, time-limited elevation if needed | Sensitive data access policy; zero silent staff impersonation |
| D13 | Domain and brand clearance | Wedsent selected as working name | Trademark/domain search and brand rights before paid public launch |

**Legal/compliance note:** UK GDPR, PECR, consumer rules and photography/music rights require targeted legal review. This file is an engineering decision map, not legal advice.

## Release tiers

### R0 — continuously deployable creative preview (current baseline)

- Real marketing routes, 3 preliminary skins, live local editor and demo RSVP.
- Clearly say **preview/demo**. No ability to enter genuine guest lists or pay. The current work meets build smoke test, but not design approval.

### R1 — real private wedding creation

- Auth + owner/collaborator roles, real DB isolation, versioned draft and content schema, three approved differentiated designs.
- Wedding/events with validated venue/timezone, media ingestion and autosave recovery.
- Owner can close tab and return on another device to the same draft. No fake 'cloud saved' messages.
- Functional tests: create, edit, undo, switch design, long names, RTL, no photo, conflicts, unauthorized reads.

### R2 — live invitations and RSVP

- Publish states, secure guest/household tokens, event allocations, forwarded-link policy, RSVP/change/manual entry, per-event counts, CSV export.
- Test scenarios in `UX_SCREEN_CONTRACTS.md`, signed OG privacy, deadline behavior and idempotent concurrency.
- Human user test: couple sets up a multi-event wedding; two guests reply independently; host sees accurate event-specific counts.

### R3 — paid and operational

- Validated one-time price/term, Stripe Checkout + verified webhook, mail provider + event tracking/failed delivery, rate limits, operator audit and retention jobs.
- Test payment delays, webhooks reordered/replayed, failed emails, refunds, reschedule/cancel.
- Run privacy/security and performance audit, real-couple pilot before representing production-ready.

### R4 — Photo Hall pilot

- Scoped photographer/guest upload, quarantine, private moderation, approved viewing/download, rights and cost limits, export/deletion.
- F08–F10 plus upload-abuse, revocation race and high-volume media tests.

## Proof package per feature

Require a small `docs/evidence/<feature>.md` report in each development slice containing:

1. **What works** with route and real API/DB/storage paths, exact commit and deployment URL.
2. **What does not yet work** and whether exposed controls are disabled/labelled.
3. **Flow coverage:** exact `FLOWS.md` IDs, success branch and unhappy-path branches.
4. **Screenshots:** 360, 390, 430 and 1440 widths, including long names/empty state/RTL if relevant.
5. **Tests:** exact commands, passing/failing counts, no claim without logs; documented QA on low-end device.
6. **Security/privacy:** cross-tenant test, role and token scope, data retention and asset rights.
7. **Design review:** against `CREATIVE_SYSTEM.md` rubric with honest deficiencies.
8. **Next action:** highest impact dependency or next slice; no artificial sign-off question.

## Continuous development protocol

- **No stop-and-wait checkpoints** at ordinary packet boundaries. Read project documents once, execute R1→R4 in realistic vertical slices and continuously correct visual/functional issues.
- Before each slice: inspect code state and source research, name the flow and acceptance cases.
- During slice: build browser UI + backend/data + failure handling; keep Vercel preview deployable.
- After slice: run build/typecheck/tests, capture screenshots, commit, update evidence. Immediately move to next independent slice.
- If vendor credentials, legal rights, irreversible destructive ops or billing require owner choice, expose the exact blocker and continue unaffected work. Do not fabricate data or sneak around permission walls.
- Do not launch to real paying customers until R3 gate and the owner authorizes paid release.

## Genuine product quality signals

- Invite is recognisable as art-directed and readable on mobile; three styles have different silhouettes, type systems and interactive sequences.
- Unfamiliar couple can create convincing draft without tutorial. Guest can find venue and RSVP without account.
- Family/event counts stay accurate even after responses change; forward/revoke behaviour respects policy.
- Preview, draft, published guest view use one validated renderer; no differences hidden in marketing screenshots.
- Empty/error/offline/permission-denied states are designed, not generic alerts.
- No 'Sent', 'Paid', 'Saved to cloud' or 'Published' success message without real confirmation.
