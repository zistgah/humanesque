#!/usr/bin/env node
/* Build a Hindawi distribution per LANGUAGE and per SCRIPT.
 *
 * THE RULE THAT WAS BROKEN BEFORE: the RETRIEVED transducer is the base. Every
 * one of its rules is carried — 323 for guru, 879 for shraeni, 354 for yantra,
 * the preprocessor directives, the header-name mappings, all of it. A language
 * distribution SUBSTITUTES the native words it has and carries the rest through
 * unchanged. It never reduces the transducer to the subset it has words for.
 * The previous build shipped 29 rules where 323 were retrieved. That is the
 * defect this file exists to prevent. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEG = path.join(root, 'retrieved/legacy/Hindawi');
const TBL = path.join(root, 'retrieved/romenagri/tables');
const OUT = path.join(root, 'hindawi');           // NOT dist/hindawi — grok owns that

const KW = JSON.parse(fs.readFileSync(path.join(root, 'docs/data/ilm-keywords.json'), 'utf8'));
const rowsOf = (l) => { const v = KW.languages[l]; return v ? (v.rows || v) : null; };

const SH = {
  guru:     { native:'गुरु',     host:'C',      t:'h2c',    r:'c2h',    dir:'guru',     drv:'gurucc',    tool:'cc',      ext:'.c',    pipe:[] },
  shraeni:  { native:'श्रेणी',    host:'C++',    t:'h2cpp',  r:'cpp2h',  dir:'shraeni',  drv:'shraenicc', tool:'c++',     ext:'.cpp',  pipe:[] },
  praatha:  { native:'प्राथमिक',  host:'BASIC',  t:'h2b',    r:'b2h',    dir:'praatha',  drv:'praathacc', tool:'basic',   ext:'.bas',  pipe:[] },
  kritrima: { native:'कृत्रिम',   host:'Java',   t:'h2j',    r:'j2h',    dir:'kritrima', drv:'kritrimacc',tool:'javac',   ext:'.java', pipe:[] },
  soochee:  { native:'सूची',     host:'Python', t:'h2py',   r:'py2h',   dir:'soochee',  drv:'soocheecc', tool:'python3', ext:'.py',   pipe:[] },
  shabda:   { native:'शब्द',     host:'lex',    t:'h2l',    r:'l2h',    dir:'shabda',   drv:'shabdacc',  tool:'flex',    ext:'.l',    pipe:['h2c'] },
  wyaaka:   { native:'व्याकरण',  host:'yacc',   t:'h2yacc', r:'yacc2h', dir:'wyaaka',   drv:'wyaakacc',  tool:'bison',   ext:'.y',    pipe:['h2c'] },
  yantra:   { native:'यंत्र',     host:'asm',    t:'h2y',    r:'y2h',    dir:'yantra',   drv:'yantracc',  tool:'as',      ext:'.asm',  pipe:[] },
  robot:    { native:'रोबोट',    host:'LOGO',   t:'h2logo', r:'logo2h', dir:'robot',    drv:'robotcc',   tool:'robot',   ext:'.logo', pipe:[] },
};

const LANGS = {
  devanagari: ['hindi','sanskrit','marathi','konkani','nepali','bodo','dogri','maithili',
               'marwari','bhojpuri','awadhi','magahi','rajasthani','pali','prakrit','sindhi_deva'],
  bengali:['bengali','assamese','manipuri_bengali'], gujarati:['gujarati'], gurmukhi:['punjabi'],
  oriya:['odia'], tamil:['tamil'], telugu:['telugu'], kannada:['kannada'], malayalam:['malayalam'],
  sinhala:['sinhala'], tirhuta:['maithili_tirhuta'], modi:['marathi_modi'], sharada:['kashmiri'],
  takri:['dogri_takri'], khudawadi:['sindhi_khudawadi'], ol_chiki:['santali'],
  meetei_mayek:['manipuri'], multani:['saraiki'], kaithi:['bhojpuri_kaithi'],
  grantha:['sanskrit_grantha'], newa:['nepal_bhasa'],
  perso_arabic:['urdu','shahmukhi','sindhi','kashmiri_perso','pashto','dari','persian','arabic','saraiki_perso'],
  hebrew:['hebrew'], syriac:['syriac','aramaic'], phoenician:['phoenician'],
};
const INHERIT = { marwari:'hindi', bhojpuri:'hindi', awadhi:'hindi', magahi:'hindi',
  rajasthani:'hindi', bodo:'hindi', dogri:'hindi', konkani:'marathi', maithili:'hindi',
  sindhi_deva:'sindhi', manipuri_bengali:'bengali', maithili_tirhuta:'hindi',
  marathi_modi:'marathi', dogri_takri:'hindi', sindhi_khudawadi:'sindhi',
  kashmiri_perso:'kashmiri', saraiki:'punjabi', saraiki_perso:'urdu',
  bhojpuri_kaithi:'hindi', sanskrit_grantha:'sanskrit', nepal_bhasa:'nepali',
  sinhala:'sanskrit', shahmukhi:'urdu' };

function scriptMap(script) {
  const f = path.join(TBL, script + '_to_deva.tsv');
  if (!fs.existsSync(f)) return null;
  const rev = new Map();
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('\t')) continue;
    const [src, deva] = line.split('\t');
    if (!src || !deva || src === 'src') continue;
    if (!rev.has(deva)) rev.set(deva, src);
  }
  return rev;
}
const project = (w, rev) => { let o = '', ok = true;
  for (const c of w) { const m = rev.get(c); if (m) o += m; else { o += c; if (/[\u0900-\u097F]/.test(c)) ok = false; } }
  return { text: o, complete: ok }; };

function langRows(lang, script) {
  const d = rowsOf(lang);
  if (d) return d.map((r) => ({ ...r, source: r.source || 'tsv' }));
  const from = INHERIT[lang]; const base = from && rowsOf(from);
  if (!base) return null;
  const rev = script && script !== 'perso_arabic' && scriptMap(script);
  return base.map((r) => {
    if (!rev || script === 'devanagari' || /[\u0600-\u06FF\u0590-\u05FF]/.test(r.native))
      return { ...r, source: 'inherited:' + from };
    const p = project(r.native, rev);
    return { ...r, native: p.text, source: (p.complete ? 'projected:' : 'projected-partial:') + from };
  });
}

/** Read a retrieved transducer and return { head, rules[], tail } with EVERY rule. */
function readTransducer(file) {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const i = lines.findIndex((l) => l.trim() === '%%');
  const j = lines.map((l, k) => [l, k]).filter(([l], k) => k > i && l.trim() === '%%').map(([, k]) => k)[0];
  if (i < 0) return null;
  const body = lines.slice(i + 1, j === undefined ? lines.length : j);
  const rules = body.map((l) => {
    const m = l.match(/^(\S+)(\s+)\{printf\("([^"]*)"\);\}\s*$/);
    return m ? { from: m[1], gap: m[2], to: m[3], raw: l } : { raw: l };
  });
  return { head: lines.slice(0, i + 1).join('\n'), rules,
    tail: j === undefined ? '\n%%\n' : '\n' + lines.slice(j).join('\n'), total: rules.filter((r) => r.to !== undefined).length };
}

let built = 0; const index = [];
fs.rmSync(OUT, { recursive: true, force: true });
const TR = {};
for (const [sh, cfg] of Object.entries(SH)) {
  for (const c of [[cfg.t, 'fwd'], [cfg.r, 'rev']]) {
    const p = path.join(LEG, cfg.dir, c[0] + '.uhin');
    TR[sh + ':' + c[1]] = readTransducer(p);
  }
}

for (const [script, langs] of Object.entries(LANGS)) {
  for (const lang of langs) {
    const rows = langRows(lang, script);
    if (!rows) continue;
    const dir = path.join(OUT, script, lang);
    fs.mkdirSync(dir, { recursive: true });
    // native word for a given C keyword, when this language supplies one
    const sub = new Map(rows.filter((r) => r.native && r.c).map((r) => [r.c, r.native]));
    const perShaili = {};

    for (const [sh, cfg] of Object.entries(SH)) {
      const sd = path.join(dir, cfg.dir); fs.mkdirSync(sd, { recursive: true });
      const fwd = TR[sh + ':fwd'], rev = TR[sh + ':rev'];
      let carried = 0, replaced = 0;
      if (fwd) {
        const out = fwd.rules.map((r) => {
          if (r.to === undefined) return r.raw;             // comments, blanks, regex rules — carried verbatim
          const n = sub.get(r.to);
          if (n && n !== r.from) { replaced++; return n + r.gap + `{printf("${r.to}");}`; }
          carried++; return r.raw;                           // EVERY retrieved rule survives
        });
        fs.writeFileSync(path.join(sd, cfg.t + '.uhin'), fwd.head + '\n' + out.join('\n') + fwd.tail);
      }
      if (rev) fs.writeFileSync(path.join(sd, cfg.r + '.uhin'),
        rev.head + '\n' + rev.rules.map((r) => {
          if (r.to === undefined) return r.raw;
          const n = sub.get(r.from); return n ? r.from + r.gap + `{printf("${n}");}` : r.raw;
        }).join('\n') + rev.tail);
      perShaili[sh] = { rules: fwd ? fwd.total : 0, replaced, carried };

      const chain = ['|', cfg.t, ...cfg.pipe.map((p) => '| ' + p)].join(' ').replace('| |', '|');
      fs.writeFileSync(path.join(sd, cfg.drv),
`#!/bin/bash
#Copyright (C) 1993-2026 Abhishek Choudhary
#This file is part of the Hindawi Indic Programming System.
#Shaili ${cfg.dir} (${cfg.native}) — ${cfg.host} — ${lang}

echo संकलन के परिणाम >  tempfil0123.tmphin
echo ============ >> tempfil0123.tmphin
cat $1 | acii2uni | iconv -f UTF-16 -t UTF-8 ${chain} > tempfil0123.tmphin${cfg.ext}
${cfg.tool} tempfil0123.tmphin${cfg.ext} 2>> tempfil0123.tmphin
cat tempfil0123.tmphin
rm tempfil0123.tmphin
`, { mode: 0o755 });
      const legMake = path.join(LEG, cfg.dir, 'Makefile');
      if (fs.existsSync(legMake)) fs.copyFileSync(legMake, path.join(sd, 'Makefile'));
      else fs.writeFileSync(path.join(sd, 'Makefile'),
`all: ${cfg.t} ${cfg.r}
${cfg.t}: ${cfg.t}.lex
\tflex -8 -o${cfg.t}.yy.c ${cfg.t}.lex && cc ${cfg.t}.yy.c -o${cfg.t} -lfl
${cfg.t}.lex: ${cfg.t}.uhin
\tcat ${cfg.t}.uhin | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf > ${cfg.t}.lex
${cfg.r}: ${cfg.r}.lex
\tflex -8 -o${cfg.r}.yy.c ${cfg.r}.lex && cc ${cfg.r}.yy.c -o${cfg.r} -lfl
${cfg.r}.lex: ${cfg.r}.uhin
\tcat ${cfg.r}.uhin | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf > ${cfg.r}.lex
clean:
\trm -f *.lex *.yy.c ${cfg.t} ${cfg.r}
`);
    }
    // hindrv, and the FULL retrieved keywords file with this language's words merged in
    fs.mkdirSync(path.join(dir, 'hindrv'), { recursive: true });
    for (const f of fs.readdirSync(path.join(LEG, 'hindrv')))
      fs.copyFileSync(path.join(LEG, 'hindrv', f), path.join(dir, 'hindrv', f));
    const legKw = fs.readFileSync(path.join(LEG, 'keywords'), 'utf8').split('\n').filter(Boolean);
    const merged = [...new Set([...legKw, ...rows.map((r) => r.native).filter(Boolean)])].sort();
    fs.writeFileSync(path.join(dir, 'keywords'), merged.join('\n') + '\n');

    const tot = Object.values(perShaili).reduce((a, b) => a + b.rules, 0);
    index.push({ script, lang, keywords: merged.length, native_words: rows.length,
      rules: tot, shailis: perShaili,
      sources: [...new Set(rows.map((r) => String(r.source).split(':')[0]))] });
    built++;
  }
}
fs.writeFileSync(path.join(root, 'docs/data/hindawi-dists.json'), JSON.stringify({
  copyright: 'Copyright (C) 1993-2026 Abhishek Choudhary', license: 'GPL-3.0-or-later',
  base: 'every retrieved transducer rule is carried; a language substitutes the words it has and carries the rest through unchanged',
  shailis: Object.entries(SH).map(([k, v]) => ({ shaili: k, native: v.native, host: v.host, composes_with: v.pipe })),
  distributions: index }, null, 1));
console.log(`built ${built} distributions, ${new Set(index.map((i) => i.script)).size} scripts`);
const h = index.find((i) => i.lang === 'hindi');
console.log('hindi rules per shaili:', JSON.stringify(Object.fromEntries(
  Object.entries(h.shailis).map(([k, v]) => [k, v.rules + (v.replaced ? `(+${v.replaced} localised)` : '')]))));
console.log('hindi keywords file:', h.keywords, '· total rules:', h.rules);
