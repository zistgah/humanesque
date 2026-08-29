# tree-rev: 2026.08.28
# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# Implementation notes — JS Stage-0

## What is implemented

- Lexer with comments, strings, numbers, keywords, operators, ranges
- Recursive-descent parser for executable PANINI plus declarative blocks
- Type collection pass (not a full dependent/refinement checker)
- IR lowering, const-fold, JSON/JS codegen
- Tree-walk interpreter with lexical scope, recursion, closures
- Artifact / file store with provenance stamps
- Cycler, GENIE, FAKIR, CHARBAGH as runtime libraries
- Capability names exist; default policy is least-privilege *declared*, not enforced on every host call yet

## What is UNRESOLVED (marked, not invented)

- Native / WASM / container backends that preserve identical semantics
- Full package manager and lockfile evaluation
- Real retrieval backends for FAKIR (ISIC/ISCO/ISCED must be retrieved, not reconstructed)
- Human sign-off gates as an interactive protocol
- Complete self-hosting of parser + typechecker + optimizer in PANINI
- Provider-specific model adapters

## Execution model

`run` parses source to AST, typechecks, then interprets. `FUNCTION main` or `PROGRAM main` is the entry point.

Declarative blocks (`CONSTITUTION`, `CYCLER`, `ARTIFACT`, `THEOREM`, …) parse and register; they do not all have operational semantics in Stage-0.

## Self-hosting evidence

`scripts/selfhost.mjs` runs the PANINI lexer on a sample and compares bootstrap IR generations. Evidence is written to `build/selfhost-evidence.json`.
