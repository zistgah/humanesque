/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * tree-rev: 2026.08.28
 * POSIX personality on the in-memory VFS. Not a kernel.
 */
import { createVfs } from "./vfs.js";

export function createPosix(vfs) {
  const fs = vfs || createVfs();
  const procs = new Map();
  let nextPid = 1;
  const init = spawn(fs, { cwd: fs.pwd() });
  return {
    fs,
    init,
    syscall(name, ...args) { return syscall(init, fs, name, args); },
    spawn(opts) { return spawn(fs, opts); },
    list() { return [...procs.values()].map((p) => ({ pid: p.pid, cwd: p.cwd })); },
  };

  function spawn(fs, opts = {}) {
    const pid = nextPid++;
    const p = {
      pid,
      cwd: opts.cwd || fs.pwd(),
      fds: new Map([
        [0, { kind: "tty", buf: "" }],
        [1, { kind: "tty", buf: "" }],
        [2, { kind: "tty", buf: "" }],
      ]),
      nextFd: 3,
    };
    procs.set(pid, p);
    return p;
  }
}

export function syscall(proc, fs, name, args) {
  const n = String(name).replace(/^SYS_/, "").toLowerCase();
  if (n === "getcwd") return { ok: true, value: fs.pwd() };
  if (n === "chdir") {
    const r = fs.cd(String(args[0] || "."));
    if (r.ok) proc.cwd = fs.pwd();
    return r;
  }
  if (n === "mkdir") return fs.mkdir(String(args[0]));
  if (n === "unlink") return fs.rm(String(args[0]));
  if (n === "stat") return { ok: fs.exists(String(args[0])), path: String(args[0]) };
  if (n === "open") {
    const path = String(args[0]);
    const mode = String(args[1] || "r");
    if (mode.includes("w")) fs.write(path, "");
    if (!fs.exists(path) && !mode.includes("w")) return { ok: false, error: "ENOENT" };
    const fd = proc.nextFd++;
    proc.fds.set(fd, { kind: "file", path, mode, off: 0 });
    return { ok: true, fd };
  }
  if (n === "close") {
    proc.fds.delete(Number(args[0]));
    return { ok: true };
  }
  if (n === "read") {
    const fd = proc.fds.get(Number(args[0]));
    if (!fd) return { ok: false, error: "EBADF" };
    if (fd.kind === "file") {
      const r = fs.read(fd.path);
      return { ok: r.ok, value: r.content };
    }
    return { ok: true, value: fd.buf || "" };
  }
  if (n === "write") {
    const fd = proc.fds.get(Number(args[0]));
    const data = String(args[1] ?? "");
    if (!fd) return { ok: false, error: "EBADF" };
    if (fd.kind === "tty") {
      fd.buf = (fd.buf || "") + data;
      return { ok: true, n: data.length, stdout: fd.kind === "file" ? undefined : data };
    }
    const cur = fs.read(fd.path).content || "";
    fs.write(fd.path, cur + data);
    return { ok: true, n: data.length };
  }
  if (n === "writev" || n === "write_stdout") {
    return syscall(proc, fs, "write", [1, args[0]]);
  }
  return { ok: false, error: "ENOSYS", name: n };
}
