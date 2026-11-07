# Wedsent — continuous implementation directive

**Mission:** Build the platform, not another blueprint. Work continuously through vertical slices, committing deployable code as you go. Do not pause at the end of each packet to ask whether to continue. Ask the owner only for an actual blocking decision (such as expenditure, production credentials, a legally consequential decision, or an irreversible operation). When blocked on one integration, continue independent work and clearly record the dependency. Do not fabricate a completed feature.

## Current baseline

The repository now has an initial Next.js marketing experience, three distinct preliminary invitation skins, a browser-local Studio with editable names/date/venue/message/look/accent, a guest-view route and a **demo-only RSVP**. The design quality is a starting reference, not the final Wedsent visual standard. Drafts are stored **only in browser localStorage**. There is no user authentication, database, live RSVP, publishing, payment, outbound email, licensed music or Photo Hall yet. Do not claim otherwise. The marketing site says early preview.

## Read and execute

1. Read `AGENTS.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/OPEN_SOURCE.md`, `docs/FLOWS.md`, `docs/ENGINEERING_PLAYBOOK.md`, `docs/CREATIVE_SYSTEM.md`, `docs/UX_SCREEN_CONTRACTS.md`, `docs/SOURCE_CODE_AUDIT.md`, `docs/DECISIONS_AND_RELEASE_GATES.md` and `docs/ART_DIRECTION_V2.md` in full. Keep them accurate as implementation evolves.
2. Build the creative engine **and** robust application in a continuous run. Deliver real commits, screenshots, tests and Vercel previews. The platform must visibly advance, not merely gain Markdown files.
3. Before adding each subsystem, inspect relevant mature open-source code paths (not just READMEs), tests, licences and vulnerabilities. Record precise reusable patterns; never copy all-rights-reserved or unknown-licence code.
4. Establish Figma/reference-backed art direction and a reusable creative playground following the six-stage `CREATIVE_SYSTEM.md` pipeline and review rubric. Generate at least three truly differentiated production-quality layouts and motion systems; no same layout with different backgrounds. Evaluate mobile/RTL/long names/no photo/slow network. Use visual screenshots to refine, not a generic component kit aesthetic.
5. Build a real Studio: account and wedding creation, versioned templates and content schema, autosave to backend, draft/published versions, guided step flow, editor undo, responsive preview, editable events, permission-aware share controls, and errors/recovery.
6. Build PostgreSQL schema and tenant-safe APIs for ceremonies, venues, guests, households, event-level allocations, invite tokens, responses, changes, exports, permissions, audit trails. Prove F01–F07 end-to-end with browser + DB evidence.
7. Build one-price checkout, verified webhooks, sending, reminders, share-card metadata and expiry policy only when pricing/hosting terms and provider access are confirmed. Share via native WhatsApp intent initially; never falsely claim automatic delivery.
8. Build Photo Hall after the core is reliable: photographer-only scoped upload, staging, moderation, approved guest access, bulk downloads, rights, quotas, retention. Cover F08–F10 and security/privacy constraints.
9. Make the marketing site a high-end editorial showcase of **real implemented invitations**, interaction, Studio, guest flow and culture-flexible events. Research design references, use clear young contemporary copy without fake slang, and avoid false testimonials/feature claims.
10. Continuously run accessibility, mobile browser, performance, API, state and security tests against the `UX_SCREEN_CONTRACTS.md` state matrix and the R0–R4 evidence gates. Revisit broken UI and bugs immediately when discovered; keep a brief outstanding-issues list.

## Iteration rules

- End each meaningful development slice with a coherent commit and a deployable state; use the linked Vercel project so the owner can inspect progress.
- Provide concise progress notes at natural milestones, not approval gates or long status walls.
- Prefer implementation/prototyping over restating research. Keep the diagrams updated with actual route/API/test traceability.
- Never declare 'everything complete' while any critical workflow, permission, failure branch or test remains missing.
- Preserve the vision: easy setup, very high visual standard, curated-but-rich customisation, culturally flexible multi-event weddings, no CRM overload.

## Immediate next actions

1. Verify build/TypeScript and first Vercel deployment; inspect mobile screenshots and correct layout defects.
2. Review the second-pass editorial homepage/Studio and three rendered invitation compositions against `ART_DIRECTION_V2.md`. They are **explorations, not approved final art**. Improve them with actual visual references, responsive screenshots and human art-direction feedback rather than anchoring to existing components. Establish proper token/schema contracts and test customisation in Studio.
3. Provision and link DB/auth properly; convert local preview data into private persisted drafts, retain an explicit no-account guest view.
4. Implement realistic wedding/event/household RSVP flows and production-ready publishing. Then continue through every contract above without waiting for another 'proceed'.
