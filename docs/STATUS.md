**8 Nov short-link correction:** Removed the Studio action that generated a `/share#...` URL containing the entire invitation draft. Studio now directs signed-in owners through Guests & publish to the existing short public `/w/:slug` or secure per-household `/r/:token` URLs. Also stopped `/invite` (local design preview) from linking to an RSVP simulation. Existing long feedback links still render for compatibility but cannot collect RSVPs. Public and household replies are server-backed on the published routes. Google/Apple Wallet issuance still needs external issuer credentials and is not live; do not label calendar downloads as wallet passes.

**11 Nov editorial rebuild:** Replaced the public homepage, collection, pricing and sign-in, and reduced setup to details, design and review. The new homepage uses a live opening, phone carousel and an explicitly fictional household RSVP. Studio tools are now directly reachable. Existing guest links and server APIs carry forward from the live-site source branch. See [the rebuild evidence](evidence/editorial-website-rebuild.md).

# Status and feature matrix — 2026-11-07 (round 3)

**10 Nov editorial marketing art pass:** The public homepage now opens with an original generated photorealistic iPhone digital-invitation scene (rather than stationery-only photos or a cluster of renderers). Two independent original assets introduce a couple's hands and a hand-illustrated wedding scene between the gallery and event sections. The gallery and guest-tour continue to use the real invitation renderer. Navigation is a restrained inset frame and global base is white, with the onboarding form retaining its working flow. Assets were generated for Wedsent using image generation, not copied from the user-supplied copyrighted/watermarked visual references; see `docs/evidence/marketing-art-2026-11-10.md`. These are campaign illustrations, **not screenshots proving deployed phone rendering**. Visual QA and deployment evidence remain outstanding until tested.

**10 Nov art-direction reset, second pass:** Owner rejected the first pass as literal and formulaic. The homepage now uses centred supersized typography and three off-axis photographic objects in the opening scene, a real interactive invitation gallery, cinematic full-bleed dinner atmosphere, culture-flexible event content, sticky functional guest-view demonstration, and a separate commissioned-style photography/watercolour essay. New assets include wedding fashion veil, candlelit reception, and an invitation viewed in-hand. Gallery, pricing and `/start` received white editorial refinements without replacing state, auth or RSVP logic. Build and 59 tests pass; browser screenshot QA remains blocked because local Chromium cannot create its singleton socket in this environment. This is a substantial **new visual exploration**, not owner-approved production quality.

**10 Nov complete public-site rewrite, third pass:** Following rejection of inherited page sections, a new `home-editorial` composition replaces the homepage architecture rather than restyling its old sections. The new journey is: cinematic typographic opening → invitation manifesto → live tappable invitation → exhibition of distinct creative directions → personal photo and watercolour story → interactive illustrative household/event RSVP → form invitation handoff → closing. Pricing is a new self-contained editorial page with explicit provisional status; gallery gains photographic editorial framing; `/start` gains a white, spacious two-column creator interface without changing the step/auth/save logic. Brand wordmark and display typography updated. The demonstration RSVP toggles are expressly illustrative and save nothing. Build and unit suite passed locally (59 tests). The public production alias still displayed the old site during initial inspection; new changes require branch deployment and browser QA before production approval.

**10 Nov Stux-inspired reset, fourth pass:** Owner rejected the preceding public-site aesthetics and supplied `https://stux.framer.website/` as a decisive visual reference. Rebuilt the homepage again as `home-stux`, using an original Weddsent narrative, photography and code rather than copying Stux source/assets: full-bleed imagery and central oversized type; three-part fixed navigation with interactive menu; numbered editorial sections; blurred photography behind sharp centre-stage collection objects; expanding service details; cinematic feature panels; dramatic dark manifesto; structured process and FAQ; yellow full-width CTA. Global site display type returned to Geist. Pricing, gallery and `/start` share the monochrome/bright accent design system, while invitation renderer and actual account / Studio path remain unchanged. New campaign photography: `weddsent-courtyard-stux.webp` (twilight courtyard) and `weddsent-pavilion-stux.webp` (lake pavilion), both generated specifically for Weddsent and *not* sourced from Stux; original generated PNG masters retained in scratch. Browser inspection of reference completed. Build/test evidence and deployment status to be checked before production review; preview may require Vercel owner login. No final visual approval claimed.

