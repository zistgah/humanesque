#!/usr/bin/env node
/* The Hindawi pipeline, as the shaili drivers actually run it.
 *
 *   source.uhin
 *     -> SCRIPT   axis: ACII/Unicode normalisation
 *     -> LANGUAGE axis: h2<shaili>, COMPOSED with any transducer it pipes into
 *     -> STANDARD axis: the host toolchain (cc / flex / bison / ...)
 *
 * Composition is the part that was missed: shabdacc runs `h2l | h2c`, and
 * wyaakacc runs `h2yacc | h2c`, because a lex or yacc action block IS C. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const SHAILIS = {
  guru:     { host:'C',      map:'c',      pipe:[],    ext:'.c',    build:'cc' },
  shraeni:  { host:'C++',    map:'cpp',    pipe:[],    ext:'.cpp',  build:'c++' },
  praatha:  { host:'BASIC',  map:'basic',  pipe:[],    ext:'.bas',  build:null },
  kritrima: { host:'Java',   map:'java',   pipe:[],    ext:'.java', build:null },
  soochee:  { host:'Python', map:'python', pipe:[],    ext:'.py',   build:'python3' },
  shabda:   { host:'lex',    map:'lex',    pipe:['c'], ext:'.l',    build:'flex' },
  wyaaka:   { host:'yacc',   map:'yacc',   pipe:['c'], ext:'.y',    build:'bison' },
  yantra:   { host:'asm',    map:'asm',    pipe:[],    ext:'.asm',  build:null },
  robot:    { host:'LOGO',   map:'logo',   pipe:[],    ext:'.logo', build:null },
};
const loadMap = (id) => JSON.parse(fs.readFileSync(path.join(root, 'ilm/maps', id + '.map.json'), 'utf8'));

/* The transduction itself is NOT reimplemented here. `tools/hincc.mjs` already
 * performs it correctly through the retrieved tables — verified end to end:
 * HindiC.uhin compiles, links, runs, and puts अ and क in DWARF. A second
 * implementation that half-works would be worse than none. This module records
 * the PIPELINE — which shaili composes with which — because that is what was
 * missing, and hands compilation to hincc. */

/** `<शैली NAME>` on line 1 selects the pipeline, exactly as the drivers do. */
export function shailiOf(src) {
  const m = src.match(/^\s*<\s*शैली\s+(\S+?)\s*>/);
  if (!m) return null;
  const native = { 'गुरु':'guru','श्रेणी':'shraeni','प्राथमिक':'praatha','कृत्रिम':'kritrima',
    'सूची':'soochee','शब्द':'shabda','व्याकरण':'wyaaka','यंत्र':'yantra','रोबोट':'robot' };
  return native[m[1]] || (SHAILIS[m[1]] ? m[1] : null);
}

/** Report the pipeline a source will run through. Does not transduce. */
export function plan(src, shaili) {
  const s = shaili || shailiOf(src);
  if (!s) return { ok:false, reason:'no <शैली …> declaration and no shaili given' };
  const cfg = SHAILIS[s];
  if (!cfg) return { ok:false, reason:`unknown shaili ${s}` };
  const m = loadMap(cfg.map);
  return { ok:true, shaili:s, host:cfg.host, ext:cfg.ext, build:cfg.build,
    own_rules: m.own_rules ?? m.rules.length,
    composed_rules: m.composed_rules ?? m.rules.length,
    composes_with: cfg.pipe,
    stages: ['acii2uni (script)', 'h2' + cfg.map + (cfg.pipe.length ? ' | h2' + cfg.pipe.join(' | h2') : '') + ' (language)',
      (cfg.build || 'host toolchain') + ' (standard)'],
    compile_with: 'tools/hincc.mjs' };
}

if (process.argv[1] && process.argv[1].endsWith('hindawi_pipeline.mjs')) {
  const f = process.argv[2];
  if (!f) { console.log('usage: hindawi_pipeline.mjs <file.uhin> [shaili]'); process.exit(2); }
  const r = plan(fs.readFileSync(f, 'utf8'), process.argv[3]);
  if (!r.ok) { console.error('hindawi: ' + r.reason); process.exit(3); }
  console.log(`shaili ${r.shaili}  host ${r.host}`);
  console.log(`  rules      ${r.own_rules} own`
    + (r.composes_with.length ? ` + ${r.composed_rules - r.own_rules} composed via h2${r.composes_with.join('|h2')}` : '')
    + `  = ${r.composed_rules}`);
  console.log(`  pipeline   ${r.stages.join('  ->  ')}`);
  console.log(`  compile    node ${r.compile_with} ${f}`);
}
