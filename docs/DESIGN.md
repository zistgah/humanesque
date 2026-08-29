# Design — foundations iteration 1

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

## C frontend (REQ-200)

**Decision:** grow a C17-shaped subset in the virtualized backend while the PANINI frontend (`c.pni`) remains the localization surface.

**This iteration**

- Lexer: `//` and `/* */`, two-character ops (`== != <= >= ++ --`).
- Parser: `if` / `else` / `while` / `for`, comparisons in expressions, `int` functions with parameters.
- Eval: bounded loops (100000).
- Tests: `tests/c_iso_iter1.mjs` (sum 1..10, if, while).

**Not this iteration:** preprocessor macros, structs, pointers, unions, `goto`, VLAs, the C17 standard suite, `gcc`. Hindawi already emits machine code via gcc since 2004; this sibling's *browser* host does not replace that fact.

## lex and yacc (REQ-210, REQ-211)

**Decision:** specify lex as an ordered list of regular rules; specify yacc as a grammar whose binary-op fragment is implemented by precedence (the book form remains left-recursive).

Files: `runtime/lexyacc_formal.js`, `src/panini/lexyacc.pni`.

Tests: `3+4*5=19`, `(1+2)*3=9`.

## Console (REQ-220)

`docs/console.html` + `docs/console.js`. VT100 is the terminal; bash and COMMAND.COM are radio-selected applications. In-memory VFS. Metaphor: 486 / 4 MiB / ~500 MB now fits in the tab.

## Build trivia (REQ-321)

At zip time, `tests/build_trivia.mjs` asks retrieved Chakra for the pañcāṅga of the build instant. Published under `docs/trivia/`. **Not a prediction.** Cultural / heritage computation. See the disclaimer on that page.

## Application-layer frontends (REQ-004)

L8 JavaScript, L11 SQL, L16 BASIC/Logo, plus Java, PHP, Ruby, C#, R, Perl.
Implementation is `src/panini/frontends/application.pni` (PANINI). Host loader
`foreign_front.js` only calls `run_*`. PANINI gained `ELSEIF` / `ELSIF` and `CONTAINS`.
Not ECMA/ISO-green.


`SPINOFF.json` lists path → repo. Local automation unzips `panini/` and may copy `apps/*` to sibling checkouts. This tree does not push.
