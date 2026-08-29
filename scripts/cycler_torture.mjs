#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Torture: every retrieved cycler must execute.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execAll } from "../runtime/cycler_load.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "cyclers/upstream");
const all = await execAll(dir);
const report = {
  theorem: "CYCLER_TORTURE",
  corpus: "cyclers/upstream (zistgah/cycles, retrieved, not rewritten)",
  cases: all.length,
  executable: all.filter((c) => c.executable).length,
  native: all.filter((c) => c.parse_ok).length,
  tangled: all.filter((c) => c.tangle_kind === "tangled").length,
  identity: all.filter((c) => c.tangle_kind === "identity").length,
  fail: all.filter((c) => !c.executable).map((c) => ({ name: c.name, err: c.exec_error })),
  cyclers: all.map((c) => ({
    name: c.name,
    executable: c.executable,
    parse_ok: c.parse_ok,
    tangle_kind: c.tangle_kind,
  })),
};
report.green = report.fail.length === 0 && report.executable === report.cases && report.cases >= 32;
report.status = report.green ? "CYCLER TORTURE GREEN" : "NOT GREEN";
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.green ? 0 : 2;
