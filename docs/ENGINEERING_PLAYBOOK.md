# Wedsent engineering playbook — agents, tools, build machinery

> This document is an actionable developer operating system, not a suggestion list. Read alongside PRODUCT.md, ARCHITECTURE.md, OPEN_SOURCE.md and FLOWS.md before implementation. The repo currently contains plans only; no app is implemented.

## Outcomes

Create an exceptionally polished, fast, accessible mobile-first invitation product with a powerful but guided Studio, robust guest operations, and an optional Photo Hall. Avoid generic AI-generated UI, complexity theatre, fake features or half-finished demo controls.

A feature is **not built** because a page exists. It is built when the user journey, storage, permissions, unhappy paths, mobile UX, visual quality, observability and regression tests are proven.

## Working method (mandatory per packet)

1. Read full project contracts and the relevant flow diagram. Identify all actors, states, branches, data records and errors.
2. Research the best existing primary-source implementation before inventing architecture. Inspect licence, code paths, tests and API contracts; note adoption decision in OPEN_SOURCE.md.
3. Sketch the complete desktop/mobile information architecture. Make real sample content and realistic edge cases.
4. Define the component and API contracts, roles, state transitions, database constraints, event taxonomy and error surfaces.
5. Implement vertical slices, including loading, empty, validation, failures, permission denial, rollback, resend, delete, and stale data.
6. Inspect browser screenshots at target viewports, touch behaviour, motion, typography and contrast. Revise until intentionally art-directed.
7. Verify browser -> API -> DB/storage -> response for the full user story. Add regression tests and evidence.
8. Update flow status, decisions, change log, and the next handoff. Never claim an untested integration works.

### Definition of done

- All applicable FLOWS.md nodes are connected to real routes/actions with proper errors.
- Security: tenant isolation, least privilege, CSRF/session handling, token hygiene and rate limiting.
- Persistence and idempotency: refresh/retry/concurrent edits do not duplicate or lose data.
- Accessibility: focus order, text alternatives, keyboard and screen-reader usability, reduced motion.
- Responsive UX: 360/390/430px mobile, tablet, desktop; safe areas and keyboard overlays.
- Performance: budgets for opening animation, image size, hydration and critical path; low-end mobile test.
- Real content: long names, RTL text, no photo, multiple venues, large guest lists, offline/slow connections.
- Tests: unit, API integration, E2E, visual regression and security/privacy cases appropriate to the feature.
- Screenshots and test results documented; no screenshot-only assertions of functionality.
- Licence and dependencies recorded; no unclear-provenance assets shipped.

## Preferred technology map — proposed, verify against live docs before implementation

| Workload | Candidate | Why / guardrails |
| --- | --- | --- |
| Marketing, Studio, invitation renderer | Next.js App Router, TypeScript, React | Shared rendering and composition, SEO/OG, server/client boundaries |
| Design system | Tailwind CSS, CSS variables/tokens, Radix/shadcn primitives where appropriate | Foundations, not ready-made generic dashboard aesthetics |
| Motion | Motion, CSS transitions, small GSAP usage if justified | Beautiful but skippable; reduced-motion; no unnecessary global animation |
| 3D | CSS transforms first; React Three Fiber for specific scenes | Don't make every invite a GPU-heavy app |
| Database | Postgres with structured migrations and query layer (Drizzle or Prisma after decision) | Relational multi-event/household integrity, constraints, audit history |
| Authentication | Verified auth provider or library, server-enforced role permissions | Owner/collaborator separate from guest token capabilities |
| APIs | Next.js Route Handlers / Server Actions where security model appropriate | Validation, idempotency and typed errors |
| Persistent assets | Private object storage, image-processing pipeline, signed URLs | Photo Hall quotas, separate raw/derivative media |
| Payment | Stripe one-time Checkout and verified webhooks | Publish entitlement only on confirmed transaction |
| Email | Resend + React Email (or equivalent) | Transactional delivery logs and bounce handling |
| Async jobs | Queue for thumbnailing/email; durable Workflow for multi-stage tasks when useful | Don't run heavy image processing in response request |
| Analytics | Privacy-minimised product events and opt-in marketing measurement | Do not leak guest data or private invites |
| Monitoring | Structured logs, error tracking, traces, alerts | Trace from public RSVP to DB row, exclude PII |
| Test | Vitest, Playwright, axe-core, visual snapshots | Browser + API + data boundary evidence |
| Component sandbox | Storybook (optional but recommended for templates and design variants) | Story states, long/RTL content, responsive review |
| Diagrams | Mermaid diagrams committed with source | Architecture and error states as maintained contracts |