**Atelier Studio replacement, 8 Nov:** Deleted the previous `studio.tsx` and `studio.css` editor and built a fresh composition-oriented implementation. New layout: six purposeful tools in a Phosphor-icon dock, live framed invitation stage with opening/inside states, right-side context editor, and mobile composition with expandable edit sheet plus full-screen guest view. Rebuilt wording/occasion presets, event CRUD (server or local), real design thumbnails, palette/font/opening selection, photo upload/crop, music library/MP3 upload/Wavesurfer excerpt/timing/volume, and countdown/language settings against the existing draft schema and APIs. **No wedding records or backend routes were deleted.** Source builds and unit tests can verify code paths; actual mobile visual quality and browser e2e still require verification. An attempt to run local Chromium was blocked by the environment (`socket() failed: Operation not permitted`), so visual QA is not claimed.

**Studio navigation reset (8 Nov, new):** Replaced the nested workspace/child-tab/preview-shortcut navigation with a single grouped section navigator, central live guest canvas and contextual inspector. Mobile uses the same section choices in a horizontally scrollable strip above explicit Edit/Preview actions. Added a searchable `Cmd/Ctrl+K` action menu for editing tools, guest preview and feedback sharing, with Escape and empty-results handling. Existing draft and server event forms are retained, including undo/redo and save-state messaging. A production compile and 40 unit/backend tests passed; browser launch was blocked by this container's network-interface error, so mobile screenshots and full interaction/e2e QA remain pending. This is a functional shell redesign, **not** a claim that every form control, publishing flow and visual asset is complete.

**Studio workflow revision (8 Nov):** The previous Finishing mega-panel was split into eight focused editing areas, with task descriptions, next/previous actions, a persistent actual-invitation preview and horizontally scrollable mobile navigation. The Music area now displays a selected recording, album choices and a Wavesurfer Regions-based excerpt editor with native audio fallback, alongside playback mode/volume. Draft shape, server persistence and existing user-uploaded music references are preserved. Production build and unit suite were run locally; visual inspection on real devices, CORS-dependent remote waveform decoding, and owner design sign-off remain outstanding.

**8 Nov RSVP and playback slice:** Published public links `/w/:slug` now provide a public form at `/w/:slug/reply`. Submissions are rate-limited and stored separately from named guest RSVP records, surfaced in the owner Replies tab as **unverified**. Public links cannot reply to private-only events. A feedback link `/share#...` still does not collect RSVP because it is a self-contained preview. Audio now has start/end, volume, and load/open/manual trigger modes. On-load audio is a browser-policy-dependent attempt, never guaranteed. Tested by 40 unit/backend tests and production build; deployment and device audio have not been verified. This slice does **not** implement payments, email, pass issuance, check-in or a complete licensed album.

**Build-mode access update (8 Nov):** Signed-out onboarding now goes directly to Studio, and Studio supports local-only creation, editing and deletion of events. No sign-in is needed to explore invitation designs and the editor. This does **not** bypass owner authentication for server-side guest lists, publishing or private links; those actions remain account-protected. Local drafts/events are tied to the browser and can be lost if its storage is cleared.

**Intro variety update (8 Nov):** The design engine has four opening treatments: lift, touch bloom, veil, and editorial focus. Studio's Style panel allows a non-destructive opening override, with design-specific defaults. It is saved with the wedding draft, validated by the server, and inherits keyboard/reduced-motion handling. This is a foundation for more deliberately art-directed motion, not a complete template library.

**Media and motion experiment (8 Nov):** Added experimental door and curtain opening treatments and signed-in/local build-mode guided photograph upload with focal-point controls. See [MUSIC_MOTION_BACKDROP_RESEARCH.md](MUSIC_MOTION_BACKDROP_RESEARCH.md) for the audio source/licensing study and art-direction gates. No music recordings have been bundled or described as rights-cleared. Door/curtain realism and upload interaction still need visual/device review before release.

**Personal widgets (8 Nov):** Added optional countdown in three visual compositions with editable accent and heading, and independently configurable label languages for details/countdown/reply (English, French, Arabic, Somali). See [WIDGETS_CULTURAL_DESIGN_RESEARCH.md](WIDGETS_CULTURAL_DESIGN_RESEARCH.md). These are **label-only** translations; RSVP forms, owner text, event timezone semantics and native-speaker review remain open work.

