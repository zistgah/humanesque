#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Delivery zip. Lean: no ISO PDFs, no GGUF, no WASM.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || "/tmp/panini.zip";
const py = path.join(root, "scripts", "pack_zip.py");
const r = spawnSync("python3", [py, out], { encoding: "utf8" });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
process.exit(r.status || 0);
