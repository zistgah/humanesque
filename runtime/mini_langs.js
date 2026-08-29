/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Shared frontend evaluator for the supported language subsets.
 * Not rustc / tsc / gc / zig cc.
 */
export function runSubset(lang, source) {
  const src = String(source);
  const toks = lex(src);
  const ast = parse(toks, lang);
  const env = Object.create(null);
  const prints = [];
  evalBlock(ast.body, env, prints, lang);
  if (typeof env.main !== "function") {
    if (prints.length) {
      return { ok: true, value: prints[prints.length - 1], prints, frontend: "PANINI.subset." + lang };
    }
    return { ok: true, value: 0, prints, frontend: "PANINI.subset." + lang };
  }
  if (typeof env.main === "function") {
    const v = env.main([]);
    if (v != null && prints.length === 0) prints.push(v);
    return { ok: true, value: v ?? prints[prints.length - 1] ?? 0, prints, frontend: "PANINI.subset." + lang };
  }
  return { ok: true, value: prints[prints.length - 1] ?? 0, prints, frontend: "PANINI.subset." + lang };
}

function lex(s) {
  const t = [];
  let i = 0;
  const n = s.length;
  const kw = /^(fn|func|function|let|const|var|mut|pub|return|if|else|while|for|package|main|print|println|Println|console|log|debug|fmt|std|int|char|void|def|PROGRAM|END|PRINT|INTEGER)$/;
  while (i < n) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "/" && s[i + 1] === "/") { while (i < n && s[i] !== "\n") i++; continue; }
    if (c === "/" && s[i + 1] === "*") { i += 2; while (i < n && !(s[i] === "*" && s[i + 1] === "/")) i++; i += 2; continue; }
    if (c === "#") { while (i < n && s[i] !== "\n") i++; continue; }
    if (c === "<" && s[i + 1] === "=") { t.push({ k: "OP", v: "<=" }); i += 2; continue; }
    if (c === ">" && s[i + 1] === "=") { t.push({ k: "OP", v: ">=" }); i += 2; continue; }
    if (c === "=" && s[i + 1] === "=") { t.push({ k: "OP", v: "==" }); i += 2; continue; }
    if (c === "!" && s[i + 1] === "=") { t.push({ k: "OP", v: "!=" }); i += 2; continue; }
    if (c === "+" && s[i + 1] === "+") { t.push({ k: "OP", v: "++" }); i += 2; continue; }
    if (c === "-" && s[i + 1] === "-") { t.push({ k: "OP", v: "--" }); i += 2; continue; }
    if (c === ":" && s[i + 1] === "=") { t.push({ k: "OP", v: ":=" }); i += 2; continue; }
    if ("(){}[],.;:+-*/%<>=!".includes(c)) { t.push({ k: "OP", v: c }); i++; continue; }
    if (c === '"' || c === "'") {
      const q = c; i++; let raw = "";
      while (i < n && s[i] !== q) { if (s[i] === "\\") i++; raw += s[i++]; }
      i++; t.push({ k: "STR", v: raw }); continue;
    }
    if (/\d/.test(c)) {
      let raw = "";
      while (i < n && /\d/.test(s[i])) raw += s[i++];
      t.push({ k: "NUM", v: raw }); continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let raw = "";
      while (i < n && /[A-Za-z0-9_]/.test(s[i])) raw += s[i++];
      t.push({ k: kw.test(raw) ? "KW" : "ID", v: raw }); continue;
    }
    i++;
  }
  t.push({ k: "EOF", v: "" });
  return t;
}

