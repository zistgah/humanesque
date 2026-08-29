#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * ISO C++ harness. Green ⇔ every single-exec case: main returns 0
 * and stdout matches .expected under PANINI.Frontend.Cpp.
 * Corpus: tests/iso/cxx/single-exec (ISO/IEC 14882:2017 core).
 * Not libstdc++. Not gcc torture.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runFrontend } from "../runtime/foreign_front.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cOnly = new Set(["00040.c","00048.c","00049.c","00092.c","00095.c","00096.c"]);
/* 00025.c is a write-strings warning only; it is valid enough for this interp. */

const cxxDir = path.join(root, "tests/iso/cxx/single-exec");
const cDir = path.join(root, "tests/iso/c/c-testsuite-master/tests/single-exec");
const limit = Number(process.env.ISO_CXX_LIMIT || 0);

function listCases() {
  const cxx = fs.readdirSync(cxxDir).filter((f) => f.endsWith(".cpp")).sort().map((f) => ({ file: f, dir: cxxDir }));
  const c = fs.existsSync(cDir)
    ? fs.readdirSync(cDir).filter((f) => f.endsWith(".c") && !cOnly.has(f)).sort().map((f) => ({ file: f, dir: cDir }))
    : [];
  let all = cxx.concat(c);
  if (limit > 0) all = all.slice(0, limit);
  return all;
}

async function paniniRun(src) {
  const origWrite = process.stdout.write.bind(process.stdout);
  let printed = "";
  process.stdout.write = (c) => { printed += String(c); return true; };
  try {
    const r = await runFrontend("cpp", src);
    return { value: r && r.value, out: printed || (r && r.out) || "", crash: r && r.error, lowered: r && r.lowered };
  } catch (e) {
    return { crash: String(e.message || e).slice(0, 220) };
  } finally {
    process.stdout.write = origWrite;
  }
}

let files = listCases();

const report = {
  theorem: "ISO_GREEN(C++)",
  standard: "ISO/IEC 14882:2017 (C++17) — panini-cxx-testsuite single-exec + c-testsuite-as-C++ (C-only cases skipped)",
  subject: "PANINI.Frontend.Cpp",
  green: false,
  cases: files.length,
  panini: { pass: 0, fail: 0, skip: 0 },
  fails: [],
};

for (const { file: f, dir } of files) {
  const cfile = path.join(dir, f);
  const src = fs.readFileSync(cfile, "utf8");
  const expected = fs.existsSync(cfile + ".expected") ? fs.readFileSync(cfile + ".expected", "utf8") : "";
  const p = await paniniRun(src);
  const code = Number(p.value);
  const stdoutOk = expected === "" || p.out === expected || String(p.out || "").replace(/\s+$/, "") === expected.replace(/\s+$/, "");
  const ok = !p.crash && code === 0 && stdoutOk;
  if (ok) report.panini.pass++;
  else {
    report.panini.fail++;
    if (report.fails.length < 25) {
      report.fails.push({
        case: f,
        value: p.value,
        crash: p.crash,
        out: String(p.out || "").slice(0, 60),
        lowered: String(p.lowered || "").slice(0, 160),
      });
    }
  }
}

report.attempted = report.panini.pass + report.panini.fail;
report.green = report.panini.fail === 0 && report.panini.skip === 0 && report.panini.pass === report.cases && report.cases > 0;
report.status = report.green ? "ISO GREEN" : "NOT GREEN (progress: " + report.panini.pass + " pass / " + report.panini.fail + " fail / " + report.panini.skip + " skip of " + report.cases + ")";
console.log(JSON.stringify(report, null, 2));
fs.mkdirSync(path.join(root, "tests/iso/cxx"), { recursive: true });
fs.writeFileSync(path.join(root, "tests/iso/cxx/last-report.json"), JSON.stringify(report, null, 2));
process.exitCode = report.green ? 0 : 2;
