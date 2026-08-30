# Test plan — automatic and manual

Copyright (C) 1993–2026 Abhishek Choudhary  
GPL-3.0-or-later

This is the plan that `scripts/pr_gate.mjs` executes, plus the manual CRT/workbench checks a reviewer still performs.

## Automatic (CI / `node scripts/pr_gate.mjs`)

| ID | Requirement | How |
|---|---|---|
| T-EMU-01 | x86 guest loads without a CDN | `emu.html` has no copy.sh / unpkg |
| T-EMU-02 | AyeBIOS POST + boot sector | `PANINI_X86.boot` text contains `AYEBIOS`, `waiting=key` |
| T-EMU-03 | Floppy signature | bytes 510–511 = `55 AA`, length 1_474_560 |
| T-EMU-04 | Floppy editor poke | write sector 1, read back |
| T-EMU-05 | VGA Mode 13h | push `v`, mode=0x13, 3200 pixels = 14 |
| T-EMU-06 | VT100 text mode | mode 3, 80×25 dump is a string |
| T-VES-01 | 45 Hindi tables | `vesoha/hindi/<id>.tsv` exists for every frontend id |
| T-VES-02 | keyword coverage | every `catalog.ts` keywords[] row is in that TSV |
| T-SG-01 | STANDARD GREEN index | n=45, standard_green=45, core=0, iso_green=16 |
| T-CLI-01 | CLI help lists binary/gcc | `node src/cli.js help` |
| T-PKG-01 | package command | `node src/cli.js package --help` path exists |
| T-REQ-01 | requirements JSON | `data/requirements.json` lists this campaign’s IDs |

Exit code: **0 pass / 1 fail**. This is the PR gate. It is allowed to fail. (The older `tests/test.mjs always exits 0` rule is the uploader harness, not this gate.)

## Manual (reviewer, live preview)

| ID | Requirement | How |
|---|---|---|
| M-01 | Menu present | Home: Estate / Machine / Languages |
| M-02 | x86 guest CRT | Machine → x86 guest → Boot. Hindi banner visible. Type `v`, gold bar. Floppy tab: edit hex, Apply, Boot. |
| M-03 | Console VT100 | Console · VFS still paints the glass. |
| M-04 | Workbench C | Run C sample, result 42. |
| M-05 | Vesoha | vesoha.html lists 45 links; open `c.tsv`, 29 Hindi C rows. |
| M-06 | Packages | Pack C → WASM; download `.panini-pkg.json`. |
| M-07 | Zip | local.html download, and the zip surfaced in chat. |
| M-08 | Local binary | On a machine with gcc: `panini binary examples/factorial.pni --out factorial`. |

## Mapping to standing requirements

See `REQUIREMENTS.md` and `data/requirements.json`. New IDs this campaign:

- REQ-220 VT100 (already standing)
- REQ-EMU AyeBIOS 16-bit guest + floppy editor, offline
- REQ-VES Vesoha Hindi tables for all frontends
- REQ-LOC local backend (`panini binary` / gcc) in addition to WASM
- REQ-PKG web package format `panini-pkg/v1`
- REQ-CI PR gate `scripts/pr_gate.mjs`
