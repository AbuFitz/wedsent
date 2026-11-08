# Wedsent — personal widgets, section languages and ceremony design research

8 November 2026. A research and implementation register, not permission to reproduce other designers' work.

## Current working slice

- Optional countdown widget in the real invitation renderer, with editorial/tiles/circles compositions, custom heading and custom hex accent. Live day/hour/minute updates, not merely a static number.
- Section-level language choices for interface labels: event details, countdown and reply button. Initial dictionaries: English, French, Arabic, Somali. The **guest-facing RSVP form beyond the button remains English**; until fully localised, do not claim the complete RSVP journey supports other languages.
- Content and configuration are separate; the server validates widget variants and supported languages. Existing saved records receive defaults.
- The date/time countdown currently uses the viewer's local browser time zone. Venue time zones and UTC event instants are needed before international production correctness.

## UX: small wedding moments, never a widget dashboard

Potential modules, each optional and constrained per design:

| Module | Functional contract | Variations | Important limit |
|---|---|---|---|
| Countdown | Localised time-until-event, graceful event-day state | Editorial digits, soft tiles, subtle dial | Venue timezone, screen-reader reading cadence |
| Audio control | Guest opt-in play/pause and mute, persist preference per tab | Minimal icon top-right, small floating action | No playback before consent; use only cleared tracks |
| Event chapters | Separate days with guest-visible invitations | Timeline, editorial pages, chapter rail | Event permission checked server-side |
| Couple story | Optional moments, photos, short captions | Film-strip, gallery, journal | Real photos, no generic invented romance |
| Directions | Location, maps, transport, parking | Clear location card, compact row | Precise event-specific address, accurate map URI |
| Dress suggestions | Optional look reference and notes | Editorial moodboard, succinct notes | Accessibility and guest sensitivity |
| Travel information | Accommodation, parking, transport | Disclosure, itinerary | Never invent bookings or promises |
| Programme | Ceremony/reception timeline | Compact list, timeline, agenda | Times optional, conflicts validated |
| RSVP | Per-person/per-event attendance | Form page, integrated sheet | Authenticated private link and complete translation |
| Photos | Host-approved post-event gallery | Editorial grid, lightbox | Rights, moderation, storage limits |

We should not add a widget merely because an open-source library makes it easy. Each module needs a useful owner action and guest state, empty/loading/error states, design variants and a visibility contract.

## Source research: genuine visual direction

- [The Metropolitan Museum of Art: Marriage Contract](https://www.metmuseum.org/art/collection/search/452956) (Iran, 1874): strong reference for manuscript proportion, paper/gold, ruled composition and restrained ornamental placement. Inspect the object image's own reuse marker before including it as a bundled asset. This is a cultural/visual research reference, **not** an invitation template to copy.
- [The Met Open Access collection](https://www.metmuseum.org/art/collection/search/453383): open-access/public-domain manuscript imagery as potential texture and craft study. Curatorial and sacred contexts matter: do not use scripture or formal marriage documents as meaningless decoration.
- [Cleveland Museum of Art Open Access wedding artwork](https://www.clevelandart.org/art/2003.129.b): historically contextual wedding iconography; study artistic treatments, do not assume that a traditional religious scene suits a modern couple's invite.
- [Wikimedia Commons: historical Islamic marriage contract](https://commons.wikimedia.org/wiki/File:Islamicmarriagecontract.jpg): provenance and object composition; check licence and cultural appropriateness.
- Modern references: [Paperless Post](https://www.paperlesspost.com/), [Greenvelope](https://www.greenvelope.com/), [Framer](https://www.framer.com/marketplace/) for navigation, media-rich showcases and interaction standards, not source imagery to take.

### Design families to research further

1. **Contemporary Nikah** — restrained paper and typography, architecture, elegant geometry; optional Arabic wording carefully proofread.
2. **Classic civil ceremony** — modern editorial type, subtle photographic compositions, sophisticated minimal layouts.
3. **Walima reception** — contemporary evening visual direction, light and shadow, optional programme and venue sections.
4. **Mehndi/Haldi** — warm pigment and festival craft without defaulting to caricature or gaudy gradients.
5. **Gallery wedding** — full-bleed photography, editorial treatment and careful focus cropping.
6. **Multi-day weekend** — event chapters and clear guest-specific schedule, rather than one overloaded invitation page.

Religion and culture are not automatic themes. Event terminology, language and visual style must be independent choices.

## Libraries we should study or use selectively

- [react-colorful](https://github.com/omgovich/react-colorful): MIT, compact colour controls for Studio. Native HTML colour input is already functional; only replace it if a popover improves usability.
- [FormatJS / React Intl](https://formatjs.github.io/docs/react-intl/api/): ICU message formatting, plural rules and locale-aware dates; likely appropriate when full guest RSVP translation arrives.
- [react-i18next](https://github.com/i18next/react-i18next): translation resource management and language switching. Don't add both full translation stacks without a clear need.
- [Motion for React](https://github.com/motiondivision/motion): currently in the build for UI and opening transitions.
- [react-photo-album](https://github.com/igordanchenko/react-photo-album) and [yet-another-react-lightbox](https://github.com/igordanchenko/yet-another-react-lightbox): suitable future Photo Hall/gallery, not a replacement for interactive invitation previews.

### Translation QA gates

- Native-language human review for religious/event-sensitive labels before production.
- Arabic RTL alignment and punctuation checks in actual devices; Arabic-compatible font selected per design.
- Plural rules, locale calendars and date numerals; remember guest locale can differ from couple's.
- If a guest chooses Arabic labels while RSVP fields are untranslated, clearly disclose the limitation.
- Couple-authored wording stays unchanged unless the owner writes a translation or explicitly opts into reviewed translation assistance.

### Backlog for the next vertical slices

1. Add per-event timezone, a configurable target event for the countdown and live day/hour/minute formatting tests.
2. Finish full guest RSVP localisation and cultural wording QA (not just labels).
3. Build the licensed soundtrack catalogue and guest opt-in icon in the actual guest renderer; no fake audio previews.
4. Add story, programme, directions, travel and dress blocks with design-specific variants and guest visibility.
5. Expand printable wedding programmes, Nikah/civil-inspired cards and event stationery as separately art-directed families.
