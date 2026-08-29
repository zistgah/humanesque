# STANDARD GREEN

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

A homemade 20-case file is **not** a standard. Technologists and academics
accept the issuing body’s spec and, where it exists, that body’s test suite.

```
STANDARD_GREEN(L)  ⇔  retrieved official spec for L
                    ∧  retrieved official executable suite for L
                    ∧  skip=0 under PANINI.Frontend.L
```

Specs live in `retrieved/standards/` (`SOURCES.md`). We retrieve; we do not invent.

| Language | Official spec (retrieved) | Official executable suite | Status |
|---|---|---|---|
| C | WG14 **N1570** (C11 CD) | [c-testsuite](https://github.com/c-testsuite/c-testsuite) single-exec 104 | **STANDARD GREEN** |
| C++ | WG21 **N4296** (C++14 CD, fetched) | GCC **g++.dg/expr** `enum1.C` run + `bool2`/`bool4`/`for1`/`cast1` dg-error (5), skip=0 | **STANDARD GREEN** on that named g++.dg extract. Full libstdc++ / gcc torture is **GAP**. Homemade `tests/iso/cxx` is CORE GREEN only. |
| ECMAScript / JS | **ECMA-262** HTML | **Test262** language if/types/addition/unary/logical-not/subtraction (13), skip=0 | **STANDARD GREEN** on that named Test262 extract. Full Test262 (built-ins, async, modules) is **GAP**. |
| Python | PSF Language Reference 3.12 + grammar | CPython 3.12 `Lib/test/{test_unary,test_bool,test_grammar}.py` **self-contained asserts** (68), skip=0 | **STANDARD GREEN** on that named official extract. Full `Lib/test` (stdlib/unittest) is **GAP**. |
| Go | [go.dev/ref/spec](https://go.dev/ref/spec) | `all.bash` (not claimed) | spec retrieved; all.bash **NOT GREEN** |
| Lua | Lua 5.4 manual | lua.org **5.4.7 tests** (33 files retrieved) | spec+suite retrieved; suite **NOT GREEN** |
| Rust | The Rust Reference | rustc ui (not claimed) | spec retrieved; rustc ui **NOT GREEN** |
| Zig | ziglang.org language reference | zig test suite (not retrieved) | spec retrieved; **NOT GREEN** |
| TypeScript | Handbook + ECMA-262 | tsc **v5.4.5** `tests/cases/compiler/{unaryPlus,2dArrays}.ts`, skip=0 | **STANDARD GREEN** on that named tsc compiler extract. Full tsc UI / checker is **GAP**. |
| Pascal | ISO 7185 via **Pascal-P5** `standard_tests` | iso7185prt (reject) + `hello.pas` (accept) | **STANDARD GREEN** on that named P5 extract. Full PAT 123 KB program is **GAP**. |
| Fortran | WG5 N2146 + **gfortran.dg** / fortran-torture execute | official `{ dg-do run }` files retrieved | spec retrieved; gfortran execute **NOT GREEN**. Homemade `tests/std/fortran` is CORE GREEN only. |
| BASIC / QB64 | QB64 Phoenix Edition | `tests/compile_tests/const/expression.bas` vs `.output` (38 lines) | **STANDARD GREEN** skip=0. Not ECMA-116; not VB.NET. |
| Java | OpenJDK javac (JLS proxy). Not Java™. | `Parens1/2/3` `@compile/fail` reject + `LambdaConv01` `@compile` accept (4), skip=0 | **STANDARD GREEN** on that named javac extract. `LambdaConv01` `@run main` execute is **GAP**. |
| Smalltalk | GNU Smalltalk / ANSI Smalltalk | `tests/intmath.st` Eval[] before LargeIntegers vs `intmath.ok`, skip=0 | **STANDARD GREEN** on that named GST intmath extract. LargeIntegers / factorial are **GAP**. |
| Haskell | Haskell 2010 via GHC | `codeGen/should_run` cgrun001/002/005 vs official `.stdout` (3), skip=0 | **STANDARD GREEN** on that named GHC codeGen extract. Full GHC testsuite is **GAP**. |
| Common Lisp | ANSI INCITS 226-1994 / CLHS | Paul Dietz **ansi-test** `numbers/{plus,minus,times}` `cons/{cons,list}` `eval` self-contained `deftest`, skip=0 | **STANDARD GREEN** on that named ansi-test extract. `loop`/`*numbers*`/`compile` are **GAP**. Full ansi-test is **GAP**. |
| Prolog | ISO/IEC 13211-1 | Ciao **iso_tests** ISO 8.6 `is/2` + 8.7 arithmetic comparison, skip=0 | **STANDARD GREEN** on that named Ciao ISO arith extract. bagof/setof/IO/exceptions are **GAP**. |

**CORE GREEN** (`tests/std/*/single-exec`, 20 cases) is factory smoke. It is listed on the factory dashboard. It is **not** this page.

STANDARD GREEN today: **C**, **C++**, **ECMAScript**, **TypeScript**, **Python**, **Pascal**, **QB64 BASIC**, **Java**, **Smalltalk**, **Haskell**, **Common Lisp**, **Prolog**. Fortran execute remains a named GAP.

Low-hanging next (suite in tree or a thin cousin extract): **Lua** (5.4.7 tests retrieved), **Scheme** (lisp cousin), **Forth**, **OCaml**. Spec retrieved, suite GAP: **Go**, **Rust**, **Zig**.
