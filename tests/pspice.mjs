#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSource } from "../runtime/interpreter.js";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = fs.readFileSync(path.join(root, "src/panini/pspice.pni"), "utf8");
const r = await runSource(src, "pspice.pni");
const v = r.result && (r.result.value !== undefined ? r.result.value : r.result);
if (v !== 1) {
  console.log("FAIL pspice", v);
  process.exit(1);
}
console.log("ok   pspice DC/Thevenin/Norton/mesh/RC  (PANINI, not Cadence)");
process.exit(0);
