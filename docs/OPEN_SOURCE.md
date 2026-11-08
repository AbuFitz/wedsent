# Open-source research and adoption register

See [SOURCE_CODE_AUDIT.md](SOURCE_CODE_AUDIT.md) for inspected source file paths, pinned commits, concrete security/architecture findings and outstanding code audits. The initial project shortlist below is *not* a substitute for that inspection.

Research date: 2026-11-07. GitHub repository presence does not imply permission to copy. Licences below were checked against actual repository LICENSE files where noted. Before incorporating code, verify current commit, authorship, dependencies, bundled images/fonts/music, attribution obligations, maintenance and security. Pin adopted dependencies, preserve notices and maintain an SBOM.

## Invitation, RSVP and platform foundations

| Project | Relevant ideas | Licence / action |
| --- | --- | --- |
| [K-Invites](https://github.com/Kevinjojo2003/EVENTINVITE) | Tradition/language data, invitation config, private links, music, animated scenes | **All rights reserved** in root LICENSE as checked 2026-11-07. **Study high-level architecture only; do not copy code/assets without written permission.** |
| [Attimo Studios](https://github.com/heulaulab-dev/attimo-studios) | Multi-tenant wedding dashboards, section editing, RSVP, music, motion | Root LICENSE not found on inspection. **Treat as no permission to reuse** until ownership/licence clarified; architecture reference only. |
| [OpenInvite](https://github.com/rayhe/open-invite) | Guest-specific links, email sending with Resend, RSVP states, CSV export and manual corrections | MIT in root LICENSE. Candidate for narrow reuse after code/security review. Very small/young project. |
| [InviteKit](https://github.com/nicolovejoy/invitekit) | Magic-link RSVP, Firebase rules, account-free guest actions, tests | MIT in root LICENSE. Study identity/security design, but do not mix two auth/DB stacks. |
| [Convite](https://github.com/nicolenohemi/convite) | Very small event-to-RSVP UX | AGPL-3.0 reported by repo. Study only unless willing to meet network-source obligations. |
| [Wedding RSVP](https://github.com/Nicopangilinan/wedding-rsvp) | Skippable multi-phase 3D envelope, reduced-motion fallback | Licence not established. Study interaction approach; do not copy code/assets until cleared. |
| [Doory](https://github.com/shaongitbd/doory) | Template fill/bulk-fill model, media, text, motion, AI-mediated design | Attribution Assurance License with prominent running-app credit; large editor and wrong UX footprint for MVP. Study only. |

## Visual and design building blocks

- [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js): BSD-3-Clause. **ADOPTED for Studio music editing (8 Nov 2026)**, with its official Regions plugin for draggable excerpt selection and playback. The audio source itself is a separate licence concern; remote tracks may deny waveform decoding, so native audio fallback remains available. No upstream code copied.

- [Motion](https://github.com/motiondivision/motion): MIT. Candidate for controlled entrance/transitions, reduced-motion and touch interaction.
- [Howler.js](https://github.com/goldfire/howler.js): MIT. Browser audio layer; track copyrights separate from player library.
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber): MIT. Evaluate selectively for one or two cinematic designs; CSS 3D may be faster and lighter.
- [Konva](https://github.com/konvajs/konva): MIT. Future crop/composition tooling if needed; no public canvas editor in baseline.
- [Polotno](https://github.com/polotno-project/polotno-studio-app): commercial SDK requires licence key, despite an accessible studio app. Do not assume open commercial reuse.
- [React Email](https://github.com/resend/react-email): MIT. Candidate for transactional email templates.

## Photo Hall research

| Project | Useful functionality | Licence / recommendation |
| --- | --- | --- |
| [Guestroll](https://github.com/achedon12/guestroll) | QR uploads, per-event codes, moderation before publishing, favorites, guestbook, sharing | MIT in root LICENSE. **Primary small reference**; evaluate security, scaling and public upload abuse. |
| [PicPeak](https://github.com/PicPeak/picpeak) | Photographer galleries, client proofing, passwords, guest uploads, bulk downloads | MIT in root LICENSE. **Primary photographer-workflow reference**, with size and complexity review. |
| [Eventdrop](https://github.com/acaranta/eventdrop) | Event media ingestion incl email, S3, formats, exports | AGPL-3.0 in root LICENSE. Study patterns; avoid direct code incorporation unless compatible with business model. |
| [Immich](https://github.com/immich-app/immich) | Mature photo management, shared album links, image pipeline | Complex self-hosted product. Study operational strategies; not an embeddable Wedsent dependency by default. Verify current licence before reuse. |
| [Ente](https://github.com/ente-io/ente) | Private sharing, album collaboration, E2EE considerations | AGPL-3.0 publicly documented. Study privacy patterns; avoid copy into closed system. |
| [PixFête](https://github.com/jeherve/pixfete) | Guest consent and photo moderation in a WordPress plugin | Architectural UX reference, not an obvious Next.js integration. |
| [Grab-Pic](https://github.com/Shahir-47/Grab-Pic) | Selfie-based photo retrieval with face embeddings | **Not for MVP** due to privacy/biometric risks and cost; no recommendation to copy. |

## Architecture conclusions

1. Do not merge full applications. Extract data models, state machines, UI patterns and well-scoped MIT components as appropriate.
2. Choose **one** backend and auth architecture. OpenInvite and InviteKit are mutually informative, not two services to deploy together.
3. Build Wedsent's culturally flexible template schema independently; K-Invites is research-only without permission.
4. Start Photo Hall with moderated upload, photographer approval, secure guest access and export. Guestroll/PicPeak are the strongest practical foundations to prototype.
5. Media copyright is distinct from code licences. Commercial songs, photographer images, fonts and decorative assets need explicit usage rights.
6. Prototype performance on cheap mobile devices before adopting cinematic 3D.

## Code-adoption checklist

For each specific dependency or copied module:
- Repository + exact commit + file paths
- Licence text, contributors, NOTICE and third-party asset licences
- Dependency vulnerability review, secrets audit, commit recency, test coverage
- Server/client data flow and authorization review
- Accessibility, localization and bundle-size review
- Whether integration is simpler than a clean implementation
- Internal owner and version-update policy

No source from the projects above has been incorporated into Wedsent as of this document.


## Adopted for the design engine (2026-11-08)
| Item | Licence | Decision | Use |
| --- | --- | --- | --- |
| Fontsource packages (Cormorant, Playfair, Bodoni Moda, Cinzel, Jost, EB Garamond, Noto Naskh Arabic, Great Vibes, Pinyon Script, Allura, Parisienne, DM Serif Display, Italiana, Marcellus, Tenor Sans, Amiri, Tiro Devanagari Hindi) | OFL-1.1 | ADOPT | Self-hosted lettering and scripts |
| Phosphor Icons | MIT | ADOPT | Multi-weight icons (duotone, bold) |
| colord | MIT | ADOPT | Contrast checks in tests |
| qrcode | MIT | ADOPT (not yet wired) | Share QR |
| Wikimedia Commons public-domain/CC0 plates (Redouté via Cleveland Museum of Art, Edwin Step, Owen Jones and others) | PD / CC0 | ADOPT with provenance | All botanical and ornament artwork; see `/credits` |
| Framer marketplace templates/components | Framer licence, in-Framer use | RESEARCH ONLY | Structure and ideas, nothing copied |
| Procedural SVG botanicals (own code) | n/a | REJECTED | Quality not acceptable; `src/engine/art.tsx` is only used by `/dev/art` |

## Studio interaction research, 8 November 2026

| Source | Licence | Adoption decision | Relevance |
| --- | --- | --- | --- |
| [Radix Primitives](https://github.com/radix-ui/primitives) | MIT | Study navigation, tabs and disclosure patterns; no source copied in this slice | Keyboard focus, explicit selected states, narrow inspector surfaces |
| [Zustand](https://github.com/pmndrs/zustand) | MIT | Defer adoption; existing `useStudioDraft` already owns persistence and server conflicts | Avoid accidentally creating a second draft store with divergent save status |
| [Atlassian Pragmatic drag and drop](https://github.com/atlassian/pragmatic-drag-and-drop) | Apache-2.0 | Research only | A future reorderable event/section list, with keyboard fallback and server persisted order |
| [Tiptap](https://github.com/ueberdosis/tiptap) | MIT core, extensions vary | Reject for present plain-text message fields | Rich text is unnecessary and would require a safe schema and HTML sanitization pipeline |

Implementation: a content/design/sound/finishing workbench with task-specific inspectors and preview shortcuts, native keyboard-accessible tabs and disclosure, mobile edit/preview modes. No third-party editor source code was copied; Wavesurfer remains the actual adopted waveform dependency. This is a workflow overhaul of the shell, not a new template renderer or an independent proof of usability.

Further source review: [Framer's interface](https://www.framer.com/academy/lessons/framer-interface) separates canvas, layer structure and selection-specific properties; [Webflow Navigator](https://help.webflow.com/hc/en-us/articles/33961320786451-Navigator) gives section hierarchy and selection; [Canva's editor](https://www.canva.com/help/glow-up/) shows controls based on the selected item. Wedsent implements the constrained variant: a section tree, centre guest canvas and right-side inspector, not a general-purpose HTML designer. Undo/redo are local draft history actions; events are separately persisted and do not participate in that history. The user experience requires independent viewport and task-based testing.
