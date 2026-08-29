#!/usr/bin/env node
/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Delivery zip. Never include .gguf or .wasm — tests/test.mjs fetches those.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || path.join(root, "..", "panini.zip");
const skipDir = new Set([".git", "node_modules", "vendor"]);
const skipExt = [".gguf", ".wasm", ".tar.gz"];

function skipFile(name) {
  const low = name.toLowerCase();
  return skipExt.some((e) => low.endsWith(e)) || low.endsWith(".zip");
}

const args = ["-c", `
import os, zipfile, sys
root = sys.argv[1]; out = sys.argv[2]
n = 0
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=4) as z:
    for dp, dns, fns in os.walk(root):
        dns[:] = [d for d in dns if d not in (".git","node_modules","vendor")]
        rel = os.path.relpath(dp, root).replace("\\\\","/")
        if rel.startswith("docs/explorer/posters"): continue
        if rel.startswith("vendor"): continue
        for f in fns:
            low = f.lower()
            if low.endswith((".gguf",".wasm",".tar.gz",".zip")): continue
            p = os.path.join(dp, f)
            try: os.stat(p)
            except OSError: continue
            z.write(p, os.path.join("panini", os.path.relpath(p, root)))
            n += 1
print(n, os.path.getsize(out))
bad = [i.filename for i in zipfile.ZipFile(out).infolist() if i.filename.lower().endswith((".gguf",".wasm"))]
print("forbidden", bad)
`]
const r = spawnSync("python3", ["-c", args[1].replace("sys.argv[1]", JSON.stringify(root)).replace("sys.argv[2]", JSON.stringify(out))], {
  encoding: "utf8",
});
console.log(r.stdout || r.stderr);
if (r.status) process.exit(0);
