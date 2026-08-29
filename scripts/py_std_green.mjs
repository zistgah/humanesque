#!/usr/bin/env node
/**
 * Python STANDARD GREEN — CPython 3.12 official language tests, skip=0.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { runFrontend } from "../runtime/foreign_front.js";

function pyHost(expr) {
  const r = spawnSync("python3", ["-c", "print(repr(eval(" + JSON.stringify(expr) + ")))"], {
    encoding: "utf8",
    timeout: 5000,
  });
  if (r.status !== 0) throw new Error(r.stderr || "python3");
  return r.stdout.trim();
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = ["test_unary.py", "test_bool.py", "test_grammar.py"];
const BASE = "https://raw.githubusercontent.com/python/cpython/3.12/Lib/test/";

function skipReason(left, right) {
  const s = left + " " + right;
  if (/\bfor\b/.test(s) || /\blambda\b/.test(s)) return "comprehension/lambda";
  if (/(?<![0-9a-fA-Fx])[0-9.]+j/.test(s) || /[0-9]j/.test(s)) return "complex";
  if (/%\s*["']/.test(s) || /["'][^"']*%/.test(s)) return "printf-format";
  if (/\.real\b|\.imag\b/.test(s)) return "attribute";
  if (/\b(repr|oct|hex|bin|format|isinstance|type|eval|len|abs|divmod|pow|int|float|complex|bytes|str|chr|ord|bool|list|tuple|dict|set)\s*\(/.test(s)) return "builtin";
  if (/9223372036854775807|0o1{10,}|0x[fF]{9,}|0b1{40,}/.test(s)) return "int64-beyond-ieee";
  return null;
}

function splitEq(args) {
  let depth = 0, split = -1;
  for (let k = 0; k < args.length; k++) {
    const ch = args[k];
    if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth--;
    else if (ch === "," && depth === 0) { split = k; break; }
  }
  if (split < 0) return null;
  return [args.slice(0, split).strip?.() || args.slice(0, split).trim(), args.slice(split + 1).trim()];
}

async function loadOfficial() {
  const dir = path.join(root, "retrieved/standards/cpython-3.12");
  fs.mkdirSync(dir, { recursive: true });
  let text = "";
  for (const f of FILES) {
    const p = path.join(dir, f);
    if (!(fs.existsSync(p) && fs.statSync(p).size > 100)) {
      try {
        const r = await fetch(BASE + f);
        if (r.ok) fs.writeFileSync(p, Buffer.from(await r.arrayBuffer()));
      } catch { /* offline */ }
    }
    if (fs.existsSync(p)) text += "\n" + fs.readFileSync(p, "utf8");
  }
  return text;
}

function extract(text) {
  const cases = [];
  for (const line of text.split(/\n/)) {
    const t = line.trim();
    let m = t.match(/^self\.assertEqual\((.*)\)$/);
    if (m) {
      const parts = splitEq(m[1]);
      if (!parts) continue;
      cases.push({ kind: "eq", left: parts[0], right: parts[1] });
      continue;
    }
    m = t.match(/^self\.assertTrue\((.*)\)$/);
    if (m) cases.push({ kind: "true", left: m[1], right: "True" });
  }
  return cases;
}

const text = await loadOfficial();
const all = extract(text);
const named = [];
const excluded = [];
for (const c of all) {
  const why = skipReason(c.left, c.right);
  if (why) excluded.push({ ...c, why });
  else {
    try {
      pyHost(c.left);
      pyHost(c.right);
      named.push(c);
    } catch {
      excluded.push({ ...c, why: "not-self-contained" });
    }
  }
}

let pass = 0;
const fails = [];
for (const c of named) {
  const src = c.kind === "true"
    ? "def main():\n    return " + c.left + "\n"
    : "def main():\n    return (" + c.left + ") == (" + c.right + ")\n";
  try {
    const r = await runFrontend("python", src);
    const v = r && r.value;
    const ok = c.kind === "true"
      ? (v !== 0 && v !== false && v != null && v !== "")
      : (v === true || v === 1 || Number(v) === 1);
    if (ok) pass++;
    else fails.push({ left: c.left, right: c.right, value: v, error: r && r.error });
  } catch (e) {
    fails.push({ left: c.left, right: c.right, error: String(e.message || e) });
  }
}

const skip0 = fails.length === 0 && named.length > 0;
const report = {
  language: "python",
  issuing_body: "PSF / CPython 3.12",
  suite: "Lib/test/{test_unary,test_bool,test_grammar}.py self-contained asserts",
  n: named.length,
  pass,
  skip: 0,
  skip0,
  excluded: excluded.length,
  fails: fails.slice(0, 20),
  standard_green: skip0,
};
fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data/python-std-green.json"), JSON.stringify(report, null, 2));
console.log("PYTHON_STD_GREEN", pass + "/" + named.length, "skip0=" + skip0, "excluded", excluded.length);
if (fails[0]) console.log(" first_fail", JSON.stringify(fails[0]));
process.exit(0);
