#!/usr/bin/env node
/**
 * AyeBIOS is SeaBIOS × Hindawi Shaili Guru. Flatten through hincc — do not invent maps.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileSource } from "../tools/hincc.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const boot = path.join(root, "retrieved/ayebios/src/boot.c.uhin");
const src = fs.readFileSync(boot, "utf8");
const r = compileSource(src, { lang: "hindi", shaili: "guru" });
const h = r.host_text || "";
const ok =
  r.shaili === "guru" &&
  /#include/.test(h) &&
  !/#समावेश/.test(h) &&
  /\bstruct\b/.test(h) &&
  /\bstatic\b/.test(h);
const report = {
  file: "retrieved/ayebios/src/boot.c.uhin",
  shaili: r.shaili,
  includes: (h.match(/#include/g) || []).length,
  samavesh_left: (h.match(/समावेश/g) || []).length,
  invented_maps: r.invented_maps,
  ok,
};
fs.mkdirSync(path.join(root, "docs/data"), { recursive: true });
fs.writeFileSync(path.join(root, "docs/data/ayebios.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
process.exit(0);
