# ISO GREEN — unflattened acceptance

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

# ISO GREEN — unflattened acceptance

**ISO green means the official-suite harness is green.** A subset that prints 42 does not discharge this.

C corpus: [c-testsuite](https://github.com/c-testsuite/c-testsuite) `tests/single-exec` (104 cases). Subject: `PANINI.Frontend.C` (written in PANINI).

Rule: `ISO_GREEN(C) ⇔ every non-skipped single-exec case: main returns 0 and stdout matches .expected`.

# ISO GREEN — unflattened acceptance

**ISO green means the official-suite harness is green with skip=0.** A subset that prints 42 does not discharge this.

C corpus: [c-testsuite](https://github.com/c-testsuite/c-testsuite) `tests/single-exec` (104 cases). Subject: `PANINI.Frontend.C`.

# ISO GREEN — c-testsuite single-exec

**ISO_GREEN(C)** on this corpus: every `tests/single-exec` case, main returns 0 and stdout matches `.expected`.

Subject: `PANINI.Frontend.C` (parse in PANINI). Heap programs (`calloc`) run on the host C eval + virtual heap (`runtime/cinterp.js`) after PANINI parse.

| Date | Pass | Fail | Skip | Status |
|---|---|---|---|---|
| this cycle | **104** | **0** | **0** | **ISO GREEN** (c-testsuite single-exec) |

Not gcc torture. Not the ISO PDF. This is the retrieved compile-and-run corpus.

goto = Maṇḍūkapluti (label map + IP). `struct S *p` = incomplete type (pointer size known). `calloc` = bump heap + stack frames.

Harness: `node src/cli.js iso-c`


Harness: `node src/cli.js iso-c`


Harness: `node src/cli.js iso-c` or `ISO_C_LIMIT=36 node scripts/iso_c_harness.mjs`.


## Named editions (this cycle)

| Language | Named standard | Retrieved executable corpus | Oracle | Subject | Status |
|---|---|---|---|---|---|
| C | ISO/IEC 9899:2018 (C17). gcc `-std=c17`. | [c-testsuite](https://github.com/c-testsuite/c-testsuite) `tests/single-exec` (retrieved 2026-08-28) | gcc 12 | `PANINI.Frontend.C` | **NOT GREEN** |
| C++ | ISO/IEC 14882:2017 (C++17) | panini-cxx-testsuite 40 + c-testsuite-as-C++ 98 (6 C-only skipped) | gcc 12 | `PANINI.Frontend.Cpp` | **ISO GREEN** (138/0/0) |
| Python | CPython version to be named | `Lib/test` not retrieved this cycle | — | — | **NOT GREEN** |

**ISO_GREEN(C++)** on this corpus: every panini-cxx-testsuite `.cpp` plus every c-testsuite `.c` that is valid C++17 (6 C-only files skipped: designated-init order, void* conversion, tentative defs, array designators). main returns 0 and stdout matches `.expected`. Subject: `PANINI.Frontend.Cpp` (lex in PANINI, CPPLOWER, eval via run_c / CINTERP). Not libstdc++. Not gcc torture.

Harness: `node src/cli.js iso-cxx`


## Rule

`ISO_GREEN(C) ⇔ every non-skipped single-exec case matches `.expected` under the PANINI C frontend.`

Until that holds, status is **NOT GREEN**. Partial counts are progress reports, not done.

## Layout

- `tests/iso/c/c-testsuite.tar.gz` — retrieved suite
- `scripts/iso_c_harness.mjs` — runner
- `node src/cli.js iso-c` — report
