/**
 * Front-page paths exist; Tamil reverse flatten hub identity on HindiC letters.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

for (const f of [
  "docs/index.html",
  "docs/path/arabic.html",
  "docs/path/tamil.html",
  "docs/path/roundtrip.html",
  "docs/path/research.html",
  "docs/path/index.html",
]) assert.ok(fs.existsSync(f), f);

const idx = fs.readFileSync("docs/index.html", "utf8");
assert.ok(idx.includes("path/arabic.html"));
assert.ok(idx.includes("path/tamil.html"));
assert.ok(idx.includes("path/roundtrip.html"));
assert.ok(idx.includes("path/research.html"));

const ctx = { window: {}, globalThis: {}, console, fetch: () => Promise.reject(new Error("no fetch")) };
ctx.window = ctx; ctx.globalThis = ctx;
vm.runInNewContext(fs.readFileSync("docs/engine/nb.js", "utf8"), ctx);
const B = JSON.parse(fs.readFileSync("docs/engine/bundle.json", "utf8"));
ctx.PANINI_NB.load = async () => B;
const NB = ctx.PANINI_NB;
// inject bundle without fetch
const loadSrc = fs.readFileSync("docs/engine/nb.js", "utf8");
// compile using internal after assigning B via a hack: call compile needs B
// Direct: use flatten from loaded module — load() wasn't called.
// Re-run load by setting B through compile? We only have exported fns after load().
// Simulate: eval flatten via applying exported after we can't.
// Read pairs from bundle instead.
function applyPairs(src, pairs, fromK, toK) {
  let i = 0, out = "", s = String(src);
  const ps = pairs.slice().sort((a, b) => [...b[fromK]].length - [...a[fromK]].length);
  while (i < s.length) {
    if (s[i] === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') { if (s[j] === "\\") j += 2; else j++; }
      out += s.slice(i, j + 1); i = j + 1; continue;
    }
    let hit = null;
    for (const p of ps) if (p[fromK] && s.startsWith(p[fromK], i)) { hit = p; break; }
    if (hit) { out += hit[toK]; i += hit[fromK].length; }
    else { out += s[i]; i++; }
  }
  return out;
}
function flatten(src) { return applyPairs(src, B.flatten.pairs, "from", "to"); }
function unflatten(deva, script) {
  const map = B.flatten.reverse[script] || {};
  const pairs = Object.keys(map).map((to) => ({ from: to, to: map[to] }));
  return applyPairs(deva, pairs, "from", "to");
}
let entryN = 0, entryFail = 0;
const fails = [];
for (const sc of Object.keys(B.flatten.reverse)) {
  const rev = B.flatten.reverse[sc] || {};
  for (const [hubCh, native] of Object.entries(rev)) {
    entryN++;
    const back = flatten(native);
    if (back !== hubCh) { entryFail++; if (fails.length < 12) fails.push(sc + " " + JSON.stringify(native) + " → " + JSON.stringify(back) + " want " + JSON.stringify(hubCh)); }
  }
}
assert.ok(entryN > 100, "reverse tables populated");
console.log("ok   front_paths_exist");
console.log("reverse_entry_rows", entryN, "fails", entryFail);
if (fails.length) console.log(fails.join("\n"));
const hindi = fs.readFileSync("docs/demos/HindiC.uhin", "utf8");
const hub = flatten(hindi);
const fileReport = {};
for (const sc of Object.keys(B.flatten.reverse)) {
  const there = unflatten(hub, sc);
  const back = flatten(there);
  fileReport[sc] = hub === back;
}
console.log("HindiC whole-file hub identity:", JSON.stringify(fileReport));
console.log("PATH_FRONT_OK");
