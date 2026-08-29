# Official language standards (map only)

Copyright (C) 1993-2026 Abhishek Choudhary  
GPL-3.0-or-later

No CONFORMANCE claim is made in this repository unless a row says PASS.

| Language | Standard / suite |
|---|---|
| C | ISO/IEC 9899; gcc torture; c-testsuite |
| C++ | ISO/IEC 14882; libc++ / libstdc++ |
| Objective-C | Apple / clang ObjC tests |
| Python | CPython `Lib/test`; PEPs as language law |
| Fortran | ISO/IEC 1539; gfortran torture |
| Julia | Julia `test/` |
| Rust | rustc ui + reference |
| Go | Go spec + `go test` std |
| TypeScript | TypeScript `tests/cases` + ECMA-262 via JS emit |
| JavaScript | ECMA-262 Test262 |
| Zig | zig behavior tests |
| Java | JLS + jtreg / OpenJDK |
| Kotlin | Kotlin compiler tests |
| Scala | Scala compiler tests |
| C# | ECMA-334 / Roslyn |
| F# | F# compiler tests |
| Swift | Swift compiler tests |
| Ruby | Ruby spec (`ruby/spec`) |
| PHP | PHPT |
| Perl | perl harness |
| R | CRAN tests + R Language Definition |
| MATLAB / Octave | Octave `test/` |
| Haskell | Haskell 2010 + GHC testsuite |
| OCaml | OCaml testsuite |
| Erlang | OTP test |
| Elixir | Elixir ExUnit std |
| Lua | lua.org tests |
| COBOL | ISO 1989 |
| Ada | ISO 8652 ACATS |
| Pascal | ISO 7185 / 10206 |
| BASIC | ECMA-116 (as historical) |
| Lisp / Scheme | R7RS |
| Prolog | ISO 13211 |
| SQL | ISO 9075 |
| WASM | WebAssembly spec tests |
| WGSL | W3C WGSL |
| PANINI | `tests/panini/` (owned) |

Harness: `node tests/standards/harness.mjs`
