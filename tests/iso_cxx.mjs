#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const r = spawnSync(process.execPath, [path.join(root, "scripts/iso_cxx_harness.mjs")], { encoding: "utf8" });
const idx = r.stdout.lastIndexOf("{");
const j = JSON.parse(r.stdout.slice(idx));
console.log(j.status);
if (!j.green) {
  console.log("FAIL iso-cxx", j.panini, j.fails);
  process.exit(1);
}
console.log("ok   iso-cxx", j.panini.pass, "/", j.cases, "ISO GREEN");
process.exit(0);
