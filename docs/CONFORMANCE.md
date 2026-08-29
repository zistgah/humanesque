# Cross-implementation conformance harness

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Two independent implementations of one spec make the spec testable.
Siblings: `zistgah/panini_by_claude` and `zistgah/panini_by_grok`.

## Output shape (starting point)

A `conformance` report is a JSON (or literate `.pni`) object:

```
{
  "subject": "panini_by_grok",
  "peer": "panini_by_claude",
  "spec": "spec/PANINI_SELF_HOSTING_SPEC.pni",
  "when": "ISO-8601",
  "cases": [
    { "id": "T0-selfhost", "peer": "pass|fail|skip", "here": "pass|fail|skip", "diff": "" }
  ]
}
```

Every disagreement is either a spec ambiguity or a misread. Both are worth finding.

## First cases (this tree can run today)

| id | What |
|---|---|
| T0-selfhost | A=B=C on the compiler subset |
| cycler-tangle | literate cyclers in `cyclers/` |
| flatten-teluguc | TeluguC.uhin → HindiC-shaped Devanagari |
| hindawi-guru | HindiC.uhin → C channel |
| not-define | gurmukhi_demo.c is not localization |
| can-compile | CAN_COMPILE.md values match executable tests |

Dialect deltas (~9,300 errors / markdown-as-PANINI) wait on the architect’s second-dialect ruling (`RULINGS.md`).
