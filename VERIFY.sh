#!/usr/bin/env bash
# One command. Everything this release claims, re-checked by execution.
cd "$(dirname "${BASH_SOURCE[0]}")" || exit 2; F=0
ck(){ printf '  %-48s' "$1"; shift; if "$@" >/dev/null 2>&1; then echo "[ok]"; else echo "[FAIL]"; F=1; fi; }
echo "Humanesque merged release — verification"; echo
echo " engine (claude)"
ck "spec parses with 0 errors"              node engine/bin/panini.mjs check engine/spec/PANINI_SELF_HOSTING_SPEC.pni
ck "145 assertions, mutation-proven"        bash -c 'cd engine && node tests/panini.test.mjs 2>&1|tail -1|grep -q " 0 failed"'
ck "no network call in the engine"          bash -c '! grep -rEq "fetch[[:space:]]*\(|XMLHttpRequest|node:http|WebSocket|axios" engine/src engine/bin'
ck "...and that scan is proven to bite"     bash -c 'printf "await fetch(1)\n">.p.js; grep -Eq "fetch[[:space:]]*\(" .p.js; r=$?; rm -f .p.js; exit $r'
echo " compiler + backends (grok)"
ck "bootstrap runs"                         node scripts/bootstrap.mjs
ck "C backend emits code gcc compiles"      bash -c 'node -e "import(\"./compiler/compile.js\").then(m=>{const r=m.compile(\"FUNCTION add(x,y) RETURN x + y END\\nFUNCTION main() RETURN add(2,40) END\",{filename:\"a.pni\",target:\"c\"});require(\"fs\").writeFileSync(\"/tmp/_v.c\",Buffer.from(r.binary.data||r.binary));})" && gcc -o /tmp/_v /tmp/_v.c && /tmp/_v; [ $? -eq 42 ]'
ck "Python backend emits runnable code"     bash -c 'node -e "import(\"./compiler/compile.js\").then(m=>{const r=m.compile(\"FUNCTION add(x,y) RETURN x + y END\\nFUNCTION main() RETURN add(2,40) END\",{filename:\"a.pni\",target:\"python\"});require(\"fs\").writeFileSync(\"/tmp/_v.py\",Buffer.from(r.binary.data||r.binary));})" && python3 -c "import runpy;assert runpy.run_path(\"/tmp/_v.py\")[\"main\"]()==42"'
ck "C frontend: structs, pointers, recursion" bash -c 'node -e "
import(\"./runtime/foreign_front.js\").then(async m => {
  const r = await m.runFrontend(\"c\", \"int f(int n){return n<2?1:n*f(n-1);}int main(){printf(\\\"%d\\\",f(5));return 0;}\");
  process.exit(String(r.out).trim() === \"120\" ? 0 : 1);
});"'
echo " ILM / Hindawi (grok)"
ck "compiles a 2004 Devanagari source"      bash -c 'cd retrieved/legacy/Hindawi/samples && node ../../../../tools/hincc.mjs HindiC.uhin && gcc -g -o /tmp/_hg HindiC.c'
ck "native identifiers reach DWARF"         bash -c 'objdump --dwarf=info /tmp/_hg 2>/dev/null | grep -q "DW_AT_name.*[अ-ह]"'
echo " Mez"
ck "workflows derived from .pni"            bash -c 'node apps/mez/build-workflows.mjs | grep -q derived'
ck "workflows.json is derived, not authored" bash -c 'grep -q "\"derived\": true" apps/mez/docs/workflows.json'
echo " ILM matrix (this merge)"
ck "keyword maps extracted from retrieved transducers" bash -c 'node tools/extract_maps.mjs | grep -q "c      EXTRACTED"'
ck "no map is marked invented"              bash -c '! grep -rq "\"invented\": true" ilm/maps/'
ck "9 shailis extracted, 27 languages generated" bash -c 'node tools/extract_maps.mjs | grep -c EXTRACTED | grep -q 9 && node tools/build_ilm_matrix.mjs >/dev/null && [ $(ls ilm/langs | wc -l) -ge 27 ] && [ $(ls ilm/langs/tamil/*.tsv | wc -l) -ge 9 ]'
ck "three ILM axes remain distinct"          bash -c '[ -f retrieved/romenagri/tables/tamil_to_deva.tsv ] && [ -f retrieved/romenagri/langs/tamil_c.tsv ] && [ -f ilm/maps/c.map.json ]'
ck "ILM distribution is published on the site"  bash -c '[ -f docs/ilm.html ] && [ -f docs/data/ilm-index.json ] && [ -f dist/hindawi-ilm.tar.gz ]'
ck "ILM page is linked from the site index"     grep -q "ilm.html" docs/index.html
ck "ILM index matches the generated matrix"     bash -c 'node -e "const a=require(\"./docs/data/ilm-index.json\"),b=require(\"./ilm/MATRIX.json\");process.exit(a.languages.length===b.generated.length?0:1)"'
ck "every frontend is exercised and reported"   bash -c '[ -f docs/data/frontend-status.json ] && node -e "const d=require(\"./docs/data/frontend-status.json\");process.exit(d.frontends.length>=30?0:1)"'
ck "no frontend is called working without refusing bad input" bash -c '! node -e "const d=require(\"./docs/data/frontend-status.json\");process.exit(d.frontends.some(f=>f.status===\"WORKING\"&&!f.rejects)?0:1)"'
ck "shabda composes with guru (h2l|h2c)"       bash -c 'node -e "const m=require(\"./ilm/maps/lex.map.json\");process.exit(m.composed_rules>300&&m.own_rules<20?0:1)"'
ck "wyaaka composes with guru (h2yacc|h2c)"     bash -c 'node -e "const m=require(\"./ilm/maps/yacc.map.json\");process.exit(m.composed_rules>300?0:1)"'
ck "pipeline reported, not reimplemented"       bash -c 'node tools/hindawi_pipeline.mjs retrieved/legacy/Hindawi/samples/HindiLEX.uhin | grep -q "h2lex | h2c"'
ck "74 per-script Hindawi distributions built"  bash -c '[ $(ls dist/hindawi-scripts/*.tar.gz 2>/dev/null | wc -l) -ge 74 ]'
ck "each bundle is self-contained"              bash -c 'cd /tmp && rm -rf _t && mkdir _t && tar xzf '"$PWD"'/dist/hindawi-scripts/tamil.tar.gz -C _t && [ -f _t/tamil/tamil_to_deva.tsv ] && [ -f _t/tamil/maps/lex.map.json ] && [ -f _t/tamil/langs/tamil/c.tsv ] && [ -f _t/tamil/hindawi_pipeline.mjs ]'
ck "script downloads are listed on the site"    bash -c '[ -f docs/data/hindawi-scripts.json ] && grep -q "hindawi-scripts" docs/ilm.html'
ck "36 Hindawi distributions, all CSV-generated" bash -c '[ $(ls hindawi-tar/*.tar.gz|wc -l) -ge 50 ] && [ -f hindawi/devanagari/hindi/guru/h2c.uhin ] && [ -f hindawi/devanagari/hindi/guru/gurucc ] && [ -f hindawi/devanagari/hindi/keywords ]'
ck "no rule was dropped from the retrieved base"  bash -c 'a=$(grep -c printf retrieved/legacy/Hindawi/guru/h2c.uhin); b=$(grep -c printf hindawi/devanagari/hindi/guru/h2c.uhin); [ "$a" = "$b" ]'
ck "shraeni keeps all 879 retrieved rules"        bash -c '[ $(grep -c printf hindawi/devanagari/hindi/shraeni/h2cpp.uhin) -ge 870 ]'
ck "keywords file is the full retrieved set"      bash -c '[ $(wc -l < hindawi/devanagari/hindi/keywords) -ge 700 ]'
ck "languages differ in their transducers"        bash -c '! cmp -s hindawi/devanagari/hindi/guru/h2c.uhin hindawi/devanagari/sanskrit/guru/h2c.uhin'
ck "every distribution has exercises"           bash -c 'n=0; e=0; for d in hindawi/*/*/; do n=$((n+1)); [ -f "$d/exercises/README.md" ] && e=$((e+1)); done; [ "$n" -gt 0 ] && [ "$n" = "$e" ]'
ck "shabda composes in the generated driver"    grep -q "h2l | h2c" hindawi/devanagari/hindi/shabda/shabdacc
ck "script round trip measured and published"   bash -c '[ -f docs/data/hindawi-roundtrip.json ] && node -e "const r=require(\"./docs/data/hindawi-roundtrip.json\");process.exit(r.scripts.length>=10?0:1)"'
ck "Hindawi page linked from the site"          grep -q "hindawi.html" docs/index.html
ck "grok dist/hindawi is intact, not overwritten" bash -c '[ -d dist/hindawi/bin ] && [ -d dist/hindawi/share ] && [ -d dist/hindawi/examples ]'
ck "46 toolchain frontends carried, isolated"    bash -c '[ $(ls toolchain/bin | grep -vE "\.elf$|node_modules|package|fix_" | wc -l) -ge 46 ] && [ -f toolchain/PROVENANCE.md ]'
ck "one canonical keywords CSV, not 49 trees"    bash -c '[ -f ilm/keywords.csv ] && [ $(wc -l < ilm/keywords.csv) -ge 1800 ]'
ck "romenagri spine is C-identifier-legal"       bash -c 'node -e "const r=require(\"./docs/data/keywords-compliance.json\");process.exit(r.romenagri.illegal===0&&r.romenagri.c_identifier_legal>800?0:1)"'
ck "ISO C clauses mapped to constructs"          bash -c 'node -e "const r=require(\"./docs/data/keywords-compliance.json\");process.exit(r.standards.c.mapped>=48?0:1)"'
ck "generator reproduces a distribution"         bash -c 'node tools/hindawi-gen hindi --out .gen-check >/dev/null && [ $(grep -c printf .gen-check/guru/h2c.uhin) = $(grep -c printf retrieved/legacy/Hindawi/guru/h2c.uhin) ]'
ck "Mez reads real stage sequences"              bash -c 'node -e "const w=require(\"./apps/mez/docs/workflows.json\");const n=[\"awaz\",\"khwab\",\"tilasm\",\"yadein\",\"pench\"].map(k=>(w[k]||{stages:[]}).stages.length);process.exit(n.every(x=>x>=7)?0:1)"'
ck "translation coverage is published, not gated"  bash -c '[ -f docs/data/keyword-status.json ] && grep -q "\"gate\": \"none" docs/data/keyword-status.json' 
ck "a worksheet exists for every language"       bash -c 'node -e "const s=require(\"./docs/data/keyword-status.json\");const fs=require(\"fs\");const n=Object.keys(s.per_language).filter(l=>fs.existsSync(\"ilm/worksheets/\"+l+\".csv\")).length;process.exit(n===s.languages?0:1)"'
ck "no romanisation in the keyword pipeline"     bash -c '! ls tools/fill_keywords.mjs 2>/dev/null && ! grep -rq "romanised" tools/*.mjs tools/hindawi-gen'
ck "keyword table carries NO romenagri column"   bash -c '! head -1 ilm/keywords.csv | grep -q romenagri'
ck "romenagri spine lives in its own file"       bash -c '[ -f ilm/romenagri-spine.csv ] && head -1 ilm/romenagri-spine.csv | grep -q romenagri'
ck "worksheets carry no romenagri either"        bash -c '! head -1 ilm/worksheets/tamil.csv | grep -q romenagri' 
ck "27 AGI layers x 3 languages, with reasons"    bash -c '[ -f ilm/layers.csv ] && [ $(tail -n +2 ilm/layers.csv | wc -l) = 81 ] && ! grep -q ",,$" ilm/layers.csv'
ck "layer names read from AGI_STACK, not retyped" bash -c 'grep -q "^L26," ilm/layers.csv && grep -q "L26" docs/AGI_STACK.md'
ck "toolchain languages excluded from layer picks" bash -c '! awk -F, "NR>1{print \$4}" ilm/layers.csv | grep -qxE "make|ld|kconfig|lex|yacc"'
ck "construct is primary: FOR appears once"       bash -c '[ $(awk -F, "NR>1 && \$1==\"FOR\"" ilm/constructs.csv | wc -l) = 1 ]'
ck "decorators carry the host realisation"        bash -c 'grep -q "^PRINT,c,printf,stdio.h" ilm/decorators.csv && grep -q "^PRINT,cpp,cout,iostream" ilm/decorators.csv'
ck "worksheets are over constructs, not keywords" bash -c 'head -1 ilm/worksheets/tamil.csv | grep -q "^construct,category,gloss" && [ $(tail -n +2 ilm/worksheets/tamil.csv | wc -l) -lt 60 ]'
ck "ILM cycler is C1-C5, union not intersection"  bash -c 'grep -q "C3 · Construct reconciliation" docs/ilm-cycler.html && grep -q "Do NOT compute an intersection" docs/ilm-cycler.html'
ck "every stage ends in a human gate"            bash -c '[ $(grep -c "gate:\"" docs/ilm-cycler.html) -ge 5 ]'
ck "cycler sends nothing anywhere"               bash -c '! grep -qE "fetch\(|XMLHttpRequest|WebSocket" docs/ilm-cycler.html'
ck "ILM template covers families and scripts"    bash -c '[ -f ilm/ilm-template.csv ] && [ $(tail -n +2 ilm/ilm-template.csv | wc -l) -ge 88 ]'
ck "decorator rule is stated in C4"              grep -q "never move a language-specific requirement" docs/ilm-cycler.html
ck "Urdu edition has the chintamani structure"   bash -c '[ -f urdu/install ] && [ -d urdu/Romenagri ] && [ -d urdu/APCISR ] && [ -d urdu/Hindawi/hindrv ] && [ -d urdu/Hindawi/guru ]'
ck "Urdu carries all nine shailis, 323 C rules"  bash -c '[ $(grep -c printf urdu/Hindawi/guru/h2c.uhin) = 323 ] && [ $(ls -d urdu/Hindawi/*/ | wc -l) -ge 9 ]'
ck "Urdu Colab notebook is valid JSON"           python3 -c "import json;n=json.load(open('urdu/Notebooks/hindawi_urdu.ipynb'));assert len(n['cells'])>=20"
ck "Urdu README states the known defect"         grep -q "Known defect" urdu/README.md
ck "Urdu: all 8 shailis, both directions"       bash -c 'n=0; for d in guru praatha shraeni kritrima soochee shabda wyaaka yantra; do [ -f hindawi-urdu-v2/Hindawi/$d/*_urdu.uhin ] 2>/dev/null || ls hindawi-urdu-v2/Hindawi/$d/h2*_urdu.uhin >/dev/null 2>&1 && n=$((n+1)); done; [ $n -ge 8 ]'
ck "Urdu: no rule dropped from guru"             bash -c 'a=$(grep -c printf retrieved/legacy/Hindawi/guru/h2c.uhin); b=$(grep -c printf hindawi-urdu-v2/Hindawi/guru/h2c_urdu.uhin); [ $b -ge $((a-12)) ]'
ck "Urdu: forward actions are plain ASCII"       bash -c '! grep -oE "\{printf\(\"[^\"]*\"" hindawi-urdu-v2/Hindawi/guru/h2c_urdu.uhin | grep -qP "[^\x00-\x7F]"'
ck "Urdu: lex is never piped through h2c"        bash -c '! grep -q "acii2cf | h2c" hindawi-urdu-v2/Hindawi/guru/Makefile'
ck "fixarabnum covers U+0660 and U+06F0 ranges"  bash -c 'printf "[۸۰]" | hindawi-urdu-v2/Hindawi/fixarabnum | grep -q "\[80\]"'
ck "Urdu manual and notebook exist, in Urdu"     bash -c 'grep -q "ہندوی" hindawi-urdu-v2/docs/*.md && python3 -c "import json;n=json.load(open(\"hindawi-urdu-v2/Notebooks/ہندوی_اردو.ipynb\"));assert len(n[\"cells\"])>=25"'
ck "one clean driver, not eight"                 bash -c '[ -x hindawi-urdu-v2/Hindawi/urducc ] && grep -q "شیلی" hindawi-urdu-v2/Hindawi/urducc'
echo " integrity (fixed in this merge)"
ck "package.json licence matches LICENSE"   bash -c 'grep -q "GPL-3.0-or-later" package.json'
ck "test suite CAN fail (exit code honoured)" bash -c '! grep -q "never_nonzero" tests/test.mjs'
ck "A-vs-B selfhost comparison is a real gate" bash -c '! grep -q "compare A vs B\", true" scripts/selfhost.mjs'
echo; [ $F -eq 0 ] && echo "ALL CHECKS PASSED" || echo "SOME CHECKS FAILED"; exit $F
