import {
  Tag, vUnit, vBool, vInt, vNum, vStr, vList, vMap, vFn, vOk, vErr, vSome, vNone,
  wrap, unwrap, display, typeName, equals, toNumber, toStr, iterate,
} from "./values.js";
import { stamp, canonicalizeClaim, EpistemicStatus } from "./provenance.js";
import { which, runPython, runC } from "./toolchain.js";
import { axpy, scal, nrm2, gemv, gemm, autotuneGemm } from "./blas.js";
import { tensor, matmul, tadd, relu } from "./tensor.js";
import { createVfs } from "./vfs.js";
import { createPosix, syscall } from "./posix.js";
import { engine as ociEngine, ENVIRONMENTS, runEnv, ociConfig } from "./oci.js";
import { createVt100, vtWrite, vtPlain, vtSnapshot } from "./vt100.js";
import { defaultDosFont, loadFontFile, getFont, listFonts } from "./fonts.js";
import { ccpp } from "./ccpp.js";
import { cinterp } from "./cinterp.js";
import { cpplower } from "./cpplower.js";
import { clower } from "./clower.js";
import { gnuc } from "./gnuc.js";
import { rustToC, goToC, juliaToC, tsToC, jsToC, zigToC, luaToC, fortranToC, pascalToC, pascalReject, basicToC, javaToC, javaReject, csharpToC, kotlinToC, swiftToC, scalaToC, dartToC, adaToC } from "./stdlower.js";
import { qb64Run } from "./qb64.js";
import { js262Run, ts262Run } from "./js262.js";
import { stRunFile } from "./steval.js";
import { haskellRun } from "./hseval.js";
import { cppReject } from "./cpplower.js";
import { lispRun } from "./cleval.js";
import { prologRun } from "./pleval.js";
import { makeRun } from "./makeeval.js";
import { asRun } from "./aseval.js";
import { createVga, vgaPset, vgaLine, vgaScreen, vgaCls } from "./vga.js";
import { renderTextBitmap } from "./dosfont.js";
import { rubyRun, perlRun, phpRun, rRun, cobolRun, sqlRun, octaveRun, sysmlRun } from "./appeval.js";

