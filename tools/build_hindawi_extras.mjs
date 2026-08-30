#!/usr/bin/env node
/* samples/, exercises/ and a script round-trip report for every distribution. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(root, 'hindawi');
const TBL = path.join(root, 'retrieved/romenagri/tables');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'docs/data/hindawi-dists.json'), 'utf8'));

const kw = (dir) => {
  const m = new Map();
  const g = path.join(dir, 'guru', 'h2c.uhin');
  if (!fs.existsSync(g)) return m;
  for (const l of fs.readFileSync(g, 'utf8').split('\n')) {
    const x = l.match(/^(\S+)\t+\{printf\("([^"]*)"\);\}/);
    if (x) m.set(x[2], x[1]);          // c keyword -> native
  }
  return m;
};
const W = (m, c, fb) => m.get(c) || fb || c;

const EX = [
  { id: '01-namaste', title: 'Hello', c: ['print'],
    body: (m) => `<शैली गुरु>
#${W(m,'include','#include')} <${W(m,'stdio.h','मानकपन.स')}>
${W(m,'int','int')} ${W(m,'main','main')}()
{
\t${W(m,'printf','printf')}("नमस्ते Hindawi\\n");
\t${W(m,'return','return')} 0;
}` },
  { id: '02-ginti', title: 'Count to ten', c: ['for'],
    body: (m) => `<शैली गुरु>
#${W(m,'include','#include')} <${W(m,'stdio.h','मानकपन.स')}>
${W(m,'int','int')} ${W(m,'main','main')}()
{
\t${W(m,'int','int')} k;
\t${W(m,'for','for')}(k=1; k<=10; k++)
\t\t${W(m,'printf','printf')}("%d\\n",k);
\t${W(m,'return','return')} 0;
}` },
  { id: '03-vargamool', title: 'Factorial by recursion', c: ['if','return'],
    body: (m) => `<शैली गुरु>
#${W(m,'include','#include')} <${W(m,'stdio.h','मानकपन.स')}>
${W(m,'int','int')} f(${W(m,'int','int')} n)
{
\t${W(m,'if','if')}(n<2) ${W(m,'return','return')} 1;
\t${W(m,'return','return')} n*f(n-1);
}
${W(m,'int','int')} ${W(m,'main','main')}()
{
\t${W(m,'printf','printf')}("%d\\n",f(5));
\t${W(m,'return','return')} 0;
}` },
];
const TASKS = [
  ['Change the greeting to your own name.', 'Edit the string inside the quotes. Strings are NOT transduced — that is the rule.'],
  ['Make it count backwards from ten.', 'k=10; k>=1; k--'],
  ['Make it compute the sum 1..n instead of the product.', 'Replace n*f(n-1) with n+f(n-1) and return 0 at the base.'],
  ['Add a second function and call it from the first.', 'Declare it above main, or prototype it.'],
  ['Break it on purpose: remove a closing brace. Read the diagnostic.', 'The line number refers to the GENERATED host file, not your .uhin. That gap is real and recorded.'],
];

function roundTrip(script) {
  const f = path.join(TBL, script + '_to_deva.tsv');
  if (!fs.existsSync(f)) return null;
  const fwd = new Map(), rev = new Map();
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!l || l.startsWith('#') || !l.includes('\t')) continue;
    const [s, d] = l.split('\t'); if (!s || !d || s === 'src') continue;
    fwd.set(s, d); if (!rev.has(d)) rev.set(d, s);
  }
  let ok = 0, lossy = 0; const losses = [];
  for (const [s, d] of fwd) {
    const back = rev.get(d);
    if (back === s) ok++; else { lossy++; if (losses.length < 8) losses.push(`${s}->${d}->${back ?? '∅'}`); }
  }
  return { chars: fwd.size, roundtrip_ok: ok, lossy, losses,
    note: lossy ? 'many-to-one: distinct source characters share one Devanagari hub character, so the reverse leg cannot recover which' : 'bijective over this table' };
}

const rtCache = {}; const report = [];
for (const d of idx.distributions) {
  const dir = path.join(OUT, d.script, d.lang);
  const m = kw(dir);
  fs.mkdirSync(path.join(dir, 'samples'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'exercises'), { recursive: true });
  for (const e of EX) fs.writeFileSync(path.join(dir, 'samples', e.id + '.uhin'), e.body(m) + '\n');
  const lines = [`# अभ्यास — exercises for ${d.lang} (${d.script})`, '',
    'Each exercise starts from a sample. Change it, compile it, read what happens.',
    'Build first:  cd guru && make', ''];
  EX.forEach((e, i) => {
    lines.push(`## ${i + 1}. ${e.title}   \`samples/${e.id}.uhin\``, '',
      '```', e.body(m), '```', '',
      `**Do this.** ${TASKS[i][0]}`, `**Hint.** ${TASKS[i][1]}`, '');
  });
  lines.push('## 4. ' + TASKS[3][0], '', `**Hint.** ${TASKS[3][1]}`, '',
    '## 5. ' + TASKS[4][0], '', `**Hint.** ${TASKS[4][1]}`, '');
  fs.writeFileSync(path.join(dir, 'exercises', 'README.md'), lines.join('\n'));

  if (!(d.script in rtCache)) rtCache[d.script] = roundTrip(d.script);
  const rt = rtCache[d.script];
  fs.writeFileSync(path.join(dir, 'README.md'),
`# Hindawi — ${d.lang} (${d.script})

Copyright (C) 1993-2026 Abhishek Choudhary. GPL-3.0-or-later.
Part of the Hindawi Indic Programming System.

## Layout — the original structure

    guru/      गुरु      C        h2c.uhin  c2h.uhin  Makefile  gurucc
    shraeni/   श्रेणी     C++
    praatha/   प्राथमिक   BASIC
    kritrima/  कृत्रिम    Java
    soochee/   सूची      Python
    shabda/    शब्द      lex      composes:  h2l | h2c
    wyaaka/    व्याकरण   yacc     composes:  h2yacc | h2c
    yantra/    यंत्र      asm
    robot/     रोबोट     LOGO
    hindrv/    drivers   hincc  hin2std  std2hin
    keywords   one keyword per line
    samples/   runnable
    exercises/ do these

## Build and run

    cd guru && make          # h2c.uhin -> h2c.lex -> flex -> cc
    ./gurucc ../samples/01-namaste.uhin

A \`<शैली …>\` line selects the pipeline, as it always has.

## Keyword provenance — ${d.rows} keywords

${d.sources.map((s) => '- `' + s + '`').join('\n')}

\`tsv\`/\`csv\` are retrieved tables. \`inherited\` takes the vocabulary of a language
written in the same script and register. \`projected\` maps a Devanagari word
character-wise through this script's own transliteration table;
\`projected-partial\` means at least one character had no mapping and was carried
through unchanged. **All of it is editable** — this is a starting vocabulary for a
speaker to correct, not a claim of authority. Edit \`guru/h2c.uhin\` and re-make.

## Script round trip — ${d.script}

${rt ? `${rt.chars} characters in the table. **${rt.roundtrip_ok} round-trip exactly; ${rt.lossy} do not.**
${rt.note}${rt.losses.length ? '\n\nExamples of loss: `' + rt.losses.join('`  `') + '`' : ''}` : 'No transliteration table for this script.'}
`);
  report.push({ script: d.script, lang: d.lang, rows: d.rows, sources: d.sources, roundtrip: rt });
}
fs.writeFileSync(path.join(root, 'docs/data/hindawi-roundtrip.json'), JSON.stringify({
  copyright: 'Copyright (C) 1993-2026 Abhishek Choudhary',
  method: 'each character in <script>_to_deva.tsv is mapped to Devanagari and back; a character that does not return to itself is counted lossy',
  scripts: Object.entries(rtCache).filter(([, v]) => v).map(([k, v]) => ({ script: k, ...v })) }, null, 1));
console.log(`samples + exercises written for ${report.length} distributions`);
for (const [s, v] of Object.entries(rtCache)) if (v)
  console.log(`  ${s.padEnd(14)} ${String(v.roundtrip_ok).padStart(3)}/${String(v.chars).padStart(3)} round-trip${v.lossy ? '  ' + v.lossy + ' lossy' : '  bijective'}`);
