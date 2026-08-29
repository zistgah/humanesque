# AGI stack × shaili × lab container × web × PANINI

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Two numberings stay uncollapsed:

- **Workbench L0–L26** — interoperability taxonomy (this document).
- **FAKIR L0–L9** — MRD lattice (ISIC × ISCO × ISCED). Retrieval, not this table.

GitHub Pages is a static projection and does not start Docker. Lab images (`labs/compose.yaml`) are how an engineer, linguist, or mathematician obtains gcc, ICU, and the rest **on a machine**. Hindawi’s gurucc already ends in gcc; the lab is that toolchain, containerised.

## How a shaili is captured

A shaili is **not** a spoken language and **not** a `#define`.

```
Shaili = ⟨ name, host, 13-axis region, transducer, standard, lab image ⟩
```

| Capture | Where | What |
|---|---|---|
| **Defined** | `<शैली NAME>` line 1 (`hincc.awk`) | dialect tag, host selection |
| **Described** | `docs/SHAILIS.md` | Devanagari name, host, standard, liability |
| **Heritage mapped** | `retrieved/legacy/Hindawi/*/h2*.lex` | lexers ARE the mapping (2004) |
| **Language axis** | `retrieved/romenagri/langs/*_c.tsv` | native → C (independent of shaili) |
| **Script axis** | `flatten_uni_dev` / `unicode.h` | Brahmi hub; Perso-Arabic lossy |
| **PANINI impl** | `src/panini/hindawi_port.pni` + `runtime/hindawi_port.js` | pipeline in this tree |
| **Frontend invariant** | `T_FRONTEND_PANINI` | the transducer is written in PANINI |
| **Host toolchain** | lab container | gcc / cpython / rustc / … stay theirs |

Script ≠ language ≠ shaili. Mixing them was the earlier defect.

## L0–L26

| Layer | Domain | Shailis that live here | Lab image | Web (Pages) | PANINI in this tree |
|---|---|---|---|---|---|
| L0 | Physical substrate | — | *(hardware: PRATIK/Zamin, not this repo)* | — | specified |
| L1 | Device physics | — | — | — | specified |
| L2 | Digital primitives | — | engineer | — | specified |
| L3 | Hardware architecture | यांत्रिक yantra (asm) | engineer | workbench | heritage h2y + PANINI asm frontend subset |
| L4 | Memory/storage | — | engineer | — | v2 memory algebra (subset) |
| L5 | Interconnect/I/O | — | engineer | VT100 | vfs/vt100 JS |
| L6 | Firmware/boot | — | — | — | specified |
| L7 | OS/runtime | गुरु C POSIX path | engineer | — | posix.js subset; **not** a POSIX OS |
| L8 | Execution frameworks | सूची soochee, जाल jala | engineer / beginner | workbench | interpreter + mini_langs |
| L9 | Simulation / twins | रेखा rekha → sim | agi | — | LOGO specified; twin is TransEg |
| L10 | Sensorimotor | रेखा → robot | agi | — | specified (physical AI later) |
| L11 | Data substrate | सूत्र sutra SQL | mathematician | — | specified |
| L12 | Representation / ILM | *no shaili — script/language live here* | **linguist** | hindawi.html, ilm/ | flatten, Romenagri, TSVs, perso maps |
| L13 | Programming language | **all shailis** | all labs | nb.html | PANINI grammar + literate cyclers |
| L14 | Compiler / semantic | heritage 8 transducers | engineer | hindawi.html | hindawi_port.js; T0 self-host subset |
| L15 | Tooling / workbench | — | all | **workbench.html, mez/** | mez cycler, Monaco, PWA |
| L16 | Interaction | रेखा LOGO, praatha | beginner | nb.html | BASIC/C demos run in browser |
| L17 | Model substrate | — | agi | — | specified |
| L18 | Cognition | — | agi | mez/ | cycler harness (URL handoff) |
| L19 | Coherence | — | agi | — | specified |
| L20 | Embodiment | रेखा, pench | agi | — | specified |
| L21 | Agent architecture | — | agi | mez/, cyclers | `.pni` cyclers executable as literate |
| L22 | Collective | — | enterprise | explorer | estate catalog |
| L23 | Metacognition | गणित, तर्क, गणना | mathematician / agi | prove | prove_v2, theorem subset |
| L24 | Persistence | — | enterprise | — | provenance specified (Misty) |
| L25 | Sovereignty | — | enterprise | CONTRACT | GPL-3, human signoff, TRUST ME |
| L26 | Civilizational | — | agi | fakir/ | FAKIR domains retrieved |

## Heritage eight — capture status

| Shaili | Defined | Transducer | Browser | Node pipeline | Container toolchain | CONFORMANCE |
|---|---|---|---|---|---|---|
| गुरु C | yes | h2c.lex retrieved | demo run | hindawi_port | gcc in engineer | **no** (ISO C17 harness exists; not green) |
| श्रेणी C++ | yes | h2cpp.uhin | — | shaili rules | g++ | no |
| प्राथमिक BASIC | yes | h2b.uhin | **runs** diamond | praatha rules | — | no |
| कृत्रिम Java | yes | h2j.uhin | — | shaili rules | (optional jdk) | no |
| सूची Python | yes | h2py.lex | — | frontend python.pni | python3 | no |
| शब्द lex | yes | h2l.uhin | — | shaili rules | flex | no |
| व्याकरण yacc | yes | h2yacc.uhin | — | shaili rules | bison | no |
| यांत्रिक asm | yes | h2y.uhin | — | shaili rules | — | no |

2026 shailis are **defined and described** (`SHAILIS.md`, `LANGUAGE_STANDARDS.md`).
Transducers: PANINI frontends exist for Python, C, C++, Fortran, Rust, TS, Go, Zig, Lua,
and the application-layer set (JavaScript, Java, SQL, PHP, Ruby, C#, R, Perl, BASIC, Logo)
in `src/panini/frontends/application.pni` — executed by the PANINI interpreter, not mini_langs.js.
They are **not** Hindawi-class bidirectional vernacular lexers yet.

## Virtual web infrastructure (Pages)

```
docs/                  GitHub Pages root
├── index.html         poster / paradigm
├── workbench.html     L15 IDE (Monaco)
├── nb.html            beginner + Hindawi notebook
├── hindawi.html       linguist lab (flatten, demos, run)
├── mez/               cycler harness (URL to other AIs)
├── fakir/             L26 retrieval
├── explorer.html      estate
├── stack.html         this map
└── engine/            browser PANINI + flatten bundle
```

No application server. Cycler replies are pasted/saved in the browser.
Docker labs are **opt-in** for people who have a daemon (`labs/compose.yaml`).

## Lab images

See `labs/compose.yaml`. One image per role, not one image per shaili.
The engineer image holds host compilers; the linguist image holds maps;
the beginner image holds nothing that would scare a child.
