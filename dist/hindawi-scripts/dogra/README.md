# Hindawi — DOGRA

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

The Hindawi Indic Programming System for the **DOGRA** script. Self-contained.

## The three axes, all here

| axis | what | in this bundle |
|---|---|---|
| SCRIPT | DOGRA → Devanagari hub | `dogra_to_deva.tsv` — 61 rows |
| LANGUAGE | keyword vocabulary | `langs/` — dogri |
| STANDARD | computational construct | `maps/` — 9 shailis, 2555 rules |

## The nine shailis

- **shraeni** (C++) — 879 rules
- **yantra** (asm) — 354 rules
- **wyaaka** (yacc) — 341 rules (20 own + composed via h2c)
- **shabda** (lex) — 327 rules (6 own + composed via h2c)
- **guru** (C) — 323 rules
- **kritrima** (Java) — 186 rules
- **praatha** (BASIC) — 99 rules
- **soochee** (Python) — 38 rules
- **robot** (LOGO) — 8 rules

**The transducers compose.** `shabdacc` runs `h2l | h2c` and `wyaakacc` runs
`h2yacc | h2c`: a lex or yacc action block *is* C, so those shailis inherit the
C vocabulary. Reading one alone reports a working shaili as a broken one.

## Use it

    node hindawi_pipeline.mjs <file.uhin>    # which pipeline, how many rules
    node build_ilm_matrix.mjs                # regenerate the keyword tables

A `<शैली …>` line at the top of a source selects the pipeline.

## What is filled and what is not

0 of 9 language×shaili tables carry native keywords.
A row with an **empty native column is UNRESOLVED** — a speaker must author it.
Nothing here invents a native keyword. A wrong keyword is worse than an absent one.
