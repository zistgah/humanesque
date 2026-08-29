#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { catalog, applyShaili, applyBhasha, SHAILIS } from "../runtime/shailis.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cat = catalog();
console.log("SHAILIS");
for (const s of cat.shailis) console.log(`  ${s.id}\t${s.name}\t${s.host}\t${s.layer}\t${s.rules} rules\t${s.filter}`);
console.log("BHASHAS (Devanagari)");
for (const b of cat.bhashas) console.log(`  ${b.id}\t${b.name}\t${b.tsv}${b.keyword_only ? "\tkeyword-only" : ""}`);

const samples = {
  guru: "retrieved/legacy/Hindawi/samples/HindiC.uhin",
  praatha: "retrieved/legacy/Hindawi/samples/HindiBASIC.uhin",
  kritrima: "retrieved/legacy/Hindawi/samples/HindiJAVA.uhin",
  shabda: "retrieved/legacy/Hindawi/samples/HindiLEX.uhin",
  wyaaka: "retrieved/legacy/Hindawi/samples/HindiYACC.uhin",
  yantra: "retrieved/legacy/Hindawi/samples/HindiASM.uhin",
};
for (const s of SHAILIS) {
  const p = samples[s.id];
  const src = p
    ? fs.readFileSync(path.join(root, p), "utf8")
    : "पूर्णांक मुख्य(){ वापस 0; }";
  try {
    const r = applyShaili(s.id, src);
    const preview = String(r.c || r.out).split("\n").slice(0, 8).join(" / ");
    console.log(`\n[${s.id} → ${s.host}] rules=${r.rule_count}\n${preview}`);
  } catch (e) {
    console.log(`\n[${s.id}] FAIL ${e.message}`);
  }
}

console.log("\n--- Devanagari languages (C keywords, leftover IDs → Romenagri) ---");
const snippets = {
  hi: "यदि (1) { लौटाओ 0; }",
  ne: "यदि (1) { फर्काऊ 0; }",
  mr: "जर (1) { परत 0; }",
  sa: "यदि (1) { प्रत्यागम 0; }",
};
for (const [id, src] of Object.entries(snippets)) {
  const r = applyBhasha(id, src);
  console.log(`${r.bhasha}\t${src}  =>  ${r.out}`);
}