export function installBuiltins(env, runtime) {
  const def = (name, fn, arity) => {
    env.define(name, vFn(async (...args) => {
      if (arity != null && args.length < arity) {
        throw new TypeError(`${name} expects at least ${arity} argument(s)`);
      }
      return fn(...args);
    }), { constant: true });
  };

  def("identity", (x) => x ?? vUnit(), 1);
  def("PRINT", (...args) => {
    const line = args.map(display).join(" ");
    runtime.stdout.write(line + "\n");
    runtime.prints.push(line);
    return vUnit();
  });
  def("WRITE", (...args) => {
    const line = args.map(display).join(" ");
    runtime.stdout.write(line);
    runtime.prints.push(line);
    return vUnit();
  });
  def("TYPEOF", (x) => vStr(typeName(x)), 1);
  def("NOW", () => vStr(new Date().toISOString()));
  def("STR", (x) => vStr(toStr(x)), 1);
  def("INT", (x) => vInt(toNumber(x)), 1);
  def("CPP", (x) => vStr(ccpp(toStr(x))), 1);
  def("CINTERP", (x) => vInt(cinterp(toStr(x)) | 0), 1);
  def("CPPLOWER", (x) => vStr(cpplower(toStr(x))), 1);
  def("CLOWER", (x) => vStr(clower(toStr(x))), 1);
  def("GNUC", (x) => vStr(gnuc(toStr(x))), 1);
  def("RUSTLOWER", (x) => vStr(rustToC(toStr(x))), 1);
  def("GOLOWER", (x) => vStr(goToC(toStr(x))), 1);
  def("JULIALOWER", (x) => vStr(juliaToC(toStr(x))), 1);
  def("TSLOWER", (x) => vStr(tsToC(toStr(x))), 1);
  def("JSLOWER", (x) => vStr(jsToC(toStr(x))), 1);
  def("ZIGLOWER", (x) => vStr(zigToC(toStr(x))), 1);
  def("LUALOWER", (x) => vStr(luaToC(toStr(x))), 1);
  def("FORTRANLOWER", (x) => vStr(fortranToC(toStr(x))), 1);
  def("PASCALLOWER", (x) => vStr(pascalToC(toStr(x))), 1);
  def("PASCALREJECT", (x) => vStr(pascalReject(toStr(x)) || ""), 1);
  def("BASICLOWER", (x) => vStr(basicToC(toStr(x))), 1);
  def("QB64RUN", (x) => wrap(qb64Run(toStr(x))), 1);
  def("TEST262RUN", (x) => wrap(js262Run(toStr(x))), 1);
  def("TS262RUN", (x) => wrap(ts262Run(toStr(x))), 1);
  def("JAVAREJECT", (x) => vStr(javaReject(toStr(x)) || ""), 1);
  def("JAVALOWER", (x) => vStr(javaToC(toStr(x))), 1);
  def("HASKELLRUN", (x) => wrap(haskellRun(toStr(x))), 1);
  def("SMALLTALKRUN", (x) => wrap(stRunFile(toStr(x))), 1);
  def("CPPREJECT", (x) => vStr(cppReject(toStr(x)) || ""), 1);
  def("MAKERUN", (x) => wrap(makeRun(toStr(x))), 1);
  def("ASRUN", (x) => wrap(asRun(toStr(x))), 1);
  def("LISPRUN", (x) => wrap(lispRun(toStr(x))), 1);
  def("PROLOGRUN", (x) => wrap(prologRun(toStr(x))), 1);
  def("CSHARPLOWER", (x) => vStr(csharpToC(toStr(x))), 1);
  def("KOTLINLOWER", (x) => vStr(kotlinToC(toStr(x))), 1);
  def("SWIFTLOWER", (x) => vStr(swiftToC(toStr(x))), 1);
  def("SCALALOWER", (x) => vStr(scalaToC(toStr(x))), 1);
  def("DARTLOWER", (x) => vStr(dartToC(toStr(x))), 1);
  def("ADALOWER", (x) => vStr(adaToC(toStr(x))), 1);
  def("RUBYRUN", (x) => wrap(rubyRun(toStr(x))), 1);
  def("PERLRUN", (x) => wrap(perlRun(toStr(x))), 1);
  def("PHPRUN", (x) => wrap(phpRun(toStr(x))), 1);
  def("RRUN", (x) => wrap(rRun(toStr(x))), 1);
  def("COBOLRUN", (x) => wrap(cobolRun(toStr(x))), 1);
  def("SQLRUN", (x) => wrap(sqlRun(toStr(x))), 1);
  def("OCTAVERUN", (x) => wrap(octaveRun(toStr(x))), 1);
  def("SYSMLRUN", (x) => wrap(sysmlRun(toStr(x))), 1);
  {
    let _vga = createVga(13);
    def("VGA", () => wrap({ mode: _vga.mode, w: _vga.w, h: _vga.h, name: _vga.name }));
    def("SCREEN", (m) => {
      vgaScreen(_vga, toNumber(m));
      return wrap({ mode: _vga.mode, w: _vga.w, h: _vga.h, name: _vga.name });
    }, 1);
    def("PSET", (x, y, c) => {
      vgaPset(_vga, toNumber(x), toNumber(y), c == null ? null : toNumber(c));
      return vUnit();
    }, 2);
    def("VGALINE", (x0, y0, x1, y1, c) => {
      vgaLine(_vga, toNumber(x0), toNumber(y0), toNumber(x1), toNumber(y1), c == null ? null : toNumber(c));
      return vUnit();
    }, 4);
    def("VGACLS", (c) => { vgaCls(_vga, c == null ? 0 : toNumber(c)); return vUnit(); });
  }
  def("ORD", (x) => {
    const s = toStr(x);
    return vInt(s.length ? s.charCodeAt(0) : 0);
  }, 1);
  def("FLOAT", (x) => ({ tag: Tag.Float, value: toNumber(x) }), 1);
  def("LEN", (x) => {
    if (!x) return vInt(0);
    if (x.tag === Tag.String || x.tag === Tag.List) return vInt(x.value.length);
    if (x.tag === Tag.Map) return vInt(x.value.size);
    return vInt(0);
  }, 1);
  def("OK", (x) => vOk(x ?? vUnit()));
  def("ERR", (x) => vErr(x ?? vStr("error")));
  def("Some", (x) => vSome(x));
  def("None", () => vNone());

  def("RETRIEVE", async (query) => {
    const q = toStr(query);
    runtime.log("retrieve", q);
    return vOk(vList([
      wrap({
        id: "bootstrap-source",
        title: q,
        provenance: stamp({ status: EpistemicStatus.RETRIEVED, source: "runtime.retriever" }),
      }),
    ]));
  }, 1);

  def("READ", async (source) => {
    const path = typeof source === "object" && source.tag === Tag.Map
      ? toStr(source.value.get("id") || source.value.get("path") || vStr(""))
      : toStr(source);
    const file = runtime.artifacts.getFile(path);
    if (file) return vOk(vStr(file.content));
    return vErr(vStr(`source not found: ${path}`));
  }, 1);

  def("VERIFY", async (artifact, criterion) => {
    runtime.log("verify", display(artifact), display(criterion));
    return vOk(vBool(true));
  });

  def("ASK", async (model, prompt) => {
    return vErr(vStr("model adapter not configured (provider-neutral stub)"));
  });

  def("canonicalize", (claim) => {
    const raw = unwrap(claim) || {};
    const result = canonicalizeClaim(raw);
    return result.ok ? vOk(wrap(result.value)) : vErr(vStr(result.error));
  }, 1);

  def("WRITE", async (what, dest) => {
    const path = toStr(dest);
    const content = toStr(what);
    runtime.artifacts.putFile(path, { mime: "text/plain", content });
    return vStr(path);
  });

  def("SLICE", (s, a, b) => {
    if (s?.tag === Tag.List) {
      const start = toNumber(a);
      const end = b == null || b.tag === Tag.Unit ? s.value.length : toNumber(b);
      return vList(s.value.slice(start, end));
    }
    const str = toStr(s);
    const start = toNumber(a);
    const end = b == null || b.tag === Tag.Unit ? str.length : toNumber(b);
    return vStr(str.slice(start, end));
  }, 2);

  def("APPEND", (list, item) => {
    if (list?.tag === Tag.List) {
      list.value.push(item);
      return list;
    }
    return vList([item]);
  }, 2);

  def("HASKEY", (m, k) => {
    if (m?.tag === Tag.Map) return vBool(m.value.has(toStr(k)));
    return vBool(false);
  }, 2);
  def("AXPY", (n, a, x, y) => wrap(axpy(toNumber(n), toNumber(a), unwrap(x), unwrap(y))), 4);
  def("SCAL", (n, a, x) => wrap(scal(toNumber(n), toNumber(a), unwrap(x))), 3);
  def("NRM2", (n, x) => wrap(nrm2(toNumber(n), unwrap(x))), 2);
  def("GEMV", (m, n, a, x) => wrap(gemv(toNumber(m), toNumber(n), unwrap(a), unwrap(x))), 4);
  def("GEMM", (m, n, k, a, b) => wrap(gemm(toNumber(m), toNumber(n), toNumber(k), unwrap(a), unwrap(b))), 5);
  def("GEMM_TUNE", (m, n, k, a, b) => wrap(autotuneGemm(toNumber(m), toNumber(n), toNumber(k), unwrap(a), unwrap(b))), 5);
  def("TENSOR", (data) => wrap(tensor(unwrap(data))), 1);
  def("MATMUL", (a, b) => wrap(matmul(unwrap(a), unwrap(b))), 2);
  def("TADD", (a, b) => wrap(tadd(unwrap(a), unwrap(b))), 2);
  def("RELU", (a) => wrap(relu(unwrap(a))), 1);
  def("GFX_CLEAR", () => { runtime.gfx = []; return vStr("ok"); });
  def("GFX_RECT", (x, y, w, h) => { (runtime.gfx ||= []).push({op:"rect",x:toNumber(x),y:toNumber(y),w:toNumber(w),h:toNumber(h)}); return vUnit(); }, 4);
  def("GFX_LINE", (x1,y1,x2,y2) => { (runtime.gfx ||= []).push({op:"line",x1:toNumber(x1),y1:toNumber(y1),x2:toNumber(x2),y2:toNumber(y2)}); return vUnit(); }, 4);
  def("GFX_CIRCLE", (x,y,r) => { (runtime.gfx ||= []).push({op:"circle",x:toNumber(x),y:toNumber(y),r:toNumber(r)}); return vUnit(); }, 3);

  if (!runtime.vfs) runtime.vfs = createVfs();
  const vfs = runtime.vfs;
  def("VFS_PWD", () => vStr(vfs.pwd()));
  def("VFS_CD", (p) => wrap(vfs.cd(toStr(p))), 1);
  def("VFS_LS", (p) => wrap(vfs.ls(p == null ? "." : toStr(p)).names), 0);
  def("VFS_READ", (p) => wrap(vfs.read(toStr(p)).content), 1);
  def("VFS_WRITE", (p, c) => wrap(vfs.write(toStr(p), toStr(c))), 2);
  def("VFS_MKDIR", (p) => wrap(vfs.mkdir(toStr(p))), 1);
  def("VFS_RM", (p) => wrap(vfs.rm(toStr(p))), 1);
  def("VFS_EXISTS", (p) => vBool(vfs.exists(toStr(p))), 1);
  def("VFS_TREE", () => vStr(vfs.tree()));

  if (!runtime.posix) runtime.posix = createPosix(vfs);
  const px = runtime.posix;
  def("SYS_GETCWD", () => wrap(syscall(px.init, vfs, "getcwd", []).value));
  def("SYS_CHDIR", (p) => wrap(syscall(px.init, vfs, "chdir", [toStr(p)])), 1);
  def("SYS_MKDIR", (p) => wrap(syscall(px.init, vfs, "mkdir", [toStr(p)])), 1);
  def("SYS_OPEN", (p, m) => wrap(syscall(px.init, vfs, "open", [toStr(p), m == null ? "r" : toStr(m)])), 1);
  def("SYS_READ", (fd) => wrap(syscall(px.init, vfs, "read", [toNumber(fd)])), 1);
  def("SYS_WRITE", (fd, data) => wrap(syscall(px.init, vfs, "write", [toNumber(fd), toStr(data)])), 2);
  def("SYS_CLOSE", (fd) => wrap(syscall(px.init, vfs, "close", [toNumber(fd)])), 1);
  def("SYS_UNLINK", (p) => wrap(syscall(px.init, vfs, "unlink", [toStr(p)])), 1);
  def("SYS_STAT", (p) => wrap(syscall(px.init, vfs, "stat", [toStr(p)])), 1);
  def("OCI_ENGINE", () => vStr(ociEngine() || ""));
  def("OCI_LIST", () => wrap(Object.keys(ENVIRONMENTS)));
  def("OCI_CONFIG", () => wrap(ociConfig()));
  def("OCI_RUN", (name) => wrap(runEnv(toStr(name))), 1);

  if (!runtime.vt) runtime.vt = createVt100();
  defaultDosFont();
  def("ESC", () => vStr("\x1b"));
  def("VT_RESET", () => { runtime.vt = createVt100(); return vStr("ok"); });
  def("VT_WRITE", (s) => { vtWrite(runtime.vt, toStr(s)); return vStr(vtPlain(runtime.vt)); }, 1);
  def("VT_DUMP", () => vStr(vtPlain(runtime.vt)));
  def("VT_SNAPSHOT", () => wrap(vtSnapshot(runtime.vt)));
  def("VT_FONT", (name) => {
    runtime.vt.fontName = toStr(name);
    return vStr(runtime.vt.fontName);
  }, 1);
  def("VT_LOAD_FONT", (name, path) => {
    const font = loadFontFile(toStr(name), toStr(path));
    runtime.vt.fontName = font.name;
    return vStr(font.kind + ":" + font.name);
  }, 2);
  def("VT_FONTS", () => wrap(listFonts()));
  def("VT_RENDER", (text) => {
    const bmp = renderTextBitmap(getFont(runtime.vt.fontName), text == null ? vtPlain(runtime.vt) : toStr(text));
    return wrap({ width: bmp.width, height: bmp.height, rows: bmp.height });
  });

  def("WHICH", (name) => {
    const found = which(toStr(name));
    return found ? vStr(found) : vStr("");
  }, 1);

  def("INVOKE", (kind, source) => {
    const k = toStr(kind);
    const src = toStr(source);
    let r;
    if (k === "python" || k === "python3") r = runPython(src);
    else if (k === "cc" || k === "c") r = runC(src, { cxx: false });
    else if (k === "cxx" || k === "c++" || k === "cpp") r = runC(src, { cxx: true });
    else r = { ok: false, stderr: "unknown toolchain " + k };
    return wrap({
      ok: !!r.ok,
      stdout: String(r.stdout || "").trim(),
      stderr: String(r.stderr || r.error || ""),
      missing: r.missing || "",
    });
  }, 2);

  def("CR", () => vStr("\r"));
  def("CONTAINS", (xs, w) => {
    const needle = unwrap(w);
    if (xs?.tag === Tag.List) {
      for (const it of xs.value) {
        if (equals(it, w) || unwrap(it) === needle) return vBool(true);
      }
      return vBool(false);
    }
    if (xs?.tag === Tag.String) return vBool(xs.value.includes(toStr(w)));
    return vBool(false);
  }, 2);
  def("QUOTE", () => vStr('"'));
  def("NEWLINE", () => vStr("\n"));
  def("BACKSLASH", () => vStr("\\"));
  def("TAB", () => vStr("\t"));
  def("CR", () => vStr("\r"));

  def("COS", (x) => vNum(Math.cos(toNumber(x))), 1);
  def("SIN", (x) => vNum(Math.sin(toNumber(x))), 1);
  env.define("PI", vNum(Math.PI), { constant: true });

  env.define("TRUE", vBool(true), { constant: true });
  env.define("FALSE", vBool(false), { constant: true });
  env.define("NULL", vUnit(), { constant: true });
  env.define("UNIT", vUnit(), { constant: true });
  env.define("EpistemicStatus", wrap(EpistemicStatus), { constant: true });

  return env;
}
