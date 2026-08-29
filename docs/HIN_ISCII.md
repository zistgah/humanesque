# .hin files are ISCII (2004)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

Retrieved from `hindawi3.zip` README and `bin/guru.bat`. Not reconstructed.

## There is no `lekhak.hin`

`src/lekhak/` ships `LEKHAK.C` + `make.bat` (`gcc … lekhak.c -lHind`).  
Lekhak is the IDE; it is not a Shaili Guru program. `.hin` is the **source extension for shaili programs**.

## Encoding

README names the 8-bit layer **ISCII**:

| tool | README gloss |
|---|---|
| `FROMUNI.EXE` | UNICODE (little endian) → ISCII |
| `TOUNI.EXE` | ISCII → UNICODE (little endian) |
| `acii2cf.exe` | ISCII → Compilation Format |
| `acii2rmn.exe` | ISCII → Romenagri (Purna) |
| `acii2hin.exe` | ISCII → Romenagri (Saral) |
| `rmn2acii.exe` | Romenagri → ISCII |

`ACII` in this tree is that ISCII-derived 8-bit (APCISR). `.uhin` is the later UTF-8 spelling of the same filters (Linux 2008: `h2c.uhin`).

Specimen: `src/robot/ROBOT.HIN` — 1172 bytes ≥ 128, not UTF-8.

## `guru filename` (do not pass the extension)

From retrieved `bin/guru.bat`:

```
if not exist %1.hin goto usage
rmshaili %1.hin
type noshaili.tmp | acii2cf > %1.cf
type %1.cf | h2c > ctmpot.c
gcc -o %1 ctmpot.c … -lhindm -lalleg
```

Linux 0.2.0 (`guru/Makefile`, `hindrv/hincc`):

```
cat h2c.uhin | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf > h2c.lex
# program:
cat $1 | fixuninum | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | hincc.awk
```

`.uhin` → UTF-16 → **uni2acii (ISCII)** → **acii2cf (CF / Romenagri)** → shaili lex (`h2c`) → gcc.

`.hin` is already ISCII; skip iconv/uni2acii; start at `rmshaili` → `acii2cf` → `h2c`.

`acii2cf.lex` (retrieved): non-ASCII runs go through `acii2rmn()`.

## Lekhak (README, not guessed)

F1 help · F2 save · F3 load · F4 search · **F5 compile and run** · **F9 compile only** · F10 menu.  
Inscript keyboard. First line of a program = shaili tag when compiling from Lekhak.

Outside Lekhak: `guru filename` with **`.HIN`**.
