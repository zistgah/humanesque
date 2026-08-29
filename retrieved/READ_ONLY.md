# retrieved/ — read-only vendor tree

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

**Do not edit files under this directory.** They are retrieved, not reconstructed.

| Path | Source | Retrieved |
|---|---|---|
| `legacy/APCISR/` | https://github.com/project-ilm/legacy `APCISR/` (fork of hindawiai/2023.12.21) | 2026-08-28 |
| `legacy/Hindawi/guru/` | https://github.com/project-ilm/legacy `Hindawi/guru` (`h2c.lex`, `c2h.lex`, `gurucc`) | 2026-08-28 |
| `romenagri/` | https://github.com/project-ilm/romenagri (library: `src/`, `tables/`, `bindings/js/`) | 2026-08-28 |

## Rules

1. Maps live in the retrieved tables and lex sources. Do not invent a keyword table or a new transliteration map.
2. APCISR is the true text-mode Indic renderer (fonts `devnagri.f08` / `devnagri.f16`, `acii2csr`). `runtime/vt100.js` is not APCISR.
3. Romenagri JS binding is `romenagri/bindings/js/romenagri.js` driven by `romenagri/tables/canonical_basis.json`.
4. Upstream licenses stay in each subtree (`copying`, `LICENSE`). GPL. Not relicensed.

Binaries, `.o`, `.a`, and corpora were not copied. Sources and tables were.
