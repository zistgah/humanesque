/**
 * PANINI C → WAT → WASM. compute(5) = 25 is the attachment fixture.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import { runCWasm, emitCWat, compileCWasm } from "../runtime/wasm_front.js";
import { wat2wasm, wasmRun } from "../runtime/wat2wasm.js";
import fs from "node:fs";
import path from "node:path";

const cases = [
  ["zero", "int main(){return 0;}", 0],
  ["add", "int main(){return 1+2+3;}", 6],
  ["compute_main", "int compute(int x){int result;result=x+10*2;return result;} int main(){return compute(5);}", 25],
  ["if0", "int f(int n){if(n==0) return 1; return 2;} int main(){return f(0);}", 1],
  ["if1", "int f(int n){if(n==0) return 1; return 2;} int main(){return f(3);}", 2],
  ["while", "int main(){int i;int s;i=0;s=0;while(i<5){s=s+i;i=i+1;}return s;}", 10],
  ["for", "int main(){int i;int s;s=0;for(i=0;i<5;i=i+1)s=s+i;return s;}", 10],
  ["ptr", "int main(){int s;int *p;s=42;p=&s;return *p;}", 42],
  ["fact", "int fact(int n){if(n<=1) return 1; return n*fact(n-1);} int main(){return fact(5);}", 120],
  ["calloc", "int main(){int *t; t=calloc(4,4); t[0]=7; return t[0];}", 7],
  ["goto_skip", "int main(){ int x; x=1; goto skip; x=2; skip: return x; }", 1],
  ["goto_loop", "int main(){ int i; int s; i=0; s=0; loop: if(i>=5) goto done; s=s+i; i=i+1; goto loop; done: return s; }", 10],
];

let fail = 0;
const wat = `(module
  (func $compute (export "compute") (param $x i32) (result i32)
    (local $result i32)
    (local.get $x)
    (i32.const 10)
    (i32.const 2)
    (i32.mul)
    (i32.add)
    (local.set $result)
    (local.get $result)
    (return)
  )
)`;
const hand = await wasmRun(wat2wasm(wat), "compute", [5]);
if (hand !== 25) { console.error("hand compute(5)", hand); fail++; }
else console.log("ok   wat2wasm_compute_5");

for (const [name, src, exp] of cases) {
  try {
    const r = await runCWasm(src, "main", []);
    if (r.value !== exp) {
      console.error("FAIL", name, r.value, "want", exp);
      fail++;
    } else console.log("ok  ", name);
  } catch (e) {
    console.error("FAIL", name, e.message);
    fail++;
  }
}

const c5 = await runCWasm(cases[2][1], "compute", [5]);
if (c5.value !== 25) { console.error("FAIL compute export", c5.value); fail++; }
else console.log("ok   compute_export_5");

const outDir = path.resolve("examples/wasm");
fs.mkdirSync(outDir, { recursive: true });
const computeSrc = "int compute(int x){int result;result=x+10*2;return result;}\nint main(){return compute(5);}\n";
const { wat: cwat, bytes } = await compileCWasm(computeSrc);
fs.writeFileSync(path.join(outDir, "compute.c"), computeSrc);
fs.writeFileSync(path.join(outDir, "compute.wat"), cwat);
fs.writeFileSync(path.join(outDir, "compute.wasm"), Buffer.from(bytes));

const examples = [];
for (const [name, src, exp] of cases) {
  const w = await emitCWat(src);
  examples.push({ name, src, expected: exp, wat: w });
}
fs.mkdirSync("docs/data", { recursive: true });
fs.writeFileSync("docs/data/wasm-examples.json", JSON.stringify({
  backend: "PANINI.Backend.Wasm",
  assembler: "runtime/wat2wasm.js (in-tree, no wabt)",
  emitter: "src/panini/backends/wasm.pni",
  fixture: "compute(5) = 25",
  examples,
}, null, 2));

if (fail) {
  console.error("WASM_BACKEND_FAIL", fail);
  process.exitCode = 1;
} else {
  console.log("WASM_BACKEND_OK", cases.length + 2);
}
