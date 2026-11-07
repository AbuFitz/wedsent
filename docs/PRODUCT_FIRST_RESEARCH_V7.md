# Wedsent: product-first research and implementation contract

## Owner reset

2026-11-07: V2–V6 visual work rejected. Do not build the next iteration from existing marketing sections, serif heading treatment, paper-card mockups, or generic wedding aesthetics. Make the product work and look like well-made modern software before building its promotional storytelling.

## Mainstream platform findings — primary sources

| Platform | Proven product mechanism | Adaptation | Limit / differentiation |
| --- | --- | --- | --- |
| [Evite](https://www.evite.com/) | Large design collection, Upload Your Own, envelope/effects, share link, RSVP tracking and reminders | Curated looks, easy personalised content, clear response tracking | Don't reproduce their wide all-occasion catalogue or upsell complexity |
| [Paperless Post](https://www.paperlesspost.com/) | Design-first Cards/Flyers, fonts and palettes, event blocks, messaging, tracking, scheduled sending | Clear design controls, contextual blocks and preview before sending | No paper-metaphor requirement; open to modern microsite composition |
| [Partiful](https://info.partiful.com/) | Fast event creation, link-first sharing, guests RSVP without an app, messaging and post-event photos | Minimise friction, direct link, fast phone usability | Wedding privacy and household/event permissions need more rigor |
| [Greenvelope](https://www.greenvelope.com/) | Custom envelope, explicit guest list, open tracking, dietary questions, no guest accounts | Support guest-specific responses, optional ceremonious opening | Avoid compulsory seven-second sequence and per-guest pricing assumptions |
| [Joy](https://withjoy.com/) | Household/group RSVP, ceremony-specific permissions, collaborators, travel tools | Reuse conceptual guest/event model and practical UX | Don't build a sprawling wedding-planning portal |
| [Canva](https://www.canva.com/en_gb/invitations/) | Visually broad templates, fast text/media editing, export/printing | Curated preview-first selection and useful print export in later slice | Not a freeform canvas in the MVP |

## Modern software design references

- [Meo / Framer](https://www.framer.com/marketplace/templates/meo/): clean light SaaS hierarchy and a real product interface as the main proof.
- [Get Pulse / Framer](https://www.framer.com/marketplace/templates/get-pulse/): structured modern app sections and mobile app showcases.
- [App Minimal / Framer](https://www.framer.com/marketplace/templates/appminimal/): legible product-led marketing with clean mobile compositions.
- [Framer Swipe Cards](https://www.framer.com/marketplace/components/swipe-cards/): swipable product gallery as a reference, not copyable code.
- [Motion for React](https://motion.dev/docs/react): progressive shared-element animations and gesture interaction with reduced-motion policy.

## What is implemented in V7

- Six-step modern Studio with meaningful progress, template selection, names, occasion, date/venue, accent/message and review.
- Local browser draft persistence and a guest preview. Neither is server persistence.
- Three independently styled preliminary React invitation compositions with an opening action and details.
- Mobile-first guest preview and a transparent demo-only RSVP form.
- `/` redirects to `/studio` while marketing is deliberately withheld; no false product-success messaging.

## Next production gates — not implemented

1. Replace preliminary art with truly exceptional invitation designs, not just CSS backgrounds; 390px guest motion and review fixtures are mandatory.
2. Product media/photo controls, typed template schema, print-quality export/bleed/crop workflow, audio licence handling.
3. Authenticated persisted drafts, wedding and event records; household guest allocation and per-person/event response model.
4. Secure invite tokens, true RSVP persistence, retries, permissions, activity records and message delivery.
5. One-price checkout after price/term/rights decisions and signed provider webhooks.
6. Only then, a modern showcase site illustrating real shipped behaviour.

Never claim a visually rendered form proves back-end functionality. Keep a lightweight mobile-first product experience and avoid CRM dashboard clutter.
