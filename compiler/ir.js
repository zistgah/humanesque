/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/** Lower PANINI AST to a small executable IR. */
import { emitPython, emitC, emitFortran, emitWgslCompute } from "./emit_backends.js";

export function lower(ast) {
  const functions = [];
  const artifacts = [];
  const files = [];
  const declarations = [];

  function walk(node) {
    if (!node || typeof node !== "object") return;
    switch (node.kind) {
      case "Program":
      case "Module":
        (node.body || []).forEach(walk);
        break;
      case "FunctionDecl":
        functions.push({
          name: node.name,
          params: (node.params || []).map((p) => p.name),
          returnType: node.returnType?.name || null,
          body: lowerBlock(node.body),
        });
        break;
      case "FileBlock":
        files.push({ path: node.path, mime: node.mime, content: node.content });
        break;
      case "Artifact":
        artifacts.push({ name: node.name });
        break;
      case "ProgramDecl":
        functions.push({
          name: node.name,
          params: [],
          returnType: "Unit",
          body: lowerBlock(node.body),
          program: true,
        });
        break;
      default:
        declarations.push({ kind: node.kind, name: node.name || null });
        if (node.body) walk(node.body);
        if (Array.isArray(node.members)) node.members.forEach(walk);
        break;
    }
  }

  walk(ast);
  return {
    kind: "panini-ir",
    version: "0.1.0",
    target: "bytecode-vm",
    functions,
    artifacts,
    files,
    declarations,
  };
}

function lowerBlock(block) {
  const stmts = block?.kind === "Block" ? block.statements : block ? [block] : [];
  return stmts.map(lowerStmt);
}

function lowerStmt(node) {
  if (!node) return { op: "nop" };
  switch (node.kind) {
    case "Return":
      return { op: "return", arg: lowerExpr(node.argument) };
    case "Assign":
      return { op: "assign", target: lowerExpr(node.target), value: lowerExpr(node.value) };
    case "If":
      return {
        op: "if",
        test: lowerExpr(node.test),
        then: lowerBlock(node.consequent),
        else: node.alternate ? lowerBlock(node.alternate.kind === "If" ? { kind: "Block", statements: [node.alternate] } : node.alternate) : [],
      };
    case "While":
      return { op: "while", test: lowerExpr(node.test), body: lowerBlock(node.body) };
    case "For":
    case "ForEach":
      return { op: "for", name: node.name, iter: lowerExpr(node.iter), body: lowerBlock(node.body) };
    case "Repeat":
      return { op: "repeat", count: lowerExpr(node.count), body: lowerBlock(node.body) };
    case "Assert":
      return { op: "assert", test: lowerExpr(node.test), message: node.message };
    case "ExprStmt":
      return { op: "expr", value: lowerExpr(node.expression) };
    default:
      return { op: "node", kind: node.kind, expr: lowerExpr(node) };
  }
}

function lowerExpr(node) {
  if (!node) return { op: "unit" };
  switch (node.kind) {
    case "Literal":
      return { op: "const", value: node.value };
    case "Identifier":
      return { op: "load", name: node.name };
    case "Binary":
      return { op: "bin", operator: node.op, left: lowerExpr(node.left), right: lowerExpr(node.right) };
    case "Unary":
      return { op: "un", operator: node.op, arg: lowerExpr(node.argument) };
    case "Call":
      return { op: "call", callee: lowerExpr(node.callee), args: (node.args || []).map(lowerExpr) };
    case "List":
      return { op: "list", elements: (node.elements || []).map(lowerExpr) };
    case "Map":
      return { op: "map", entries: (node.entries || []).map((e) => ({ key: e.key, value: lowerExpr(e.value) })) };
    case "Member":
      return { op: "member", object: lowerExpr(node.object), property: node.property };
    case "Index":
      return { op: "index", object: lowerExpr(node.object), index: lowerExpr(node.index) };
    case "Range":
      return { op: "range", start: lowerExpr(node.start), end: lowerExpr(node.end) };
    case "Lambda":
      return { op: "lambda", params: (node.params || []).map((p) => p.name), body: lowerBlock(node.body) };
    default:
      return { op: "unknown", kind: node.kind };
  }
}

export function optimize(ir) {
  // Stage-0 optimizer: drop nops, fold simple const binaries.
  const next = { ...ir, functions: ir.functions.map((fn) => ({ ...fn, body: foldStmts(fn.body) })) };
  return next;
}

function foldStmts(stmts) {
  return (stmts || []).filter((s) => s.op !== "nop").map((s) => {
    if (s.op === "if") return { ...s, test: foldExpr(s.test), then: foldStmts(s.then), else: foldStmts(s.else) };
    if (s.value) return { ...s, value: foldExpr(s.value) };
    if (s.arg) return { ...s, arg: foldExpr(s.arg) };
    if (s.test) return { ...s, test: foldExpr(s.test) };
    return s;
  });
}

