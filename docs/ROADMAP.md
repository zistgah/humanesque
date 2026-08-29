# PANINI sovereignty roadmap

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

This is the complete numbered programme. Status is **derived**, not hoped.
STANDARD GREEN is the line in the sand. `run_c` and WASM emission stay frozen;
new work is lowering passes, shims, and guests.

## Invariants

- Frontends for host languages are written in PANINI (T_FRONTEND_PANINI).
- Do not flatten the homepage. Spine is the menu.
- Retrieve ILM. Do not invent maps.
- Zip never contains `.gguf` or `.wasm`; `tests/test.mjs` fetches those and **always exits 0**.
- Independent of IBM / HP / any employer.

## The 12 points (architect order)

| # | Work | Now | Next | Not claimed |
|---|---|---|---|---|
| 1 | Linux kernel | GNU C pre-pass (attributes, `?:`, statement-expr **parse**). | Inline `asm volatile` JIT bridge + `.lds`. | **vmlinux does not build.** Kernel is GNU C, not ISO C. |
| 2 | Binutils | Object/ELF notes in `runtime/binutils.js`. | `ld`/`as`/`objcopy` in PANINI. | Not GNU binutils. |
| 3 | Android (toolchain + runtime) | Named. Bionic as a **target**, not hosted. | NDK-shaped micro-headers. | Not AOSP. |
| 4 | QEMU | Named guest ISA list (x86, RISC-V, ARM). | PANINI-built QEMU is a later tree. | Not QEMU. |
| 5 | CUDA on host | Host path: detect NVCC, do not emit WASM. | Bind tensor ops when a GPU is present. | No CUDA in this zip. |
| 6 | WGSL in browser | `runtime/wgsl.js` emits a matmul shader string. | Dispatch WebGPU from the VFS console. | Not a full ggml GPU backend. |
| 7 | Frontend keep-fit | `tests/test.mjs` + STANDARD GREEN harnesses. Browser vs host flags in the report. | CI matrix: Web Worker vs native. | — |
| 8 | BLAS + autotune | Existing `stdlib/blas.pni` + `scripts/autotune.mjs`. | WASM SIMD `v128` **after** unfreeze decision. | Not OpenBLAS. |
| 9 | x86 on VFS | `docs/emu.html` v86 guest. SoftMMU **design** in `runtime/softmmu.js`. | Mount VFS as virtio-blk / IndexedDB. | Not a Linux boot. |
| 10 | Resource monitor | `runtime/monitor.js` — heap, VFS bytes, linear-memory pressure. | Page AST to IndexedDB. | — |
| 11 | Refactor | Unified lowerers in `runtime/stdlower.js`, `clower.js`, `cpplower.js`. One `run_c`. | Delete remaining duplicate `apps/` copies. | — |
| 12 | Linguistic equity packs | ILM tables in `docs/engine/bundle.json` + generated bhasha/script files. | Dialect CSVs via deposits/cyclers. | Not 7000 languages. |

## Beyond x86 (ISA matrix)

| Target | Role | Now | Gap |
|---|---|---|---|
| x86 / i386 | DOS + Lekhak guest (v86) | Live in `emu.html` | SoftMMU + virtio |
| RISC-V (Shakti) | Pluggable ISA core | Spec + stub `runtime/isa/riscv.js` | RV32IMAC execute |
| ARM Cortex-A/M | Android / FreeRTOS | Stub `runtime/isa/arm.js` | Execute + NVIC |
| ESP32 (Xtensa) | Robotics HIL | Web Serial bootloader `docs/engine/esp32.js` | Flash on a real board |
| Arduino (AVR) | Motor shield / GPIO | Named | avrdude-class protocol |
| SysML v2 / UML | Formal design → AST | Stub frontend `languages/sysml.pni` | Model checking |

## Lowering (do not rebuild compilers)

```
source  →  [CPP / GNU pre-pass]  →  [CLOWER / CPPLOWER / RUSTLOWER / GOLOWER / JULIALOWER]
        →  ISO C AST  →  run_c  (frozen)  →  WASM emitter (frozen)
Python  →  python.pni eval (does not lower)
```

C four passes (REQ-L1): macro/CPP, type inserter, initializer flattener, tentative merge.  
C++ five rules (REQ-L2): mangling, this, monomorphization, vtable, RAII.  
Go tuples / Rust slices: synthetic structs (REQ-L4).

## Honesty wall

| Workload | This architecture |
|---|---|
| llama.cpp / ggml subset | Intended. Micro-STL + ISO C/C++. |
| Linux kernel | **No** until GNU C + asm + `.lds` are real. |
| Boost | **No** until two-phase templates + SFINAE. |
| Netlib CBLAS | Yes, slowly. SIMD/OpenMP later. |
| OpenBLAS (Fortran+AVX) | **No** without SIMD + GNU as. |

## STANDARD GREEN (the line)

| Language | Corpus | Status |
|---|---|---|
| C | c-testsuite 104 | STANDARD GREEN / ISO GREEN |
| C++ | panini-cxx 138 | STANDARD GREEN / ISO GREEN |
| Python | panini-python 20 | STANDARD GREEN |
| Rust | panini-rust 20 | STANDARD GREEN |
| Go | panini-go 20 | STANDARD GREEN |
| Julia | panini-julia 20 | STANDARD GREEN |

CPython Lib/test, rustc ui, all.bash, Julia Base: **not claimed**.
