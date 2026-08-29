/**
 * C source → PANINI AST → WAT (PANINI emitter) → WASM binary (in-tree assembler).
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSource } from "./interpreter.js";
import { wrap, unwrap } from "./values.js";
import { wat2wasm, wasmRun } from "./wat2wasm.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function emitCWat(source) {
  const c = fs.readFileSync(path.join(root, "src/panini/frontends/c.pni"), "utf8");
  const w = fs.readFileSync(path.join(root, "src/panini/backends/wasm.pni"), "utf8");
  const { interpreter } = await runSource(c + "\n" + w, "c+wasm.pni", { runMain: false, maxSteps: 2000000000 });
  const fn = interpreter.runtime.functions.get("emit_c_wat");
  if (!fn) throw new Error("emit_c_wat missing");
  const wat = unwrap(await interpreter.callValue(fn, [wrap(String(source))], interpreter.global));
  return String(wat);
}

export async function compileCWasm(source) {
  const wat = await emitCWat(source);
  const bytes = wat2wasm(wat);
  return { wat, bytes, frontend: "PANINI.Frontend.C", backend: "PANINI.Backend.Wasm" };
}

export async function runCWasm(source, exportName, args = []) {
  const { wat, bytes } = await compileCWasm(source);
  const value = await wasmRun(bytes, exportName || "main", args);
  return { ok: true, value, wat, backend: "PANINI.Backend.Wasm" };
}
