/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * tree-rev: 2026.08.28
 * OCI config emission + host docker/podman if present.
 */
import { spawnSync } from "node:child_process";
import { which } from "./toolchain.js";

export const ENVIRONMENTS = {
  "env-c": { image: "gcc:13", suite: "gcc torture / c-testsuite", cmd: ["gcc", "--version"] },
  "env-cxx": { image: "gcc:13", suite: "libstdc++", cmd: ["g++", "--version"] },
  "env-python": { image: "python:3.12", suite: "CPython Lib/test", cmd: ["python3", "--version"] },
  "env-fortran": { image: "gcc:13", suite: "gfortran torture", cmd: ["gfortran", "--version"] },
  "env-julia": { image: "julia:1.10", suite: "Julia test/", cmd: ["julia", "--version"] },
  "env-rust": { image: "rust:1.80", suite: "rustc ui", cmd: ["rustc", "--version"] },
  "env-go": { image: "golang:1.23", suite: "go test", cmd: ["go", "version"] },
};

export function engine() {
  return which("docker") || which("podman") || "";
}

export function ociConfig({ cwd = "/work", args = ["true"], env = {} } = {}) {
  return {
    ociVersion: "1.1.0",
    process: {
      terminal: false,
      user: { uid: 0, gid: 0 },
      args,
      env: Object.entries({ PATH: "/usr/local/bin:/usr/bin:/bin", ...env }).map(([k, v]) => `${k}=${v}`),
      cwd,
    },
    root: { path: "rootfs", readonly: false },
    hostname: "panini",
    linux: { namespaces: [{ type: "pid" }, { type: "mount" }, { type: "uts" }] },
  };
}

export function runEnv(name, extraArgs = []) {
  const spec = ENVIRONMENTS[name];
  if (!spec) return { ok: false, error: "unknown env " + name };
  const bin = engine();
  const config = ociConfig({ args: extraArgs.length ? extraArgs : spec.cmd });
  if (!bin) {
    return {
      ok: false,
      status: "ENGINE_ABSENT",
      hint: "Install Docker or Podman to launch standard environments.",
      image: spec.image,
      suite: spec.suite,
      config,
    };
  }
  const args = ["run", "--rm", spec.image, ...(extraArgs.length ? extraArgs : spec.cmd)];
  const r = spawnSync(bin, args, { encoding: "utf8", timeout: 60000 });
  return {
    ok: r.status === 0,
    status: r.status === 0 ? "RAN" : "FAILED",
    image: spec.image,
    suite: spec.suite,
    stdout: r.stdout || "",
    stderr: r.stderr || "",
    engine: bin,
    config,
  };
}
