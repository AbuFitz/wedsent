# Status and feature matrix — 2026-11-07 (round 3)

**Studio workflow revision (8 Nov):** The previous Finishing mega-panel was split into eight focused editing areas, with task descriptions, next/previous actions, a persistent actual-invitation preview and horizontally scrollable mobile navigation. The Music area now displays a selected recording, album choices and a Wavesurfer Regions-based excerpt editor with native audio fallback, alongside playback mode/volume. Draft shape, server persistence and existing user-uploaded music references are preserved. Production build and unit suite were run locally; visual inspection on real devices, CORS-dependent remote waveform decoding, and owner design sign-off remain outstanding.

**8 Nov RSVP and playback slice:** Published public links `/w/:slug` now provide a public form at `/w/:slug/reply`. Submissions are rate-limited and stored separately from named guest RSVP records, surfaced in the owner Replies tab as **unverified**. Public links cannot reply to private-only events. A feedback link `/share#...` still does not collect RSVP because it is a self-contained preview. Audio now has start/end, volume, and load/open/manual trigger modes. On-load audio is a browser-policy-dependent attempt, never guaranteed. Tested by 40 unit/backend tests and production build; deployment and device audio have not been verified. This slice does **not** implement payments, email, pass issuance, check-in or a complete licensed album.

**Build-mode access update (8 Nov):** Signed-out onboarding now goes directly to Studio, and Studio supports local-only creation, editing and deletion of events. No sign-in is needed to explore invitation designs and the editor. This does **not** bypass owner authentication for server-side guest lists, publishing or private links; those actions remain account-protected. Local drafts/events are tied to the browser and can be lost if its storage is cleared.

**Intro variety update (8 Nov):** The design engine has four opening treatments: lift, touch bloom, veil, and editorial focus. Studio's Style panel allows a non-destructive opening override, with design-specific defaults. It is saved with the wedding draft, validated by the server, and inherits keyboard/reduced-motion handling. This is a foundation for more deliberately art-directed motion, not a complete template library.

**Media and motion experiment (8 Nov):** Added experimental door and curtain opening treatments and signed-in/local build-mode guided photograph upload with focal-point controls. See [MUSIC_MOTION_BACKDROP_RESEARCH.md](MUSIC_MOTION_BACKDROP_RESEARCH.md) for the audio source/licensing study and art-direction gates. No music recordings have been bundled or described as rights-cleared. Door/curtain realism and upload interaction still need visual/device review before release.

**Personal widgets (8 Nov):** Added optional countdown in three visual compositions with editable accent and heading, and independently configurable label languages for details/countdown/reply (English, French, Arabic, Somali). See [WIDGETS_CULTURAL_DESIGN_RESEARCH.md](WIDGETS_CULTURAL_DESIGN_RESEARCH.md). These are **label-only** translations; RSVP forms, owner text, event timezone semantics and native-speaker review remain open work.

**Owner-supplied music (8 Nov):** Studio now accepts an MP3 up to 8 MB after explicit rights confirmation. Guest invitation has an opt-in top-right play/pause control with no autoplay and background-tab pausing. Build mode stores audio locally in IndexedDB; signed-in owners upload through `/api/music` into the `003_music.sql` table, and `/music/:id` supports range playback. The platform **does not provide a curated licensed soundtrack catalogue**; users must have rights to their uploaded recording. Real-device audio playback, legal terms, media lifecycle/deletion and object-storage/CDN migration still require release review. The prior "Music not built yet" placeholder was removed.

Source of truth for what is real. States: **Verified** = covered by an automated test or a browser run this session. **Partial** = built, with named gaps. **UI only** = looks real, is not. **Planned**. **Blocked** = needs something outside the code.
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
