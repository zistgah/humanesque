# Linguist laboratory

Copyright (C) 1993-2026 Abhishek Choudhary  
GPL-3.0-or-later

## Mechanism (do not replace)

Brahmi-derived scripts flatten by **Unicode name-projection** onto Devanagari.
The retrieved Gurmukhi TSV says so in its header. This turn filled the other
stub `*_to_deva.tsv` files with that same generator (`unicodedata.name`,
replace script token with `DEVANAGARI`). That is not a handmade phonetic map
and not `#define`.

`flatten_uni_dev.lex` remains the 2004 nine-script working lex (793 pairs).

Semitic scripts are **not** forced through Devanagari. Hebrew is a direct
Unicode inventory (`semitic/hebrew_direct.tsv`). Phoenician, Imperial Aramaic,
Syriac likewise. Arabic *signs* are inventoried; Arabic *language* still uses
retrieved `urdu_map.csv` and is **lossy**.

Cuneiform and Egyptian hieroglyphs: Unicode-encoded signs only.
**No Sumerian, Akkadian, or Middle Egyptian keywords were invented.**

## Programme vs clone

| Claim | Where |
|---|---|
| 600+ scripts × 7000+ languages | ILM MRD programme |
| 74 name-projection tables, 57 nonempty | this clone, counted |
| 27 `*_c.tsv` languages | this clone |
| Dialects | **not retrieved** — add as language TSV + dialect tag, same format |

## How to extend (collaborators)

1. Script (Brahmi family): add/adjust `retrieved/romenagri/tables/<script>_to_deva.tsv` in the Gurmukhi format. Re-run `tests/roundtrip.mjs`.
2. Script (Semitic): direct TSV, not Devanagari hub.
3. Language keywords: `langs/<lang>_c.tsv` columns `native`, `romenagri`, `c`. Unique natives. No macros.
4. Dialect: same TSV plus a dialect field. Do not collapse dialect into script.
5. Cuneiform/Egyptian **language**: wait for a retrieved or DOI-backed wordlist. Do not fill from memory.

Public surface: `docs/linguist.html`.
