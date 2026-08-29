# Linguistic Equity is an architecture

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Not a social initiative. Not a translation layer. Not `#define je if`.

Conversation-derived (PANINI v2), not a published historical HPS/ILM
doctrine until the architect says otherwise.

## Two pillars

1. **Representational equity** — every linguistic community has a faithful,
   reversible, identity-preserving digital representation, rather than being
   forced through a privileged language/script.

2. **Computational equity** — every linguistic community can create, execute,
   and govern computation in its own linguistic substrate, rather than only
   translating into an English-centric computational system.

## Mapping

```
Representational Equity  ↔  ILM
Computational Equity     ↔  PANINI

Linguistic Equity  =  Representational Equity + Computational Equity
```

ILM makes **script** independently variable. PANINI makes **paradigm ×
axis configuration** independently variable. The defining v2 abstraction:

```
(Script × Paradigm × Axis Configuration) → Canonical IR
```

## Three axes (do not collapse)

| Axis | What | Example |
|---|---|---|
| Script | How it is written | Devanagari, Gurmukhi, Telugu, Nastaliq |
| Language | Which words | Hindi यदि, Punjabi ਜੇ, Urdu اگر |
| Standard | Which host | C, BASIC, Java, Python, lex, yacc, asm |

Brahmi scripts share Devanagari as the flatten hub (`flatten_uni_dev.lex`)
— round-trip **table-complete**. Perso-Arabic uses the manual `urdu_map` /
`fltr_ur_hi` and is **lossy** (abjad residue is linguistics work).

## Toward 100% (named, not claimed)

Counted in this tree. Not a live 7000-language walk.

| Layer | Have | Target | Gap |
|---|---|---|---|
| Brahmi name-projection tables | 57 nonempty / 74 | all named scripts | 17 empty (names do not parallel Devanagari) |
| flatten_uni_dev (2004 lex) | 793 pairs, 9 scripts | those 9 | table-complete |
| ISO 15919 hub | 11 columns, Aran↔Deva 55/59 | lossless Perso-Arabic | abjad residue |
| Eighth Schedule keyword TSVs | 16 / 22 | 22 | Bodo, Dogri, Konkani, Maithili, Manipuri, Santali — not invented |
| Language C standards published | 27 | every TSV × every shaili | BASIC/C++/Java/ASM standards open |
| Identifier dictionary (view ≠ compile) | yes | glossary coverage | glossaries by deposit |
| Time / calendars in operator language | CHAKRA retrieved × label view | ten traditions × retrieved langs | festival glossary partial |
| Lowest-layer debug in operator language | Hindawi 2004 bar | all shailis | still the bar |

**100% linguistic equity** means both pillars, on every axis, through gdb/`nm`. This tree is not there. Chakra today: the instant is computed; the *view* of Rakṣā Bandhana may be रक्षा बंधन; the ephemeris is not reconstructed.

