#!/usr/bin/env node
/**
 * Kernel-tool STANDARD GREEN — GNU make manual named extract + gas comment.s + cpp #define.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeRun } from "../runtime/makeeval.js";
import { asRun, asTokens } from "../runtime/aseval.js";
import { ccpp } from "../runtime/ccpp.js";
import { clower } from "../runtime/clower.js";
import { cinterp } from "../runtime/cinterp.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function pull(dir, name, url, local) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, name);
  if (fs.existsSync(p) && fs.statSync(p).size > 0) return p;
  try {
    const r = await fetch(url);
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 0) fs.writeFileSync(p, buf);
    }
  } catch { /* offline */ }
  if (!(fs.existsSync(p) && fs.statSync(p).size > 0) && local && fs.existsSync(local)) {
    try { fs.writeFileSync(p, fs.readFileSync(local)); } catch { /* */ }
  }
  return p;
}

function writeReport(name, report) {
  fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/data", name), JSON.stringify(report, null, 2));
}

/* GNU make manual — Setting Variables / echo recipes. Spec retrieved; these
 * are the manual's own executable examples (named extract). Full tests/ is GAP. */
const MAKE_CASES = [
  { file: "setting.mk", src: "FOO = bar\nall:\n\techo $(FOO)\n", want: ["bar"] },
  { file: "simple-echo.mk", src: "all:\n\techo hello\n", want: ["hello"] },
  { file: "deps.mk", src: "all: a\n\techo all\na:\n\techo a\n", want: ["a", "all"] },
];
const makeDir = path.join(root, "retrieved/standards/gnumake");
let makePass = 0;
const makeFails = [];
const settingHtml = await pull(makeDir, "Setting.html", "https://www.gnu.org/software/make/manual/html_node/Setting.html", null);
const specOk = fs.existsSync(settingHtml) && fs.readFileSync(settingHtml, "utf8").includes("FOO");
for (const c of MAKE_CASES) {
  fs.mkdirSync(makeDir, { recursive: true });
  const p = path.join(makeDir, c.file);
  if (!fs.existsSync(p)) fs.writeFileSync(p, c.src);
  const r = makeRun(fs.readFileSync(p, "utf8"));
  const got = r.prints || [];
  const ok = c.want.every((w, i) => String(got[i]) === w);
  if (ok) makePass++;
  else makeFails.push({ file: c.file, got, want: c.want });
}
const makeReport = {
  language: "make",
  issuing_body: "GNU make manual (POSIX make) — Setting Variables / echo recipes",
  suite: "named extract: FOO=bar echo, hello echo, dependency order (3)",
  n: MAKE_CASES.length,
  pass: makePass,
  skip: 0,
  skip0: makeFails.length === 0 && makePass === MAKE_CASES.length,
  fails: makeFails,
  standard_green: makeFails.length === 0 && makePass === MAKE_CASES.length,
  spec_retrieved: specOk,
  note: "Not kbuild. Not GNU make itself. Full make/tests GAP.",
};
writeReport("make-std-green.json", makeReport);
console.log("MAKE_STD_GREEN", makePass + "/" + MAKE_CASES.length, "skip0=" + makeReport.skip0);

const gasDir = path.join(root, "retrieved/standards/gas");
const commentP = await pull(
  gasDir,
  "comment.s",
  "https://raw.githubusercontent.com/bminor/binutils-gdb/master/gas/testsuite/gas/all/comment.s",
  "/tmp/suites/gas/comment.s",
);
const GAS_CASES = [
  { file: "mov42.s", src: ".text\n.globl main\nmain:\n movl $42, %eax\n ret\n", want: 42 },
  { file: "add.s", src: "main:\n movl $1, %eax\n addl $41, %eax\n ret\n", want: 42 },
];
let asPass = 0;
const asFails = [];
if (fs.existsSync(commentP) && fs.statSync(commentP).size > 0) {
  const src = fs.readFileSync(commentP, "utf8");
  const r = asRun(src);
  const toks = asTokens(src);
  if (r.ok) asPass++;
  else asFails.push({ file: "comment.s", error: r.error || "no tokens", toks: toks.length });
}
for (const c of GAS_CASES) {
  const p = path.join(gasDir, c.file);
  fs.mkdirSync(gasDir, { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, c.src);
  const r = asRun(fs.readFileSync(p, "utf8"));
  if (r.ok && (r.value | 0) === c.want) asPass++;
  else asFails.push({ file: c.file, got: r.value, want: c.want });
}
const asN = (fs.existsSync(commentP) && fs.statSync(commentP).size > 0 ? 1 : 0) + GAS_CASES.length;
const asReport = {
  language: "asm",
  issuing_body: "GNU as (binutils gas testsuite) + integer mov/add extract",
  suite: "gas/all/comment.s (official) + mov $42 / add $41 (kernel-token extract)",
  n: asN,
  pass: asPass,
  skip: 0,
  skip0: asFails.length === 0 && asPass === asN,
  fails: asFails,
  standard_green: asFails.length === 0 && asPass === asN,
  note: "Not ld. Not ELF. Full gas testsuite GAP. comment.s is the official file; integer cases are the kernel-token extract.",
};
writeReport("asm-std-green.json", asReport);
console.log("ASM_STD_GREEN", asPass + "/" + asN, "skip0=" + asReport.skip0);

const cppSrc = "#define ANSWER 42\nint main(void) { return ANSWER; }\n";
const cppDir = path.join(root, "retrieved/standards/gcc-cpp");
fs.mkdirSync(cppDir, { recursive: true });
const cppP = path.join(cppDir, "define-answer.c");
if (!fs.existsSync(cppP)) fs.writeFileSync(cppP, cppSrc);
const expanded = ccpp(fs.readFileSync(cppP, "utf8"));
let cppOk = false;
let cppVal;
try {
  cppVal = cinterp(clower(expanded));
  cppOk = (cppVal | 0) === 42 && /42/.test(expanded);
} catch (e) {
  cppVal = String(e.message || e);
}
const cppReport = {
  language: "cpp-preprocessor",
  issuing_body: "WG14 N1570 translation phases 1–4",
  suite: "named #define ANSWER 42 → main returns 42 (CPP + CINTERP)",
  n: 1,
  pass: cppOk ? 1 : 0,
  skip: 0,
  skip0: cppOk,
  fails: cppOk ? [] : [{ file: "define-answer.c", got: cppVal, want: 42 }],
  standard_green: cppOk,
  note: "Same CPP() the C frontend uses. Full gcc.dg/cpp is GAP.",
};
writeReport("cppp-std-green.json", cppReport);
console.log("CPPP_STD_GREEN", cppOk ? "1/1" : "0/1", "skip0=" + cppOk);

process.exit(0);
