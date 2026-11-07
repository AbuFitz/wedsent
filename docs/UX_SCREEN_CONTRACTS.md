# Wedsent screen and interaction contracts

**Purpose:** Prevent polished-but-empty screens and invisible architecture gaps. Every screen must specify user intent, fields, states, permissions, feedback, mobile layout and real backend actions. The system is an invitation maker with guest organisation, not a wedding CRM.

## Universal contract

For each route, coding agent must record: (a) actor and purpose, (b) entry/back/exit, (c) desktop/mobile anatomy, (d) primary + secondary action, (e) loading/empty/error/denied/offline states, (f) payload and validation, (g) authorization + concurrency, (h) analytics without PII, (i) acceptance tests and screen captures. No screen counts as complete without these.

| ID | Screen | Content / essential actions | Small-screen priority | Must handle |
| --- | --- | --- | --- | --- |
| M01 | Marketing home | Real invitation demonstration, designs, process, price, FAQ and privacy | First screen showcases actual open interaction + one CTA | Slow hero, user with reduced motion, disconnected demo |
| M02 | Design gallery | Distinct design cards, style/mood filters, preview action | Large artwork, thumb-access filters, no endless horizontal carousel | Empty filter, mobile crop, unavailable style |
| M03 | Design detail | Full real guest preview, interaction/motion demo, variants and start design | Full-screen invitation + bottom start action | No photos, RTL, audio blocked, fallback |
| O01 | Start wizard | Chosen design → names → events/date → appearance → draft review → account | One question at a time with live top preview and expandable sheet | Abandon, reload, partial fields, keyboard, back/skip |
| O02 | Sign up/sign in | Account creation, magic link/email verified, resume draft | Fast, return to draft | Expired link, duplicated accounts, existing owner |
| S01 | Studio landing | Invitation preview, checklist, next task, last saved and publish state | Preview + compact next actions | Empty account, partial draft, expired paid term |
| S02 | Details | Names, language, optional story/photos, schedule wording | Inline editing with preview | Very long names, non-Latin scripts, absent media |
| S03 | Events | Add/edit/reorder ceremonies, timezone, location, guest visibility | Event list with detail sheet | Overlaps, date timezone, private ceremony, reschedule |
| S04 | Appearance | Design gallery, palette, motif, font pairs, crop, opening, music | Preview occupies prime space; controls in sheet | Lossless switch, text overflow, crop fail, autoplay restrictions |
| S05 | Guests | People/households, event allocation, invited/responded state, add/import/export | Search + filters, clear single action | Duplicate detection, CSV errors, family delegation, event-specific headcount |
| S06 | Invitation detail | Guest/household permissions, per-event access, token/link status | Single household summary, copy/send | Forwarded link, revoked token, manual reply, resend |
| S07 | RSVPs | Per-event counts, declined/unanswered, change history, meal/diet notes | Simple sections and useful summary | Concurrent answers, plus-one cap, deadline override |
| S08 | Share | Public/private link modes, preview of message/card, copy/share/export | Native WhatsApp/SMS share first | Link forward, unsupported share API, consent, broken OG |
| S09 | Publish/checkout | Readiness checklist, plain one-time price/term, verified payment, publish | Clear summary and single CTA | Webhook delay/fail, retry, idempotency, refunds |
| S10 | Settings | Roles, access, retention, export/delete, privacy, notifications | Grouped user tasks, not advanced settings dump | Role revocation, delete confirmation, stale sessions |
| G01 | Guest invitation | Greeting/reveal, schedule, details/maps, RSVP, help/accessibility | Fast legibility before effects | Expired/revoked link, not invited to event, offline |
| G02 | Guest RSVP | Named attendees, per-event answers, +1 policy, dietary, confirmation | <=3 clear steps; accessible large targets | Partial family, over-allocation, concurrent edits, change response |
| G03 | Confirmation | Exact names/events/status + calendar or directions | Compact receipt with next action | Failed save, mismatched data, changed event details |
| P01 | Photo Hall setup | Enable, privacy, photographer invite, rights, quota, review policy | Plain choices and clear costs | No photographer, rights missing, retention terms |
| P02 | Photographer upload | Scoped upload session, bulk progress, retry, checksum | Large files resumable; clear completion | Partial upload, duplicate, quota, token revoked |
| P03 | Couple moderation | Review staged photos, batch approve/reject, download policy | Swipe/select workflow | Sensitive photos, unreviewed leaks, undo and takedown |
| P04 | Private guest gallery | Approved photos only, scoped access, allowed download, report | Fast image rail with progressive loading | Expired token, missing photo, takedown, rights revoked |
| A01 | Operator console | Search issues by reference, scoped audited tools, reset/revoke/restore | Functional desktop-first workspace | Cross-tenant visibility, PII minimisation, audit failures |

