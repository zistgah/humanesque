#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { lex } from "../compiler/lexer.js";
import { parse } from "../compiler/parser.js";
import { typecheck } from "../compiler/typechecker.js";
import { compile } from "../compiler/compile.js";
import { Interpreter, Runtime, runSource } from "../runtime/interpreter.js";
import { display } from "../runtime/values.js";

const args = process.argv.slice(2);
const cmd = args[0] || "help";

function readInput(file) {
  if (!file || file === "-") return fs.readFileSync(0, "utf8");
  return fs.readFileSync(file, "utf8");
}

async function main() {
  switch (cmd) {
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return;
    case "version":
    case "--version":
      console.log("PANINI 0.1.0 (js-stage-0 bootstrap)");
      return;
    case "lex": {
      const file = args[1];
      const src = readInput(file);
      const tokens = lex(src, file || "<stdin>");
      console.log(JSON.stringify(tokens.map(briefToken), null, 2));
      return;
    }
    case "parse": {
      const file = args[1];
      const src = readInput(file);
      const ast = parse(src, file || "<stdin>");
      console.log(JSON.stringify(ast, null, 2));
      return;
    }
    case "typecheck": {
      const file = args[1];
      const src = readInput(file);
      const ast = parse(src, file || "<stdin>");
      const result = typecheck(ast);
      console.log(JSON.stringify({ ok: result.ok, diagnostics: result.diagnostics, types: result.types }, null, 2));
      process.exitCode = result.ok ? 0 : 1;
      return;
    }
    case "compile": {
      const file = args[1];
      const target = flag("target") || "json";
      const src = readInput(file);
      const result = compile(src, { filename: file || "<stdin>", target });
      const out = flag("out");
      const text = result.binary.toString("utf8");
      if (out) fs.writeFileSync(out, text);
      else console.log(text);
      process.exitCode = result.success ? 0 : 1;
      return;
    }
    case "binary":
    case "gcc": {
      const file = args[1];
      const src = readInput(file);
      const result = compile(src, { filename: file || "<stdin>", target: "c" });
      const cText = result.binary.toString("utf8");
      const stem = (file || "a").replace(/\.pni$/i, "");
      const cPath = flag("c-out") || stem + ".c";
      const binPath = flag("out") || stem;
      fs.writeFileSync(cPath, cText);
      const { spawnSync } = await import("node:child_process");
      const r = spawnSync("gcc", ["-O2", cPath, "-o", binPath], { encoding: "utf8" });
      if (r.stdout) process.stdout.write(r.stdout);
      if (r.stderr) process.stderr.write(r.stderr);
      if (r.status) {
        process.stderr.write("PANINI emitted C to " + cPath + " but gcc failed.\n");
        process.exitCode = r.status;
        return;
      }
      process.stderr.write("PANINI → C → gcc  wrote " + binPath + "  (source " + cPath + ")\n");
      process.exitCode = result.success ? 0 : 1;
      return;
    }
    case "run-spec": {
      await import("../scripts/run_spec.mjs");
      return;
    }
    case "run": {
      const file = args[1];
      const src = readInput(file);
      const specMode = /SPEC|\.pni$/i.test(file || "") && /CONSTITUTION|SELF_HOSTING/.test(src);
      const { result, runtime } = await runSource(src, file || "<stdin>", { specMode });
      if (process.env.PANINI_SHOW_RESULT === "1") {
        console.log("=>", display(result));
      }
      if (process.env.PANINI_MANIFEST === "1") {
        console.error(JSON.stringify(runtime.artifacts.manifest(), null, 2));
      }
      return;
    }
    case "repl":
      await repl();
      return;
    case "python":
    case "py":
    case "cc":
    case "c":
    case "c++":
    case "cpp":
    case "cxx":
    case "fortran":
    case "f90":
    case "f":
    case "rust":
    case "rs":
    case "typescript":
    case "ts":
    case "go":
    case "zig": {
      const src = readInput(args[1]);
      if (args.includes("--host")) {
        const { runPython, runC } = await import("../runtime/toolchain.js");
        const r = cmd === "python" || cmd === "py"
          ? runPython(src)
          : runC(src, { cxx: cmd === "cpp" || cmd === "c++" || cmd === "cxx" });
        process.stdout.write(r.stdout || "");
        if (r.stderr) process.stderr.write(r.stderr);
        process.exitCode = r.ok ? 0 : 1;
        return;
      }
      const { runFrontend } = await import("../runtime/foreign_front.js");
      const lang = ({ python:"python", py:"python", fortran:"fortran", f90:"fortran", f:"fortran",
        rust:"rust", rs:"rust", typescript:"typescript", ts:"typescript", go:"go", zig:"zig",
        cc:"c", c:"c" }[cmd]) || "cpp";
      const r = await runFrontend(lang, src);
      if (r && r.ok !== false && r.value !== undefined) console.log(r.value);
      else if (r && r.stdout) process.stdout.write(String(r.stdout));
      process.exitCode = r && r.ok !== false ? 0 : 1;
      return;
    }
    case "cycler":
    case "cyclers": {
      const { loadAll, execCycler, execAll } = await import("../runtime/cycler_load.js");
      const dir = path.join(path.dirname(new URL(import.meta.url).pathname), "../cyclers/upstream");
      const name = args[1];
      if (!name || name === "list") {
        const all = loadAll(dir);
        const slim = all.map(({ name, dialect, bytes, title, kind, parse_ok, woven_ok, mode, tangle_kind }) =>
          ({ name, dialect, bytes, title, kind, parse_ok, woven_ok, mode, tangle_kind }));
        console.log(JSON.stringify({ source: "https://github.com/zistgah/cycles/tree/main/cyclers", count: slim.length, cyclers: slim }, null, 2));
        return;
      }
      if (name === "exec" || name === "run") {
        const all = await execAll(dir);
        const summary = {
          count: all.length,
          executable: all.filter((c) => c.executable).length,
          failed: all.filter((c) => !c.executable).map((c) => ({ name: c.name, err: c.exec_error })),
          cyclers: all.map((c) => ({ name: c.name, dialect: c.dialect, executable: c.executable, tangle_kind: c.tangle_kind, parse_ok: c.parse_ok, prints: c.prints })),
        };
        console.log(JSON.stringify(summary, null, 2));
        process.exitCode = summary.failed.length ? 2 : 0;
        return;
      }
      const file = path.join(dir, name.endsWith(".pni") ? name : name + ".pni");
      const rec = await execCycler(file);
      delete rec.woven;
      console.log(JSON.stringify(rec, null, 2));
      process.exitCode = rec.executable ? 0 : 1;
      return;
    }
    case "torture":
    case "panini-torture": {
      await import("../scripts/panini_torture.mjs");
      return;
    }
    case "cycler-torture": {
      await import("../scripts/cycler_torture.mjs");
      return;
    }
    case "romenagri":
    case "apcisr": {
      const { inventory, toRomenagri, toIscii } = await import("../runtime/romenagri.js");
      const inv = inventory();
      const sample = args[1] || "";
      const out = { ...inv, apcisr_read_only: true };
      if (sample) {
        const rmn = toRomenagri(sample);
        out.sample = sample;
        out.toRomenagri = rmn;
        out.toIscii = toIscii(rmn);
      }
      console.log(JSON.stringify(out, null, 2));
      return;
    }
    case "shaili":
    case "bhasha":
    case "hindawi-flow": {
      await import("../scripts/hindawi_flow.mjs");
      return;
    }
    case "port":
    case "hindawi-port": {
      const { port, catalog } = await import("../runtime/hindawi_port.js");
      const lang = (args.find((a, i) => args[i - 1] === "--lang") || "hindi");
      const shaili = (args.find((a, i) => args[i - 1] === "--shaili") || "guru");
      const file = args.filter((a, i) => a !== "--lang" && a !== "--shaili" && args[i - 1] !== "--lang" && args[i - 1] !== "--shaili")[1];
      if (!file) { console.log(JSON.stringify(catalog(), null, 2)); return; }
      const src = fs.readFileSync(file, "utf8");
      console.log(JSON.stringify(port(src, { lang, shaili }), null, 2));
      return;
    }
    case "hindawi": {
      const { hindawiGuru } = await import("../runtime/hindawi.js");
      const src = args[1]
        ? fs.readFileSync(args[1], "utf8")
        : fs.readFileSync(new URL("../retrieved/legacy/Hindawi/samples/HindiC.uhin", import.meta.url), "utf8");
      console.log(JSON.stringify(hindawiGuru(src), null, 2));
      return;
    }
    case "nb":
    case "flatten": {
      const bundle = JSON.parse(fs.readFileSync(new URL("../docs/engine/bundle.json", import.meta.url), "utf8"));
      const src = args[1] ? fs.readFileSync(args[1], "utf8") : fs.readFileSync(new URL("../retrieved/legacy/Hindawi/samples/TeluguC.uhin", import.meta.url), "utf8");
      let i = 0, s = src, acc = "";
      const pairs = bundle.flatten.pairs.slice().sort((a, b) => [...b.from].length - [...a.from].length);
      while (i < s.length) {
        let hit = null;
        for (const p of pairs) { if (p.from && s.startsWith(p.from, i)) { hit = p; break; } }
        if (hit) { acc += hit.to; i += hit.from.length; } else { acc += s[i]; i++; }
      }
      console.log(acc);
      return;
    }
    case "perso":
    case "urdu":
    case "arabic": {
      await import("../scripts/explore_perso.mjs");
      return;
    }
    case "pa2c":
    case "transducer":
    case "punjabi":
    case "gurmukhi": {
      const { pa2c, proveNotMacro } = await import("../runtime/transducer.js");
      const src = args[1]
        ? fs.readFileSync(args[1], "utf8")
        : fs.readFileSync(new URL("../examples/punjabi_c.uhin", import.meta.url), "utf8");
      console.log(JSON.stringify(args[0] === "pa2c" ? pa2c(src) : proveNotMacro(src), null, 2));
      return;
    }
    case "iso-c":
    case "iso": {
      await import("../scripts/iso_c_harness.mjs");
      return;
    }
    case "iso-cxx":
    case "iso-c++": {
      await import("../scripts/iso_cxx_harness.mjs");
      return;
    }
    case "std-python":
    case "std-rust":
    case "std-go":
    case "std-julia": {
      const lang = args[0].replace("std-", "");
      process.argv.push(lang);
      await import("../scripts/std_green_harness.mjs");
      return;
    }
    case "wasm": {
      const { emitCWat, runCWasm } = await import("../runtime/wasm_front.js");
      const src = readInput(args[1]);
      const mode = flag("run") != null || args.includes("--run") ? "run" : "wat";
      if (mode === "run") {
        const name = flag("export") || "main";
        const r = await runCWasm(src, name, []);
        console.log(r.value);
        if (args.includes("--wat")) process.stderr.write(r.wat);
        return;
      }
      const wat = await emitCWat(src);
      const out = flag("out");
      if (out) fs.writeFileSync(out, wat);
      else console.log(wat);
      return;
    }
    case "bash":
      await runSource(fs.readFileSync(new URL("../stdlib/bash.pni", import.meta.url), "utf8"), "bash.pni");
      return;
    case "posix":
      await runSource(fs.readFileSync(new URL("../stdlib/posix.pni", import.meta.url), "utf8"), "posix.pni");
      return;
    case "oci":
    case "env": {
      const { runEnv, ENVIRONMENTS, engine } = await import("../runtime/oci.js");
      const name = args[1];
      if (!name || name === "list") {
        console.log(JSON.stringify({ engine: engine() || null, environments: ENVIRONMENTS }, null, 2));
        return;
      }
      const r = runEnv(name, args.slice(2));
      console.log(JSON.stringify(r, null, 2));
      process.exitCode = r.ok ? 0 : 1;
      return;
    }
    case "selfhost":
      await import("../scripts/selfhost.mjs");
      return;
    case "package":
    case "pack": {
      const file = args[1];
      const backend = flag("backend") || "wasm";
      const frontend = flag("frontend") || "panini";
      const src = file ? readInput(file) : "";
      const pkg = {
        format: "panini-pkg/v1",
        copyright: "Copyright (C) 1993-2026 Abhishek Choudhary",
        license: "GPL-3.0-or-later",
        frontend,
        backend,
        source: src,
        built: new Date().toISOString(),
        run_wasm: "open docs/workbench.html — pick frontend — Run",
        run_local: "node src/cli.js binary <file.pni> --out a.out",
      };
      if (backend === "local" || backend === "gcc" || backend === "binary") {
        const result = compile(src || "FUNCTION main() -> Int\n    RETURN 0\nEND\n", { filename: file || "<pkg>", target: "c" });
        pkg.c = result.binary.toString("utf8");
        pkg.note = "C emitted. gcc is the local backend: panini binary.";
      }
      const out = flag("out");
      const text = JSON.stringify(pkg, null, 2);
      if (out) fs.writeFileSync(out, text);
      else console.log(text);
      return;
    }
    case "test-pr":
    case "pr-gate": {
      await import("../scripts/pr_gate.mjs");
      return;
    }
    case "backend":
    case "backends": {
      console.log(JSON.stringify({
        wasm: { host: "browser", cmd: "workbench Run / panini wasm" },
        local: { host: "gcc", cmd: "panini binary <file.pni> --out a.out" },
        cinterp: { host: "js", cmd: "workbench Run (C-like frontends)" },
        default: "wasm is the web host; local is PANINI → C → gcc",
      }, null, 2));
      return;
    }
    default: {
      // bare file path
      if (fs.existsSync(cmd)) {
        const src = readInput(cmd);
        await runSource(src, cmd);
        return;
      }
      console.error(`Unknown command: ${cmd}`);
      printHelp();
      process.exitCode = 2;
    }
  }
}

