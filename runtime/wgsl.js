/**
 * Browser WebGPU: emit WGSL for a matmul. Not a ggml GPU backend.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
export function matmulShader(n) {
  return `/* PANINI WGSL matmul n=${n} */
@group(0) @binding(0) var<storage, read> A : array<f32>;
@group(0) @binding(1) var<storage, read> B : array<f32>;
@group(0) @binding(2) var<storage, read_write> C : array<f32>;
@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid : vec3<u32>) {
  let i = gid.x; let j = gid.y; let N = ${Number(n) | 0}u;
  if (i >= N || j >= N) { return; }
  var acc : f32 = 0.0;
  for (var k : u32 = 0u; k < N; k = k + 1u) {
    acc = acc + A[i * N + k] * B[k * N + j];
  }
  C[i * N + j] = acc;
}
`;
}

export function available() {
  return typeof navigator !== "undefined" && !!navigator.gpu;
}
