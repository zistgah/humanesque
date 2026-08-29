# CAN_COMPILE

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Hindawi has generated **machine code since 2004**. `gurucc` is not a toy:

```
cat $1 | acii2uni | iconv | h2c > tempfil0123.tmphin.c
gcc tempfil0123.tmphin.c -o hin.exe -lm
```

(retrieved `legacy/Hindawi/guru/gurucc`). The other shailis likewise invoke g++, javac, fasm, python, flex, yacc. That is binary production. It is not in dispute.

## What this tree adds, and what it does not recant

| Path | Machine code? |
|---|---|
| Hindawi shaili → host → **gcc / g++ / fasm / javac** | **Yes. That is the 2004 system.** |
| Engineer lab (`labs/engineer`) with those toolchains | **Yes — same pipeline.** |
| Browser / GitHub Pages | No gcc in the browser. The notebook **compiles to the same host** (h2c.uhin / h2b.uhin) and interprets that host so a reader can run without a toolchain. That is a **projection**, not a claim that Hindawi cannot emit ELF. |
| PANINI `.pni` self-host (T0 A=B=C) | JS interpreter of PANINI source. Bootstrap. Not a denial of shaili→gcc. |

## ISO suites

`ISO C17 frontend, official suite green` remains **not green** until the official suite is run against our frontend. That is a **conformance** statement. It is **not** a statement that we do not use gcc as the Hindawi backend. gurucc *is* gcc on the far side of h2c. That is how localisation reaches the debugger and `nm`.

## What we refuse

- `#define je if` as localisation.
- Writing “cannot generate machine code” about a system whose compiler driver ends in `gcc … -o hin.exe`.
- Collapsing the browser projection with the native shaili path.
