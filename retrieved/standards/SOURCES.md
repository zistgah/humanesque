# Retrieved official standards — not reconstructed

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

These files were **fetched from the issuing bodies** on 2026-08-29.  
We do not paste paid ISO text. Committee drafts and ECMA/PSF/Go/Lua texts are public.

| File | Issuer | What it is | URL |
|---|---|---|---|
| `n1570.pdf` | ISO/IEC JTC1/SC22/WG14 | C11 committee draft (the public text academics cite) | https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf |
| `n4296.pdf` | WG21 | C++14 CD (public). Fetched; **not in zip** (12 MB). `scripts/pull_standards.sh` | https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4296.pdf |
| `n2146.pdf` | J3 / WG5 | Fortran 2018 draft. Fetched; **not in zip** (9 MB) | https://j3-fortran.org/doc/year/18/18-007r1.pdf |
| `ecma262.html` | Ecma TC39 | ECMA-262 (ECMAScript) living spec | https://tc39.es/ecma262/ |
| `gxx-dg/` | GCC g++.dg/expr | `enum1.C` run + `bool2`/`bool4`/`for1`/`cast1` dg-error | https://github.com/gcc-mirror/gcc |
| `test262/` | TC39 | Official ECMA-262 *executable* suite (language extract) | https://github.com/tc39/test262 |
| `tsc/` | Microsoft TypeScript v5.4.5 | `tests/cases/compiler/{unaryPlus,2dArrays}.ts` | https://github.com/microsoft/TypeScript |
| `openjdk-javac/` | OpenJDK jdk-21-ga javac | `Parens1/2/3.java` `@compile/fail` + `lambda/LambdaConv01.java` accept. Not Java™. | https://github.com/openjdk/jdk |
| `gst-intmath/` | GNU Smalltalk | `tests/intmath.st` + `intmath.ok` (Eval before LargeIntegers) | https://github.com/gnu-smalltalk/smalltalk |
| `ghc-cgrun/` | GHC | `codeGen/should_run` cgrun001/002/005 + official `.stdout` | https://github.com/ghc/ghc |
| `ansi-test/` | Paul Dietz ansi-test (ANSI CL) | `numbers/{plus,minus,times}` `cons/{cons,list}` `eval` self-contained deftest | https://github.com/pfdietz/ansi-test |
| `ciao-iso/` | Ciao iso_tests | `src/iso_tests.pl` ISO 8.6 is/2 + 8.7 arith comparison | https://github.com/ciao-lang/iso_tests |
| `python-grammar.html` | PSF | Python 3.12 language grammar | https://docs.python.org/3.12/reference/grammar.html |
| `cpython-3.12/test_unary.py` | CPython 3.12 | Official unary language tests | https://raw.githubusercontent.com/python/cpython/3.12/Lib/test/test_unary.py |
| `cpython-3.12/test_bool.py` | CPython 3.12 | Official bool tests | https://raw.githubusercontent.com/python/cpython/3.12/Lib/test/test_bool.py |
| `cpython-3.12/test_grammar.py` | CPython 3.12 | Official grammar tests | https://raw.githubusercontent.com/python/cpython/3.12/Lib/test/test_grammar.py |
| `pascal-p5/` | Pascal-P5 / ISO 7185 | `iso7185prtNNNN.pas` reject extract + `hello.pas` | https://github.com/samiam95124/Pascal-P5 |
| `qb64pe/` | QB64 Phoenix Edition | `tests/compile_tests/const/expression.bas` vs `.output` | https://github.com/QB64-Phoenix-Edition/QB64pe |
| `gfortran-dg/` | GCC 13.2 gfortran | official `{ dg-do run }` / fortran-torture execute (retrieved; **not skip=0**) | https://github.com/gcc-mirror/gcc |
| `go-spec.html` | Go project | The Go Programming Language Specification | https://go.dev/ref/spec |
| `lua-5.4-manual.html` | lua.org | Lua 5.4 reference manual | https://www.lua.org/manual/5.4/manual.html |
| `lua-5.4-tests/` | lua.org | Official Lua 5.4.7 test archive | https://www.lua.org/tests/lua-5.4.7-tests.tar.gz |
| `rust-reference.html` | rust-lang | The Rust Reference | https://doc.rust-lang.org/reference/ |
| `zig-langref.html` | ziglang.org | Zig language reference | https://ziglang.org/documentation/master/ |
| `typescript-spec.html` | Microsoft TS | Handbook / types (TS is ECMA-262 + types) | https://www.typescriptlang.org/docs/handbook/2/basic-types.html |
| `tests/iso/c/c-testsuite/` | c-testsuite/c-testsuite | Public C compiler single-exec suite (ISO C proxy) | https://github.com/c-testsuite/c-testsuite |

**STANDARD GREEN** is claimed only against a row in this table’s *executable* column, skip=0.

Homemade `tests/std/*/single-exec` 20-case files are **CORE GREEN** (factory smoke). They are not a standard.
