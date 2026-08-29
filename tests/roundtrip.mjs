#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Linguistics acceptance: name-projection round-trip + inventories.
 * Does not invent maps. Fails if retrieved Gurmukhi was overwritten empty.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rt = JSON.parse(fs.readFileSync(path.join(root, "docs/data/roundtrip.json"), "utf8"));
let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}

check("flatten_uni_dev 793 pairs (retrieved lex)", rt.flatten_pairs === 793, rt.flatten_pairs);
check("9 Brahmi reverse scripts in flatten", rt.flatten_reverse.length === 9);
check("name-projection tables 74", rt.nameproj_total === 74);
check("name-projection nonzero >= 50", rt.nameproj_nonzero >= 50, rt.nameproj_nonzero);
const gu = rt.nameproj_tables.find((t) => t.file === "gurmukhi_to_deva.tsv");
check("Gurmukhi retrieved rows kept", gu && gu.n >= 60, gu);
const rates = rt.nameproj_tables.filter((t) => t.n > 0);
check("every nonempty nameproj table round-trips uniquely", rates.every((t) => t.rate === 1), rates.filter((t) => t.rate !== 1).slice(0, 5));
check("Hebrew direct inventory", rt.inventories.hebrew >= 80, rt.inventories.hebrew);
check("Phoenician direct inventory", rt.inventories.phoenician >= 20);
check("Cuneiform signs inventoried, no language keywords claimed", rt.inventories.cuneiform_signs >= 900);
check("Egyptian hieroglyphs inventoried", rt.inventories.egyptian_hieroglyphs >= 900);
check("urdu_map exists and is lossy (collisions named)", rt.urdu_map_rows >= 80 && rt.urdu_deva_collisions >= 1);
check("27 language TSVs not reported as 7000", rt.keywords.length === 27);
const hi = rt.keywords.find((k) => k.lang === "hindi");
check("Hindi keyword natives unique", hi && hi.native_unique);

const heb = fs.readFileSync(path.join(root, "docs/linguist/semitic/hebrew_direct.tsv"), "utf8");
check("Hebrew TSV is NOT a Devanagari hub", /NOT a Devanagari hub/.test(heb));
check("no fake Akkadian keywords file", !fs.existsSync(path.join(root, "docs/linguist/undeciphered/akkadian_c.tsv")));

console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
