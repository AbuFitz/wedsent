# Wedsent agent instructions

**OWNER'S MOST RECENT DIRECTION — 2026-11-07:** The owner requested the MAIN WEBSITE be rebuilt, not redirected to the Studio, with a modern product company identity, creative Framer-inspired layout and motion, much better type, code-crafted mobile invitation previews, and research-backed opening interactions. Read `docs/SHOWCASE_AND_MOTION_REBUILD.md`. Current `src/app/wedsent-home.tsx` + `.css` is a NEW exploration, not approval or a finished experience. Earlier V2–V7 styling is rejected and must not constrain future art direction. Continue real product and guest functionality alongside the showcase, and keep demo states honest.

**ACTIVE PRODUCT-FIRST RESET (2026-11-07):** The owner has explicitly rejected V2–V6 invitation and website visual implementations. These are NOT a baseline and must not be rebuilt, cloned or polished. Current Studio implementation is `src/app/studio/studio-v7.tsx`, current guest invitation `src/components/invite-experience.tsx`, current RSVP `src/app/invite/rsvp/page.tsx`, and their isolated styles `src/app/product-v7.css`. `/` temporarily redirects into Studio while the **actual product** is developed; do not create another promotional homepage until the invite collection, creator, RSVP and mobile previews are convincing. Visual identity: restrained modern software (Inter/DM Sans, white, near-black, controlled accents, crisp hierarchy, intentional motion); individual invitations have separate art directions. Research Evite, Paperless Post, Partiful, Greenvelope, Joy and modern Framer SaaS rather than wedding-inspired fonts. V7 is still an early frontend-only slice, not a finished product or endorsed design. Never fabricate functioning publishing, payment, sending or guest management.

**LATEST OWNER RESET — 2026-11-07, SUPERSEDES ALL EARLIER CREATIVE APPROVAL LANGUAGE:** The owner rejected the V2–V5 marketing and invitation visual designs. Do **not** preserve their layouts, cream/pastel floral global skin, framed mock invitation cards, generic SaaS section patterns, or design assumptions. The new active exploration is `src/app/home-v6.tsx` and `src/app/design-v6.css`: an almost-white and black contemporary editorial storefront with cobalt action accents, product-led mobile previews, and invitation designs that each possess a different independent creative world (cobalt sculptural, acid-lime expressive, monochrome cinematic). V6 is an implemented research-informed exploration, **not declared approved by the owner or production-finished**. Treat its typography and layouts as replaceable if the visual quality is inadequate. Preserve underlying data/form logic and be accurate about demo-only backend flows. Prior 'APPROVED CURRENT CREATIVE ROUTE' paragraph is historical and revoked.

**APPROVED CURRENT CREATIVE ROUTE (2026-11-07):** The owner explicitly approved the mature-pastel editorial direction shown in the concept board with warm ivory, sage, lavender, blush, organza, carefully crafted high-contrast serif type and understated sans UI. Also requested Folira-inspired floating pill navigation and aperture-style expanding invitation gallery. Implemented first coherent pass in `src/app/home-v5.tsx`, `src/app/theme-v5.css` and shared invitation/Studio/RSVP styling. This is the active foundation, but the underlying invitation renderer and real backend remain works in progress. Do not revive home-v2, home-v3, home-v4 or their anti-patterns; those files are preserved for audit only. Do not treat the concept image as licensed production artwork: production uses separately generated original organza artwork.

**LATEST OWNER VISUAL DIRECTION (2026-11-07): PRODUCT FIRST, CLEAN AND MODERN.** Read `docs/DRIBBBLE_PRODUCT_FIRST_RESET.md` before touching marketing or Studio aesthetics. The owner rejected the original marketing designs **and** the expressive floral concept. Current public homepage is `src/app/home-v4.tsx` / `v4.css`. Its direction is *exploratory*, not blanket approval. Never restore the floral campaign, ticker/benefit strip, huge italic headlines or repeated full-width promotional banners. Make actual invitation designs and practical UI the visual content, with precise typography and excellent layout. Dribbble shots are references, **not licensed image/component assets**.

