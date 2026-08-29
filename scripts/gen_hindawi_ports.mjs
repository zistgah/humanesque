#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Generate script-projection and bhasha-projection samples. Retrieved tables only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BRAHMI, PERSO, projectScript, projectBhasha, port, catalog } from "../runtime/hindawi_port.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const samples = path.join(root, "retrieved/legacy/Hindawi/samples");
const outDir = path.join(root, "examples/hindawi");
fs.mkdirSync(path.join(outDir, "script"), { recursive: true });
fs.mkdirSync(path.join(outDir, "bhasha"), { recursive: true });

const SHAILI_FILES = {
  guru: "HindiC.uhin",
  praatha: "HindiBASIC.uhin",
  kritrima: "HindiJAVA.uhin",
  yantra: "HindiASM.uhin",
  shabda: "HindiLEX.uhin",
  wyaaka: "HindiYACC.uhin",
};

const SCRIPT_OF = {
  hindi: "devanagari", nepali: "devanagari", marathi: "devanagari", sanskrit: "devanagari",
  pali: "devanagari", prakrit: "devanagari",
  punjabi: "gurmukhi", bengali: "bengali", assamese: "bengali",
  gujarati: "gujarati", odia: "odia", tamil: "tamil",
  telugu: "telugu", kannada: "kannada", malayalam: "malayalam",
};

const hindiC = fs.readFileSync(path.join(samples, "HindiC.uhin"), "utf8");
const report = { invented_maps: false, script: [], bhasha: [], ports: [] };

for (const [shaili, file] of Object.entries(SHAILI_FILES)) {
  const src = fs.readFileSync(path.join(samples, file), "utf8");
  for (const lang of BRAHMI) {
    const script = SCRIPT_OF[lang];
    const projected = projectScript(src, script);
    const dest = path.join(outDir, "script", `${lang}_${shaili}.uhin`);
    fs.writeFileSync(dest, projected);
    report.script.push(path.relative(root, dest));
  }
}

for (const lang of [...BRAHMI, ...PERSO]) {
  let src;
  try { src = projectBhasha(hindiC, lang); }
  catch { continue; }
  const dest = path.join(outDir, "bhasha", `${lang}_guru.uhin`);
  fs.writeFileSync(dest, src);
  report.bhasha.push(path.relative(root, dest));
  try {
    const r = port(src, { lang, shaili: "guru" });
    report.ports.push({ lang, shaili: "guru", host: r.host, flatten_complete: r.flatten_complete, preview: r.host_text.slice(0, 120) });
  } catch (e) {
    report.ports.push({ lang, shaili: "guru", error: String(e) });
  }
}

fs.writeFileSync(path.join(outDir, "CATALOG.json"), JSON.stringify({ ...catalog(), generated: report }, null, 2));
console.log(JSON.stringify({ script: report.script.length, bhasha: report.bhasha.length, ports: report.ports.length }, null, 2));
