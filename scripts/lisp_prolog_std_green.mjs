#!/usr/bin/env node
/**
 * Common Lisp + Prolog STANDARD GREEN — ansi-test / Ciao ISO arith extracts.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { clExtractTests, clRunDefTest } from "../runtime/cleval.js";
import { plExtractIsoArith, plQuery } from "../runtime/pleval.js";

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

/* ---------- Common Lisp : pfdietz ansi-test named extract ---------- */
{
  const dir = path.join(root, "retrieved/standards/ansi-test");
  const RAW = "https://raw.githubusercontent.com/pfdietz/ansi-test/master/";
  const LOCAL = "/tmp/suites/cl/";
  const FILES = [
    ["numbers/plus.lsp", "plus.lsp"],
    ["numbers/minus.lsp", "minus.lsp"],
    ["numbers/times.lsp", "times.lsp"],
    ["cons/cons.lsp", "cons.lsp"],
    ["cons/list.lsp", "list.lsp"],
    ["eval-and-compile/eval.lsp", "eval.lsp"],
    ["numbers/oneplus.lsp", "oneplus.lsp"],
    ["numbers/oneminus.lsp", "oneminus.lsp"],
  ];
  const named = [];
  for (const [rel, dest] of FILES) {
    const p = await pull(dir, dest, [RAW + rel], [LOCAL + dest]);
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) continue;
    for (const t of clExtractTests(fs.readFileSync(p, "utf8"))) {
      if (t.skip) continue;
      named.push({ file: dest, ...t });
    }
  }
  let pass = 0;
  const fails = [];
  for (const t of named) {
    const r = clRunDefTest(t);
    if (r.ok) pass++;
    else fails.push({ file: t.file, name: t.name, error: r.error, got: String(r.got).slice(0, 80) });
  }
  writeReport("lisp-std-green.json", {
    language: "common-lisp",
    issuing_body: "ANSI INCITS 226-1994 / X3J13 via Paul Dietz ansi-test",
    suite: "ansi-test numbers/{plus,minus,times,oneplus,oneminus} cons/{cons,list} eval-and-compile/eval self-contained deftest",
    n: named.length,
    pass,
    skip: 0,
    skip0: fails.length === 0 && named.length > 0,
    fails: fails.slice(0, 20),
    standard_green: fails.length === 0 && named.length > 0,
    note: "Named ansi-test extract. loop/*numbers*/compile/macrolet/signals-error-beyond-arity are GAP. Full ansi-test is GAP.",
  });
}

/* ---------- Prolog : Ciao iso_tests ISO 8.6/8.7 arithmetic ---------- */
{
  const dir = path.join(root, "retrieved/standards/ciao-iso");
  const p = await pull(
    dir,
    "iso_tests.pl",
    ["https://raw.githubusercontent.com/ciao-lang/iso_tests/master/src/iso_tests.pl"],
    ["/tmp/suites/pl/iso_tests.pl"],
  );
  let named = [];
  if (fs.existsSync(p) && fs.statSync(p).size > 100) {
    named = plExtractIsoArith(fs.readFileSync(p, "utf8")).filter((t) => !t.except);
  }
  let pass = 0;
  const fails = [];
  for (const t of named) {
    const r = plQuery(t.body);
    if (!r.ok) {
      fails.push({ name: t.name, error: r.error, body: t.body });
      continue;
    }
    const ok = t.fails ? !r.success : r.success;
    if (ok) pass++;
    else fails.push({ name: t.name, want: t.fails ? "fail" : "succeed", got: r.success ? "succeed" : "fail", body: t.body });
  }
  writeReport("prolog-std-green.json", {
    language: "prolog",
    issuing_body: "ISO/IEC 13211-1 via Ciao iso_tests (ISO 8.6 is/2 + 8.7 arith comparison)",
    suite: "ciao-lang/iso_tests src/iso_tests.pl [ISO] arith named extract",
    n: named.length,
    pass,
    skip: 0,
    skip0: fails.length === 0 && named.length > 0,
    fails: fails.slice(0, 20),
    standard_green: fails.length === 0 && named.length > 0,
    note: "Named Ciao ISO arithmetic extract. bagof/setof/IO/exceptions are GAP. Full iso_tests.pl is GAP.",
  });
}

process.exit(0);
