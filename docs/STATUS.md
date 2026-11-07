# Status and feature matrix — 2026-11-07 (round 3)

Source of truth for what is real. States: **Verified** = covered by an automated test or a browser run this session. **Partial** = built, with named gaps. **UI only** = looks real, is not. **Planned**. **Blocked** = needs something outside the code.
Evidence: `npm test` (24 backend tests, embedded Postgres), `tests/e2e/flow.mjs` (16 browser checks, cold server), screenshots reviewed at 390 and 1440 widths.

## Invitation (the creative product)
| Capability | State | Notes |
| --- | --- | --- |
| Renderer driven by structured data, content separate from design | Verified | `src/components/invitation/`, `InviteData` + events. Switching design keeps content. |
| Three designs, each with its own cover, opening gesture and inside layout (Vermilion, Monolith, Nocturne) | Partial | All open and render multi-event invitations in a browser. Monolith and Nocturne need a more mature art-direction pass; a fourth family is not started. |
| Guest sees **their own events** as cards (date, time, venue, Maps, per-event calendar file), greeted by household | Verified | New this round. Public page shows only public events. |
| Opening: reduced motion, keyboard path, once-per-session replay skip | Partial | Implemented; no screen-reader or low-end-device test yet. |
| Live preview in Studio (cover and inside) | Verified | Uses real events when signed in. |
| Music, photos/crop, story/FAQ sections, RTL/Arabic, per-design RSVP styling inside the card | Planned | |
| Print: A5 browser-print layout | Partial | No bleed/crop/CMYK. |

## Creation and Studio
| Capability | State | Notes |
| --- | --- | --- |
| Accounts (password), sessions, rate limits | Verified | No email verification or reset (needs email). |
| Autosave to account, conflict detection, signed-out local draft claimed on sign-up | Verified | |
| Four tabs plus **Events** (add/edit/delete, who can see it) | Verified | Event reorder, descriptions, schedule items: planned. |
| Guided onboarding journey (names/date → design → live personalise → events → preview → guests → publish) | Partial | Today the home hero captures names/date and the Studio is the editor. No stepwise guided flow yet. **Next.** |
| Undo/restore, version history UI, collaborators | Planned | Versions exist in the database. |

## Guests and replies
| Capability | State | Notes |
| --- | --- | --- |
| Events, households, named guests, per-guest per-event invitations | Verified | Plus-ones are named guests only. |
| Private per-household link; reset kills old link; reset-vs-reply race safe | Verified | |
| Reply per person per event, versioned, idempotent, history kept | Verified | Reply page is a separate route, not inside the invitation card yet. |
| Deadline policy and host corrections | Partial | Backend tested; dashboard controls not browser-tested. |
| Host counts by event (people, not links), CSV import with duplicate review, CSV export | Verified | Column mapping step and dietary summaries: planned. |
| Custom questions, dietary, children rules beyond a flag, undecided state | Planned | |
| Sharing: copy link, WhatsApp share link | Partial | QR codes, native share sheet, share artwork: planned. |
| Reminders, notifications on event changes, delivery status | Blocked | Needs an email provider. |

## Public site
| Capability | State | Notes |
| --- | --- | --- |
| Home: hero with live phone, plain-facts strip, scroll-pinned how-it-works, design tour, feature index, price teaser, FAQ | Partial | "How it works" scenes are **UI only** illustrations of real screens, labelled as examples. |
| Pricing page (provisional £39, ready/coming list) | UI only | No checkout. |
| Design gallery page, design detail pages, live full-screen preview route | Planned | **Next after onboarding.** Today designs are shown on the home page only. |
| Legal, privacy, terms, help/FAQ pages, sign-in polish | Planned | |

## Platform
| Capability | State | Notes |
| --- | --- | --- |
| Postgres schema, migrations, tenant isolation, audit events | Verified | RLS not used; isolation by owner checks and composite keys. Not yet run on a real multi-connection Postgres. |
| Deployment with a database | Blocked | Needs `DATABASE_URL`. Without it the deployed site serves marketing and the signed-out Studio only. |
| Payments (Stripe), entitlement gate | Blocked | Gate exists (`REQUIRE_PAYMENT`); needs price decision D01 and keys. |
| Email (Resend), React Email templates | Blocked | Needs provider key and sending domain. |
| Photo Hall, media storage, print export, analytics, monitoring, backups | Planned | |

## Conflicts between documents, resolved here
1. **Typography.** The owner directive says the Wedsent interface must not be led by ornate wedding type. Resolution: Geist for all UI and section headings; Instrument Serif only for the hero, design names, the price and the closing line. Invitation typography is per design.
2. **Packet order (P01–P10) vs dependency groups.** Replaced by the groups in the directive: foundation → core experience → guest operations → commercial → extended. The packet list in `AGENTS.md` is historical.
3. **Release gates** in `DECISIONS_AND_RELEASE_GATES.md` still describe R0 as "no real guest lists". Superseded for implementation by this file; gates R2–R4 (human pilot, payments, Photo Hall) remain binding for launch.
4. **Data model names.** The directive lists HouseholdMember, EventInvitation, InvitationToken. Implemented equivalents: `guests`, `event_invitees`, `invitations` (token digest). No rename planned.

## Build order from here (dependency order, one journey at a time)
1. Guided creation journey (O01): names/date → design → live personalise → events → preview → account → publish.
2. Gallery, design detail pages and full-screen live preview (public, no real data).
3. Design maturity: Monolith and Nocturne art direction, then a fourth family; reply inside the invitation card.
4. Sharing: QR, native share sheet, share card.
5. Deploy with a database; then payments; then email and reminders.
6. Music, photos/crop, then Photo Hall and print as separate cost-checked slices.

## Needs owner input
1. **Database for the deployed site** (new Wedsent Supabase project, may cost; or your own `DATABASE_URL`). The Supabase projects visible to me belong to another product, so I have not touched them.
2. **Price and hosting term** (D01/D02). Greenvelope, a close comparison, lists from $19.
3. **Email provider and sending domain.**
4. **Framer**: stay in Next.js (recommended; Framer templates cannot be moved into code) or build marketing pages in Framer.
5. Whether the first audience is explicitly UK Muslim weddings or all weddings (affects copy, templates, default events).
