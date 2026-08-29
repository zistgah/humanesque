#!/usr/bin/env node
/** Load and realize the constitutional spec as a running program. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "../compiler/parser.js";
import { Runtime, Interpreter } from "../runtime/interpreter.js";
import { display } from "../runtime/values.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = path.join(root, "spec/PANINI_SELF_HOSTING_SPEC.pni");
const source = fs.readFileSync(specPath, "utf8");
const ast = parse(source, specPath);

function walk(node, acc) {
  if (!node || typeof node !== "object") return acc;
  acc.kinds[node.kind] = (acc.kinds[node.kind] || 0) + 1;
  if (node.kind === "FunctionDecl" && node.name) acc.functions.push(node.name);
  if (node.kind === "Cycler") acc.cyclers.push(node.name);
  if (node.kind === "Module") acc.modules.push(node.name);
  if (node.kind === "TestDecl") acc.tests.push(node.name);
  if (node.kind === "FileBlock") acc.files.push(node.path);
  if (node.kind === "Artifact") acc.artifacts.push(node.name);
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (Array.isArray(v)) v.forEach((x) => walk(x, acc));
    else if (v && typeof v === "object" && v.kind) walk(v, acc);
  }
  return acc;
}

const census = walk(ast, {
  kinds: {},
  functions: [],
  cyclers: [],
  modules: [],
  tests: [],
  files: [],
  artifacts: [],
});

const runtime = new Runtime({ maxSteps: 20_000_000 });
const interp = new Interpreter(runtime);
const result = await interp.interpret(ast, { specMode: true, runMain: false });

const report = {
  status: "RUNNABLE",
  file: "spec/PANINI_SELF_HOSTING_SPEC.pni",
  functions_declared: census.functions.length,
  functions_registered: runtime.functions.size,
  modules: census.modules.filter(Boolean),
  cyclers: census.cyclers.filter(Boolean),
  tests: census.tests,
  files: census.files.filter(Boolean),
  artifacts: census.artifacts.filter(Boolean),
  result: display(result),
  theorem: "PANINI_CAN_EXPRESS_THE_LANGUAGE_REQUIRED_TO_BUILD_PANINI",
};

console.log("PANINI spec realization");
console.log("  functions declared ", report.functions_declared);
console.log("  functions live     ", report.functions_registered);
console.log("  modules            ", report.modules.join(", ") || "(none)");
console.log("  cyclers            ", report.cyclers.join(", ") || "(none)");
console.log("  tests              ", report.tests.join(", ") || "(none)");
console.log("  artifacts          ", report.artifacts.join(", ") || "(none)");
console.log("  status             ", report.status);

const outDir = path.join(root, "build");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "spec-run.json"), JSON.stringify(report, null, 2));
