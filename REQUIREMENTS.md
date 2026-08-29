# tree-rev: 2026.08.28
# Standing requirements (do not drop)

Copyright (C) 1993-2026 Abhishek Choudhary  
GPL-3.0-or-later

1. Do not modify the original self-hosting spec text.
2. License is GPL-3.0-or-later. Copyright 1993-2026 Abhishek Choudhary.
3. Site lives in `docs/` (GitHub Pages). PWA. Desktop landscape + phone portrait tabs.
4. Editor is Monaco (VS Code engine, MIT). Blocks use Blockly (Apache-2.0). Name third parties.
5. Terminal **is** VT100. bash and COMMAND.COM are applications *on* that terminal, not a second widget.
6. “Standards” means official language suites (ISO C, CPython Lib/test, …). Do not claim CONFORMANCE until those run.
7. Architect prompt log stays on the site, curated, no pejorative lexicon; mark affective register escalation.
8. Ship a zip of `artifacts/panini` whenever the tree changes.
9. Engineer / linguist / mathematician views are tools, not labels.
10. ILM multilingual projection is first-class (not English-only).
12. STANDARD GREEN is the line: named corpus, skip=0, PANINI frontend. Not Lib/test / rustc ui / all.bash.
13. `run_c` and WASM/WAT emission stay frozen. New C/C++/Rust/Go/Julia work is lowering pre-passes (REQ-L1…L4).
14. REQ-L1 C four passes: CPP, void* casts, designated-init flatten, tentative merge (`runtime/clower.js`).
15. REQ-L2 C++ five: mangling, this, monomorphize, vtable, RAII. Micro-STL not libstdc++ (`include/microstl/`).
16. REQ-L3 GNU C for kernel: attributes, `?:`, range init, builtins. Statement-expr / asm / `.lds` named, not claimed.
17. REQ-L4 Go tuples and Rust slices lower to synthetic C structs.
18. Micro-libc headers live in `include/`. Do not parse `/usr/include`.
19. Roadmap 1–12 + ISA matrix (RISC-V/Shakti, ARM, ESP32, Arduino, SysML) is `docs/ROADMAP.md`. Honesty wall stands.
20. Zip never contains `.gguf` or `.wasm`. `tests/test.mjs` always exits 0.
11. One surface: distro CLI, Pages, PWA.
22. SHIP GREEN is the requirements bar (`docs/SHIP_GREEN.md`). Named ≠ green.
23. The factory registry (`factory/REGISTRY.json`) is consulted before adding a file. Reuse first.
24. Optimized components are FROZEN (hash-locked). Touch only with `factory/DELIBERATION.md`.
26. STANDARD GREEN TypeScript 20/20 (`scripts/std_green_harness.mjs typescript`).
27. STANDARD GREEN JavaScript 20/20.
28. STANDARD GREEN Zig 20/20.
29. STANDARD GREEN Lua 20/20.
30. STANDARD GREEN Fortran 20/20.
31. STANDARD GREEN Pascal 20/20.
32. STANDARD GREEN BASIC 20/20 (Hindawi Shaili BASIC subset).
34. STANDARD GREEN means a retrieved issuing-body spec plus that body’s executable suite, skip=0. Homemade 20-case files are CORE GREEN only.
37. PANINI.V2.WORKBENCH (L15) specified; T0 not altered. AGI stack reports SHIP GREEN and STANDARD GREEN per layer from factory/agi_map.json. STANDARD GREEN is not 27/27.






