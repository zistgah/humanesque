/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Punjabi / Gurmukhi port of Hindawi localization.
 * Script: Unicode name-projection GURMUKHI → DEVANAGARI (not a handmade abugida).
 * Language: retrieved langs/punjabi_c.tsv (native, romenagri, c).
 * Same architecture as Shaili Guru: script layer ⊥ keyword/Romenagri layer ⊥ host C.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadTsvMap() {
  const p = path.join(root, "retrieved/romenagri/langs/punjabi_c.tsv");
  const rows = [];
  for (const line of fs.readFileSync(p, "utf8").split(/\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [native, romenagri, c] = line.split("\t");
    if (native === "native" || !native || !c) continue;
    rows.push({ native, romenagri, c });
  }
  return rows;
}

function loadScriptMap() {
  const p = path.join(root, "retrieved/romenagri/tables/gurmukhi_to_deva.tsv");
  const map = new Map();
  for (const line of fs.readFileSync(p, "utf8").split(/\n/)) {
    if (!line || line.startsWith("#") || line.startsWith("gurmukhi")) continue;
    const [g, d] = line.split("\t");
    if (g && d) map.set(g, d);
  }
  return map;
}

let _kw, _script;

export function punjabiKeywords() {
  return _kw || (_kw = loadTsvMap());
}
export function gurmukhiToDevaMap() {
  return _script || (_script = loadScriptMap());
}

export function gurmukhiToDeva(src) {
  const m = gurmukhiToDevaMap();
  return [...String(src)].map((ch) => m.get(ch) || ch).join("");
}

export function punjabiToRomenagri(src) {
  let out = String(src);
  const rows = punjabiKeywords().slice().sort((a, b) => b.native.length - a.native.length);
  for (const r of rows) out = out.split(r.native).join(r.romenagri);
  return out;
}

export function punjabiToC(src) {
  let out = String(src);
  const rows = punjabiKeywords().slice().sort((a, b) => b.native.length - a.native.length);
  for (const r of rows) out = out.split(r.native).join(r.c);
  return out;
}

/** Full Hindawi-shaped port: Gurmukhi source → Devanagari (script) and C (host). */
export function portPunjabi(src) {
  return {
    invented_maps: false,
    script_method: "Unicode name-projection GURMUKHI→DEVANAGARI",
    keyword_source: "retrieved/romenagri/langs/punjabi_c.tsv",
    gurmukhi: src,
    devanagari: gurmukhiToDeva(src),
    romenagri: punjabiToRomenagri(src),
    c: punjabiToC(src),
  };
}
