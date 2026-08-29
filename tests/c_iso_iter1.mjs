#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * ISO C subset iteration 1 — not C17 complete. Virtualized backend.
 */
import { runSubset } from "../runtime/mini_langs.js";
import { parseAndEvalExpr } from "../runtime/lexyacc_formal.js";

let n = 0, fail = 0;
function check(name, cond, extra) {
  n++;
  if (!cond) { fail++; console.log("FAIL", name, extra); }
  else console.log("ok  ", name);
}

const sum = runSubset("c", `
int main() {
  int s = 0;
  int i;
  for (i = 1; i <= 10; i = i + 1) {
    s = s + i;
  }
  return s;
}
`);
check("for 1..10 sum = 55", sum.value === 55, sum);

const iff = runSubset("c", `
int main() {
  int x = 3;
  if (x > 1) { return 42; }
  return 0;
}
`);
check("if x>1 return 42", iff.value === 42, iff);

const wh = runSubset("c", `
int main() {
  int n = 3;
  int p = 1;
  while (n > 0) {
    p = p * 2;
    n = n - 1;
  }
  return p;
}
`);
check("while 2^3 = 8", wh.value === 8, wh);

check("lex+yacc 3+4*5 = 23", parseAndEvalExpr("3+4*5") === 23);
check("lex+yacc (1+2)*3 = 9", parseAndEvalExpr("(1+2)*3") === 9);

console.log(fail ? `FAILED ${fail}/${n}` : `PASSED ${n}/${n}  (ISO C subset iter 1; not C17)`);
process.exit(fail ? 1 : 0);
