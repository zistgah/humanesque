# Component correlation (this turn)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

Deep correlation of what exists. **Frozen sources were not edited.**

| Concern | Canonical | Adapter | Must not |
|---|---|---|---|
| PANINI eval | `runtime/interpreter.js` FROZEN | `docs/engine/interp/interpreter.js` (process shim + `./parser.js`) | overwrite frozen |
| Node builtins | `runtime/builtins.js` | — | copy Node toolchain into Pages |
| Pages builtins | `docs/engine/interp/builtins.js` | adds CLOWER/CINTERP for frozen `c.pni` | a third builtins |
| C frontend | `src/panini/frontends/c.pni` FROZEN | `docs/engine/interp/c.pni` | `languages/c.pni` |
| Language museum | `languages/*.pni` | axis *character*, not a compiler | grow a second eval |
| C lowering | `runtime/clower.js` | copied to interp | edit `c.pni` |
| Chakra core | `docs/chakra/chakra-core.js` | `docs/dome/chakra-core.js` (sync) | a third ephemeris |
| VFS | `runtime/vfs.js` FROZEN | `docs/console.js`, `stdlib/vfs.pni` | inlined VFS |
| Ontology | `ontology/core.json` | `docs/ontology/core.json` | markdown graph |
| Site | `docs/` | — | `website/` (obsolete; Pages does not publish it) |
| Cyclers | `cyclers/upstream/` | `docs/cyclers/` | ChatGPT-syntax as spec |

`scripts/factory_sync.mjs` refreshes the adapter copies. `scripts/factory_scan.mjs` verifies freeze hashes.

languages/*.pni stay museum specimens. They are **not** stale frontends.
