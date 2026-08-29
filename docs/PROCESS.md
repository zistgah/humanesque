# Project process

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

## One owner per concern

See `MODULES.md`. If two files implement the same concern, one is canonical and the other is a *named adapter* (Pages, spin-off) or it is deleted.

## Minimum module

A module is allowed to exist if it has **one contract** (what it owns), **fits in one sitting**, and is not a copy of a neighbour. A 20-line re-export is a smell unless it is a documented adapter.

## Change sequence

1. Edit the canonical file.
2. Port the adapter if Pages cannot import ESM (`docs/console.js` ← `runtime/shell.js`).
3. Add or extend a test next to the canonical file.
4. Record REQ / TRACEABILITY if behaviour is architect-facing.
5. Run the gate: `node tests/run.mjs` and `node tests/elseif.mjs`. **Do not zip if either fails.**
6. Zip. Do not push.

Parser invariant: the lexer is newline-insensitive. `ELSE` followed by `IF` is a **nested** IF (each has its own `END`). Flat chains use the `ELSEIF` / `ELSIF` keyword. Never treat `ELSE IF` as `ELSEIF`.


## Ontology

`ontology/core.json` is identity. Labels are views. Overlays from other AIs merge by `id` in the ontology browser. Do not fork a second graph in markdown.

## Every turn (architect, 2026-08-29)

This is a standing order, not a reminder in chat.

0. **Factory scan.** `node scripts/factory_scan.mjs`. Browse `factory/REGISTRY.json`. Do not touch `freeze:true` without a deliberation. Reuse before write.

2. **Fix the named bug.** Do not restyle a page that was already accepted (notebook frozen chrome stays).
3. **Grow `examples/`.** At least one new runnable or retrieved specimen this cycle, linked from the page that needed it.
4. **Publish.** Architect prompts (`docs/ARCHITECT_PROMPTS.md`), CONTEXT, this file if the process changed. FAQ if a flattening error recurred (`#define`, copilot last-mile, HTML 404 as source).
5. **Test the claim.** If you say `#include` survives, a test must fail when it does not.
6. **Zip.** Do not push. The architect’s automation consumes the zip.

Identifiers in examples should be ontology labels of the operator language, not only English. English remains a view. Lexer already accepts Unicode letters.

