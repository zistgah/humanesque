# Supported languages — honest inventory

Copyright (C) 1993-2026 Abhishek Choudhary
Retrieved industrial targets vs this tree. Nothing here is claimed CONFORMANT.

Term: **supported languages**. Not “constituent languages.”

Live index: `factory/languages.json`. STANDARD GREEN table: `docs/STANDARD_GREEN.md`.
A homemade 20-case file is CORE GREEN only.

## Best sources in this tree (what exists)

| Object | Best file now | What it actually is |
|---|---|---|
| PANINI language | `spec/PANINI_SELF_HOSTING_SPEC.pni` | Constitution. Do not rewrite. |
| PANINI lexer/parser (JS host) | `compiler/lexer.js`, `compiler/parser.js` | Stage-0 bootstrap. Self-host T0 on a **compiler subset**. |
| PANINI lexer/parser (PANINI) | `compiler/lexer.pni`, `src/panini/parser.pni` if present | Partial self-host. |
| IR / VM | `compiler/ir.js`, `runtime/irvm.js` | Working on subset IR. |
| Interpreter | `runtime/interpreter.js` | Host execution. |
| C frontend in PANINI | `src/panini/frontends/c.pni` | Subset lexer/eval. |
| C++ | `src/panini/frontends/cpp.pni` | Thin; routes through C subset. |
| Python | `src/panini/frontends/python.pni` | Subset + list/tensor atoms. |
| Fortran | `src/panini/frontends/fortran.pni` | Subset. |
| Rust | `src/panini/frontends/rust.pni` | Subset. |
| TypeScript | `src/panini/frontends/typescript.pni` | Subset. |
| Go | `src/panini/frontends/go.pni` | Subset. |
| Zig | `src/panini/frontends/zig.pni` | Subset. |
| Lua | `src/panini/frontends/lua.pni` | Subset lexer + shared subset eval. 5.4.7 tests retrieved; not skip=0. |
| Common Lisp | `src/panini/frontends/lisp.pni` | STANDARD GREEN on ansi-test named extract. Eval in `runtime/cleval.js`. |
| Prolog | `src/panini/frontends/prolog.pni` | STANDARD GREEN on Ciao ISO arith extract. Eval in `runtime/pleval.js`. |
| Shared subset eval | `runtime/mini_langs.js` | Not rustc/tsc/gcc. |
| Dispatch | `runtime/foreign_front.js` | Extension → frontend module. |
| Console | `runtime/vt100.js`, `runtime/dosfont.js` | VT100 + DOS 8×16. Not APCISR. |
| VFS / bash | `runtime/vfs.js`, `stdlib/bash.pni` | Personality, not POSIX.1 complete. |

## Standard harness each language is measured against

| Language | Industrial target | Official suite (do not substitute) | This tree |
|---|---|---|---|
| C | ISO/IEC 9899:2018 (C17) | c-testsuite `tests/single-exec` (retrieved) + gcc `-std=c17` oracle | **NOT GREEN.** Harness: `node src/cli.js iso-c`. |
| C++ | ISO/IEC 14882 | libstdc++ tests / llvm-test-suite cxx | **Not run.** Not C++. |
| Python | Language Reference of a named CPython (state 3.12 when chosen) | `Lib/test` of that CPython | **Not run.** |
| Fortran | ISO/IEC 1539 (Fortran 2018 or named) | gfortran torture / fortran-dev tests | **Not run.** |
| Rust | The Rust Reference + Edition | rustc `tests/ui` | **Not run.** |
| TypeScript | ECMA-262 + TypeScript spec | `typescript` `tests/` | **Not run.** |
| Go | The Go Programming Language Spec | `$GOROOT/test` | **Not run.** |
| Zig | Zig Language Reference of a named version | zig `behavior` tests | **Not run.** |
| Lua | Lua 5.x reference manual of a named version | PUC-Rio `lua-tests` | **Not skip=0.** lua.org 5.4.7 tests retrieved; low-hanging. |
| Common Lisp | ANSI INCITS 226-1994 / CLHS | Paul Dietz ansi-test | **STANDARD GREEN** on named self-contained deftest extract (19). Full ansi-test is GAP. |
| Prolog | ISO/IEC 13211-1 | Ciao iso_tests | **STANDARD GREEN** on ISO 8.6/8.7 arith extract (23). bagof/setof/IO/exceptions GAP. |
| PANINI | `PANINI_SELF_HOSTING_SPEC.pni` | self-host A=B=C + own suite | T0 subset verified. Full spec **not** theorem-complete. |

“Supported” in this tree today means: a PANINI module exists that lexes a **named subset** and some programs print a number. It does **not** mean the ISO/PUC/rustc harness is green.

## What must not be collapsed

- Supported-language frontend in PANINI ≠ host gcc/CPython.
- Romenagri/ILM representation ≠ keyword table for `if`/`for`.
- Console (APCISR / text-mode glyphs) ≠ a web IDE terminal widget.
- Shaili Guru (Indic C) ≠ this C subset.

Next sitting that claims C is done must name the ISO edition and run a retrieved harness, or keep the gap label.
