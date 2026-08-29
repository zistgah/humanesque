# CONTRACT — zistgah / project-ilm

© 1993–2026 Abhishek Choudhary. All rights reserved. AyeAI.

**The rules live in [`ops/contract.json`](ops/contract.json), not in this file.**

This document existed before, said broadly the right things, and was still missed:
on 25 July 2026 a push landed with no Candor receipt and left `MANIFEST.sha256`
failing on `index.html`. Prose does not enforce. So every rule now carries a check
id and is enforced by a script that exits non-zero.

## For a human or an AI arriving here

```sh
bash ops/verify.sh      # does this repo satisfy its own contract right now?
bash ops/resume.sh      # write RESUME.md — live state, feature census, chain status
cat RESUME.md
```

`RESUME.md` is generated, never hand-written. Read it instead of exploring. Its
feature census exists because a design document was once written for a subsystem
that had already shipped — the census answers "does this already exist" in one look.

## Changing anything

```sh
. ops/candor.sh
# ... edits ...
candor_push "summary line"
```

`candor_push` is gate **and** seal in one call: typed assertion → commit → receipt →
OTS stamp → manifest rotation and rebuild → `ops/verify.sh` → push. It refuses to
push if the contract fails.

Sealing is not a separate step you can forget, because there is no separate step.
That is the whole design: the previous split into `apply_*.sh` and `seal_*.sh` is
precisely what got forgotten.

## The three standing prohibitions

- **No documents where code was asked for.** A design note is not a deliverable.
- **No checklists.** The script performs every step itself. Printing "run this next"
  is donkey work.
- **No invention.** Missing metadata is reported, never filled in. No fabricated
  dates, DOIs or proofs.

## Gate words

`PUSH` · `PAGES` · `MINT` — one typed assertion per run, covering the whole run,
never one per item. Parsing is tolerant: `PUSH fix`, `PUSH, fix`, `PUSH: fix`.
The strict form cost four attempts at the gate and was corrected.

Only Abhishek pushes and mints. An AI writes the script; the script executes under
his typed assertion, on his machine.
