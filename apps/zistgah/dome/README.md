# zistgah/dome — the Zistgah virtual dome as an app/lib

**One dome, everywhere.** This repository is the complete zistgah.org experience —
interior diagrid hall, oculus **time scrub**, the ten-calendar **CHAKRA** strip and dial,
the **flight system** (keyboard · gamepad · touch sticks; thread the oculus, fly to the
worlds), pedestal exhibits with engraved plaques and hover cards, nebula and glyph sky,
meteors, dawn cycle, settings — factored into a reusable, **config-file-driven** library
that third parties can customise without touching the code.

**DOI:** `10.5281/zenodo.21449034` (injected post-mint via misty-doi — never fabricated).

## Quick start

1. Copy `scaffold.html`'s body into your page (it is the DOM contract the dome expects),
   include `dome.css`, then load in this order:
   `three.min.js (r128)` → *your config script* (optional `window.ZISTGAH_DOME = {…}`)
   → `chakra-core.js` → `dome.js`.
2. Put a **`dome.config.json`** beside your page (start from
   `dome.config.example.json`). The dome fetches and deep-merges it **before boot**;
   JSON overrides the JS object, key by key.
3. Open `demo/index.html` for a working reference (it points its loader at the example
   config).

Everything a third party customises lives in the config: below-fold content
(`domains · marks · art · threads`), pillar inscriptions and exhibit names, **worlds**
(add planets and orbital stations, set per-world gravity), the **spawn** point, the
**viewer's gallery** (rotating images on the floor), **video screens**, and **displays**
such as the built-in point cloud. Callbacks (e.g. what happens when a point is clicked)
cannot live in JSON — supply those in the JS config object; the two merge.

## Files

| Path | What it is |
|---|---|
| `dome.js` | The experience. Verbatim landing source + **marked, counted** modifications — see `docs/ARCHITECTURE.md`. |
| `chakra-core.js` | Calendars and astronomy, computed never looked up (project-ilm/chakra). |
| `dome.css` | The landing stylesheet. |
| `scaffold.html` | The DOM contract (ids the dome binds to). |
| `dome.config.example.json` | Annotated starting config. |
| `demo/` | A self-contained consuming page. |
| `docs/` | `CONFIG.md` · `API.md` · `FLIGHT.md` · `WORLDS.md` · `ARCHITECTURE.md` · `PROCESS.md`. |

## Documentation

- **[docs/CONFIG.md](docs/CONFIG.md)** — the full configuration schema.
- **[docs/API.md](docs/API.md)** — the window surface: events, globals, hooks.
- **[docs/FLIGHT.md](docs/FLIGHT.md)** — physics, altitude hold, gravity, sensitivities, the drone emitter.
- **[docs/WORLDS.md](docs/WORLDS.md)** — the Zistgah cosmography and how to extend it.
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how the lib relates to the landing source; the marker taxonomy.
- **[docs/PROCESS.md](docs/PROCESS.md)** — the engineering process this repository is built and maintained under.

Governance: `CONTRACT.md` → **zistgah/governance**. Licensing per category: `LICENSING.md`.
© 1993–2026 Abhishek Choudhary. All rights reserved. · AyeAI · ORCID 0009-0002-0684-8320 ·
Built with Claude Fable 5 (Anthropic).
