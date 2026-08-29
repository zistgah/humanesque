#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Application-layer frontends must execute as PANINI, not mini_langs.js.
 */
import { runFrontend } from "../runtime/foreign_front.js";

let n = 0, fail = 0;
async function check(name, lang, src, expect) {
  n++;
  const r = await runFrontend(lang, src);
  const v = r && r.value;
  const ok = v === expect || v === String(expect);
  if (!ok) { fail++; console.log("FAIL", name, "got", v, r); }
  else console.log("ok  ", name, "->", v, r.frontend);
}

await check("javascript", "javascript", "console.log(40+2)", 42);
await check("java", "java", "System.out.println(40+2);", 42);
await check("sql", "sql", "SELECT 40+2", 42);
await check("php", "php", "echo 40+2;", 42);
await check("ruby", "ruby", "puts 40+2", 42);
await check("csharp", "csharp", "Console.WriteLine(40+2);", 42);
await check("r", "r", "print(40+2)", 42);
await check("perl", "perl", "print 40+2", 42);
await check("basic", "basic", "PRINT 40+2", 42);
await check("logo", "logo", "PRINT 40+2", 42);
await check("js function", "javascript", "function f(x){ return x * 2 } console.log(f(21))", 42);

await check("julia", "julia", "println(40+2)", 42);
await check("haskell", "haskell", "print(40+2)", 42);
await check("pascal", "pascal", "writeln(40+2)", 42);
await check("kotlin", "kotlin", "println(40+2)", 42);
await check("swift", "swift", "print(40+2)", 42);
process.exit(fail ? 1 : 0);