function flag(name) {
  const i = args.indexOf("--" + name);
  if (i >= 0) return args[i + 1];
  const pref = "--" + name + "=";
  const hit = args.find((a) => a.startsWith(pref));
  return hit ? hit.slice(pref.length) : null;
}

function briefToken(t) {
  return { kind: t.kind, value: t.value, line: t.start?.line, column: t.start?.column };
}

function printHelp() {
  console.log(`PANINI 0.1.0 — JS bootstrap runtime

Usage:
  panini run <file.pni>
  panini lex <file.pni>
  panini parse <file.pni>
  panini typecheck <file.pni>
  panini compile <file.pni> [--target json|js|c] [--out file]
  panini binary <file.pni> [--out a.out]   # PANINI → C → gcc. Native binary. JS remains the web host.
  panini gcc <file.pni> [--out a.out]      # alias of binary
  panini package <file.pni> [--backend wasm|local] [--out file.panini-pkg.json]
  panini backends
  panini test-pr                           # PR correctness gate (may fail)
  panini python <file.py>     # invoke host python3
  panini cc <file.c>          # invoke host cc
  panini cpp <file.cpp>       # invoke host c++
  panini repl
  panini wasm <file.c>          # C → WAT (PANINI backend)
  panini wasm <file.c> --run    # C → WAT → WASM → execute main
  panini iso-c                  # c-testsuite ISO GREEN harness
  panini env list
  panini env env-python
  panini version
`);
}

async function repl() {
  const readline = await import("node:readline");
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const runtime = new Runtime();
  const interp = new Interpreter(runtime);
  console.log("PANINI REPL (js-stage-0). END blocks required. Ctrl-D to exit.");
  const prompt = () => new Promise((res) => rl.question("panini> ", res));
  for (;;) {
    const line = await prompt();
    if (line == null) break;
    if (line.trim() === "") continue;
    if (line.trim() === ":quit") break;
    try {
      const { parse } = await import("../compiler/parser.js");
      const ast = parse(line, "<repl>");
      const result = await interp.interpret(ast, { env: interp.global, runMain: false });
      console.log(display(result));
    } catch (e) {
      console.error(String(e.message || e));
    }
  }
  rl.close();
}

main().catch((err) => {
  console.error(err.stack || err);
  process.exit(1);
});
