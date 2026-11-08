# Wedsent — owner licensing review register

**Status: BUILD MODE / NOT A PUBLICATION CLEARANCE.** This file separates engineering prototypes from media Wedsent can lawfully redistribute to customers. Review each third-party recording, illustration, texture, font and model **before** including it in public paid invitations. Do not assume that GitHub availability or a “royalty-free” label grants commercial SaaS redistribution rights.

## Action register

| Item | Candidate source | Intended use | Current clearance | Owner action |
| --- | --- | --- | --- | --- |
| Vocals-only nasheeds | [Aswati](https://aswati.co/vocals) | Guest invitation background | **Not cleared for redistribution**; their content licence describes creator projects | Request written permission for embedding/streaming in paid hosted invitations, or choose recordings with individually verifiable grants |
| **Four owner-uploaded MP3s** | `assets/music-review/README.md` | Arabic song, humming and nasheed choices | **Owner-attested permission, not independently documented** | Added to development catalogue; establish precise recording/composition permissions for commercial streaming and trimming before paid public launch |

**Owner rights update, 8 November 2026:** The owner stated in chat, "i have permissions for the sound tracks aswell so proceed". On that instruction, the four named recordings are added as owner-authorised catalogue tracks in the current development branch. This is an owner representation, not independent evidence that the master and composition permissions specifically cover public commercial streaming, clipping/looping and sublicensing to invitation recipients. Retain the original message and obtain the precise licence terms before a paid public launch. The muffled recording remains flagged for quality review. Do not imply the songs are CC0 or Creative Commons.
| Nasheed catalogue | [nasheed-directory](https://github.com/lomeyollc/nasheed-directory) | Discover voice-only and voice-plus-duff tracks | **Not cleared as a whole**; source metadata and moderation require review | Inspect each track's licence, ownership, lyrics, provenance and attribution; do not bulk import |
| Nasheed alternatives | [Pixabay Nasheed](https://pixabay.com/music/search/nasheed/) | Potential catalogue | **Not reviewed**; Pixabay Content Licence differs from CC0 | Review sublicensing/standalone-redistribution rules and creator claims for each recording |
| Instrumental/classical | [Musopen](https://musopen.org/music/) | Formal and romantic categories | **Per-recording check** | Confirm recording and composition status separately; keep evidence |
| Contemporary CC music | [Free Music Archive](https://freemusicarchive.org/) | General and ambient categories | **Per-track licence** | Prefer verified CC0 or explicitly commercially licensable tracks; meet attribution and adaptation conditions |
| CC0 prototype catalogue | [MOTE-MEDIA](https://github.com/MOTE-MEDIA/Based-Music-for-Based-Creators) | Experimental audio discovery | **Artist claims CC0; not reviewed** | Verify original rights and catalogue suitability; archive the version of licence evidence |
| **Retired demo instrumentals** | [AERIS MUSIC](https://github.com/farmmer938-lgtm/aeris-cc0-music), [CC0 licence](https://github.com/farmmer938-lgtm/aeris-cc0-music/blob/main/LICENSE) | Previously `Quiet Room`, `Afterglow Vast`, `Old Photos` | **Removed from new selection** due to unsuitable sound. Old draft URLs kept temporarily so existing saved drafts do not break. | Remove legacy redirects only after migration of existing content. |
| **Vocals-only source candidate** | [Jawad Syed / SyedsLife — Alhamdulillah](https://commons.wikimedia.org/wiki/File:Jawad_Syed_-_Alhamdulilah_(Vocal_Only_Nasheed).flac) | Opt-in nasheed choice in Studio, streamed from Commons | Commons page documents a creator YouTube source and CC BY 3.0; **not independently auditioned**. Original recording is 17.75 MB FLAC and mobile format may fail. | Verify original creator rights, lyrics and recording; arrange a tested optimized MP3 and preserve required attribution before production. |
| **Piano album** | [Satie Gymnopédie No. 1](https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg), [Chopin Nocturne](https://commons.wikimedia.org/wiki/File:Chopin_-_Nocturne_Op._posth._72_no._1.ogg) | Opt-in instrumental album, MP3 transcoded by Commons | Commons records mark both recordings CC0; individual uploader/provenance evidence differs. **Source-documented but not yet independently auditioned on devices.** | Check recordings end-to-end, verify source provenance for Musopen uploads, test MP3 URLs on iOS/Android, and cut curated 15s preview excerpts where appropriate. |
| Optional ambient library | [open-lofi](https://github.com/btahir/open-lofi) | Contemporary sound options | **Author claims CC0; not reviewed** | Verify the origin, AI-service terms and suitability; do not automatically feature |
| Audio player code | [howler.js](https://github.com/goldfire/howler.js) | Playback engine if needed | MIT licence (code only) | Retain relevant licence notice if adopted; does not license tracks |
| Couple illustrations | To commission or source | Variations in pose, attire, hair, hijab, silhouettes | **Not sourced or cleared** | Commission original artwork with commercial redistribution and modification rights; do not stereotype |
| Curtains, doors, fabric, paper and 3D models | To commission or source | Realistic openings and backdrops | **Not sourced or cleared** | Record artist, texture/model licence, derivative and distribution rights; check third-party asset dependencies |
| Typeface files | App's current font packages and any future premium typefaces | Marketing, invitation renderer and print PDF | **Audit required** | Confirm web embedding, downloadable PDF and print redistribution rights per family |
| User-submitted images/music | Couple uploads | Public private-link invitations | **User responsibility plus platform terms** | Provide rights acknowledgement, reporting/takedown process, moderation and retention policies |
| Print artwork | Existing designs plus commissioned assets | Print-ready PDFs and stationery | **Not cleared for every asset** | Check export/print rights, physical goods licensing and applicable trademarks |

## Clearance evidence to record per asset

- `asset_id`, title, creator, direct source URL, source file hash, date retrieved.
- Separate composition and sound-recording rights where applicable.
- Exact licence text/version or signed agreement and whether it allows commercial hosting, streaming, embedding, editing, user downloads, and physical print.
- Attribution wording and where the guest or owner can see it.
- Review date, reviewer, status (`research`, `approved`, `rejected`, `revoked`), any expiry or takedown notes.

## Current product truth

- The Studio supports **owner-uploaded MP3s** with a rights checkbox and a guest-controlled player. The earlier generic beats are no longer selectable; one source-attributed nasheed candidate is exposed with an explicit format caveat. This is **not yet a fully curated, auditioned music catalogue**.
- Build-mode experiments can use personal audio **only where the user has the relevant rights**. Prototype status does not erase copyright restrictions.
- The new recommendations in Studio suggest designs/openings and a **type of soundtrack**, but **do not provide or pretend to play unlicensed tracks**.
- Vocals-only, voice-with-duff, instrumental, ambient and silence are separate options. Choosing Nikah/Walima does not infer a religious audio preference.
- The current door/curtain effects are experimental interface transitions, **not verified hyper-realistic 3D experiences**. Commissioned assets and mobile QA remain outstanding.
- Current print layout is experimental; it is **not yet a verified printer-ready product suite** with production bleed, crop marks and colour-management guarantees.

## Pre-publication gate

Nothing becomes a bundled production media selection until (1) licence evidence exists, (2) commercial streaming/redistribution is allowed, (3) an owner approves it, (4) the source is stored with the release, and (5) it is tested on real mobile devices. Review cultural appropriateness and lyrics, especially for nasheeds, independently of the audio's instrument classification.
# 8 November build note

The soundtrack playback engine now supports on-arrival attempt, after-opening playback or manual playback; adjustable volume and start/end points. These controls do **not** add recording rights. The existing four curated records remain subject to the rights/provenance caveats below; additional duff and vocals-only recordings are pending source-level permission and auditioning. Public-link replies and guest data are unrelated to music licensing.

