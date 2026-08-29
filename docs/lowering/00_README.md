# Lowering, Micro-STL, GNU C, sovereignty — retrieved analysis

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

These notes are the architect-supplied Copilot/analysis texts, captured
verbatim in this folder so they are not reconstructed:

| File | Topic |
|---|---|
| `01_c_cxx_lowering.md` | Four C lowering passes + five C++ AST rules. WASM frozen. |
| `02_micro_stl.md` | Micro-libc + Micro-STL. Do not parse GCC headers. |
| `03_honesty_kernel_boost_blas.md` | llama.cpp subset ≠ Linux/Boost. BLAS yes, slowly. |
| `04_go_rust_structs.md` | Go tuples and Rust fat pointers → C structs. |
| `05_sovereignty_12.md` | 12-point roadmap. |
| `06_gnu_c_kernel.md` | GNU C needed for vmlinux. |
| `07_asm_jit_bridge.md` | asm volatile → x86 emulator JIT bridge. |
| `08_softmmu.md` | SharedArrayBuffer + SoftMMU. |
| `09_virtio_indexeddb.md` | virtio-blk on IndexedDB. |
| `10_isa_matrix.md` | RISC-V/Shakti, ARM, Arduino, ESP32, SysML. |
| `11_esp32_webserial.md` | Native JS bootloader / Web Serial. |

STANDARD GREEN remains the line in the sand. Named corpora, skip=0, PANINI
frontends. Lib/test, rustc ui, all.bash, Julia Base: **not claimed**.

`run_c` and the WASM/WAT emitter stay frozen. New work is **pre-passes**.
