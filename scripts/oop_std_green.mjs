#!/usr/bin/env node
/**
 * OOP STANDARD GREEN — C++ / ECMAScript / TypeScript / Smalltalk / Java / Haskell
 * named official extracts, skip=0.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cppReject, cpplower } from "../runtime/cpplower.js";
import { cinterp } from "../runtime/cinterp.js";
import { js262Run, ts262Run } from "../runtime/js262.js";
import { javaReject } from "../runtime/stdlower.js";
import { haskellRun } from "../runtime/hseval.js";
import { stRunFile, stFormat } from "../runtime/steval.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/data");
fs.mkdirSync(dataDir, { recursive: true });

async function pull(dir, destName, urls, localPaths) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, destName);
  try {
    if (fs.existsSync(p) && fs.statSync(p).size > 0) return p;
  } catch { /* retry */ }
  for (const loc of localPaths) {
    try {
      if (loc && fs.existsSync(loc) && fs.statSync(loc).size > 0) {
        fs.writeFileSync(p, fs.readFileSync(loc));
        return p;
      }
    } catch { /* unreadable local */ }
  }
  for (const u of urls) {
    try {
      const r = await fetch(u);
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 0) { fs.writeFileSync(p, buf); return p; }
      }
    } catch { /* offline */ }
  }
  return p;
}

function writeReport(name, report) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(report, null, 2));
  console.log(report.language.toUpperCase() + "_STD_GREEN", report.pass + "/" + report.n, "skip0=" + report.skip0);
}

/* ---------- C++ : GCC 13.2 g++.dg/expr ---------- */
{
  const dir = path.join(root, "retrieved/standards/gxx-dg");
  const RAW = "https://raw.githubusercontent.com/gcc-mirror/gcc/master/gcc/testsuite/g++.dg/expr/";
  const LOCAL = "/tmp/suites/gxx/";
  const RUN = ["enum1.C"];
  const REJECT = ["bool2.C", "bool4.C", "for1.C", "cast1.C"];
  const fails = [];
  let pass = 0, n = 0;
  for (const f of RUN) {
    const p = await pull(dir, f, [RAW + f], [LOCAL + f]);
    n++;
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
      fails.push({ file: f, error: "missing official g++.dg file" });
      continue;
    }
    const src = fs.readFileSync(p, "utf8");
    if (cppReject(src)) { fails.push({ file: f, want: "run", got: "reject" }); continue; }
    try {
      const v = cinterp(cpplower(src));
      if ((v | 0) === 0) pass++;
      else fails.push({ file: f, want: 0, got: v });
    } catch (e) {
      fails.push({ file: f, error: String(e.message || e) });
    }
  }
  for (const f of REJECT) {
    const p = await pull(dir, f, [RAW + f], [LOCAL + f]);
    n++;
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
      fails.push({ file: f, error: "missing official g++.dg file" });
      continue;
    }
    const src = fs.readFileSync(p, "utf8");
    const why = cppReject(src);
    if (why) pass++;
    else fails.push({ file: f, want: "reject", got: "accept" });
  }
  writeReport("cpp-std-green.json", {
    language: "cpp",
    issuing_body: "WG21 N4296 (C++14 CD) + GCC g++.dg (ISO-C++ proxy, same role as c-testsuite for C)",
    suite: "g++.dg/expr enum1.C { dg-do run } + bool2/bool4/for1/cast1 { dg-error }",
    n, pass, skip: 0,
    skip0: fails.length === 0 && n > 0,
    fails,
    standard_green: fails.length === 0 && n > 0,
    note: "Named g++.dg/expr extract. Homemade tests/iso/cxx is CORE GREEN only. Full libstdc++ / gcc torture is GAP.",
  });
}

