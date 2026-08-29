# PANINI.V2.WORKBENCH — L15 specification

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Captured from the architect’s analysis (28 Aug 2026). **Does not alter T0.**  
MRD referred: `zistgah/mrd` (`MRD-complete.md`, `MRD-basic-all.md`, 26 components,
generated 2026-08-23). Copy: `docs/MRD.md`, `docs/mrd-components.json`.

PANINI is not a named MRD *component*; it is L13–L14 (language / compiler) of
the stack whose L15 (tooling/workbench) the MRD already names as **mez**, and
whose L12 is **ilm**, retrieval **fakir**, meta-cycle **genie**, output
**cyclers**, heritage **hindawi**, provenance **misty**.

## 0. Design objective

Two complementary environments:

1. **PANINI Desktop / VS Code** — professional engineering, LSP, debug, CI/CD.
2. **PANINI Web Workbench** — zero-install, not a toy. Path:

first BASIC-like program → formal proof → repository → tests → provenance → CI → deployment → production artifact

without leaving the ecosystem.

## 1–2. VS Code + browser workbench

Official extension + Language Server over:

`AST + IR + Types + Effects + Memory + Provenance + Proof status`

Web chrome:

`Project | Run | Test | Prove | Build | Deploy | Provenance`

Explorer · Editor · Inspector (AST, IR, Types, Effects, Memory, Proofs).

CI/CD is a project primitive.

**Status here:** Monaco is the editor engine (MIT). Full LSP/debug/CI is specified,
not claimed green (`CAN_COMPILE.md`).

## 3. Three user classes

| Class | Path |
|---|---|
| Technologist | code → AST → IR → machine → runtime → deploy |
| Linguist | script → token → morphology → grammar → semantic → AST → IR |
| Mathematician | notation ↔ AST ↔ IR (not an external blob) |

## 4. Beginner must survive

Progressive disclosure. Same language.

| Level | Surface |
|---|---|
| 0 | `PRINT "HELLO"` / Shaili / LOGO `forward 100` |
| 1 | functions |
| 2 | `@functional` |
| 3 | types, immutability |
| 4 | AST / IR / effects / proofs / memory |

## 5. Provenance native

Misty DOI + OTS. Artifact = content, identity, time, author, source,
transformation, execution, verification, provenance.

Epistemic statuses: VERIFIED, FORMALIZED, EMPIRICAL, SIMULATED, EXPERIMENTAL,
RETRIEVED, PROPOSED, HYPOTHESIZED. Human signoff at gates.

## 6–7. Language museum / historical laboratory

Re-express computational models of major and historical languages **inside**
PANINI (13-axis configuration), not a sticker list. Frontends-in-PANINI is the
invariant (`T_FRONTEND_PANINI`).

## 8. ILM representation switcher

Same artifact: English / हिन्दी / العربية / संस्कृतम् / Math / Graph / AST / IR.

`Representation ⊥ Computation`

## 9. Sanskrit laboratory

Sanskrit mathematical text → linguistic structure → mathematical structure →
AST → IR. **Not** Sanskrit → English → code. Keyword-by-keyword is the current
port; Paninian parser is later.

## 10. Shaili / LOGO / physical AI

`LOGO → SIMULATION → DIGITAL TWIN → ROBOT → PHYSICAL AI`

## 11–12. AGI workbench (L0–L26)

Interoperability taxonomy, not a claim every AGI implements every layer.
Native services: FAKIR, GENIE, cyclers, MIME, provenance, epistemic status,
human signoff.

FAKIR MRD: ISIC/ISCO/ISCED × AGI layers (their L0–L9 lattice).  
This L0–L26 list is the **workbench** interoperability taxonomy (retrieved
analysis). Do not collapse the two numberings.

## 13. Enterprise project

```
project/{src,tests,proofs,simulations,experiments,data,models,agents,
hardware,linguistic,mathematics,ilm,provenance,deployment,workflows}/PANINI.toml
```

## 14. One artifact, many views

Beginner · Engineer · Linguist · Mathematician · Compiler · Formal · AGI ·
System · Enterprise.

## 15. Principle

One semantic artifact → many projections. Not different tools → copies → drift.

L15 **is** the retrieved AGI tooling layer. This site is its concrete realization.
Compiler/semantic machinery: L13–L14. ILM: L12.
