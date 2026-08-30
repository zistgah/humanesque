#!/usr/bin/env node
/* Extract keyword maps from the RETRIEVED Hindawi transducers.
 * Source of truth is retrieved/legacy/Hindawi/<dir>/<name>.lex or .uhin — the
 * 2003-2023 GPL originals. Nothing here is authored; every rule is read out of
 * a file on disk, and a map whose source is missing is reported, never faked. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const H = path.join(root, 'retrieved/legacy/Hindawi');
// The eight shailis of the Hindawi system. Each names its host language and the
// retrieved transducer it is read out of. Nothing here is authored.
const TARGETS = [
  { id:'c',     shaili:'guru',     host:'C',      src:'guru/h2c.lex',       also:'guru/h2c.uhin' },
  { id:'cpp',   shaili:'shraeni',  host:'C++',    src:'shraeni/h2cpp.uhin' },
  { id:'basic', shaili:'praatha',  host:'BASIC',  src:'praatha/h2b.uhin' },
  { id:'java',  shaili:'kritrima', host:'Java',   src:'kritrima/h2j.uhin' },
  { id:'python',shaili:'soochee',  host:'Python', src:'soochee/h2py.uhin' },
  { id:'lex',   shaili:'shabda',   host:'lex',    src:'shabda/h2l.uhin' },
  { id:'yacc',  shaili:'wyaaka',   host:'yacc',   src:'wyaaka/h2yacc.uhin' },
  { id:'asm',   shaili:'yantra',   host:'asm',    src:'yantra/h2y.uhin' },
  { id:'logo',  shaili:'robot',    host:'LOGO',   src:'robot/ROBOT.C',      logo:true },
];
// A lex rule is:  pattern<whitespace>{ ... "replacement" ... }  or  pattern  replacement
function rulesFromLex(text) {
  const out = [];
  for (const line of text.split('\n')) {
    let m = line.match(/^([^\s%{}][^\s]*)\s+\{\s*(?:ECHO|printf|fprintf)?[^"]*"([^"]*)"/);
    if (!m) m = line.match(/^([^\s%{}][^\s]*)\s+\{\s*print\w*\("([^"]*)"/);
    if (m && m[1] && m[2] !== undefined) out.push({ from: m[1], to: m[2] });
  }
  return out;
}
// LOGO commands in ROBOT.C appear as quoted native/command pairs.
function rulesFromRobot(text) {
  const out = []; const seen = new Set();
  for (const line of text.split('\n')) {
    const m = line.match(/"([^"\s]{2,})"\s*,\s*"?([A-Za-z_][A-Za-z0-9_]*)"?/);
    if (m && !seen.has(m[1])) { seen.add(m[1]); out.push({ from: m[1], to: m[2] }); }
  }
  return out;
}

const report = [];
for (const t of TARGETS) {
  const cands = [t.src, t.also].filter(Boolean).map((s) => path.join(H, s));
  const found = cands.find((p) => fs.existsSync(p));
  if (!found) { report.push({ id: t.id, status: 'UNRESOLVED', reason: 'no retrieved transducer at ' + t.src }); continue; }
  const text = fs.readFileSync(found, 'utf8');
  // ROBOT.C carries the LOGO command table as C string pairs, not lex rules.
  const rules = t.logo ? rulesFromRobot(text) : (t.raw ? [] : rulesFromLex(text));
  const map = {
    target: t.id, shaili: t.shaili, host: t.host,
    source: path.relative(root, found), invented: false,
    extracted_at_rules: rules.length, rules,
  };
  fs.writeFileSync(path.join(root, 'ilm/maps', t.id + '.map.json'), JSON.stringify(map, null, 1));
  report.push({ id: t.id, shaili: t.shaili, host: t.host, status: rules.length ? 'EXTRACTED' : 'UNRESOLVED',
    rules: rules.length, source: map.source,
    reason: rules.length ? null : 'transducer present but no lex rules matched — needs a target-specific reader' });
}
// The already-published C map is authoritative; prefer it when richer.
const pub = path.join(root, 'docs/retrieved/h2c.map.json');
if (fs.existsSync(pub)) {
  const p = JSON.parse(fs.readFileSync(pub, 'utf8'));
  const mine = path.join(root, 'ilm/maps/c.map.json');
  const cur = fs.existsSync(mine) ? JSON.parse(fs.readFileSync(mine, 'utf8')) : { rules: [] };
  if (p.rules.length > cur.rules.length) {
    fs.writeFileSync(mine, JSON.stringify({ target:'c', source:p.source, invented:false,
      extracted_at_rules:p.rules.length, rules:p.rules }, null, 1));
    const r = report.find((x) => x.id === 'c'); if (r) { r.rules = p.rules.length; r.status = 'EXTRACTED'; r.source = p.source; }
  }
}
fs.writeFileSync(path.join(root, 'ilm/maps/INDEX.json'), JSON.stringify({ generated_from:'retrieved/legacy/Hindawi', invented:false, targets:report }, null, 1));
for (const r of report) console.log(`  ${r.id.padEnd(6)} ${r.status.padEnd(11)} ${String(r.rules ?? 0).padStart(4)} rules  ${r.source || r.reason}`);
