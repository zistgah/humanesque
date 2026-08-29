/** Level-1/2/3 BLAS subset in JS, called from PANINI. */

export function axpy(n, a, x, y) {
  const out = y.slice();
  for (let i = 0; i < n; i++) out[i] = a * x[i] + y[i];
  return out;
}

export function scal(n, a, x) {
  return x.slice(0, n).map((v) => a * v);
}

export function nrm2(n, x) {
  let s = 0;
  for (let i = 0; i < n; i++) s += x[i] * x[i];
  return Math.sqrt(s);
}

export function gemv(m, n, a, x) {
  const y = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += a[i * n + j] * x[j];
    y[i] = s;
  }
  return y;
}

export function gemm(m, n, k, a, b, block = 0) {
  const c = Array(m * n).fill(0);
  if (!block) {
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let t = 0; t < k; t++) s += a[i * k + t] * b[t * n + j];
        c[i * n + j] = s;
      }
    }
    return c;
  }
  for (let ii = 0; ii < m; ii += block) {
    for (let jj = 0; jj < n; jj += block) {
      for (let kk = 0; kk < k; kk += block) {
        const i1 = Math.min(ii + block, m);
        const j1 = Math.min(jj + block, n);
        const k1 = Math.min(kk + block, k);
        for (let i = ii; i < i1; i++) {
          for (let j = jj; j < j1; j++) {
            let s = c[i * n + j];
            for (let t = kk; t < k1; t++) s += a[i * k + t] * b[t * n + j];
            c[i * n + j] = s;
          }
        }
      }
    }
  }
  return c;
}

export function autotuneGemm(m, n, k, a, b, blocks = [8, 16, 32, 64]) {
  const trials = [];
  for (const bs of blocks) {
    const t0 = performance.now();
    gemm(m, n, k, a, b, bs);
    const ms = performance.now() - t0;
    trials.push({ block: bs, ms });
  }
  trials.sort((x, y) => x.ms - y.ms);
  return { best: trials[0], trials };
}
