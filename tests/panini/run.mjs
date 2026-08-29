#!/usr/bin/env node
import { runSource } from "../../runtime/interpreter.js";

const cases = [
  { name: "print-const", src: 'PRINT 2+2\n', expect: ["4"] },
  { name: "fn-double", src: "FUNCTION double(x)\nRETURN x * 2\nEND\nPRINT double(21)\n", expect: ["42"] },
  { name: "if-true", src: "IF 1\nPRINT 7\nEND\n", expect: ["7"] },
  { name: "while", src: "i = 0\nWHILE i < 3\ni = i + 1\nEND\nPRINT i\n", expect: ["3"] },
  { name: "bool", src: "PRINT TRUE\nPRINT FALSE\n", expect: ["true", "false"] },
];

let fail = 0;
for (const c of cases) {
  const { runtime } = await runSource(c.src, c.name + ".pni");
  const got = runtime.prints.map(String);
  const ok = c.expect.every((e, i) => String(got[i]).toLowerCase() === String(e).toLowerCase());
  if (!ok) { fail++; console.error("FAIL", c.name, got); }
  else console.log("ok", c.name, got.join(","));
}
if (fail) process.exit(1);
console.log(cases.length, "PANINI suite cases passed");
