# Humanesque — merged release

**PANINI · ILM / Hindawi · GENIE · Mez · Kitab · the cycler family · the factory**

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

The **full `zistgah/panini_by_grok` tree** — compiler, 21 frontends, 6 backends,
Hindawi/ILM localization, 41 documentation pages, factory, labs, VS Code
extension, LSP, debugger, x86 emulator, WebGPU, website — with the
`zistgah/panini_by_claude` engine overlaid and four honesty defects fixed.

Grok's own README is kept at `README.grok.md`.

---

## Verify before you believe anything below

```
bash VERIFY.sh
```

Sixteen checks, no arguments. Current result: **ALL CHECKS PASSED**.

```
 engine (claude)
  spec parses with 0 errors                       [ok]
  145 assertions, mutation-proven                 [ok]
  no network call in the engine                   [ok]
  ...and that scan is proven to bite              [ok]
 compiler + backends (grok)
  bootstrap runs                                  [ok]
  C backend emits code gcc compiles               [ok]
  Python backend emits runnable code              [ok]
  C frontend: structs, pointers, recursion        [ok]
 ILM / Hindawi (grok)
  compiles a 2004 Devanagari source               [ok]
  native identifiers reach DWARF                  [ok]
 Mez
  workflows derived from .pni                     [ok]
  workflows.json is derived, not authored         [ok]
 integrity (fixed in this merge)
  package.json licence matches LICENSE            [ok]
  test suite CAN fail (exit code honoured)        [ok]
  A-vs-B selfhost comparison is a real gate       [ok]
```

## Seed it

```
bash seed_humanesque.sh            # verify and stage, nothing pushed
bash seed_humanesque.sh --push     # gate: SEED humanesque
```

Finds the release beside itself, in `$PWD`, or extracts
`humanesque-release.tar.gz` from either. Stages in `$PWD`, never `/tmp`.
Creates the remote if absent, inside the same typed gate. Verifies the staged
tree where it lands before it will push.

---

## What this merge changed

**1. Mez's desk now reads the language.** `apps/mez/docs/desk.html` fetched an
80 KB hand-made `workflows.json` while 32 `.pni` cyclers and a parser sat in the
same tree. `mez.pni` states the invariant it was breaking — *"cyclers are PANINI
programs, not plugins"*. `apps/mez/build-workflows.mjs` derives it now; every
entry carries `derived:true` and its `source` path, and VERIFY asserts both.

**2. The test suite can fail.** `tests/test.mjs` carried
`exit_policy:"never_nonzero"` and `process.exit(0)` in a `finally`, so 81/83 with
two failures exited 0 forever. It now exits 1. *It currently exits 1 — there are
two real failures (`frontends zig`, `roundtrip flatten_bengali`) that were always
there and were always green.*

**3. The A-vs-B self-host comparison is a real gate.** `scripts/selfhost.mjs:70`
passed a hardcoded `true`. Forcing `sameAB=false` still printed `[ok]` and still
concluded VERIFIED. It now passes `sameAB`.

**4. Licence conflict resolved.** `package.json` said MIT; `LICENSE` and every
source header say GPL-3.0-or-later. npm and every SBOM scanner read package.json.

---

## What holds, and what does not

**Real, and I have not matched any of it:** the C frontend handles structs,
pointers and recursion correctly; the C and Python backends emit code that
compiles under real `gcc` and runs under real CPython; the Hindawi pipeline
compiles a 2004 Devanagari source to a working binary with `DW_AT_name : अ` and
`DW_AT_name : क` in the debug info.

**Not carried:** the self-hosting VERIFIED claim.
`node engine/bin/panini.mjs conformance` reports `CAN_COMPILE: no`,
`CAN_LOWER: no`, `CAN_BUILD: no`, and `ASSERT PANINI.CompilerSource
CAN_COMPILE PANINI.CompilerSource` **FAILS** — for the right reason, both
operands resolving to real modules. `docs/GROK_UPDATE.md` §4 shows how the
theorem is currently satisfied: JavaScript doing the lowering, a `.pni` whose
every build stage is `RETURN TRUE`, a typechecker that cannot reject, and a
verifier that reads a file the pipeline itself wrote.

Two `.pni` implementations coexist here on purpose — `compiler/` + `src/panini/`
from grok, `engine/` from claude. They disagree about what is proven. That
disagreement is the most useful thing in the repository and it is not resolved by
deleting one.

---

## Open, and stated

- **Stage nesting.** Six output cyclers recover only their first `STAGE`. A fix
  took matba 1→28, awaz→12, khwab→7, tilasm→14, yadein→13 — and broke a FILE-block
  assertion. Reverted rather than shipped half-tested. `docs/GROK_UPDATE.md` §1
  carries the numbers and the exact trap.
- **The second dialect.** ~9,300 parse errors are prose architecture documents
  with `KEY: value` front matter. Whether that is PANINI is the author's ruling.
- **23 of the 32 bundled cyclers** do not parse with grok's parser, including
  `khwab`. `docs/KNOWLEDGE_TRANSFER_FOR_GROK.md` lists the fourteen constructs.
- **`MANIFEST.sha256` lists itself** plus three files written after it —
  `sha256sum -c` gives 6 FAILED. Not fixed here: resealing is a gated act.
- `bin/mez.py`, Kitab's plumbing, `genie.js`, the dome — sovereign in their own
  repositories. Reached, not absorbed.

## Read next

`docs/GROK_UPDATE.md` — nine sections, each with the command that produces the
defect and the check that proves it fixed.
`docs/KNOWLEDGE_TRANSFER_FOR_GROK.md` · `docs/GUIDANCE_TO_GROK_MEZ.md` ·
`spec/DELTAS.md`.
