# Factory

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

Browse **before writing a file**.

| File | Owns |
|---|---|
| [REGISTRY.json](REGISTRY.json) | Every component. `freeze:true` is hash-locked. |
| [languages.json](languages.json) | Language → frontend, runtime, harness, STANDARD GREEN. Browse this before adding a frontend. |
| [agi_map.json](agi_map.json) | L0–L26 → registry ids. STANDARD GREEN 1/27 is L13 C only. |
| [DELIBERATION.md](DELIBERATION.md) | Unfreeze protocol. |
| [CORRELATION.md](CORRELATION.md) | Canonical vs adapter. |
| `scripts/factory_scan.mjs` | Freeze verify + SHIP GREEN + language index. Always exit 0. |
| `scripts/factory_sync.mjs` | Canonical → adapter copy. Never reverse. |

## Groups (REGISTRY.json `groups`)

- **frozen** — do not edit without deliberation.
- **frontends-live** — PANINI `.pni` frontends; lowering/eval in `runtime/*`.
- **runtimes-live** — host-speed eval (CINTERP slot).
- **factory** — scan, sync, maps.
- **estate** — VFS-adjacent stubs, spine, VGA.

`languages/*.pni` are AGI catalog stubs (axis character). They are **not** a second compiler.

## Add a language (STANDARD GREEN)

1. Retrieve the issuing-body spec and that body's executable suite (`retrieved/standards/SOURCES.md`).
2. Name the extract. Homemade 20-case is CORE GREEN only.
3. Put eval in `runtime/` (not a frozen `.pni`). Frontend `.pni` calls one builtin.
4. Harness always exits 0. `docs/data/<lang>-std-green.json`. skip=0 or named GAP.
5. Register in `languages.json` and REGISTRY (live, unfrozen). `factory_sync` adapter copy.

## Low-hanging next (not this turn)

Suite already in tree or a thin named extract is plausible: **Scheme** (R5RS / lisp cousin), **Lua** (5.4.7 tests retrieved, not skip=0), **Forth**, **Clojure**, **OCaml**. Spec retrieved, suite GAP: **Go** `all.bash`, **Rust** rustc ui, **Zig**. Fortran gfortran execute remains GAP.