## Required state coverage for each interactive component

Every input/control: untouched, edited, invalid, submitting, succeeded, denied, disconnected, stale, conflict, retrying, disabled (with reason). Autosave must distinguish *pending locally* from *persisted on server*. Toasts cannot substitute for actionable errors. No UI should say 'sent', 'published' or 'paid' until provider/server confirmation.

## Non-negotiable real-world scenario matrix

| Scenario | Expected product policy to define / implement | Verification |
| --- | --- | --- |
| Parent responds for five relatives | Explicit household authority; per-person per-event response; no double count | API + concurrency + UI |
| Guest invited to Walima only | Must not discover a private Nikah via shared link/OG/API | Permission attack test |
| Forwarded guest link | Link capability limits invite seats; options to revoke/rotate; no hidden guest data in OG | Token and scraper test |
| Guest declines Nikah but attends reception | Independent event-level answer | Relational constraint and e2e |
| Same guest in two imported spreadsheets | Duplicate review by user, no automatic destructive merge | CSV fixture test |
| Last-minute venue change | Current URL updates, affected guests notified if consent and delivery channel exist | Publish + queue + bounce test |
| Wedding rescheduled / cancelled | Clear status, revised RSVP deadline, no stale reminder emails | State machine test |
| International guests | Host timezone displayed alongside locale-aware date; calendar correct | DST/timezone fixtures |
| RTL Arabic and English | Correct bidi isolation for names/address; font fallback, action placement | RTL visual and screen reader |
| Missing/huge images | Design falls back gracefully; upload limits and derivatives | Mobile visual + upload test |
| Long or multiple names | Text hierarchy adapts without overlap or illegibility | Screenshot test |
| Elderly/low-literacy guest | Clear action labels, large touch targets, minimal form steps, manual host entry | Human usability pilot |
| Owner loses network mid-edit | Local pending marker, sync/resume, no silent overwrite | Offline/reconnect e2e |
| Couple edit same draft concurrently | Explicit conflict handling/version checks; no last-write mystery | Race test |
| Guest changes RSVP at deadline | Server policy enforced; history and counts consistent | Clock boundary test |
| Checkout webhook repeated/out of order | Exactly one entitlement; refund/reversal policy explicit | Idempotency test |
| Photographer uploads 1,000 files | Chunk/resume, budget/queue, idempotent processing, moderation count | Soak/load test |
| Photographer revokes distribution rights | Couples warned, downloads disabled/takedown | Authorization + lifecycle test |
| Photo of non-consenting guest | Simple report/takedown; private by default, no face recognition | Moderation workflow |
| Link indexed by search engine | Privacy policy; noindex private pages; no sensitive OG or analytics payload | Bot and metadata test |
| Wedding expires | Export window, advance notice, retention and deletion documented | Clock and job test |

## Five key screen layouts

### Marketing

- **Desktop:** typographic hero paired with actual interactive invitation; distinct large editorial showcases; no three-column SaaS feature spam.
- **Mobile:** invitation is visually primary; sticky CTA appears only when non-obstructive; inspect design without forced account.

### Studio

- **Desktop:** minimal navigation, contextual editor, large *real renderer* preview, truthful persistence indicator. Guest operations are a separate task area, not crammed inside appearance.
- **Mobile:** top preview, edit/preview mode, content-height bottom sheet, keyboard-aware actions, no page-within-page scroll trap.

### Guest list

- **Desktop:** search, household grouping, event filters, invite state, batch corrections, export. Counts reflect **people per event**, not links.
- **Mobile:** actionable simple list, grouped households, explicit pending/attending/declined; complex import can link to desktop but essential edits must work.

### Guest view

- Opens from WhatsApp quickly; privately addressed where token allows; reveal optional, details and RSVP always quickly accessible. Schedule, local date/time, maps, help, confirmation. No account requirement.

### Photo Hall

- A private media product: photographer upload, couple moderation, guest viewing are distinct roles. Do not reuse Studio owner permissions for viewers or uploaders.

## Prioritization — avoid building a wedding CRM

**Core:** three remarkable templates; creation/edit; publish; multi-event RSVP; household permissions; export; honest sharing. **Next:** richer themes, collaborator roles, reminders, Photo Hall pilot. **Later only with evidence:** custom domain, QR art, AI-assisted design, planner portal, seating, advanced automations. The user's desire for full quality does not mean every imagined feature belongs in the first paid tier.

## Human usability evidence requirement

Recruit 5–8 prospective couples and several guests of different ages/language comfort for unmoderated or observed task runs. Watch: choose a design, personalise, invite a family, change RSVP, find venue, find and download an approved photo. Record time-to-first-credible-draft, completion, confusion points and willingness to pay. These are **research targets**, not existing validation claims.
