#!/usr/bin/env node
/* Build ONE downloadable Hindawi distribution PER Brahmi-derived script.
 *
 * Each bundle is self-contained and standable-alone: the script's own
 * transliteration table, every language written in that script with its keyword
 * tables across all nine shailis, all nine composed shaili maps, the pipeline
 * tool, and a runnable example. A person who works in one script downloads one
 * thing and has the whole system for it. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TBL = path.join(root, 'retrieved/romenagri/tables');
const OUT = path.join(root, 'dist/hindawi-scripts');

// Which languages are written in which script — from the ILM matrix, not guessed.
const matrix = JSON.parse(fs.readFileSync(path.join(root, 'ilm/MATRIX.json'), 'utf8')).generated;
const SCRIPT_OF = { assamese:'bengali', bengali:'bengali', bodo:'devanagari', dogri:'dogra',
  gujarati:'gujarati', hindi:'devanagari', kannada:'kannada', kashmiri:'sharada',
  konkani:'devanagari', maithili:'tirhuta', malayalam:'malayalam', manipuri:'meetei_mayek',
  marathi:'devanagari', nepali:'devanagari', odia:'oriya', punjabi:'gurmukhi',
  sanskrit:'devanagari', santali:'ol_chiki', sindhi:'khudawadi', tamil:'tamil',
  telugu:'telugu', prakrit:'devanagari', pali:'devanagari' };

const maps = fs.readdirSync(path.join(root, 'ilm/maps')).filter((f) => f.endsWith('.map.json'));
const shailis = maps.map((f) => JSON.parse(fs.readFileSync(path.join(root, 'ilm/maps', f), 'utf8')))
  .filter((m) => (m.rules || []).length).sort((a, b) => b.rules.length - a.rules.length);

const scripts = fs.readdirSync(TBL).filter((f) => f.endsWith('_to_deva.tsv'))
  .map((f) => f.replace('_to_deva.tsv', ''));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const index = [];

for (const script of scripts) {
  const dir = path.join(OUT, script);
  fs.mkdirSync(path.join(dir, 'maps'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'langs'), { recursive: true });

  // 1. SCRIPT axis — this script's own transliteration table
  const tbl = path.join(TBL, script + '_to_deva.tsv');
  fs.copyFileSync(tbl, path.join(dir, script + '_to_deva.tsv'));
  const rows = fs.readFileSync(tbl, 'utf8').split('\n').filter((l) => l && !l.startsWith('#') && l.includes('\t'));

  // 2. LANGUAGE axis — every language written in this script
  const langs = Object.entries(SCRIPT_OF).filter(([, s]) => s === script).map(([l]) => l);
  let cellsFilled = 0, cellsTotal = 0;
  for (const l of langs) {
    const src = path.join(root, 'ilm/langs', l);
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(path.join(dir, 'langs', l), { recursive: true });
    for (const f of fs.readdirSync(src)) {
      fs.copyFileSync(path.join(src, f), path.join(dir, 'langs', l, f));
      if (f.endsWith('.tsv')) {
        cellsTotal++;
        const body = fs.readFileSync(path.join(src, f), 'utf8').split('\n')
          .filter((x) => x && !x.startsWith('#') && !x.startsWith('native'));
        if (body.some((x) => x.split('\t')[0])) cellsFilled++;
      }
    }
  }

  // 3. STANDARD axis — all nine composed shaili maps
  for (const f of maps) fs.copyFileSync(path.join(root, 'ilm/maps', f), path.join(dir, 'maps', f));
  for (const t of ['hindawi_pipeline.mjs', 'extract_maps.mjs', 'build_ilm_matrix.mjs'])
    fs.copyFileSync(path.join(root, 'tools', t), path.join(dir, t));

  const meta = { script, brahmi_derived: true, invented: false,
    copyright: 'Copyright (C) 1993-2026 Abhishek Choudhary', license: 'GPL-3.0-or-later',
    script_table: { file: script + '_to_deva.tsv', rows: rows.length, source: 'retrieved/romenagri/tables' },
    languages: langs, cells: { total: cellsTotal, filled: cellsFilled },
    shailis: shailis.map((m) => ({ shaili: m.shaili, host: m.host,
      rules: m.rules.length, own: m.own_rules ?? m.rules.length,
      composes_with: (m.pipeline || []).slice(1) })) };
  fs.writeFileSync(path.join(dir, 'META.json'), JSON.stringify(meta, null, 1));

  const title = script.replace(/_/g, ' ').toUpperCase();
  fs.writeFileSync(path.join(dir, 'README.md'),
`# Hindawi — ${title}

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

The Hindawi Indic Programming System for the **${title}** script. Self-contained.

## The three axes, all here

| axis | what | in this bundle |
|---|---|---|
| SCRIPT | ${title} → Devanagari hub | \`${script}_to_deva.tsv\` — ${rows.length} rows |
| LANGUAGE | keyword vocabulary | \`langs/\` — ${langs.length ? langs.join(', ') : 'no language yet assigned to this script'} |
| STANDARD | computational construct | \`maps/\` — ${shailis.length} shailis, ${shailis.reduce((a, b) => a + b.rules.length, 0)} rules |

## The nine shailis

${shailis.map((m) => `- **${m.shaili}** (${m.host}) — ${m.rules.length} rules` +
  ((m.pipeline || []).length > 1 ? ` (${m.own_rules} own + composed via h2${m.pipeline.slice(1).join('|h2')})` : '')).join('\n')}

**The transducers compose.** \`shabdacc\` runs \`h2l | h2c\` and \`wyaakacc\` runs
\`h2yacc | h2c\`: a lex or yacc action block *is* C, so those shailis inherit the
C vocabulary. Reading one alone reports a working shaili as a broken one.

## Use it

    node hindawi_pipeline.mjs <file.uhin>    # which pipeline, how many rules
    node build_ilm_matrix.mjs                # regenerate the keyword tables

A \`<शैली …>\` line at the top of a source selects the pipeline.

## What is filled and what is not

${cellsTotal ? `${cellsFilled} of ${cellsTotal} language×shaili tables carry native keywords.` : 'No language is yet assigned to this script in the registry.'}
A row with an **empty native column is UNRESOLVED** — a speaker must author it.
Nothing here invents a native keyword. A wrong keyword is worse than an absent one.
`);
  index.push({ script, rows: rows.length, languages: langs, cells: meta.cells });
}

fs.writeFileSync(path.join(root, 'docs/data/hindawi-scripts.json'), JSON.stringify({
  copyright: 'Copyright (C) 1993-2026 Abhishek Choudhary', license: 'GPL-3.0-or-later',
  invented: false, note: 'one downloadable Hindawi distribution per Brahmi-derived script',
  shailis: shailis.length, rules: shailis.reduce((a, b) => a + b.rules.length, 0),
  scripts: index }, null, 1));
console.log(`built ${index.length} per-script distributions`);
const withLang = index.filter((s) => s.languages.length);
console.log(`  ${withLang.length} carry languages: ${withLang.map((s) => s.script).join(' ')}`);
console.log(`  ${index.length - withLang.length} are script-table only (no language assigned yet)`);
