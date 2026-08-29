# Hindawi local toolchain (2026)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

This is the downloadable compiler people used to get as Hindi C on DOS, modernized.

```
./configure --prefix=$HOME/.local
make
make check
make install
guru examples/hindi/guru.uhin
./guru        # binary next to the source / in build/
```

One kernel. Language and script are tables.

```
.uhin  →  language TSV  →  flatten (Brahmi) or urdu_map (Perso-Arabic)
       →  shaili lex (Guru=C, श्रेणी=C++, …)
       →  host  →  gcc -std=gnu11
```

Not `#define je if`. Identifiers may be UTF-8 (gcc GNU11). Keywords are retrieved shaili mappings.

## 22 scheduled languages

See `share/registry.json`.  

| Kind | Languages |
|---|---|
| Keyword TSV + script flatten | Hindi, Bengali, Assamese, Gujarati, Kannada, Malayalam, Marathi, Nepali, Odia, Punjabi, Sanskrit, Tamil, Telugu |
| Devanagari hub (Hindi guru keywords until a CSV is accepted) | Bodo, Dogri, Konkani, Maithili |
| Perso-Arabic, lossy | Urdu, Kashmiri, Sindhi |
| Awaiting retrieved maps | Manipuri (Meitei Mayek), Santali (Ol Chiki) — `deposits/csv` |

## 2004 vs 2026

| 2004 | 2026 |
|---|---|
| `guru file` on `file.hin` (ISCII) | `hincc file.uhin` |
| `iconv` UTF-16 + `uni2acii` + `flex` `h2c` | Node driver + the same tables |
| DOS gcc | host `gcc` / `g++` |
| Makefile per shaili | one `configure` / `Makefile` |

flex is optional. The kernel does not wait on it.

## Wrappers

- `hincc` — driver (`--lang` `--shaili` `--emit-only`)
- `guru` — `--shaili guru`
- `shraeni` — `--shaili shraeni` (C++)

## License

GPL-3.0-or-later. Hindawi name and logo remain the architect’s marks; the software is GPL.
