# Module contracts

Copyright (C) 1993-2026 Abhishek Choudhary  

| Module | Path | Owns | Must not own | Adapter |
|---|---|---|---|---|
| VFS | `runtime/vfs.js` | in-memory tree, pwd/cd/ls/read/write/mkdir/rm | shell syntax | — |
| Shell | `runtime/shell.js` | bash + COMMAND.COM over VFS | HTML | `docs/console.js` (Pages UMD) |
| PANINI interp | `runtime/interpreter.js` | execute `.pni` | language frontends | — |
| App frontends | `src/panini/frontends/application.pni` | JS/Java/SQL/PHP/Ruby/C#/R/Perl/BASIC/Logo subsets | ISO-green claims | `foreign_front.js` *loads* only |
| Python frontend | `src/panini/frontends/python.pni` | Python subset in PANINI | CPython | same loader |
| C frontend | `src/panini/frontends/c.pni` + `mini_langs.js` iter | C subset | C17 suite | — |
| Hindawi port | `runtime/hindawi_port.js` | retrieved pipeline | new maps | notebook |
| Chakra | `apps/project-ilm/chakra` | retrieved ephemeris | reconstructed astronomy | `docs/chakra/` |
| Ontology | `ontology/core.json` | node identity, labels, edges | FAKIR ISIC tables | `docs/ontology/` + `docs/ontology.html` |
| C lowering | `runtime/clower.js` + `gnuc.js` | C four-pass + GNU pre-pass | WASM emitter | `docs/engine/interp/clower.js` (sync) |
| Pages interp | `docs/engine/interp/` | browser C→WASM | Node toolchain | factory_sync from canonical |
| Language museum | `languages/*.pni` | axis character | STANDARD GREEN claims | frontends are `src/panini/frontends/` |
| Factory | `factory/REGISTRY.json` | freeze + reuse | rewriting frozen files | `scripts/factory_scan.mjs` |


**Replication found this turn (kept only as named adapters):**

- `docs/console.js` = Pages adapter of `runtime/shell.js` + `runtime/vfs.js`
- `docs/ontology/core.json` = Pages copy of `ontology/core.json`
- `stdlib/vfs.pni` / `stdlib/bash.pni` = PANINI *surface*, not a second VFS implementation — do not grow them into a third tree
- Generated `*_guru.uhin` copies under retrieved vs docs/demos — retrieved is canonical

**Do not add:** another inlined VFS in workbench.html, another ontology in markdown, another factorial in English without an ontology edge.
