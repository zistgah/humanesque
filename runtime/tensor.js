import { gemm } from "./blas.js";

function plain(v) {
  if (v == null) return v;
  if (typeof v !== "object") return v;
  if (v.tag === "Int" || v.tag === "Float" || v.tag === "Bool" || v.tag === "String") return v.value;
  if (v.tag === "List") return v.value.map(plain);
  if (Array.isArray(v)) return v.map(plain);
  if (v.shape && v.data) return v;
  return v;
}

export function tensor(data) {
  data = plain(data);
  if (typeof data === "number") return { shape: [], data: [data] };
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const m = data.length, n = data[0].length;
    return { shape: [m, n], data: data.flat().map(Number) };
  }
  return { shape: [data.length], data: data.slice().map(Number) };
}

function nums(v) {
  v = plain(v);
  if (typeof v === "number" && Number.isFinite(v)) return [v];
  if (Array.isArray(v)) return v.flatMap(nums);
  if (v && typeof v === "object" && "value" in v && typeof v.value === "number") return [v.value];
  const n = Number(v);
  return Number.isFinite(n) ? [n] : [];
}

function asTensor(a) {
  if (!a) return tensor([]);
  if (a.shape && a.data) {
    const data = nums(a.data);
    let shape = nums(a.shape);
    if (shape.length === 2 && data.length === shape[0] * shape[1]) return { shape, data };
    const n = Math.sqrt(data.length);
    if (Number.isInteger(n)) return { shape: [n, n], data };
    return { shape: [data.length], data };
  }
  return tensor(a);
}

export function matmul(a, b) {
  a = asTensor(a);
  b = asTensor(b);
  const [m, k] = a.shape;
  const n = b.shape[1];
  return { shape: [m, n], data: gemm(m, n, k, a.data, b.data) };
}

export function tadd(a, b) {
  return { shape: a.shape.slice(), data: a.data.map((v, i) => v + b.data[i]) };
}

export function relu(a) {
  return { shape: a.shape.slice(), data: a.data.map((v) => (v > 0 ? v : 0)) };
}

export function toTorchPython(a) {
  if (a.shape.length === 2) {
    const [m, n] = a.shape;
    const rows = [];
    for (let i = 0; i < m; i++) rows.push("[" + a.data.slice(i * n, (i + 1) * n).join(",") + "]");
    return `torch.tensor([${rows.join(",")}])`;
  }
  return `torch.tensor(${JSON.stringify(a.data)})`;
}
