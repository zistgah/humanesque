#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import { inventory, devaToPerso, persoToDeva, loadUrduMap } from "../runtime/perso_arabic.js";

console.log(JSON.stringify(inventory(), null, 2));
const m = loadUrduMap();
console.log("map rows", m.rows, "sample", m.fwd.filter((r) => r.deva === "क" || r.deva === "ख"));

const hi = fs.readFileSync(new URL("../retrieved/legacy/Hindawi/samples/HindiC.uhin", import.meta.url), "utf8");
const ur = fs.readFileSync(new URL("../retrieved/romenagri/langs/UrduC_sample.uhin", import.meta.url), "utf8");

const fwd = devaToPerso(hi);
console.log("\n=== HindiC.uhin --urdu_map.csv--> Perso-Arabic (script axis) ===");
console.log(fwd.perso);
console.log("\n=== retrieved UrduC_sample.uhin (manual 2000s presentation) ===");
console.log(ur);
const back = persoToDeva(ur);
console.log("\n=== UrduC_sample --reverse map--> Devanagari ===");
console.log(back.deva);
