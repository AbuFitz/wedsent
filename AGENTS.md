# Wedsent agent instructions

**Active build instruction:** Read `docs/CONTINUOUS_BUILD_DIRECTIVE.md` and execute its continuous implementation programme. Do not pause after every task packet awaiting another user instruction; ship coherent deployable slices and keep building, except for genuinely blocking permissions/commercial decisions.

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
