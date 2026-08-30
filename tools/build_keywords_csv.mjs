#!/usr/bin/env node
/* ONE canonical CSV. Romenagri is the spine.
 *
 * Every distribution is generated from this file. Nothing else is authored, and
 * 49 duplicated transducer trees stop being the source of anything. Columns:
 *
 *   construct     stable id for the computational construct (the STANDARD axis)
 *   standard      the ISO/host keyword it realises
 *   host          which host language that keyword belongs to
 *   iso_clause    the clause of the language standard that defines it
 *   romenagri     the ASCII-7 spine form — must be a legal C identifier
 *   <lang>...     one column per human language (the LANGUAGE axis)
 *
 * Script is deliberately NOT a column: it is a projection applied at generation
 * time from retrieved/romenagri/tables. Three axes, one file each.           */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEG = path.join(root, 'retrieved/legacy/Hindawi');
const KW = JSON.parse(fs.readFileSync(path.join(root, 'docs/data/ilm-keywords.json'), 'utf8'));

// ISO clauses for the C keyword set — C11 (ISO/IEC 9899:2011) §6.4.1 and §6.10.
const ISO_C = {
  auto:'6.4.1', break:'6.8.6.3', case:'6.8.4.2', char:'6.7.2', const:'6.7.3',
  continue:'6.8.6.2', default:'6.8.4.2', do:'6.8.5.2', double:'6.7.2', else:'6.8.4.1',
  enum:'6.7.2.2', extern:'6.7.1', float:'6.7.2', for:'6.8.5.3', goto:'6.8.6.1',
  if:'6.8.4.1', inline:'6.7.4', int:'6.7.2', long:'6.7.2', register:'6.7.1',
  restrict:'6.7.3', return:'6.8.6.4', short:'6.7.2', signed:'6.7.2', sizeof:'6.5.3.4',
  static:'6.7.1', struct:'6.7.2.1', switch:'6.8.4.2', typedef:'6.7.1', union:'6.7.2.1',
  unsigned:'6.7.2', void:'6.7.2', volatile:'6.7.3', while:'6.8.5.1',
  '#include':'6.10.2', '#define':'6.10.3', '#if':'6.10.1', '#ifdef':'6.10.1',
  '#ifndef':'6.10.1', '#else':'6.10.1', '#elif':'6.10.1', '#endif':'6.10.1',
  '#error':'6.10.5', '#line':'6.10.4', '#pragma':'6.10.6', '#undef':'6.10.3',
  printf:'7.21.6.3', scanf:'7.21.6.4', main:'5.1.2.2.1',
};
const ISO_CPP = { class:'12', public:'11', private:'11', protected:'11', virtual:'13.3',
  new:'7.6.2.8', delete:'7.6.2.9', template:'13', namespace:'9.8', try:'14.2',
  catch:'14.2', throw:'14.2', this:'7.5.2', operator:'12.4', friend:'11.8', bool:'6.8.2' };

