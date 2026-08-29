/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * All retrieved Hindawi Shailis. Filters extracted from legacy .uhin/.lex.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toRomenagriSource, hindawiGuru } from "./hindawi.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const H = path.join(root, "retrieved/legacy/Hindawi");

/** Shaili = host-language localization. Not a spoken language. */
export const SHAILIS = [
  { id: "guru",     name: "गुरु",     host: "C",      filter: "guru/h2c.lex",     layer: "romenagri", cc: "gcc" },
  { id: "shraeni",  name: "श्रेणी",   host: "C++",    filter: "shraeni/h2cpp.uhin", layer: "romenagri", cc: "g++" },
  { id: "praatha",  name: "प्राथमिक", host: "BASIC",  filter: "praatha/h2b.uhin",  layer: "devanagari", cc: "qb2c/fasm" },
  { id: "kritrima", name: "कृत्रिम",   host: "Java",   filter: "kritrima/h2j.uhin", layer: "romenagri", cc: "javac" },
  { id: "soochee",  name: "सूची",     host: "Python", filter: "soochee/h2py.lex", layer: "romenagri", cc: "python" },
  { id: "shabda",   name: "शब्द",     host: "lex",    filter: "shabda/h2l.uhin",  layer: "romenagri", cc: "flex" },
  { id: "wyaaka",   name: "व्याकरण",  host: "yacc",   filter: "wyaaka/h2yacc.uhin", layer: "romenagri", cc: "yacc" },
  { id: "yantra",   name: "यांत्रिक",  host: "asm",    filter: "yantra/h2y.uhin",  layer: "romenagri", cc: "fasm" },
];

/** 2026 Hindawi-style names. Not 2004 lexers. See docs/SHAILIS.md */
export const SHAILIS_2026 = [
  { id: "jala", name: "जाल", host: "JavaScript", standard: "ECMA-262" },
  { id: "rupa", name: "रूप", host: "TypeScript", standard: "Apache handbook" },
  { id: "gamana", name: "गमन", host: "Go", standard: "Go spec" },
  { id: "ayas", name: "अयस्", host: "Rust", standard: "Rust RFCs" },
  { id: "svara", name: "स्वर", host: "C#", standard: "ECMA-334" },
  { id: "chandra", name: "चन्द्र", host: "Lua", standard: "Lua MIT" },
  { id: "manikya", name: "माणिक्य", host: "Ruby", standard: "ISO/IEC 30170" },
  { id: "sutra", name: "सूत्र", host: "SQL", standard: "ISO/IEC 9075" },
  { id: "vidhi", name: "विधि", host: "Fortran", standard: "ISO/IEC 1539" },
  { id: "ganana", name: "गणना", host: "R", standard: "R Language Definition" },
  { id: "rekha", name: "रेखा", host: "Logo", standard: "heritage pedagogy" },
];

/** Bhasha = vernacular on the same Devanagari script. Sanskrit = keyword TSV only. */
export const BHASHAS = [
  { id: "hi", name: "Hindi",    tsv: "retrieved/romenagri/langs/hindi_c.tsv",    script: "Devanagari" },
  { id: "ne", name: "Nepali",   tsv: "retrieved/romenagri/langs/nepali_c.tsv",   script: "Devanagari" },
  { id: "mr", name: "Marathi",  tsv: "retrieved/romenagri/langs/marathi_c.tsv",  script: "Devanagari" },
  { id: "sa", name: "Sanskrit", tsv: "retrieved/romenagri/langs/sanskrit_c.tsv", script: "Devanagari", keyword_only: true },
  { id: "pa", name: "Punjabi",  tsv: "retrieved/romenagri/langs/punjabi_c.tsv",  script: "Gurmukhi" },
  { id: "bn", name: "Bengali",  tsv: "retrieved/romenagri/langs/bengali_c.tsv",  script: "Bengali" },
  { id: "te", name: "Telugu",   tsv: "retrieved/romenagri/langs/telugu_c.tsv",  script: "Telugu" },
  { id: "ta", name: "Tamil",    tsv: "retrieved/romenagri/langs/tamil_c.tsv",   script: "Tamil" },
  { id: "ur", name: "Urdu",     tsv: "retrieved/romenagri/langs/urdu_c.tsv",    script: "Perso-Arabic", lossy: true },
];

