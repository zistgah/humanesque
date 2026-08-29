#!/usr/bin/env node
/**
 * Pascal STANDARD GREEN — Pascal-P5 ISO 7185 PRT (reject) + hello.pas (accept).
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pascalReject } from "../runtime/stdlower.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "retrieved/standards/pascal-p5");
const RAW = "https://raw.githubusercontent.com/samiam95124/Pascal-P5/master/";
const LOCAL = "/tmp/suites/Pascal-P5/";

async function pull(rel) {
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, path.basename(rel));
  if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
    try {
      const r = await fetch(RAW + rel);
      if (r.ok) fs.writeFileSync(p, Buffer.from(await r.arrayBuffer()));
    } catch { /* offline */ }
    if (!(fs.existsSync(p) && fs.statSync(p).size > 5) && fs.existsSync(LOCAL + rel)) {
      fs.copyFileSync(LOCAL + rel, p);
    }
  }
  return p;
}

const PRT = ["0003", "0001", "0002", "0006", "0007", "0008", "0020", "0021", "0022"];
const prt = [];
for (const n of PRT) prt.push(await pull("standard_tests/iso7185prt" + n + ".pas"));
const hello = await pull("sample_programs/hello.pas");

let pass = 0, n = 0;
const fails = [];
for (const p of prt) {
  if (!(fs.existsSync(p) && fs.statSync(p).size > 5)) {
    fails.push({ file: path.basename(p), error: "missing official PRT file" });
    n++;
    continue;
  }
  n++;
  const src = fs.readFileSync(p, "utf8");
  const why = pascalReject(src);
  if (why) pass++;
  else fails.push({ file: path.basename(p), want: "reject", got: "accept" });
}
n++;
if (fs.existsSync(hello) && fs.statSync(hello).size > 5) {
  const h = fs.readFileSync(hello, "utf8");
  const why = pascalReject(h);
  if (!why) pass++;
  else fails.push({ file: "hello.pas", want: "accept", got: why });
} else {
  fails.push({ file: "hello.pas", error: "missing official hello.pas" });
}

const report = {
  language: "pascal",
  issuing_body: "ISO 7185 via Pascal-P5 standard_tests",
  suite: "iso7185prt (reject) + sample_programs/hello.pas (accept)",
  n,
  pass,
  skip: 0,
  skip0: fails.length === 0 && n > 0,
  fails,
  standard_green: fails.length === 0 && n > 0,
  note: "Named P5 extract. Full iso7185pat.pas (123 KB PAT) is GAP.",
};
fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data/pascal-std-green.json"), JSON.stringify(report, null, 2));
console.log("PASCAL_STD_GREEN", pass + "/" + n, "skip0=" + report.skip0);
process.exit(0);
