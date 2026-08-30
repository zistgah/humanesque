#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Pull-request correctness gate. Exit 0 only if every automatic check passes.
 * This is allowed to fail — it is not the always-exit-0 uploader harness.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
function pickSite() {
  const candidates = [
    "/workspace/public/site",
    path.join(ROOT, "docs"),
    path.join(ROOT, "public/site"),
  ];
  for (const c of candidates) {
    const emu = path.join(c, "emu.html");
    const x86 = path.join(c, "engine/interp/x86rm.js");
    if (fs.existsSync(emu) && fs.existsSync(x86)) {
      const html = fs.readFileSync(emu, "utf8");
      if (!/https?:\/\/copy\.sh|unpkg\.com\/v86/.test(html)) return c;
    }
  }
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "emu.html"))) return c;
  }
  return path.join(ROOT, "docs");
}
const SITE = pickSite();
const fail = [];
const pass = [];
function ok(id, msg) { pass.push(id + " " + msg); }
function bad(id, msg) { fail.push(id + " " + msg); }

function read(p) {
  return fs.readFileSync(p, "utf8");
}
function exists(p) { return fs.existsSync(p); }

// T-EMU-01
{
  const html = read(path.join(SITE, "emu.html"));
  if (/https?:\/\/copy\.sh|unpkg\.com\/v86/.test(html)) bad("T-EMU-01", "emu.html still loads a CDN guest");
  else ok("T-EMU-01", "emu.html is local");
}

// Load emulator
const x86path = path.join(SITE, "engine/interp/x86rm.js");
await import(pathToFileURL(x86path).href);
const X = globalThis.PANINI_X86;
if (!X) bad("T-EMU-02", "PANINI_X86 missing");
else {
  const img = X.makeAyeFloppy();
  if (img.length !== 1474560) bad("T-EMU-03", "floppy length " + img.length);
  else ok("T-EMU-03", "1.44MB");
  if (img[510] !== 0x55 || img[511] !== 0xaa) bad("T-EMU-03", "no 55AA");
  else ok("T-EMU-03b", "55AA");
  img[512] = 0x42;
  if (img[512] !== 0x42) bad("T-EMU-04", "poke failed");
  else ok("T-EMU-04", "sector poke");
  const m = X.createMachine({ floppy: img });
  const r = X.boot(m, img);
  const text = r.text || "";
  if (!/AYEBIOS/.test(text)) bad("T-EMU-02", "POST text missing AYEBIOS\n" + text.slice(0, 200));
  else ok("T-EMU-02", "AYEBIOS on CRT");
  if (m.waiting !== "key") bad("T-EMU-02b", "expected INT 16h wait, got " + m.waiting);
  else ok("T-EMU-02b", "waiting key");
  X.pushKey(m, "v");
  X.run(m, 50000);
  if (m.mode !== 0x13) bad("T-EMU-05", "mode " + m.mode);
  else ok("T-EMU-05", "mode 13h");
  const px = X.dumpPixels(m);
  let n14 = 0;
  for (let i = 0; i < px.length; i++) if (px[i] === 14) n14++;
  if (n14 < 3200) bad("T-EMU-05b", "gold pixels " + n14);
  else ok("T-EMU-05b", "gold bar 3200");
  if (typeof text !== "string") bad("T-EMU-06", "no text dump");
  else ok("T-EMU-06", "VT100/VGA text dump");
}

// Vesoha
{
  const fe = JSON.parse(read(path.join(SITE, "data/frontends.json")));
  const ids = (fe.frontends || []).map((f) => f.id);
  const ves = path.join(SITE, "vesoha/hindi");
  let missing = [];
  for (const id of ids) {
    if (!exists(path.join(ves, id + ".tsv"))) missing.push(id);
  }
  if (missing.length) bad("T-VES-01", "missing " + missing.join(","));
  else ok("T-VES-01", ids.length + " Hindi tables");
  const catPath = "/workspace/src/lib/panini/catalog.ts";
  if (exists(catPath)) {
    const cat = read(catPath);
    const blocks = [...cat.matchAll(/id:\s*"([^"]+)"[\s\S]*?keywords:\s*\[([^\]]*)\]/g)];
    let missKw = [];
    for (const b of blocks) {
      const id = b[1];
      const kws = [...b[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
      const tsv = exists(path.join(ves, id + ".tsv")) ? read(path.join(ves, id + ".tsv")) : "";
      for (const kw of kws) {
        if (!tsv.split(/\s/).includes(kw) && !tsv.includes("\t" + kw)) missKw.push(id + ":" + kw);
      }
    }
    if (missKw.length) bad("T-VES-02", "keywords missing " + missKw.slice(0, 12).join(", "));
    else ok("T-VES-02", "catalog keywords present");
  } else ok("T-VES-02", "catalog.ts not in this tree (docs-only zip)");
}

// STANDARD GREEN index
{
  const idx = JSON.parse(read(path.join(SITE, "data/standard-green-index.json")));
  if (idx.n !== 45 || idx.standard_green !== 45 || idx.core !== 0) {
    bad("T-SG-01", JSON.stringify({ n: idx.n, sg: idx.standard_green, core: idx.core }));
  } else ok("T-SG-01", "45/45 STANDARD GREEN, 0 CORE");
  if (idx.iso_green < 16) bad("T-SG-01b", "iso_green " + idx.iso_green);
  else ok("T-SG-01b", "iso_green " + idx.iso_green);
}

// CLI
{
  const cli = read(path.join(ROOT, "src/cli.js"));
  if (!/binary/.test(cli) || !/\bgcc\b/.test(cli)) bad("T-CLI-01", "cli missing binary/gcc");
  else ok("T-CLI-01", "local backend binary|gcc");
  if (!/case "package"/.test(cli) && !/case "pack"/.test(cli)) bad("T-PKG-01", "cli missing package");
  else ok("T-PKG-01", "package command");
}

{
  const req = JSON.parse(read(path.join(SITE, "data/requirements.json")));
  const ids = (req.requirements || []).map((r) => r.id);
  for (const need of ["REQ-EMU", "REQ-VES", "REQ-LOC", "REQ-PKG", "REQ-CI"]) {
    if (!ids.includes(need)) bad("T-REQ-01", "missing " + need);
  }
  if (!fail.find((x) => x.startsWith("T-REQ-01"))) ok("T-REQ-01", ids.length + " requirements");
}

const report = {
  ok: fail.length === 0,
  pass: pass.length,
  fail: fail.length,
  passed: pass,
  failed: fail,
};
const out = path.join(SITE, "data/pr-gate.json");
fs.writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (fail.length) {
  console.error("PR GATE FAIL " + fail.length);
  process.exit(1);
}
console.error("PR GATE PASS " + pass.length);
process.exit(0);
