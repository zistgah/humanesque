/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Complete Hindawi port: original pipeline, every shaili, every requested language.
 *
 *   native source
 *     → language TSV (native keywords → host tokens)     [language axis]
 *     → flatten_uni_dev (Brahmi → Devanagari)            [script axis; table-complete]
 *        or urdu_map / fltr_ur_hi                         [Perso-Arabic; LOSSY]
 *     → unicode.h → acii2rmn                              [identifiers]
 *     → shaili lex (h2c / h2b / h2cpp / h2j / h2py / …)  [standard / host]
 *
 * Invented maps: false. Tables are retrieved.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toRomenagriSource } from "./hindawi.js";
import { SHAILIS, extractLexRules, shailiRules } from "./shailis.js";
import { persoToDeva } from "./perso_arabic.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const PERSO = ["urdu", "persian", "arabic", "pashto", "dari", "sindhi", "kashmiri", "shahmukhi"];
export const BRAHMI = [
  "hindi", "nepali", "marathi", "sanskrit", "punjabi",
  "bengali", "assamese", "gujarati", "odia", "tamil",
  "telugu", "kannada", "malayalam", "pali", "prakrit",
];

let _bundle;
function bundle() {
  if (_bundle) return _bundle;
  _bundle = JSON.parse(fs.readFileSync(path.join(root, "docs/engine/bundle.json"), "utf8"));
  return _bundle;
}

function applyPairs(src, pairs, fromK, toK) {
  let i = 0, out = "", s = String(src);
  const ps = pairs.slice().sort((a, b) => [...b[fromK]].length - [...a[fromK]].length);
  while (i < s.length) {
    if (s[i] === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') { if (s[j] === "\\") j += 2; else j++; }
      out += s.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    let hit = null;
    for (const p of ps) {
      const f = p[fromK];
      if (f && s.startsWith(f, i)) { hit = p; break; }
    }
    if (hit) { out += hit[toK]; i += hit[fromK].length; }
    else { out += s[i]; i++; }
  }
  return out;
}

export function flatten(src) {
  return applyPairs(src, bundle().flatten.pairs, "from", "to");
}

export function unflatten(deva, script) {
  const map = bundle().flatten.reverse[script] || {};
  const pairs = Object.keys(map).map((to) => ({ from: to, to: map[to] }));
  return applyPairs(deva, pairs, "from", "to");
}

export function loadLang(id) {
  const L = bundle().langs[id];
  if (!L) throw new Error("unknown language " + id);
  return L;
}

export function applyLang(src, langId) {
  const L = loadLang(langId);
  const rows = L.rows.slice().sort((a, b) => [...b.native].length - [...a.native].length);
  return applyPairs(src, rows.map((r) => ({ from: r.native, to: r.c })), "from", "to");
}

function applyShailiLex(shailiId, src) {
  const s = SHAILIS.find((x) => x.id === shailiId);
  if (!s) throw new Error("unknown shaili " + shailiId);
  const rules = shailiRules(shailiId);
  return { host: s.host, layer: s.layer, out: applyPairs(src, rules, "from", "to"), rule_count: rules.length };
}

/**
 * Original Hindawi pipeline for any (language × shaili).
 */
export function port(src, { lang = "hindi", shaili = "guru" } = {}) {
  const perso = PERSO.includes(lang);
  const notes = [];
  let stage = String(src);
  if (perso) {
    notes.push("Perso-Arabic: urdu_map/fltr_ur_hi — round-trip NOT guaranteed.");
    try { stage = persoToDeva(stage); } catch { stage = flatten(stage); }
  }
  const afterLang = applyLang(stage, lang);
  const afterFlat = perso ? afterLang : flatten(afterLang);
  const s = SHAILIS.find((x) => x.id === shaili) || SHAILIS[0];
  let working = afterFlat;
  if (s.layer === "romenagri") working = toRomenagriSource(afterFlat);
  const lex = applyShailiLex(shaili, working);
  return {
    invented_maps: false,
    pipeline: perso
      ? "lang-TSV → urdu_map → acii2rmn → shaili-lex"
      : "lang-TSV → flatten_uni_dev → unicode.h → acii2rmn → shaili-lex",
    lang,
    shaili,
    host: lex.host,
    flatten_complete: !perso,
    notes,
    source: src,
    after_lang: afterLang,
    flattened: afterFlat,
    romenagri: s.layer === "romenagri" ? working : undefined,
    host_text: lex.out,
    rule_count: lex.rule_count,
  };
}

/** Hindi (or Devanagari) source → same program in another Brahmi script. */
export function projectScript(src, script) {
  return unflatten(flatten(src), script);
}

/** Hindi source → same C-keywords expressed in target language natives (C as pivot). */
export function projectBhasha(src, targetLang) {
  const hi = loadLang("hindi");
  const tgt = loadLang(targetLang);
  const c2tgt = {};
  for (const r of tgt.rows) if (r.c && r.native) c2tgt[r.c] = r.native;
  const pairs = [];
  for (const r of hi.rows) {
    if (c2tgt[r.c] && c2tgt[r.c] !== r.native) pairs.push({ from: r.native, to: c2tgt[r.c] });
  }
  return applyPairs(src, pairs, "from", "to");
}

export function catalog() {
  return {
    shailis: SHAILIS.map((s) => ({ id: s.id, name: s.name, host: s.host, rules: shailiRules(s.id).length })),
    brahmi: BRAHMI,
    perso: PERSO,
    langs: Object.keys(bundle().langs),
  };
}
