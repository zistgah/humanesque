#!/usr/bin/env node
/**
 * BASIC/QB64 STANDARD GREEN — official QB64pe const/expression.bas vs .output, skip=0.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { qb64Run } from "../runtime/qb64.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "retrieved/standards/qb64pe");
const BASE = "https://raw.githubusercontent.com/QB64-Phoenix-Edition/QB64pe/main/tests/compile_tests/const/";
const LOCAL = "/tmp/suites/QB64pe/tests/compile_tests/const/";

async function pull(name) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, name);
  if (!(fs.existsSync(p) && fs.statSync(p).size > 20)) {
    try {
      const r = await fetch(BASE + name);
      if (r.ok) fs.writeFileSync(p, Buffer.from(await r.arrayBuffer()));
    } catch { /* offline */ }
    if (!(fs.existsSync(p) && fs.statSync(p).size > 20) && fs.existsSync(LOCAL + name)) {
      fs.copyFileSync(LOCAL + name, p);
    }
  }
  return p;
}

const srcP = await pull("expression.bas");
const outP = await pull("expression.output");
const src = fs.existsSync(srcP) ? fs.readFileSync(srcP, "utf8") : "";
const exp = fs.existsSync(outP) ? fs.readFileSync(outP, "utf8").trim().split(/\n/).map((l) => l.trim()) : [];
const got = qb64Run(src).prints.map((v) => String(v).trim());
let pass = 0;
const fails = [];
for (let i = 0; i < exp.length; i++) {
  const ok = got[i] === exp[i] || Number(got[i]) === Number(exp[i]);
  if (ok) pass++;
  else fails.push({ i, got: got[i], want: exp[i] });
}
const report = {
  language: "basic/qb64",
  issuing_body: "QB64 Phoenix Edition",
  suite: "tests/compile_tests/const/expression.bas vs expression.output",
  n: exp.length,
  pass,
  skip: 0,
  skip0: fails.length === 0 && exp.length > 0,
  fails,
  standard_green: fails.length === 0 && exp.length > 0,
  note: "Not ECMA-116. Not VB.NET. Named QB64pe const-expression extract.",
};
fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data/qb64-std-green.json"), JSON.stringify(report, null, 2));
console.log("QB64_STD_GREEN", pass + "/" + exp.length, "skip0=" + report.skip0);
process.exit(0);
