# Wedsent agent instructions

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