function parse(toks, lang) {
  let i = 0;
  const peek = () => toks[i] || { k: "EOF", v: "" };
  const eat = () => toks[i++];
  const at = (v) => peek().v === v;
  function expr() {
    return cmp();
  }
  function cmp() {
    let left = add();
    while (at("==") || at("!=") || at("<") || at(">") || at("<=") || at(">=")) {
      const op = eat().v;
      left = { op: "bin", operator: op, left, right: add() };
    }
    return left;
  }
  function add() {
    let left = term();
    while (at("+") || at("-")) { const op = eat().v; left = { op: "bin", operator: op, left, right: term() }; }
    return left;
  }
  function term() {
    let left = atom();
    while (at("*") || at("/")) { const op = eat().v; left = { op: "bin", operator: op, left, right: atom() }; }
    return left;
  }
  function atom() {
    const t = peek();
    if (t.k === "NUM") { eat(); return { op: "const", value: Number(t.v) }; }
    if (t.k === "STR") { eat(); return { op: "const", value: t.v }; }
    if (t.k === "ID" || t.k === "KW") {
      eat();
      let name = t.v;
      while (at(".")) {
        eat();
        if (peek().k === "ID" || peek().k === "KW") name = eat().v;
      }
      if (at("!")) eat();
      if (at("(")) {
        eat();
        const args = [];
        while (!at(")") && peek().k !== "EOF") {
          if (at(".")) eat();
          if (at("{")) {
            eat();
            args.push(expr());
            if (at("}")) eat();
          } else args.push(expr());
          if (at(",")) eat();
        }
        if (at(")")) eat();
        return { op: "call", name, args };
      }
      return { op: "load", name };
    }
    if (at("(")) { eat(); const e = expr(); if (at(")")) eat(); return e; }
    eat();
    return { op: "const", value: 0 };
  }
  function blockOrOne() {
    if (at("{")) {
      eat();
      const body = [];
      while (!at("}") && peek().k !== "EOF") body.push(stmt());
      if (at("}")) eat();
      return body;
    }
    return [stmt()];
  }
  function stmt() {
    const t = peek();
    if (t.v === "int" && toks[i + 1] && (toks[i + 1].k === "ID" || toks[i + 1].k === "KW") && toks[i + 2] && toks[i + 2].v === "(") {
      eat();
      const name = eat().v;
      eat();
      const params = [];
      while (!at(")") && peek().k !== "EOF") {
        if (peek().v === "int") eat();
        if (peek().k === "ID" || peek().k === "KW") params.push(eat().v);
        else eat();
        if (at(",")) eat();
      }
      if (at(")")) eat();
      while (!at("{") && peek().k !== "EOF") eat();
      const braced = at("{");
      if (braced) eat();
      const body = [];
      if (braced) {
        while (!at("}") && peek().k !== "EOF") body.push(stmt());
        if (at("}")) eat();
      }
      return { op: "def", name, params, body };
    }
    if ((t.v === "fn" || t.v === "func" || t.v === "function" || t.v === "def" || t.v === "pub") ) {
      if (t.v === "pub") eat();
      if (peek().v === "fn" || peek().v === "func" || peek().v === "function" || peek().v === "def") eat();
      const name = eat().v;
      if (at("(")) eat();
      const params = [];
      while (!at(")") && peek().k !== "EOF") {
        if (peek().v === "int" || peek().v === "i32" || peek().v === "number") eat();
        if (peek().k === "ID" || peek().k === "KW") params.push(eat().v);
        else eat();
        if (peek().v === "int" || peek().v === "i32" || peek().v === "number") eat();
        if (at(",")) eat();
        if (at(":")) { eat(); if (peek().k !== "OP") eat(); }
      }
      if (at(")")) eat();
      {
        let j = i, seenBrace = false;
        while (j < toks.length && toks[j].v !== "def" && toks[j].v !== "fn" && toks[j].v !== "function") {
          if (toks[j].v === "{") { seenBrace = true; break; }
          j++;
        }
        if (seenBrace) while (!at("{") && peek().k !== "EOF") eat();
      }
      const braced = at("{");
      if (braced) eat();
      if (at(":")) eat();
      const body = [];
      if (braced) {
        while (!at("}") && peek().k !== "EOF") body.push(stmt());
        if (at("}")) eat();
      } else {
        body.push(stmt());
      }
      if (peek().v === "END") eat();
      return { op: "def", name, params, body };
    }
    if (t.v === "if") {
      eat();
      if (at("(")) eat();
      const cond = expr();
      if (at(")")) eat();
      const then = blockOrOne();
      let els = null;
      if (peek().v === "else") { eat(); els = blockOrOne(); }
      return { op: "if", cond, then, else: els };
    }
    if (t.v === "while") {
      eat();
      if (at("(")) eat();
      const cond = expr();
      if (at(")")) eat();
      return { op: "while", cond, body: blockOrOne() };
    }
    if (t.v === "for") {
      eat();
      if (at("(")) eat();
      const init = at(";") ? null : stmt();
      if (at(";")) eat();
      const cond = at(";") ? { op: "const", value: 1 } : expr();
      if (at(";")) eat();
      let incr = null;
      if (!at(")")) {
        if (peek().k === "ID" && toks[i + 1] && toks[i + 1].v === "=") {
          const name = eat().v; eat();
          incr = { op: "assign", name, value: expr() };
        } else if (peek().k === "ID" && toks[i + 1] && (toks[i + 1].v === "++" || toks[i + 1].v === "--")) {
          const name = eat().v; const op = eat().v;
          incr = { op: "assign", name, value: { op: "bin", operator: op === "++" ? "+" : "-", left: { op: "load", name }, right: { op: "const", value: 1 } } };
        } else incr = stmt();
      }
      if (at(")")) eat();
      return { op: "for", init, cond, incr, body: blockOrOne() };
    }
    if (t.v === "return") {
      eat();
      const arg = peek().v === ";" ? { op: "const", value: 0 } : expr();
      if (at(";")) eat();
      return { op: "return", arg };
    }
    if (t.v === "let" || t.v === "const" || t.v === "var" || t.v === "int" || t.v === "INTEGER" || t.v === "char") {
      eat();
      if (peek().v === "mut") eat();
      const name = eat().v;
      if (at("=") || at(":=")) {
        eat();
        const v = expr();
        if (at(";")) eat();
        return { op: "assign", name, value: v };
      }
      if (at(":")) { eat(); while (!at("=") && peek().k !== "EOF" && peek().v !== ";") eat(); if (at("=")) eat(); else return { op: "assign", name, value: { op: "const", value: 0 } }; return { op: "assign", name, value: expr() }; }
      if (at(";")) eat();
      return { op: "assign", name, value: { op: "const", value: 0 } };
    }
    if (t.k === "ID" && toks[i + 1] && (toks[i + 1].v === "=" || toks[i + 1].v === ":=")) {
      const name = eat().v; eat();
      const v = expr();
      if (at(";")) eat();
      return { op: "assign", name, value: v };
    }
    if (t.k === "ID" && toks[i + 1] && (toks[i + 1].v === "++" || toks[i + 1].v === "--")) {
      const name = eat().v; const op = eat().v;
      return { op: "assign", name, value: { op: "bin", operator: op === "++" ? "+" : "-", left: { op: "load", name }, right: { op: "const", value: 1 } } };
    }
    if (t.v === "PRINT" || t.v === "print") {
      eat();
      while (at("*") || at(",")) eat();
      return { op: "expr", value: { op: "call", name: "print", args: [expr()] } };
    }
    if (t.v === "package" || t.v === "PROGRAM" || t.v === "END") { eat(); return { op: "nop" }; }
    return { op: "expr", value: expr() };
  }
  const body = [];
  while (peek().k !== "EOF") body.push(stmt());
  return { op: "program", body, lang };
}

