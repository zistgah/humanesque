/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { lex } from "./lexer.js";
import { parse } from "./parser.js";
import { typecheck } from "./typechecker.js";
import { lower, optimize, codegen } from "./ir.js";

export function compile(source, options = {}) {
  const filename = options.filename || "<stdin>";
  const target = options.target || "INTERPRETED";
  const tokens = lex(source, filename);
  const ast = parse(source, filename);
  const typed = typecheck(ast);
  const ir = optimize(lower(typed.ast));
  const binary = codegen(ir, target);
  return {
    success: typed.ok,
    tokens,
    ast,
    typed,
    ir,
    binary,
    artifact: {
      type: "compiler-output",
      format: target === "js" || target === "NATIVE" ? "text/javascript" : "application/json",
      version: "0.1.0",
      status: typed.ok ? "OK" : "DIAGNOSTIC",
      bytes: binary.length,
      provenance: {
        created_by: "PANINI.Compiler (js-stage-0)",
        created_at: new Date().toISOString(),
        source: filename,
      },
    },
  };
}