function foldExpr(e) {
  if (!e) return e;
  if (e.op === "bin" && e.left?.op === "const" && e.right?.op === "const") {
    const l = e.left.value;
    const r = e.right.value;
    if (typeof l === "number" && typeof r === "number") {
      const map = { "+": l + r, "-": l - r, "*": l * r, "/": l / r, "%": l % r };
      if (e.operator in map) return { op: "const", value: map[e.operator] };
    }
  }
  return e;
}

export function codegen(ir, target = "json") {
  if (target === "json" || target === "INTERPRETED") {
    return Buffer.from(JSON.stringify(ir, null, 2), "utf8");
  }
  if (target === "js" || target === "NATIVE") {
    return Buffer.from(emitJs(ir), "utf8");
  }
  if (target === "python" || target === "py") {
    return Buffer.from(emitPython(ir), "utf8");
  }
  if (target === "torch" || target === "pytorch") {
    return Buffer.from(emitPython(ir, { torch: true }), "utf8");
  }
  if (target === "c") {
    return Buffer.from(emitC(ir), "utf8");
  }
  if (target === "fortran" || target === "f90") {
    return Buffer.from(emitFortran(ir), "utf8");
  }
  if (target === "wgsl") {
    return Buffer.from(emitWgslCompute(), "utf8");
  }
  if (target === "wasm" || target === "WASM") {
    return Buffer.from(JSON.stringify({ note: "WASM backend is a Stage-4 target", ir }, null, 2), "utf8");
  }
  return Buffer.from(JSON.stringify(ir), "utf8");
}

function emitJs(ir) {
  const lines = [
    "// generated by PANINI codegen target=js",
    "const _env = Object.create(null);",
    "function _print(...xs) { console.log(...xs); }",
    "function _len(x) { return x == null ? 0 : x.length; }",
  ];
  for (const fn of ir.functions) {
    const name = safeIdent(fn.name || "anon");
    const params = (fn.params || []).map(safeIdent);
    lines.push(`function ${name}(${params.join(", ")}) {`);
    lines.push(emitStmts(fn.body || [], "  "));
    lines.push("}");
    lines.push(`_env[${JSON.stringify(name)}] = ${name};`);
  }
  lines.push("export { _env as paniniExports };");
  if (ir.functions.some((f) => f.name === "main")) lines.push("if (typeof process !== 'undefined') main();");
  return lines.join("\n") + "\n";
}

function emitStmts(stmts, pad) {
  return (stmts || []).map((s) => emitStmt(s, pad)).join("\n");
}

function emitStmt(s, pad) {
  if (!s) return pad + ";";
  switch (s.op) {
    case "return":
      return pad + "return " + emitExpr(s.arg) + ";";
    case "assign":
      return pad + emitExpr(s.target) + " = " + emitExpr(s.value) + ";";
    case "if":
      return pad + "if (" + emitExpr(s.test) + ") {\n" + emitStmts(s.then, pad + "  ") + "\n" + pad + "}" +
        (s.else?.length ? " else {\n" + emitStmts(s.else, pad + "  ") + "\n" + pad + "}" : "");
    case "while":
      return pad + "while (" + emitExpr(s.test) + ") {\n" + emitStmts(s.body, pad + "  ") + "\n" + pad + "}";
    case "assert":
      return pad + "if (!(" + emitExpr(s.test) + ")) throw new Error(" + JSON.stringify(s.message || "ASSERT") + ");";
    case "expr":
      return pad + emitExpr(s.value) + ";";
    default:
      return pad + "/* " + (s.op || "nop") + " */";
  }
}

function emitExpr(e) {
  if (!e) return "undefined";
  switch (e.op) {
    case "const":
      return JSON.stringify(e.value);
    case "load":
      return safeIdent(e.name);
    case "bin": {
      const op = e.operator === "AND" ? "&&" : e.operator === "OR" ? "||" : e.operator === "==" ? "===" : e.operator;
      return "(" + emitExpr(e.left) + " " + op + " " + emitExpr(e.right) + ")";
    }
    case "un":
      return "(" + (e.operator === "NOT" ? "!" : e.operator) + " " + emitExpr(e.arg) + ")";
    case "call": {
      const callee = e.callee?.op === "load" && e.callee.name === "PRINT" ? "_print" : emitExpr(e.callee);
      return callee + "(" + (e.args || []).map(emitExpr).join(", ") + ")";
    }
    case "list":
      return "[" + (e.elements || []).map(emitExpr).join(", ") + "]";
    case "member":
      return emitExpr(e.object) + "[" + JSON.stringify(e.property) + "]";
    default:
      return "undefined";
  }
}

function safeIdent(name) {
  return String(name).replace(/[^A-Za-z0-9_]/g, "_") || "anon";
}
