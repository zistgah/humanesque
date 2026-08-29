/**
 * GNU as (gas) AT&T integer subset for kernel .s files.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 *
 * Tokens + eval: mov/add/sub/ret, $imm, %reg, labels, .globl/.text/.long.
 * Not a linker. Not ELF.
 */
const REGS = ["eax", "ebx", "ecx", "edx", "esi", "edi", "esp", "ebp", "rax", "rbx", "rcx", "rdx", "al", "bl"];

function imm(tok, env) {
  const t = String(tok).trim();
  if (t.startsWith("$")) {
    const n = t.slice(1);
    if (/^-?\d+$/.test(n)) return parseInt(n, 10);
    if (/^0x[0-9a-fA-F]+$/.test(n)) return parseInt(n, 16);
    if (n in env) return env[n] | 0;
  }
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  if (t.startsWith("%")) return env[t.slice(1)] | 0;
  if (t in env) return env[t] | 0;
  return 0;
}

export function asRun(source) {
  const env = Object.create(null);
  for (const r of REGS) env[r] = 0;
  const lines = String(source).replace(/\r\n/g, "\n").split("\n");
  const body = [];
  const labels = Object.create(null);
  for (const raw of lines) {
    let line = raw.replace(/#.*$/, "").replace(/\/\/.*$/, "").trim();
    if (!line) continue;
    if (/^\./.test(line) && !/^\.long\b/.test(line)) continue;
    const lm = line.match(/^([A-Za-z_.][\w.]*)\s*:\s*(.*)$/);
    if (lm) {
      labels[lm[1]] = body.length;
      line = lm[2].trim();
      if (!line) continue;
    }
    body.push(line);
  }
  let pc = 0;
  let steps = 0;
  while (pc < body.length && steps++ < 10000) {
    const line = body[pc];
    const m = line.match(/^([a-z]+)\s*(.*)$/i);
    if (!m) { pc++; continue; }
    const op = m[1].toLowerCase();
    const args = m[2].split(",").map((x) => x.trim()).filter(Boolean);
    if (op === "ret") break;
    if (op === "nop") { pc++; continue; }
    if (op === "mov" && args.length === 2) {
      const dst = args[1].replace(/^%/, "");
      env[dst] = imm(args[0], env);
      pc++;
      continue;
    }
    if ((op === "add" || op === "sub") && args.length === 2) {
      const dst = args[1].replace(/^%/, "");
      const v = imm(args[0], env);
      env[dst] = ((env[dst] | 0) + (op === "add" ? v : -v)) | 0;
      pc++;
      continue;
    }
    if (op === "jmp" && args[0]) {
      const t = args[0].replace(/^\$/, "");
      if (t in labels) { pc = labels[t]; continue; }
    }
    if (op === "long" || op === ".long") { pc++; continue; }
    pc++;
  }
  const value = (env.eax | 0) || (env.rax | 0);
  return { ok: true, value, regs: { eax: env.eax | 0, ebx: env.ebx | 0 }, frontend: "PANINI.Frontend.Asm" };
}

export function asTokens(source) {
  const toks = [];
  const re = /\.[A-Za-z]+|[A-Za-z_][\w.]*|%\w+|\$?-?0x[0-9a-fA-F]+|\$?-?\d+|[:,]/g;
  const s = String(source);
  let m;
  while ((m = re.exec(s))) toks.push(m[0]);
  return toks;
}
