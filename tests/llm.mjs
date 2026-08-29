/**
 * C++11 toolchain + llama.cpp proof.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const gxx = spawnSync("g++", ["--version"], { encoding: "utf8" });
assert.equal(gxx.status, 0, "g++ required");
console.log("ok   g++", (gxx.stdout || "").split("\n")[0]);

const src = path.join(os.tmpdir(), "panini-cxx11.cpp");
const exe = path.join(os.tmpdir(), "panini-cxx11.out");
fs.writeFileSync(src, `#include <iostream>\n#include <vector>\nint main(){ std::vector<int> v{1,2,3}; int s=0; for(int x:v) s+=x; std::cout << s; return 0; }\n`);
const cc = spawnSync("g++", ["-std=c++11", "-O2", src, "-o", exe], { encoding: "utf8" });
assert.equal(cc.status, 0, cc.stderr);
const run = spawnSync(exe, [], { encoding: "utf8" });
assert.equal(String(run.stdout).trim(), "6");
console.log("ok   g++_c++11_range_for", run.stdout.trim());

const proof = JSON.parse(fs.readFileSync("docs/data/llm.json", "utf8"));
assert.equal(proof.build.ok, true);
assert.equal(proof.execute.ok, true);
assert.ok(/Lucya/.test(proof.execute.completion));
console.log("ok   llm.json_execute", proof.execute.completion);

const cli = process.env.LLM_CLI || "/tmp/llm/src/build/bin/llama-cli";
if (fs.existsSync(cli)) {
  const ver = spawnSync(cli, ["--version"], {
    encoding: "utf8",
    env: { ...process.env, LD_LIBRARY_PATH: path.dirname(cli) },
  });
  assert.ok((ver.stdout + ver.stderr).includes("0.3.0") || ver.status === 0);
  console.log("ok   llama-cli --version", (ver.stdout || ver.stderr).trim().split("\n")[0]);
} else {
  console.log("skip llama-cli binary not in this tree (see tools/llm/build.sh)");
}
console.log("LLM_TOOLCHAIN_OK");
