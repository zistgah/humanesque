# PANINI

**Read first (this is the contract for every collaborator, human or AI):**

1. [`AGENTS.md`](AGENTS.md)
2. [`CONTRACT.md`](CONTRACT.md)
3. [`CONTEXT.md`](CONTEXT.md)

---

# tree-rev: 2026.08.29
# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later


Self-hosting general-purpose computational language and execution environment.

Version: **0.1.0**  
License: **GPL-3.0-or-later**  
Copyright: **© 1993-2026 Abhishek Choudhary**  
Implementation: **JavaScript Stage-0 bootstrap**  
Workbench editor: **Monaco (MIT, Microsoft)** — see `THIRD_PARTY.md`

PANINI can express computation, artifacts, workflows (cyclers), agents, provenance, and — by construction — the language needed to implement PANINI itself.

## Status

This repository is the Stage-0 external bootstrap required by the constitution:

| Stage | What | Where |
| --- | --- | --- |
| 0 | JS host + IR VM | `compiler/`, `runtime/` |
| 1 | Lexer, parser, AST in PANINI | `src/panini/lexer.pni`, `parser.pni` |
| 2 | Typechecker in PANINI | `src/panini/typechecker.pni` |
| 3–4 | IR, optimize, codegen in PANINI | `src/panini/ir.pni`, `compiler.pni` |
| 5–6 | Self-compile; A = B = C | `node scripts/selfhost.mjs` |

Stage 6 is a **fixed point on the compiler subset**: 36 functions, IR generations identical. The JS host still parses a larger grammar than the self-hosted parser.

## Quick start

Standing requirements: **`REQUIREMENTS.md`**.  
License: **GPL-3.0-or-later** (not MIT).  
Workbench: **`docs/`** — Monaco (MIT) + Blockly (Apache-2.0). Terminal is VT100.  
Pages publishes `docs/`.

Requires Node.js 18+.

```bash
node src/cli.js run examples/hello.pni
node src/cli.js run examples/factorial.pni
node tests/run.mjs
node scripts/bootstrap.mjs
node scripts/selfhost.mjs
```

CLI:

```
node src/cli.js lex <file.pni>
node src/cli.js parse <file.pni>
node src/cli.js typecheck <file.pni>
node src/cli.js compile <file.pni> --target json
node src/cli.js run <file.pni>
node src/cli.js repl
```

## Language sketch

```
FUNCTION factorial(n:Int) -> Int
    IF n <= 1
        RETURN 1
    ELSE
        RETURN n * factorial(n - 1)
    END
END

FUNCTION main() -> Int
    PRINT factorial(6)
    RETURN 0
END
```

Blocks close with `END`. Multiple paradigms are representable; this bootstrap executes the imperative/functional core and registers declarative forms (artifacts, cyclers, constitution) as data.

## Layout

See **`LAYOUT.md`**. GitHub Pages = `docs/` (not `website/`).

```
spec/        constitution
src/         CLI + PANINI-written frontends
compiler/    Stage-0 JS
runtime/     interpreter, shaili, gurmukhi, romenagri
retrieved/   READ-ONLY Hindawi / Romenagri / APCISR / Punjabi maps
docs/        site: index, view.html, hindawi.html, punjabi.html, workbench
examples/    hello.pni, punjabi_hello.uhin
```

## Invariants honored by this bootstrap

- Artifacts and FILE blocks are first-class and carry MIME + provenance
- Epistemic status is explicit in the provenance module
- Model providers are adapters (`ASK` is a stub, not constitutive)
- GENIE / FAKIR / CHARBAGH are cycler libraries, not the language
- Simulation and experiment are distinct statuses
- Untagged claims cannot be canonicalized

## License

GPL-3.0-or-later. See `LICENSE`. Copyright (C) 1993-2026 Abhishek Choudhary.
