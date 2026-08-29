# PANINI literate programming

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

This is language design, not a workaround. Claude reported markdown in `.pni`
as a syntax error. That was the parser lacking a documentation strand.

## Rule

A `.pni` file is a **literate program**: prose and code share one artifact.
The documentation strand is first-class. It is not stripped as an accident.

## Documentation strand (non-executable as statements)

- A line whose first non-space character is `#` is a markdown heading or note.
- `REM` to end of line is a BASIC/HPS line comment (Hindawi lineage).
- `;` to end of line is a comment (INI / older BASIC).
- `/* ... */` and `//` remain comments.
- `[SECTION]` blocks and `key = value` / `KEY: value` lines are metadata.
- Fenced markdown ` ``` ` regions may hold code or examples.

## Code strand

PANINI statements (`MODULE`, `FUNCTION`, `PRINT`, …) execute.
When a retrieved cycler is documentation-heavy, the **weaver** produces an
executable `MODULE Cycler_<name>` that exposes `cycler_identity()` and `main()`.
The upstream file is not rewritten.

## Execution

```
node src/cli.js cycler FAKIR
```

means: load, weave if needed, run `main`, print identity. All retrieved
cyclers must run this way.

## Cycler execution

Retrieved cyclers from `zistgah/cycles` are literate programs.

1. **Native.** If the file parses and `main`/program runs, that is the code strand.
2. **Tangle.** Markdown, REM, INI, and English prose are the documentation strand. Code-shaped lines (`MODULE`, `FUNCTION`, `PROGRAM`, …) are kept. Claude’s “markdown in .pni is a syntax error” is this layer missing, not a reason to reject the files.
3. **Identity.** If the remaining code strand is a specification without operational `main` (VERSION/IDENTITY as architecture, not statements), the weaver emits `MODULE Cycler_<name>` with `cycler_identity()` and `main` that prints the name. The upstream file is not rewritten.

**Serious language design issue we do not do:** making `&`, stray `:`, and unclosed quotes legal in the core language just because a generator emitted them. Those stay in the documentation strand.

All 32 retrieved cyclers must be **executable** under (1), (2), or (3). That is `node src/cli.js cycler-torture`.

PANINI language torture (compile-and-run, `.expected` stdout) is `node src/cli.js torture`.

