#!/usr/bin/env node
/* Build the ILM matrix: (language × target) keyword tables.
 *
 * Two axes, kept apart, as ILM requires:
 *   SCRIPT   — retrieved/romenagri/tables/<script>_to_deva.tsv   (74 tables)
 *   LANGUAGE — retrieved/romenagri/langs/<lang>_c.tsv            (native ↔ romenagri)
 *   TARGET   — ilm/maps/<target>.map.json                        (romenagri → target)
 *
 * A cell is filled by joining language↔romenagri with romenagri→target. A
 * language with no keyword table gets a SKELETON: romenagri and target columns
 * filled from retrieved data, native column EMPTY and marked UNRESOLVED.
 * Nothing invents a native keyword. A wrong Tamil keyword is worse than none. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = path.join(root, 'retrieved/romenagri/langs');
const TBL   = path.join(root, 'retrieved/romenagri/tables');
const MAPS  = path.join(root, 'ilm/maps');
const OUT   = path.join(root, 'ilm/langs');

// The 22 scheduled languages of India, plus the Perso-Arabic set asked for.
const WANTED = [
  ['assamese','as','Bengali-Assamese'],['bengali','bn','Bengali'],['bodo','brx','Devanagari'],
  ['dogri','doi','Devanagari'],['gujarati','gu','Gujarati'],['hindi','hi','Devanagari'],
  ['kannada','kn','Kannada'],['kashmiri','ks','Perso-Arabic / Sharada'],['konkani','kok','Devanagari'],
  ['maithili','mai','Devanagari / Tirhuta'],['malayalam','ml','Malayalam'],['manipuri','mni','Meetei Mayek'],
  ['marathi','mr','Devanagari'],['nepali','ne','Devanagari'],['odia','or','Odia'],
  ['punjabi','pa','Gurmukhi'],['sanskrit','sa','Devanagari'],['santali','sat','Ol Chiki'],
  ['sindhi','sd','Perso-Arabic / Khudawadi'],['tamil','ta','Tamil'],['telugu','te','Telugu'],
  ['urdu','ur','Perso-Arabic'],
  ['punjabi_shahmukhi','pa-shahmukhi','Shahmukhi'],['arabic','ar','Arabic'],
  ['dari','prs','Perso-Arabic'],['pashto','ps','Perso-Arabic'],['persian','fa','Perso-Arabic'],
];
const SCRIPT_TABLE = { assamese:'bengali', bengali:'bengali', bodo:'devanagari', dogri:'dogra',
  gujarati:'gujarati', hindi:'devanagari', kannada:'kannada', kashmiri:'sharada', konkani:'devanagari',
  maithili:'tirhuta', malayalam:'malayalam', manipuri:'meetei_mayek', marathi:'devanagari',
  nepali:'devanagari', odia:'oriya', punjabi:'gurmukhi', sanskrit:'devanagari', santali:'ol_chiki',
  sindhi:'khudawadi', tamil:'tamil', telugu:'telugu' };

const maps = {};
for (const f of fs.readdirSync(MAPS).filter((x) => x.endsWith('.map.json'))) {
  const m = JSON.parse(fs.readFileSync(path.join(MAPS, f), 'utf8'));
  if (m.rules && m.rules.length) maps[m.target] = m;
}
const clean = (s) => String(s).replace(/\\/g, '').replace(/^\^|\$$/g, '');

function readLangTsv(lang) {
  const p = path.join(LANGS, lang + '_c.tsv');
  if (!fs.existsSync(p)) return null;
  const rows = [];
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [native, romenagri, c] = line.split('\t');
    if (!native || native === 'native') continue;
    rows.push({ native: native.trim(), romenagri: (romenagri || '').trim(), c: (c || '').trim() });
  }
  return rows;
}

const summary = [];
fs.mkdirSync(OUT, { recursive: true });
for (const [lang, iso, script] of WANTED) {
  const rows = readLangTsv(lang);
  const scriptTable = SCRIPT_TABLE[lang]
    ? path.join('retrieved/romenagri/tables', SCRIPT_TABLE[lang] + '_to_deva.tsv') : null;
  const scriptOk = scriptTable && fs.existsSync(path.join(root, scriptTable));
  const dir = path.join(OUT, lang); fs.mkdirSync(dir, { recursive: true });
  const cells = [];
  // C is the hub. Each language table gives native -> C directly. The retrieved
  // transducers give (hindi) romenagri -> target. Joining through the C keyword
  // identifies the CONCEPT across targets, which is what actually transfers:
  // `if` is the same construct whether it is written agara, enila or اگر.
  // The C transducer keys on romenagri; every other retrieved transducer keys on
  // native Devanagari. So the concept hub is the C keyword, and Devanagari is
  // reached through hindi_c.tsv (native <-> romenagri <-> C), which is retrieved.
  // Chain for a non-Hindi language: native -> C -> Devanagari -> target keyword.
  const hindi = readLangTsv('hindi') || [];
  const c2deva = new Map(hindi.filter((r) => r.c).map((r) => [r.c, r.native]));
  for (const [target, map] of Object.entries(maps)) {
    const r2t = new Map(map.rules.map((r) => [clean(r.from), r.to]));
    const lines = ['# ' + lang + ' → ' + target + '  |  script: ' + script +
      '  |  © 1993-2026 Abhishek Choudhary, GPL-3.0-or-later',
      '# native ← romenagri (retrieved/romenagri/langs) ; romenagri → target (' + map.source + ')',
      '# rows with an EMPTY native column are UNRESOLVED: a speaker must author them. Nothing here is invented.',
      'native\tromenagri\t' + target];
    let filled = 0, blank = 0;
    if (rows) {
      for (const row of rows) {
        let t = '';
        if (target === 'c') t = row.c || r2t.get(row.romenagri) || '';
        else {
          // native -> C (language table) -> hindi romenagri (C map, inverted)
          //        -> target keyword (this target's transducer)
          const deva = row.c ? c2deva.get(row.c) : null;
          t = (deva && r2t.get(deva)) || r2t.get(row.native) || '';
        }
        if (!t) continue;
        lines.push(row.native + '\t' + row.romenagri + '\t' + t); filled++;
      }
    }
    if (!filled) {                      // skeleton: every target keyword, native blank
      for (const [rm, t] of r2t) { if (!/^[a-z_]/.test(rm)) continue; lines.push('\t' + rm + '\t' + t); blank++; }
    }
    fs.writeFileSync(path.join(dir, target + '.tsv'), lines.join('\n') + '\n');
    cells.push({ target, filled, unresolved: blank, status: filled ? 'FILLED' : 'SKELETON' });
  }
  fs.writeFileSync(path.join(dir, 'META.json'), JSON.stringify({
    language: lang, iso639: iso, script, script_table: scriptOk ? scriptTable : null,
    script_axis: scriptOk ? 'RETRIEVED' : 'UNRESOLVED',
    language_axis: rows ? 'RETRIEVED' : 'UNRESOLVED',
    keyword_source: rows ? 'retrieved/romenagri/langs/' + lang + '_c.tsv' : null,
    invented: false, cells }, null, 1));
  summary.push({ lang, iso, script, scriptOk, rows: rows ? rows.length : 0, cells });
}
fs.writeFileSync(path.join(root, 'ilm/MATRIX.json'), JSON.stringify({ invented:false, generated:summary }, null, 1));
const T = Object.keys(maps);
console.log('lang'.padEnd(20) + 'script'.padEnd(9) + 'kw'.padEnd(5) + T.map((t)=>t.slice(0,5).padEnd(6)).join(''));
for (const s of summary) {
  console.log(s.lang.padEnd(20) + (s.scriptOk?'ok':'—').padEnd(9) + String(s.rows).padEnd(5) +
    s.cells.map((c) => (c.status==='FILLED' ? String(c.filled) : '·').padEnd(6)).join(''));
}
const F = summary.flatMap(s=>s.cells).filter(c=>c.status==='FILLED').length;
console.log(`\n${F} of ${summary.length*T.length} cells filled from retrieved data; the rest are skeletons marked UNRESOLVED.`);
