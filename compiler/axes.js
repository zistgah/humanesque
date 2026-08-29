/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
export const AXES = {
  abstract: ["func", "object", "constraint", "entity"],
  eval: ["operational", "reduction", "inference", "reactive", "query"],
  exec: ["stack", "register", "graph_vm", "actor_ring", "simd_vector"],
  state: ["mutable", "immutable", "linear_borrow", "effect_tracked"],
  async: ["sequential", "actor", "csp_channel", "event_loop", "data_parallel"],
  dispatch: ["static_single", "dynamic_multi", "pattern_match", "predicate"],
  stage: ["runtime", "compile_time", "homoiconic", "reflective"],
  type: ["static_nominal", "structural", "dependent", "dynamic_gradual"],
  mem: ["tracing_gc", "region_arena", "affine", "manual_raw"],
  failure: ["exception", "result_monad", "condition_restart", "crash_isolate"],
  control: ["structured", "coroutine", "algebraic_effect", "continuation"],
  scope_rule: ["lexical", "dynamic", "capability_ambient"],
  ilm: ["latin_en", "devanagari_hi", "arabic_ar", "visual_graph"],
};

export const PRESETS = {
  functional: { abstract: "func", eval: "reduction", state: "immutable", async: "sequential" },
  imperative: { abstract: "entity", eval: "operational", state: "mutable", async: "sequential" },
  logic: { abstract: "constraint", eval: "inference", state: "immutable" },
  query: { eval: "query", abstract: "constraint" },
  object: { abstract: "object", eval: "operational", state: "mutable" },
  reactive: { eval: "reactive", async: "event_loop" },
  concurrent: { async: "actor" },
  assembly: { exec: "register", mem: "manual_raw", state: "mutable" },
};

export const DEFAULT_CONFIG = {
  abstract: "func",
  eval: "operational",
  exec: "stack",
  state: "mutable",
  async: "sequential",
  dispatch: "static_single",
  stage: "runtime",
  type: "dynamic_gradual",
  mem: "tracing_gc",
  failure: "exception",
  control: "structured",
  scope_rule: "lexical",
  ilm: "latin_en",
};

export function mergeConfig(parent, overlay) {
  return { ...DEFAULT_CONFIG, ...parent, ...overlay };
}

export function parseAnnotationName(name, arg) {
  if (PRESETS[name]) return { ...PRESETS[name], paradigm: name };
  if (AXES[name]) {
    const v = arg || AXES[name][0];
    if (!AXES[name].includes(v)) throw new Error(`invalid @${name}(${v})`);
    return { [name]: v };
  }
  return { [name]: arg ?? true };
}
