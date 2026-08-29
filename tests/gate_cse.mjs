#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSource } from "../runtime/interpreter.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "01_math.pni", "02_digital.pni", "03_coa.pni", "04_ds.pni", "05_algo.pni",
  "06_toc.pni", "07_compiler.pni", "08_os.pni", "09_dbms.pni", "10_networks.pni",
];
let n = 0, fail = 0;
for (const f of files) {
  n++;
  const src = fs.readFileSync(path.join(root, "src/panini/gate", f), "utf8");
  try {
    const r = await runSource(src, f);
    const v = r.result && (r.result.value !== undefined ? r.result.value : r.result);
    if (v !== 1) { fail++; console.log("FAIL", f, "got", v); }
    else console.log("ok  ", f);
  } catch (e) {
    fail++;
    console.log("FAIL", f, e.message);
  }
}
console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}  GATE CS official sections`);
process.exit(fail ? 1 : 0);
