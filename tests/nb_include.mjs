/**
 * समावेश must survive as #include <stdio.h>. Never strip angle-includes.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const ctx = { window: {}, globalThis: {}, console };
ctx.window = ctx;
ctx.globalThis = ctx;
vm.runInNewContext(fs.readFileSync("docs/engine/nb.js", "utf8"), ctx);
const strip = ctx.PANINI_NB.stripShailiPragma;

assert.equal(strip("#include <stdio.h>"), "#include <stdio.h>");
assert.equal(strip("<शैली गुरु>\n#include <stdio.h>").trim(), "#include <stdio.h>");
assert.ok(strip("<STYLE GURU>\nint main(){}").includes("int main()"));
assert.ok(!strip("<शैली गुरु>").includes("शैली"));

const src = fs.readFileSync("retrieved/legacy/Hindawi/samples/HindiC.uhin", "utf8");
assert.ok(src.includes("#समावेश"));
assert.ok(src.includes("मानकपन.स"));

const cpp = fs.readFileSync("examples/hindawi/HindiCPP.uhin", "utf8");
assert.ok(cpp.includes("<शैली श्रेणी>"));
assert.ok(cpp.includes("#समावेश"));
assert.ok(!/^\s*<!DOCTYPE html/i.test(cpp));
assert.ok(fs.existsSync("docs/demos/HindiCPP.uhin"));

console.log("ok   include_angle_brackets_kept");
console.log("ok   shaili_pragma_stripped");
console.log("ok   hindi_c_source_has_samavesh");
const B = JSON.parse(fs.readFileSync("docs/engine/bundle.json", "utf8"));
const rules = (B.shailis.guru.rules || []).slice().sort((a, b) => [...b.from].length - [...a.from].length);
let host = src;
for (const r of rules) {
  if (r.from) host = host.split(r.from).join(r.to);
}
host = strip(host);
assert.ok(host.includes("#include"), "host has #include");
assert.ok(host.includes("<stdio.h>"), "host keeps <stdio.h> angle include");
assert.ok(!host.includes("<!DOCTYPE"), "host is not HTML");
console.log("ok   guru_samavesh_becomes_include_stdio");
console.log("NB_INCLUDE_OK");
