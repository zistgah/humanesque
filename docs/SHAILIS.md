# Shaili registry — original Hindawi subset + 2026 extension

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

A **शैली (shaili)** is a *host-language localization*, not a spoken language.
Dialect tag: `<शैली NAME>` on line 1 (retrieved `hincc.awk`).

## Original eight (Hindawi 2004, retrieved lexers ARE the mapping)

| Shaili | Devanagari | Host | Filter | Layer |
|---|---|---|---|---|
| guru | गुरु | C | `guru/h2c.lex` | Romenagri |
| shraeni | श्रेणी | C++ | `shraeni/h2cpp.uhin` | Romenagri |
| praatha | प्राथमिक | BASIC | `praatha/h2b.uhin` | Devanagari |
| kritrima | कृत्रिम | Java | `kritrima/h2j.uhin` | Romenagri |
| soochee | सूची | Python | `soochee/h2py.lex` | Romenagri |
| shabda | शब्द | lex | `shabda/h2l.uhin` | Romenagri |
| wyaaka | व्याकरण | yacc | `wyaaka/h2yacc.uhin` | Romenagri |
| robot | रोबोट | Logo (Indic) | `src/jpchin/ROBOT.C` | graphics; named Robot for FreeBot ANGEL |

These eight are **heritage**. Do not regenerate the kernel mappings.

## 2026 extension (Hindawi-style names; this tree, not 2004)

Named in the same Sanskrit/Hindi metaphor discipline. **Not** retrieved 2004 lexers.
Implementation = PANINI frontend + bidirectional transducer. Not `#define`.

| Shaili | Devanagari | Host | Why this name | Open implementable standard |
|---|---|---|---|---|
| jala | जाल | JavaScript | net / web | ECMA-262 (royalty-free) |
| rupa | रूप | TypeScript | form / type | Apache-2.0 handbook; erases to JS |
| gamana | गमन | Go | going / motion | Go spec BSD; gc |
| ayas | अयस् | Rust | iron | RFCs MIT/Apache-2.0 |
| svara | स्वर | C# | sharp / tone | ECMA-334 / ISO/IEC 23270 |
| chandra | चन्द्र | Lua | moon | Lua MIT reference |
| manikya | माणिक्य | Ruby | ruby | ISO/IEC 30170 (Ruby 1.8/1.9) + MRI |
| sutra | सूत्र | SQL | aphorism / thread | ISO/IEC 9075 |
| vidhi | विधि | Fortran | formula/method | ISO/IEC 1539 |
| ganana | गणना | R | calculation | R Language Definition, GPL |
| pravaha | प्रवाह | Kotlin | flow | Kotlin spec Apache-2.0 |
| shighra | शीघ्र | Swift | swift | Apache-2.0 language (trademark: Apple) |
| moti | मोती | Perl | pearl | Artistic License / GPL; perlpolicy |
| jalandhara | जालधर | PHP | web-bearer | PHP License + language spec |
| vyavasaya | व्यवसाय | COBOL | business | ISO/IEC 1989; gnucobol |
| tarka | तर्क | Prolog | logic | ISO/IEC 13211 |
| ganita | गणित | Julia | mathematics | Julia MIT |
| dhera | ढेर | Forth | stack | ANS Forth / Forth-2012 |
| sopana | सोपान | Scala | scale / stair | Scala Language Spec BSD |
| aalasi | आलस्य | Haskell | laziness | Haskell 2010 Report |
| pratik | प्रतीक | Lisp | symbol | ISLISP ISO/IEC 13816; Scheme R7RS |
| yojana | योजना | Scheme | scheme / plan | R7RS-small; IEEE 1178 (R5RS) |
| suraksha | सुरक्षा | Ada | safety | ISO/IEC 8652; GNAT GPL |
| shiksha | शिक्षा | Pascal | teaching | ISO 7185 / 10206; Free Pascal |
| bana | बाण | Dart | dart / arrow | Dart spec BSD |
| kram | क्रम | Zig | order | Zig Language Reference MIT |
| kosh | कोश | Clojure | treasury / lisp | EPL; hosted on JVM |
| rekha | रेखा | Logo | line / turtle | UCBLogo; no ISO — heritage pedagogy |

**Scratch / Visual Basic / MATLAB** are popular (TIOBE) but fail the liability tests below (proprietary VM or no open language standard we can reimplement as a shaili without a vendor runtime). They are **specimens in the museum**, not shailis.

## Naming invariant

Shaili names the **host**, never the spoken language.
Punjabi Guru is still `<शैली गुरु>` written in Gurmukhi, not a ninth C.
