#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Hebrew C viewed as Hindi C. Identifiers are a dictionary. Compile source unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "docs/engine/nb.js"), "utf8");
const bundle = JSON.parse(fs.readFileSync(path.join(root, "docs/engine/bundle.json"), "utf8"));
const ctx = { fetch: async () => ({ json: async () => bundle }), console };
vm.createContext(ctx);
vm.runInContext(code, ctx);
await ctx.PANINI_NB.load("engine/bundle.json");

const heb = `<शैली गुरु>
אם (ספירה)
  החזר ספירה;
`;
const r = ctx.PANINI_NB.projectView(heb, "hebrew", "hindi");
let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}
check("keyword אם → यदि", /यदि/.test(r.view), r.view);
check("keyword החזר → लौटाओ or return-mapped hindi", /लौटाओ|return/.test(r.view) || /लौटा/.test(r.view), r.view);
check("identifier in dictionary", r.dictionary.some((d) => d.original === "ספירה"), r.dictionary);
check("identifier not translated from thin air", r.dictionary.every((d) => d.view === d.slot || d.view === d.romenagri || d.view === d.original));
check("compile source unchanged", r.compile_source === heb);
const gloss = ctx.PANINI_NB.projectView(heb, "hebrew", "hindi", { "ספירה": "गिनती" });
const g = gloss.dictionary.find((d) => d.original === "ספירה");
check("glossary may supply a view name", g && g.view === "गिनती", gloss.dictionary);
check("still does not mutate compile source", gloss.compile_source === heb);
console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
