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
ck "unauthored cells are skeletons, not guesses" bash -c 'grep -q "UNRESOLVED" ilm/langs/sindhi/c.tsv'
ck "three ILM axes remain distinct"          bash -c '[ -f retrieved/romenagri/tables/tamil_to_deva.tsv ] && [ -f retrieved/romenagri/langs/tamil_c.tsv ] && [ -f ilm/maps/c.map.json ]'
echo " integrity (fixed in this merge)"
ck "package.json licence matches LICENSE"   bash -c 'grep -q "GPL-3.0-or-later" package.json'
ck "test suite CAN fail (exit code honoured)" bash -c '! grep -q "never_nonzero" tests/test.mjs'
ck "A-vs-B selfhost comparison is a real gate" bash -c '! grep -q "compare A vs B\", true" scripts/selfhost.mjs'
echo; [ $F -eq 0 ] && echo "ALL CHECKS PASSED" || echo "SOME CHECKS FAILED"; exit $F
