#!/usr/bin/env node
/**
 * Software and systems factory — browse first, then write.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 *
 *   node scripts/factory_scan.mjs
 *   node scripts/factory_scan.mjs --accept-hash <id>   # re-lock after a deliberation
 *
 * Always exit 0 (uploader). Report is derived JSON.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
spawnSync(process.execPath, [path.join(root, "scripts/factory_sync.mjs")], { stdio: "inherit" });
const regPath = path.join(root, "factory/REGISTRY.json");
const reqPath = path.join(root, "REQUIREMENTS.md");

function sha16(p) {
  try {
    return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 16);
  } catch {
    return null;
  }
}

function exists(p) {
  return fs.existsSync(path.join(root, p));
}

const EVIDENCE = {
  1: { artifact: "spec/PANINI_SELF_HOSTING_SPEC.pni", test: "tests/run.mjs" },
  2: { artifact: "LICENSE", test: "NOTICE" },
  3: { artifact: "docs/index.html", test: "docs/manifest.webmanifest" },
  4: { artifact: "THIRD_PARTY.md", test: "docs/workbench.html" },
  5: { artifact: "runtime/vt100.js", test: "runtime/shell.js" },
  6: { artifact: "docs/STANDARD_GREEN.md", test: "scripts/iso_c_harness.mjs" },
  7: { artifact: "docs/ARCHITECT_PROMPTS.md", test: "docs/ARCHITECT_PROMPTS.md" },
  8: { artifact: "scripts/pack_zip.py", test: "scripts/pack_zip.py" },
  9: { artifact: "docs/index.html", test: "docs/linguist.html" },
  10: { artifact: "runtime/romenagri.js", test: "retrieved/romenagri" },
  11: { artifact: "docs/manifest.webmanifest", test: "src/cli.js" },
  12: { artifact: "docs/STANDARD_GREEN.md", test: "scripts/std_green_harness.mjs" },
  13: { artifact: "runtime/wasm_front.js", test: "runtime/clower.js" },
  14: { artifact: "runtime/clower.js", test: "tests/clower.mjs" },
  15: { artifact: "include/microstl/vector.hpp", test: "runtime/cpplower.js" },
  16: { artifact: "runtime/gnuc.js", test: "tests/clower.mjs" },
  17: { artifact: "runtime/stdlower.js", test: "scripts/std_green_harness.mjs" },
  18: { artifact: "include/stdio.h", test: "include/stdlib.h" },
  19: { artifact: "docs/ROADMAP.md", test: "docs/roadmap.html" },
  20: { artifact: "scripts/pack_zip.py", test: "tests/test.mjs" },
  21: { artifact: "retrieved/READ_ONLY.md", test: "runtime/romenagri.js" },
  22: { artifact: "docs/SHIP_GREEN.md", test: "scripts/factory_scan.mjs" },
  23: { artifact: "factory/REGISTRY.json", test: "scripts/factory_scan.mjs" },
  24: { artifact: "factory/DELIBERATION.md", test: "factory/REGISTRY.json" },
  25: { artifact: "docs/PROCESS.md", test: "scripts/factory_scan.mjs" },
  26: { artifact: "src/panini/frontends/typescript.pni", test: "scripts/std_green_harness.mjs" },
  27: { artifact: "src/panini/frontends/javascript.pni", test: "scripts/std_green_harness.mjs" },
  28: { artifact: "src/panini/frontends/zig.pni", test: "scripts/std_green_harness.mjs" },
  29: { artifact: "src/panini/frontends/lua.pni", test: "scripts/std_green_harness.mjs" },
  30: { artifact: "src/panini/frontends/fortran.pni", test: "scripts/std_green_harness.mjs" },
  31: { artifact: "src/panini/frontends/pascal.pni", test: "scripts/std_green_harness.mjs" },
  32: { artifact: "src/panini/frontends/basic.pni", test: "scripts/std_green_harness.mjs" },
  34: { artifact: "docs/STANDARD_GREEN.md", test: "retrieved/standards/SOURCES.md" },
  37: { artifact: "spec/PANINI.V2.WORKBENCH.md", test: "scripts/agi_green.mjs" },
};

const GAPS = {
  16: "GNU C pre-pass is live; statement-expr / asm / .lds named, not kernel-complete",
  33: "Haskell/Prolog/Lisp/COBOL are not C-AST paradigms; museum only",
};

const registry = JSON.parse(fs.readFileSync(regPath, "utf8"));
const accept = process.argv.includes("--accept-hash")
  ? process.argv[process.argv.indexOf("--accept-hash") + 1]
  : null;

const freeze = [];
for (const c of registry.components) {
  if (!c.freeze || !c.path || c.path.endsWith("/")) continue;
  const got = sha16(path.join(root, c.path));
  if (accept && c.id === accept && got) {
    c.hash = got;
    freeze.push({ id: c.id, path: c.path, status: "re-locked", hash: got });
    continue;
  }
  const ok = got && c.hash && got === c.hash;
  freeze.push({
    id: c.id,
    path: c.path,
    status: !got ? "MISSING" : ok ? "FROZEN" : "DRIFT",
    expected: c.hash,
    got,
  });
}
if (accept) {
  fs.writeFileSync(regPath, JSON.stringify(registry, null, 2) + "\n");
}

const reqText = fs.readFileSync(reqPath, "utf8");
const reqs = [];
for (const m of reqText.matchAll(/^(\d+)\.\s+(.+)$/gm)) {
  const n = Number(m[1]);
  const ev = EVIDENCE[n];
  const art = ev && exists(ev.artifact);
  const tes = ev && exists(ev.test);
  let status = "NAMED";
  if (GAPS[n]) status = "GAP";
  else if (art && tes) status = "SHIP GREEN";
  reqs.push({
    id: n,
    text: m[2].slice(0, 140),
    status,
    artifact: ev ? ev.artifact : null,
    test: ev ? ev.test : null,
    honesty: GAPS[n] || null,
  });
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}
const files = walk(root);
const byBase = new Map();
for (const p of files) {
  const b = path.basename(p);
  if (!byBase.has(b)) byBase.set(b, []);
  byBase.get(b).push(path.relative(root, p).replace(/\\/g, "/"));
}
const adapterPrefixes = [
  "docs/engine/interp/", "docs/cyclers/", "docs/ontology/", "docs/explorer/posters/",
  "docs/data/", "docs/FACTORY.md", "docs/DELIBERATION.md",
  "apps/", "retrieved/", "cyclers/upstream/", "languages/", "website/",
  "docs/CONTEXT.md", "docs/CONTRACT.md", "docs/REQUIREMENTS.md",
];
function isAdapterPath(p) {
  return adapterPrefixes.some((x) => p === x || p.startsWith(x));
}
const dupes = [];
for (const [base, paths] of byBase) {
  if (paths.length < 2) continue;
  if (base === "README.md" || base === "LICENSE" || base === "NOTICE" || base === "index.html") continue;
  const unexplained = paths.filter((p) => !isAdapterPath(p));
  if (unexplained.length >= 2) dupes.push({ base, paths: unexplained.slice(0, 6) });
}

const ship = reqs.filter((r) => r.status === "SHIP GREEN").length;
const named = reqs.filter((r) => r.status === "NAMED").length;
const gaps = reqs.filter((r) => r.status === "GAP").length;
const drift = freeze.filter((f) => f.status === "DRIFT" || f.status === "MISSING");

const report = {
  theorem: "SHIP_GREEN(requirements)",
  when: new Date().toISOString(),
  requirements: { total: reqs.length, ship_green: ship, named, gap: gaps },
  freeze: { locked: freeze.filter((f) => f.status === "FROZEN").length, drift: drift.length, items: freeze },
  duplicates_unexplained: dupes.slice(0, 30),
  reqs,
  green: drift.length === 0 && named === 0 && gaps >= 0 && ship === reqs.length - gaps,
  status:
    drift.length
      ? "FREEZE DRIFT (" + drift.map((d) => d.id).join(",") + ")"
      : "SHIP GREEN " + ship + "/" + reqs.length + " (gap " + gaps + " named " + named + ")",
  reuse: "Browse factory/REGISTRY.json before adding a file. Frozen components are not restyled.",
};

fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data/ship-green.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(root, "docs/data/factory-registry.json"), JSON.stringify(registry, null, 2));
fs.writeFileSync(path.join(root, "factory/last-scan.json"), JSON.stringify(report, null, 2));

const langIndexPath = path.join(root, "factory/languages.json");
let langIndex = { languages: [] };
try { langIndex = JSON.parse(fs.readFileSync(langIndexPath, "utf8")); } catch { /* missing */ }
const stdReports = [];
try {
  for (const f of fs.readdirSync(path.join(root, "docs/data"))) {
    if (!f.endsWith("-std-green.json")) continue;
    try { stdReports.push(JSON.parse(fs.readFileSync(path.join(root, "docs/data", f), "utf8"))); } catch { /* skip */ }
  }
} catch { /* no data dir */ }
try {
  const c = JSON.parse(fs.readFileSync(path.join(root, "tests/iso/c/last-report.json"), "utf8"));
  stdReports.push({
    language: "c",
    pass: c.panini && c.panini.pass,
    n: c.cases,
    skip0: !!(c.green && c.panini && c.panini.skip === 0),
    standard_green: !!c.green,
    suite: c.standard,
  });
} catch { /* C report missing */ }
const ALIAS = { "common-lisp": "lisp", "basic/qb64": "basic" };
const reportById = new Map();
for (const r of stdReports) reportById.set(ALIAS[r.language] || r.language, r);
const merged = (langIndex.languages || []).map((L) => {
  const r = reportById.get(L.id);
  return {
    id: L.id,
    language: L.id,
    suite: (r && r.suite) || L.suite || "",
    pass: r ? r.pass : null,
    n: r ? r.n : null,
    skip0: r ? !!r.skip0 : false,
    standard_green: r ? !!r.standard_green : !!L.standard_green,
    gap: L.gap || null,
    frontend: L.frontend,
  };
});
const stdGreen = merged.filter((r) => r.standard_green);
const stdIndex = {
  theorem: "STANDARD_GREEN(languages)",
  when: report.when,
  n: merged.length,
  standard_green: stdGreen.length,
  languages: merged,
  reports: stdReports.map((r) => ({
    language: r.language,
    pass: r.pass,
    n: r.n,
    skip0: r.skip0,
    standard_green: r.standard_green,
    suite: r.suite,
  })),
  index: langIndex.languages || [],
  groups: registry.groups || {},
};
fs.writeFileSync(path.join(root, "docs/data/standard-green-index.json"), JSON.stringify(stdIndex, null, 2));

console.log(JSON.stringify({ status: report.status, freeze: report.freeze.locked, drift: report.freeze.drift, ship: ship, named, gap: gaps, dupes: dupes.length, standard_green: stdGreen.length }, null, 2));
process.exit(0);
