# Editorial website imagery — 10 November 2026

Flow: F01 discovery → design gallery → `/start` draft. No changes to identity, guest or payment boundaries.

## Assets and provenance

- `public/art/weddsent-digital-hero.webp`: original generated product campaign image. Prompt: photoreal black titanium iPhone 15 Pro displaying an elegant digital wedding invitation, resting on embossed ivory card with silk ribbon and burgundy calla lily. Derived by editing Wedsent's own previously generated stationery photograph.
- `public/art/weddsent-hands.webp`: original generated editorial close-up of newlywed hands holding a bouquet, no faces. The user-provided wedding stock photograph was a visual **reference**, not included or reproduced.
- `public/art/weddsent-watercolour.webp`: original generated loose ink/watercolour wedding courtyard and faceless couple. The user's sketch reference guided the medium, not copied into the shipped asset.

All three created using the built-in image generation tool, then converted to WebP for the site. They are concept/demo imagery, not photographs from a real Wedsent customer or representations of paid designs. No real couple testimonial or user claim is attached.

## Placement and product integrity

- Hero: one photographic phone scene with separate responsive crop. The visual phone is a promotional image, not a clickable screenshot.
- Between design gallery and event-specific information: hands photo and illustration, juxtaposing photographic and personal hand-drawn art directions.
- Existing live renderer stays in the design collection and sticky guest tour. `/start`, sign-in, Studio and server flows remain unchanged.
- Header changed to a full inset framed navigation; global site background defaults to white.

## Verification and gaps

- Production build and automated suite to be recorded after implementation.
- Required visual/browser screenshots at 360/390/430/1440, contrast check, low-end mobile and production deployment still need evidence.
- Generated phone pixels should not be used as an accurate preview of a selected template; only the live renderer is the source of truth.
