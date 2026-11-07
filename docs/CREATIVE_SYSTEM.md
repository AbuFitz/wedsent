# Wedsent creative production system — design before implementation, verify after

> **Mandatory.** This document defines the art-direction and production quality bar. The current `Sway`, `Noor` and `Afterglow` implementations are *rough prototypes*; they are not approved production designs. Never confuse CSS polish with art direction.

## The job of the creative agent

Produce digital invitation experiences people want to send and guests want to open. Avoid a theme marketplace where 12 designs are one DOM tree with different background images. Avoid wedding clip art, repeated rounded cards, generic AI-generated floral backgrounds, shiny 3D for its own sake, excessive animations or an inaccessible giant editor.

Each design is a **mini creative project** with an explicit visual hypothesis and finished assets. The output is a working browser experience, not a moodboard alone.

## Six-stage creative pipeline

1. **Source discovery:** collect *at least six* relevant examples per proposed collection across editorial print, art-directed brand sites, packaging, typography, photography, wedding stationery, cultural craftsmanship and interaction design. For each log URL, date, rights and precisely what design principle is worth studying. No copying unlicensed assets or compositions wholesale.
2. **Composition studies:** build three visibly different static *mobile-first* compositions for the chosen collection. Include a no-photo variation, long-name typography and a ceremony-rich variant. Save screenshots or Figma frames. State what is distinct about the grid, negative space, sequencing and silhouette.
3. **Art direction review:** pick one composition using scorecard below. Refine line-break decisions, typography, ornament geometry, palette, rhythm and legibility. Reject look-alike variants before engineering.
4. **Interaction storyboard:** document opening frame, interaction trigger, reveal order, duration and skip/reduced-motion behaviour. Motion should emphasise the content, not delay the RSVP.
5. **Reusable implementation:** component and configuration schema; controlled edit zones; media fallbacks; accessible HTML; render in guest view and Studio from **one renderer**; visual regression fixtures.
6. **Inspect and iterate:** capture actual Chrome/Safari mobile views, desktop, low bandwidth, 200% zoom, RTL and reduced motion. Compare screenshots to concept. Record deviations and fix them before marking complete.

### Required design dossier (`designs/<id>/DESIGN.md`)

| Field | Mandatory output |
| --- | --- |
| Title and concept | One-line feeling, target audience, distinctiveness claim |
| Evidence | 6+ source references with notes on geometry/type/motion, not just a link dump |
| Frames | Entry, opened hero, details, schedule, RSVP, share-card, empty/no-photo |
| Type | Font families, licensing, optical sizes, line length, fluid rules, Arabic pairing |
| Composition | Grid measurements, alignment, whitespace, focal hierarchy, image crops |
| Colour | Tokens, contrast tests, light/dark adaptations, accessible text variants |
| Ornament | Original SVG or legitimately licensed assets; stroke, scaling and cropping rules |
| Animation | Motion storyboard with durations, interaction cues, reduced-motion fallback |
| Edit contract | Which properties users may change, allowed ranges, how layout integrity is preserved |
| Fixtures | 1/2/3 names, 70-character names, no photo, 4 events, RTL, no sound, small screen |
| Proof | Browser screenshots, keyboard/a11y checks, bundle/performance checks |

## Collections — specific starting creative hypotheses

These are **creative briefs**, not shipped template claims. Only release designs that can be distinguished at a glance in silhouette, grid and motion.

| ID / working title | Composition | Typography | Motion concept | Editing guardrails |
| --- | --- | --- | --- | --- |
| **Sway / The Editorial** | Giant cut-edge typography, black-and-paper layout, asymmetric mini index | High-contrast display + restrained grotesk | Typographic curtain reveal | Protect text line breaks; palette/photography/crop approved |
| **Noor / The Arch** | Multi-line arch geometry and fine concentric ornament, balanced central procession | Elegant Arabic-aware serif + small caps | Layered aperture expands into details | Original SVG arch, no stereotype-based auto-content |
| **Afterglow / The Film** | Full-bleed couple photograph with contrasting caption cards and film-grain margin | Italic display + disciplined sans | Slow crossfade/focus shift, skippable | Strong accessible image overlay; photo optional |
| **Still / The Minimal** | Very spare offset rules and massive negative space | Ultra-clean grotesk + one expressive italic | Lightweight line-draw and name reveal | No user canvas dragging; curated alignments |
| **Aster / The Garden** | Botanical illustration as border framing with split image/text stage | Delicate editorial serif | Natural sequential mask reveal | Carefully licensed or original botanical assets |
| **Sahara / The Texture** | Rich tactile paper, disciplined geometric pattern, no stock desert imagery | Monumental contrasting serif | Warm light-and-paper fold | Respectful abstract visual inspiration, no culture labels forced |
| **Velvet / The Night** | Deep tonal full-screen invitation with gold-like fine detail | Tall expressive display | Subtle spotlight and depth | Contrast measured; no unreadable metallic text |
| **Lilt / The Modern Romance** | Playful two-column editorial collage with off-grid photographs | Rounded grotesk + playful italic | Cards separate and reassemble | Preserve visual balance when photos omitted |
| **Ribbon / The Ceremony** | Long vertical announcement scroll, delicate ribbons and date block | Small caps + dramatic serif | Ribbon unfurls to itinerary | Responsive timeline for many events |
| **Monogram / The Personal** | Original letterform mark leads; invitation revealed underneath | Custom paired initials + traditional book type | Initials transition to names | Monogram generator with fallback for non-Latin scripts |
| **Bloom / The Colourist** | Confident graphic shapes, asymmetric saturated colour fields | Modern expressive display | Colour planes slide into alignment | Curated, contrast-checked palette families |
| **Élan / The Destination** | Destination-inspired travel journal, map-like annotation and photo strip | Travel editorial serif + functional sans | Foldout itinerary | Real map links; no invented destination facts |