**Owner-supplied music (8 Nov):** Studio now accepts an MP3 up to 8 MB after explicit rights confirmation. Guest invitation has an opt-in top-right play/pause control with no autoplay and background-tab pausing. Build mode stores audio locally in IndexedDB; signed-in owners upload through `/api/music` into the `003_music.sql` table, and `/music/:id` supports range playback. The platform **does not provide a curated licensed soundtrack catalogue**; users must have rights to their uploaded recording. Real-device audio playback, legal terms, media lifecycle/deletion and object-storage/CDN migration still require release review. The prior "Music not built yet" placeholder was removed.

Source of truth for what is real. States: **Verified** = covered by an automated test or a browser run this session. **Partial** = built, with named gaps. **UI only** = looks real, is not. **Planned**. **Blocked** = needs something outside the code.

**Shared invitation revision (8 Nov):** `/share` now displays the invitation without the fake "Try the guest experience" RSVP or Wallet simulator. It remains an encoded, read-only design proof—not a persistent, personalized invite. Actual no-login replies and passes require a private `/r/[token]` household link and a deployed database. The studio no longer offers generic legacy doors/curtains; saved choices resolve to a curated cover. Distinct section interludes and response frames now carry selected visual families through the scroll. TypeScript, 41 tests and production build passed. Mobile browser/device art direction remains unverified; no claim that the full live flow is complete. Connected Supabase project contains the schema but currently has zero weddings, households or invitations. Deployment connection still requires the runtime `DATABASE_URL` to be configured securely.

**Short guest links:** New household invite tokens are 22 URL-safe characters (16 random bytes / 128-bit entropy), down from 32 characters. Existing links are not rotated automatically. A new backend test confirms token length and household resolution (42 tests passing). This shortens personal links without substituting guessable names or sequential IDs.
Evidence: `npm test` (24 backend tests, embedded Postgres), `tests/e2e/flow.mjs` (16 browser checks, cold server), screenshots reviewed at 390 and 1440 widths.

## Invitation (the creative product)
| Capability | State | Notes |
| --- | --- | --- |
| Design engine: spec registry, palettes, font pairings, intro lines, shared by server and client | Verified | `docs/DESIGN_ENGINE.md`. Registry integrity, contrast (WCAG AA) and artwork licences are tested. |
| Seven designs, each with its own opening (seal envelope, doors, lattice, curtains, shutter, hold) | Partial | Four new designs use real public-domain artwork and read as stationery. Vermilion, Monolith and Nocturne are type-led and need the same art pass. |
| Real artwork pipeline (public-domain / CC0 plates, provenance, `/credits`) | Verified | Pale flowers and low-resolution scans are known limits. |
| Guest sees their own events as cards, greeted by household, Maps and per-event calendar file | Verified | |
| Per-design lettering, colour palette, optional opening line (Arabic, Hindi, custom) | Verified | Font pairing applies to the four stationery designs only. |
| Live preview in Studio, onboarding, gallery and detail pages | Verified | Same renderer everywhere. |
| Music, photo upload/crop, RTL layout beyond the opening line, story/FAQ sections | Planned | |
| Print: A5 browser-print layout | Partial | No bleed/crop/CMYK; not yet using the new artwork. |

## Creation and Studio
| Capability | State | Notes |
| --- | --- | --- |
| Accounts (password), sessions, rate limits | Verified | No email verification or reset (needs email). |
| Autosave to account, conflict detection, signed-out local draft claimed on sign-up | Verified | |
| Four tabs plus **Events** (add/edit/delete, who can see it) | Verified | Event reorder, descriptions, schedule items: planned. |
| Guided onboarding at `/start` (names → date → celebration preset → design → style → details → preview → account) | Verified | Events chosen while signed out are created once after sign-up. Guests and publishing still happen in the Studio/dashboard, not in this flow. |
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
| Home: art-led hero with live phones, design rail with celebration shortcuts, "every wedding" section, scroll-pinned live guest tour, feature list, price teaser, FAQ | Partial | No illustrations of screens remain; everything shown is the real renderer. Needs a real-device and low-end check. |
| Pricing page (provisional £39, ready/coming list) | UI only | No checkout. Its three "how it works" demo cards are still illustrations and should be replaced. |
| Design gallery (`/designs`) with Evite-style filters (celebration, style, colour, shape, opening), design detail pages with live preview, palette, lettering and opening-line controls, full-screen preview | Verified | Browser-tested. |
| Credits page for artwork, fonts and software | Verified | |
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
**Studio workbench update, 8 Nov:** Replaced the eight-item horizontal category bar and previous/next wizard navigation with four workspaces (Content, Design, Sound, Finishing), local focused task tabs, direct preview edit shortcuts, and a mobile Edit/Preview switch. The existing invitation renderer, draft autosave/conflict handling, owner-only uploads, events API and soundtrack data were retained. `npm run build` and all 40 unit/backend tests passed. Browser viewport interaction and mobile visual QA have **not** been completed; do not call this a verified UX release. Remaining shortcomings include contextual selection directly inside rendered invitation elements, section-specific visual controls beyond the existing fields, a hands-on usability pilot and accessible real-device QA.

