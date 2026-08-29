#!/usr/bin/env node
/** Minimal debug adapter: tokenize + interpret, emit a step log (not DAP/DWARF). */
import fs from "node:fs";
import { lex } from "../../compiler/lexer.js";
import { runSource } from "../../runtime/interpreter.js";
import { runFrontend } from "../../runtime/foreign_front.js";

const file = process.argv[2];
const lang = process.argv[3] || "panini";
if (!file) {
  console.error("usage: node tools/panini-debug/adapter.mjs <file> [panini|python|c|rust|typescript|go|zig|fortran]");
  process.exit(2);
}
const src = fs.readFileSync(file, "utf8");
if (lang === "panini") {
  const tokens = lex(src, file);
  const steps = tokens.map((t, i) => ({ i, kind: t.kind, value: t.value, line: t.start?.line }));
  const { runtime } = await runSource(src, file);
  console.log(JSON.stringify({ lang, steps, prints: runtime.prints }, null, 2));
} else {
  const r = await runFrontend(lang, src);
  console.log(JSON.stringify({ lang, result: r, steps: "frontend-eval" }, null, 2));
}
