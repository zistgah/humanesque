# Pages interp adapters

Copyright (C) 1993-2026 Abhishek Choudhary

Canonical sources and how this folder is filled:

- `*.pni` frontends ← `src/panini/frontends/` (factory_sync)
- `clower.js` `gnuc.js` `cpplower.js` `stdlower.js` `cinterp.js` ← `runtime/`
- `interpreter.js` is a **named** adapter: process shim + `./parser.js` (do not overwrite from runtime/)
- `builtins.js` is a **named** Pages subset (no Node toolchain) plus CLOWER/CINTERP so frozen `c.pni` runs
- `host.js` `wasm.pni` live only here

See `factory/CORRELATION.md`.
