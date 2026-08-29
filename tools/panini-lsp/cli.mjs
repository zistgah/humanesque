#!/usr/bin/env node
/** File diagnostics without a long-lived LSP daemon (Pages-friendly, editor-task friendly). */
import fs from "node:fs";
import { lex } from "../../compiler/lexer.js";
import { parse } from "../../compiler/parser.js";

const file = process.argv[2];
if (!file) {
  console.error("usage: node tools/panini-lsp/cli.mjs <file.pni>");
  process.exit(2);
}
const src = fs.readFileSync(file, "utf8");
try {
  const tokens = lex(src, file);
  const ast = parse(src, file);
  console.log(JSON.stringify({ ok: true, tokens: tokens.length, kind: ast.kind, body: ast.body?.length ?? 0 }, null, 2));
} catch (e) {
  console.log(JSON.stringify({ ok: false, error: e.message, line: e.token?.start?.line || e.line }, null, 2));
  process.exit(1);
}
