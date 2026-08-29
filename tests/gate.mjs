#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Must pass before zip. Keep this list short and load-bearing.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobs = ["tests/run.mjs", "tests/elseif.mjs", "tests/nb_run.mjs", "tests/app_frontends.mjs", "tests/shell.mjs", "tests/console_page.mjs", "tests/oop_fp.mjs", "tests/gate_cse.mjs", "tests/pspice.mjs", "tests/expert.mjs", "tests/iso_c.mjs", "tests/iso_cxx.mjs"];
let fail = 0;
for (const j of jobs) {
  const r = spawnSync(process.execPath, [path.join(root, j)], { encoding: "utf8" });
  const tail = (r.stdout + r.stderr).trim().split("\n").slice(-3).join(" | ");
  if (r.status !== 0) {
    fail++;
    console.log("FAIL", j, "exit", r.status, tail);
  } else console.log("ok  ", j, tail);
}
if (fail) {
  console.log("GATE FAILED", fail + "/" + jobs.length);
  process.exit(1);
}
console.log("GATE PASSED", jobs.length + "/" + jobs.length);
