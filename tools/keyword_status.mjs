#!/usr/bin/env node
/* Publish translation coverage as STATUS. Not a gate.
 *
 * One column per language in ilm/keywords.csv holds the TRANSLATION of the
 * construct into that language. Nothing here transliterates, projects or
 * romanises: rendering a word into another script is the transliteration
 * algorithm's job (Romenagri / acii2uni / the script tables), and it already
 * exists. A missing translation is reported, and the build does not stop. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const split = (l) => { const o=[]; let c='',q=false;
  for (let i=0;i<l.length;i++){const ch=l[i];
    if(q){ if(ch==='"'&&l[i+1]==='"'){c+='"';i++;} else if(ch==='"')q=false; else c+=ch; }
    else if(ch==='"')q=true; else if(ch===','){o.push(c);c='';} else c+=ch;}
  o.push(c); return o; };
const raw = fs.readFileSync(path.join(root,'ilm/keywords.csv'),'utf8').split('\n').filter(Boolean);
const head = split(raw[0]);
const rows = raw.slice(1).map((l)=>Object.fromEntries(split(l).map((v,i)=>[head[i],v])));
const META = ['construct','standard','host','kind','iso_clause','std_ref'];
const langs = head.filter((h)=>!META.includes(h));
const hosts = [...new Set(rows.map((r)=>r.host))];

const per = {};
for (const l of langs) {
  const byHost = {};
  for (const h of hosts) {
    const rs = rows.filter((r)=>r.host===h);
    byHost[h] = { total: rs.length, translated: rs.filter((r)=>r[l]).length };
  }
  per[l] = { translated: rows.filter((r)=>r[l]).length, total: rows.length, by_host: byHost };
}
// The core set: what every language should carry first — the ISO-clause-bearing
// constructs. Coverage here matters more than the long tail of header names.
const core = rows.filter((r)=>r.iso_clause);
const coreCov = Object.fromEntries(langs.map((l)=>[l, core.filter((r)=>r[l]).length]));

const status = {
  copyright:'Copyright (C) 1993-2026 Abhishek Choudhary', license:'GPL-3.0-or-later',
  what:'translation coverage of ilm/keywords.csv. A language column holds the TRANSLATION of a construct. Rendering it into another script is the transliteration algorithm\'s job and is not represented here.',
  gate:'none — this is published status, not a build gate',
  constructs: rows.length, languages: langs.length,
  core_constructs: core.length, core_coverage: coreCov,
  per_language: per,
  needs_translation: Object.fromEntries(langs.map((l)=>[l, rows.filter((r)=>!r[l]).length])),
};
fs.writeFileSync(path.join(root,'docs/data/keyword-status.json'), JSON.stringify(status,null,1));
// A worksheet a speaker can fill: one file per language, only the empty cells.
// Worksheet is now over CONSTRUCTS, not host keywords: 13 rows to fill per
// language instead of 1,729, because `for` is translated once.
const cRaw = fs.readFileSync(path.join(root,'ilm/constructs.csv'),'utf8').split('\n').filter(Boolean);
const cHead = split(cRaw[0]);
const cRows = cRaw.slice(1).map((l)=>Object.fromEntries(split(l).map((v,i)=>[cHead[i],v])));
const wdir = path.join(root,'ilm/worksheets'); fs.rmSync(wdir,{recursive:true,force:true}); fs.mkdirSync(wdir,{recursive:true});
for (const l of langs) {
  const miss = cRows.filter((r)=>!r[l]);
  fs.writeFileSync(path.join(wdir, l + '.csv'),
    'construct,category,gloss,' + l + '\n' +
    miss.map((r)=>[r.construct,r.category,'"'+r.gloss+'"',''].join(',')).join('\n') + '\n');
}
status.construct_model = { constructs: cRows.length,
  untranslated: Object.fromEntries(langs.map((l)=>[l, cRows.filter((r)=>!r[l]).length])) };
fs.writeFileSync(path.join(root,'docs/data/keyword-status.json'), JSON.stringify(status,null,1));
console.log(`${rows.length} constructs · ${langs.length} languages · core (ISO clause) ${core.length}`);
console.log('language'.padEnd(13)+'translated'.padStart(11)+'  core'.padStart(7)+'   needs');
for (const l of langs)
  console.log(l.padEnd(13)+String(per[l].translated).padStart(11)+String(coreCov[l]+'/'+core.length).padStart(9)+String(status.needs_translation[l]).padStart(8));
console.log('\nworksheets: ilm/worksheets/<language>.csv — only the untranslated rows');
