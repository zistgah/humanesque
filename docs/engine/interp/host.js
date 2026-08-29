/**
 * C source → PANINI.Frontend.C → PANINI.Backend.Wasm → WAT → wasm.
 * Same sources as Node tests. Works in the browser and in Node.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import { runSource } from "./interpreter.js";
import { wrap, unwrap } from "./values.js";
import { wat2wasm, wasmRun } from "../wat2wasm.js";

let interp = null;

async function readPni(name) {
  const url = new URL(name, import.meta.url);
  if (typeof fetch === "function" && url.protocol !== "file:") {
    const r = await fetch(url);
    if (!r.ok) throw new Error("missing " + name);
    return r.text();
  }
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const dir = path.dirname(fileURLToPath(import.meta.url));
  return fs.readFileSync(path.join(dir, name), "utf8");
}

export async function loadCWasm() {
  if (interp) return interp;
  const py = await readPni("python.pni");
  const toC = await readPni("to_c.pni");
  const cpp = await readPni("cpp.pni");
  const c = await readPni("c.pni");
  const w = await readPni("wasm.pni");
  const sink = { write() {} };
  const { interpreter } = await runSource(py + "\n" + toC + "\n" + cpp + "\n" + c + "\n" + w, "front+c+wasm.pni", {
    runMain: false,
    maxSteps: 2_000_000_000,
    stdout: sink,
    stderr: sink,
  });
  interp = interpreter;
  return interp;
}

async function callNamed(name, args) {
  const i = await loadCWasm();
  const fn = i.runtime.functions.get(name);
  if (!fn) throw new Error(name + " missing from c.pni+wasm.pni");
  return unwrap(await i.callValue(fn, args.map((a) => wrap(a)), i.global));
}

export async function emitCWat(source) {
  return String(await callNamed("emit_c_wat", [String(source)]));
}

export async function lowerToC(lang, source) {
  if (!lang || lang === "c" || lang === "C") return String(source);
  return String(await callNamed("lower_to_c", [String(lang), String(source)]));
}

export async function compileLangWasm(lang, source) {
  const host = await lowerToC(lang, source);
  const wat = await emitCWat(host);
  const bytes = wat2wasm(wat);
  return { host, wat, bytes, lang, frontend: "PANINI.Frontend." + lang, backend: "PANINI.Backend.Wasm" };
}

export async function runLangWasm(lang, source, exportName = "main", args = []) {
  const { host, wat, bytes } = await compileLangWasm(lang, source);
  const value = await wasmRun(bytes, exportName, args);
  return { ok: true, value, wat, bytes, host, exportName, lang };
}

export async function parseCAst(source) {
  return await callNamed("cParse", [String(source)]);
}

export async function compileCWasm(source) {
  const wat = await emitCWat(source);
  const bytes = wat2wasm(wat);
  return {
    wat,
    bytes,
    frontend: "PANINI.Frontend.C",
    backend: "PANINI.Backend.Wasm",
    assembler: "docs/engine/wat2wasm.js",
  };
}

export async function runCWasm(source, exportName = "main", args = []) {
  const { wat, bytes } = await compileCWasm(source);
  const value = await wasmRun(bytes, exportName, args);
  return { ok: true, value, wat, bytes, exportName };
}

export { wat2wasm, wasmRun };
