#!/usr/bin/env node
/** Stage-0 bootstrap: verify JS toolchain, examples, and PANINI-expressed lexer. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "../compiler/compile.js";
import { runSource } from "../runtime/interpreter.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const stages = [];

function record(stage, ok, detail) {
  stages.push({ stage, ok, detail, at: new Date().toISOString() });
  console.log(`[${ok ? "ok" : "FAIL"}] ${stage} — ${detail}`);
}

const hello = fs.readFileSync(path.join(root, "examples/hello.pni"), "utf8");
const compiled = compile(hello, { filename: "hello.pni", target: "json" });
record("stage-0 compile hello", compiled.success, `ir functions=${compiled.ir.functions.length}`);

const ran = await runSource(hello, "hello.pni");
record("stage-0 run hello", ran.runtime.prints.includes("Hello, PANINI"), ran.runtime.prints.join(" | "));

const lexerSrc = fs.readFileSync(path.join(root, "compiler/lexer.pni"), "utf8");
const compilerSrc = fs.readFileSync(path.join(root, "compiler/compiler.pni"), "utf8");
const combined = lexerSrc + "\n" + compilerSrc;
const self = await runSource(combined, "compiler.pni");
record("stage-1 panini lexer/compiler", unwrapOk(self), displayish(self.result));

const outDir = path.join(root, "build");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "hello.ir.json"), compiled.binary);
fs.writeFileSync(
  path.join(outDir, "bootstrap-evidence.json"),
  JSON.stringify({ version: "0.1.0", implementation: "js-stage-0", stages }, null, 2),
);
record("stage-0 evidence", true, path.join(outDir, "bootstrap-evidence.json"));

if (stages.some((s) => !s.ok)) process.exit(1);

function unwrapOk(run) {
  const v = run.result;
  return v && (v.value > 0 || v.value === true);
}

function displayish(v) {
  if (v && typeof v === "object" && "value" in v) return String(v.value);
  return String(v);
}
