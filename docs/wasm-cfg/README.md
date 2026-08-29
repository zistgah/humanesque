# WASM CFG papers (Maṇḍūkapluti)

Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later

These are the lowering notes implemented in [`src/panini/backends/wasm.pni`](../../src/panini/backends/wasm.pni). Narrative: [`../WASM_MANDUKAPLUTI.md`](../WASM_MANDUKAPLUTI.md).

1. **Bypass** — `watHasGoto` / `watHasGotoList`. No label, no goto → structured emitter.
2. **Linearize** — `cfgVisit` / `cfgFlattenBody`. if/while/for → brfalse + jump + synthetic labels. User `goto`/`label` preserved. `break`/`continue` via loop stack.
3. **Chunk** — `cfgBuild`. One entry, one terminator. Fall-through becomes an explicit jump, then peephole may delete it.
4. **Ids** — block names → dense integers for `br_table`.
5. **Peephole** — `cfgOpt`. Jump to i+1 is deleted.
6. **Emit** — `watEmitDispatcher`. Reverse-nested `(block $Bi)`, `br_table`, payloads, `i32.eqz` true-path fall-through.
7. **Assembler** — `runtime/wat2wasm.js` opcode `0x0e`.

Relooper (Simple / Multiple / Loop / Irreducible shapes) is named, not implemented this turn.
