# Wedsent: music, immersive openings, backdrops — implementation research

Updated 8 November 2026. **Research and design direction, not a catalogue of cleared media.** Verify the licence and provenance of every final asset before shipping it.

## Audio: distinguish the player from the recording

`howler.js` (https://github.com/goldfire/howler.js) is MIT-licensed and suitable for a later shared audio controller. It grants no rights to music. We can also use the HTML audio element initially for a single looping track, with explicit guest-initiated playback and persistent mute control. There must never be surprise autoplay.

Source candidates:

| Source | Use | Licensing action |
|---|---|---|
| [nullrights](https://nullrights.com/) | Discover CC0 ambient, piano and short instrumentals | Check the linked original recording and evidence that it is actually CC0; locally preserve the licence evidence |
| [Free Music Archive](https://freemusicarchive.org/) | Browse by mood and genre | Filter to appropriate CC0 or commercially usable tracks; many tracks have BY, NC, ND or SA obligations |
| [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Audio_files) | Public-domain and freely licensed classical recordings | Review the **recording** licence, attribution and source, not just the composition |
| [Pixabay Music](https://pixabay.com/music/) | Alternative instrumental discovery | Platform-specific Pixabay content licence, restrictions and redistribution rules: review before embedding in a SaaS catalogue |
| [OpenGameArt](https://opengameart.org/) | Ambient loops and short transition sounds | Check the individual asset licence and musical fit; game-style sound does not automatically suit weddings |

Important: **a public-domain composition does not prove its modern recording is free to redistribute.** Avoid chart songs and tracks labelled merely “royalty-free” without inspecting the actual licence. Do not scrape and mirror third-party catalogues.

### Proposed curated sound families

- Quiet piano: understated, intimate, 40–75 BPM.
- Cinematic ambient: felt textures, bowed instruments, long slow transitions.
- Classical chamber: restrained strings and piano, avoid melodramatic fanfares.
- Warm acoustic: organic plucked instruments, soft movement, no stock-ad jingle energy.
- Contemporary instrumental: modern, tasteful minimalism.
- Cultural sound worlds: optional and carefully researched; do not associate a music tradition automatically with a guest's identity or ceremony label.
- Silence: first-class default, not an error state.

Curate 2–4 genuinely beautiful, rights-verified tracks per sound family. Record title, artist/performer, original source, licence version, asset URL, hash, duration, loudness, and attribution text. Select at most one track per invitation. Compress to mobile-friendly formats, normalise levels, loop cleanly, expose volume/mute, and pause on page hide. Guests explicitly opt in to playback; use the native platform media controls where possible. An owner-uploaded audio file needs separate usage-rights acknowledgement and a real audio storage pipeline before activation.

## Openings: physicality before spectacle

Current engine: lift, bloom, veil, focus, doors, curtain. The latter two are **experimental builds** and need rendered mobile evaluation, realistic materials, meaningful shadows and performance testing before they are promoted as production-level designs.

| Motion | Interaction | Physical reference | Design caution |
|---|---|---|---|
| Lift | Tap or drag upward | A substantial printed sheet | Resistance, shadow displacement, threshold |
| Bloom | Tap point determines reveal origin | Light emerging through an aperture | Avoid a synthetic iris/shutter graphic |
| Veil | Tap | Defocused translucent layer | Quiet, low motion, readable |
| Focus | Tap | Editorial depth-of-field | Deliberate timing, no unnecessary blur |
| Doors | Tap | Hinged architectural panels | Correct perspective, hinges, handles, light and revealing depth |
| Curtain | Tap | Weighted fabric pulled aside | Textile folds, directional shadow, soft rather than cartoon spring motion |

Potential future treatments to prototype and critique: book/page-turn with realistic thickness and backface, fine paper unwrapping, gallery-light reveal, slow photographic parallax. Don't add options solely to inflate the count.

All interactions require keyboard activation, reduced-motion bypass, replay, interruption recovery, stable layout, and a loading-safe static cover. Mobile budget is paramount; expensive WebGL is opt-in for select premium experiences only. Use Motion for React for the core engine; consider GSAP for exceptional timeline choreography, subject to its actual licence terms.

## Backdrop and material research

- [Poly Haven](https://polyhaven.com/license): CC0 HDRIs, PBR materials and 3D assets. Potential paper/fabric/stone/metal material references and selective assets; optimise heavily for mobile.
- [ambientCG](https://ambientcg.com/): inspect individual CC0 texture metadata and dimensions for paper, linen, silk and marble.
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber): MIT React renderer for Three.js; use only when measurable 3D value exceeds bundle/device cost.
- [Three.js](https://github.com/mrdoob/three.js): base 3D engine; textures and example asset licences are separate.
- Existing Wedsent public-domain illustration registry: preserve per-asset provenance, do not stretch low-resolution illustrations into large hero assets.

Recommended backdrop families: matte paper, natural linen, warm stone, restrained metallic, photographic full-bleed, soft shadow studio, deep ink, and refined dusk. Offer 2–4 meaningful variations per design rather than hundreds of barely different colour swatches. Each must be contrast-tested and art-directed together with its typography and photo treatments.

## Guided uploads

The first implementation allows JPEG, PNG, WebP; browser resizes to 1800px max dimension and JPEG-compresses before use; a signed-in owner uploads to `/api/media`, while signed-out build mode saves the image locally as a data URL. The focal-point X/Y controls update a live preview. Server storage checks magic bytes, size, ownership and a per-wedding count limit.

Still required: browser image orientation/large HEIC handling, phone-safe cropping overlay, safe storage pressure warnings, accessible crop drag interaction, asset cleanup/delete, responsive art-direction per template, owner permissions, privacy retention and a CDN/object-storage migration. Current media read URLs are unguessable but publicly fetchable; this is appropriate only for invitation-cover assets intentionally shown to guests, **not** for Photo Hall private originals.

## What not to do

Never label non-cleared tracks as available, upload random recordings from GitHub, fabricate track names, or claim realistic materials are finished from CSS alone. Open-source source code does not grant rights to the photographs, textures or music shown in screenshots. Test every rendered motion on actual mobile viewports, with a low-end device fallback.
