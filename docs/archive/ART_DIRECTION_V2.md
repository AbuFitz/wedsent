# Wedsent — creative direction 02 / product-led editorial

**Status:** chosen design direction for the next implementation pass, not final brand-mark approval. Supersedes the visual assumptions in the first prototype. Existing `Sway/Noor/Afterglow` UI must be redesigned rather than preserved. The underlying content schema can be migrated.

## Positioning

An invitation studio for the way people celebrate now. Contemporary, exciting, editorial and culturally flexible; guests remember opening the invitation, while couples never feel like they are operating an event CRM. Luxury in composition and craft, **not** cliché wedding luxury.

## Reference analysis (research, not reproduction)

| Reference | Transfer to Wedsent | Avoid |
| --- | --- | --- |
| [Semplice](https://www.semplice.com/) | Freeform editorial rhythm, dramatic typographic scale, curated portfolio-style project previews, meaningful transitions | Cloning designer-portfolio navigation or unrestricted canvas-editor complexity |
| [Framer / Alex Vale](https://www.framer.com/marketplace/templates/alex-vale/) | Strong typographic lead, varied image proportions, intentional scroll reveal and dedicated mobile layouts | Copying template assets/layout or relying on effects without product proof |
| [Framer / Studio Lumina](https://www.framer.com/marketplace/templates/studio-lumina/) | One confident hero statement, large artwork, restrained monochrome with expressive typography | Generic testimonial sliders or their commercial template files |
| [Framer / Kyne](https://www.framer.com/marketplace/templates/kyne/) | Minimal fine rules, display text with visual hierarchy, quiet negative space | Being so restrained that Wedsent feels like a portfolio tool |
| [Bliss & Bone](https://blissandbone.com/online-wedding-invitation) | Cohesive invitation, reminders and event details; strong styled design families | Its wedding stationery aesthetic, pricing promises or design assets |
| [Paperless Post](https://www.paperlesspost.com/) | Invitation-first discovery and interaction as product proof | Crowded marketplace or hundreds of weak filterable cards |

## Identity and typography

- **Brand temperament:** expressive, certain, warm, energetic, useful. No forced slang, cursive hearts, metallic gradients, balloons or fake 'luxury' claims.
- **Wordmark:** provisional lower-case `wedsent`, tightly spaced heavy contemporary grotesk, no appended sparkle mark. Logo geometry requires a separate identity approval process; do not pretend CSS text is a finished logo.
- **Interface face:** `Instrument Sans` (OFL; verify final font files/licensing before shipping), with bold 600–700 navigation and a carefully spaced regular body. Fall back to Arial/Helvetica. This gives utility and modernity.
- **Campaign / editorial display:** `Bodoni Moda` (OFL; verify production asset licence), used sparingly for contrast and wedding emotion. Headings balance broad grotesk with selective high-contrast italic. Avoid making every sentence a serif headline.
- **Hero:** huge tight sans with a *single* elegant italic intervention. Display scales with clamp, carefully controlled word wrapping, no 8-line mobile headline.
- **Numbers/captions:** uppercase spaced micro-labels for issue/collection and precise dates; never substitute for essential accessible labels.

## Palette

- `--ws-ink: #171715` — confident near-black, primary foreground.
- `--ws-paper: #F6F6F2` — crisp light background, not warm beige wedding cards.
- `--ws-coral: #FF684F` — signature sharp vermilion for a limited number of CTA/graphic accents.
- `--ws-mist: #E8E9E4` — neutral surface and fine rules.
- `--ws-white: #FFFFFF` — clean workspace fields.
- `--ws-dark-card: #252625` — deep media stage.

Product shell stays consistent; invitation designs can own independent sophisticated palettes without overriding Studio UI. Verify contrast pairings.

## Composition and trust

1. **Hero**: product-led, large left typographic statement and exceptionally composed interactive invitation on right; one obvious `Make your invite` action, one `Explore designs` secondary. The right is the *actual product renderer*.
2. **Design gallery**: large variable-sized canvases, not photographic stock thumbnails. Each invitation has its own composition and visual personality; `View / Use this design` action uses real content preserved by switching.
3. **Product walkthrough**: show names→details→look→review in real UI fragments. No fake customer data marketed as testimonial.
4. **Guest operations**: show a realistic example of per-event guest responses only once backend is true. Until then label as workflow preview.
5. **Trust**: explain exactly what is included, when guests need accounts (they shouldn't), how private links work, if music can be heard, how long a link works, support and data privacy. No invented review count, fake logos, social proof or 'unlimited' claims.
6. **Culture**: diverse ceremonies/languages visible as editing choices, never a forced aesthetic/ethnicity categorisation.

## Onboarding / what the owner answers

One decisive question per view, with live invitation always visible. A user should see a credible invitation within the first 30 seconds.

1. **Start with a feeling** — choose among three expressive real design compositions. Allow instant switch later; filter by mood when catalogue expands.
2. **Who are we celebrating?** — names (one or two or multiple, display-friendly), optional subtitle; see live typography immediately.
3. **What's the occasion?** — ceremony/reception/Nikah/Walima/Mehndi/other or custom wording; choose one or multiple events, with sample sensible names (no auto ethnicity inference).
4. **When and where?** — date, time, venue, city, optional online/map detail; allow `I'll add this later` without making a blank broken invitation.
5. **Make it yours** — approved palette, image/crop (optional), visual treatment, opening motion, optional legally licensed music. Show controls in context, not overwhelming sidebar panels.
6. **Take a look** — full-screen guest experience, content checklist and account creation near the end. Plan/price is explained at publish, not before the user has seen the design.

**Persistence:** Early no-account demo may be local, clearly labelled. Production saves securely when account is created; resume token or migration must preserve edits. Do not fake successful checkout or send.

### Studio hierarchy

Desktop: left slim step rail, middle 400–650px focused question panel, right live phone/editorial canvas, no boxed analytics. Mobile: top preview (roughly 40–50vh), step progress and a natural-height bottom sheet; editing and full-screen preview toggle; keyboard never covers primary action. On completion, Studio becomes a calm checklist: `Your invite`, `Events`, `People`, `Share`, `Settings`.

## Motion rules

- Reveal feels like a thoughtfully edited motion piece, not a spinner: 400–850ms intentional transitions (subject to device), one prominent effect per composition.
- Use real tap-to-open interaction, always skippable, never delay date/time/RSVP.
- Reduce motion when requested; audio only after interaction and with licensed source.
- On marketing site, use editorial micro-motion and drag/swipe only where it materially aids discovery.

## Acceptance scenes

- Mobile 360/390/430, desktop 1440; full-screen screenshots of home, gallery, onboarding 1–6 and guest view.
- User starts from gallery, enters names, chooses Nikah+Walima, changes look, refreshes, returns and sees data intact.
- Onboarding with no images, long names and RTL scripts remains aesthetically intentional.
- Interactive affordances are functional, not hollow. Features not yet wired to backend are explicitly marked preview.

## Build priority

Rebuild the frontend creative experience around these rules. Next, progressively connect real data/accounts and flow F01–F10. The first rendered screen is not a demo banner; it's proof of what Wedsent could become. Keep the architecture modular so the agent may freely replace prototype CSS and components.