**Studio navigator revision:** Desktop now separates a labelled section hierarchy on the left, the guest canvas in the middle, and an inspector on the right. Draft-only Undo/Redo was added. Framer/Webflow/Canva official editor documentation was used to evaluate this interaction structure, but no proprietary source code or UI assets were copied. Existing media and wedding records are not migrated or deleted. Real mobile QA and usability testing are still pending.

**Studio control art direction pass:** Wording controls now use copy-sample cards and illustrated message-layout choices; Appearance has visual palette cards and miniature opening-motion cards rather than unlabeled pills. Research expanded to Twenty, Plane, Payload, Puck, Craft.js, Formbricks and Typebot with source/licence boundaries in `OPEN_SOURCE.md`. No Puck adoption or replacement of the editor engine is claimed. The venue/date, events, uploads and music inspectors still need the same deep interaction review. Real couple testing remains outstanding.

1. Design maturity: art pass for Vermilion, Monolith, Nocturne; higher-resolution re-cuts of the hero plates; paper/marble photo textures; a Chinese/East Asian and a Jewish design family; reply inside the invitation card.
2. Onboarding to publish: guests and sharing inside the guided flow; QR and share sheet.
4. Sharing: QR, native share sheet, share card.
5. Deploy with a database; then payments; then email and reminders.
6. Music, photos/crop, then Photo Hall and print as separate cost-checked slices.

## Needs owner input
1. **Database for the deployed site** (new Wedsent Supabase project, may cost; or your own `DATABASE_URL`). The Supabase projects visible to me belong to another product, so I have not touched them.
2. **Price and hosting term** (D01/D02). Greenvelope, a close comparison, lists from $19.
3. **Email provider and sending domain.**
4. **Framer**: stay in Next.js (recommended; Framer templates cannot be moved into code) or build marketing pages in Framer.
5. Whether the first audience is explicitly UK Muslim weddings or all weddings (affects copy, templates, default events).
**9 Nov guest sending usability slice:** Removed Studio's search icon, command palette and shortcut. Household cards now provide a direct live-link inspection action and an explicit **Send invite / QR** panel with native share, WhatsApp, email and SMS drafts, copy and QR downloads. A single household email address is prefilled when unambiguous; with multiple addresses the owner chooses the recipient in their email client. These are user-initiated handoffs, **not** automatic delivery or delivery tracking; no unearned "sent" state is shown. The share panel keeps private household links distinct from public invitations. Next production build passed locally. Browser/device and a delivered-message-to-RSVP-to-dashboard round trip are still outstanding.

**9 Nov hybrid sending implementation:** Added an owner-only `/api/wedding/deliveries` read endpoint over the existing `message_deliveries` table and a dedicated dashboard **Sending** tab. It distinguishes queued, sending, accepted-by-provider, delivered, failed and cancelled records; external native share actions are deliberately **not** marked sent. This is the first management slice, **not** Resend automation: no provider send worker, webhook verification, reminders, public self-registration approval flow or end-to-end verified delivery yet. The hybrid model has two admission rules: private household links preserve fixed event entitlements; open links allow self-identified *unverified* replies and never auto-allocate restricted places. Mobile QA and the theme-by-theme visual overhaul remain open.

