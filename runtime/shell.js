/**
 * Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Canonical bash + COMMAND.COM over runtime/vfs.js. Pages adapter: docs/console.js.
 */
import { createVfs } from "./vfs.js";

export function tokenize(line) {
  const out = [];
  let cur = "", q = null;
  for (const ch of String(line)) {
    if (q) {
      if (ch === q) q = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") q = ch;
    else if (/\s/.test(ch)) {
      if (cur) { out.push(cur); cur = ""; }
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

export function createShell(vfs) {
  const fs = vfs || createVfs();
  fs.cd("/home/panini");
  const hist = [];
  function redirect(toks) {
    let mode = null, target = null, cut = toks.length;
    for (let i = 0; i < toks.length; i++) {
      if (toks[i] === ">" || toks[i] === ">>") {
        mode = toks[i]; target = toks[i + 1]; cut = i; break;
      }
    }
    return { args: toks.slice(0, cut), mode, target };
  }
  function writeOut(text, mode, target) {
    if (!target) return text;
    const prev = mode === ">>" ? (fs.read(target).content || "") : "";
    fs.write(target, prev + text + (text.endsWith("\n") ? "" : "\n"));
    return "";
  }
  function bash(line) {
    const raw = String(line || "").trim();
    if (!raw) return "";
    hist.push(raw);
    const toks = tokenize(raw);
    const { args, mode, target } = redirect(toks);
    const c = (args[0] || "").toLowerCase();
    const a = args.slice(1);
    let out = "";
    if (c === "pwd") out = fs.pwd();
    else if (c === "ls") {
      const p = a.filter((x) => x[0] !== "-")[0];
      const r = fs.ls(p || ".");
      out = r.ok ? r.names.join("\n") : "ls: cannot access: No such file";
    } else if (c === "cd") {
      const r = fs.cd(a[0] || "/home/panini");
      out = r.ok ? "" : "bash: cd: " + a[0] + ": No such file or directory";
    } else if (c === "cat" || c === "type") {
      out = a.map((p) => {
        const r = fs.read(p);
        return r.ok ? r.content : "cat: " + p + ": No such file";
      }).join("");
    } else if (c === "echo") {
      out = a.join(" ");
    } else if (c === "mkdir") { fs.mkdir(a[0] || ""); }
    else if (c === "touch") { fs.write(a[0] || "a", fs.read(a[0] || "a").content || ""); }
    else if (c === "rm" || c === "del") {
      const r = fs.rm(a[0]);
      out = r.ok ? "" : "rm: cannot remove: No such file";
    } else if (c === "cp") {
      const s = fs.read(a[0]);
      if (!s.ok) out = "cp: No such file";
      else fs.write(a[1], s.content);
    } else if (c === "mv") {
      const s = fs.read(a[0]);
      if (!s.ok) out = "mv: No such file";
      else { fs.write(a[1], s.content); fs.rm(a[0]); }
    } else if (c === "wc") {
      const s = fs.read(a[0]);
      if (!s.ok) out = "wc: No such file";
      else {
        const t = s.content;
        out = t.split("\n").length + " " + t.trim().split(/\s+/).filter(Boolean).length + " " + t.length + " " + a[0];
      }
    } else if (c === "head") {
      const s = fs.read(a[a.length - 1]);
      out = s.ok ? s.content.split("\n").slice(0, 10).join("\n") : "head: No such file";
    } else if (c === "tree") out = fs.tree();
    else if (c === "whoami") out = "panini";
    else if (c === "uname") out = "PANINI-486";
    else if (c === "date") out = new Date().toISOString();
    else if (c === "clear" || c === "cls") out = "\x1b[2J";
    else if (c === "history") out = hist.map((h, i) => " " + (i + 1) + "  " + h).join("\n");
    else if (c === "help") out = "pwd ls cd cat echo mkdir touch rm cp mv wc head tree whoami uname date history help";
    else out = c + ": command not found";
    return writeOut(out, mode, target);
  }
  function commandCom(line) {
    const toks = tokenize(line);
    const c = (toks[0] || "").toUpperCase();
    if (c === "DIR") return bash("ls " + (toks[1] || ""));
    if (c === "CD" || c === "CHDIR") return bash("cd " + (toks[1] || ""));
    if (c === "TYPE") return bash("cat " + (toks[1] || ""));
    if (c === "ECHO") return bash("echo " + toks.slice(1).join(" "));
    if (c === "CLS") return bash("clear");
    if (c === "MD" || c === "MKDIR") return bash("mkdir " + toks[1]);
    if (c === "DEL") return bash("rm " + toks[1]);
    if (c === "COPY") return bash("cp " + toks[1] + " " + toks[2]);
    if (c === "VER") return "PANINI COMMAND.COM";
    if (c === "HELP") return "DIR CD TYPE ECHO CLS MD DEL COPY VER HELP";
    if (!c) return "";
    return "Bad command or file name";
  }
  return {
    fs, bash, commandCom, hist,
    exec(sh, line) { return sh === "command.com" ? commandCom(line) : bash(line); },
  };
}
