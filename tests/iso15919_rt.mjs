#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * ISO 15919 retrieved table: Aran↔Deva via Latin hub. Not urdu_map.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iso = JSON.parse(fs.readFileSync(path.join(root, "docs/data/iso15919.json"), "utf8"));
const maps = JSON.parse(fs.readFileSync(path.join(root, "docs/engine/iso15919.json"), "utf8")).maps;
let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}
check("retrieved, not invented", iso.invented === false);
check("every Aran row has Deva", iso.aran_rows_with_deva === iso.aran_rows && iso.aran_rows >= 50);
check("Sinhala has ISO keys (name-projection cannot see AYANNA)", iso.per_script.Sinh.have_iso_key >= 50);
check("Tamil present", iso.per_script.Taml.glyphs_in_table >= 30);
check("NFKC folds Arabic presentation meem", "ﻡ".normalize("NFKC") === "م" || "ﻡ".normalize("NFKC").includes("م"));

const isoOf = maps.Aran;
const deyaOfIso = Object.create(null);
for (const [g, k] of Object.entries(maps.Deva)) {
  if (!deyaOfIso[k]) deyaOfIso[k] = g;
}
let ok = 0, tot = 0;
for (const [g, k] of Object.entries(isoOf)) {
  tot++;
  if (k && deyaOfIso[k]) ok++;
}
check("Aran glyphs reach Deva via ISO key (≥90%; residue named)", ok / tot >= 0.9 && tot >= 50, { ok, tot, residue: tot - ok });

console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
