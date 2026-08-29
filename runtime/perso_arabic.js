/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Perso-Arabic script axis from the *manual* legacy maps.
 * retrieved/legacy/Romenagri/urdu_map.csv  — Devanagari ↔ Nastaliq skeleton
 * retrieved/legacy/Romenagri/fltr_ur_hi    — reverse sed (2000s, hand)
 * retrieved/legacy/Romenagri/arabic-generic.csv — Unicode presentation forms
 * retrieved/legacy/Romenagri/hindawi_tashkil.txt — harakat experiment
 *
 * This is SCRIPT, not language (urdu_c.tsv) and not #define urdu_demo.c.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAP = path.join(root, "retrieved/legacy/Romenagri/urdu_map.csv");

export function loadUrduMap() {
  const fwd = [];
  const rev = [];
  for (const line of fs.readFileSync(MAP, "utf8").split(/\n/)) {
    if (!line.trim()) continue;
    const cols = line.split(",");
    const len = Number(cols[0] || 0);
    const deva = (cols[1] || "").trim();
    if (!deva) continue;
    const forms = [];
    for (let i = 2; i < cols.length; i++) {
      for (const p of String(cols[i]).split(";")) {
        const s = p.trim();
        if (s) forms.push(s);
      }
    }
    if (!forms.length) continue;
    fwd.push({ deva, arab: forms[0], forms, n: len || [...deva].length });
    for (const f of forms) rev.push({ arab: f, deva, n: [...f].length });
  }
  fwd.sort((a, b) => [...b.deva].length - [...a.deva].length);
  rev.sort((a, b) => b.n - a.n);
  return {
    source: "retrieved/legacy/Romenagri/urdu_map.csv",
    invented: false,
    fwd,
    rev,
    rows: fwd.length,
  };
}

function apply(src, pairs, fromKey, toKey) {
  let i = 0;
  let out = "";
  const s = String(src);
  while (i < s.length) {
    let hit = null;
    for (const r of pairs) {
      const from = r[fromKey];
      if (from && s.startsWith(from, i)) { hit = r; break; }
    }
    if (hit) {
      out += hit[toKey];
      i += hit[fromKey].length;
    } else {
      out += s[i];
      i += 1;
    }
  }
  return out;
}

export function devaToPerso(src) {
  const m = loadUrduMap();
  return {
    invented_maps: false,
    axis: "script",
    map: m.source,
    source: src,
    perso: apply(src, m.fwd, "deva", "arab"),
  };
}

export function persoToDeva(src) {
  const m = loadUrduMap();
  return {
    invented_maps: false,
    axis: "script",
    map: m.source,
    source: src,
    reverse_filter: "retrieved/legacy/Romenagri/fltr_ur_hi",
    deva: apply(src, m.rev, "arab", "deva"),
  };
}

export function inventory() {
  const m = loadUrduMap();
  return {
    urdu_map_rows: m.rows,
    fltr_ur_hi: "retrieved/legacy/Romenagri/fltr_ur_hi",
    arabic_generic: "retrieved/legacy/Romenagri/arabic-generic.csv",
    tashkil: "retrieved/legacy/Romenagri/hindawi_tashkil.txt",
    flatten: "retrieved/legacy/Romenagri/flatten_uni_dev.lex",
    urduC_sample: "retrieved/romenagri/langs/UrduC_sample.uhin",
    urdu_language_tsv: "retrieved/romenagri/langs/urdu_c.tsv",
    persian_language_tsv: "retrieved/romenagri/langs/persian_c.tsv",
    arabic_language_tsv: "retrieved/romenagri/langs/arabic_c.tsv",
    not_localization: "retrieved/romenagri/demos/urdu_demo.c  (#define agar if — same failure as gurmukhi_demo.c)",
    note: "Abjad underspecification is residue, not a bug to invent away. Tashkil is optional vowelization.",
  };
}
