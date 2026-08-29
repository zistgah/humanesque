# Recorded defects — retrieved 28 Aug 2026 (08:04)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Not a live scan. Grouped by what blocks what. This repository may **document**
estate defects; it must not silently “fix” other repos from here.

## A. Live defects on public repos (other trees)

| Repo | Defect |
|---|---|
| governance `ops/zops.sh` | `_z_create_remote_if_needed` never called; `zops_mint` absent; create errors swallowed |
| ztools `zseed.sh` | `git push --force` from fresh init; failed push can read green |
| governance | `ops/contract.json` and `docs/CONTRACT-DELTA.md` 404; C8–C30 have no canonical home; REGISTRY stale; gate G5 uses that list |
| qaem | MANIFEST; `meta.doi` null though minted; overlays from another book |
| dome | PWA: `manifest.webmanifest` / `sw.js` linked, missing |
| tok-doi | still uses pre-rename name |
| marham | empty repo; needs recovery push |
| transeg-idgov / -research | never minted |
| estate-wide | 175 unlicensed; `known_dois` missing PEDLER 17497559 |
| seed scripts | stage in `/tmp`; “nothing to commit” treated as failure |

## B. Built, never landed (not this tree’s job to land)

spiguard (no repo) · misty 1.1.3 / PyPI still 1.0.1 · zistgah/panini 45/45 unpushed · amal, dukedom, duke2, paradox · mint_zistgah.sh never run for real · open issues for shipped work (chakra, misty-doi)

## C. PANINI (this family)

1. Stage-nesting terminator defect — blocks 5 of 6 cyclers (claude tree).
2. **Second-dialect decision** (~9,300 errors): whether markdown front-matter is PANINI. **Architect’s call, not an AI’s.**
3. Bootstrap stage 1: lowering → IR → codegen.
4. Merge DELTAS with the other sibling.
5. Seeder fixes.

## D. Routing for this sibling (architect + Claude, 08:04)

**Do:** conformance harness against `panini_by_claude`; dialect deltas; documentation and lifecycle; adversarial reading of claims.

**Do not:** seal/mint chain until spiguard has a home; ontology extraction (Kaivalya, Tawheed, SPR, Kaivalyik AGI, MLCNE, VIKRAM, Individual Equity primitive) — **only the architect authors those**.

**Honesty:** directory names (`compiler/`, `runtime/`, frontends) are not a compile claim. See `CAN_COMPILE.md`.
