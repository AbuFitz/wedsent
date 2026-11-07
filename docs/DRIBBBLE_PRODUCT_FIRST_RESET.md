# Wedsent design correction: product-first reference audit

Date: 2026-11-07. The owner explicitly rejected earlier editorial and floral/expressive website implementations. They were repetitive, overdesigned around generic typography and did not demonstrate the actual product well.

## Reference pool, inspected as design concepts

User-supplied starting point: https://dribbble.com/search/web-invitation

| Reference | Study | Wedsent adaptation |
| --- | --- | --- |
| [Digital Invitation Landing Page — Iqbal Saputra](https://dribbble.com/shots/26120634-Digital-Invitation-Landing-Page-Design-Exploration) | Restrained navigation, readable hero, invitation-oriented product marketing and concise CTA | Quiet marketing language, immediate entry to Studio, real invitation showcase |
| [Wedding Digital Invite Landing Page — Akhil](https://dribbble.com/shots/17482185-Wedding-Digital-Invite-Website-Landing-Page) | Product presentation and discovery | Interactive lookbook instead of static portfolio |
| [Wedding Invitation Website — Ilham Muharam](https://dribbble.com/shots/26109333-Wedding-Invitation-Website-Design) | Couple story, image gallery, date, wishes and guest modules | Complete guest-view content hierarchy without forced sections |
| [Digital Wedding Invitation UX/UI — Anahit Poghosyan](https://dribbble.com/shots/25792154-A-Digital-Wedding-Invitation-UX-UI-Case-Study) | Mobile invitation and RSVP interaction | Tap actions, RSVP outcomes, accessible states |
| [Until Jannah CMS Dashboard — Farhan Azahry](https://dribbble.com/shots/24224081-Until-Jannah-CMS-Dashboard-Digital-Wedding-Invitation) | Organiser workspace hierarchy | Calm Studio with invitation details and guest response summaries |
| [Wedding Invitation Dashboard — Nurcholis](https://dribbble.com/shots/18362061-Wedding-Invitation-Dashboard) | Editor/admin navigation | Contextual task panes and honest status states |

Dribbble shots are third-party creative work. Study patterns only; do not copy their photographs, artwork, components or text. A static concept is not proof of production functionality.

## Adopted principles

1. Display the actual invitation renderer in the first viewport, not a decorative banner or generic illustration.
2. Use neutral contemporary sans-serif in marketing with restrained hierarchy. Each invitation collection may have a distinctly art-directed font system inside its own preview.
3. Simple navigation, one strong creation action, design choice that updates the live rendered example, and a direct transition to the chosen design in Studio.
4. No repetitive three-card benefit blocks, promotional ticker, fake testimonials, endless CTA repetition or feature claims without working proof.
5. Each invitation design needs a full visual dossier: responsive composition, opening animation, practical guest view, motion-reduced version, style controls, long-name and multilingual fixtures.
6. Studio must be calmer than the marketing site: one clear task at a time, beautiful preview, contextual editing, accurate save status.
7. Validate at 360/390/430 mobile widths, tablet and desktop, including Arabic/RTL, long names, multi-event schedules, keyboard and low-motion state.

## Implemented and gaps

- `src/app/home-v4.tsx` and `src/app/v4.css` present real invitation component examples, an interactive selector and a guest-opening demonstration.
- The three existing invitation renderers in `src/components/invitation-v2.tsx` remain **interim and visually unapproved**. They are the next major design and engineering task.
- `src/app/studio/studio-v2.tsx` is still browser-local. Real owner accounts, persistent drafts, publishing, guest links and RSVP are unimplemented.
- The homepage is not signed off without mobile screenshots, end-to-end checks, and comprehensive product content review.

## Next task

Build one complete outstanding invitation design world: lookbook/detail page, responsive guest invitation, meaningful open state, events, RSVP interaction, Studio configuration, fixtures and full QA. Then create other collections with independent layout grammar instead of recolouring the same poster. Do not hide unfinished invitation quality under another marketing redesign.
