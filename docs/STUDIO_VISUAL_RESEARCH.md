# Wedsent Studio visual and interaction research, 8 November 2026

## Sources examined

| Project | Primary implementation/reference | Applied principle | Reuse |
| --- | --- | --- | --- |
| [Shots](https://shots.so/) | Mockup editor: device frames, backgrounds, shadow and export controls | Treat the canvas backdrop and device presentation as independently selectable workspace surfaces; show tangible previews | Interaction inspiration only. No proprietary source copied. |
| [Screenshot Studio](https://github.com/opennookorg/screenshot-studio) | Open-source screenshot editor: browser frames, radius, layered compositing, gradient backgrounds | Explicit frame variants and scene options instead of only a generic phone in a flat neutral area | Research only; review package licence and source boundaries before copying code. |
| [Prettyshot](https://github.com/prassamin/prettyshot) | Mockup editor with radius, shadow, lighting and composition controls | Separate small curated appearance presets from advanced numerical controls | Research only. |
| [tldraw](https://tldraw.dev/sdk-features/ui-components) | Named toolbar, panel and canvas UI slots | Keep the guest rendering engine independent from tool chrome, so workspace frames cannot modify the live invitation | Architecture research only. |
| [Puck](https://puckeditor.com/docs) | Modular React editor with per-field controls | Context tools should correspond to tasks, with no second navigation hierarchy | Research only. |
| [Phosphor](https://github.com/phosphor-icons/react) | Icon system | Distinguish tool identity by a coherent icon vocabulary | Existing MIT dependency. |

## Implemented interactions

The Studio remains a constrained invitation-composition tool, not a generic drag-and-drop website editor. Canvas preferences (`paper`, `gallery`, `ink`; `device`, `soft`, `edge`) persist locally under `wedsent-studio-canvas-v1`, independently of the published invitation schema. This lets the owner inspect the same content against different editor surroundings without accidentally changing guest artwork. A lightweight floating control appears alongside Opening/Inside.

Desktop retains simultaneous navigation, real invitation canvas and the selected editing task, but uses a quiet inset instrument-panel composition with rounded boundaries and deliberate material separation. Mobile does not force desktop's three columns or a half-height inspector into a narrow viewport: the invitation is a full viewing mode and editing has its own scrollable surface, with the tool dock accessible underneath.

## Quality and safety boundaries

- Workspace choices are editor-only and do not mutate invitation content, guest links or publication revisions.
- No code, photographs or illustrations from Shots were copied.
- User-uploaded soundtrack review MP3s remain outside public assets until recording/master and composition rights permit commercial streaming, trimming and redistribution.
- The reviewed music upload cap was expanded from 8 MB to 12 MB to accommodate owner-supplied files **only when the uploading user confirms appropriate rights**. Larger in-database blobs are a transitional development setup, not a long-term scalable media CDN.

## Visual QA procedure

Run a development server and `PW_PATH=<playwright module path> node scripts/capture-studio.mjs http://127.0.0.1:3113 ./screenshots`. Inspect 360, 390, 430, 768 and 1440px preview, editing and soundtrack states; confirm absence of horizontal overflow. Follow with interaction testing of edit/preview, keyboard, search, sound trimming, and long/RTL fixtures. This test environment currently blocks Chromium startup at `socket() failed: Operation not permitted`, and the remote browser cannot connect to the local port. **No mobile visual QA pass is claimed.**
