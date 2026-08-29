import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runSubset } from "../runtime/mini_langs.js";
import { runFrontend } from "../runtime/foreign_front.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "lang_cases");
const cases = [
  ["python", "complex.py", 42],
  ["rust", "complex.rs", 42],
  ["typescript", "complex.ts", 42],
  ["go", "complex.go", 42],
  ["zig", "complex.zig", 42],
  ["c", "complex.c", 42],
  ["fortran", "complex.f90", 42],
];

let failed = 0;
for (const [lang, file, expect] of cases) {
  const src = fs.readFileSync(path.join(dir, file), "utf8");
  const r = runSubset(lang, src);
  const v = r.prints?.includes(expect) || r.value === expect ? expect : r.value;
  const ok = v === expect || (r.prints || []).some((p) => Number(p) === expect);
  if (!ok) {
    failed++;
    console.error("FAIL", lang, r);
  } else console.log("ok", lang, expect);
  const fe = await runFrontend(lang, src);
  console.log("  frontend", fe.frontend || fe.via, fe.value, fe.prints);
}
if (failed) process.exit(1);
console.log(cases.length - failed, "complex cases passed");
