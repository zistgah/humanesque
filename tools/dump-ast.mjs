#!/usr/bin/env node
import fs from "node:fs";
import { parse } from "../compiler/parser.js";

const file = process.argv[2];
if (!file) {
  console.error("usage: dump-ast <file.pni>");
  process.exit(2);
}
const ast = parse(fs.readFileSync(file, "utf8"), file);
console.log(JSON.stringify(ast, null, 2));
