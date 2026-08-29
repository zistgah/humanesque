# GATE CSE syllabus — example programmes

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

These are **teaching examples** mapped to the GATE Computer Science paper sections.
They are not the official GATE question papers (those remain with IISc/IIT).

| File | GATE section | What it computes |
|---|---|---|
| `01_gcd.pni` | Programming / Discrete (number theory) | Euclidean GCD |
| `02_binsearch.pni` | Algorithms | Binary search |
| `03_stack.pni` | Data Structures | Stack push/pop via list |
| `04_bits.pni` | Digital Logic | Bitwise AND/OR as arithmetic stand-in |
| `05_fcfs.pni` | Operating System | FCFS waiting time |
| `06_dfa.pni` | Theory of Computation | DFA for even number of 1s |
| `07_lex.pni` | Compiler Design | Token count |
| `08_checksum.pni` | Computer Networks | Ones'-complement style sum |

Run: `node runtime/interpreter.js examples/gate_cse/01_gcd.pni`  
Frontends: the same algorithms may be viewed as C/Python via the PANINI frontends (virtualized subset, not ISO CONFORMANCE).
