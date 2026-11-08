# Wedsent music sourcing and catalogue decisions

## Core principle

Open-source **player code** and openly licensed **recordings** are different things. Do not extract audio from an app merely because its GitHub source is public. Each released track needs a recorded chain of rights, an audition, proper attribution, and an actual playback test on iOS/Android. Source-code licences are tracked separately.

## Shortlist for implementation

| Source | What to take | Evaluation and restrictions | Wedsent use |
| --- | --- | --- | --- |
| [Nasheed Directory](https://github.com/lomeyollc/nasheed-directory) | Open-source audio discovery, metadata fields for vocals-only vs duff, verification status, licence URL, lyrics and attribution | Very relevant schema and human review pipeline, but verify catalogue entries and source rights individually; unverified submissions must not appear as cleared | Integrate its search/filter approach; fetch approved records only after API and licence review |
| [Openverse](https://github.com/WordPress/openverse) | Search of openly licensed audio with source, creator, licence, URL, attribution and file type | Search index is not a guarantee of ownership or a wedding-appropriate composition; reject NC for commercial product and ND for edits | Discovery pipeline, not an unfiltered guest-facing catalogue |
| [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Audio_files) | Individual recordings with traceable source pages and CC/public-domain metadata | Review creator and provenance; many files are FLAC/Ogg, require mobile-compatible transcoding | Manually curated vocals-only/nasheed candidates and traditional performances |
| [React H5 Audio Player](https://github.com/lhz516/react-h5-audio-player) | Accessible playback UI, events and transport ideas | Player framework only, no music rights; heavy generic transport unnecessary for guest surface | Study accessible control patterns for Studio audition UI |
| [Howler.js](https://github.com/goldfire/howler.js) | Cross-browser audio handling, unlock, volume, fade, looping and lifecycle | Licence for code; not for sound recordings | Consider if native `<audio>` proves unreliable across guest devices |
| [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js) | Waveform trim/preview tools | Additional bytes and audio-processing complexity | Later optional host-only trim preview, not guest runtime |

## Actual candidate awaiting audition

- [Jawad Syed — Alhamdulillah (Vocal Only Nasheed)](https://commons.wikimedia.org/wiki/File:Jawad_Syed_-_Alhamdulilah_(Vocal_Only_Nasheed).flac), Commons page states CC BY 3.0 and source as a creator YouTube upload. **Not bundled into released player** until the original rights claim, lyrics and recording are reviewed and a mobile-compatible version is prepared. The Commons FLAC is over 17 MB and unsuitable to push directly into every guest invitation.

## Curation structure

Keep distinct opt-in lanes: `Silent`, `Vocals-only nasheed`, `Voice + duff`, `Wedding instrumentals`, `Ambient`. Within each, tag `warm`, `solemn`, `joyful`, `cinematic`, `quiet`, and entrance/cover suitability. Cultural-event suggestions are recommendations, never assumptions. Muslim couples may want silence, nasheed or instrumental music; do not silently select a religious option by name or culture alone.

Each record must include: stable id, title, composer/performer, provenance URL, licence and evidence URL, permitted territory/usage, exact attribution, instrumentation, vocals/lyrics language, duration, file format, sample rate, normalization status, editorial notes, review date and reviewer, and status `candidate | approved | withdrawn`. No `candidate` reaches public selection.

## Implementation gates

1. Obtain or verify rights evidence for a **short, curated** first set (roughly four to six high-quality tracks per lane, not hundreds of random files).
2. Listen to full recordings, inspect vocals/lyrics, strip leading silence and intrusive intros only where adaptations are permitted, transcode to mobile-friendly MP3/AAC/Opus, normalize perceived loudness and retain masters securely.
3. Serve first-party CDN audio with byte-range support, caching and content type. Audition should actually work in the Studio. Record attribution in the product and copyright ledger.
4. Playback after guest opening gesture with clear opt-out; test on iOS Safari and Android Chrome, including data saver and reduced motion.
5. Surface unavailable licensed categories honestly rather than shipping broken stream buttons.

No permission or commercial release is inferred from a GitHub repo title, a Commons upload or an Openverse search result.
