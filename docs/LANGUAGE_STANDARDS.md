# Open language standards we can implement without legal liability

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Popularity: **TIOBE Index, August 2026** (Python 18.53% … Assembly 0.86%).
This is a ranking of *search interest*, not a permission list.

## Criteria (all must hold)

1. **Public grammar** — a documented syntax/semantics we can implement (ISO, ECMA, IEEE, language report, or RFCs).
2. **No proprietary VM as sole host** — MATLAB, SAS, Wolfram, closed BASIC runtimes are out as shailis.
3. **OSI-or-ISO path** — either an OSI-licensed reference implementation, or an ISO/ECMA/IEEE standard whose *ideas* are implementable (we do not paste the paid ISO text into this tree).
4. **Trademark hygiene** — we implement the *language*; we do not brand the shaili as the vendor product (Java™, Swift®).
5. **GPL-3 compatible frontend** — our PANINI transducers stay GPL-3; host toolchains stay theirs (`THIRD_PARTY.md`).
6. **No essential patents asserted against independent compilers** of that language, as far as the public record shows. Unresolved → not a shaili until ruled.
7. **Bidirectional transducer possible** — Hindawi invariant. `#define` is not localization.
8. **Axis occupancy** — the language must occupy a distinct region of PANINI’s 13-axis space (otherwise it is a dialect of an existing shaili).
9. **Historical necessity** — Fortran, COBOL, Lisp, Prolog, Forth, Pascal, Ada stay in even if they drop off TIOBE’s top 10. They are computational specimens.
10. **Human sovereignty** — a language whose only honest implementation requires a vendor account/API is refused (mez/cycler rule).

## TIOBE August 2026 — decision

| # | Language | Rating | Shaili | Standard we implement against | Decision |
|---|---|---|---|---|---|
| 1 | Python | 18.53% | सूची soochee | PSF / language reference; CPython tests later | **in** (heritage) |
| 2 | C | 11.10% | गुरु guru | ISO/IEC 9899:2018 (C17) | **in** (heritage) |
| 3 | C++ | 8.62% | श्रेणी shraeni | ISO/IEC 14882 | **in** (heritage) |
| 4 | Java | 8.25% | कृत्रिम kritrima | OpenJDK + JLS; no Java™ branding | **in** (heritage) |
| 5 | C# | 4.09% | स्वर svara | ECMA-334 / ISO/IEC 23270 | **in** (2026) |
| 6 | JavaScript | 2.63% | जाल jala | ECMA-262 | **in** (2026) |
| 7 | Visual Basic | 2.18% | — | Microsoft proprietary | **out** |
| 8 | SQL | 1.88% | सूत्र sutra | ISO/IEC 9075 | **in** (2026) |
| 9 | R | 1.56% | गणना ganana | R Language Definition (GPL) | **in** (2026) |
| 10 | Rust | 1.45% | अयस् ayas | Rust RFCs | **in** (2026) |
| 11 | Delphi/Pascal | 1.37% | शिक्षा shiksha | ISO 7185/10206; Free Pascal | **in** (Pascal dialect) |
| 12 | Scratch | 1.27% | — | MIT Scratch VM; blocks, not a shaili lex | museum / Blockly, not shaili |
| 13 | PHP | 1.11% | जालधर jalandhara | PHP language spec | **in** (2026) |
| 14 | Go | 1.07% | गमन gamana | Go spec | **in** (already a PANINI frontend) |
| 15 | Fortran | 0.99% | विधि vidhi | ISO/IEC 1539 | **in** (already a frontend) |
| 16 | Ruby | 0.98% | माणिक्य manikya | ISO/IEC 30170 | **in** (2026) |
| 17 | Swift | 0.96% | शीघ्र shighra | Apache language; Apple trademark | **in**, no Swift® branding |
| 18 | Perl | 0.94% | मोती moti | perlpolicy / Artistic | **in** (2026) |
| 19 | COBOL | 0.87% | व्यवसाय vyavasaya | ISO/IEC 1989; gnucobol | **in** (2026) |
| 20 | Assembly | 0.86% | यांत्रिक yantra | implementation-defined; fasm path | **in** (heritage) |

Plus heritage not in this top 20: lex, yacc, BASIC, Logo, Lisp, Scheme, Prolog, Forth, Haskell, Julia, Kotlin, Dart, Zig, Ada, Lua, TypeScript, Scala, Clojure.

## What “implement” means here

A shaili is a **Hindawi-class bidirectional transducer** into that host, written in PANINI (`T_FRONTEND_PANINI`), plus the original pipeline (lang-TSV → flatten → unicode.h → acii2rmn → lex).

It is **not** a claim of ISO-green CONFORMANCE until that suite is run (`CAN_COMPILE.md`, contract clause 5).