**Launch gate:** build *three* excellent designs first and prove they remain excellent under user edits. Expand to 12 only when the design contract and rendering framework work. No fake 'coming soon' collection cards pretending to be purchasable.

## Editing experience — complexity hidden, creativity preserved

- Owner should reach a convincing personalised result quickly: start design → names → events/date → look → review; optional extras progressively disclosed.
- Always show live guest perspective; allow distraction-free full-screen preview. Preview must render the *same* components and content as published invitation.
- Expose high-value controls: photo/crop, colour family, approved font pairing, illustrated motif, entrance style, section visibility, text and gallery ordering, music from licensed catalogue.
- Protect artistic integrity: constrained style tokens, minimum type sizes, sensible palettes, legal image aspect ratios, dynamic safe areas, typography fit rules. Advanced settings remain optional.
- Each editable control requires: label, current selection, reset, validation, undo/redo policy, save status, responsive behaviour and sensible default.
- Switching themes must preserve semantic wedding content, images and guest data. If a theme cannot represent a feature, warn before applying; never silently delete.
- Handle switching during pending autosave, multi-tab conflict, offline edits, outdated schema and failed media upload without corrupting a published invite.
- Use Undo/Redo for editor actions with tested revision semantics; browser-local preview may be simpler but must be labelled as such.

## Motion and multimedia policy

- **No autoplay audio promises.** Mobile browsers usually require user gesture. Sound starts muted or explicitly opt-in; media credits/rights logged.
- Never gate essentials behind animation. Provide skip/open-now; respect `prefers-reduced-motion`, reduced-data preferences and slower devices.
- Design target: entry feels delightful but details are accessible instantly. Meaningful interaction should remain under user control; long decorative sequences become optional.
- Default CSS/Motion for 2D; introduce Three.js/WebGL only if materially superior and proven on low-end phones. Provide static fallback, lazy load, and teardown on navigation.
- Export a static OG image for social shares; the share card must not expose private guest name, location, hidden event or token.

## Quality gates and review rubric

Each design scored by a reviewer against actual screenshots, 1–5:

1. **Distinctiveness:** unlike other Wedsent templates and generic design-market output.
2. **Art direction:** coherent hierarchy, composition, deliberate typography and imagery.
3. **Emotional impact:** opening feels personal and premium without gimmick.
4. **Customisation resilience:** remains attractive with long/RTL names, no images, multi-event content.
5. **Guest usability:** venue/date/RSVP readable and accessible quickly.
6. **Mobile performance:** smooth on representative low-powered Android and iPhone; no blank screens.

Require **at least 4/5 in every dimension** for release. This is an internal creative acceptance threshold, not a proven market metric. A person (owner/design reviewer) ultimately approves subjective art direction; automated tests cannot certify taste.

## Production asset workflow

- Save editable originals and reproducible derivatives; use original vector motifs, licensed typefaces, cleared stock/photo assets and authored textures.
- For AI-generated imagery, record model/source and commercial usage terms, check for faces, cultural insensitivity and visual artifacts; do not imply invented scenes are customer weddings.
- Do not hotlink third-party image CDNs for core production designs without rights and reliability review. Download/licence/store assets with optimisation, focal points and alt descriptions.
- Keep a design manifest with source/licence/attribution, export sizes, intended crops and responsive quality checks.

## Creative toolchain evaluation

- **Research and storyboard:** Figma (if connected), browser screenshots, licensed editorial references; document compositions in repo.
- **Motion:** Motion AI Kit skill (`npx motion-ai` after reviewing installer and version), Motion React; benchmark GSAP if a storyboard genuinely needs timeline complexity.
- **2D/3D:** SVG + CSS transforms first; React Three Fiber for targeted effects only, with fallback. Libraries are implementation tools, **not creative directors**.
- **Component/visual QA:** Storybook stories or equivalent fixture routes, Playwright snapshots at 360/390/430/768/1440 widths, keyboard/axe checks. A reference board plus screenshots must be reviewed by a person.
- **Imagery:** image-generation/editing skill for legitimately generated artwork, followed by asset rights and fidelity QA; art-directed original SVG for scalable ornament.

## Anti-patterns to reject in code review

- Twelve presets sharing identical layout and only swapping colour/font/background.
- A decorative splash screen taking precedence over dates or RSVPs.
- A generic SaaS dashboard full of cards instead of a calm composition-focused workspace.
- Typefaces sampled without proper licences or script support.
- Styling only one idealised example; long names/Arabic/no-photo layouts break.
- Fake share/send/checkout success; broken or empty controls; inaccessible interactive divs.
