# ہندوی — اردو / Hindawi — Urdu

Copyright (C) 1993-2026 Abhishek Choudhary. GNU GPL v2 or later.
Part of the Hindawi Indic Programming System · Project VIKRAM · AyeAI.

مکمل دستور: **[`docs/دستور.md`](docs/دستور.md)** · نوٹ بک: `Notebooks/ہندوی_اردو.ipynb`

## All eight shailis, both directions

| شیلی | host | rules | localised | forward | reverse |
|---|---|---:|---:|---|---|
| گرو guru | C | 312 | 44 | `h2c_urdu` | `c2h_urdu` |
| شرینی shraeni | C++ | 867 | 50 | `h2cpp_urdu` | `cpp2h_urdu` |
| یَنتر yantra | asm | 352 | 8 | `h2y_urdu` | `y2h_urdu` |
| کرترما kritrima | Java | 182 | 32 | `h2j_urdu` | `j2h_urdu` |
| پراتھا praatha | BASIC | 93 | 37 | `h2b_urdu` | `b2h_urdu` |
| سوچی soochee | Python | 36 | — | `h2py_urdu` | `py2h_urdu` |
| ویاکا wyaaka | yacc | 6 | 6 | `h2yacc_urdu` | `yacc2h_urdu` |
| شبد shabda | lex | 4 | 4 | `h2l_urdu` | `l2h_urdu` |

**Nothing flattened.** Every retrieved rule is carried; a word without an Urdu
translation keeps its original pattern rather than being dropped. 1,852 rules.

## The two defects you found on the live system, fixed

**1. The pattern column was being transduced.** `waapasa {printf("return");}`
became `return {printf("return");}` because the generated `.lex` was piped
through `h2c`. Forward actions are now **plain ASCII host keywords** — asserted
by a check — and no Makefile pipes the lex through `h2c`.

**2. `fixuninum` does not cover Arabic-Indic digits.** `[۸۰]` reached cc as
`'xp' undeclared`. `Hindawi/fixarabnum` closes it for U+0660–0669 and
U+06F0–06F9. Not `sed` — its `y` counts bytes and rejects multibyte digits;
not plain `awk` — mawk's `split(s,a,"")` is byte-wise. It tries python3, gawk,
then perl, and **says so** if none is present rather than passing digits through
silently. Digits inside a string literal are left alone.

## One driver

```
./Hindawi/urducc program.uhin        # read <شیلی …>, build
./Hindawi/urducc -s program.uhin     # generated host source only
./Hindawi/urducc -r program.c گرو    # reverse: C back into Urdu
```

Reads the shaili line and picks the chain. Reverse output passes through
`fltr_hi_ur` because the action strings emerge from the build as romenagri.

## Examples

`01-salaam` · `02-عاملی` recursion · `03-ساخت` structs, pointers, arrays and
`->` · `04-basic` nested loops in پراتھا · `05-lex` a lexical analyser in شبد ·
`06-asm` in یَنتر.

## The chain

```
program.uhin
  ↓ fixuninum      Devanagari digits
  ↓ fixarabnum     Arabic-Indic digits          ← the gap, closed
  ↓ fltr_ur_hi     Urdu → Hindi
  ↓ iconv | uni2acii | acii2cf                   romenagri
  ↓ h2c_urdu       keywords → C
  ↓ cc
```

## Known gaps — stated

- No `#line` directive, so a compiler error names the generated file's line,
  not your `.uhin`. Real, and recorded.
- `praatha`'s host is `qb2c`, which understands QuasiBASIC only.
- `soochee` has 36 rules and no Urdu yet in the retrieved transducer's own set.
