/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Hindawi Shaili Guru pipeline, retrieved not reconstructed:
 *   Unicode Devanagari  --unicode.h-->  ACII
 *   ACII                --acii2rmn.c--> Romenagri (stack; implicit 'a', matras)
 *   Romenagri           --h2c.lex---->  ISO C
 * Strings stay UTF-8. Identifiers stay Romenagri (C-legal, reversible).
 * Gurmukhi enters the same ACII engine via Unicode name-projection (script hub),
 * then a Punjabi shaili table — not Hindi h2c, not Gurmukhi-as-Devanagari C.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyH2c } from "./shaili.js";
import { gurmukhiToDeva } from "./gurmukhi.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

let _uni, _acii;

function uniMap() {
  if (_uni) return _uni;
  const j = loadJson("retrieved/romenagri/tables/unicode_hin.json");
  if (j.invented) throw new Error("refusing invented unicode map");
  _uni = new Map(j.rows.map((r) => [r.unicode, r.acii]));
  return _uni;
}

function aciiRows() {
  if (_acii) return _acii;
  const j = loadJson("retrieved/romenagri/tables/acii_chrt.json");
  if (j.invented) throw new Error("refusing invented acii map");
  _acii = j.rows;
  return _acii;
}

/** Port of retrieved/romenagri/src/acii2rmn.c (stack, pop implicit a on matra). */
export function acii2rmn(tok) {
  const rows = aciiRows();
  let stack = "";
  const bytes = typeof tok === "string" ? Buffer.from(tok, "latin1") : Buffer.from(tok);
  for (let i = 0; i < bytes.length; i++) {
    const ch = bytes[i];
    let fnd = 0;
    for (const r of rows) {
      if (!r.acii_bytes.length) continue;
      if (r.acii_bytes[0] !== ch) continue;
      const rmn = r.romenagri;
      if (rmn.startsWith("^") && stack.length > 0) {
        stack = stack.slice(0, -1);
        if (rmn[1] === "z") stack += rmn.slice(1);
        else stack += rmn.slice(1);
      } else stack += rmn;
      fnd = 1;
      break;
    }
    if (!fnd) {
      if (ch >= 32 && ch < 127) stack += String.fromCharCode(ch);
    }
  }
  return stack;
}

export function devanagariToAcii(s) {
  const m = uniMap();
  const out = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0);
    if (m.has(cp)) out.push(m.get(cp));
  }
  return Buffer.from(out);
}

export function devanagariToRomenagri(s) {
  return acii2rmn(devanagariToAcii(s));
}

function mapIndicOutsideStrings(src, convert) {
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
    const cp = src.codePointAt(i);
    const isIndic = (cp >= 0x0900 && cp <= 0x097f) || (cp >= 0x0a00 && cp <= 0x0a7f);
    if (isIndic) {
      let j = i;
      while (j < src.length) {
        const c2 = src.codePointAt(j);
        if ((c2 >= 0x0900 && c2 <= 0x097f) || (c2 >= 0x0a00 && c2 <= 0x0a7f)) {
          j += c2 > 0xffff ? 2 : 1;
        } else break;
      }
      out += convert(src.slice(i, j));
      i = j;
      continue;
    }
    out += src[i];
    i++;
  }
  return out;
}

export function toRomenagriSource(src) {
  return mapIndicOutsideStrings(src, (span) => {
    const asDeva = gurmukhiToDeva(span);
    return devanagariToRomenagri(asDeva);
  });
}

export function hindawiGuru(src) {
  const romenagri = toRomenagriSource(src);
  const c = applyH2c(romenagri);
  return {
    invented_maps: false,
    pipeline: "unicode.h → acii2rmn.c → h2c.lex",
    source: src,
    romenagri,
    c,
  };
}

export function punjabiShaili(src) {
  const p = path.join(root, "retrieved/romenagri/langs/punjabi_c.tsv");
  const rows = [];
  for (const line of fs.readFileSync(p, "utf8").split(/\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [native, romenagriKw, c] = line.split("\t");
    if (native === "native" || !native || !c) continue;
    rows.push({ native, romenagri: romenagriKw, c });
  }
  // Keywords: native Gurmukhi column of the retrieved TSV (like h2c, but Punjabi words).
  let keyed = src;
  for (const r of rows.slice().sort((a, b) => b.native.length - a.native.length)) {
    keyed = keyed.split(r.native).join(r.c);
  }
  const romenagri = toRomenagriSource(src);
  const c = toRomenagriSource(keyed);
  return {
    invented_maps: false,
    pipeline: "Punjabi TSV native→C (shaili), leftover Gurmukhi --name-projection+unicode.h+acii2rmn--> Romenagri identifiers",
    note: "Same architecture as HindiC.uhin / gurucc. Not Gurmukhi→Devanagari as the language. Retrieved demo writes Romenagri + #define: gurmukhi_demo.c",
    source: src,
    romenagri,
    c,
    retrieved_demo: "retrieved/romenagri/demos/gurmukhi_demo.c",
  };
}
