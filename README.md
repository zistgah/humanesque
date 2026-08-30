# Humanesque

**PANINI · हिन्दवी Hindawi · ILM · GENIE · Mez · Kitab · the cycler family**

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.
Grok's own README is at `README.grok.md`. `ARCHITECTURE.md` is the index.

```
bash VERIFY.sh                     # 36 checks, no arguments
bash seed_humanesque.sh --push     # gate: SEED humanesque
```

---

## Hindawi — ONE CSV, ONE generator

`ilm/keywords.csv` is the single source. **1,801 constructs × 27 languages.**
Nothing else is authored, and 49 duplicated transducer trees are gone.

    construct  standard  host  kind  iso_clause  std_ref  romenagri  <27 languages>

`tools/hindawi-gen <language> [--script S] [--out DIR]` generates a distribution
from it. Every retrieved rule is carried — guru 323, shraeni 879, yantra 354 —
and a language substitutes the words it has.

### The construct is primary

`for` is one construct shared by C, C++, Java, Python, Rust, Go. It is translated
**once per human language**, not once per host language. The old table repeated it
eight times because it was keyed on host × keyword.

    ilm/constructs.csv    39 constructs x 27 human languages
                          construct, category, gloss, <27 language columns>
    ilm/decorators.csv    216 host realisations across 8 host languages
                          construct, host, keyword, decorator

The decorator is what a *use* of the construct drags in:

    PRINT   c     printf              stdio.h
    PRINT   cpp   cout                iostream
    PRINT   go    fmt.Println         fmt
    PRINT   python print              —
    READ    java  Scanner             java.util.Scanner
    STRUCT  python dataclass          dataclasses

Both are **living documents**. A standard revision changes `decorators.csv`; the
translation in `constructs.csv` does not move.

**The translation work collapsed from 1,729 rows per language to 13.** Hindi is
37 of 39, every other language 26 of 39. `ilm/worksheets/<language>.csv` now holds
those 13 rows with the construct, its category and a gloss.

### 27 AGI layers × 3 languages

`ilm/layers.csv` — for each of L0–L26 (names **read from** `docs/AGI_STACK.md`,
not retyped), the best-suited language and the two most popular alternatives,
each with a stated reason. 81 rows, 29 distinct primary languages.

    L7   OS/runtime     best       C            POSIX is defined in C
                        popular-1  C++          systemd-era userland and services
                        popular-2  Go           runtimes and daemons, GC above the kernel
    L23  Metacognition  best       Lean         metacognition means proof
                        popular-1  Coq          the older, larger proof corpus
                        popular-2  Haskell      types as lightweight proof

Popularity is recorded as a **reason**, not as agreement — the column says why a
language is there, including when the reason is only that people use it.
Toolchain languages (make, ld, kconfig, lex, yacc, cpp, as) are **excluded** and
treated separately, asserted by a check.

### The keyword table — standard construct, and the localized construct in its own script

`ilm/keywords.csv` remains as the per-host keyword surface the shailis are
generated from. No romenagri column; the spine is `ilm/romenagri-spine.csv`.

### Standards compliance

**48 of 49 C keywords carry their ISO/IEC 9899:2011 clause** — `if` 6.8.4.1,
`while` 6.8.5.1, `int` 6.7.2, `#include` 6.10.2, `printf` 7.21.6.3, `main`
5.1.2.2.1. C++ against ISO/IEC 14882:2020. Per-host: c 312 · cpp 860 · asm 349 ·
java 181 · basic 89 · yacc 6 · lex 4. → `docs/data/keywords-compliance.json`

### 36 distributions, 11 scripts

Generated, not stored: `hindawi/<script>/<language>/` with the nine shaili
directories, `hindrv/`, `keywords`, `samples/`, `exercises/`. 51 tarballs in
`hindawi-tar/`. Devanagari carries hindi, sanskrit, marathi, nepali, pali,
prakrit plus marwari, bhojpuri, awadhi, magahi, rajasthani, bodo, dogri,
maithili, konkani — each marked `inherits_vocabulary_from` until it gets its own
CSV column. Give it one and it differentiates.

## Mez — now reads real stage sequences

The stage-nesting defect is **fixed**. D39: a claimed terminator does not reach
past a sibling of the same keyword at the same indent — scoped to STAGE, CYCLE,
RULE, TEST, CASE, STEP, deliberately excluding FILE whose body is a heredoc.

    awaz    1 -> 12 stages      tilasm  1 -> 12
    khwab   1 ->  7            yadein  1 -> 13
    pench       40             genie        6

145/145 still green, spec still 0 errors. matba stays at 2 — its stages nest
inside a WORKFLOW block, a different shape, still open.

## Toolchain — grok's 46 Unix-named frontends

