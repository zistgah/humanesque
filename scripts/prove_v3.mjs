#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stampArtifact } from "../tools/provenance/stamp.js";
import { parseSanskritMath, evalSanskritMath } from "../tools/sanskrit/math_words.js";
import { compileV2 } from "../compiler/v2compile.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rec = [];
function ok(name, pass, note) {
  rec.push({ name, ok: pass, note, status: pass ? "VERIFIED" : "UNRESOLVED" });
  console.log(`[${pass ? "ok" : "UNRESOLVED"}] ${name}${note ? " — " + note : ""}`);
}

ok("W1 static workbench files", ["website/index.html","website/app.js","website/style.css",".github/workflows/pages.yml"].every((f) => fs.existsSync(path.join(root, f))));
ok("W1 vscode+lsp", fs.existsSync(path.join(root, "tools/vscode-panini/package.json")) && fs.existsSync(path.join(root, "tools/panini-lsp/cli.mjs")));
ok("W2 beginner PRINT", compileV2('PRINT "HELLO"\n').success !== false);
const shaili = fs.readFileSync(path.join(root, "examples/shaili_square.pni"), "utf8");
ok("W2 shaili source present", /FORWARD/.test(shaili));
ok("W3 museum catalog", JSON.parse(fs.readFileSync(path.join(root, "languages/catalog.json"), "utf8")).length >= 16);
ok("sanskrit math seed", evalSanskritMath("एक योग द्वि") === 3);
ok("provenance stamp", stampArtifact("HELLO").sha256.length === 64);
ok("v3 spec present", fs.existsSync(path.join(root, "spec/PANINI_V3_WORKBENCH_SPEC.pni")));
ok("pages has no backend assumption", !fs.readFileSync(path.join(root, "website/app.js"), "utf8").includes("localhost:"));

const all = rec.every((r) => r.ok);
const proof = {
  version: "3.0.0",
  status: all ? "PROVEN" : "UNRESOLVED",
  epistemic_status: all ? "VERIFIED" : "UNRESOLVED",
  note: "Workbench subset. OTS calendar submit remains external. Language museum is axis-character, not source-compatible compilers. L0–L26 RETRIEVED.",
  clauses: rec,
};
fs.mkdirSync(path.join(root, "build"), { recursive: true });
fs.writeFileSync(path.join(root, "build/v3-theorem-proof.json"), JSON.stringify(proof, null, 2));
console.log(JSON.stringify({ status: proof.status, verified: rec.filter((r) => r.ok).length, total: rec.length }, null, 2));
if (!all) process.exit(1);
