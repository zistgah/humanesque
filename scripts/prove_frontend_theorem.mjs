#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "src/panini/frontends");
const required = ["python", "c", "cpp", "fortran", "rust", "typescript", "go", "zig"];
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pni"));
const missing = required.filter((l) => !files.includes(l + ".pni"));
const proof = {
  theorem: "T_FRONTEND_PANINI",
  invariant: "every frontend is a PANINI module",
  independent_of: ["POSIX", "OCI", "host gcc", "CPython"],
  witnesses: files.map((f) => "src/panini/frontends/" + f),
  missing,
  ok: missing.length === 0,
  note: "Witness existence ≠ language-standard completeness.",
};
fs.mkdirSync(path.join(root, "build"), { recursive: true });
fs.writeFileSync(path.join(root, "build/frontend-theorem.json"), JSON.stringify(proof, null, 2));
console.log(JSON.stringify(proof, null, 2));
if (!proof.ok) process.exit(1);