`toolchain/` carries `zistgah/panini_by_grok_toolchain_cgpt_fix` whole: panc,
pancxx, panpy, panjs, pants, panjava, pancs, pankt, panrb, panperl, panphp,
pango, panrs, panzig, panpas, panbas, panfort, panhs, panlisp, panscm, panforth,
panlua, pansql, pancobol, panada, panlogo, panlex, panyacc, panas, panld,
panmake, pankconfig, panml, panjl, panoct, panpl, panst, panclj, panr, panscala,
panswift, pandart, pansysml, panpni, panini. Named extracts, not the host
compilers — grok says so itself and the provenance note repeats it.
**Isolated by design**: it comes from its own repository and will be reached from
there, bundled here only so this build presents as one thing.

Build: `cd guru && make` → `./gurucc ../samples/01-namaste.uhin`.
A `<शैली …>` line selects the pipeline, as it always has.

`dist/hindawi-tar/` — **49 per-language** and **23 per-script** tarballs.
`dist/hindawi-json.tar.gz` — the machine view, **alternative**, not the distribution.

**Devanagari** hindi · sanskrit · marathi · konkani · nepali · bodo · dogri ·
maithili · marwari · bhojpuri · awadhi · magahi · rajasthani · pali · prakrit
**Brahmi** bengali · assamese · gujarati · punjabi · odia · tamil · telugu ·
kannada · malayalam · sinhala · maithili (tirhuta) · marathi (modi) · kashmiri
(sharada) · dogri (takri) · sindhi (khudawadi) · santali · manipuri · saraiki ·
bhojpuri (kaithi) · sanskrit (grantha) · nepal bhasa (newa)
**Perso-Arabic & Semitic** urdu · shahmukhi · sindhi · kashmiri · pashto · dari ·
persian · arabic · **hebrew · aramaic · syriac · phoenician**

### Script round trip — measured

Every character to the Devanagari hub and back. **All 19 Brahmi tables bijective:**
devanagari 128/128 · sharada 83/83 · gujarati 82/82 · oriya 80/80 · tirhuta 80/80 ·
newa 80/80 · bengali 79/79 · kannada 79/79 · malayalam 79/79 · telugu 78/78 ·
modi 77/77 · gurmukhi 68/68 · khudawadi 69/69 · takri 66/66 · grantha 64/64 ·
kaithi 62/62 · tamil 56/56 · multani 37/37. → `docs/data/hindawi-roundtrip.json`

### Keyword provenance — filled, every one editable

`tsv`/`csv` retrieved · `inherited:X` same script and register · `projected:X`
character-wise through the script's own table · `projected-partial:X` one or more
characters unmapped and carried through. **Nothing left blank** — an empty table
helps nobody. Edit `guru/h2c.uhin` and re-make.

### Exercises — five per distribution

hello · count to ten · factorial by recursion · add a function · **break it on
purpose and read the diagnostic**, which is where you meet the missing `#line`
directive. Stated, not hidden.

---

## What else is in this merge

**Site:** `docs/hindawi.html` (new), `docs/ilm.html`, `docs/frontends.html`, all
linked from `docs/index.html`, all reading real JSON — if the JSON is unreadable
they say so rather than render a fabricated table.

**Frontends, exercised not counted.** Each run on a real program *and* a malformed
one. WORKING 3 · ACCEPTS-ANYTHING 13 · WRONG-RESULT 12 · FAILS-ON-VALID 2 ·
UNREACHABLE 2. Upstream reports 45/45 green; the difference is the question asked.
`docs/data/frontend-status.json`.

**Shailis compose.** `shabdacc` runs `h2l | h2c`, `wyaakacc` runs `h2yacc | h2c`.
shabda is 327 rules (6 own + 321 via h2c), not 6. wyaaka 341, not 20. **2,555 total.**

**Four honesty fixes** re-applied to this pull: MIT/GPL licence conflict ·
`never_nonzero` test policy · hardcoded A-vs-B comparison · Mez's hand-made
workflow snapshot, now derived from the `.pni` cyclers.

**Isolated by design.** `apps/` carries components that will come from their own
repositories later — they are bundled for this build only, not absorbed.

---

## Not asserted

- **Mez does not work as intended.** Six cyclers recover only their first `STAGE`.
  A fix took matba 1→28 and broke a FILE assertion; reverted rather than shipped
  half-tested. `docs/GROK_UPDATE.md` §1.
- **GENIE is not done.** Eleven nodes specified, none implemented here.
- **Not self-hosting.** The JS target is not the reason — `compiler.pni` is 25
  lines calling `lex()`, `build.pni` is seven functions returning `TRUE`. Both
  implementations are kept and left disagreeing.
- **flex is not installed in the build sandbox**, so the generated `.l` files were
  not taken to a binary here. The C path was, end to end, with अ and क in DWARF.

`ARCHITECTURE.md` · `docs/GROK_UPDATE.md` · `docs/KNOWLEDGE_TRANSFER_FOR_GROK.md` ·
`spec/DELTAS.md`
