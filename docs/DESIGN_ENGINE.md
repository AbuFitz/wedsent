# Design engine (as built)

The invitation is the creative product. The engine turns **content** (names, events, wording) plus a **design spec** into a working mobile invitation. Content never depends on a design; switching design keeps every word.

## Model (`src/engine/registry.ts`, pure TypeScript, shared by server validation and client)
- **DesignSpec**: `opening` (envelope, shutter, hold, gates, iris, curtain), `layout` (stationery, cards, editorial, chapters), `art`, `fonts` (default pairing), `palettes[]`, default `intro`, facets for filtering (styles, colours, shape, cultures), and sample content.
- **Palette**: accent plus optional `bg/fg/soft/line` tokens and the artwork assets that palette uses. Contrast is tested (WCAG AA, `tests/engine.test.ts`).
- **FontPack**: curated pairings (head, script, body, caps), all OFL, self-hosted via Fontsource.
- **Intro presets**: optional opening lines (neutral, Islamic, Hindi, Jewish, East Asian) and custom text. Never assumed: a design's default is shown, and "none" is a choice.
- **Content additions**: `palette`, `type` (font pairing id), `intro`; validated by `ContentSchema` (design must be a registered id).

## Rendering
`src/components/invitation/invitation.tsx` resolves spec + palette + font pack into CSS variables (`--a --on-a --bg --fg --soft --line --f-*`), picks a **cover** by `opening.kind` and an **inside** by `layout`. Everything is sized in `cqw`, so one component renders as a thumbnail, in a phone frame or full screen.
- Openings: `src/components/invitation/invitation.tsx` (envelope with optional wax seal, shutter drag, press-and-hold) and `src/engine/covers.tsx` (doors, iris, curtains). All respect reduced motion and have a keyboard path.
- Stationery card: `src/engine/stationery.tsx` + `src/engine/engine.css`. Real artwork cutouts and tinted ornament masks, paper grain, gold foil gradients, per-design composition.
- Multi-event: the guest sees one card per event they are invited to, plus Maps and a per-event calendar file.

## Designs (6) and openings (3)
Openings are deliberately quiet; object metaphors (envelopes, doors, curtains, seals) were removed as cartoonish.
| Opening | Behaviour |
| --- | --- |
| lift | The cover is a sheet: drag/swipe up, tap or press Enter |
| bloom | The invitation opens outward from where you touch (keyboard: from centre) |
| veil | The cover softly clears (fade, scale, blur) |
| Design | Family | Opening | Photo | Art |
| --- | --- | --- | --- | --- |
| Gallery | Editorial | lift | full-bleed cover | none (type over photograph) |
| Linen | Minimal | veil | inside, optional | none (hairline frame) |
| Botanica | Botanical | veil | inside, optional | Redouté / peony / olive plates |
| Arch | Contemporary romantic | bloom | in the arch window | plates when no photo |
| Zellige | Heritage | lift | inside, optional | Owen Jones ornament masks in gold |
| Marigold | Celebration | bloom | inside, optional | marigold plates, toran edge |
No photography is bundled: licensed wedding photography could not be sourced legitimately here (Unsplash blocks automated access and was not circumvented; the museum APIs returned little usable). Photo designs show a tonal fallback until the couple uploads their own. Provide or license photography for marketing use.

## Customisation (what a couple can change)
Design, colour palette (plus custom accent), lettering (11 font pairings incl. scripts), opening line (presets in Arabic, Hindi, Jewish, East Asian, or custom text), names, occasion, message, date and time, venue, street address, city (Google and Apple Maps links), dress code, reply-by date, a cover photograph with focal point, and any number of events with their own address. Photo: resized in the browser (EXIF-aware, ≤1600px JPEG), stored as `/media/:id` for accounts (Postgres bytea, magic-byte checked, 2.5 MB and 40-photo limits) or as a data URL in the local draft when signed out; the local photo is uploaded when the account is created. The server rejects `data:` and third-party photo URLs.

## Artwork provenance (the rule: only public-domain or CC0, each file verifiable)
Source: Wikimedia Commons scans of public-domain plates (Cleveland Museum of Art CC0 Redouté, Edwin Step, Owen Jones and others). `scripts/art/search.py` finds candidates and checks the licence field; `scripts/art/build-assets.py` cuts plants out of the paper (flood-fill matte so pale petals survive), turns black-on-paper ornament into tintable alpha masks, optimises to WebP, and writes `public/art/provenance.json`. `src/engine/assets.ts` mirrors it; `tests/engine.test.ts` fails if any bundled asset is not PD/CC0 or lacks a source page. `/credits` lists every file.
Limits: pale-flower plates (white roses) do not cut out cleanly; yellowed paper leaves faint patches; plates are scanned at ~1280px, so large hero use needs higher-resolution re-cuts. No marble or paper photo textures yet (a CSS grain stands in).
Rejected: procedurally generated "watercolour" shapes (looked amateur), Framer templates and marketplace components (licensed for use inside Framer only), stock sites with attribution or no-redistribution terms.

## Open-source used
Fontsource fonts (OFL-1.1: Cormorant, Playfair, Bodoni Moda, Cinzel, Jost, EB Garamond, Noto Naskh Arabic, Great Vibes, Pinyon Script, Allura, Parisienne, DM Serif Display, Italiana, Marcellus, Tenor Sans, Amiri, Tiro Devanagari Hindi), Phosphor Icons (MIT, multi-weight icon sets), colord (MIT, contrast checks), qrcode (MIT, for sharing, not yet wired), Motion (MIT).

## Adding a design
1. Add a `DesignSpec` to `DESIGNS` (new id also goes in `DESIGN_IDS`). 2. If it needs a new opening, add a cover in `src/engine/covers.tsx` and a case in `Cover`. 3. Add its skin to `src/engine/engine.css`. 4. Reference only assets present in `ASSETS`. 5. Run `npm test` (contrast, asset and licence checks) and look at `/dev/designs?d=<id>` (dev only).
