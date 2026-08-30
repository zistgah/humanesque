#!/usr/bin/env node
/* ilm/layers.csv — for each of the 27 AGI layers (L0–L26, retrieved from
 * docs/AGI_STACK.md), the best-suited primary language plus the two most
 * popular alternatives, each with a stated reason.
 *
 * Popularity is recorded as a REASON, not as agreement. Toolchain languages
 * (make, ld, kconfig, lex, yacc) are deliberately excluded — they are treated
 * separately, not as primary languages of a layer.                          */
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Layer names are READ from docs/AGI_STACK.md, never retyped.
const md = fs.readFileSync(path.join(root, 'docs/AGI_STACK.md'), 'utf8');
const layers = [];
for (const l of md.split('\n')) {
  const m = l.match(/^\|\s*(L\d+)\s*\|\s*([^|]+?)\s*\|/);
  if (m) layers.push({ id: m[1], domain: m[2] });
}
// best / alt1 / alt2 with the reason each is there.
const PICK = {
  L0:  [['VHDL','hardware description is the substrate language; synthesisable'],['Verilog','larger installed base in industry'],['SystemVerilog','verification constructs on top of Verilog']],
  L1:  [['SPICE','device physics is solved numerically, not programmed'],['Verilog-A','analog behavioural modelling'],['Python','SciPy is where device models are actually fitted']],
  L2:  [['Verilog','RTL is the native form of a digital primitive'],['VHDL','stronger typing for the same job'],['Chisel','generators over Scala, growing in RISC-V work']],
  L3:  [['asm','the architecture IS the instruction set'],['C','the portable assembler, and what compilers target'],['Rust','used for new bare-metal work without a runtime']],
  L4:  [['C','malloc/free and the memory model are C\'s own'],['Rust','ownership makes lifetimes checkable'],['C++','RAII and allocators, widest existing code']],
  L5:  [['C','drivers and I/O are written in C everywhere'],['Rust','driver work is moving here'],['C++','device stacks in industry']],
  L6:  [['C','firmware and boot are C plus a little asm'],['asm','the reset vector cannot be C'],['Rust','embedded HAL crates are production now']],
  L7:  [['C','POSIX is defined in C'],['C++','systemd-era userland and services'],['Go','runtimes and daemons, GC acceptable above the kernel']],
  L8:  [['C++','execution frameworks need zero-cost abstraction'],['Java','JVM is itself an execution framework at scale'],['Python','the framework people actually reach for']],
  L9:  [['C++','simulators are compute-bound'],['Python','Gazebo/Isaac scripting is Python'],['Julia','differentiable simulation without leaving one language']],
  L10: [['C++','ROS 2 real-time control is C++'],['Python','ROS 2 Python is how most people start'],['Rust','deterministic control without GC pauses']],
  L11: [['SQL','the data substrate has its own declarative standard'],['Python','pandas/Arrow is where data actually moves'],['Scala','Spark, for the large end']],
  L12: [['C','the Hindawi transducers are lex+C — this layer is retrieved, not chosen'],['Python','corpus and script tooling'],['Rust','ICU-class text processing']],
  L13: [['PANINI','this is PANINI\'s own layer'],['C','the language every other language bootstraps through'],['Haskell','where language semantics are usually specified']],
  L14: [['C','lex/yacc/flex/bison emit C; the retrieved shailis are C'],['C++','LLVM is C++'],['OCaml','the classic compiler-writing language']],
  L15: [['TypeScript','tooling and workbenches are browser-first here'],['Python','CLI tooling and glue'],['Rust','fast language servers and formatters']],
  L16: [['JavaScript','interaction runs in the browser'],['TypeScript','the same, with types'],['BASIC','the beginner rung must stay a beginner rung']],
  L17: [['Python','the model substrate is Python whether or not one likes it'],['C++','the kernels underneath are C++/CUDA'],['Rust','inference runtimes moving here']],
  L18: [['Python','cognition experiments are written in Python'],['Julia','numerics without the two-language problem'],['Lisp','the historical cognition language, still apt']],
  L19: [['Erlang','coherence across failing parts is Erlang\'s subject'],['Go','CSP concurrency, widely deployed'],['Rust','fearless concurrency with no GC']],
  L20: [['C++','embodiment is real-time control'],['Rust','memory safety where a fault moves a limb'],['Python','high-level policy above the control loop']],
  L21: [['PANINI','a cycler IS an agent architecture, and it is .pni'],['Python','agent frameworks live here'],['TypeScript','browser-resident agents']],
  L22: [['Go','collective systems are distributed services'],['Erlang','supervision trees for the same problem'],['Rust','when the coordination layer must not pause']],
  L23: [['Lean','metacognition means proof'],['Coq','the older, larger proof corpus'],['Haskell','types as lightweight proof']],
  L24: [['Python','provenance tooling — Misty, OTS — is Python'],['Go','content-addressed stores and registries'],['Rust','signing and hashing infrastructure']],
  L25: [['PANINI','sovereignty is expressed as contract, and the contract is .pni'],['Prolog','rules and entailment'],['Datalog','policy as queryable rules']],
  L26: [['PANINI','the civilizational layer is the estate itself'],['Prolog','domain ontology and inference'],['SPARQL','knowledge graphs at civilizational scale']],
};
// Excluded on purpose — treated separately, not primary languages of any layer.
const TOOLCHAIN = ['make','ld','kconfig','lex','yacc','cpp','as'];

const esc = (s)=>/[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
const out = ['layer,domain,rank,language,reason'];
const langs = new Set();
for (const L of layers) {
  const p = PICK[L.id];
  if (!p) { out.push([L.id,L.domain,'best','','UNRESOLVED — no pick recorded'].map(esc).join(',')); continue; }
  p.forEach(([lang,why],i)=>{ langs.add(lang);
    out.push([L.id,L.domain,['best','popular-1','popular-2'][i],lang,why].map(esc).join(',')); });
}
fs.writeFileSync(path.join(root,'ilm/layers.csv'), out.join('\n')+'\n');
fs.writeFileSync(path.join(root,'docs/data/layers.json'), JSON.stringify({
  copyright:'Copyright (C) 1993-2026 Abhishek Choudhary', license:'GPL-3.0-or-later',
  source:'layer names read from docs/AGI_STACK.md; picks and reasons recorded here',
  note:'popularity is a recorded reason, not an endorsement. Toolchain languages ('+TOOLCHAIN.join(', ')+') are excluded — they are treated separately.',
  layers: layers.length, primary_languages: [...langs].sort(),
  rows: out.length-1 }, null, 1));
console.log(`${layers.length} layers x 3 = ${out.length-1} rows`);
console.log(`${langs.size} distinct primary languages: ${[...langs].sort().join(' ')}`);
console.log(`toolchain excluded: ${TOOLCHAIN.join(' ')}`);
