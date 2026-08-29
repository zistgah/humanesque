/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Pages adapter of runtime/vfs.js + runtime/shell.js. Do not invent a third VFS.
 */
(function (g) {
  function dir() { return { type: "dir", children: Object.create(null) }; }
  function file(x) { return { type: "file", content: String(x || "") }; }
  function createVfs() {
    const root = dir();
    root.children.home = dir();
    root.children.home.children.panini = dir();
    root.children.home.children.panini.children["readme.txt"] = file("PANINI VFS\nCopyright (C) 1993-2026 Abhishek Choudhary\nType help.\n");
    root.children.home.children.panini.children["क्रमगुण.pni"] = file("MODULE क्रमगुण\nFUNCTION क्रमगुण(न)\n    IF न <= 1\n        RETURN 1\n    ELSE\n        RETURN न * क्रमगुण(न - 1)\n    END\nEND\n");
    root.children.tmp = dir();
    root.children.bin = dir();
    root.children.etc = dir();
    const state = { cwd: "/home/panini", root };
    function split(p) { return String(p).split("/").filter(Boolean); }
    function abs(path) {
      if (!path || path === ".") return state.cwd;
      if (path === "..") { const a = split(state.cwd); a.pop(); return "/" + a.join("/"); }
      if (path[0] === "/" || /^[A-Za-z]:/.test(path)) return "/" + split(path.replace(/^[A-Za-z]:/, "")).join("/");
      return (state.cwd.replace(/\/$/, "") + "/" + path).replace(/\/+/g, "/");
    }
    function walk(parts, create) {
      let cur = root;
      for (const p of parts) {
        if (!cur.children[p]) {
          if (!create) return null;
          cur.children[p] = dir();
        }
        cur = cur.children[p];
        if (cur.type !== "dir") return null;
      }
      return cur;
    }
    function resolve(path) {
      const full = abs(path);
      if (full === "/" || full === "") return { path: "/", node: root };
      const parts = split(full);
      const name = parts.pop();
      const d = walk(parts, false);
      if (!d || !d.children[name]) return null;
      return { path: "/" + [...parts, name].join("/"), node: d.children[name] };
    }
    return {
      pwd() { return state.cwd; },
      cd(path) {
        const n = resolve(path || "/home/panini");
        if (!n || n.node.type !== "dir") return { ok: false };
        state.cwd = n.path;
        return { ok: true };
      },
      ls(path) {
        const n = resolve(path || ".");
        if (!n || n.node.type !== "dir") return { ok: false, names: [] };
        return { ok: true, names: Object.keys(n.node.children).sort() };
      },
      read(path) {
        const n = resolve(path);
        if (!n || n.node.type !== "file") return { ok: false, content: "" };
        return { ok: true, content: n.node.content };
      },
      write(path, content) {
        const parts = split(abs(path));
        const name = parts.pop();
        const d = walk(parts, true);
        if (!d) return { ok: false };
        d.children[name] = file(content);
        return { ok: true };
      },
      mkdir(path) { walk(split(abs(path)), true); return { ok: true }; },
      rm(path) {
        const parts = split(abs(path));
        const name = parts.pop();
        const d = walk(parts, false);
        if (!d || !d.children[name]) return { ok: false };
        delete d.children[name];
        return { ok: true };
      },
      tree() { return JSON.stringify(Object.keys(root.children)); },
    };
  }
  function tokenize(line) {
    const out = []; let cur = "", q = null;
    for (const ch of String(line)) {
      if (q) { if (ch === q) q = null; else cur += ch; }
      else if (ch === '"' || ch === "'") q = ch;
      else if (/\s/.test(ch)) { if (cur) { out.push(cur); cur = ""; } }
      else cur += ch;
    }
    if (cur) out.push(cur);
    return out;
  }
  const fs = createVfs();
  const hist = [];
  function bash(line) {
    const raw = String(line || "").trim();
    if (!raw) return "";
    hist.push(raw);
    const toks = tokenize(raw);
    let mode = null, target = null, cut = toks.length;
    for (let i = 0; i < toks.length; i++) {
      if (toks[i] === ">" || toks[i] === ">>") { mode = toks[i]; target = toks[i + 1]; cut = i; break; }
    }
    const args = toks.slice(0, cut);
    const c = (args[0] || "").toLowerCase();
    const a = args.slice(1);
    let out = "";
    if (c === "pwd") out = fs.pwd();
    else if (c === "ls") {
      const r = fs.ls(a.filter((x) => x[0] !== "-")[0] || ".");
      out = r.ok ? r.names.join("\n") : "ls: cannot access: No such file or directory";
    } else if (c === "cd") {
      const r = fs.cd(a[0] || "/home/panini");
      out = r.ok ? "" : "bash: cd: " + a[0] + ": No such file or directory";
    } else if (c === "cat") {
      out = a.map((p) => { const r = fs.read(p); return r.ok ? r.content : "cat: " + p + ": No such file"; }).join("");
    } else if (c === "echo") out = a.join(" ");
    else if (c === "mkdir") fs.mkdir(a[0] || "");
    else if (c === "touch") { const prev = fs.read(a[0] || "a"); fs.write(a[0] || "a", prev.content || ""); }
    else if (c === "rm") { const r = fs.rm(a[0]); out = r.ok ? "" : "rm: cannot remove"; }
    else if (c === "cp") { const s = fs.read(a[0]); if (s.ok) fs.write(a[1], s.content); else out = "cp: No such file"; }
    else if (c === "mv") { const s = fs.read(a[0]); if (s.ok) { fs.write(a[1], s.content); fs.rm(a[0]); } else out = "mv: No such file"; }
    else if (c === "tree") out = fs.tree();
    else if (c === "whoami") out = "panini";
    else if (c === "uname") out = "PANINI-486";
    else if (c === "date") out = new Date().toISOString();
    else if (c === "clear" || c === "cls") out = "\x1b[2J";
    else if (c === "history") out = hist.map((h, i) => " " + (i + 1) + "  " + h).join("\n");
    else if (c === "help") out = "pwd ls cd cat echo mkdir touch rm cp mv tree whoami uname date history help";
    else out = c + ": command not found";
    if (target) {
      const prev = mode === ">>" ? (fs.read(target).content || "") : "";
      fs.write(target, prev + out + (out.endsWith("\n") ? "" : "\n"));
      return "";
    }
    return out;
  }
  function commandCom(line) {
    const t = tokenize(line);
    const c = (t[0] || "").toUpperCase();
    if (!c) return "";
    if (c === "DIR") return bash("ls " + (t[1] || ""));
    if (c === "CD") return bash("cd " + (t[1] || ""));
    if (c === "TYPE") return bash("cat " + (t[1] || ""));
    if (c === "ECHO") return bash("echo " + t.slice(1).join(" "));
    if (c === "CLS") return "\x1b[2J";
    if (c === "MD") return bash("mkdir " + t[1]);
    if (c === "DEL") return bash("rm " + t[1]);
    if (c === "COPY") return bash("cp " + t[1] + " " + t[2]);
    if (c === "VER") return "PANINI COMMAND.COM";
    if (c === "HELP") return "DIR CD TYPE ECHO CLS MD DEL COPY VER HELP";
    return "Bad command or file name";
  }
  g.PANINI_CONSOLE = {
    bash, commandCom,
    exec: function (sh, line) { return sh === "command.com" ? commandCom(line) : bash(line); },
  };
})(typeof window !== "undefined" ? window : globalThis);
