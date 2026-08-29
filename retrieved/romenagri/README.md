# Romenagri — Reversible Transliteration Library (Perso-Arabic seed)

Deterministic, reversible transliteration engine underlying the Hindawi
Programming System (first public release 15 August 2004) and Project ILM.
Original Romenagri release: 2003 (GPL).

**This seed release** packages the Romenagri core (round-trip transliteration
engine) together with the **Perso-Arabic** data — covering the Perso-Arabic-
family languages demonstrated live at https://ilm.codes/map.html
(transpile-and-execute). Other-script corpora are included for context.

## Layout
- `src/`     — the reversible core: ACII layer, acii2rmn/rmn2acii, stack, lexer,
               uni<->acii, hin paths. (Extracted from the chintamani lineage.)
- `data/`    — Perso-Arabic: Arabic/Urdu character maps, corpora, tashkil,
               alphabet, and the Urdu<->Hindi filter (fltr_ur_hi).
- `corpora/` — other-script corpora (Hindi, Bengali, Punjabi, Telugu).
- `tests/`   — sample round-trip inputs.
- `docs/`    — conversion notes / instructions.

## Status (honest)
Reversibility (measured over arbitrary [a-z] input): ~98.68% exact-or-
canonicalizable, ~1.31% irreducible-ambiguity floor. The engine compiles with
GCC; hardening (totality over the full input space, O(n), re-entrancy, WASM)
is the next step. This is a SEED release for prior-art and reuse, not a
hardened v1.

## Lineage / prior art
SourceForge (sf.net/projects/hindawi, 2004), Savannah (savannah.nongnu.org/
projects/hindawi, 2005), CSI YITPA 2005, FOSS India (CDAC), TDIL recognition.

Copyright (C) 1993-2026 Abhishek Choudhary. Licensed GPL (see LICENSE).
Dedicated, among others, to Dr. A.P.J. Abdul Kalam. May Allah forgive and bless
his soul.
