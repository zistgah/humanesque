#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Cultural computation of the *build instant*. Not a prediction.
 * Be respectful: pañcāṅga is heritage astronomy, not advice.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(root, "apps/project-ilm/chakra/src/chakra-core.js"), "utf8");
const ctx = { module: { exports: {} } };
ctx.exports = ctx.module.exports;
vm.createContext(ctx);
vm.runInContext(code, ctx);
const C = ctx.module.exports;
const now = new Date();
const Y = now.getUTCFullYear(), M = now.getUTCMonth() + 1, D = now.getUTCDate();
const UT = now.getUTCHours() + now.getUTCMinutes() / 60;
const d = C.dayNo(Y, M, D, UT);
const pan = C.panchanga(d, Y);
const jdn = C.greg2jdn(Y, M, D);
const rec = {
  disclaimer: "Cultural / heritage computation of this software build instant. Not a prediction, not advice, not a religious ruling. Respect the traditions named.",
  utc: now.toISOString(),
  chakra: C.version,
  vara: pan.vara,
  tithi: pan.tithi,
  nakshatra: pan.nak,
  yoga: pan.yoga,
  hebrew: C.hebrew(jdn),
  nanakshahi: C.nanakshahi(jdn),
};
const dir = path.join(root, "docs/trivia");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "BUILD_CHART.json"), JSON.stringify(rec, null, 2));
fs.writeFileSync(path.join(dir, "index.html"), `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Trivia — build pañcāṅga</title><link rel="stylesheet" href="../site.css"/></head>
<body class="site"><header class="site-head"><strong>TRIVIA</strong>
<nav><a href="../index.html">Home</a><a href="../chakra/">Chakra</a></nav></header>
<main class="site-main">
<h1>Build chart</h1>
<p><strong>This is not a prediction.</strong> It is the pañcāṅga of the clock time at which this zip was built, computed by retrieved CHAKRA (v${C.version}). Traditions named here are treated with respect. No muhūrta, no advice, no claim of fate.</p>
<pre>${JSON.stringify(rec, null, 2)}</pre>
<p class="fine">Algorithm: Schlyter ephemeris + Lahiri ayanāṁśa in <code>chakra-core.js</code>. Fun section only.</p>
</main></body></html>
`);
console.log("trivia", rec.vara, rec.tithi, rec.nakshatra);
