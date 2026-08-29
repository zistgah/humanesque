#!/usr/bin/env node
/**
 * Build dist/hindawi — local, configure/make, 22 scheduled + retrieved others.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Invented maps: false. Script from flatten reverse. Keywords from retrieved TSV or Hindi hub (labelled).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAHMI, PERSO, projectScript, projectBhasha, catalog, flatten } from "../runtime/hindawi_port.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist/hindawi");
const samples = path.join(root, "retrieved/legacy/Hindawi/samples");

const SCHEDULED = [
  { id: "assamese", iso: "as", script: "bengali", family: "brahmi", keywords: "tsv" },
  { id: "bengali", iso: "bn", script: "bengali", family: "brahmi", keywords: "tsv" },
  { id: "bodo", iso: "brx", script: "devanagari", family: "brahmi", keywords: "hindi-hub" },
  { id: "dogri", iso: "doi", script: "devanagari", family: "brahmi", keywords: "hindi-hub" },
  { id: "gujarati", iso: "gu", script: "gujarati", family: "brahmi", keywords: "tsv" },
  { id: "hindi", iso: "hi", script: "devanagari", family: "brahmi", keywords: "tsv+shaili" },
  { id: "kannada", iso: "kn", script: "kannada", family: "brahmi", keywords: "tsv" },
  { id: "kashmiri", iso: "ks", script: "perso-arabic", family: "perso", keywords: "tsv", roundtrip: false },
  { id: "konkani", iso: "kok", script: "devanagari", family: "brahmi", keywords: "hindi-hub" },
  { id: "maithili", iso: "mai", script: "devanagari", family: "brahmi", keywords: "hindi-hub" },
  { id: "malayalam", iso: "ml", script: "malayalam", family: "brahmi", keywords: "tsv" },
  { id: "manipuri", iso: "mni", script: "meitei-mayek", family: "brahmi", keywords: "awaiting-csv" },
  { id: "marathi", iso: "mr", script: "devanagari", family: "brahmi", keywords: "tsv" },
  { id: "nepali", iso: "ne", script: "devanagari", family: "brahmi", keywords: "tsv" },
  { id: "odia", iso: "or", script: "odia", family: "brahmi", keywords: "tsv" },
  { id: "punjabi", iso: "pa", script: "gurmukhi", family: "brahmi", keywords: "tsv" },
  { id: "sanskrit", iso: "sa", script: "devanagari", family: "brahmi", keywords: "tsv-keyword-only" },
  { id: "santali", iso: "sat", script: "ol-chiki", family: "brahmi", keywords: "awaiting-csv" },
  { id: "sindhi", iso: "sd", script: "perso-arabic", family: "perso", keywords: "tsv", roundtrip: false },
  { id: "tamil", iso: "ta", script: "tamil", family: "brahmi", keywords: "tsv" },
  { id: "telugu", iso: "te", script: "telugu", family: "brahmi", keywords: "tsv" },
  { id: "urdu", iso: "ur", script: "perso-arabic", family: "perso", keywords: "tsv", roundtrip: false },
];

const SCRIPT_OF = {
  hindi: "devanagari", nepali: "devanagari", marathi: "devanagari", sanskrit: "devanagari",
  pali: "devanagari", prakrit: "devanagari", bodo: "devanagari", dogri: "devanagari",
  konkani: "devanagari", maithili: "devanagari",
  punjabi: "gurmukhi", bengali: "bengali", assamese: "bengali",
  gujarati: "gujarati", odia: "odia", tamil: "tamil",
  telugu: "telugu", kannada: "kannada", malayalam: "malayalam",
};

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }

function header(lang, note) {
  return `/* Hindawi port — ${lang}\n * ${note}\n * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later\n * Invented maps: false\n */\n`;
}

const hindiC = fs.readFileSync(path.join(samples, "HindiC.uhin"), "utf8");
const hindiCpp = fs.readFileSync(path.join(root, "examples/hindawi/HindiCPP.uhin"), "utf8");
const hindiBas = fs.readFileSync(path.join(samples, "HindiBASIC.uhin"), "utf8");

mkdirp(path.join(dist, "examples"));
mkdirp(path.join(dist, "bin"));
mkdirp(path.join(dist, "share/langs"));

const report = { invented_maps: false, examples: [], awaiting: [] };

for (const L of SCHEDULED) {
  const dir = path.join(dist, "examples", L.id);
  mkdirp(dir);
  if (L.keywords === "awaiting-csv") {
    mkdirp(dir);
    fs.writeFileSync(path.join(dir, "README.txt"), header(L.id, "No retrieved flatten/keyword table. Linguists: deposits/csv. Not invented."));
    report.awaiting.push(L.id);
    continue;
  }
  let guru = hindiC;
  const script = SCRIPT_OF[L.id];
  if (script && script !== "devanagari") {
    try { guru = projectScript(hindiC, script); } catch { /* keep hindi */ }
  }
  if (L.keywords === "tsv" || L.keywords === "tsv-keyword-only" || L.keywords === "tsv+shaili") {
    try { guru = projectBhasha(guru, L.id); } catch { /* hub */ }
  }
  const note = L.roundtrip === false
    ? "Perso-Arabic. Round-trip NOT guaranteed."
    : (L.keywords === "hindi-hub"
      ? "Devanagari hub; Hindi guru keywords until deposits/csv accepted."
      : "Retrieved TSV + flatten reverse.");
  fs.writeFileSync(path.join(dir, "README.txt"), header(L.id, note));
  fs.writeFileSync(path.join(dir, "guru.uhin"), guru.replace(/^# Language-axis[\s\S]*?\n(?=<)/, ""));
  if (L.id === "hindi") {
    fs.writeFileSync(path.join(dir, "shraeni.uhin"), hindiCpp);
    fs.writeFileSync(path.join(dir, "praatha.uhin"), hindiBas);
  }
  report.examples.push(L.id);
}

fs.writeFileSync(path.join(dist, "share/registry.json"), JSON.stringify({
  copyright: "Copyright (C) 1993-2026 Abhishek Choudhary",
  license: "GPL-3.0-or-later",
  invented_maps: false,
  kernel: "one: flatten + romenagri + shaili lex + cc",
  scheduled_22: SCHEDULED,
  catalog: catalog(),
  brahmi: BRAHMI,
  perso: PERSO,
}, null, 2));

console.log(JSON.stringify({ examples: report.examples.length, awaiting: report.awaiting, dist }, null, 2));
