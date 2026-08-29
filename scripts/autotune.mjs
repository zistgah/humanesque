#!/usr/bin/env node
import { gemm, autotuneGemm } from "../runtime/blas.js";

const n = Number(process.argv[2] || 64);
const a = Array(n * n).fill(1);
const b = Array(n * n).fill(2);
const r = autotuneGemm(n, n, n, a, b);
console.log(JSON.stringify({ n, identity_check: gemm(2, 2, 2, [1, 0, 0, 1], [2, 3, 4, 5]), ...r }, null, 2));
