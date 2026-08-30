#!/usr/bin/env node
/* ilm/corpus.csv — the MASTER LANGUAGE CORPUS.
 *
 * Every programming language covered anywhere in this tree, extracted from the
 * tree itself: the standard-green index, the .pni frontends, languages/*.pni,
 * the 46 toolchain bins, and the layer selections. Deduplicated.
 *
 * Per the architecture: 27 layers x 3 selections = 81, PLUS X additional
 * significant/domain languages the corpus already covers. This file is that
 * corpus, with which evidence names each language and what role it plays. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R = (p) => { try { return fs.readFileSync(path.join(root, p), 'utf8'); } catch { return ''; } };
const L = (p) => { try { return fs.readdirSync(path.join(root, p)); } catch { return []; } };

const src = {};
const add = (id, where) => { if (!id) return; const k = id.toLowerCase();
  (src[k] ||= new Set()).add(where); };

// 1. the published standard-green index
try { for (const x of JSON.parse(R('docs/data/standard-green-index.json')).languages) add(x.id, 'green-index'); } catch {}
// 2. PANINI frontends
for (const f of L('src/panini/frontends')) if (f.endsWith('.pni'))
  { const n = f.replace('.pni',''); if (!['common_eval','to_c','application'].includes(n)) add(n,'frontend'); }
// 3. language definitions
for (const f of L('languages')) if (f.endsWith('.pni')) add(f.replace('.pni',''),'langdef');
// 4. toolchain bins  (pan<x> -> the language it names)
const BIN = { panc:'c',pancxx:'cpp',pancpp:'cpp-preproc',panpy:'python',panjs:'javascript',
  pants:'typescript',panjava:'java',pancs:'csharp',pankt:'kotlin',panrb:'ruby',panperl:'perl',
  panphp:'php',pango:'go',panrs:'rust',panzig:'zig',panpas:'pascal',panbas:'basic',
  panfort:'fortran',panhs:'haskell',panlisp:'lisp',panscm:'scheme',panforth:'forth',
  panlua:'lua',pansql:'sql',pancobol:'cobol',panada:'ada',panlogo:'logo',panlex:'lex',
  panyacc:'yacc',panas:'asm',panld:'ld',panmake:'make',pankconfig:'kconfig',panml:'ocaml',
  panjl:'julia',panoct:'octave',panpl:'prolog',panst:'smalltalk',panclj:'clojure',
  panr:'r',panscala:'scala',panswift:'swift',pandart:'dart',pansysml:'sysml',panpni:'panini' };
for (const f of L('toolchain/bin')) if (BIN[f]) add(BIN[f], 'toolchain-bin');
// 5. layer selections
const layerOf = {};
for (const line of R('ilm/layers.csv').split('\n').slice(1)) {
  const c = line.split(','); if (c.length < 5) continue;
  const lang = c[3].replace(/"/g,'').toLowerCase(); if (!lang) continue;
  add(lang, 'layer-pick');
  (layerOf[lang] ||= []).push(c[0] + ':' + c[2]);
}
// 6. host columns of the decorator table
for (const line of R('ilm/decorators.csv').split('\n').slice(1))
  { const c = line.split(','); if (c[1]) add(c[1], 'decorator-host'); }

// Roles, so the corpus is not a flat bag.
const TOOLCHAIN = new Set(['make','ld','kconfig','lex','yacc','cpp-preproc','asm','as']);
const HDL = new Set(['vhdl','verilog','systemverilog','verilog-a','chisel','spice']);
const PROOF = new Set(['lean','coq']);
const QUERY = new Set(['sql','sparql','datalog']);
const MODEL = new Set(['sysml']);

const esc = (s)=>/[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
const ids = Object.keys(src).sort();
const out = ['language,role,evidence,layers,in_green_index,has_frontend,has_langdef,has_bin,is_layer_pick'];
const roleOf = (k) => TOOLCHAIN.has(k) ? 'toolchain' : HDL.has(k) ? 'hardware'
  : PROOF.has(k) ? 'proof' : QUERY.has(k) ? 'query' : MODEL.has(k) ? 'modelling'
  : k === 'panini' ? 'panini' : 'general-purpose';
const counts = {};
for (const k of ids) {
  const w = src[k]; const role = roleOf(k); counts[role] = (counts[role]||0)+1;
  out.push([k, role, [...w].sort().join(' '), (layerOf[k]||[]).join(' '),
    w.has('green-index')?'y':'', w.has('frontend')?'y':'', w.has('langdef')?'y':'',
    w.has('toolchain-bin')?'y':'', w.has('layer-pick')?'y':''].map(esc).join(','));
}
fs.writeFileSync(path.join(root,'ilm/corpus.csv'), out.join('\n')+'\n');
fs.writeFileSync(path.join(root,'docs/data/corpus.json'), JSON.stringify({
  copyright:'Copyright (C) 1993-2026 Abhishek Choudhary', license:'GPL-3.0-or-later',
  extracted_from:['docs/data/standard-green-index.json','src/panini/frontends/*.pni',
    'languages/*.pni','toolchain/bin/*','ilm/layers.csv','ilm/decorators.csv'],
  total: ids.length, by_role: counts,
  layer_picks: Object.keys(layerOf).length,
  additional_beyond_layer_picks: ids.filter((k)=>!layerOf[k]).length,
  languages: ids }, null, 1));
console.log(`MASTER LANGUAGE CORPUS — ${ids.length} languages, deduplicated`);
console.log('by role:', JSON.stringify(counts));
console.log(`layer picks: ${Object.keys(layerOf).length} · additional beyond them: ${ids.filter((k)=>!layerOf[k]).length}`);
