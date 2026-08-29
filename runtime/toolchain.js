import { spawnSync, execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const TOOLS = {
  python: ["python3", "python"],
  cc: ["cc", "gcc", "clang"],
  cxx: ["c++", "g++", "clang++"],
};

export function which(name) {
  const cands = TOOLS[name] || [name];
  for (const bin of cands) {
    try {
      const out = execSync(`command -v ${bin}`, { encoding: "utf8" }).trim();
      if (out) return out;
    } catch { /* missing */ }
  }
  return null;
}

export function invoke(argv, options = {}) {
  const [cmd, ...args] = argv;
  const bin = which(cmd) || cmd;
  const r = spawnSync(bin, args, {
    encoding: "utf8",
    timeout: options.timeout || 30_000,
    input: options.input,
    cwd: options.cwd,
    env: process.env,
  });
  return {
    ok: r.status === 0,
    status: r.status,
    stdout: r.stdout || "",
    stderr: r.stderr || "",
    error: r.error ? String(r.error.message) : null,
    argv: [bin, ...args],
  };
}

export function runPython(source, extraArgs = []) {
  const bin = which("python");
  if (!bin) return { ok: false, missing: "python3", stdout: "", stderr: "python3 not on PATH" };
  const file = writeTemp("py", source);
  return invoke(["python", file, ...extraArgs]);
}

export function runC(source, { cxx = false } = {}) {
  const compiler = which(cxx ? "cxx" : "cc");
  if (!compiler) return { ok: false, missing: cxx ? "c++" : "cc", stdout: "", stderr: "C toolchain not on PATH" };
  const src = writeTemp(cxx ? "cpp" : "c", source);
  const exe = src.replace(/\.(c|cpp)$/, ".out");
  const compiled = invoke([cxx ? "cxx" : "cc", src, "-o", exe]);
  if (!compiled.ok) return compiled;
  return invoke([exe]);
}

function writeTemp(ext, source) {
  const dir = path.join(os.tmpdir(), "panini-foreign");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `src-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`);
  fs.writeFileSync(file, source);
  return file;
}
