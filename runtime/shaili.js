/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Load retrieved Hindawi h2c/c2h maps. Do not invent.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadMap(rel) {
  const j = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  if (j.invented) throw new Error("refusing invented map " + rel);
  return j;
}

export function h2c() {
  return loadMap("docs/retrieved/h2c.map.json");
}
export function c2h() {
  return loadMap("docs/retrieved/c2h.map.json");
}
export function apply(src, rules) {
  const sorted = rules.slice().sort((a, b) => b.from.length - a.from.length);
  let out = String(src);
  for (const r of sorted) {
    const from = r.from.replace(/\\./g, (m) => m[1]);
    if (from) out = out.split(from).join(r.to);
  }
  return out;
}
export function applyH2c(src) {
  return apply(src, h2c().rules);
}
export function applyC2h(src) {
  return apply(src, c2h().rules);
}
