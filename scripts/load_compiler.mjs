import fs from "node:fs";
import path from "node:path";

export function compilerSource(root) {
  const files = [
    "src/panini/lexer.pni",
    "src/panini/parser.pni",
    "src/panini/typechecker.pni",
    "src/panini/ir.pni",
    "src/panini/compiler.pni",
  ];
  return files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
}

export function deepPlain(v) {
  if (v == null) return null;
  if (typeof v !== "object") return v;
  if (v.tag) {
    if (v.tag === "List") return v.value.map(deepPlain);
    if (v.tag === "Map") {
      const o = {};
      for (const [k, val] of v.value) o[k] = deepPlain(val);
      return o;
    }
    if ("value" in v && ["Int", "Float", "String", "Bool"].includes(v.tag)) return v.value;
    if (v.tag === "Unit") return null;
  }
  if (Array.isArray(v)) return v.map(deepPlain);
  const o = {};
  for (const k of Object.keys(v)) o[k] = deepPlain(v[k]);
  return o;
}

export function stableStringify(x) {
  return JSON.stringify(sortify(x));
}

function sortify(x) {
  if (x == null || typeof x !== "object") return x;
  if (Array.isArray(x)) return x.map(sortify);
  const o = {};
  for (const k of Object.keys(x).sort()) o[k] = sortify(x[k]);
  return o;
}
