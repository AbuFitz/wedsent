# Design system V8 — full visual and workflow reset

**Date:** 2026-11-07. **Status:** active. Supersedes every earlier visual document (`ART_DIRECTION_V2`, `VISUAL_RESET_AND_REFERENCE_ATLAS`, `DRIBBBLE_PRODUCT_FIRST_RESET`, `PASTEL_EDITORIAL_SYSTEM`, `PRODUCT_FIRST_RESEARCH_V7`, `SHOWCASE_AND_MOTION_REBUILD`) for anything visual. Those files are history. The architecture, product, flows, open-source and release-gate docs are unchanged and still binding.

## What was scrapped
All V2–V7 CSS, home pages, Studio, invitation renderer, RSVP and print styling, plus the floral artwork in `public/art`. The 6-step Studio form wizard was replaced, not restyled.

## Stack
- `motion` (the Framer Motion engine) for springs, drag, hold gestures, `useScroll` sticky storytelling, `AnimatePresence`. `MotionConfig reducedMotion="user"` is set globally.
- Self-hosted variable fonts via `@fontsource*` (no network at runtime). **Site and product: Geist (UI, body, tool headings) + Instrument Serif (marketing display headings).** Bricolage Grotesque was judged childish for the brand and now appears only inside the Monolith invitation. Fraunces removed. Vermilion and Nocturne use Instrument Serif.
- Plain CSS. Tokens in `src/app/globals.css`; invitation renderer in `src/components/invitation/`.

## Product identity
Cool neutral paper `#F4F4F2`, white surfaces, ink `#0E0E10`, one signal colour `#5B3DF5` used only for focus and selection. The product stays quiet; each invitation brings its own colour and type. Big tight Bricolage headlines, sentence case, no all-caps eyebrows, no numbered section markers, no floral or pastel skin.

## Invitation renderer rules
- Everything inside `.inv` is sized in `cqw/cqh`, so one component renders as a 62 px thumbnail, in the phone frame, or full-bleed on a phone. Never put `cqw` on the container element itself: it resolves against the *ancestor* container (this caused the thumbnail bug).
- Three independent designs, each with its own cover, opening gesture and inside layout:
  | Design | World | Opening |
  | --- | --- | --- |
  | Zest | Tangerine, Fraunces italic, sticker cards | Tap the envelope (flap, card rise, drop away, ~1.4 s) |
  | Monolith | Paper, condensed Bricolage, hard rules, one colour | Drag the cover up like a shutter; spring back if released early |
  | Nocturne | Near-black, Instrument Serif, glow | Press and hold a ring (~1.15 s); letters blur into focus |
- Openings are short, skippable by keyboard/AT (`click` with `detail === 0` opens immediately), and reduced-motion opens on a single tap. `/invite` plays the opening once per session per invitation, then skips it (pattern seen at Punchbowl; Greenvelope's ~7 s reveal is too slow).
- Accent colour is overridable; text colour is computed for contrast (`onColor`).

## Studio workflow (new)
Canvas-first: live phone is the product, a four-tab panel (Design, Words, Details, Style) edits it, Opening/Inside toggle shows both states. Mobile uses a collapsible bottom sheet. Home hero captures names and date first and carries them into Studio (matches `PRODUCT.md`: preview before account). Validation is inline (empty names, missing or past date).

## Honest state (do not overstate)
Working: designs, live preview, local draft (`localStorage` key `wedsent-draft-v8`), ICS download, map link, reply flow as a **preview** (stores one demo reply locally, sends nothing), A5 browser-print layout.
Not built: accounts, server persistence, publishing and share links, real RSVP storage and guest lists, payments, music, photos, multiple events. The home page lists this plainly.

## Research notes
- Motion/Framer: spring defaults for UI, MotionValues for scroll-linked values (no React re-render), tall outer + `position:sticky` inner for scrollytelling, `viewport.once` reveals. Community guidance only; verify against official Motion docs when changing APIs.
- Invitation openings: Paperless Post drops an open-flap envelope that falls away; Greenvelope personalises per guest (~7 s); Punchbowl plays once then skips. Deliberate friction raises perceived value only if short. No independent RSVP-rate data found, so treat opening effects as brand/delight, not a measured conversion lever.
- Not yet reviewed against live sites: Partiful, Evite, Joy. Do that before adding designs 4+.

## Known gaps / next
Test fixtures for long names, RTL and no-message still need a pass. Screen-reader testing not done. Dev-only: verify `inert` behaviour on Safari. Designs 4–12 from `CREATIVE_SYSTEM.md` are not started.


## Marketing site structure (rebuilt 2026-11-07, round 2)
Research (Joy, Partiful, Paperless Post, Greenvelope homepages; Framer wedding templates such as Amorette, Bellure, Invitara; 2026 SaaS landing-page guidance): product-first hero, a short "one link, everyone's in" story shown with real screens, a transparent feature index, plain trust facts instead of invented metrics, visible one-time pricing (Greenvelope lists from $19, a useful benchmark for D01).
Sections in `src/components/site/`: hero with live phone and name/date capture -> plain-facts strip -> **How it works** (scroll-pinned: Studio with live typing, household links, household reply, host counts; built from the real components' styles, labelled as example data) -> design tour (three live invitations) -> feature index (6 tiles, each with a miniature of the real UI) -> price teaser -> FAQ -> closing. Framer templates are licensed for use inside Framer only; they were studied for structure, not reused.


## Site identity update (2026-11-08)
Direction after the owner called the site childish: warm white `#FAF8F4`, ink `#171410`, hairline rules instead of cards and pills, 6–10 px radii, rectangular buttons. Type: **Newsreader** (OFL) for display headings at restrained sizes (about 44–88 px, weight 300–400, tracking about -0.02em), **Geist** for UI and body. One hero with a single phone whose only interaction is adding your own photograph. A real configurator (same renderer as the product) replaces illustrations. No phone fans, gradient blobs, giant condensed type or notched tickets. Reference calibration: Zola and Joy (photography-led, one action), Evite (upload-your-own as a first-class path), Amorette (quiet editorial). Audit rules from the Vercel Web Interface Guidelines apply (focus states, `touch-action`, reduced motion, no `transition: all`).
