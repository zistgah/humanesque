/** In-memory virtual filesystem used by PANINI VFS/bash. */

export function createVfs() {
  const root = { type: "dir", children: Object.create(null) };
  const state = { cwd: "/", root };
  seed(root);
  return {
    state,
    pwd() { return state.cwd; },
    cd(path) {
      const n = resolve(state, path);
      if (!n || n.node.type !== "dir") return { ok: false, error: "not a directory" };
      state.cwd = n.path;
      return { ok: true, path: n.path };
    },
    ls(path) {
      const n = resolve(state, path || ".");
      if (!n || n.node.type !== "dir") return { ok: false, names: [] };
      return { ok: true, names: Object.keys(n.node.children).sort() };
    },
    read(path) {
      const n = resolve(state, path);
      if (!n || n.node.type !== "file") return { ok: false, content: "" };
      return { ok: true, content: n.node.content };
    },
    write(path, content) {
      const parts = split(abs(state, path));
      const name = parts.pop();
      const dir = walk(state.root, parts, true);
      if (!dir || dir.type !== "dir") return { ok: false };
      dir.children[name] = { type: "file", content: String(content ?? "") };
      return { ok: true };
    },
    mkdir(path) {
      const parts = split(abs(state, path));
      walk(state.root, parts, true);
      return { ok: true };
    },
    rm(path) {
      const parts = split(abs(state, path));
      const name = parts.pop();
      const dir = walk(state.root, parts, false);
      if (!dir || !dir.children[name]) return { ok: false };
      delete dir.children[name];
      return { ok: true };
    },
    exists(path) {
      return !!resolve(state, path);
    },
    tree() {
      return dump(state.root, "/");
    },
  };
}

function seed(root) {
  root.children.home = { type: "dir", children: { panini: { type: "dir", children: {
    "readme.txt": { type: "file", content: "PANINI VFS\n" },
  } } } };
  root.children.tmp = { type: "dir", children: {} };
  root.children.bin = { type: "dir", children: {} };
}

function split(p) {
  return p.split("/").filter(Boolean);
}

function abs(state, path) {
  if (!path || path === ".") return state.cwd;
  if (path === "..") {
    const parts = split(state.cwd);
    parts.pop();
    return "/" + parts.join("/");
  }
  if (path.startsWith("/")) return path === "" ? "/" : path;
  const base = state.cwd.endsWith("/") ? state.cwd : state.cwd + "/";
  return (base + path).replace(/\/+/g, "/");
}

function walk(root, parts, create) {
  let cur = root;
  for (const p of parts) {
    if (!cur.children[p]) {
      if (!create) return null;
      cur.children[p] = { type: "dir", children: Object.create(null) };
    }
    cur = cur.children[p];
    if (cur.type !== "dir") return null;
  }
  return cur;
}

function resolve(state, path) {
  const full = abs(state, path);
  if (full === "/" || full === "") return { path: "/", node: state.root };
  const parts = split(full);
  const name = parts.pop();
  const dir = walk(state.root, parts, false);
  if (!dir || !dir.children[name]) return null;
  return { path: "/" + [...parts, name].join("/"), node: dir.children[name] };
}

function dump(node, prefix) {
  if (node.type === "file") return prefix;
  const names = Object.keys(node.children);
  return [prefix, ...names.flatMap((n) => dump(node.children[n], prefix === "/" ? "/" + n : prefix + "/" + n))].join("\n");
}