/* ---------- ECMAScript : Test262 language extract ---------- */
{
  const dir = path.join(root, "retrieved/standards/test262");
  const RAW = "https://raw.githubusercontent.com/tc39/test262/main/test/";
  const LOCAL = "/tmp/suites/test262/";
  const FILES = [
    "language/statements/if/S12.5_A1.1_T1.js",
    "language/statements/if/S12.5_A1.1_T2.js",
    "language/statements/if/S12.5_A1.2_T1.js",
    "language/types/undefined/S8.1_A1_T1.js",
    "language/types/null/S8.2_A1_T1.js",
    "language/types/boolean/S8.3_A1_T1.js",
    "language/expressions/addition/S11.6.1_A4_T1.js",
    "language/expressions/addition/S11.6.1_A4_T2.js",
    "language/expressions/addition/S11.6.1_A2.1_T1.js",
    "language/expressions/unary-minus/S11.4.7_A2.1_T1.js",
    "language/expressions/unary-plus/S11.4.6_A2.1_T1.js",
    "language/expressions/logical-not/S11.4.9_A2.1_T1.js",
    "language/expressions/subtraction/S11.6.2_A4_T1.js",
  ];
  const fails = [];
  let pass = 0, n = 0;
  for (const rel of FILES) {
    const dest = path.basename(rel);
    const p = await pull(dir, dest, [RAW + rel], [LOCAL + rel, path.join(LOCAL, "language", rel.replace(/^language\//, ""))]);
    n++;
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
      fails.push({ file: dest, error: "missing official Test262 file" });
      continue;
    }
    const r = js262Run(fs.readFileSync(p, "utf8"));
    if (r && r.ok) pass++;
    else fails.push({ file: dest, error: (r && (r.error || r.unparsed)) || "fail" });
  }
  writeReport("javascript-std-green.json", {
    language: "javascript",
    issuing_body: "Ecma TC39 ECMA-262 + Test262",
    suite: "Test262 language if/types/addition/unary/logical-not/subtraction named extract",
    n, pass, skip: 0,
    skip0: fails.length === 0 && n > 0,
    fails,
    standard_green: fails.length === 0 && n > 0,
    note: "Named Test262 language extract. Full Test262 (annex, built-ins, async, modules) is GAP. Homemade tests/std/javascript is CORE GREEN only.",
  });
}

/* ---------- TypeScript : tsc compiler extract ---------- */
{
  const dir = path.join(root, "retrieved/standards/tsc");
  const RAW = "https://raw.githubusercontent.com/microsoft/TypeScript/v5.4.5/tests/cases/compiler/";
  const LOCAL = "/tmp/suites/ts/";
  const FILES = ["unaryPlus.ts", "2dArrays.ts"];
  const fails = [];
  let pass = 0, n = 0;
  for (const f of FILES) {
    const p = await pull(dir, f, [RAW + f], [LOCAL + f]);
    n++;
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
      fails.push({ file: f, error: "missing official tsc compiler test" });
      continue;
    }
    const r = ts262Run(fs.readFileSync(p, "utf8"));
    if (r && r.ok) pass++;
    else fails.push({ file: f, error: (r && r.error) || "fail" });
  }
  writeReport("typescript-std-green.json", {
    language: "typescript",
    issuing_body: "Microsoft TypeScript v5.4.5 compiler tests (ECMA-262 + types)",
    suite: "tests/cases/compiler/{unaryPlus,2dArrays}.ts",
    n, pass, skip: 0,
    skip0: fails.length === 0 && n > 0,
    fails,
    standard_green: fails.length === 0 && n > 0,
    note: "Named tsc compiler extract: unaryPlus execute-accept + 2dArrays compile-accept. Full tsc UI / checker is GAP. Homemade tests/std/typescript is CORE GREEN only.",
  });
}

/* ---------- Java : OpenJDK javac Parens + LambdaConv01 ---------- */
{
  const dir = path.join(root, "retrieved/standards/openjdk-javac");
  const RAW = "https://raw.githubusercontent.com/openjdk/jdk/jdk-21-ga/test/langtools/tools/javac/";
  const LOCAL = "/tmp/suites/java/";
  const REJECT = ["Parens1.java", "Parens2.java", "Parens3.java"];
  const ACCEPT = ["LambdaConv01.java"];
  const fails = [];
  let pass = 0, n = 0;
  for (const f of REJECT) {
    const p = await pull(dir, f, [RAW + f], [LOCAL + f]);
    n++;
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
      fails.push({ file: f, error: "missing official javac file" });
      continue;
    }
    const why = javaReject(fs.readFileSync(p, "utf8"));
    if (why) pass++;
    else fails.push({ file: f, want: "reject", got: "accept" });
  }
  for (const f of ACCEPT) {
    const p = await pull(dir, f, [RAW + "lambda/" + f], [LOCAL + f]);
    n++;
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
      fails.push({ file: f, error: "missing official javac file" });
      continue;
    }
    const why = javaReject(fs.readFileSync(p, "utf8"));
    if (!why) pass++;
    else fails.push({ file: f, want: "accept", got: why });
  }
  writeReport("java-std-green.json", {
    language: "java",
    issuing_body: "OpenJDK javac (JLS proxy). Not Java™ branding.",
    suite: "Parens1/2/3 @compile/fail reject + LambdaConv01 @compile accept",
    n, pass, skip: 0,
    skip0: fails.length === 0 && n > 0,
    fails,
    standard_green: fails.length === 0 && n > 0,
    note: "Named OpenJDK javac extract. LambdaConv01 @run main execute is GAP. Not Java™.",
  });
}

