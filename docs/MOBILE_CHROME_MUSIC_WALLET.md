# Guest mobile surfaces, soundtrack and Wallet integration

## Mobile browser chrome

- The web page cannot paint artwork into the native browser status bar or toolbar. `theme-color` is a suggested **solid colour** and support differs by browser and OS. Do not promise exact browser chrome matching.
- The actual invitation routes use the selected design's paper/background colour as `theme-color`, and set the document's root background to the same value to avoid white overscroll flashes. Editor phone previews must **not** change the website's surrounding browser chrome.
- The design renderer must always work against a flat, opaque base colour even when using photographs, gradients, 3D, textures or page-turning effects. Keep text legible in the safe area and allow reduced motion.
- Verify on physical iOS Safari, iOS Chrome, Android Chrome, in standalone/PWA contexts and with browser toolbar expansion/collapse. `theme-color` is advisory, not guaranteed.

## Guest audio behaviour

- The invitation attempts to start selected audio **after the guest opens the cover**. Browsers can still reject audible playback without a recognized gesture; the visible play/pause control is mandatory. No misleading promise of unconditional autoplay.
- Music pauses when a guest backgrounds the tab. Guest choice to pause is respected during a session. Never include audio in link-preview metadata or unexpectedly start audio before the cover opens.
- The current CC0-labelled demo recordings are development stand-ins, **not** a curated commercial wedding catalogue. Remove weak tracks after actual listening and sourcing review; metadata alone is not enough.
- A vocals-only nasheed and duff catalogue needs independent permission for **recording/master**, **composition**, hosting, streaming, geographic use and potential commercial use, plus explicit permission for derivative edits. A GitHub repository's source-code licence does not license unrelated recordings. Track every source and approval in `OWNER_LICENSING_REVIEW.md`. Until verified, let couples use appropriately licensed uploads or silence and label future categories honestly.

## Wallet integration (not yet enabled)

- An `.ics` calendar download is useful and exists, but **is not an Apple Wallet or Google Wallet pass**. Do not label calendar actions as Wallet.
- Apple: create a Pass Type Identifier and certificate in the Apple Developer account; build signed `.pkpass` event-ticket/generic passes with unique serials, barcode or QR containing an opaque redeemable token, expiration and a secure update/revocation service. Do not embed guest names or secret RSVP tokens into public URLs or unprotected analytics.
- Google: establish Google Wallet issuer account, define suitable generic/event ticket classes and objects, sign Save-to-Google-Wallet JWTs server-side with service-account credentials, and manage pass updates/revocation. Approval and publishing access may be required.
- Both: design branded front/back, event-specific title/date/time/location, distinguish multi-event admission, guest name only if appropriate, accessible contrast, fallback for unsupported devices, opt-in consent, and token rotation behaviour.
- A pass is not the source of truth for attendance. The backend's guest/household invitation permissions and per-event RSVP remain authoritative. Changing a guest link or event must invalidate/update passes as appropriate.
- Put all signing keys in server-managed secrets. Never generate unsigned or fake passes and call them functional. Enable the buttons only after each provider's certificate/issuer configuration and end-to-end device tests are complete.

Official references: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color ; https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay ; https://developer.apple.com/wallet/get-started/ ; https://developers.google.com/wallet/generic/overview/add-to-google-wallet-flow