**9 Nov delivery reliability follow-up:** Inspected OpenInvite's Resend functions, Guestroll's email queue/retry code, Resend's provider idempotency contract and WhatsApp's opt-in policy. Added [`INVITATION_DELIVERY_ENGINE.md`](INVITATION_DELIVERY_ENGINE.md) with transactional queue, token-revocation, webhook dedupe, out-of-order transitions, retry and reminder invariants. Added a database-backed owner-only delivery-history isolation test: 43 tests now pass, including queued records not masquerading as sent/delivered. The provider pipeline remains unimplemented; this is an architecture-and-test hardening slice, not an automated-email launch.

**9 Nov CSV safety fix:** Household CSV import previously used `slice(0,12)`, silently dropping every guest after the twelfth in the same household. Import now rejects that batch before any database write with an explicit "split the household" message. Added an atomicity regression test to prove zero households are created after rejection. This is a guest-data integrity fix, not a messaging integration.

**9 Nov email-send implementation (authorised provider):** Added a selected-household email action backed by `POST /api/wedding/deliveries/send`. It is only visible when server-only `RESEND_API_KEY` and `RESEND_FROM_EMAIL` exist. The server checks wedding ownership, publication, active invitation tokens and recipient email presence, reserves unique delivery keys, and sends through Resend with a 12-second request timeout and stable provider idempotency header. Acceptance is marked `sent`, never `delivered`. There is **no automated retry or delivery webhook yet**; live email provider verification and owner-domain configuration remain required. Test covers wrong-owner access, provider-shaped response and duplicate-send suppression.

# Pre-launch owner checklist (9 November 2026)

- [ ] **Resend:** verify Wedsent's sending domain (SPF/DKIM), configure server-side API credentials, production sender and webhook signing secret; then verify delivery, bounced mail, retries, reminders and unsubscribe/complaint handling with real recipients.
- [ ] **Domain:** choose and connect the production Wedsent domain in Vercel, configure DNS/TLS, canonical links, redirects and email subdomain; test short household links and QR codes after cutover.
- [ ] Complete live-database end-to-end tests from owner publishing and sending to guest RSVP and dashboard status, including revocation and repeat submission.
- [ ] Perform real iOS Safari and Android Chrome visual/interactions QA on each invitation family and the redesigned Studio.
- [ ] Audit the visual continuity of each invitation theme, from opening gesture through venue, timeline, countdown and RSVP, using theme-specific artwork rather than generic decorative shapes.

# 10 November 2026 — creation-to-account and guest-management slice

- The guided Studio no longer shows duplicated back-to-dashboard exits or a persistent guest-list shortcut. Its final step leads to the real household area, with account creation required for signed-out users.
- The Start flow now saves its local draft and pending event titles, then prompts signed-out couples to create an account. Successful sign-up returns to Studio, which claims those pending details using the existing versioned draft and event APIs. Already-signed-in couples save directly.
- The site navigation distinguishes signed-out **Sign in / Create invitation** from signed-in **My wedding / Open Studio** using `/api/me`. The sign-in page checks existing sessions and uses an allowlisted post-auth redirect.
- Guest dashboard tabs have URL state (`?tab=Guests`, `?tab=Sending`). Guest-list progress is calculated per person/event, while private-link opening and verified email delivery remain distinct. Sending has explicit selection/confirmation and remains disabled without configured Resend credentials.
- Automated check: `npm test -- --reporter=dot` passed 57 tests across 7 files; `npm run build` passed Next.js compilation/TypeScript. Browser end-to-end attempt was blocked by this environment's Chromium `socket() failed: Operation not permitted`; **no actual mobile/browser sign-off yet**.
- Still required: real-device review of revised Studio/nav/login; production domain and Resend sending verification; real-database guest-flow test; theme-specific artwork/motion/layout overhaul; final commerce and policy decisions.

**10 Nov setup recovery follow-up:** The seven-step creation flow now keeps an in-progress snapshot in tab-scoped browser session storage (including selected events and current step), restoring it after refresh. A completed handoff to account creation or Studio removes this temporary snapshot; the established draft store remains the source for the account claim. Invalid or oversized snapshots are ignored. This reduces accidental loss during the pre-account journey; it does not replace cloud autosave, multi-device recovery or end-to-end signup tests.

## 11 November 2026 — public-facing creative rebuild

