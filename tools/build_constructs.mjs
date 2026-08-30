#!/usr/bin/env node
/* THE CONSTRUCT IS PRIMARY.
 *
 *   ilm/constructs.csv    one row per CONSTRUCT, translated once per human
 *                         language. `for` is one row, not one row per host.
 *   ilm/decorators.csv    per host language, how that construct is realised:
 *                         the keyword, and any decorator it drags in
 *                         (stdio.h for C, iostream for C++, import for Python).
 *
 * The old table repeated `for` eight times because it was keyed on
 * host x keyword. Keyed on the construct, the translation work collapses from
 * 1,801 rows to the number of distinct constructs.                          */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const split=(l)=>{const o=[];let c='',q=false;
  for(let i=0;i<l.length;i++){const ch=l[i];
    if(q){if(ch==='"'&&l[i+1]==='"'){c+='"';i++;}else if(ch==='"')q=false;else c+=ch;}
    else if(ch==='"')q=true;else if(ch===','){o.push(c);c='';}else c+=ch;}
  o.push(c);return o;};
const esc=(s)=>(s==null?'':(/[",\n]/.test(s)?'"'+String(s).replace(/"/g,'""')+'"':String(s)));

const raw = fs.readFileSync(path.join(root,'ilm/keywords.csv'),'utf8').split('\n').filter(Boolean);
const head = split(raw[0]);
const rows = raw.slice(1).map((l)=>Object.fromEntries(split(l).map((v,i)=>[head[i],v])));
const META = ['construct','standard','host','kind','iso_clause','std_ref'];
const langs = head.filter((h)=>!META.includes(h));

/* The canonical construct set. A construct is a computational meaning; the
 * `hosts` map says how each language spells it and what it drags in.
 * `decorator` is the include/import a use of the construct requires.        */
const C = (id, cat, gloss, hosts) => ({ id, cat, gloss, hosts });
const CONSTRUCTS = [
  C('IF','control','conditional branch',{c:'if',cpp:'if',java:'if',python:'if',basic:'IF',asm:'je',rust:'if',go:'if'}),
  C('ELSE','control','alternative branch',{c:'else',cpp:'else',java:'else',python:'else',basic:'ELSE',rust:'else',go:'else'}),
  C('WHILE','control','pre-test loop',{c:'while',cpp:'while',java:'while',python:'while',basic:'WHILE',rust:'while',go:'for'}),
  C('DO','control','post-test loop',{c:'do',cpp:'do',java:'do',basic:'DO',rust:'loop'}),
  C('FOR','control','counted loop',{c:'for',cpp:'for',java:'for',python:'for',basic:'FOR',rust:'for',go:'for'}),
  C('BREAK','control','leave the loop',{c:'break',cpp:'break',java:'break',python:'break',basic:'EXIT',rust:'break',go:'break'}),
  C('CONTINUE','control','next iteration',{c:'continue',cpp:'continue',java:'continue',python:'continue',rust:'continue',go:'continue'}),
  C('SWITCH','control','multiway branch',{c:'switch',cpp:'switch',java:'switch',python:'match',rust:'match',go:'switch'}),
  C('CASE','control','one arm of a multiway branch',{c:'case',cpp:'case',java:'case',python:'case',rust:'=>',go:'case'}),
  C('DEFAULT','control','the remaining arm',{c:'default',cpp:'default',java:'default',python:'_',rust:'_',go:'default'}),
  C('RETURN','control','return from a routine',{c:'return',cpp:'return',java:'return',python:'return',basic:'RETURN',asm:'ret',rust:'return',go:'return'}),
  C('GOTO','control','unconditional jump',{c:'goto',cpp:'goto',basic:'GOTO',asm:'jmp',go:'goto'}),
  C('INT','type','integer',{c:'int',cpp:'int',java:'int',python:'int',basic:'INTEGER',rust:'i32',go:'int'}),
  C('FLOAT','type','single-precision real',{c:'float',cpp:'float',java:'float',python:'float',basic:'SINGLE',rust:'f32',go:'float32'}),
  C('DOUBLE','type','double-precision real',{c:'double',cpp:'double',java:'double',basic:'DOUBLE',rust:'f64',go:'float64'}),
  C('CHAR','type','character',{c:'char',cpp:'char',java:'char',python:'str',basic:'STRING',rust:'char',go:'rune'}),
  C('VOID','type','no value',{c:'void',cpp:'void',java:'void',python:'None',rust:'()',go:''}),
  C('BOOL','type','truth value',{cpp:'bool',java:'boolean',python:'bool',rust:'bool',go:'bool'}),
  C('CONST','type','immutable binding',{c:'const',cpp:'const',java:'final',python:'Final',rust:'const',go:'const'}),
  C('STATIC','type','static storage',{c:'static',cpp:'static',java:'static',rust:'static',go:''}),
  C('UNSIGNED','type','no sign bit',{c:'unsigned',cpp:'unsigned',rust:'u32',go:'uint'}),
  C('STRUCT','data','product type',{c:'struct',cpp:'struct',python:'dataclass',rust:'struct',go:'struct'}),
  C('UNION','data','sum over one storage',{c:'union',cpp:'union',rust:'union'}),
  C('ENUM','data','enumerated type',{c:'enum',cpp:'enum',java:'enum',python:'Enum',rust:'enum'}),
  C('CLASS','oo','class',{cpp:'class',java:'class',python:'class',rust:'impl'}),
  C('NEW','oo','allocate an object',{cpp:'new',java:'new',python:'',rust:'Box::new'}),
  C('PUBLIC','oo','externally visible',{cpp:'public',java:'public',rust:'pub',go:''}),
  C('PRIVATE','oo','not externally visible',{cpp:'private',java:'private',python:'_',rust:''}),
  C('VIRTUAL','oo','dynamically dispatched',{cpp:'virtual',java:'abstract',rust:'dyn'}),
  C('TEMPLATE','oo','parametric over types',{cpp:'template',java:'<T>',rust:'<T>',go:'[T any]'}),
  C('TRY','error','guarded region',{cpp:'try',java:'try',python:'try',rust:'match'}),
  C('CATCH','error','handle a failure',{cpp:'catch',java:'catch',python:'except',rust:'Err'}),
  C('THROW','error','raise a failure',{cpp:'throw',java:'throw',python:'raise',rust:'panic!'}),
  C('PRINT','io','write to standard output',{c:'printf',cpp:'cout',java:'System.out.println',python:'print',basic:'PRINT',rust:'println!',go:'fmt.Println'}),
  C('READ','io','read from standard input',{c:'scanf',cpp:'cin',java:'Scanner',python:'input',basic:'INPUT',rust:'read_line',go:'fmt.Scan'}),
  C('INCLUDE','module','bring in another unit',{c:'#include',cpp:'#include',java:'import',python:'import',rust:'use',go:'import'}),
  C('DEFINE','module','textual macro',{c:'#define',cpp:'#define',rust:'macro_rules!'}),
  C('MAIN','module','program entry point',{c:'main',cpp:'main',java:'main',python:'__main__',basic:'',rust:'main',go:'main'}),
  C('FUNCTION','module','named routine',{c:'',cpp:'',java:'',python:'def',basic:'SUB',rust:'fn',go:'func'}),
];
// Decorators: what a USE of this construct drags in, per host language.
const DECOR = {
  'PRINT:c':'stdio.h','READ:c':'stdio.h','PRINT:cpp':'iostream','READ:cpp':'iostream',
  'PRINT:go':'fmt','READ:go':'fmt','READ:java':'java.util.Scanner','READ:python':'',
  'STRUCT:python':'dataclasses','ENUM:python':'enum','CONST:python':'typing.Final',
  'PRINT:rust':'','TEMPLATE:go':'','CLASS:rust':'','THROW:rust':'',
  'INT:c':'stdint.h (fixed width)','FLOAT:c':'','BOOL:cpp':'stdbool.h (C)',
};
// Pull the human-language translations already present, keyed by the standard word.
const byStd = {};
for (const r of rows) for (const l of langs) if (r[l] && !byStd[l]) byStd[l] = {};
for (const r of rows) for (const l of langs) if (r[l]) { (byStd[l] ||= {})[r.standard] ||= r[l]; }

const hostList = [...new Set(CONSTRUCTS.flatMap((c)=>Object.keys(c.hosts)))].sort();
const cOut = ['construct,category,gloss,' + langs.join(',')];
const dOut = ['construct,host,keyword,decorator'];
let translated = 0;
for (const c of CONSTRUCTS) {
  const cells = langs.map((l) => {
    const anchor = c.hosts.c || c.hosts.cpp || c.hosts.python || '';
    const v = (byStd[l] && byStd[l][anchor]) || '';
    if (v) translated++;
    return v;
  });
  cOut.push([c.id, c.cat, c.gloss, ...cells].map(esc).join(','));
  for (const h of hostList) {
    if (!(h in c.hosts)) continue;
    dOut.push([c.id, h, c.hosts[h], DECOR[c.id + ':' + h] ?? ''].map(esc).join(','));
  }
}
fs.writeFileSync(path.join(root,'ilm/constructs.csv'), cOut.join('\n')+'\n');
fs.writeFileSync(path.join(root,'ilm/decorators.csv'), dOut.join('\n')+'\n');
fs.writeFileSync(path.join(root,'docs/data/constructs.json'), JSON.stringify({
  copyright:'Copyright (C) 1993-2026 Abhishek Choudhary', license:'GPL-3.0-or-later',
  model:'the CONSTRUCT is primary. A construct is translated once per human language; ilm/decorators.csv says how each host language spells it and what a use of it drags in.',
  living:'both files are living documents — a standard revision changes decorators.csv, not the translation',
  constructs: CONSTRUCTS.length, categories:[...new Set(CONSTRUCTS.map((c)=>c.cat))],
  hosts: hostList, realisations: dOut.length-1,
  human_languages: langs.length,
  coverage: Object.fromEntries(langs.map((l)=>[l,
    CONSTRUCTS.filter((c)=>{const a=c.hosts.c||c.hosts.cpp||c.hosts.python||'';return byStd[l]&&byStd[l][a];}).length])),
}, null, 1));
console.log(`${CONSTRUCTS.length} constructs x ${langs.length} human languages`);
console.log(`${dOut.length-1} host realisations across ${hostList.length} host languages: ${hostList.join(' ')}`);
const cov = JSON.parse(fs.readFileSync(path.join(root,'docs/data/constructs.json'),'utf8')).coverage;
console.log('translated per language:', Object.entries(cov).map(([k,v])=>k.slice(0,4)+':'+v).join(' '));
