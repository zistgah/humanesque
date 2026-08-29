/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Host loader for PANINI-written frontends. The frontend is the .pni.
 * JavaScript here only loads and calls it (REQ-004 / T_FRONTEND_PANINI).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSource } from "./interpreter.js";
import { wrap, unwrap } from "./values.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TABLE = {
  python: { file: "src/panini/frontends/python.pni", fn: "run_python" },
  py: { file: "src/panini/frontends/python.pni", fn: "run_python" },
  c: { file: "src/panini/frontends/c.pni", fn: "run_c" },
  fortran: { file: "src/panini/frontends/fortran.pni", fn: "run_fortran", withC: true },
  typescript: { file: "src/panini/frontends/typescript.pni", fn: "run_typescript", withC: true },
  zig: { file: "src/panini/frontends/zig.pni", fn: "run_zig", withC: true },
  lua: { file: "src/panini/frontends/lua.pni", fn: "run_lua", withC: true },
  javascript: { file: "src/panini/frontends/javascript.pni", fn: "run_javascript", withC: true },
  js: { file: "src/panini/frontends/javascript.pni", fn: "run_javascript", withC: true },
  pascal: { file: "src/panini/frontends/pascal.pni", fn: "run_pascal", withC: true },
  basic: { file: "src/panini/frontends/basic.pni", fn: "run_basic", withC: true },
  bas: { file: "src/panini/frontends/basic.pni", fn: "run_basic", withC: true },
  java: { file: "src/panini/frontends/java.pni", fn: "run_java", withC: true },
  sql: { file: "src/panini/frontends/application.pni", fn: "run_sql" },
  php: { file: "src/panini/frontends/application.pni", fn: "run_php" },
  ruby: { file: "src/panini/frontends/application.pni", fn: "run_ruby" },
  rb: { file: "src/panini/frontends/application.pni", fn: "run_ruby" },
  csharp: { file: "src/panini/frontends/application.pni", fn: "run_csharp" },
  cs: { file: "src/panini/frontends/application.pni", fn: "run_csharp" },
  r: { file: "src/panini/frontends/application.pni", fn: "run_r" },
  perl: { file: "src/panini/frontends/application.pni", fn: "run_perl" },
  pl: { file: "src/panini/frontends/application.pni", fn: "run_perl" },
  basic: { file: "src/panini/frontends/basic.pni", fn: "run_basic", withC: true },
  bas: { file: "src/panini/frontends/basic.pni", fn: "run_basic", withC: true },
  logo: { file: "src/panini/frontends/application.pni", fn: "run_logo" },
  fortran: { file: "src/panini/frontends/fortran.pni", fn: "run_fortran", withC: true },
  rust: { file: "src/panini/frontends/rust.pni", fn: "run_rust", withC: true },
  typescript: { file: "src/panini/frontends/typescript.pni", fn: "run_typescript", withC: true },
  go: { file: "src/panini/frontends/go.pni", fn: "run_go", withC: true },
  zig: { file: "src/panini/frontends/zig.pni", fn: "run_zig", withC: true },
  lua: { file: "src/panini/frontends/lua.pni", fn: "run_lua", withC: true },
  cpp: { file: "src/panini/frontends/cpp.pni", fn: "run_cpp", withC: true },
  "c++": { file: "src/panini/frontends/cpp.pni", fn: "run_cpp", withC: true },
  julia: { file: "src/panini/frontends/julia.pni", fn: "run_julia", withC: true },
  haskell: { file: "src/panini/frontends/haskell.pni", fn: "run_haskell" },
  smalltalk: { file: "src/panini/frontends/smalltalk.pni", fn: "run_smalltalk" },
  st: { file: "src/panini/frontends/smalltalk.pni", fn: "run_smalltalk" },
  lisp: { file: "src/panini/frontends/lisp.pni", fn: "run_lisp" },
  commonlisp: { file: "src/panini/frontends/lisp.pni", fn: "run_lisp" },
  cl: { file: "src/panini/frontends/lisp.pni", fn: "run_lisp" },
  scheme: { file: "src/panini/frontends/application.pni", fn: "run_scheme" },
  pascal: { file: "src/panini/frontends/pascal.pni", fn: "run_pascal", withC: true },
  cobol: { file: "src/panini/frontends/application.pni", fn: "run_cobol" },
  forth: { file: "src/panini/frontends/application.pni", fn: "run_forth" },
  kotlin: { file: "src/panini/frontends/application.pni", fn: "run_kotlin" },
  swift: { file: "src/panini/frontends/application.pni", fn: "run_swift" },
  scala: { file: "src/panini/frontends/application.pni", fn: "run_scala" },
  clojure: { file: "src/panini/frontends/application.pni", fn: "run_clojure" },
  ocaml: { file: "src/panini/frontends/application.pni", fn: "run_ocaml" },
  prolog: { file: "src/panini/frontends/prolog.pni", fn: "run_prolog" },
  assembly: { file: "src/panini/frontends/application.pni", fn: "run_assembly" },
  asm: { file: "src/panini/frontends/application.pni", fn: "run_assembly" },
};

export function supportedFrontends() {
  return Object.keys(TABLE);
}

export async function runFrontend(lang, source) {
  const spec = TABLE[lang];
  if (!spec) return { ok: false, error: "unknown frontend " + lang };
  let srcText = fs.readFileSync(path.join(root, spec.file), "utf8");
  if (spec.withC) {
    srcText += "\n" + fs.readFileSync(path.join(root, "src/panini/frontends/c.pni"), "utf8");
  }
  const { interpreter } = await runSource(srcText, spec.file, { runMain: false, maxSteps: 2000000000 });
  const fn = interpreter.runtime.functions.get(spec.fn);
  if (!fn) return { ok: false, error: "PANINI frontend missing " + spec.fn };
  const panini = unwrap(await interpreter.callValue(fn, [wrap(source)], interpreter.global));
  return { ...panini, prints: interpreter.runtime.prints || [] };
}
