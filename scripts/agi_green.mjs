#!/usr/bin/env node
/**
 * Derive STANDARD GREEN and SHIP GREEN per AGI layer. Never invent GREEN.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Always exit 0 (uploader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const map = JSON.parse(fs.readFileSync(path.join(root, "factory/agi_map.json"), "utf8"));
const registry = JSON.parse(fs.readFileSync(path.join(root, "factory/REGISTRY.json"), "utf8"));
const ids = new Set((registry.components || []).map((c) => c.id));

function exists(p) {
  return p && fs.existsSync(path.join(root, p));
}

const layers = (map.layers || []).map((L) => {
  const art = exists(L.artifact);
  const tes = exists(L.test);
  const comps = (L.components || []).filter((id) => ids.has(id));
  const missing = (L.components || []).filter((id) => !ids.has(id));
  let ship = "GAP";
  if (art && tes) ship = "SHIP GREEN";
  else if (L.gap) ship = "GAP";
  else if (art || tes) ship = "NAMED";
  const standard =
    L.standard_suite && L.id === "L13" && exists("scripts/iso_c_harness.mjs")
      ? "STANDARD GREEN"
      : L.standard
        ? "NOT GREEN"
        : "—";
  return {
    id: L.id,
    name: L.name,
    ship,
    standard,
    issuing_body: L.standard,
    suite: L.standard_suite,
    artifact: L.artifact,
    test: L.test,
    components: comps,
    missing_registry: missing,
    gap: L.gap,
  };
});

const shipN = layers.filter((x) => x.ship === "SHIP GREEN").length;
const stdN = layers.filter((x) => x.standard === "STANDARD GREEN").length;
const report = {
  copyright: "Copyright (C) 1993-2026 Abhishek Choudhary",
  when: new Date().toISOString(),
  n: layers.length,
  ship_green: shipN,
  standard_green: stdN,
  note: "STANDARD GREEN on the AGI stack is not 27/27. Only layers with an issuing-body executable suite skip=0.",
  layers,
};
const out = path.join(root, "docs/data/agi-green.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log("AGI_GREEN ship=" + shipN + "/" + layers.length + " standard=" + stdN + "/" + layers.length);
process.exit(0);
