# SHIP GREEN (requirements)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

STANDARD GREEN is the language-frontend bar (named corpus, skip=0).  
**SHIP GREEN is the requirements bar.**

```
SHIP_GREEN(R)  ⇔  artifact exists
                ∧  a test or harness names R
                ∧  skip=0 or the honesty gap is named in the same report
```

A requirement that is only a sentence in `REQUIREMENTS.md` is **NAMED**, not green.

| Status | Meaning |
|---|---|
| SHIP GREEN | Evidence path + test. Do not restyle it. |
| NAMED | Written, not evidenced. Factory may start it. |
| GAP | Honesty wall. Named so it is not faked. |
| FROZEN | Optimized. Hash-locked. Touch only with a deliberation. |

Harness: `node scripts/factory_scan.mjs`  
Report: `docs/data/ship-green.json` (derived; dashboard reads it).  
Never fail the uploader (`exit 0`).

The factory does **not** rewrite frozen components. Browse the registry first.
