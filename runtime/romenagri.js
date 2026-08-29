/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Loads retrieved Romenagri. Does not invent maps.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { Romenagri } = require("../retrieved/romenagri/bindings/js/romenagri.js");
const BASIS_PATH = path.join(root, "retrieved/romenagri/tables/canonical_basis.json");

let _engine = null;

export function basisPath() {
  return BASIS_PATH;
}

export function loadBasis() {
  return JSON.parse(fs.readFileSync(BASIS_PATH, "utf8"));
}

export function engine() {
  if (!_engine) _engine = new Romenagri(loadBasis());
  return _engine;
}

export function toRomenagri(iscii) {
  return engine().toRomenagri(String(iscii));
}

export function toIscii(rmn) {
  return engine().toIscii(String(rmn));
}

export function inventory() {
  return {
    retrieved: true,
    invented_maps: false,
    binding: "retrieved/romenagri/bindings/js/romenagri.js",
    tables: "retrieved/romenagri/tables/canonical_basis.json",
    apcisr: "retrieved/legacy/APCISR",
    legacy_romenagri: "retrieved/legacy/Romenagri",
    basis_entries: loadBasis().length,
  };
}