Server architecture decision should follow workload: request/response in Functions; queue for burst processing; durable workflow for multi-step jobs; Postgres geographically close with connection pooling; object store for files. Confirm hosting products and limits at deployment rather than assuming.

## Coding-agent skills and tool use

These are **recommended skills/references to install or invoke during implementation**, not evidence they're already installed in the repo:

- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices): React/Next performance, server/client boundaries and rendering review.
- [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines): interface quality, accessibility and UX review.
- [Motion AI Kit](https://motion.dev/docs/ai-kit): documented `npx motion-ai` installer for the Motion skill and documentation tools, useful when authoring animation. **Run only when package version and installation scope are understood.**
- [Playwright visual snapshots](https://playwright.dev/docs/test-snapshots): regression baselines at mobile/desktop sizes and animation-disabled states.
- [Mermaid](https://github.com/mermaid-js/mermaid): source-controlled diagrams. Update with each changed flow.
- [React Email](https://react.email/): branded transactional email rendered and tested from components.
- Project-specific agent roles: Product/UX architect, Brand/Art direction, Frontend/Interaction, Backend/Security, QA/Accessibility. These are review lenses, **not a claim multiple agents have worked**; the same coding agent can execute the checklists in sequence.
- Local configured skills can help with Vercel backend/storage/functions, React code review, testing, browser interaction, GitHub repository work. Read their current instructions before invocation.

### Skills are not substitutes for evidence

No install-everything script. Choose skills by work packet, test tools on a small case, and record the output they changed. Paid skills/components require explicit licence and cost review. Random UI inspiration scraped from code galleries must not be shipped unlicensed.

## Open-source reuse map

See OPEN_SOURCE.md for detailed licence notes.

1. **Invitation/guest:** OpenInvite (MIT) for RSVP/delivery patterns; InviteKit (MIT) for guest-link permission ideas. Adopt one native database/auth boundary, not Firebase plus a second redundant auth stack.
2. **Cultural templates:** K-Invites has useful architectural inspiration but an all-rights-reserved LICENSE. Study concepts; do not copy source/assets.
3. **Creative renderer:** Motion (MIT), Howler.js (MIT), React Three Fiber (MIT), Konva (MIT) if needed. The curated renderer is Wedsent-owned.
4. **Photo Hall:** Guestroll (MIT) for QR upload/moderation patterns and PicPeak (MIT) for photographer galleries/client proofing. Integrate narrowly; do not transplant an entire media SaaS.
5. **Email:** React Email (MIT) for transactional templates; design Wedsent-specific copy and layouts.
6. **Large editor clones:** Doory has prominent attribution requirements and a much heavier UX; Polotno is commercial. Neither is a default public editor foundation.

## Marketing website — design direction

The landing page is a **creative product showcase**, not a feature-list SaaS template. No repetitive cream card stacks, generic gradient blobs, template mockups pretending to be working pages, or hollow animations.

### Proposed information architecture

1. **Navigation:** Wedsent wordmark, Designs, How it works, Pricing, Sign in, primary 'Make your invite'.
2. **Hero:** dramatic real invitation opening embedded in an editorial composition; concise copy, one strong CTA, a real 'Explore invitations' action.
3. **Design gallery teaser:** four to six interactive live examples, different art directions, real mobile/desktop inspection. No fake screenshots. Filter by style/mood, optional ceremony support.
4. **How it comes together:** choose a design -> make it yours -> send and track. Small, highly composed visual sequence, not stock feature cards.
5. **Creative customisation showcase:** before/after states for names, colours, scenes, music, section layouts, RTL/long-name resilience. Demonstrate real builder behaviour.
6. **Personal guest experience:** named envelope -> reveal -> RSVP, with an interactive guest-perspective preview.
7. **Guest management:** tasteful, true-to-product UI showing households, multi-event headcounts, pending reminders, exports.
8. **Optional Photo Hall:** after real implementation, demonstrate photographer upload -> couple approval -> private guests. Label availability accurately.
9. **Culture-aware story:** examples spanning Nikah, Walima, Mehndi, reception and civil ceremony without stereotyping or locking design categories.
10. **Pricing:** one transparent one-time price, exact hosting/media terms, no hidden guest charges if operationally valid.
11. **FAQ, privacy and footer:** music licences, guest accounts, link privacy, RSVP changes, photos and retention.

### Editorial art direction

- Contemporary, emotionally warm, confidence of a design studio. Typography-led; avoid cartoon wedding clip-art.
- Premium serif + modern grotesk/sans combinations, tuned by collection; avoid an identical typography treatment everywhere.
- Large full-bleed real product previews, honest device framing, layered but restrained motion, real photography with rights.
- Contrast-rich light/dark compositions, rhythm and art direction instead of repetitive boxed cards.
- Each gallery item is a different invitation design with distinct composition and motion—not a recoloured generic hero.
- Mobile is the primary canvas. Touch-based inspect, smooth sheet/modal, readable full-screen invitation, no horizontal overflow.
- The public site must remain fast; load immersive examples on interaction or when visibly near screen.

### Copy system: youthful, natural, not forced slang

Brand line candidates (copy experiments, not final claims):
- 'Your people. Your day. Beautifully sent.'
- 'An invite worth opening.'
- 'The big day starts here.'
- 'Make it yours. Send it beautifully.'
- 'One lovely invite. Everyone in the loop.'

Hero draft: **'An invite worth opening.'** Supporting: 'Create a wedding invitation that feels like you. Add the details, make it beautiful, share one link and keep every RSVP together.' CTA: **'Make your invite'**. Secondary: **'Explore designs'**.

Feature microcopy:
- 'Who's coming?' not 'Attendee analytics'.
- 'Still waiting on 12 replies' not 'Unconfirmed lead count'.
- 'Send a gentle reminder' not 'Execute campaign'.
- 'Share your invite' not 'Initiate distribution'.
- 'Preview as a guest' not 'Render public output'.
- 'Your changes are saved' with actual persisted confirmation, not optimistic fake success.

Marketing rules:
- TikTok scripts should show the first 2 seconds of a *real* invitation reveal; use genuine phone recordings, not conceptual claims.
- Hook examples: 'Imagine your guests opening this', 'A wedding invite they'll actually remember', 'Same details, completely different look'.
- Never fabricate customer reviews, counts, conversions or availability.
- No 'AI-powered' headline merely because agents helped build the product.
- Accessible inclusive language and genuinely representative cultural examples.
- The full gallery can mature after three outstanding real designs exist. Do not delay honest copy/IA until then, but do not fake showcase assets.

## Build packets and handoffs

For each packet create/update: scope, affected FLOWS.md IDs, user-facing screens, schema/API changes, source reference audit, tests, visual evidence, known risks, and exact next action.

Suggested order: P01 repo bootstrap/CI; P02 auth/DB/tenant; P03 design schema + three templates; P04 Studio; P05 guest flow; P06 publishing/payments; P07 mail/media/audio; P08 marketing site with real demos; P09 Photo Hall; P10 security/accessibility/performance and pilot. Parallelise only when contracts are stable and ownership is explicit.

## Agent self-review prompts

Before coding: 'What if this user abandons setup, has no photos, uses Arabic, invites 200 family members, or loses connectivity?'
After coding: 'Where could a guest see another guest's data? Can refresh duplicate an RSVP? Does a denied upload appear in a gallery? Can we actually download the approved image?'
Before declaring done: 'What precise UI/API/database evidence proves it? Which nodes and error branches remain untested?'

## Source references

- Vercel backend guidance: https://vercel.com/docs/frameworks/backend
- Functions: https://vercel.com/docs/functions
- Queues: https://vercel.com/docs/queues
- Workflows: https://vercel.com/docs/workflows
- Motion AI Kit: https://motion.dev/docs/ai-kit
- Playwright snapshots: https://playwright.dev/docs/test-snapshots
- Vercel agent skills: https://github.com/vercel-labs/agent-skills
