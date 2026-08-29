/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/** Permitted configuration bridges. Denied crossings must be explicit. */
export const BRIDGES = {
  "logic->functional": { pack: "stream", state: "immutable" },
  "functional->imperative": { require: "Cap_IO", state: "effect_tracked" },
  "imperative->assembly": { require: "Cap_HW", mem: "manual_raw" },
  "affine->gc": { op: "consume_alloc" },
  "arena->gc": { op: "deepcopy" },
  "gc->affine": { op: "pin_root" },
  "affine->arena": { op: "transfer" },
};

export function paradigmOf(cfg) {
  return cfg.paradigm || (cfg.eval === "inference" ? "logic" : cfg.state === "immutable" ? "functional" : "imperative");
}

export function checkBoundary(fromCfg, toCfg) {
  const a = paradigmOf(fromCfg);
  const b = paradigmOf(toCfg);
  if (a === b) return { ok: true, kind: "same" };
  const key = `${a}->${b}`;
  if (BRIDGES[key]) return { ok: true, kind: key, contract: BRIDGES[key] };
  if (fromCfg.state === "mutable" && toCfg.state === "immutable") {
    return { ok: true, kind: "freeze", contract: { op: "deepcopy_or_unique" } };
  }
  if (fromCfg.mem === "region_arena" && toCfg.mem === "tracing_gc") {
    return { ok: true, kind: "arena->gc", contract: BRIDGES["arena->gc"] };
  }
  return { ok: false, kind: key, error: `no bridge ${key}` };
}
