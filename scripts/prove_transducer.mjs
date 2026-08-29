#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import fs from "node:fs";
import { pa2c, proveNotMacro } from "../runtime/transducer.js";
import { hindawiGuru } from "../runtime/hindawi.js";

const pa = fs.readFileSync(new URL("../examples/punjabi_c.uhin", import.meta.url), "utf8");
const hi = fs.readFileSync(new URL("../retrieved/legacy/Hindawi/samples/HindiC.uhin", import.meta.url), "utf8");

console.log("=== HindiC.uhin (2004 bar) ===");
console.log(hindawiGuru(hi).c);

console.log("\n=== Punjabi Gurmukhi .uhin — lexer transducer, not #define ===");
const p = proveNotMacro(pa);
console.log("uses_define", p.uses_define);
console.log("C channel:\n" + p.c);
console.log("inverse (programmer surface):\n" + p.inverse);
console.log("nm inverse", p.nm);
console.log("rewritten diagnostic:", p.diagnostic);
console.log("map", p.map);

const demo = fs.readFileSync(new URL("../retrieved/romenagri/demos/gurmukhi_demo.c", import.meta.url), "utf8");
console.log("\n=== gurmukhi_demo.c is NOT done ===");
console.log("contains #define", /#define/.test(demo));
