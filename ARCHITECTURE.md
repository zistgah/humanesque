# Humanesque / PANINI — architecture and where everything lives

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

This maps the finalization plan onto the paths that actually exist in this tree.
Nothing was physically moved: 4,000+ files carry relative paths, a manifest and a
live site, and reorganising them without re-testing would break more than it
tidies. This is the index; `LAYOUT.md` remains grok's own file-level map.

---

## The three axes — kept distinct, as ILM requires

A cell in the ILM matrix is (script × language × standard). Conflating any two is
the error that produced `#define je if`.

| Axis | What it is | Where |
|---|---|---|
| **SCRIPT** | writing-system projection | `retrieved/romenagri/tables/*_to_deva.tsv` — **74 tables**, retrieved |
| **LANGUAGE** | the programmer's vocabulary | `retrieved/romenagri/langs/*_c.tsv` — **22 tables**, retrieved |
| **STANDARD** | computational meaning, language-independent | `ilm/maps/*.map.json` — **9 shailis, 1,913 rules**, extracted from the 2003–2023 transducers |

Counters stay separate and are not summed: languages are not scripts, and neither
is the same thing as computational standards.

## The nine shailis (शैली) — all extracted, none authored

| Shaili | Host | Rules | Retrieved from |
|---|---|---|---|
| गुरु guru | C | 323 | `guru/h2c.lex` |
| श्रेणी shraeni | C++ | 879 | `shraeni/h2cpp.uhin` |
| यंत्र yantra | asm | 354 | `yantra/h2y.uhin` |
| कृत्रिम kritrima | Java | 186 | `kritrima/h2j.uhin` |
| प्राथमिक praatha | BASIC | 99 | `praatha/h2b.uhin` |
| सूची soochee | Python | 38 | `soochee/h2py.uhin` |
| व्याकरण wyaaka | yacc | 20 | `wyaaka/h2yacc.uhin` |
| रोबोट robot | LOGO | 8 | `robot/ROBOT.C` |
| शब्द shabda | lex | 6 | `shabda/h2l.uhin` |

`node tools/extract_maps.mjs` regenerates all nine. Every rule is read out of a
file on disk; `invented: false` is asserted in each map and checked by VERIFY.

## The ILM matrix — 27 languages × 9 shailis

`node tools/build_ilm_matrix.mjs` → `ilm/langs/<language>/<shaili>.tsv`

**81 of 243 cells are filled from retrieved data.** The other 162 are
**skeletons**: the romenagri and target columns are filled, the native column is
empty, and the header says `UNRESOLVED: a speaker must author them`. A wrong
Tamil keyword is worse than an absent one.

Filled: assamese, bengali, gujarati, hindi, kannada, malayalam, marathi, nepali,
odia, punjabi, sanskrit, tamil, telugu, urdu, arabic, persian.
Skeleton only: bodo, dogri, kashmiri, konkani, maithili, manipuri, santali,
sindhi, punjabi_shahmukhi, dari, pashto.

The join is **native → C → Devanagari → shaili**: the C transducer keys on
romenagri, every other transducer keys on native Devanagari, and `hindi_c.tsv`
bridges them. The C keyword is the concept — `if` is the same construct whether
written `agara`, `enila` or `اگر`.

---

## The four strata (plan §52) → real paths

| Stratum | Question | Lives in |
|---|---|---|
| **I — WHY** | normative intent, governance, equity | `CONTRACT.md` `CONTEXT.md` `AGENTS.md` `INDEPENDENCE.md` `NOTICE` `spec/DELTAS.md` |
| **II — HOW WE KNOW** | evidence, retrieval, provenance | `retrieved/` `MANIFEST.sha256` `build/*-evidence.json` `ontology/` `docs/CONFORMANCE.md` |
| **III — HOW WE BUILD** | compilers, cyclers, backends | `engine/` `compiler/` `runtime/` `src/panini/` `stdlib/` `tools/` `ilm/` `cyclers/` |
| **IV — WHAT EXISTS** | running systems and artifacts | `apps/` `dist/` `docs/` `website/` `labs/` `factory/` `examples/` `environments/` |

## The two stacks — both kept, neither replacing the other

- **L0–L9**, the compact engineering/AGI progression: RTL → verification →
  synthesis → firmware → systems C/C++ → parallel → distributed → AI → robotics →
  AGI. `docs/AGI_STACK.md`.
- **L0–L23**, the expanded interoperability taxonomy: physical substrate through
  metacognition. `spec/`. It is a taxonomy for interoperation, **not** a claim
  that every AGI contains exactly these layers.

## The Humanesque stack — orthogonal, non-collapsing

```
HUMANESQUE
  FAKIR    domain / activity coordinates      apps/zistgah/fakir
  ILM      language / representation          ilm/  retrieved/romenagri/
  PEDLER   transition / agency dynamics       docs/  (primitives owed)
  CEM      substrate realization              compiler/ backends
  CYCLER   execution / orchestration          cyclers/  apps/mez/
  KITAB    persistent artifact                apps/  (sovereign repo)
  ZISTGAH  ecosystem                          apps/zistgah/
```

FAKIR retrieves what exists. CHARBAGH routes. GENIE conceives what can be made
from what was retrieved. These stay distinct from generic model generation.

---

## Release tiers — what this tree actually is

- **Tier 0 — foundation.** Present and verified: canonical IR, HPS/ILM lineage,
  Romenagri, language registry, provenance infrastructure.
- **Tier 1 — core.** Partly present: canonical AST/IR, frontend and backend
  architecture, language server, VS Code, browser execution. **The 13-axis scoped
  paradigm model and the memory/effect boundary model are architectural, not
  implemented.**
- **Tier 2 — language federation.** 21 frontends, 6 backends. Nine of the
  frontends are JavaScript with a PANINI wrapper — see `docs/GROK_UPDATE.md` §5.
- **Tier 3 — ILM expansion.** 27 languages × 9 shailis, 81 cells filled.
- **Tiers 4–7 — AI-native, enterprise, physical, AGI substrate.** Architectural.
  Do not read the directory names as implementations.

## Epistemic status, applied to this document

Everything in the shaili and matrix tables above was produced by execution and is
reproducible with the two commands named. The strata mapping and tier assessment
are **INFERRED** — my reading of the plan against the tree, not a ruling. The
self-hosting question is unresolved between the two implementations in this
repository and is deliberately left that way; see below.

## The unresolved disagreement, kept on purpose

Two implementations sit here and disagree.

`compiler/` + `src/panini/` (grok) reports self-hosting **VERIFIED**.
`engine/` (claude) reports `CAN_COMPILE: no` with evidence, and
`ASSERT PANINI.CompilerSource CAN_COMPILE PANINI.CompilerSource` **FAILS**.

Neither is deleted. `docs/GROK_UPDATE.md` §4 sets out exactly how the theorem is
currently satisfied — JavaScript doing the lowering, a build whose every stage is
`RETURN TRUE`, a typechecker that cannot reject, a verifier reading a file the
pipeline wrote — and what would make it real.

**On the JS-target objection, which is correct:** compiling to JavaScript does
not disqualify self-hosting. gcc emits x86 and is self-hosted; the target is not
the question. The question is whether the PANINI-source compiler, compiled by
itself, reproduces itself. That test is not yet passed here, and the reason is
not the target — it is that the PANINI-source compiler is a lexer wrapper.
