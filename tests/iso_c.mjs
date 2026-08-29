#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Progress gate: first 36 c-testsuite cases. Not ISO GREEN.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const r = spawnSync(process.execPath, [path.join(root, "scripts/iso_c_harness.mjs")], {
  encoding: "utf8", env: { ...process.env, ISO_C_LIMIT: "36" },
});
const j = JSON.parse(r.stdout.slice(r.stdout.indexOf("{")));
console.log(j.status);
if (j.panini.fail !== 0) {
  console.log("FAIL iso-c progress", j);
  process.exit(1);
}
console.log("ok   iso-c", j.panini.pass, "pass /", j.panini.fail, "fail /", j.panini.skip, "skip of", j.cases, "(NOT GREEN)");
process.exit(0);
