/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
window.PANINI_CATALOG = {
  architecture: `PANINI architecture

Human intent
  ILM projection (script ⊥ computation)
  Blocks / Shaili / BASIC
  .pni source
        │
 Lexer → Parser → AST → axis bundle → IR_P
        │
 Interp (JS) · IR VM · Emit (js/py/c/f90/torch/wgsl)
 Foreign frontends (PANINI-written subsets)
 VFS + bash · VT100 + fonts · BLAS · GFX
        │
 L15 workbench (this page) · CLI · desktop VS Code extension

Equity:
  Representational  ↔  ILM
  Computational     ↔  PANINI
`,
  features: [
    { id: "selfhost", name: "Self-hosting compiler", status: "VERIFIED", note: "T0 A=B=C subset" },
    { id: "ilm", name: "ILM multiscript projection", status: "VERIFIED_SUBSET", note: "EN/HI/AR keyword maps" },
    { id: "axes", name: "13-axis configuration", status: "ARCH", note: "scoped @annotations" },
    { id: "python", name: "Python frontend", status: "VERIFIED_SUBSET", note: "print/def/return/lists/tensor" },
    { id: "c", name: "C frontend", status: "VERIFIED_SUBSET", note: "main/printf/return" },
    { id: "cpp", name: "C++ frontend", status: "VERIFIED_SUBSET", note: "cout rewrite → C" },
    { id: "fortran", name: "Fortran frontend", status: "VERIFIED_SUBSET", note: "PRINT *, expr" },
    { id: "rust", name: "Rust frontend", status: "VERIFIED_SUBSET", note: "println! expr" },
    { id: "ts", name: "TypeScript frontend", status: "VERIFIED_SUBSET", note: "console.log expr" },
    { id: "go", name: "Go frontend", status: "VERIFIED_SUBSET", note: "fmt.Println expr" },
    { id: "zig", name: "Zig frontend", status: "VERIFIED_SUBSET", note: "debug.print expr" },
    { id: "emit", name: "Emit backends", status: "VERIFIED_SUBSET", note: "js python c fortran torch wgsl" },
    { id: "blas", name: "BLAS + autotune", status: "VERIFIED_SUBSET", note: "AXPY GEMV GEMM GEMM_TUNE" },
    { id: "vfs", name: "Virtual filesystem", status: "VERIFIED_SUBSET", note: "in-memory POSIX-ish" },
    { id: "bash", name: "Bash in PANINI", status: "VERIFIED_SUBSET", note: "pwd ls cat echo mkdir cd" },
    { id: "vt100", name: "VT100 + fonts", status: "VERIFIED_SUBSET", note: "CSI + DOS .f16 + TTF cmap4" },
    { id: "gfx", name: "Graphics / WebGPU", status: "PARTIAL", note: "2D primitives; WGSL stub" },
    { id: "blocks", name: "Blocks frontend", status: "PARTIAL", note: "JSON ↔ .pni" },
    { id: "lsp", name: "Language server", status: "PARTIAL", note: "file diagnostics CLI" },
    { id: "debug", name: "Debugger", status: "PARTIAL", note: "token/eval trace, not DWARF" },
    { id: "pages", name: "GitHub Pages workbench", status: "VERIFIED", note: "this /docs site + Monaco" },
  ],
  samples: {
    "hello.pni": `MODULE Hello
FUNCTION main()
    PRINT "Hello, PANINI"
    RETURN 0
END
END
`,
    "double.pni": `FUNCTION double(x)
    RETURN x * 2
END
PRINT double(21)
`,
    "hello.py": "print(40+2)\n",
    "hello.rs": "fn main() {\n    println!(\"{}\", 40 + 2);\n}\n",
    "hello.ts": "console.log(40 + 2);\n",
    "hello.go": "package main\nfunc main() {\n    fmt.Println(40 + 2)\n}\n",
    "hello.zig": "pub fn main() void {\n    std.debug.print(\"{d}\", .{40 + 2});\n}\n",
    "hello.f90": "PROGRAM P\nPRINT *, 40+2\nEND PROGRAM P\n",
    "vt100.pni": `VT_RESET()
VT_WRITE(ESC() + "[32mVT100" + ESC() + "[0m ready")
PRINT VT_DUMP()
`,
  },
};
