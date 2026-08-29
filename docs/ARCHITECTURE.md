# Architecture — panini_by_grok

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

This sibling tree is a Stage-0 realization of `PANINI_SELF_HOSTING_SPEC` plus ILM/Hindawi retrieval and a Pages workbench. It is not `zistgah/panini` (prompt-cycle language) and not `panini_by_claude`.

## Context view

```
Humanesque (constitution)     AyeAI triad (cognition · CNS · embodiment)
        \                         /
         \                       /
          Zistgah (ecosystem) — cyclers — GENIE
                    |
         FAKIR (domain) × PEDLER (dynamics) × ILM (representation)
                    |
              PANINI (whole-structure language)
                    |
         Hindawi pipeline + Chakra (time) + C/lex/yacc frontends
                    |
         virtualized JS backend  →  later gcc / POSIX / OCI
```

## Logical layers

| Layer | What | This tree |
|---|---|---|
| L representation | ILM, Romenagri, flatten, name-projection | retrieved + notebook |
| L language | PANINI + shailis + foreign frontends in PANINI | C iter 1; others subset |
| L tools | lex, yacc | formal tables, virtualized |
| L time | CHAKRA | retrieved v1.4.1 |
| L execution | interpreter, IR VM, VFS, VT100 | browser |
| L workbench | Pages, PWA, console, mez, cyclers | docs/ |
| L estate | explorer instrument, spin-off apps/ | DOI 22122422 |

## C / lex / yacc (foundations)

ISO C is **not** complete. Iteration 1: preprocessor skip, `int`/`char`/`void`, `if`/`else`/`while`/`for`, comparisons, `printf`, `/* */`, functions. Host: `runtime/mini_langs.js`. PANINI lexer/parser: `src/panini/frontends/c.pni`.

lex/yacc: `runtime/lexyacc_formal.js` (table-driven lexer + yacc-shaped expr grammar). Not AT&T lex / GNU bison. Next iterations: generate C from `.l` / `.y` through the Hindawi Shabda/Vyaakaran pipeline.

## Physical (Pages)

`docs/` is the GitHub Pages root. Spin-off trees under `apps/<org>/<repo>`. Zip automation reads `SPINOFF.json`.
