# Wedsent agent instructions

**OWNER REVISED DIRECTION — 7 NOV 2026, Claude branch:** Read `docs/CURRENT_PRODUCT_PLAN.md` before implementing new frontend work. The owner's approved *direction* is the live phone preview, floating navigation, and simple editing; not the previous global display font, playful Zest graphics, or prototype limitations masquerading as product policy. Use Geist for restrained product typography; allow invitation-specific art direction. Shareable links, real household RSVP, one-price purchase and eventual optional photo hall are core planned capabilities, not discarded ideas. `£39` on `/pricing` is provisional and no payment flow is live. Preserve and improve the newer Claude branch architecture rather than reverting to old homepage versions.

**READ `docs/README.md` FIRST.** It names the current document per topic. `docs/STATUS.md` says what actually works; `docs/BACKEND_V1.md` documents the real backend; `docs/DESIGN_SYSTEM_V8.md` is the only visual authority (all earlier visual directions are in `docs/archive/` and rejected: do not restore them).

**Working mode:** build continuously in vertical slices (UI + API + database + tests + failure states). Do not stop for approval between slices. Stop only for genuine owner decisions (money, rights, credentials, destructive actions) and list them in `docs/STATUS.md`. Be honest: nothing is "working" without a test or browser run; demo-only flows are labelled.

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
10. `docs/BACKEND_V1.md` (as-built backend)
11. `docs/DESIGN_SYSTEM_V8.md` (current visual authority)

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
