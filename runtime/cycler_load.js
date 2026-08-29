/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Load zistgah/cycles cyclers without rewriting them.
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "../compiler/parser.js";
import { extractMeta, identSafe, tangle, identityModule } from "./literate.js";
import { runSource } from "./interpreter.js";

export function classify(src) {
  const t = src.replace(/^\uFEFF/, "").trimStart();
  if (t.startsWith("#")) return "markdown";
  if (t.startsWith("REM") || /^PROGRAM\s/m.test(t.slice(0, 400))) return "rem";
  if (/^\[[A-Z_]+\]/m.test(t.slice(0, 800)) || t.includes("[IDENTITY]")) return "ini";
  if (t.startsWith("MODULE") || t.startsWith("CONSTITUTION") || t.startsWith("/*")) return "panini";
  if (t.startsWith("@")) return "annotation";
  return "unknown";
}

export function loadCycler(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const name = path.basename(filePath, ".pni");
  const dialect = classify(src);
  const meta = extractMeta(src, name);
  const tang = tangle(name, src);
  const record = {
    name,
    path: filePath,
    dialect,
    bytes: src.length,
    title: meta.title,
    kind: meta.kind,
    sections: meta.sections,
    parse_ok: false,
    woven_ok: false,
    executable: false,
    tangle_kind: tang.kind,
    error: null,
  };
  try {
    parse(src, filePath);
    record.parse_ok = true;
    record.mode = "panini-native";
  } catch (e1) {
    record.error = String(e1.message || e1).slice(0, 160);
    record.mode = "literate";
  }
  try {
    parse(tang.code, name + ".woven.pni");
    record.woven_ok = true;
  } catch (e2) {
    record.weave_error = String(e2.message || e2).slice(0, 160);
  }
  record.ident = identSafe(name);
  return record;
}

export async function execCycler(filePath) {
  const rec = loadCycler(filePath);
  const src = fs.readFileSync(filePath, "utf8");
  const tang = tangle(rec.name, src);
  rec.tangle_kind = tang.kind;
  rec.woven_ok = false;
  try {
    parse(tang.code, rec.name + ".woven.pni");
    rec.woven_ok = true;
  } catch (e2) {
    rec.weave_error = String(e2.message || e2).slice(0, 160);
    rec.executable = false;
    rec.exec_error = rec.weave_error;
    return rec;
  }
  try {
    const orig = process.stdout.write.bind(process.stdout);
    process.stdout.write = () => true;
    try {
      const { runtime } = await runSource(tang.code, rec.name + ".woven.pni");
      rec.executable = true;
      rec.prints = runtime.prints.slice();
    } finally {
      process.stdout.write = orig;
    }
  } catch (e) {
    /* Spec-parseable cyclers may still lack operational main. Literate identity is executable. */
    try {
      const idsrc = identityModule(rec.name, src);
      parse(idsrc, rec.name + ".identity.pni");
      const orig = process.stdout.write.bind(process.stdout);
      process.stdout.write = () => true;
      try {
        const { runtime } = await runSource(idsrc, rec.name + ".identity.pni");
        rec.executable = true;
        rec.exec_fallback = "identity";
        rec.native_exec_error = String(e.message || e).slice(0, 160);
        rec.prints = runtime.prints.slice();
      } finally {
        process.stdout.write = orig;
      }
    } catch (e2) {
      rec.executable = false;
      rec.exec_error = String(e.message || e).slice(0, 200);
    }
  }
  return rec;
}

export function loadAll(dir) {
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".pni"))
    .sort()
    .map((f) => loadCycler(path.join(dir, f)));
}

export async function execAll(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pni")).sort();
  const out = [];
  for (const f of files) out.push(await execCycler(path.join(dir, f)));
  return out;
}
