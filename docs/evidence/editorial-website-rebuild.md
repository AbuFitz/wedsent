# Editorial website rebuild

## Reference and design decisions

- [Stux](https://stux.framer.website/) and its [Marketplace listing](https://www.framer.com/marketplace/templates/stux/) informed the framed navigation, asymmetric photography and project-led composition. Weddsent uses its own artwork, copy and components.
- [Phone Stack Carousel](https://www.framer.com/marketplace/components/phone-stack-carousel/) informed the layered phone movement. The implementation uses Weddsent’s renderer, links to individual design pages, and supports touch, buttons and reduced motion.
- [Invitara](https://www.framer.com/marketplace/templates/invitara/) and [New Chapter](https://www.framer.com/marketplace/templates/new-chapter/) informed the separation between practical invitation details and editorial typography.
- The [SaaS Site Design guidance](https://skills.cat/skills/yarlson/skills/saas-site-design) informed page hierarchy, component reuse and responsive review. It was reviewed as design guidance.
- Photography uses the repository’s original Weddsent campaign art. The cover, gallery and live preview all render the same invitation component. Rethink Sans is self-hosted with its SIL Open Font License. Invitation-specific typefaces and the supplied sign-in photograph are retained.

## Scope and flow

F01/F02 cover the new homepage, collection, pricing, design preview and three-step setup. Browser drafts can resume before sign-in. The established account and wedding API paths handle ownership and draft persistence. The direct Studio tools replace the nested step controls. F03/F04 are illustrated through a fictional RSVP with independent person/event selections. Published responses keep the existing household permission and persistence paths.

The provisional £39 is retained from the current product plan. Checkout remains closed.

## Verification

- Browser: checked the desktop opening, carousel navigation into a design, keyboard dismissal of full-screen preview, gallery filtering, separate RSVP choices, and mobile layout at 390 px. Exercised Arabic names, two events, live preview and the handoff to the account form.
- Automated: TypeScript and the production build passed. All 59 unit and platform tests passed. An isolated HTTP smoke test exercised sign-up, draft and event persistence, publishing, private guest links, RSVP submission and per-event totals. The onboarding browser script also records the intended signed-in handoff for future runs.
