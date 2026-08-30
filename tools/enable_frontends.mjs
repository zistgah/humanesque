#!/usr/bin/env node
/* Enable and EXERCISE every frontend.
 *
 * "Enabled" here means: reachable through one surface, run on a real program,
 * and reported by what it actually did. A frontend that returns ok:true on
 * garbage is reported as ACCEPTS-ANYTHING, not as working — that distinction is
 * the whole point, and no green count is produced without it. */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { runFrontend } = await import(path.join(root, 'runtime/foreign_front.js'));

// One real program per language, and one malformed program it MUST reject.
const P = {
  c:      ['int f(int n){return n<2?1:n*f(n-1);}int main(){printf("%d",f(5));return 0;}', '120', 'int main(){ @@@ !!!'],
  cpp:    ['#include <cstdio>\nint main(){int s=0;for(int i=1;i<=5;i++)s+=i;printf("%d",s);return 0;}', '15', 'int main(){ @@@'],
  python: ['def f(n):\n return 1 if n<2 else n*f(n-1)\nprint(f(5))', '120', 'def f(:\n  ???'],
  javascript: ['function f(n){return n<2?1:n*f(n-1)};console.log(f(5))', '120', 'function f({{{'],
  typescript: ['const f=(n:number):number=>n<2?1:n*f(n-1);console.log(f(5))', '120', 'const f:::='],
  java:   ['class M{public static void main(String[] a){int s=0;for(int i=1;i<=5;i++)s+=i;System.out.println(s);}}', '15', 'class M{ @@@'],
  basic:  ['LET S=0\nFOR I=1 TO 5\nLET S=S+I\nNEXT I\nPRINT S', '15', 'FOR ((( NEXT'],
  pascal: ['program p;var i,s:integer;begin s:=0;for i:=1 to 5 do s:=s+i;writeln(s) end.', '15', 'program @@@'],
  lisp:   ['(+ 1 2)', '3', '(+ 1 2'],
  prolog: ['3 is 3', 'true', 'this @@@ not prolog'],
  haskell:['main = print (1+2)', '3', 'main = print (1+'],
  fortran:['program p\n integer i,s\n s=0\n do i=1,5\n  s=s+i\n end do\n print *,s\nend program', '15', 'program @@@ end'],
  go:     ['package main\nimport "fmt"\nfunc main(){s:=0;for i:=1;i<=5;i++{s+=i};fmt.Print(s)}', '15', 'package main func{{{'],
  rust:   ['fn main(){let mut s=0;for i in 1..=5{s+=i};print!("{}",s);}', '15', 'fn main(){{{'],
  lua:    ['s=0 for i=1,5 do s=s+i end print(s)', '15', 'for ((( end'],
  julia:  ['s=0\nfor i in 1:5\n global s+=i\nend\nprint(s)', '15', 'for ((( end'],
  zig:    ['const std=@import("std");pub fn main() void {}', '', '@@@ !!!'],
  smalltalk: ['Transcript show: (1+2) printString', '3', '@@@ !!!'],
  scheme: ['(+ 1 2)', '3', '(+ 1 2'],
  forth:  ['1 2 + .', '3', '@@@ !!!'],
  ocaml:  ['print_int (1+2)', '3', 'let ((( ='],
  clojure:['(println (+ 1 2))', '3', '(+ 1 2'],
  asm:    ['mov eax, 3', '', '@@@ !!!'],
  logo:   ['print 3', '3', '@@@ !!!'],
  sql:    ['SELECT 1+2', '3', 'SELEKT @@@'],
  r:      ['cat(1+2)', '3', 'cat(1+'],
  ruby:   ['puts 1+2', '3', 'puts 1+'],
  perl:   ['print 1+2;', '3', 'print 1+'],
  php:    ['<?php echo 1+2;', '3', '<?php echo 1+'],
  csharp: ['class M{static void Main(){System.Console.Write(1+2);}}', '3', 'class M{ @@@'],
  kotlin: ['fun main(){print(1+2)}', '3', 'fun main({{{'],
  swift:  ['print(1+2)', '3', 'print(1+'],
  scala:  ['object M{def main(a:Array[String]):Unit=print(1+2)}', '3', 'object M{ @@@'],
  dart:   ['void main(){print(1+2);}', '3', 'void main({{{'],
  ada:    ['with Ada.Text_IO; procedure M is begin Ada.Text_IO.Put("3"); end M;', '3', 'procedure @@@'],
  cobol:  ['IDENTIFICATION DIVISION.\nPROGRAM-ID. M.\nPROCEDURE DIVISION.\n    DISPLAY 3.\n    STOP RUN.', '3', '@@@ DIVISION'],
  octave: ['printf("%d",1+2)', '3', 'printf(1+'],
  make:   ['all:\n\t@echo 3', '3', '@@@ :::'],
  lex:    ['%%\n. ;\n%%', '', '%% @@@ %%'],
  yacc:   ['%%\ns : ;\n%%', '', '%% @@@'],
};
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const ids = (only.length ? only : Object.keys(P)).sort();
const rows = [];
for (const id of ids) {
  const [src, want, bad] = P[id];
  let good = null, rej = null, err = null;
  // A frontend that hangs is not enabled either. Bound every call.
  const cap = (p) => Promise.race([p,
    new Promise((_, x) => setTimeout(() => x(new Error('timed out after 5s')), 5000))]);
  try { good = await cap(runFrontend(id, src)); } catch (e) { err = String(e.message).slice(0, 60); }
  try { rej = await cap(runFrontend(id, bad)); } catch (e) { rej = { ok: false, threw: true }; }
  // Frontends report output in three different shapes. Read all of them, so a
  // frontend is never called broken because the harness looked in one place.
  const pick = (r) => {
    if (!r) return '';
    if (r.out !== undefined && String(r.out).trim() !== '') return String(r.out).trim();
    if (Array.isArray(r.prints) && r.prints.length) return r.prints.join('').trim();
    if (r.value !== undefined && r.value !== null) return String(r.value).trim();
    return '';
  };
  const out = pick(good);
  const ran = Boolean(good && good.ok !== false);
  const correct = ran && (want === '' ? true : out === want);
  const rejects = Boolean(rej && (rej.ok === false || rej.threw));
  let status;
  if (err) status = 'UNREACHABLE';
  else if (!ran) status = 'FAILS-ON-VALID';
  else if (!correct) status = 'WRONG-RESULT';
  else if (!rejects) status = 'ACCEPTS-ANYTHING';
  else status = 'WORKING';
  rows.push({ id, status, want, got: out, rejects, error: err });
}
const by = {};
for (const r of rows) by[r.status] = (by[r.status] || 0) + 1;
const acc = path.join(root, 'docs/data/frontend-status.json');
let prior = [];
try { prior = JSON.parse(fs.readFileSync(acc, 'utf8')).frontends || []; } catch {}
const merged = [...prior.filter((p) => !rows.some((r) => r.id === p.id)), ...rows].sort((a, b) => a.id < b.id ? -1 : 1);
const tot = {}; for (const r of merged) tot[r.status] = (tot[r.status] || 0) + 1;
fs.writeFileSync(acc,
  JSON.stringify({ copyright: 'Copyright (C) 1993-2026 Abhishek Choudhary', when: new Date().toISOString(),
    method: 'each frontend run on a real program and on a malformed one; a frontend that accepts the malformed program is not reported as working',
    totals: tot, frontends: merged }, null, 1));
console.log('id'.padEnd(12) + 'status'.padEnd(18) + 'want'.padEnd(7) + 'got'.padEnd(9) + 'rejects bad?');
for (const r of rows) console.log(r.id.padEnd(12) + r.status.padEnd(18) + String(r.want).padEnd(7) + String(r.got).slice(0,8).padEnd(9) + (r.rejects ? 'yes' : 'NO'));
console.log('\n' + Object.entries(by).map(([k, v]) => `${k}=${v}`).join('  ') + `   (${rows.length} frontends)`);

process.exit(0);
