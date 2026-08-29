# Requirements (numbered, traceable)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  
Status: working set for `panini_by_grok`. Not a live 105-org walk.

Each REQ has an ID. Implementation evidence lives in TRACEABILITY.md.

## 0. Invariants

| ID | Requirement | Source |
|---|---|---|
| REQ-000 | Do not modify the original self-hosting spec text. | Architect, first turns |
| REQ-001 | License GPL-3.0-or-later. Copyright 1993–2026 Abhishek Choudhary on files. | Architect |
| REQ-002 | Site in `docs/` (GitHub Pages). No `/website`. PWA. Desktop landscape + phone portrait. | Architect |
| REQ-003 | Do not assume special backend. | Architect |
| REQ-004 | Frontends of supported languages are implemented in PANINI (`T_FRONTEND_PANINI`). Host may be virtualized JS; that does not discharge the PANINI frontend. | Architect; theorem |
| REQ-005 | Retrieve, do not reconstruct (Hindawi pipeline, Romenagri, Chakra ephemeris, FAKIR domains). | Architect; FAKIR |
| REQ-006 | `#define je if` is not localization. Kernel mappings / lexer. | Architect + Claude KT |
| REQ-007 | AyeAI is live (AyeAI · AyeCNSe · AyeAM). Not historical. | Architect; icansee.life |
| REQ-008 | Independence: not IBM, not HP. | Architect |
| REQ-009 | Zip of `artifacts/panini` every turn for local automation. | Architect |
| REQ-010 | Do not invent Eighth Schedule keyword TSVs that were not retrieved. | Architect |

## 1. Linguistic equity

| ID | Requirement | Source |
|---|---|---|
| REQ-100 | Representational equity ↔ ILM. Computational equity ↔ PANINI. Conjunction = linguistic equity. | PANINI v2 |
| REQ-101 | Three axes: script, language, standard. Do not collapse. | Architect |
| REQ-102 | Brahmi: Devanagari flatten hub; table-complete round-trip. | Hindawi 2004 |
| REQ-103 | Perso-Arabic: urdu_map / fltr_ur_hi; lossy; linguistics work. | Architect |
| REQ-104 | Hebrew: direct mapping. | Architect |
| REQ-105 | Identifier dictionary is a *view*; compile uses originals. | Architect |
| REQ-106 | Done = diagnostic, gdb, `nm` in the operator language. HindiC.uhin 2004 is the bar. | Architect |
| REQ-107 | Target 100%; name gaps; do not claim 100%. | Architect 28 Aug |

## 2. Foundational languages (this iteration starts ISO C, lex, yacc)

| ID | Requirement | Source |
|---|---|---|
| REQ-200 | C frontend in PANINI, toward ISO C (C17). Piece by piece. This tree: iteration 1 (if/while/for, comparisons, printf, comments). Not C17 complete. | Architect 28 Aug |
| REQ-210 | lex (lexer generator) formal. Virtualized backend this iteration. | Architect; Hindawi Shaili Shabda |
| REQ-211 | yacc (parser generator) formal. Virtualized backend this iteration. | Architect; Hindawi Shaili Vyaakaran |
| REQ-220 | Console is VT100; bash and COMMAND.COM are applications on it. Online console must show. 486-class (4 MiB / ~500 MB) is the browser budget metaphor. | Architect |
| REQ-230 | Later: PEDLER instrumentation. Not this iteration's complete delivery. | Architect |

## 3. Hindawi / ILM / Chakra

| ID | Requirement | Source |
|---|---|---|
| REQ-300 | Original Hindawi pipeline: Unicode → ACII → Romenagri → shaili lex → host. | HindiC.uhin 2004 |
| REQ-310 | Notebook UI frozen (nb.frozen.html); Romenagri visible. | Architect |
| REQ-320 | CHAKRA retrieved (`project-ilm/chakra`). Festivals computed. PANINI may VIEW names. | Architect 28 Aug |
| REQ-321 | Build trivia: horoscope of the *build* via Chakra. Cultural computation, not prediction. Respect sentiments. | Architect 28 Aug |

## 4. Estate / cyclers / workbench

| ID | Requirement | Source |
|---|---|---|
| REQ-400 | Cyclers are URL-handoff AI harness, not prompt chains. | Architect |
| REQ-410 | mez is the desk. | zistgah/mez |
| REQ-420 | Estate explorer is the Humanesque→AyeAI→Zistgah instrument. DOI 10.5281/zenodo.22122422. | Architect |
| REQ-430 | Spin-off paths `apps/<org>/<repo>` for zip automation. | Architect |

## 5. Documentation

| ID | Requirement | Source |
|---|---|---|
| REQ-500 | Numbered requirements + traceability. | Architect 28 Aug |
| REQ-510 | Architecture and design documents. | Architect 28 Aug |
| REQ-520 | Press / Wikipedia / online references section. | Architect 28 Aug |
| REQ-540 | Correlate estate repos to numbered REQs and trace each to a dated legacy root. CDAC/NRC-FOSS 2008 award is a retrieved mention. PAT.AL, PRATIK, VIDYA, HMSEI, Research Kundali stay uncollapsed. | Architect 28 Aug evening |


See also: CONTRACT.md, CONTEXT.md, ARCHITECTURE.md, DESIGN.md, TRACEABILITY.md, REFERENCES.md.
