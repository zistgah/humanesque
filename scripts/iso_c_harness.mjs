#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * ISO C harness. Green ⇔ every non-skipped single-exec case: main returns 0
 * and stdout matches .expected under PANINI.Frontend.C.
 * Corpus: c-testsuite. Not Cadence. Not GATE.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runFrontend } from "../runtime/foreign_front.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const local = path.join(root, "tests/iso/c/c-testsuite-master/tests/single-exec");
const limit = Number(process.env.ISO_C_LIMIT || 0);

function suiteDir() {
  if (fs.existsSync(local)) return local;
  throw new Error("c-testsuite single-exec missing");
}

async function paniniRun(src) {
  const origWrite = process.stdout.write.bind(process.stdout);
  let printed = "";
  process.stdout.write = (c) => { printed += String(c); return true; };
  try {
    const r = await runFrontend("c", src);
    return { value: r && r.value, out: printed || (r && r.out) || (r && r.prints ? r.prints.join("") : ""), frontend: r && r.frontend, err: r && r.error };
  } catch (e) {
    return { crash: String(e.message || e).slice(0, 180) };
  } finally {
    process.stdout.write = origWrite;
  }
}

const suite = suiteDir();
let files = fs.readdirSync(suite).filter((f) => f.endsWith(".c")).sort();
if (limit > 0) files = files.slice(0, limit);

const report = {
  theorem: "ISO_GREEN(C)",
  standard: "ISO/IEC 9899:2018 (C17) — corpus c-testsuite single-exec",
  subject: "PANINI.Frontend.C",
  green: false,
  cases: files.length,
  panini: { pass: 0, fail: 0, skip: 0 },
  fails: [],
};

for (const f of files) {
  const cfile = path.join(suite, f);
  const src = fs.readFileSync(cfile, "utf8");
  const expected = fs.existsSync(cfile + ".expected") ? fs.readFileSync(cfile + ".expected", "utf8") : "";
  const p = await paniniRun(src);
  const code = Number(p.value);
  const stdoutOk = expected === "" || p.out === expected || p.out.replace(/\s+$/, "") === expected.replace(/\s+$/, "");
  const ok = !p.crash && code === 0 && stdoutOk;
  if (ok) report.panini.pass++;
  else {
    report.panini.fail++;
    if (report.fails.length < 20) {
      report.fails.push({ case: f, value: p.value, crash: p.crash, out: (p.out || "").slice(0, 40) });
    }
  }
}

report.attempted = report.panini.pass + report.panini.fail;
report.green = report.panini.fail === 0 && report.panini.skip === 0 && report.panini.pass === report.cases && report.cases > 0;
report.status = report.green ? "ISO GREEN" : "NOT GREEN (progress: " + report.panini.pass + " pass / " + report.panini.fail + " fail / " + report.panini.skip + " skip of " + report.cases + ")";
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.green ? 0 : 2;
fs.mkdirSync(path.join(root, "tests/iso/c"), { recursive: true });
fs.writeFileSync(path.join(root, "tests/iso/c/last-report.json"), JSON.stringify(report, null, 2));
