/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/** Lightweight semantic / type pass for PANINI bootstrap. */

export class TypeError2 extends Error {
  constructor(message) {
    super(message);
    this.name = "TypeCheckError";
  }
}

export function typecheck(ast) {
  const env = new Map();
  const diagnostics = [];
  const types = new Map();

  function declare(name, type) {
    env.set(name, type || "Any");
    types.set(name, type || "Any");
  }

  function walk(node, ctx = { fnReturn: null }) {
    if (!node || typeof node !== "object") return "Any";
    switch (node.kind) {
      case "Program":
      case "Module":
        for (const s of node.body || []) walk(s, ctx);
        return "Unit";
      case "FunctionDecl":
      case "MethodDecl":
      case "Lambda": {
        const ret = typeNameOf(node.returnType) || "Any";
        if (node.name) declare(node.name, "Function");
        const inner = { fnReturn: ret };
        walk(node.body, inner);
        return "Function";
      }
      case "TypeDecl":
        if (node.name) declare(node.name, "Type");
        return "Type";
      case "ClassDecl":
        if (node.name) declare(node.name, "Class");
        for (const m of node.members || []) walk(m, ctx);
        return "Class";
      case "Block":
        for (const s of node.statements || []) walk(s, ctx);
        return "Unit";
      case "Return":
        walk(node.argument, ctx);
        return ctx.fnReturn || "Any";
      case "If":
        walk(node.test, ctx);
        walk(node.consequent, ctx);
        walk(node.alternate, ctx);
        return "Unit";
      case "For":
      case "ForEach":
      case "While":
      case "Until":
      case "Repeat":
        walk(node.iter || node.test || node.count, ctx);
        walk(node.body, ctx);
        return "Unit";
      case "Assign":
        walk(node.value, ctx);
        if (node.target?.kind === "Identifier") declare(node.target.name, infer(node.value));
        return infer(node.value);
      case "Call":
        walk(node.callee, ctx);
        for (const a of node.args || []) walk(a, ctx);
        return "Any";
      case "Literal":
        return infer(node);
      case "Identifier":
        return env.get(node.name) || "Any";
      case "Binary":
        walk(node.left, ctx);
        walk(node.right, ctx);
        if (["+", "-", "*", "/", "%"].includes(node.op)) return "Number";
        if (["==", "!=", "<", ">", "<=", ">=", "AND", "OR", "IS", "IS_NOT"].includes(node.op)) return "Bool";
        return "Any";
      case "FileBlock":
      case "Artifact":
      case "Cycler":
      case "Configuration":
      case "Declarative":
      case "EnumDecl":
      case "TestDecl":
      case "ProgramDecl":
        return "Unit";
      default:
        for (const k of Object.keys(node)) {
          const v = node[k];
          if (v && typeof v === "object" && v.kind) walk(v, ctx);
          if (Array.isArray(v)) v.forEach((x) => x && x.kind && walk(x, ctx));
        }
        return "Any";
    }
  }

  function infer(node) {
    if (!node) return "Unit";
    if (node.kind === "Literal") {
      if (typeof node.value === "boolean") return "Bool";
      if (typeof node.value === "number") return Number.isInteger(node.value) ? "Int" : "Float";
      if (typeof node.value === "string") return "String";
      if (node.value == null) return "Unit";
    }
    if (node.kind === "List") return "List";
    if (node.kind === "Map") return "Map";
    if (node.kind === "Lambda" || node.kind === "FunctionDecl") return "Function";
    return "Any";
  }

  function typeNameOf(t) {
    if (!t) return null;
    if (typeof t === "string") return t;
    if (t.name) return t.name;
    return null;
  }

  try {
    walk(ast);
  } catch (e) {
    diagnostics.push({ severity: "error", message: e.message });
  }

  return {
    ok: diagnostics.length === 0,
    diagnostics,
    types: Object.fromEntries(types),
    ast,
  };
}
