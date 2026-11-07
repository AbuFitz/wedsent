# Product and experience blueprint

## Positioning

Wedsent sells a polished, personalised **invitation experience** with practical guest management built in. The primary buyer is a couple; planners and family coordinators are collaborators. Weddings are the initial market. The product must serve Nikah, Walima, Mehndi, civil ceremonies, receptions, traditional multi-day events and other celebrations without forcing an industry/culture-specific workflow.

## Product promises

- A striking first impression, particularly when opened inside WhatsApp on a phone.
- A useful, accurate preview using names and wedding date before account creation.
- A guided setup with optional details deferred, ideally ~5 minutes for a simple invitation when content is ready.
- Flexible but well-designed appearances: change content, colours, approved font pairs, crop, music, opening scene, ornament and content sections; preserve template quality by enforcing layout constraints.
- A genuinely functional RSVP system, not just a form embedded in a page.
- A single published URL whose content can be edited without breaking guest links.
- One clear one-off price; final amount, hosting term and media/upload limits need validation.

## Information architecture

### Marketing
- Home: immersive example with live phone interaction, concise proposition, clear CTA.
- Gallery: editorial large previews; filter by mood, not compulsory ethnicity; inspect each design on mobile/desktop.
- Design detail: example invitation, motion and music preview, supported layout/colour variants, start design.
- How it works; transparent pricing; FAQ; support; privacy/terms.

### Wedsent Studio (desktop)
- Frameless calm workspace. Persistent invitation preview (right) with compact left navigation: Details, Events, Appearance, Guests, Share, Settings. No dashboard of 20 KPI cards.
- Contextual edit panels. Main actions: Save, Preview as guest, Publish/Share. Autosave with explicit status.
- Guest management accessible from Studio but not mixed with design editing.
- Design selection as curated gallery, preview before applying, confirm if custom adjustments reset.
- Good empty states with realistic labelled examples. No fake customer data in published invitations.

### Wedsent Studio (mobile)
- Full-bleed invitation preview, top-level Edit/Preview switch, thumb-friendly bottom sheet for contextual controls.
- Keyboard-aware editor, safe areas, no obstructing sticky controls; clear Save/Publish.
- Allow simple tasks on mobile without a worse or incomplete workflow.

### Public invitation
1. Fast branded link preview with couple names/date, not sensitive guest information.
2. Optional greeting or envelope with guest-specific salutation.
3. Tap to open; motion/audio must be skippable and respect reduced-motion and mute preferences.
4. Essential details immediately accessible: event, date/time, venue, map, dress guidance, RSVP.
5. Event schedule, optional photos/story/FAQ and guest-specific information.
6. RSVP in <=3 simple steps, with accessible validation, confirmation, and a way to change reply before deadline.
7. Calendar download and venue navigation; share only when allowed.

## Template system

Each template is an independently art-directed composition, not one layout with different backgrounds. Start with ~12 strong designs across Editorial, Minimal, Heritage, Romantic, Cinematic and Celebration. 'Heritage' denotes a visual aesthetic, not a restriction or auto-assignment by religion.

Template contract:
- layout family, allowed section slots and responsive rules
- typography pairings, colour tokens with contrast checks
- imagery constraints and crop focal points
- ornament sets and cultural wording options, opt-in only
- opening animation variant, reduced-motion fallback
- audio opt-in with mute/play controls and asset licence metadata
- preview fixtures: short/long names, no images, multiple events, mixed languages, accessibility modes

Controls must be purposeful. No public drag-and-drop canvas in initial release; a future advanced editor can be built on the same schema without migrating all content.

## Real wedding problems to solve

- Couple and household invitations: 'Ahmed & family', individual guest names, invited seat count vs actual attending count; children counted separately when relevant.
- Guest permission differences: Nikah only, Walima only, both, family/pre-wedding event, evening-only.
- Invite link forwarding: public mode vs private personalised tokens. A forwarded private link must not silently enlarge an invitation or leak another guest's details.
- No email address for some guests; manual responses and WhatsApp sharing are first-class.
- Last-minute venue/time changes with editable live invitation; notify only affected invited guests where communications are enabled.
- RSVP deadlines, declined/unknown states, partial household attendance, plus-one rules, meal choice and dietary notes.
- Accessibility: elderly guests, multilingual wording, large tap targets, screen readers, low bandwidth, reduced motion.
- Important family coordinators: partner/planner roles with minimal permissions and access revocation.
- Data exports suitable for venues/caterers without including unnecessary personal contact information.
- Event-specific attendee counts and change history; no double-counting multi-event attendees.

## Photo Hall — recommended as a separate, optional post-event module

This is a promising retention/referral feature, but it should **not** be required to sell or publish invitations.

Flow:
1. Couple enables Photo Hall, sets collection visibility and deadline.
2. Photographer receives scoped upload invitation; optional bulk uploads.
3. Guests can contribute via QR/link if enabled, with upload size/type limits and abuse controls.
4. All uploads start in private staging if review is enabled.
5. Couple (or explicitly appointed moderator) approves individual photos or batches for guest viewing.
6. Approved attendees get a private gallery link; no automatic public sharing, facial identification or social indexing.
7. Guests can download approved images only if the couple has enabled downloads and the photographer has granted the necessary distribution rights.
8. Clear archive/export and deletion date; revoke links and take down photos promptly.

Important limits:
- Photographer owns/controls rights to their work unless assigned/licensed. Wedsent must not promise redistribution without permission.
- Avoid face recognition at launch; biometric processing creates disproportionate privacy and compliance risk.
- 'Only attendees can access' needs named invitation tokens or an explicit access-code mode; no public URL masquerading as private.
- Storage and egress cost grow materially with full-resolution photography. Confirm quotas, retention and pricing before including it in a one-time flat fee.
- Photo consent, takedown and sensitive religious/family privacy preferences require deliberate UX.

## Commercial choices pending evidence

- Proposed one-off price £49; free preview, charge at publish. No hidden guest charges. Test willingness to pay.
- Define standard hosting and photo storage duration. Renewal/extension policy must be transparent.
- Don't offer unrestricted copyrighted music uploads; curated licensed assets first.
- Automatic WhatsApp sends are not the same as a share-button and must be priced/consented separately.
- Potential photographer/planner distribution channel later, without making an agency portal part of MVP.

## Release gates

1. Preview of three genuinely different designs with robust edit/switch/persistence.
2. End-to-end wedding + multiple events + household RSVP + event-specific counts and export.
3. Access-control, spam, privacy, accessibility and mobile browser tests.
4. Publish/pay/restore/refund/expiry test journeys.
5. Real-couple usability pilot and validation of price/acquisition.
6. Photo Hall pilot with photographer rights, moderation and cost controls **after** invitation flow stabilises.

## Non-goals at launch

No general CRM, vendor marketplace, budgeting, seating engine, native mobile apps, custom domain service, unrestricted template marketplace, heavy AI generation, or cross-business Taplo dependency.
