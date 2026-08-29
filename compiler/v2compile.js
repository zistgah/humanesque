/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { lex } from "./lexer.js";
import { parse } from "./parser.js";
import { compile } from "./compile.js";
import { detectProjection, projectToCanonical } from "./ilm.js";
import { DEFAULT_CONFIG, mergeConfig, parseAnnotationName, PRESETS } from "./axes.js";

export function stripAndCollectAnnotations(source) {
  const annotations = [];
  const lines = source.split(/\n/);
  const kept = [];
  let pending = {};
  for (const line of lines) {
    const m = line.trim().match(/^@([A-Za-z_]+)(?:\(([^)]*)\))?$/);
    if (m) {
      const name = m[1];
      const arg = m[2] ? m[2].replace(/^["']|["']$/g, "") : undefined;
      pending = mergeConfig(pending, parseAnnotationName(name, arg));
      continue;
    }
    if (Object.keys(pending).length && line.trim()) {
      annotations.push({ config: { ...DEFAULT_CONFIG, ...pending }, preview: line.trim() });
      pending = {};
    }
    kept.push(line);
  }
  return { source: kept.join("\n"), annotations };
}

export function compileV2(source, options = {}) {
  const projection = options.projection || detectProjection(source);
  const canonical = projectToCanonical(source, projection);
  const { source: stripped, annotations } = stripAndCollectAnnotations(canonical);
  const result = compile(stripped, { filename: options.filename || "v2.pni", target: options.target || "json" });
  const config = annotations.reduce((c, a) => mergeConfig(c, a.config), { ...DEFAULT_CONFIG, ilm: projection });
  const ir = result.ir ? { ...result.ir, regime: config, projection, annotations } : result.ir;
  return {
    ...result,
    projection,
    canonical,
    executable: stripped,
    annotations,
    config,
    ir,
    success: result.success,
  };
}

export function irIdentity(ir) {
  const fns = (ir.functions || []).map((f) => ({
    name: f.name,
    params: f.params,
    body: f.body,
  }));
  return JSON.stringify(fns);
}

export { PRESETS, DEFAULT_CONFIG };
