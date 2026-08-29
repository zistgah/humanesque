export const GEMM_WGSL = `@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
}
`;

export async function tryWebGpu() {
  if (typeof navigator === "undefined" || !navigator.gpu) {
    return { ok: false, reason: "WebGPU not in this environment" };
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return { ok: false, reason: "no adapter" };
  const device = await adapter.requestDevice();
  return { ok: true, adapter: adapter.info || {}, hasDevice: !!device, shader: GEMM_WGSL };
}
