# Maṇḍūkapluti on WASM — br_table dispatcher

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

Canonical emitter: [`src/panini/backends/wasm.pni`](../src/panini/backends/wasm.pni).  
Assembler: [`runtime/wat2wasm.js`](../runtime/wat2wasm.js) (`br_table` opcode 0x0e).

WASM has structured `block` / `loop` / `if`. It has no arbitrary `goto`. C `goto` (Maṇḍūkapluti) therefore lowers through a CFG:

```
AST  →  linear IR (labels, jump, brfalse, return, stmt)
     →  basic blocks (one entry, one terminator)
     →  integer ids for br_table
     →  reverse-nested (block $Bi …) + dispatcher loop
```

## Dual backend (function-level bypass)

A function with no `goto` / `label` uses the existing structured emitter (`if`/`loop`).  
A function that contains Maṇḍūkapluti uses the dispatcher. Structured code is not flattened “just in case.”

## Linear IR

| Op | Meaning |
|---|---|
| `label name` | Block entry |
| `jump target` | Unconditional |
| `brfalse cond target` | If cond is 0, jump; else fall through |
| `return value` | Function return |
| `stmt ast` | Assignment / decl / call |

`if` → brfalse / then / jump end / else / end.  
`while` → start / brfalse end / body / jump start / end.

## Chunking

- New block on `label`.
- Seal on `jump`, `return`, `brfalse`.
- If a block hits a label without a terminator, inject `jump` to that label. There is no implicit fall-through in a `br_table` machine until the peephole restores it.

## Reverse nesting

`br` to a `block` lands at the **end** of that block. Nest `$B(n-1)` … `$B0` innermost, put `br_table` at the bottom, close `$Bi` then emit block *i*'s payload.

## Peephole

If block *i* jumps to block *i+1*, delete the terminator. Execution drops into the next payload.  
If `brfalse` true-path is *i+1*, emit `i32.eqz` + `if { ip=false; br dispatcher }` and fall through on true.

`$ip` is written only on a real backward or sideways jump.

## Relooper (named, not this turn)

Shape detection (Simple / Multiple / Loop / Irreducible) can recover native `if`/`loop` inside a goto function. This tree implements bypass + peephole first. Relooper is the next pass, not a claim.

## Fixture

```c
int main(){ int x; x=1; goto skip; x=2; skip: return x; }
```

returns 1. Structured `while` still uses `loop`/`br_if`, not the dispatcher.

See also: [WASM.md](WASM.md), examples/wasm/goto.c.
