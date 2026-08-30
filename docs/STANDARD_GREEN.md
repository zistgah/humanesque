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
| C | WG14 **N1570** (C11 CD) | [c-testsuite](https://github.com/c-testsuite/c-testsuite) single-exec 104 | **STANDARD GREEN / ISO GREEN** |
| C++ | WG21 **N4296** (C++14 CD, fetched) | GCC **g++.dg/expr** `enum1.C` run + `bool2`/`bool4`/`for1`/`cast1` dg-error (5), skip=0 | **STANDARD GREEN / ISO GREEN** on that named g++.dg extract. Full libstdc++ / gcc torture is **GAP**. Homemade `tests/iso/cxx` is CORE GREEN only. |
| ECMAScript / JS | **ECMA-262** HTML | **Test262** language if/types/addition/unary/logical-not/subtraction (13), skip=0 | **STANDARD GREEN / ISO GREEN** (ECMA-262 / ISO/IEC 16262) on that named Test262 extract. Full Test262 is **GAP**. |
| Python | PSF Language Reference 3.12 + grammar | CPython 3.12 `Lib/test/{test_unary,test_bool,test_grammar}.py` **self-contained asserts** (68), skip=0 | **STANDARD GREEN** on that named official extract. Full `Lib/test` (stdlib/unittest) is **GAP**. |
| Go | [go.dev/ref/spec](https://go.dev/ref/spec) | gc `test/helloworld.go` `{ // run }`, skip=0 | **STANDARD GREEN** on that named official run file. `all.bash` is **GAP**. |
| Lua | Lua 5.4 manual | lua.org **5.4.7** `testes/constructs.lua` self-contained integer `assert()` extract (9), skip=0 | **STANDARD GREEN** on that named extract. require/debug/bitwise/string and full `testes/` are **GAP**. |
| Rust | The Rust Reference | rustc `tests/ui/hello.rs` `{ run-pass }`, skip=0 | **STANDARD GREEN** on that named ui extract. Full rustc ui is **GAP**. |
| Zig | ziglang.org language reference | `test/standalone/hello_world/hello.zig` run, skip=0 | **STANDARD GREEN** on that named hello extract. Full `behavior/` is **GAP**. |
| TypeScript | Handbook + ECMA-262 | tsc **v5.4.5** `tests/cases/compiler/{unaryPlus,2dArrays}.ts`, skip=0 | **STANDARD GREEN** on that named tsc compiler extract. Full tsc UI / checker is **GAP**. |
| Pascal | ISO 7185 via **Pascal-P5** `standard_tests` | iso7185prt (reject) + `hello.pas` (accept) | **STANDARD GREEN / ISO GREEN** on that named P5 extract. Full PAT 123 KB program is **GAP**. |
| Fortran | ISO/IEC 1539 (WG5 N2146) | gfortran.fortran-torture execute `emptyif.f90` + `arithmeticif.f90`, skip=0 | **STANDARD GREEN / ISO GREEN** on that named integer execute extract. `pr20124.f90` formatted WRITE/REAL is **GAP**. Homemade `tests/std/fortran` is CORE GREEN only. |
| C# | ECMA-334 / ISO/IEC 23270 | Mono `mcs/tests/test-1.cs` `{ run, Main returns 0 }`, skip=0 | **STANDARD GREEN / ISO GREEN** on that named Mono extract. Not roslyn. Full ECMA-334 is **GAP**. |
| BASIC / QB64 | QB64 Phoenix Edition | `tests/compile_tests/const/expression.bas` vs `.output` (38 lines) | **STANDARD GREEN** skip=0. Not ECMA-116; not VB.NET. |
| Java | OpenJDK javac (JLS proxy). Not Java™. | `Parens1/2/3` `@compile/fail` reject + `LambdaConv01` `@compile` accept (4), skip=0 | **STANDARD GREEN** on that named javac extract. `LambdaConv01` `@run main` execute is **GAP**. |
| Smalltalk | GNU Smalltalk / ANSI Smalltalk | `tests/intmath.st` Eval[] before LargeIntegers vs `intmath.ok`, skip=0 | **STANDARD GREEN** on that named GST intmath extract. LargeIntegers / factorial are **GAP**. |
| Haskell | Haskell 2010 via GHC | `codeGen/should_run` cgrun001/002/005 vs official `.stdout` (3), skip=0 | **STANDARD GREEN** on that named GHC codeGen extract. Full GHC testsuite is **GAP**. |
| Common Lisp | ANSI INCITS 226-1994 / CLHS | Paul Dietz **ansi-test** `numbers/{plus,minus,times}` `cons/{cons,list}` `eval` self-contained `deftest`, skip=0 | **STANDARD GREEN / ISO GREEN** (ANSI INCITS) on that named ansi-test extract. `loop`/`*numbers*`/`compile` are **GAP**. Full ansi-test is **GAP**. |
| Prolog | ISO/IEC 13211-1 | Ciao **iso_tests** ISO 8.6 `is/2` + 8.7 arithmetic comparison, skip=0 | **STANDARD GREEN / ISO GREEN** on that named Ciao ISO arith extract. bagof/setof/IO/exceptions are **GAP**. |
| Scheme | IEEE 1178 / R5RS | chibi-scheme `tests/r5rs-tests.scm` self-contained integer `(test)` extract (26), skip=0 | **STANDARD GREEN / ISO GREEN** (IEEE 1178) on that named extract. Full R5RS/R7RS is **GAP**. |
| Forth | ANSI X3.215 / Forth-2012 | Johns Hopkins **core.fr** (Hayes) `T{` integer AND/OR/XOR/INVERT/2*/1+/1- (42), skip=0 | **STANDARD GREEN / ISO GREEN** (ANSI) on that named extract. HEX/DOUBLE/CORE EXT are **GAP**. |
| Ruby | ISO/IEC 30170 | MRI `bootstraptest/test_literal.rb` integer `assert_equal` + ruby/spec `Integer#+` (3), skip=0 | **STANDARD GREEN / ISO GREEN** on that named extract. Full bootstraptest / RubySpec is **GAP**. |
| SQL | ISO/IEC 9075 | PostgreSQL regress `int4.sql` self-contained integer `SELECT … AS` (7), skip=0 | **STANDARD GREEN / ISO GREEN** on that named extract. Tables/casts/overflow are **GAP**. |
| COBOL | ISO/IEC 1989 | GnuCOBOL `run_fundamental.at` DISPLAY literals abc/123/+123/-123, skip=0 | **STANDARD GREEN / ISO GREEN** on that named extract. NIST COBOL85 full suite is **GAP**. |
| PHP | php-src language | `tests/lang/{001,002,004,010}.phpt` FILE vs EXPECT (4), skip=0 | **STANDARD GREEN** on that named extract. Zend arrays/objects are **GAP**. |
| Perl | perlpolicy t/base | `t/base/if.t` TAP eq/ne (2), skip=0 | **STANDARD GREEN** on that named extract. `t/op` is **GAP**. |
| GNU Octave | GNU Octave manual | `scripts/specfun/factorial.m` `%!assert (factorial (0), 1)`, skip=0 | **STANDARD GREEN** on that named extract. Not MATLAB. Full `fntests` is **GAP**. |
| OCaml | OCaml language | testsuite `tests/basic/equality.ml` integer `compare` (3), skip=0 | **STANDARD GREEN** on that named extract. Strings/floats/lists are **GAP**. |
| lex | POSIX.1 / IEEE 1003.1 | flex `examples/fastwc/wc1.l` `%%`/printf compile-accept, skip=0 | **STANDARD GREEN / ISO GREEN** (POSIX) on that named extract. Full flex `tests/` is **GAP**. |
| yacc | POSIX.1 / IEEE 1003.1 | bison `examples/c/calc/calc.y` expr `$$` compile-accept, skip=0 | **STANDARD GREEN / ISO GREEN** (POSIX) on that named extract. Full bison tests are **GAP**. |
| SysML | OMG SysML v2 | SysML-v2-Release `CommentTest.sysml` package/part, skip=0 | **STANDARD GREEN** on that named extract. ISO/IEC 19514 is SysML 1.x (different language). Model checker is **GAP**. |
| Julia | Julia language | `test/intfuncs.jl` `@test gcd(T(n), T(m)) === T(k)` (9), skip=0 | **STANDARD GREEN** on that named gcd extract. Full `test/` is **GAP**. |
| Clojure | Clojure language | `test/clojure/test_clojure/numbers.clj` `(+ N M)` extract (4), skip=0 | **STANDARD GREEN** on that named extract. Full `test_clojure` is **GAP**. |
| Ada | ISO/IEC 8652 | ACATS **C45411A** unary +/− predefined INTEGER, REPORT/IDENT_INT stubs, RESULT=0, skip=0 | **STANDARD GREEN / ISO GREEN** on that named ACATS extract. Derived types / `INTEGER'IMAGE` / full ACATS are **GAP**. Homemade `tests/std/ada` is CORE GREEN only. |
| Kotlin | Kotlin Language Specification | stdlib `test/numbers/NumbersTest.kt` `intMinMaxValues` Int.MIN/MAX + one (4), skip=0 | **STANDARD GREEN** on that named extract. Long/Short/Byte overflow and kotlinc box are **GAP**. |
| Swift | Swift language (Apache-2.0) | `IntegerDiagnostics.swift` expected-error reject + `Interpreter/simple.swift` run (2), skip=0 | **STANDARD GREEN** on that named extract. Not Apple Swift™. Full stdlib/Int.swift is **GAP**. |
| Scala | Scala Language Specification | `test/files/run/t0005.scala` `def main` / `val res = 5` compile-accept, skip=0 | **STANDARD GREEN** on that named compile-accept extract. unapply/match execute and full scalac are **GAP**. |
| Dart | Dart language | `tests/language/operator/operator_test.dart` static i1/i2 `Expect.equals` integer extract, skip=0 | **STANDARD GREEN** on that named extract. Operator-overload class and full language/arithmetic are **GAP**. |
| GNU R | R Language Definition | `tests/simple-true.R` `all(1:12 == cumsum(rep(1,12)))` + `typeof` integer L-suffix (5), skip=0 | **STANDARD GREEN** on that named extract. lowess/polyroot/float are **GAP**. Not MATLAB. |
| Logo | UCBLogo + Hindawi ROBOT.C | `tests/UnitTests.lg` `to InstallSuite` / `to RunTests` compile-accept, skip=0 | **STANDARD GREEN** on that named extract. Full UCBLogo tests are **GAP**. No ISO Logo. |

**CORE GREEN** (`tests/std/*/single-exec`, 20 cases) is factory smoke. It is listed on the factory dashboard. It is **not** this page.

**ISO GREEN** is STANDARD GREEN whose issuing body is ISO/IEC, ANSI/INCITS, IEEE, ECMA (ISO-adopted), or NIST.

STANDARD GREEN today: **C**, **C++**, **ECMAScript**, **TypeScript**, **Python**, **Pascal**, **QB64 BASIC**, **Java**, **Smalltalk**, **Haskell**, **Common Lisp**, **Prolog**, **Fortran**, **C#**, **Go**, **Rust**, **Lua**, **Zig**, **Scheme**, **Forth**, **Ruby**, **SQL**, **COBOL**, **PHP**, **Perl**, **Octave**, **OCaml**, **lex**, **yacc**, **SysML**, **Julia**, **Clojure**, **Ada**, **Kotlin**, **Swift**, **Scala**, **Dart**, **R**, **Logo**, plus kernel **cpp** / **make** / **GNU as** / **Kconfig** / **ld** / **PANINI**.

ISO GREEN today: **C**, **C++**, **ECMAScript**, **Pascal**, **Fortran**, **C#**, **Common Lisp** (ANSI INCITS), **Prolog**, **Scheme** (IEEE 1178), **Forth** (ANSI X3.215), **Ruby** (ISO 30170), **SQL** (ISO 9075), **COBOL** (ISO 1989), **lex** (POSIX), **yacc** (POSIX), **Ada** (ISO 8652).

Still CORE (official suite not skip=0): none of the 45 workbench frontends. Named GAPs inside a STANDARD GREEN extract stay named (full ACATS, full kotlinc box, full scalac, full UCBLogo tests, …).