export function extractLexRules(text) {
  const rules = [];
  let pending = [];
  for (const raw of String(text).split(/\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("/*") || line.startsWith("%") || line.startsWith("//")) continue;
    const printf = line.match(/\{printf\("((?:\\.|[^"\\])*)"\);\}/);
    const left = printf ? line.slice(0, printf.index) : line;
    const toks = left.split("|").map((s) => s.trim()).filter(Boolean);
    pending.push(...toks);
    if (printf) {
      const to = printf[1].replace(/\\n/g, "\n");
      for (const from of pending) {
        if (from.startsWith('"') || from.startsWith("'") || from === "%%") continue;
        rules.push({ from, to });
      }
      pending = [];
    }
  }
  return rules.sort((a, b) => b.from.length - a.from.length);
}

const _rules = new Map();
export function shailiRules(id) {
  if (_rules.has(id)) return _rules.get(id);
  const s = SHAILIS.find((x) => x.id === id);
  if (!s) throw new Error("unknown shaili " + id);
  const text = fs.readFileSync(path.join(H, s.filter), "utf8");
  const rules = extractLexRules(text);
  _rules.set(id, rules);
  return rules;
}

function applyRules(src, rules) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    if (src[i] === '"') {
      let j = i + 1;
      while (j < src.length && src[j] !== '"') {
        if (src[j] === "\\") j += 2;
        else j++;
      }
      out += src.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    let hit = null;
    for (const r of rules) {
      if (src.startsWith(r.from, i)) {
        const end = i + r.from.length;
        const next = src[end];
        const ok = end === src.length || !next || /[\s(){};,<>]/.test(next) || /[^\w\u0900-\u097f]/.test(next);
        if (ok) { hit = r; break; }
      }
    }
    if (hit) { out += hit.to; i += hit.from.length; }
    else { out += src[i]; i++; }
  }
  return out;
}

export function applyShaili(id, src) {
  const s = SHAILIS.find((x) => x.id === id);
  const rules = shailiRules(id);
  let working = src;
  if (s.layer === "romenagri" && id === "guru") return hindawiGuru(src);
  if (s.layer === "romenagri" && id !== "guru") {
    working = toRomenagriSource(src);
  }
  const host = applyRules(working, rules);
  return {
    shaili: id,
    host: s.host,
    layer: s.layer,
    filter: s.filter,
    rule_count: rules.length,
    invented_maps: false,
    romenagri: s.layer === "romenagri" ? working : undefined,
    out: host,
  };
}

export function loadBhasha(id) {
  const b = BHASHAS.find((x) => x.id === id);
  if (!b) throw new Error("unknown bhasha " + id);
  const rows = [];
  for (const line of fs.readFileSync(path.join(root, b.tsv), "utf8").split(/\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [native, romenagri, c] = line.split("\t");
    if (native === "native" || !native || !c) continue;
    rows.push({ native, romenagri, c });
  }
  return { ...b, rows };
}

export function applyBhasha(id, src) {
  const b = loadBhasha(id);
  const keyed = applyRules(src, b.rows.map((r) => ({ from: r.native, to: r.c })));
  const withIds = toRomenagriSource(keyed);
  return {
    bhasha: b.name,
    script: "Devanagari",
    tsv: b.tsv,
    keyword_only: !!b.keyword_only,
    keyword_count: b.rows.length,
    invented_maps: false,
    source: src,
    out: withIds,
  };
}

export function catalog() {
  return {
    shailis: SHAILIS.map((s) => ({ ...s, rules: shailiRules(s.id).length })),
    bhashas: BHASHAS,
  };
}
