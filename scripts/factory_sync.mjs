#!/usr/bin/env node
/**
 * One-way canonical → adapter sync. Does not touch freeze:true sources.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** from is canonical. to is the adapter. Never reverse. */
const COPIES = [
  ["src/panini/frontends/c.pni", "docs/engine/interp/c.pni"],
  ["src/panini/frontends/cpp.pni", "docs/engine/interp/cpp.pni"],
  ["src/panini/frontends/python.pni", "docs/engine/interp/python.pni"],
  ["src/panini/frontends/rust.pni", "docs/engine/interp/rust.pni"],
  ["src/panini/frontends/go.pni", "docs/engine/interp/go.pni"],
  ["src/panini/frontends/julia.pni", "docs/engine/interp/julia.pni"],
  ["src/panini/frontends/typescript.pni", "docs/engine/interp/typescript.pni"],
  ["src/panini/frontends/javascript.pni", "docs/engine/interp/javascript.pni"],
  ["src/panini/frontends/zig.pni", "docs/engine/interp/zig.pni"],
  ["src/panini/frontends/lua.pni", "docs/engine/interp/lua.pni"],
  ["src/panini/frontends/fortran.pni", "docs/engine/interp/fortran.pni"],
  ["src/panini/frontends/pascal.pni", "docs/engine/interp/pascal.pni"],
  ["src/panini/frontends/basic.pni", "docs/engine/interp/basic.pni"],
  ["src/panini/frontends/java.pni", "docs/engine/interp/java.pni"],
  ["src/panini/frontends/haskell.pni", "docs/engine/interp/haskell.pni"],
  ["src/panini/frontends/smalltalk.pni", "docs/engine/interp/smalltalk.pni"],
  ["src/panini/frontends/lisp.pni", "docs/engine/interp/lisp.pni"],
  ["src/panini/frontends/prolog.pni", "docs/engine/interp/prolog.pni"],
  ["runtime/qb64.js", "docs/engine/interp/qb64.js"],
  ["runtime/vga.js", "docs/engine/interp/vga.js"],
  ["runtime/js262.js", "docs/engine/interp/js262.js"],
  ["runtime/steval.js", "docs/engine/interp/steval.js"],
  ["runtime/hseval.js", "docs/engine/interp/hseval.js"],
  ["runtime/cleval.js", "docs/engine/interp/cleval.js"],
  ["runtime/pleval.js", "docs/engine/interp/pleval.js"],
  ["runtime/ccpp.js", "docs/engine/interp/ccpp.js"],
  ["runtime/values.js", "docs/engine/interp/values.js"],
  ["runtime/env.js", "docs/engine/interp/env.js"],
  ["runtime/artifacts.js", "docs/engine/interp/artifacts.js"],
  ["runtime/clower.js", "docs/engine/interp/clower.js"],
  ["runtime/gnuc.js", "docs/engine/interp/gnuc.js"],
  ["runtime/cpplower.js", "docs/engine/interp/cpplower.js"],
  ["runtime/stdlower.js", "docs/engine/interp/stdlower.js"],
  ["runtime/cinterp.js", "docs/engine/interp/cinterp.js"],
  ["compiler/ast.js", "docs/engine/interp/ast.js"],
  ["compiler/lexer.js", "docs/engine/interp/lexer.js"],
  ["compiler/parser.js", "docs/engine/interp/parser.js"],
  ["compiler/tokens.js", "docs/engine/interp/tokens.js"],
  ["factory/languages.json", "docs/data/languages.json"],
  ["factory/README.md", "docs/FACTORY.md"],
  ["factory/DELIBERATION.md", "docs/DELIBERATION.md"],
  ["CONTRACT.md", "docs/CONTRACT.md"],
  ["CONTEXT.md", "docs/CONTEXT.md"],
];

let n = 0;
for (const [from, to] of COPIES) {
  const src = path.join(root, from);
  const dst = path.join(root, to);
  if (!fs.existsSync(src)) {
    console.log("missing canonical", from);
    continue;
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const a = fs.readFileSync(src);
  const b = fs.existsSync(dst) ? fs.readFileSync(dst) : null;
  if (b && Buffer.compare(a, b) === 0) continue;
  fs.writeFileSync(dst, a);
  n++;
  console.log("synced", from, "→", to);
}
console.log("factory_sync", n, "updated");
