#!/usr/bin/env node
import { which } from "../../runtime/toolchain.js";

const rows = [
  { lang: "c", suite: "gcc torture / c-testsuite", host: "gcc" },
  { lang: "c++", suite: "libstdc++ / libc++", host: "g++" },
  { lang: "python", suite: "CPython Lib/test", host: "python3" },
  { lang: "fortran", suite: "gfortran torture", host: "gfortran" },
  { lang: "julia", suite: "Julia test/", host: "julia" },
];

console.log("PANINI language-standard harness");
console.log("CONFORMANCE is only claimed when a frontend + host suite both pass.");
console.log("");
for (const r of rows) {
  const bin = which(r.host);
  console.log(`${r.lang.padEnd(10)} suite=${r.suite}`);
  console.log(`           host=${bin || "ABSENT"} status=NOT_RUN (no CONFORMANCE claim)`);
}
console.log("\nOwned suite: node tests/panini/run.mjs");
