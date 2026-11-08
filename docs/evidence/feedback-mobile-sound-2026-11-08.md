# Feedback, mobile Studio and soundtrack workflow slice

Date: 8 November 2026. Flows: F02 and F04.

## Implemented

- Mobile Studio now exposes distinct Invitation and Edit modes. Editing fills the space above the persistent tool dock; the tiny stacked canvas and half-height form are no longer the main mobile workflow.
- Soundtrack provides three independently selected views: Discover recordings by type, edit the selected excerpt/timing/volume, and upload a rights-confirmed MP3. Selection moves to editing, with the existing Wavesurfer region control and draft persistence preserved.
- Self-contained `/share` feedback links now offer a guest-side RSVP simulation, a confirmation/change state and an explicitly non-functional admission card illustration. The live invitation renderer still controls the opening, calendar, directions and audio when the shared source is available.

## Boundaries and caveats

- Feedback submissions are **local UI simulations**. They are never sent to the owner or persisted as real guest replies. Real replies remain available only from published public or authenticated household links.
- The feedback Wallet card is **not** a signed pass, QR admission credential or issuer integration. Google Wallet still needs issuer credentials; Apple/Samsung are not implemented.
- Feedback URLs intentionally omit owner-uploaded photos and local/account music sources because they cannot be safely embedded in an unauthenticated self-contained link. Public-library references can work if their source remains available.
- The curated catalogue is intentionally restricted to individually sourced records. Uploaded review MP3s are not automatically redistributed until rights are confirmed. This slice does not expand the licensed album.
- User-facing sound timing is subject to browser autoplay policy. Audio cannot be guaranteed to start on page load.

## Validation

- Production TypeScript/Next build: passed.
- Browser screenshot and device verification: not completed in this environment. 360, 390, 430 and 1440 checks remain required.
- RSVP server, persistence, security, Wallet issuer and cross-browser audio behavior are not claimed verified by the feedback UI alone.

## Sources and reuse

- [Puck](https://puckeditor.com/docs): modular editor/field architecture and task separation, research only.
- [Penpot](https://github.com/penpot/penpot): canvas/inspector and mobile control density, research only.
- [Wavesurfer.js](https://wavesurfer.xyz/docs/): existing BSD-3-Clause waveform/Regions dependency retained.
- Existing MIT-licensed Phosphor and Lucide React icon packages retained.

Next: device visual QA; guest preview handoff that exercises actual published invite flows using safe test records; signed Wallet integration after credentials; rights-reviewed soundtrack ingestion.
