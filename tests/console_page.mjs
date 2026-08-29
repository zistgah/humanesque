#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const js = fs.readFileSync(path.join(root, "docs/console.js"), "utf8");
const html = fs.readFileSync(path.join(root, "docs/console.html"), "utf8");
const g = { console };
g.window = g;
g.globalThis = g;
vm.runInNewContext(js, g);
const C = g.PANINI_CONSOLE;
if (!C || typeof C.exec !== "function") {
  console.log("FAIL console.js missing exec", C);
  process.exit(1);
}
const ls = C.exec("bash", "ls");
if (!String(ls).includes("readme.txt")) {
  console.log("FAIL ls", ls);
  process.exit(1);
}
C.exec("bash", 'echo hi > /tmp/a.txt');
const cat = C.exec("bash", "cat /tmp/a.txt").trim();
if (cat !== "hi") { console.log("FAIL cat", cat); process.exit(1); }
if (!html.includes("function exec(sh, line)")) {
  console.log("FAIL console.html is not self-contained");
  process.exit(1);
}
if (html.includes('src="console.js"')) {
  console.log("FAIL console.html still depends on console.js (PWA cache)");
  process.exit(1);
}
if (html.includes('id="out"') && html.includes('id="vtcan"')) {
  console.log("FAIL two screens (out + vtcan)");
  process.exit(1);
}
if (!html.includes('id="glass"')) {
  console.log("FAIL no monitor glass");
  process.exit(1);
}
if ((html.match(/<canvas/g) || []).length !== 1) {
  console.log("FAIL expected one canvas");
  process.exit(1);
}
console.log("ok   console.js exec + one-glass html");

