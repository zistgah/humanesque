#!/usr/bin/env node
/* Derive the desk's workflows FROM the .pni cyclers.
 * This is the loop Mez was missing: the desk read a hand-made snapshot while
 * the cyclers and a parser sat in the same tree. Run this and workflows.json
 * is derived, never authored. A cycler that changes changes the desk. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { readCyclers } from '../../engine/src/cycler.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, 'cyclers');
const out = {}; const skipped = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.pni')).sort()) {
  const { cyclers } = readCyclers(fs.readFileSync(path.join(dir, f), 'utf8'), { file: f });
  for (const c of cyclers) {
    if (!c.stages.length) { skipped.push(f); continue; }
    out[c.id.toLowerCase()] = {
      id: c.id, title: c.title, unit: c.unit, output: c.output, purpose: c.purpose,
      source: 'cyclers/' + f, derived: true,
      invariants: c.contract.invariants, refuses: c.contract.refuses, evidence: c.contract.evidence,
      stages: c.stages.map((s) => ({ id: s.id, title: s.id, verb: s.verb, density: s.density,
        boundary: s.boundary, produces: s.produces, prompt: s.prompt })),
    };
  }
}
for (const t of ['apps/mez/docs/workflows.json', 'apps/zistgah/mez/docs/workflows.json']) {
  const p = path.join(root, t);
  if (fs.existsSync(path.dirname(p))) fs.writeFileSync(p, JSON.stringify(out, null, 1));
}
console.log(`derived ${Object.keys(out).length} cyclers from cyclers/*.pni`);
for (const [k, v] of Object.entries(out))
  console.log(`  ${k.padEnd(22)} ${String(v.stages.length).padStart(3)} stages  ${v.stages.filter((s) => s.boundary).length} boundaries  <- ${v.source}`);
if (skipped.length) console.log(`  ${skipped.length} file(s) yielded no cycler (stage-nesting defect — see docs/GROK_UPDATE.md §1)`);
