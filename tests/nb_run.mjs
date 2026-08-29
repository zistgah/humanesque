#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Proves the notebook compiles then runs the HOST, not a canned demo.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "docs/engine/nb.js"), "utf8");
const bundle = JSON.parse(fs.readFileSync(path.join(root, "docs/engine/bundle.json"), "utf8"));
const ctx = {
  fetch: async () => ({ json: async () => bundle }),
  console,
};
vm.createContext(ctx);
vm.runInContext(code, ctx);
await ctx.PANINI_NB.load("engine/bundle.json");

const hindiC = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/HindiC.uhin"), "utf8");
const hindiB = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/HindiBASIC.uhin"), "utf8");
const teluguC = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/TeluguC.uhin"), "utf8");

let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}

const c = ctx.PANINI_NB.compile({ src: hindiC, lang: "hindi", shaili: "guru" });
check("HindiC Romenagri has mukhya", /mukhya/.test(c.romenagri), c.romenagri.slice(0, 180));
check("HindiC Romenagri has krama", /krama/.test(c.romenagri));
check("HindiC host contains int main", /int\s+main/.test(c.host), c.host.slice(0, 220));
check("HindiC host contains for", /\bfor\s*\(/.test(c.host), c.host.slice(0, 400));
check("HindiC host contains printf", /printf/.test(c.host));
check("HindiC host contains return", /return/.test(c.host));
const cr = ctx.PANINI_NB.run(c, "राम\n");
check("HindiC run ok", cr.ok, cr.out);
check("HindiC prints greeting", /नमस्ते राम/.test(cr.out), cr.out);
check("HindiC counts 1..10 from compiled for", /1\n2\n3\n4\n5\n6\n7\n8\n9\n10/.test(cr.out), cr.out);

const b = ctx.PANINI_NB.compile({ src: hindiB, lang: "hindi", shaili: "praatha" });
check("HindiBASIC host contains FOR", /\bFOR\b/.test(b.host), b.host.slice(0, 300));
check("HindiBASIC host contains PRINT", /\bPRINT\b/.test(b.host));
const br = ctx.PANINI_NB.run(b, "3");
check("HindiBASIC run ok", br.ok, br.out);
check("HindiBASIC diamond from compiled FOR", /&&&/.test(br.out) && /&/.test(br.out), br.out);

const t = ctx.PANINI_NB.compile({ src: teluguC, lang: "hindi", shaili: "guru" });
check("TeluguC flattens then compiles to main", /int\s+main/.test(t.host), t.host.slice(0, 220));
const tr = ctx.PANINI_NB.run(t, "టెస్ట్\n");
check("TeluguC run ok", tr.ok, tr.out);

console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
