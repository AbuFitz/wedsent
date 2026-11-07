# Wedsent — visual reset and product-showcase implementation

## Owner's updated directive (7 November 2026)

The user explicitly rejected all previous V2–V7 homepage aesthetics, overly wedding-styled fonts, and conventional AI-generated SaaS sections. The homepage must be built and is not to redirect to Studio. The product's actual interaction and mobile-first invitations must visually lead the narrative.

## Research-to-design translation

| Reference | What to study | Wedsent application |
|---|---|---|
| [Evite](https://www.evite.com) | Curated invitations, envelopes, opening effect, guest reply tracking | Invitation preview is a real interactive component; make guest workflow clear. |
| [Paperless Post](https://www.paperlesspost.com) | Card vs Flyer modes, sophisticated type and palettes, reveal | Each invitation requires a differentiated motion and layout signature. |
| [Partiful](https://partiful.com) | Fast setup, low-friction mobile RSVPs and share links | Short creation flow; do not burden hosts with enterprise dashboards. |
| [Greenvelope](https://www.greenvelope.com) | Envelope animations, guest reply details, refined stationery | Consider an optional envelope reveal for individual templates. |
| [Framer marketplace: Movlo](https://www.framer.com/marketplace/templates/movlo/) | Bold editorial typography and product imagery | Modern consumer-tech feel, strong grid, large product imagery. |
| [Framer marketplace: Everyday](https://www.framer.com/marketplace/templates/everyday-productiv/) | Warm minimal SaaS and colourful content | Restrained expressive colour without babyish graphics. |
| [Framer Flipside 3D](https://www.framer.com/marketplace/components/flipside-3d/) | Dimensional card flip | Used as inspiration for pure-CSS hinged card interaction. No copied third-party implementation. |
| [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence) | Enter/exit animation choreography | Next: transitions between invitation chapters and renderer states. |

## Design system — new homepage exploration

- Product-company typography: Space Grotesk for bold concise display and DM Sans for readable small UI. The distinctive invitations can have their own art direction. Avoid script wedding fonts as the global identity.
- Base: near-white `#f8f9f6`, ink `#181918`, dark forest `#1c201e`; accents lime `#d9f64a`, subtle blue, salmon and sage. Intentional contrast.
- Hero: large display statement plus layered moving invitation cards. No generic feature banner.
- Collection: three independently treated concept cards rendered live inside a phone with selectable categories and a reveal interaction.
- Motion: slow card parallax, phone float, hover-opening fold; provide `prefers-reduced-motion` override. No autoplay sound.
- Status: this is *design exploration*. The card imagery remains code-crafted; commissioned art and proper creative diversity are not yet complete.

## Invitation motion taxonomy (research and build backlog)

1. **Open / unfold:** bifold hinge, envelope flap, sliding sleeve. Maintain legibility and skip affordance.
2. **Reveal / chapter:** title entrance followed by event detail reveal; support back and tap, not only scroll.
3. **Page turn:** card pagination with a swipe/tap control. Avoid fragile 3D physics on low-end phones.
4. **Cinematic:** crop transition, mask, optional ambient background music after deliberate user activation.
5. **Static premium:** intentional non-animated option. Reduced-motion should not look broken.

## Design and engineering gates before treating invitations as finished

- Three materially distinct layouts with real photos/illustrations or licensed artwork, not swapped background colours.
- Gallery thumbnail and actual guest render must use identical content/layout contracts.
- Functional personalisation must change the render immediately (including colour, format, names, date, motion).
- Preview portrait phones and narrow devices; verify long couple names, large text, RTL, no-photo, and touch controls.
- RSVP needs persistent server state and guest access model before called live.
- Professional print requires export pipeline, exact dimensions, bleed/trim, font licensing and verified proofs.
- Accessibility: keyboard controls, WCAG contrast, focus, reduced motion and interaction alternatives.

## Honest status

The new marketing homepage is implemented, including live interactive concept previews and a mobile composition. It remains an exploration, not a final commercial-quality art direction. Studio remains V7 and the backend is still a browser-local prototype. The next substantial work is a new cohesive design engine and a real publish/guest workflow, not just adding more homepage sections.
