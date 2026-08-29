#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { port, projectScript, flatten, BRAHMI } from "../runtime/hindawi_port.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hindiC = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/HindiC.uhin"), "utf8");
const teluguC = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/TeluguC.uhin"), "utf8");
const hindiB = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/HindiBASIC.uhin"), "utf8");

let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}

check("flatten TeluguC contains पूर्णांक", flatten(teluguC).includes("पूर्णांक"));
check("flatten TeluguC contains मुख्य", flatten(teluguC).includes("मुख्य"));

const hi = port(hindiC, { lang: "hindi", shaili: "guru" });
check("hindi guru emits int or main or for", /int|main|for|printf|return/.test(hi.host_text), hi.host_text.slice(0, 200));

const te = port(teluguC, { lang: "hindi", shaili: "guru" });
check("telugu script + hindi lang + guru", /int|main|for|printf/.test(te.host_text), te.host_text.slice(0, 200));

const pa = fs.existsSync(path.join(root, "examples/punjabi_c.uhin"))
  ? fs.readFileSync(path.join(root, "examples/punjabi_c.uhin"), "utf8")
  : "";
if (pa) {
  const r = port(pa, { lang: "punjabi", shaili: "guru" });
  check("punjabi guru", /int|main|return|for|printf/.test(r.host_text), r.host_text.slice(0, 200));
}

const pb = port(hindiB, { lang: "hindi", shaili: "praatha" });
check("hindi praatha PRINT/FOR/INPUT", /PRINT|FOR|INPUT|NEXT/.test(pb.host_text), pb.host_text.slice(0, 200));

for (const lang of ["nepali", "marathi", "sanskrit", "bengali", "tamil"]) {
  const r = port(projectScript(hindiC, lang === "bengali" ? "bengali" : lang === "tamil" ? "tamil" : "devanagari"), { lang, shaili: "guru" });
  check(lang + " guru pipeline runs", r.host_text.length > 20, r.notes.join(";"));
}

const ur = port(hindiC, { lang: "urdu", shaili: "guru" });
check("urdu guru lossy flagged", ur.flatten_complete === false);

console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
