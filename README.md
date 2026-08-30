# Humanesque

**PANINI · हिन्दवी Hindawi · ILM · GENIE · Mez · Kitab · the cycler family**

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.
Grok's own README is at `README.grok.md`. `ARCHITECTURE.md` is the index.

```
bash VERIFY.sh                     # 36 checks, no arguments
bash seed_humanesque.sh --push     # gate: SEED humanesque
```

---

## Hindawi — 49 distributions, 23 scripts, FULL retrieved transducers

**Corrected.** The previous build reduced `guru/h2c.uhin` from the retrieved
**323 rules to 29**, and the `keywords` file from **714 to 29**. That was a
reduction, not a distribution. Rebuilt: the retrieved transducer is the base and
**every rule is carried** — preprocessor directives, header-name mappings, the
lot. A language substitutes the words it has and carries the rest through
unchanged.

    guru      323 rules  (16 localised for hindi)      shabda     4  composes h2l | h2c
    shraeni   879 rules  (18 localised)                wyaaka     6  composes h2yacc | h2c
    yantra    354 rules                                soochee   38  (8 localised)
    kritrima  186 rules  (14 localised)                praatha   99
    keywords  724 entries                              TOTAL  1,852 rules per distribution

`hindawi/` — **not** `dist/hindawi/`, which is grok's and is now untouched.

## Layout

`dist/hindawi/<script>/<language>/` in the retrieved Hindawi layout. **Not JSON.**

```
hindawi/<script>/<language>/
  guru/ shraeni/ praatha/ kritrima/ soochee/ shabda/ wyaaka/ yantra/ robot/
     h2<host>.uhin  <host>2h.uhin  Makefile (retrieved)  <shaili>cc
  hindrv/   hincc hin2std std2hin hincc.awk hin2std.awk std2hin.awk (retrieved)
  keywords  samples/  exercises/
```

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
