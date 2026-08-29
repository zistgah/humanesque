# Path 1–2: C and C++ lowering (retrieved)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

Source: architect attachment. Implementation: `runtime/clower.js`, `runtime/gnuc.js`, `runtime/cpplower.js`.

Keep `run_c` and WASM 100% frozen.

C: Raw source → macro/CPP → type inserter → initializer flattener → ISO C AST.

| Gap | Transform |
|---|---|
| void* → T* | Inject `(T*)` |
| designated struct | zero + field assigns |
| array designators | index assigns |
| tentative `int x; int x;` | one symbol |

C++: CPPLOWER → C AST. Mangling, `this`, template clone, vtable, RAII at scope exit.