/* ---------- Smalltalk : GNU Smalltalk intmath.st before LargeIntegers ---------- */
{
  const dir = path.join(root, "retrieved/standards/gst-intmath");
  const RAW = "https://raw.githubusercontent.com/gnu-smalltalk/smalltalk/master/tests/";
  const LOCAL = "/tmp/suites/st/";
  const stP = await pull(dir, "intmath.st", [RAW + "intmath.st"], [LOCAL + "intmath.st"]);
  const okP = await pull(dir, "intmath.ok", [RAW + "intmath.ok"], [LOCAL + "intmath.ok"]);
  const fails = [];
  let pass = 0, n = 0;
  if (!(fs.existsSync(stP) && fs.existsSync(okP) && fs.statSync(stP).size > 5 && fs.statSync(okP).size > 5)) {
    fails.push({ error: "missing official intmath.st / intmath.ok" });
  } else {
    const r = stRunFile(fs.readFileSync(stP, "utf8"));
    const wants = [...fs.readFileSync(okP, "utf8").matchAll(/returned value is (.+)/g)].map((m) => m[1]);
    const got = (r.prints || []).map(stFormat);
    n = got.length;
    for (let i = 0; i < got.length; i++) {
      if (got[i] === wants[i]) pass++;
      else fails.push({ i, got: got[i], want: wants[i] });
    }
    if (!r.ok) fails.push({ error: r.error });
    if (n === 0) fails.push({ error: "no Eval[] in named extract" });
  }
  writeReport("smalltalk-std-green.json", {
    language: "smalltalk",
    issuing_body: "GNU Smalltalk tests/intmath.st (ANSI Smalltalk proxy)",
    suite: "intmath.st Eval[] before LargeIntegers vs intmath.ok",
    n, pass, skip: 0,
    skip0: fails.length === 0 && n > 0,
    fails,
    standard_green: fails.length === 0 && n > 0,
    note: "Named GST intmath integer-arithmetic extract. LargeIntegers / factorial / SmallInteger are GAP.",
  });
}

/* ---------- Haskell : GHC codeGen should_run ---------- */
{
  const dir = path.join(root, "retrieved/standards/ghc-cgrun");
  const RAW = "https://raw.githubusercontent.com/ghc/ghc/master/testsuite/tests/codeGen/should_run/";
  const LOCAL = "/tmp/suites/hs/";
  const CASES = ["cgrun001", "cgrun002", "cgrun005"];
  const fails = [];
  let pass = 0, n = 0;
  for (const id of CASES) {
    const hs = await pull(dir, id + ".hs", [RAW + id + ".hs"], [LOCAL + id + ".hs"]);
    const out = await pull(dir, id + ".stdout", [RAW + id + ".stdout"], [LOCAL + id + ".stdout"]);
    n++;
    if (!(fs.existsSync(hs) && fs.existsSync(out) && fs.statSync(hs).size > 0 && fs.statSync(out).size > 0)) {
      fails.push({ file: id, error: "missing official GHC should_run pair" });
      continue;
    }
    const r = haskellRun(fs.readFileSync(hs, "utf8"));
    const want = fs.readFileSync(out, "utf8").trim();
    const got = String(r.print ?? r.value ?? "").trim();
    if (r.ok && got === want) pass++;
    else fails.push({ file: id, got, want, error: r.error });
  }
  writeReport("haskell-std-green.json", {
    language: "haskell",
    issuing_body: "GHC codeGen should_run (Haskell 2010 proxy)",
    suite: "testsuite/tests/codeGen/should_run/cgrun001,002,005 vs official .stdout",
    n, pass, skip: 0,
    skip0: fails.length === 0 && n > 0,
    fails,
    standard_green: fails.length === 0 && n > 0,
    note: "Named GHC codeGen should_run extract. Full GHC testsuite (typechecker, TH, extensions) is GAP.",
  });
}

process.exit(0);
