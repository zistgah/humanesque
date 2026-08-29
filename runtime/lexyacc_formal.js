/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Formal lex + yacc on the virtualized JS backend.
 * This is not AT&T lex / GNU bison. It is a table-driven lexer and a
 * recursive-descent parser from a yacc-shaped grammar (left recursion
 * on binary ops is encoded as precedence levels).
 */
export function lex(source, spec) {
  const rules = spec.rules;
  const tokens = [];
  let i = 0;
  const s = String(source);
  while (i < s.length) {
    let matched = false;
    for (const r of rules) {
      r.re.lastIndex = 0;
      const slice = s.slice(i);
      const m = slice.match(r.re);
      if (!m || m.index !== 0) continue;
      matched = true;
      i += m[0].length;
      if (!r.skip) tokens.push({ kind: r.tok, value: r.tok === "NUM" ? Number(m[0]) : m[0] });
      break;
    }
    if (!matched) i++;
  }
  tokens.push({ kind: "EOF", value: "" });
  return tokens;
}

/** Classic expr grammar with precedence, yacc-shaped. */
export const EXPR_GRAMMAR = {
  tokens: ["NUM", "+", "-", "*", "/", "(", ")"],
  start: "E",
  /* documented productions (left-recursive in the book form):
   *   E -> E + T | E - T | T
   *   T -> T * F | T / F | F
   *   F -> NUM | ( E )
   * Implemented as precedence (same language).
   */
};

export function yaccExpr(tokens) {
  let i = 0;
  const peek = () => tokens[i] || { kind: "EOF", value: "" };
  const eat = () => tokens[i++];
  const at = (k) => peek().kind === k || peek().value === k;
  function F() {
    if (at("NUM")) return { op: "num", value: eat().value };
    if (at("(") || peek().value === "(") {
      eat();
      const e = E();
      if (peek().value === ")") eat();
      return e;
    }
    eat();
    return { op: "num", value: 0 };
  }
  function T() {
    let left = F();
    while (peek().value === "*" || peek().value === "/") {
      const op = eat().value;
      left = { op, left, right: F() };
    }
    return left;
  }
  function E() {
    let left = T();
    while (peek().value === "+" || peek().value === "-") {
      const op = eat().value;
      left = { op, left, right: T() };
    }
    return left;
  }
  return E();
}

export function evalAst(n) {
  if (n.op === "num") return n.value;
  const l = evalAst(n.left), r = evalAst(n.right);
  if (n.op === "+") return l + r;
  if (n.op === "-") return l - r;
  if (n.op === "*") return l * r;
  if (n.op === "/") return r ? l / r : 0;
  return 0;
}

export const C_LEX_SPEC = {
  rules: [
    { re: /^\s+/, skip: true, tok: "WS" },
    { re: /^\/\*[\s\S]*?\*\//, skip: true, tok: "COMMENT" },
    { re: /^\/\/[^\n]*/, skip: true, tok: "COMMENT" },
    { re: /^[0-9]+/, tok: "NUM" },
    { re: /^==|!=|<=|>=|\+\+|--/, tok: "OP" },
    { re: /^[A-Za-z_][A-Za-z0-9_]*/, tok: "IDENT" },
    { re: /^./, tok: "PUNCT" },
  ],
};

export function parseAndEvalExpr(src) {
  const spec = {
    rules: [
      { re: /^\s+/, skip: true, tok: "WS" },
      { re: /^[0-9]+/, tok: "NUM" },
      { re: /^[+\-*/()]/, tok: "OP" },
    ],
  };
  const toks = lex(src, spec).map((t) => t.kind === "OP" ? { kind: t.value, value: t.value } : t);
  return evalAst(yaccExpr(toks));
}
