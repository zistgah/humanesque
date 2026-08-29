#!/usr/bin/env node
/**
 * Fortran STANDARD GREEN attempt — official gcc gfortran.dg / fortran-torture execute.
 * Homemade STOP tests are CORE GREEN only. This reporter never badges STANDARD GREEN
 * unless an official { dg-do run } file executes skip=0 under PANINI.Frontend.Fortran.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fortranToC } from "../runtime/stdlower.js";
import { cinterp } from "../runtime/cinterp.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "retrieved/standards/gfortran-dg");
const DG = "https://raw.githubusercontent.com/gcc-mirror/gcc/releases/gcc-13.2.0/gcc/testsuite/gfortran.dg/";
const TORTURE = "https://raw.githubusercontent.com/gcc-mirror/gcc/releases/gcc-13.2.0/gcc/testsuite/gfortran.fortran-torture/execute/";
const LOCAL_T = "/tmp/gfortran-torture/";
const LOCAL_DG = "/tmp/gfortran-dg/";

async function pull(base, name, localDir) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, name);
  if (!(fs.existsSync(p) && fs.statSync(p).size > 20)) {
    try {
      const r = await fetch(base + name);
      if (r.ok) fs.writeFileSync(p, Buffer.from(await r.arrayBuffer()));
    } catch { /* offline */ }
    if (!(fs.existsSync(p) && fs.statSync(p).size > 20) && localDir && fs.existsSync(path.join(localDir, name))) {
      fs.copyFileSync(path.join(localDir, name), p);
    }
  }
  return p;
}

await pull(DG, "pr20124.f90", LOCAL_DG);
const emptyif = await pull(TORTURE, "emptyif.f90", LOCAL_T);
const arithif = await pull(TORTURE, "arithmeticif.f90", LOCAL_T);
const pr20124 = path.join(dir, "pr20124.f90");

function leftoverFortran(c) {
  const hits = [];
  if (/\bimplicit\b/i.test(c)) hits.push("implicit");
  if (/\belseif\b/i.test(c)) hits.push("elseif");
  if (/\bendif\b/i.test(c)) hits.push("endif");
  if (/\bgoto\b/i.test(c)) hits.push("goto");
  if (/\bwrite\s*\(/i.test(c)) hits.push("write");
  if (/\bcharacter\s*\*/i.test(c)) hits.push("character*");
  if ((c.match(/\bint main\s*\(/g) || []).length > 1) hits.push("dummy-main-appended");
  return hits;
}

function runF(src) {
  const c = fortranToC(src);
  const left = leftoverFortran(c);
  if (left.length) return { ok: false, error: "unlowered: " + left.join(","), c };
  try {
    const v = cinterp(c);
    return { ok: (v | 0) === 0, value: v, c };
  } catch (e) {
    return { ok: false, error: String(e.message || e), c };
  }
}

const official = [];
for (const p of [emptyif, arithif, pr20124]) {
  if (fs.existsSync(p) && fs.statSync(p).size > 20) {
    const src = fs.readFileSync(p, "utf8");
    official.push({ file: path.basename(p), ...runF(src) });
  }
}

const pass = official.filter((t) => t.ok).length;
const report = {
  language: "fortran",
  issuing_body: "ISO/IEC JTC1/SC22/WG5 (N2146) + GCC gfortran.dg / fortran-torture execute",
  suite: "official { dg-do run } / torture execute (emptyif.f90, arithmeticif.f90, pr20124.f90)",
  n: official.length,
  pass,
  skip: 0,
  skip0: false,
  fails: official.filter((t) => !t.ok).map((t) => ({ file: t.file, error: t.error, value: t.value })),
  standard_green: false,
  note: "Spec retrieved (N2146). Official execute files retrieved. PANINI.Frontend.Fortran does not run them skip=0 (elseif/arithmetic-IF/format I/O). Homemade tests/std/fortran is CORE GREEN only. Do not badge STANDARD GREEN.",
};
fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data/fortran-std-green.json"), JSON.stringify(report, null, 2));
console.log("FORTRAN", pass + "/" + official.length, "STANDARD_GREEN=false (gfortran execute GAP)");
process.exit(0);
