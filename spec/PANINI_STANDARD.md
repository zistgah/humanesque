# PANINI Language Standard — PANINI.STD.2026.08

Normative machine file: `PANINI.std.pni`  
Self-hosting spec (unchanged): `PANINI_SELF_HOSTING_SPEC.pni`  
Status table: `IMPLEMENTATION_STATUS.json`

## Conformance levels

| Level | Required |
|---|---|
| 0 | `PRINT`, integer arithmetic |
| 1 | `FUNCTION`, `RETURN`, `IF`, `WHILE` |
| 2 | PANINI-written lexer/parser subset, A=B=C self-host |
| 3 | Foreign `run_<lang>` frontends as specified below |

## Frontend contract

Every frontend module MUST export:

```
FUNCTION run_<lang>(source) -> { ok, value, frontend, token_count? }
```

and MUST be written in PANINI. Host compilers (`rustc`, `go`, `tsc`, `zig`) MAY be invoked with `--host` and MUST NOT be reported as the frontend.

## Implementation status

See `IMPLEMENTATION_STATUS.json`. All foreign frontends in this tree are **print-expression subsets** unless marked otherwise (Python/C are larger subsets).
