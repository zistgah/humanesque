# Publish the AGI stack in any human language

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

The stack is one artefact (`docs/stack.json`). A human language is a **view**.

```
stack.json  (canonical IDs: L0…L26, labs, shailis)
    │
    ├─ i18n/stack.en.json   English strings
    ├─ i18n/stack.hi.json   हिन्दी
    └─ deposits/i18n/stack.<bcp47>.csv   submitted views
         │
         ▼
    stack.html?lang=hi     published view (GitHub Pages, no backend)
```

## What a translation file contains

Only strings. **Do not** translate layer IDs, shaili technical names (`guru`, `h2c.lex`), or DOIs.

CSV columns:

```
id,field,text
L12,domain,Representation / ILM
L12,web,hindawi.html
```

Template: `docs/i18n/stack.template.csv`

## How to publish

1. Copy the template.
2. Fill `text` in your language. Keep `id` and `field`.
3. Put the file in `deposits/i18n/` (human or AI collaborator).
4. After merge, `stack.html?lang=<bcp47>` loads `i18n/stack.<bcp47>.json` if present, else the CSV.

This is ILM applied to documentation: representation varies; the stack identity does not.
We do not send your words through a privileged MT engine unless you choose to.
