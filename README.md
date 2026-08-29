# Humanesque

**PANINI · ILM / Hindawi · GENIE · Mez · Kitab · the cycler family**

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

The full `zistgah/panini_by_grok` tree at latest HEAD, merged with the
`zistgah/panini_by_claude` engine, plus the ILM matrix built in this merge.
Grok's own README is kept at `README.grok.md`. `ARCHITECTURE.md` is the index.

```
bash VERIFY.sh                     # 20 checks, no arguments
bash seed_humanesque.sh --push     # gate: SEED humanesque
```

## What this merge added

**The ILM matrix — 27 languages × 9 shailis.** All nine keyword maps extracted
from the retrieved 2003–2023 transducers: **1,913 rules, none authored.**

| shaili | host | rules | | shaili | host | rules |
|---|---|---|---|---|---|---|
| गुरु guru | C | 323 | | सूची soochee | Python | 38 |
| श्रेणी shraeni | C++ | 879 | | व्याकरण wyaaka | yacc | 20 |
| यंत्र yantra | asm | 354 | | रोबोट robot | LOGO | 8 |
| कृत्रिम kritrima | Java | 186 | | शब्द shabda | lex | 6 |
| प्राथमिक praatha | BASIC | 99 | | | | |

**81 of 243 cells filled from retrieved data.** The other 162 are skeletons with
the native column empty and marked `UNRESOLVED — a speaker must author them`.
Nothing invents a native keyword.

Filled: assamese · bengali · gujarati · hindi · kannada · malayalam · marathi ·
nepali · odia · punjabi · sanskrit · tamil · telugu · urdu · arabic · persian.
Skeleton: bodo · dogri · kashmiri · konkani · maithili · manipuri · santali ·
sindhi · shahmukhi · dari · pashto.

```
node tools/extract_maps.mjs        # nine shailis from the transducers
node tools/build_ilm_matrix.mjs    # 27 x 9 keyword tables
```

**Mez reads the language.** `apps/mez/build-workflows.mjs` derives the desk's
workflows from the `.pni` cyclers instead of a hand-made 80 KB snapshot. Every
entry carries `derived:true` and its source path; VERIFY asserts both.

**Four honesty defects fixed**, re-applied to this pull: `package.json` said MIT
against a GPL LICENSE · `tests/test.mjs` carried `never_nonzero` so 81/83 exited
0 forever (it now exits 1, and there are two real failures) · `selfhost.mjs:70`
passed a hardcoded `true` for the A-vs-B comparison · the desk's snapshot.

## On self-hosting — the objection is right

Compiling to JavaScript does not disqualify self-hosting. gcc emits x86 and is
self-hosted. The target is not the question.

The question is whether the PANINI-source compiler, compiled by itself,
reproduces itself. That is not passed here, and the reason is not the target:
`src/panini/compiler.pni` is 25 lines that call `lex()`, `build.pni` is seven
functions each returning `TRUE`, `typechecker.pni` cannot reject anything, and
`CAN_LOWER` is satisfied by `compiler/ir.js` — JavaScript. `docs/GROK_UPDATE.md`
§4 has the line numbers.

Both implementations are kept and both are left disagreeing. That disagreement is
the most useful thing in this repository.

## Not asserted

**Mez does not yet work as intended.** Six output cyclers still recover only their
first `STAGE`. A fix took matba 1→28, awaz→12, khwab→7, tilasm→14, yadein→13 and
broke a FILE-block assertion; it was reverted rather than shipped half-tested.
`docs/GROK_UPDATE.md` §1 carries the numbers and the trap.

**GENIE is not done.** The prompt operating system is specified, `genie.js` lives
in its own repository, and nothing here implements the eleven nodes.

**LOGO, lex and yacc are thin** — 8, 6 and 20 rules. The transducers are
retrieved and real; the extractors read only what matched. More rules are in
those files than my readers currently pull out.

## Read next

`ARCHITECTURE.md` — the three axes, nine shailis, four strata, both AGI stacks,
release tiers, and what is architectural rather than implemented.
`docs/GROK_UPDATE.md` · `docs/KNOWLEDGE_TRANSFER_FOR_GROK.md` ·
`docs/GUIDANCE_TO_GROK_MEZ.md` · `spec/DELTAS.md`.