// romenagri -> C, straight out of the retrieved transducer. This is the spine.
function retrievedRules(file) {
  const out = [];
  if (!fs.existsSync(file)) return out;
  for (const l of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = l.match(/^(\S+)\s+\{printf\("([^"]*)"\);\}\s*$/);
    if (m) out.push({ from: m[1], to: m[2] });
  }
  return out;
}
// Each host names TWO retrieved files: the .lex carries the romenagri spine,
// the .uhin carries the SAME rules in Devanagari — that is Hindi's own
// vocabulary, 323 words for C, not the 29 of the summary table.
const HOSTS = [
  ['c',   'guru/h2c.lex',        ISO_C,   'ISO/IEC 9899:2011', 'guru/h2c.uhin'],
  ['cpp', 'shraeni/h2cpp.uhin',  ISO_CPP, 'ISO/IEC 14882:2020'],
  ['basic','praatha/h2b.uhin',   {},      'ECMA-116 / QB64'],
  ['java','kritrima/h2j.uhin',   {},      'JLS SE 17'],
  ['python','soochee/h2py.uhin', {},      'Python 3 reference'],
  ['lex', 'shabda/h2l.uhin',     {},      'POSIX.1-2017 lex'],
  ['yacc','wyaaka/h2yacc.uhin',  {},      'POSIX.1-2017 yacc'],
  ['asm', 'yantra/h2y.uhin',     {},      'x86 / gas'],
];

// The LANGUAGE axis, from the retrieved per-language tables.
const langs = Object.keys(KW.languages).sort();
const nativeByC = {};                       // lang -> Map(cKeyword -> native)
const romenagriByC = new Map();             // c -> romenagri, from any table that has one
for (const l of langs) {
  const rows = KW.languages[l].rows || KW.languages[l];
  nativeByC[l] = new Map(rows.filter((r) => r.c && r.native).map((r) => [r.c, r.native]));
  for (const r of rows) if (r.c && r.romenagri && !romenagriByC.has(r.c)) romenagriByC.set(r.c, r.romenagri);
}

const esc = (s) => (s == null ? '' : (/[",\n]/.test(s) ? '"' + String(s).replace(/"/g, '""') + '"' : String(s)));
const rows = [];
const seen = new Set();
for (const [host, file, iso, std, devaFile] of HOSTS) {
  // pair the romenagri rules with the Devanagari rules by their shared target
  const deva = new Map();
  if (devaFile) for (const r of retrievedRules(path.join(LEG, devaFile)))
    if (/[\u0900-\u097F]/.test(r.from) && !deva.has(r.to)) deva.set(r.to, r.from);
  for (const r of retrievedRules(path.join(LEG, file))) {
    if (!/^[\u0900-\u097F\w#_.\\]+$/.test(r.from)) continue;      // skip regex rules
    const key = host + ':' + r.to;
    if (seen.has(key)) continue; seen.add(key);
    // The spine: prefer the retrieved romenagri from h2c.lex; else the language tables.
    const rom = /^[\x00-\x7F]+$/.test(r.from) ? r.from : (romenagriByC.get(r.to) || '');
    rows.push({ construct: (host + '_' + r.to).replace(/[^\w]/g, '_').toUpperCase(),
      standard: r.to, host, iso_clause: iso[r.to] || '', std_ref: std, romenagri: rom,
      // If the retrieved rule itself is in Devanagari, that IS hindi's word.
      kind: /\./.test(r.to) ? 'header' : (/^#/.test(r.to) ? 'directive' : 'identifier'),
      hindi_retrieved: /[\u0900-\u097F]/.test(r.from) ? r.from : (deva.get(r.to) || '') });
  }
}
// SCRIPT is not a column and neither is its romanisation. A language column
// holds the construct in THAT LANGUAGE'S OWN SCRIPT. Transliteration between
// scripts is the Romenagri kernel's axis and lives in retrieved/romenagri.
const header = ['construct','standard','host','kind','iso_clause','std_ref', ...langs];
const lines = [header.join(',')];
for (const r of rows) {
  const cells = [r.construct, r.standard, r.host, r.kind, r.iso_clause, r.std_ref];
  for (const l of langs) {
    let v = nativeByC[l].get(r.standard) || '';
    if (!v && l === 'hindi' && r.hindi_retrieved) v = r.hindi_retrieved;
    cells.push(v);
  }
  lines.push(cells.map(esc).join(','));
}
fs.mkdirSync(path.join(root, 'ilm'), { recursive: true });
fs.writeFileSync(path.join(root, 'ilm/keywords.csv'), lines.join('\n') + '\n');
// The romenagri spine is reported separately — it is the transliteration
// kernel's property, checked for C-identifier legality, and kept out of the
// keyword table entirely.
fs.writeFileSync(path.join(root, 'ilm/romenagri-spine.csv'),
  ['construct,standard,host,romenagri', ...rows.filter((r) => r.romenagri)
    .map((r) => [r.construct, r.standard, r.host, r.romenagri].map(esc).join(','))].join('\n') + '\n');

// ---- Romenagri compliance: the spine must be a legal C identifier ----------
const idOk = (s) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(s);
const spine = rows.filter((r) => r.romenagri && r.kind === 'identifier');
const headerForms = rows.filter((r) => r.romenagri && r.kind !== 'identifier');
const legal = spine.filter((r) => idOk(r.romenagri));
const illegal = spine.filter((r) => !idOk(r.romenagri));
const ascii7 = spine.filter((r) => /^[\x00-\x7F]*$/.test(r.romenagri));
// bijection: no two distinct constructs may share one romenagri form
const byRom = new Map();
for (const r of spine) { const k = r.host + ':' + r.romenagri; byRom.set(k, (byRom.get(k) || 0) + 1); }
const collisions = [...byRom.entries()].filter(([, n]) => n > 1);

const report = {
  copyright: 'Copyright (C) 1993-2026 Abhishek Choudhary', license: 'GPL-3.0-or-later',
  source: 'ilm/keywords.csv — generated from the retrieved transducers and language tables',
  rows: rows.length, languages: langs.length,
  by_host: Object.fromEntries(HOSTS.map(([h]) => [h, rows.filter((r) => r.host === h).length])),
  romenagri: { note: 'legality is asserted for identifiers only; header names and preprocessor directives are lex patterns and carry escapes by design',
    header_or_directive_forms: headerForms.length,
    with_spine: spine.length, ascii7: ascii7.length,
    c_identifier_legal: legal.length, illegal: illegal.length,
    illegal_examples: illegal.slice(0, 8).map((r) => r.romenagri + ' -> ' + r.standard),
    collisions: collisions.length, collision_examples: collisions.slice(0, 6).map(([k, n]) => k + ' x' + n) },
  standards: { c: { ref: 'ISO/IEC 9899:2011', mapped: rows.filter((r) => r.host === 'c' && r.iso_clause).length,
      of_keywords: Object.keys(ISO_C).length },
    cpp: { ref: 'ISO/IEC 14882:2020', mapped: rows.filter((r) => r.host === 'cpp' && r.iso_clause).length } },
  language_coverage: Object.fromEntries(langs.map((l) =>
    [l, rows.filter((r) => nativeByC[l].get(r.standard)).length])),
};
fs.writeFileSync(path.join(root, 'docs/data/keywords-compliance.json'), JSON.stringify(report, null, 1));
console.log(`ilm/keywords.csv — ${rows.length} constructs x ${langs.length} languages`);
console.log('by host:', JSON.stringify(report.by_host));
console.log(`romenagri spine: ${spine.length}  ascii7 ${ascii7.length}  C-identifier-legal ${legal.length}  illegal ${illegal.length}  collisions ${collisions.length}`);
if (illegal.length) console.log('  illegal:', report.romenagri.illegal_examples.join('  '));
console.log('ISO C clauses mapped:', report.standards.c.mapped, 'of', report.standards.c.of_keywords);
