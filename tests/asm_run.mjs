#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
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

const src = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/HindiASM.uhin"), "utf8");
const r = ctx.PANINI_NB.compile({ src, lang: "hindi", shaili: "yantra" });
let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra || ""); }
  else console.log("ok  ", name);
}
check("Romenagri lex used for yantra", r.usedRmn === true);
check("host has MOV", /MOV/.test(r.host), r.host.slice(0, 300));
check("host has EAX", /EAX/.test(r.host));
check("host has INT", /INT/.test(r.host));
check("string not eaten by PUSHA", /हिंदोस्तां|हिन्दोस्तां/.test(r.host));
const exec = ctx.PANINI_NB.run(r, "");
check("run ok", exec.ok, exec.out);
check("write syscall text", /सारे/.test(exec.out) || exec.out.length > 8, JSON.stringify(exec.out));
const java = fs.readFileSync(path.join(root, "retrieved/legacy/Hindawi/samples/HindiJAVA.uhin"), "utf8");
const j = ctx.PANINI_NB.compile({ src: java, lang: "hindi", shaili: "kritrima" });
const jr = ctx.PANINI_NB.run(j, "");
check("java println", /भारत/.test(jr.out), jr.out);
console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}`);
process.exit(fail ? 1 : 0);
