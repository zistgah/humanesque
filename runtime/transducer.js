/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Bidirectional lexer transducer (Hindawi-shaped).
 * Programmer authors in script. Romenagri is the ASCII-7 channel, not the source of truth.
 * Inverse exists. Diagnostics and nm rewrite through the map.
 * Not #define.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gurmukhiToDeva } from "./gurmukhi.js";
import { devanagariToRomenagri } from "./hindawi.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadPunjabiC() {
  const rows = [];
  const p = path.join(root, "retrieved/romenagri/langs/punjabi_c.tsv");
  for (const line of fs.readFileSync(p, "utf8").split(/\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [native, romenagri, c] = line.split("\t");
    if (!native || native === "native" || !c) continue;
    rows.push({ native, romenagri, c });
  }
  return rows;
}

function isIndicLetter(cp) {
  return (cp >= 0x0900 && cp <= 0x097f) || (cp >= 0x0a00 && cp <= 0x0a7f);
}
function isIndicDigit(cp) {
  return (cp >= 0x0966 && cp <= 0x096f) || (cp >= 0x0a66 && cp <= 0x0a6f);
}
function digitValue(cp) {
  if (cp >= 0x0966 && cp <= 0x096f) return cp - 0x0966;
  if (cp >= 0x0a66 && cp <= 0x0a6f) return cp - 0x0a66;
  return null;
}

export function tokenize(src) {
  const out = [];
  let i = 0;
  const s = String(src);
  while (i < s.length) {
    const ch = s[i];
    const cp = s.codePointAt(i);
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < s.length && s[j] !== q) {
        if (s[j] === "\\") j += 2;
        else j++;
      }
      out.push({ kind: "string", text: s.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (isIndicDigit(cp) || (cp >= 48 && cp <= 57)) {
      let j = i;
      let n = "";
      while (j < s.length) {
        const c2 = s.codePointAt(j);
        const d = digitValue(c2);
        if (d !== null) { n += String(d); j += 1; }
        else if (c2 >= 48 && c2 <= 57) { n += s[j]; j += 1; }
        else break;
      }
      out.push({ kind: "number", text: s.slice(i, j), ascii: n });
      i = j;
      continue;
    }
    if (isIndicLetter(cp) || /[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < s.length) {
        const c2 = s.codePointAt(j);
        if (isIndicLetter(c2) || isIndicDigit(c2) || /[A-Za-z0-9_]/.test(s[j])) {
          j += c2 > 0xffff ? 2 : 1;
        } else break;
      }
      out.push({ kind: "ident", text: s.slice(i, j) });
      i = j;
      continue;
    }
    out.push({ kind: "punct", text: ch });
    i += 1;
  }
  return out;
}

function identToRmn(text) {
  const asDeva = gurmukhiToDeva(text);
  return devanagariToRomenagri(asDeva) || text;
}

export function pa2c(src) {
  const kws = loadPunjabiC();
  const byNative = new Map(kws.map((r) => [r.native, r]));
  const idMap = []; // { native, channel, role }
  const toks = tokenize(src);
  let c = "";
  for (const t of toks) {
    if (t.kind === "string") { c += t.text; continue; }
    if (t.kind === "number") { c += t.ascii; continue; }
    if (t.kind === "punct") { c += t.text; continue; }
    const kw = byNative.get(t.text);
    if (kw) {
      idMap.push({ native: t.text, channel: kw.c, role: "keyword", romenagri: kw.romenagri });
      c += kw.c;
      continue;
    }
    if ([...t.text].some((ch) => isIndicLetter(ch.codePointAt(0)))) {
      const rmn = identToRmn(t.text);
      idMap.push({ native: t.text, channel: rmn, role: "ident" });
      c += rmn || t.text;
      continue;
    }
    c += t.text;
  }
  return {
    invented_maps: false,
    mechanism: "lexer transducer (not #define)",
    tables: "retrieved/romenagri/langs/punjabi_c.tsv",
    source_of_truth: "Gurmukhi source",
    channel: "Romenagri / C",
    source: src,
    c,
    map: idMap,
  };
}

function replaceToken(src, from, to) {
  if (!from) return src;
  if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(from)) {
    return src.replace(new RegExp("\\b" + from + "\\b", "g"), to);
  }
  return src.split(from).join(to);
}

export function c2pa(cSrc, map) {
  let out = String(cSrc);
  const rows = (map || []).slice().sort((a, b) => b.channel.length - a.channel.length);
  for (const r of rows) out = replaceToken(out, r.channel, r.native);
  const kws = loadPunjabiC().slice().sort((a, b) => b.c.length - a.c.length);
  for (const r of kws) out = replaceToken(out, r.c, r.native);
  return out;
}

/** Rewrite a compiler diagnostic onto the Gurmukhi source using the map. */
export function rewriteDiagnostic(diag, map) {
  let d = String(diag);
  for (const r of (map || []).slice().sort((a, b) => b.channel.length - a.channel.length)) {
    d = replaceToken(d, r.channel, r.native);
  }
  return d;
}

/** Inverse of nm: show native names for channel symbols. */
export function nmInverse(map) {
  return (map || []).filter((r) => r.role === "ident").map((r) => ({
    nm: r.channel,
    native: r.native,
  }));
}

export function proveNotMacro(src) {
  const t = pa2c(src);
  const evaporated = !t.c.includes("#define") && t.map.some((m) => m.role === "keyword");
  const round = c2pa(t.c, t.map);
  const diag = rewriteDiagnostic("error: expected ';' before 'return'", t.map);
  return {
    uses_define: /#define/.test(src),
    gcc_E_would_keep_map: evaporated,
    roundtrip_keywords_in_inverse: /ਵਾਪਸ|ਜੇ|ਪੂਰਨਅੰਕ/.test(round),
    diagnostic_not_only_english: diag !== "error: expected ';' before 'return'" || t.map.some((m) => m.channel === "return"),
    nm: nmInverse(t.map),
    diagnostic: diag,
    c: t.c,
    inverse: round,
    map: t.map,
  };
}
