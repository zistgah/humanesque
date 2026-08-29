# PANINI → WebAssembly

Canonical emitter: [`src/panini/backends/wasm.pni`](../src/panini/backends/wasm.pni) (PANINI).
In-tree assembler: [`runtime/wat2wasm.js`](../runtime/wat2wasm.js) — no wabt, no Python, GitHub Pages capable.

```
Source (C / Hindi C after flatten) → PANINI.Frontend.C AST
                                  → PANINI.Backend.Wasm  (postfix / RPN)
                                  → WAT text
                                  → wat2wasm
                                  → .wasm
                                  → WebAssembly.instantiate
```

## Three hurdles (and what we did)

1. **Stack machine vs memory model.** Expressions lower post-order: `x + 10 * 2` becomes `local/load x; i32.const 10; i32.const 2; i32.mul; i32.add`.
2. **Strict i32 typing.** The backend emits i32 ops only. Implicit C promotions become explicit `i32` nodes. (i64/f32/f64 are in the assembler, not yet in the C lowerer.)
3. **Linear memory.** `$heap` bump = `calloc`. `$sp` grows down for frames. Pointers are i32 offsets. `i32.load` / `i32.store`.

## Fixture

`int compute(int x) { int result; result = x + 10 * 2; return result; }`

`compute(5) = 25` — both handwritten WAT and PANINI-emitted WAT.

## Honest limits

- Maṇḍūkapluti (`goto`): function-level bypass. No `goto` → structured `if`/`loop`. With `goto` → CFG → `br_table` dispatcher. See [WASM_MANDUKAPLUTI.md](WASM_MANDUKAPLUTI.md). Relooper shape detection is named, not this turn.
- Not a full WASI libc. `calloc` is in-module.
- Not gcc. This is a verified subset that executes.

Copyright (C) 1993-2026 Abhishek Choudhary. GPL-3.0-or-later.