function evalExpr(e, env) {
  if (!e) return 0;
  if (e.op === "const") return e.value;
  if (e.op === "load") return env[e.name];
  if (e.op === "bin") {
    const l = evalExpr(e.left, env), r = evalExpr(e.right, env);
    if (e.operator === "+") return l + r;
    if (e.operator === "-") return l - r;
    if (e.operator === "*") return l * r;
    if (e.operator === "/") return r ? l / r : 0;
    if (e.operator === "==") return l === r ? 1 : 0;
    if (e.operator === "!=") return l !== r ? 1 : 0;
    if (e.operator === "<") return l < r ? 1 : 0;
    if (e.operator === ">") return l > r ? 1 : 0;
    if (e.operator === "<=") return l <= r ? 1 : 0;
    if (e.operator === ">=") return l >= r ? 1 : 0;
    return 0;
  }
  if (e.op === "call") {
    const n = e.name;
    if (n === "print" || n === "println" || n === "Println" || n === "log" || n === "PRINT" || n === "printf") {
      let v = 0;
      for (const a of e.args) {
        const x = evalExpr(a, env);
        if (typeof x === "number" || (typeof x === "string" && /^\d/.test(x) === false && x.includes("{") === false)) v = x;
        if (typeof x === "number") v = x;
      }
      if (e.args.length) v = evalExpr(e.args[e.args.length - 1], env);
      env.__prints.push(v);
      return v;
    }
    if (n === "console" || n === "fmt" || n === "std" || n === "debug") return 0;
    const fn = env[n];
    if (typeof fn === "function") return fn(e.args.map((a) => evalExpr(a, env)));
    return 0;
  }
  return 0;
}

function evalBlock(stmts, env, prints) {
  env.__prints = prints;
  let last;
  const ret = (v) => ({ __ret: true, v });
  const unwrap = (r) => (r && r.__ret ? r : null);
  for (const s of stmts || []) {
    if (s.op === "nop") continue;
    if (s.op === "def") {
      env[s.name] = (args) => {
        const local = Object.create(env);
        s.params.forEach((p, i) => { local[p] = args[i]; });
        const r = evalBlock(s.body, local, prints);
        return r && r.__ret ? r.v : r;
      };
    } else if (s.op === "assign") {
      env[s.name] = evalExpr(s.value, env);
    } else if (s.op === "if") {
      const r = evalExpr(s.cond, env) ? evalBlock(s.then, env, prints)
        : (s.else ? evalBlock(s.else, env, prints) : undefined);
      if (unwrap(r)) return r;
      last = r;
    } else if (s.op === "while") {
      let guard = 0;
      while (evalExpr(s.cond, env) && guard++ < 100000) {
        const r = evalBlock(s.body, env, prints);
        if (unwrap(r)) return r;
        last = r;
      }
    } else if (s.op === "for") {
      if (s.init) evalBlock([s.init], env, prints);
      let guard = 0;
      while ((!s.cond || evalExpr(s.cond, env)) && guard++ < 100000) {
        const r = evalBlock(s.body, env, prints);
        if (unwrap(r)) return r;
        last = r;
        if (s.incr) evalBlock([s.incr], env, prints);
      }
    } else if (s.op === "return") {
      return ret(evalExpr(s.arg, env));
    } else if (s.op === "expr") {
      last = evalExpr(s.value, env);
    }
  }
  return last;
}

export function debugParse(lang, source) {
  const toks = lex(String(source));
  return { toks, ast: parse(toks, lang) };
}

