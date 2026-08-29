#!/usr/bin/env node
/**
 * Stages 0–6 bootstrap.
 *   0  JS host
 *   1  PANINI lexer/parser/AST (src/panini)
 *   2  PANINI typechecker
 *   3  PANINI IR / lowering
 *   4  PANINI optimizer / codegen
 *   5  compiler compiles compiler (host-run PANINI → IR A; IR VM → IR B)
 *   6  generation B compiles compiler → IR C; B == C
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile as jsCompile } from "../compiler/compile.js";
import { Runtime, Interpreter } from "../runtime/interpreter.js";
import { runIrCompile } from "../runtime/irvm.js";
import { compilerSource, deepPlain, stableStringify } from "./load_compiler.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = compilerSource(root);
const stages = [];

function record(stage, ok, detail) {
  stages.push({ stage, ok, detail, at: new Date().toISOString() });
  console.log(`[${ok ? "ok" : "FAIL"}] ${stage} — ${detail}`);
}

const sample = "FUNCTION f(x) RETURN x + 1 END";
const jsSample = jsCompile(sample, { filename: "sample.pni" });
record("stage-0 js-compile-sample", jsSample.success, `functions=${jsSample.ir.functions.length}`);

const runtime = new Runtime({ maxSteps: 20_000_000 });
const interp = new Interpreter(runtime);
const ast = (await import("../compiler/parser.js")).parse(src, "compiler-bundle.pni");
await interp.interpret(ast, { runMain: false });
const compileFn = interp.global.tryGet("compile") || interp.runtime.functions.get("compile");
if (!compileFn) {
  record("stage-1 load", false, "compile() not defined");
} else {
  record("stage-1 load", true, `functions registered=${interp.runtime.functions.size}`);
}

const genAwrap = await interp.callValue(compileFn, [(await import("../runtime/values.js")).wrap(src)], interp.global);
const genA = deepPlain(genAwrap);
const okA = !!(genA && genA.success && genA.ir && genA.ir.functions);
record("stage-1..4 panini-compile(sample-path)", okA, okA
  ? `tokens=${genA.token_count} functions=${genA.function_count} steps=${runtime.steps}`
  : String(genA));

let genB = null;
let genC = null;
let sameBC = false;
let sameAB = false;

if (okA) {
  try {
    const b = runIrCompile(genA.ir, src);
    genB = b.result;
    record("stage-5 ir-vm compile compiler", !!(genB && genB.success), genB
      ? `functions=${genB.function_count}`
      : "no result");
  } catch (e) {
    record("stage-5 ir-vm compile compiler", false, e.message);
  }
}

if (genB && genB.ir) {
  sameAB = stableStringify(genA.ir) === stableStringify(genB.ir);
  record("stage-5 compare A vs B", sameAB, sameAB ? "identical IR" : "IR differs (host vs VM lowering); continuing");
  try {
    const c = runIrCompile(genB.ir, src);
    genC = c.result;
    sameBC = stableStringify(genB.ir) === stableStringify(genC.ir);
    record("stage-6 generation C", !!(genC && genC.success), genC ? `functions=${genC.function_count}` : "no result");
    record("stage-6 B == C", sameBC, sameBC ? "fixed point" : "mismatch");
  } catch (e) {
    record("stage-6 generation C", false, e.message);
  }
}

let sampleFromA = null;
try {
  sampleFromA = okA ? runIrCompile(genA.ir, sample).result : null;
  record("stage-4 codegen run sample", !!(sampleFromA && sampleFromA.success && sampleFromA.function_count === 1),
    sampleFromA ? `fn=${sampleFromA.function_count}` : "fail");
} catch (e) {
  record("stage-4 codegen run sample", false, e.message);
}

const specSrc = fs.readFileSync(path.join(root, "spec/PANINI_SELF_HOSTING_SPEC.pni"), "utf8");
try {
  const specAst = (await import("../compiler/parser.js")).parse(specSrc, "spec.pni");
  const specRt = new Runtime({ maxSteps: 20_000_000 });
  const specI = new Interpreter(specRt);
  await specI.interpret(specAst, { specMode: true, runMain: false });
  record("stage-6 spec-runnable", specRt.functions.size > 0,
    `live_functions=${specRt.functions.size}`);
} catch (e) {
  record("stage-6 spec-runnable", false, e.message);
}

if (okA && compileFn) {
  try {
    const { wrap } = await import("../runtime/values.js");
    const specComp = deepPlain(await interp.callValue(compileFn, [wrap(specSrc)], interp.global));
    record("stage-6 spec-selfhost-compile", !!(specComp && specComp.success),
      specComp ? `tokens=${specComp.token_count} functions=${specComp.function_count}` : "fail");
  } catch (e) {
    record("stage-6 spec-selfhost-compile", false, e.message);
  }
}

const allOk = stages.filter((s) => s.stage.startsWith("stage-6") || s.stage.startsWith("stage-5 ir") || s.stage.startsWith("stage-1") || s.stage.startsWith("stage-4")).every((s) => s.ok)
  && sameBC;

const evidence = {
  version: "0.1.0",
  implementation: "js-stage-0 + panini-src stages 1-6",
  theorem: "PANINI_CAN_EXPRESS_THE_LANGUAGE_REQUIRED_TO_BUILD_PANINI",
  status: sameBC ? "VERIFIED" : "UNRESOLVED",
  generation_a_functions: genA?.function_count ?? null,
  generation_b_functions: genB?.function_count ?? null,
  generation_c_functions: genC?.function_count ?? null,
  a_equals_b: sameAB,
  b_equals_c: sameBC,
  stages,
  provenance: {
    created_by: "scripts/selfhost.mjs",
    created_at: new Date().toISOString(),
    epistemic_status: sameBC ? "VERIFIED" : "UNRESOLVED",
  },
};

const outDir = path.join(root, "build");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "selfhost-evidence.json"), JSON.stringify(evidence, null, 2));
if (genA?.ir) fs.writeFileSync(path.join(outDir, "compiler.genA.json"), JSON.stringify(genA.ir));
if (genB?.ir) fs.writeFileSync(path.join(outDir, "compiler.genB.json"), JSON.stringify(genB.ir));
if (genC?.ir) fs.writeFileSync(path.join(outDir, "compiler.genC.json"), JSON.stringify(genC.ir));
console.log(JSON.stringify({ status: evidence.status, b_equals_c: sameBC, a_equals_b: sameAB, fn: genA?.function_count }, null, 2));
if (!sameBC) process.exit(1);
