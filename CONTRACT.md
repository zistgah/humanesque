# CONTRACT.md

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  
Tree-rev: 2026.08.29

This file is the working contract for **every** change to this tree — human, AI, or collaborator. Read it before CONTEXT.md.

## License and independence

1. GPL-3.0-or-later. Copyright line: Copyright (C) 1993-2026 Abhishek Choudhary
2. Third-party works keep their licenses (`THIRD_PARTY.md`).
3. `spec/PANINI_SELF_HOSTING_SPEC.pni` is not rewritten.
4. Independent of all employers and clients (`INDEPENDENCE.md`). Never brand as IBM, HP, or any company product.

## Honesty

5. STANDARD GREEN ⇔ retrieved issuing-body spec **and** that body’s executable suite, skip=0. Homemade 20-case files are CORE GREEN only.
6. Subsets are labeled subsets. Named GAPs stay named.
7. Architect prompts on the site are curated. Affective register escalation may be noted; pejorative lexicon is not published.

## Site (do not lose the menu)

8. `docs/index.html` is the entry. It does not dump the visitor into the IDE.
9. The spine is `docs/spine.json` + `docs/spine.js`. **Valid JSON.** Trailing commas are a contract breach — they delete the menu.
10. GitHub Pages publishes `docs/` only. Not `/website`.
11. Do not flatten axes into identical cards. Do not reinvent the homepage each turn.
12. Terminal is one VT100. bash and COMMAND.COM are shells on the VFS.
13. Editor is Monaco. Blocks are Blockly. Third-party names and licenses stay in `THIRD_PARTY.md`.

## Factory

14. Browse `factory/REGISTRY.json` before writing a file.
15. `freeze:true` is not edited without `factory/DELIBERATION.md`.
16. Adapters are named copies. Silent duplicates are not.
17. Retrieve; do not invent Romenagri maps or a second VFS.

## Frontends

18. Every language frontend is implemented in PANINI (`T_FRONTEND_PANINI`). Host gcc/CPython do not replace that.
19. Lowering (clower, stdlower, cpplower) is the C-AST path. Do not touch the frozen WASM emitter.

## Zip / uploader (do not touch the architect’s script)

20. `panini.zip` is consumed by a local script that: unzip → copy `panini/*` → `node tests/run.mjs` → `node scripts/selfhost.mjs` → `node scripts/prove_theorem.mjs` → git add/commit/push → misty ots stamp. **That script is immutable.**
21. Therefore: tests must not fail the uploader; large binaries (GGUF, WASM, spec HTML/PDF, BIOS ROM) are **fetched or built inside `tests/run.mjs`**, not shipped in the zip.

## AyeBIOS / firmware

22. AyeBIOS is SeaBIOS × Hindawi Shaili Guru (`retrieved/ayebios/`). Flatten through `hincc`. No second C frontend.
23. The BIOS ROM lives on the VFS at `/bios/bios.bin`. The ROM is fetched at test/runtime, not zipped.
