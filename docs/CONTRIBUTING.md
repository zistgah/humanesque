# Contributing to PANINI

Copyright (C) 1993–2026 Abhishek Choudhary  
GPL-3.0-or-later

Retrieve, do not reconstruct. The spine is canonical. Workbench chrome is frozen. Frontends come from `docs/data/frontends.json`. Do not invent keyword maps in `retrieved/`.

## Before you write a file

1. Read `factory/REGISTRY.json`. Reuse first.
2. Frozen components (`freeze: true`) require `factory/DELIBERATION.md`.
3. Do not edit `workbench.html`. Append a frontend object to `data/frontends.json`.
4. STANDARD GREEN ⇔ issuing-body spec ∧ that body’s executable suite skip=0. Homemade 20-case is CORE GREEN only.
5. ISO GREEN ⇔ STANDARD GREEN ∧ the issuing body is ISO/IEC, ANSI/INCITS, IEEE, ECMA-as-ISO, POSIX, or NIST.

## Pull request correctness

A PR is **correct** when and only when:

```
node scripts/pr_gate.mjs          # exit 0
```

The gate checks, automatically:

| Check | Pass |
|---|---|
| AyeBIOS 16-bit guest | boots offline; text contains `AYEBIOS`; waits on INT 16h |
| VGA Mode 13h | key `v` → mode 0x13; 3200 pixels value 14 |
| Floppy | 1.44 MB; sector 0 signature `55 AA`; hex poke round-trips |
| emu.html | no `copy.sh` / `unpkg` network guest |
| Vesoha Hindi | one TSV per frontend; every catalog keyword present |
| STANDARD GREEN index | n=45, standard_green=45, core=0 |
| Zip packing contract | no `.gguf` / `.wasm` / `.pdf` in the delivery zip if present |

Touched frontends must keep their named official extract skip=0:

```
node scripts/core_std_green.mjs
node scripts/remaining_std_green.mjs
```

Those harnesses report skip=0. Do not relabel a homemade suite as STANDARD GREEN.

## What humans still sign

Named GAPs stay named (full ACATS, kotlinc box, Swift stdlib, …). The gate does not claim them. A reviewer confirms the PR did not silently promote a GAP.

## License / provenance

Every new file: copyright line, SPDX `GPL-3.0-or-later`, origin (ORIGINAL / PUBLIC_SPECIFICATION / RETRIEVED). No proprietary SDK source.

## Local run

```
node src/cli.js run examples/hello.pni
node src/cli.js binary examples/factorial.pni --out factorial   # local backend
node src/cli.js test-pr
```
