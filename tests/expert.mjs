#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSource } from "../runtime/interpreter.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cases = [
  ["bellman.pni", 3],
  ["gauss.pni", 213],
  ["rdp.pni", 10],
  ["kmeans.pni", 1],
];
let n = 0, fail = 0;
for (const [f, expect] of cases) {
  n++;
  const src = fs.readFileSync(path.join(root, "src/panini/expert", f), "utf8");
  try {
    const r = await runSource(src, f);
    const v = r.result && (r.result.value !== undefined ? r.result.value : r.result);
    if (v !== expect) { fail++; console.log("FAIL", f, "got", v, "want", expect); }
    else console.log("ok  ", f, "->", v);
  } catch (e) { fail++; console.log("FAIL", f, e.message); }
}
console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}  expert PANINI`);
process.exit(fail ? 1 : 0);
