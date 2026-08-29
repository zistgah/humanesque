# Honesty wall (retrieved)

Copyright (C) 1993-2026 Abhishek Choudhary

Micro-STL + AST lowering is tuned for **llama.cpp / ggml**. It will not compile:

- **Linux kernel** — GNU C, `asm volatile`, `.lds`, not ISO C.
- **Boost** — SFINAE, two-phase templates, type_traits.
- **OpenBLAS** — Fortran + AVX. Netlib CBLAS: yes, slowly, until WASM SIMD + OpenMP workers.

God-tier later: CMake-in-VFS, GNU cpp, POSIX shim (pthread→Worker, mmap→Memory, gettimeofday→performance.now()), WGSL for real inference.
