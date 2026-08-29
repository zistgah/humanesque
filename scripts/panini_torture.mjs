#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * PANINI torture suite — same shape as c-testsuite single-exec:
 * one program, stdout must match .expected, exit 0.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSource } from "../runtime/interpreter.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "tests/torture/panini");

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pni")).sort();
const report = {
  theorem: "PANINI_TORTURE",
  corpus: "tests/torture/panini",
  cases: files.length,
  pass: 0,
  fail: 0,
  failures: [],
};

for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const expPath = path.join(dir, f + ".expected");
  const expected = fs.existsSync(expPath) ? fs.readFileSync(expPath, "utf8") : "";
  const orig = process.stdout.write.bind(process.stdout);
  process.stdout.write = () => true;
  try {
    const { runtime } = await runSource(src, f);
    const out = runtime.prints.join("\n") + (runtime.prints.length ? "\n" : "");
    if (out === expected) report.pass++;
    else {
      report.fail++;
      if (report.failures.length < 12) {
        report.failures.push({ case: f, expected: JSON.stringify(expected), got: JSON.stringify(out).slice(0, 200) });
      }
    }
  } catch (e) {
    report.fail++;
    if (report.failures.length < 12) {
      report.failures.push({ case: f, err: String(e.message || e).slice(0, 180) });
    }
  } finally {
    process.stdout.write = orig;
  }
}

report.green = report.fail === 0 && report.pass === report.cases && report.cases > 0;
report.status = report.green ? "PANINI TORTURE GREEN" : "NOT GREEN";
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.green ? 0 : 2;