**CRITICAL OWNER FEEDBACK (2026-11-07): BOTH IMPLEMENTED VISUAL DESIGNS ARE REJECTED.** Before any further marketing, invitation or Studio styling, read `docs/VISUAL_RESET_AND_REFERENCE_ATLAS.md`. Treat `src/app/home-v2.tsx`, `src/app/v2.css`, `src/app/studio/studio-v2.tsx` and current visual compositions as **discardable functional scaffolding**, not an approved UI baseline. The owner called them cheap, AI-generated and formulaic. Do not preserve layout/typography/colour decisions by inertia. Research real live websites, develop and show original comprehensive scenes, then rebuild. Do not simply recolour or rearrange their existing blocks.

**Active build instruction:** Read `docs/CONTINUOUS_BUILD_DIRECTIVE.md` and execute its continuous implementation programme. Do not pause after every task packet awaiting another user instruction; ship coherent deployable slices and keep building, except for genuinely blocking permissions/commercial decisions.

**Visual direction:** Read `docs/ART_DIRECTION_V2.md` before touching the marketing site, Studio or invitation renderer. The first prototype styling was explicitly rejected by the owner. Its CSS/layout is not precedent. The subsequent editorial implementation is itself an exploratory direction, **not locked or approved**. Improve or replace it using real references and human visual judgement.

This repository is an invitation product, not a generic wedding CRM. The first priority is a beautifully art-directed mobile invitation and a guided Studio, with reliable guest permissions and RSVP correctness.

Before implementing **any** feature, read in order:
1. `docs/PRODUCT.md`
2. `docs/ARCHITECTURE.md`
3. `docs/FLOWS.md`
4. `docs/ENGINEERING_PLAYBOOK.md`
5. `docs/OPEN_SOURCE.md`
6. `docs/CREATIVE_SYSTEM.md`
7. `docs/UX_SCREEN_CONTRACTS.md`
8. `docs/SOURCE_CODE_AUDIT.md`
9. `docs/DECISIONS_AND_RELEASE_GATES.md`
10. `docs/ART_DIRECTION_V2.md`
11. `docs/VISUAL_RESET_AND_REFERENCE_ATLAS.md` (overrides rejected styling recommendations from earlier docs)

Mandatory working rules:
- Map every user journey to a flow ID; update diagrams and exception states before writing feature code.
- Research current primary-source implementations and check licence/asset rights before reusing code.
- Do not copy K-Invites (all rights reserved) or projects with unknown licences; study ideas only.
- No forced cultural categorisation. Culture-aware ceremony/wording support must remain optional.
- Build a curated, constrained but capable design engine, not a generic drag/drop canvas as MVP.
- Never claim a clickable prototype, integrations, billing, publishing or photo sharing works unless end-to-end tested.
- Use actual data persistence, scoped permissions, idempotency, error states, loading, retries and audit trails.
- Treat private RSVPs and Photo Hall uploads as sensitive. No guessable public IDs for private guest or media access.
- All design work requires mobile + desktop review, long-name/RTL/no-photo fixtures, contrast and reduced-motion checks.
- Creative templates require the complete `CREATIVE_SYSTEM.md` dossier, production reference analysis, honest visual review and artwork provenance before being considered finished.
- Implement every relevant `UX_SCREEN_CONTRACTS.md` state, not just the attractive screenshot state. Use `SOURCE_CODE_AUDIT.md` as the beginning of *actual code-level research*, not an exhaustive vendor approval.
- Check the unresolved decisions and R0–R4 release gates; do not invent paid product policies or quietly ship unverified rights/terms.
- Marketing copy/showcases must reflect implemented functionality. Never fabricate metrics, testimonials or customer examples.
- Use short, clear, contemporary copy. Avoid corporate CRM labels and forced TikTok slang.
- After each build packet update the relevant docs, provide test evidence and note blocked paths.

Initial packet order: P01 foundation -> P02 auth/database -> P03 renderer/three real designs -> P04 Studio -> P05 guests/RSVP -> P06 publishing/checkout -> P07 media/comms -> P08 real marketing showcase -> P09 optional Photo Hall -> P10 hardening/pilot.

A task is complete only when its flow works from UI to server to persistence and back, including relevant failure branches.
