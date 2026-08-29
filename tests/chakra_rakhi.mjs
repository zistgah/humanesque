#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "apps/project-ilm/chakra/src/chakra-core.js"), "utf8");
const ctx = { module: { exports: {} }, console };
ctx.exports = ctx.module.exports;
vm.createContext(ctx);
vm.runInContext(code, ctx);
const C = ctx.module.exports;
let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}
check("retrieved version 1.4.1", C.version === "1.4.1", C.version);
const ev = C.annualEvents(2026);
const rak = ev.filter((e) => /Rak/.test(e.name));
check("Rakṣā Bandhana in 2026", rak.length === 1, rak);
check("date is 2026-08-28", rak[0] && rak[0].date === "2026-08-28", rak[0]);
check("note is Śrāvaṇa pūrṇimā", rak[0] && /Śrāvaṇa/.test(rak[0].note));
const eclipse = ev.filter((e) => e.date === "2026-08-28" && /eclipse/i.test(e.name));
check("same-day lunar eclipse computed", eclipse.length >= 1, eclipse);
check("PANINI module present", fs.existsSync(path.join(root, "languages/chakra.pni")));
check("labels view not a new festival", JSON.parse(fs.readFileSync(path.join(root, "docs/chakra/labels.json"), "utf8")).festivals["Rakṣā Bandhana"].hi === "रक्षा बंधन");
console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
