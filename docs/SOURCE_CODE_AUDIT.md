# Wedsent open-source code audit — first inspected implementations

**Status:** Evidence-backed initial source inspection, not exhaustive security audit or integration approval. No third-party source copied into Wedsent. Date: 2026-11-07. Recheck upstream licences and commit before any code adoption. The exact commit IDs below are the revisions inspected.

## Source snapshots and concrete findings

| Project / inspected commit | Concrete files inspected | Architectural insight | Wedsent decision |
| --- | --- | --- | --- |
| [OpenInvite](https://github.com/rayhe/open-invite) `0ebc0321aec465eb0eae13b25984eadd7b4d0bbd` | `firestore.rules`, `functions/index.js`, `public/rsvp.html`, `scripts/email-template.js` | Guest-specific URLs include event, guest id and bearer token; Firestore rule constrains guest edits to allowed fields; `sendInvitations`, `sendReminders`, Resend webhook pathways exist | **Study and reimplement.** Do not transplant Firebase rules into PostgreSQL; develop server-authorised token capabilities, tighter edit constraints and private OG model. MIT license verified in root. |
| [Guestroll](https://github.com/achedon12/guestroll) `3fc407dd872a3e649b7ba505e2e6d80cefb9b82a` | `src/app/api/e/[slug]/photos/route.ts`, `src/lib/policy.ts`, `src/lib/security/limiters.ts`, `src/lib/db/schema.ts`, `src/lib/storage/{driver,s3}.ts`, `src/lib/photos.ts` | Guest/event/IP rate limits and upload locks; event upload policy; pre-moderation uploads become pending rather than visible; explicit event/guest entities; storage adapter boundary | **Reference implementation.** Extract policy/test patterns, not whole Next app. Its SQLite/self-hosted operations differ from Wedsent's Postgres/Vercel. Verify size, MIME, queue and S3 handling before reusing any code. MIT. |
| [PicPeak](https://github.com/PicPeak/picpeak) `f1f021deceaa895515cc77af1a91d6a5f432c6e2` | `backend/__tests__/routes/galleryGuestInviteRedeemRace.test.js`, `galleryGuestTokenEventBinding.test.js`, `galleryAccessPolicy.test.js`, `galleryUploadLimits.test.js`, `galleryZipReadFailure.test.js`, `publicTransferUploadInFlightRevocation.test.js` | Strong edge-case coverage: revoke-vs-redeem race, token binding to event, upload limits, interrupted archive downloads and revocation during upload. In redeem race, session creation must be conditional on still-active invite rather than stale pre-check | **Use as adversarial test specification.** Reproduce behavior in Wedsent Postgres/API tests; do not import its large gallery/commerce/admin application. MIT verified in root. |

### Priority source audits still required

1. **InviteKit**: trace guest capability handling, token expiry, replay and Firebase security rules. Compare with OpenInvite before selecting token design.
2. **Media pipelines**: evaluate `sharp`/image-processing, resumable upload approaches (tus or multipart), EXIF removal and anti-abuse controls. Identify exact current licences and deployment compatibility.
3. **Editor schemas**: compare declarative renderer and data-to-components architectures; shortlist narrowly useful libraries for crop, colour, animation timeline and constrained typography. Explicitly reject public drag-and-drop canvas unless usability evidence warrants it.
4. **Template composition**: inspect real high-quality interactive invitation examples, source licences and actual DOM/motion patterns. Aesthetic references are not permission to copy copyrighted design/artwork.
5. **Comms/payments**: study official Stripe webhook idempotency examples and Resend bounce/event docs; write retry and out-of-order tests.
6. **Photography**: benchmark private object storage, transformations, signed download links, ZIP streaming, malware/media validation and storage/egress costs.

## Reuse decision record template

`Repository / exact commit / source file / licence / author notices / dependency tree / vulnerabilities / actual tests / architecture compatibility / Wedsent boundary / options compared / chosen action / owning feature / test added / licence attribution recorded`

Decisions: **ADOPT SMALL MODULE**, **ADAPT PATTERN**, **RESEARCH ONLY**, **REJECT**. Default to adapting patterns into Wedsent's native architecture; avoid combining full products. Run SBOM, dependency audit and legal check before copying into commercial deployment. Public GitHub access is not a licence.

## Explicit architecture takeaways

### Personalised invitation links

For each household invite, store a *digest* of a high-entropy secret, scope it to wedding and event allocation, revocation and expiry. The server resolves the token and returns only allowed guest/event fields; social share metadata must be generic safe copy. Token is not owner auth. Rotate or revoke without affecting unrelated households.

### RSVP concurrency

Use transaction plus unique `(wedding_id,event_id,guest_id)` current response. Validate allocated seats and deadline server-side. Protect against duplicate submissions, two household members editing at the same moment, stale version overwrites and replay after revoked link. Append change history.

### Photo staging

Upload session → quarantined private object → image/type/size/checks → thumbnail generation → pending moderation → approved album. Provide explicit rejected/revoked paths. Only sign URL for approved media under current guest capability; prove pending objects cannot leak through URL, cache or derivative endpoint.

### Photo rights and retention

Image owner permission and couple approval are distinct. Photographer rights may be limited to viewing and downloads for a set period. Record removal/takedown and propagate to derivatives/CDN. Every asset requires retention lifecycle; storage/egress budgets must be enforced, not merely disclosed.

## Test cases directly motivated by inspected code

- Guest token for Wedding A cannot access Wedding B even when an event or guest id is guessed.
- Invite revoked between lookup and redemption must not mint a fresh session (PicPeak race).
- Upload revoked after request accepted but before object commit must fail safely and remove staged bytes.
- Quarantined media cannot be listed, viewed or downloaded by a guest.
- Repeat upload at limit cannot bypass quota through concurrency or retry.
- Album ZIP abort must release resources and return a recoverable error, not hang indefinitely.
- Email provider webhook replay and RSVP double-click cannot duplicate state or entitlement.

## Sources

- https://github.com/rayhe/open-invite/tree/0ebc0321aec465eb0eae13b25984eadd7b4d0bbd
- https://github.com/achedon12/guestroll/tree/3fc407dd872a3e649b7ba505e2e6d80cefb9b82a
- https://github.com/PicPeak/picpeak/tree/f1f021deceaa895515cc77af1a91d6a5f432c6e2
- https://motion.dev/docs/ai-kit
- https://playwright.dev/docs/test-snapshots

**Do not treat findings as security certification.** Audit completeness, maintenance, benchmark, licensing and integration work remain real implementation tasks.
