#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * STANDARD GREEN harness. Named corpus, skip=0.
 * Usage: node scripts/std_green_harness.mjs python|rust|go|julia
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runFrontend } from "../runtime/foreign_front.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lang = (process.argv[2] || "python").toLowerCase();
const META = {
  python: { ext: ".py", subject: "PANINI.Frontend.Python", standard: "Python Language Reference 3.11 — panini-python-testsuite single-exec" },
  rust: { ext: ".rs", subject: "PANINI.Frontend.Rust", standard: "Rust Reference (edition 2021) — panini-rust-testsuite single-exec" },
  go: { ext: ".go", subject: "PANINI.Frontend.Go", standard: "Go spec (gc) — panini-go-testsuite single-exec" },
  julia: { ext: ".jl", subject: "PANINI.Frontend.Julia", standard: "Julia 1.10 language — panini-julia-testsuite single-exec" },
  typescript: { ext: ".ts", subject: "PANINI.Frontend.TypeScript", standard: "ECMA-262 / TS 5 — panini-ts-testsuite single-exec" },
  javascript: { ext: ".js", subject: "PANINI.Frontend.JavaScript", standard: "ECMA-262 — panini-js-testsuite single-exec" },
  zig: { ext: ".zig", subject: "PANINI.Frontend.Zig", standard: "Zig language ref — panini-zig-testsuite single-exec" },
  lua: { ext: ".lua", subject: "PANINI.Frontend.Lua", standard: "Lua 5.4 — panini-lua-testsuite single-exec" },
  fortran: { ext: ".f90", subject: "PANINI.Frontend.Fortran", standard: "Fortran 95 subset — panini-fortran-testsuite single-exec" },
  pascal: { ext: ".pas", subject: "PANINI.Frontend.Pascal", standard: "ISO 7185 subset — panini-pascal-testsuite single-exec" },
  basic: { ext: ".bas", subject: "PANINI.Frontend.BASIC", standard: "Hindawi Shaili BASIC subset — panini-basic-testsuite single-exec" },
};
const meta = META[lang];
if (!meta) {
  console.log(JSON.stringify({ error: "unknown lang " + lang }));
  process.exit(0);
}
const suite = path.join(root, "tests/std", lang, "single-exec");

async function paniniRun(src) {
  const origWrite = process.stdout.write.bind(process.stdout);
  let printed = "";
  process.stdout.write = (c) => { printed += String(c); return true; };
  try {
    const r = await runFrontend(lang, src);
    return { value: r && r.value, out: printed || (r && r.out) || "", crash: r && r.error, lowered: r && r.lowered };
  } catch (e) {
    return { crash: String(e.message || e).slice(0, 220) };
  } finally {
    process.stdout.write = origWrite;
  }
}

const files = fs.readdirSync(suite).filter((f) => f.endsWith(meta.ext)).sort();
const report = {
  theorem: "STANDARD_GREEN(" + lang + ")",
  standard: meta.standard,
  subject: meta.subject,
  green: false,
  cases: files.length,
  panini: { pass: 0, fail: 0, skip: 0 },
  fails: [],
};

for (const f of files) {
  const fp = path.join(suite, f);
  const src = fs.readFileSync(fp, "utf8");
  const expected = fs.existsSync(fp + ".expected") ? fs.readFileSync(fp + ".expected", "utf8") : "";
  const p = await paniniRun(src);
  const code = Number(p.value);
  const stdoutOk = expected === "" || String(p.out || "").replace(/\s+$/, "") === expected.replace(/\s+$/, "");
  const ok = !p.crash && code === 0 && stdoutOk;
  if (ok) report.panini.pass++;
  else {
    report.panini.fail++;
    if (report.fails.length < 20) {
      report.fails.push({ case: f, value: p.value, crash: p.crash, out: String(p.out || "").slice(0, 40), lowered: String(p.lowered || "").slice(0, 160) });
    }
  }
}
report.attempted = report.panini.pass + report.panini.fail;
report.green = report.panini.fail === 0 && report.panini.skip === 0 && report.panini.pass === report.cases && report.cases > 0;
report.status = report.green ? "STANDARD GREEN" : "NOT GREEN (progress: " + report.panini.pass + " pass / " + report.panini.fail + " fail / " + report.panini.skip + " skip of " + report.cases + ")";
console.log(JSON.stringify(report, null, 2));
fs.mkdirSync(path.join(root, "tests/std", lang), { recursive: true });
fs.writeFileSync(path.join(root, "tests/std", lang, "last-report.json"), JSON.stringify(report, null, 2));
process.exitCode = 0;