- Replaced the previous Stux-style homepage structure entirely with `home-reimagined.tsx` and a new responsive styling system: restrained Geist/Instrument Serif typography, framed product navigation, asymmetric editorial opening, real invitation preview and opening state, interactive five-plus-design phone exhibition, culture-neutral multi-event story, household RSVP example, creation journey, FAQ and editorial close.
- The interactive carousel uses the actual invitation renderer and registry rather than flattened marketing screenshots; arrows, touch and keyboard update the selected design; the selected preview links to its `/designs/[id]` route. No paid Framer component source or copyrighted assets were copied.
- Two original campaign images generated specifically for this composition are saved in `public/art/weddsent-editorial-table-v2.webp` and `weddsent-editorial-hands-v2.webp`. Original PNG sources are retained locally, but only optimized WebP assets are needed for deployment.
- Reworked the shared nav, design collection masthead/imagery/card styling, pricing layout and white creation-form typography for the same direction. These are visual changes; existing auth/Studio and guest API contracts are intentionally preserved.
- `npm run build` passed and `npm test` passed 59 tests across 8 files. **No live desktop/mobile browser visual approval yet**, and the simulated RSVP on the homepage intentionally saves/sends nothing. The pricing CTA remains a try-it flow; £39 and hosting period are provisional, checkout inactive.
- Remaining: verify the exact rendered pages at 360/390/430/1440 widths, real mobile swipe/tap and long/RTL invitation fixtures; verify the production Vercel deployment and user-critique the new art direction. Further invitation-template artwork quality remains separate work.


## 11 November 2026 (later) — full front-end rebuild, direction reset

Owner direction: scrap the previous front end (homepage, pages, form, Studio visual layer, generated imagery) and rebuild with a proper typeface and Sponsalia-grade invitation variety. Backend, data, music, email, QR and tests are unchanged.

- **Site:** new tokens in `globals.css` (warm stone canvas, blue-black ink, midnight sections, one rose accent). Type is Hedvig Letters Serif (display) + Hanken Grotesk (interface). Floating pill nav; text wordmark only (no logo yet). Rebuilt: home, `/designs`, `/designs/[id]`, `/pricing`, `/signin`, `/start` (three steps with live phone), `/credits`. Styles live in `src/components/site/site.css` (`ws-*`).
- **Invitations:** new renderer in `src/invite/` (`face.tsx`, `covers.tsx`, `inside.tsx`, `invite.css`), wrapped by `components/invitation/invitation.tsx`. Eight designs: Pearl, Vellum, Gilt, Botanica, Marigold, Zellige, Gallery, Linen. Eight distinct openings: doors (3D fold), lift (drag), bloom (opens from touch), ignite (foil frame draws), script (written in ink), kinetic (type rises), grow (botanicals), petals (falling plates). Legacy design ids map forward (`LEGACY_DESIGN`). Materials are seamless textures from `scripts/tex/make.py` plus the public-domain plates in `public/art`; the earlier generated imagery was removed.
- **Verified:** `tsc`, `npm run build`, 59 vitest tests pass; Playwright screenshots at 390 and 1440 show no horizontal overflow on the rebuilt pages.
- **Not done / honest gaps:** Studio, dashboard and guest pages keep their existing layouts and only inherit the new tokens/fonts (no redesign yet). Each design's inside screen shares one layout with per-design styling. No real-device test, no long-name/RTL fixture pass on the new renderer, no reduced-motion visual check. Photoreal assets (wax, ribbon, fabric) would need paid image generation and an owner decision.

## 11 November 2026 (evening) — photoreal assets and Studio redesign

- **Generated assets** (Figma AI, file "Wedsent assets"): `public/tex/seal.webp`, `ribbon.webp` (white keyed to alpha), `velvet.webp`, `deckle.webp`. Used on Pearl (ribbon + wax seal that fades as the card opens), Vellum and Linen (seal), Zellige (velvet fabric), Vellum (paper fibre). Credits page updated.
- **Studio redesign:** the top bar is gone. Desktop: tool rail, stage with floating back/save, Opening/Inside switch, undo/redo and Publish, and a 420px inspector. Mobile: phone first with the tool bar at the bottom; choosing a tool opens a bottom sheet, the phone shrinks above it, tapping a section of the invitation opens its editor, close returns to a full-size preview. Single stylesheet `studio.css` replaces the two layered ones.
- **Gaps:** mobile phone is small while a sheet is open (~150px wide). Not yet tested on a physical device or with long names/RTL; photo, music and event editors were restyled but not functionally re-tested in the browser this session.
