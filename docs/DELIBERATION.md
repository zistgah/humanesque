# Unfreeze protocol

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

A **FROZEN** component in `factory/REGISTRY.json` is not edited because it
looks ugly or because a later prompt restates it.

To touch one:

1. Name the component id and path.
2. State why the freeze is wrong (bug, STANDARD GREEN regression, security).
3. Append a dated entry below.
4. Run `node scripts/factory_scan.mjs --accept-hash <id>` after the edit so
   the new hash is the freeze. That is a deliberate re-lock, not a silent drift.

## Log

| Date | id | Why |
|---|---|---|
| 2026-08-29 | python-frontend | Architect: take Python to STANDARD GREEN. Official suite is CPython 3.12 Lib/test language files, not homemade 20-case. Unfreeze python.pni to add unary/**/hex/bitwise/ternary/False required by retrieved test_unary.py + test_bool.py + test_grammar.py self-contained asserts. Re-lock after. |
