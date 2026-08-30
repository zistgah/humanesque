/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * 16-bit real-mode x86 guest. Not v86, not i386, not Linux.
 * Enough to boot a floppy: 8086 integer subset + INT 10h/13h/16h/19h.
 * AyeBIOS (आईबायोस / A Y E V I O S) is the firmware bias: SeaBIOS × गुरु
 * hosted here. 16-bit ROM binary is not claimed — POST is this host.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PANINI_X86 = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const FDD_BYTES = 1474560; // 80×2×18×512
  const SECTOR = 512;
  const CPT = 18;
  const HEADS = 2;
  const CYL = 80;
  const CF = 1, PF = 4, AF = 16, ZF = 64, SF = 128, TF = 256, IF = 512, DF = 1024, OF = 2048;

  const REGS16 = { ax: 0, cx: 1, dx: 2, bx: 3, sp: 4, bp: 5, si: 6, di: 7 };
  const REGS8 = { al: 0, cl: 1, dl: 2, bl: 3, ah: 4, ch: 5, dh: 6, bh: 7 };
  const SREG = { es: 0, cs: 1, ss: 2, ds: 3 };

  function u16(n) { return n & 0xffff; }
  function s8(n) { n &= 0xff; return n & 0x80 ? n - 256 : n; }
  function s16(n) { n &= 0xffff; return n & 0x8000 ? n - 65536 : n; }
  function phys(seg, off) { return ((seg & 0xffff) << 4) + (off & 0xffff) & 0xfffff; }

  function createFloppy() {
    const img = new Uint8Array(FDD_BYTES);
    return img;
  }

  function chsToLba(c, h, s) {
    return (c * HEADS + h) * CPT + (s - 1);
  }

  /* ---------- 8086 machine ---------- */
  function createMachine(opts) {
    opts = opts || {};
    const mem = new Uint8Array(1024 * 1024);
    const m = {
      mem,
      ax: 0, bx: 0, cx: 0, dx: 0, si: 0, di: 0, bp: 0, sp: 0xfffe,
      cs: 0, ds: 0, es: 0, ss: 0, ip: 0, flags: IF,
      halted: false,
      waiting: null,
      steps: 0,
      mode: 3,
      cursor: { r: 0, c: 0 },
      keys: [],
      floppy: opts.floppy || createFloppy(),
      vgaPixels: new Uint8Array(320 * 200),
      log: [],
      ayebios: {
        banner: [
          "आईबायोस    A Y E V I O S",
          "SeaBIOS × गुरु · PANINI firmware bias",
          "POST  640K आधार स्मृति  ok",
          "FDD0  1.44MB  80/2/18",
          "INT 10h 13h 16h 19h  स्थापित",
          "boot  0000:7C00  (floppy sector 0)",
        ],
        vendor: "AYEBIOS",
      },
      lastInt: 0,
    };
    return m;
  }

  function rb(m, addr) { return m.mem[addr & 0xfffff]; }
  function rw(m, addr) {
    addr &= 0xfffff;
    return m.mem[addr] | (m.mem[(addr + 1) & 0xfffff] << 8);
  }
  function wb(m, addr, v) { m.mem[addr & 0xfffff] = v & 0xff; }
  function ww(m, addr, v) {
    addr &= 0xfffff;
    m.mem[addr] = v & 0xff;
    m.mem[(addr + 1) & 0xfffff] = (v >> 8) & 0xff;
  }
  function fetchb(m) {
    const v = rb(m, phys(m.cs, m.ip));
    m.ip = u16(m.ip + 1);
    return v;
  }
  function fetchw(m) {
    const lo = fetchb(m);
    return lo | (fetchb(m) << 8);
  }

  function getR16(m, i) {
    return [m.ax, m.cx, m.dx, m.bx, m.sp, m.bp, m.si, m.di][i] & 0xffff;
  }
  function setR16(m, i, v) {
    v = u16(v);
    if (i === 0) m.ax = v;
    else if (i === 1) m.cx = v;
    else if (i === 2) m.dx = v;
    else if (i === 3) m.bx = v;
    else if (i === 4) m.sp = v;
    else if (i === 5) m.bp = v;
    else if (i === 6) m.si = v;
    else m.di = v;
  }
  function getR8(m, i) {
    if (i < 4) return getR16(m, i) & 0xff;
    return (getR16(m, i - 4) >> 8) & 0xff;
  }
  function setR8(m, i, v) {
    v &= 0xff;
    if (i < 4) setR16(m, i, (getR16(m, i) & 0xff00) | v);
    else setR16(m, i - 4, (getR16(m, i - 4) & 0x00ff) | (v << 8));
  }
  function getSreg(m, i) { return [m.es, m.cs, m.ss, m.ds][i] & 0xffff; }
  function setSreg(m, i, v) {
    v = u16(v);
    if (i === 0) m.es = v;
    else if (i === 1) m.cs = v;
    else if (i === 2) m.ss = v;
    else m.ds = v;
  }

  function push(m, v) {
    m.sp = u16(m.sp - 2);
    ww(m, phys(m.ss, m.sp), v);
  }
  function pop(m) {
    const v = rw(m, phys(m.ss, m.sp));
    m.sp = u16(m.sp + 2);
    return v;
  }

  function setZF(m, v, bits) {
    const mask = bits === 8 ? 0xff : 0xffff;
    if ((v & mask) === 0) m.flags |= ZF; else m.flags &= ~ZF;
    if (v & (bits === 8 ? 0x80 : 0x8000)) m.flags |= SF; else m.flags &= ~SF;
    let n = v & mask, c = 0;
    while (n) { c ^= n & 1; n >>= 1; }
    if (c === 0) m.flags |= PF; else m.flags &= ~PF;
  }
  function setCF(m, c) { if (c) m.flags |= CF; else m.flags &= ~CF; }
  function setOF(m, o) { if (o) m.flags |= OF; else m.flags &= ~OF; }

  function alu(m, op, a, b, bits) {
    const mask = bits === 8 ? 0xff : 0xffff;
    const sign = bits === 8 ? 0x80 : 0x8000;
    a &= mask; b &= mask;
    let r = 0, cf = 0, of = 0;
    if (op === "add" || op === "adc") {
      if (op === "adc" && (m.flags & CF)) b = (b + 1) & mask;
      r = a + b;
      cf = r > mask;
      of = ((a ^ r) & (b ^ r) & sign) !== 0;
      r &= mask;
    } else if (op === "sub" || op === "sbb" || op === "cmp") {
      if (op === "sbb" && (m.flags & CF)) b = (b + 1) & mask;
      r = a - b;
      cf = r < 0;
      of = ((a ^ b) & (a ^ r) & sign) !== 0;
      r &= mask;
    } else if (op === "and" || op === "test") {
      r = a & b; cf = 0; of = 0;
    } else if (op === "or") {
      r = a | b; cf = 0; of = 0;
    } else if (op === "xor") {
      r = a ^ b; cf = 0; of = 0;
    }
    setZF(m, r, bits);
    setCF(m, cf);
    setOF(m, of);
    return r;
  }

  function ea(m, modrm, prefixSeg) {
    const mod = (modrm >> 6) & 3;
    const rm = modrm & 7;
    if (mod === 3) return { kind: "reg", rm };
    let disp = 0;
    if (mod === 1) disp = s8(fetchb(m));
    else if (mod === 2) disp = s16(fetchw(m));
    else if (mod === 0 && rm === 6) {
      const off = fetchw(m);
      const seg = prefixSeg != null ? prefixSeg : m.ds;
      return { kind: "mem", addr: phys(seg, off) };
    }
    let off = 0, seg = m.ds;
    switch (rm) {
      case 0: off = m.bx + m.si; break;
      case 1: off = m.bx + m.di; break;
      case 2: off = m.bp + m.si; seg = m.ss; break;
      case 3: off = m.bp + m.di; seg = m.ss; break;
      case 4: off = m.si; break;
      case 5: off = m.di; break;
      case 6: off = m.bp; seg = m.ss; break;
      case 7: off = m.bx; break;
    }
    if (prefixSeg != null) seg = prefixSeg;
    return { kind: "mem", addr: phys(seg, u16(off + disp)) };
  }

  function readEA(m, e, w) {
    if (e.kind === "reg") return w ? getR16(m, e.rm) : getR8(m, e.rm);
    return w ? rw(m, e.addr) : rb(m, e.addr);
  }
  function writeEA(m, e, v, w) {
    if (e.kind === "reg") {
      if (w) setR16(m, e.rm, v); else setR8(m, e.rm, v);
    } else if (w) ww(m, e.addr, v); else wb(m, e.addr, v);
  }

  /* ---------- VGA text / pixels ---------- */
  function textAddr(r, c) { return 0xb8000 + (r * 80 + c) * 2; }
  function putChar(m, ch, attr) {
    if (ch === 13) { m.cursor.c = 0; return; }
    if (ch === 10) {
      m.cursor.r = Math.min(24, m.cursor.r + 1);
      m.cursor.c = 0;
      return;
    }
    if (ch === 8) { m.cursor.c = Math.max(0, m.cursor.c - 1); return; }
    const a = textAddr(m.cursor.r, m.cursor.c);
    wb(m, a, ch & 0xff);
    wb(m, a + 1, attr == null ? 0x07 : attr);
    m.cursor.c++;
    if (m.cursor.c >= 80) { m.cursor.c = 0; m.cursor.r = Math.min(24, m.cursor.r + 1); }
  }
  function writeString(m, s, attr) {
    for (let i = 0; i < s.length; i++) putChar(m, s.charCodeAt(i), attr);
  }
  function dumpText(m) {
    const rows = [];
    for (let r = 0; r < 25; r++) {
      let s = "";
      for (let c = 0; c < 80; c++) {
        const ch = rb(m, textAddr(r, c));
        s += ch >= 32 && ch < 127 ? String.fromCharCode(ch) : (ch ? "." : " ");
      }
      rows.push(s.replace(/\s+$/, ""));
    }
    return rows.join("\n").replace(/\n+$/, "");
  }
  function clearText(m, attr) {
    attr = attr == null ? 0x07 : attr;
    for (let i = 0; i < 80 * 25; i++) {
      wb(m, 0xb8000 + i * 2, 0x20);
      wb(m, 0xb8000 + i * 2 + 1, attr);
    }
    m.cursor.r = 0; m.cursor.c = 0;
  }
  function setMode(m, mode) {
    m.mode = mode & 0xff;
    if (m.mode === 3 || m.mode === 0 || m.mode === 2) {
      m.mode = 3;
      clearText(m, 0x07);
    } else if (m.mode === 0x13) {
      m.vgaPixels.fill(0);
      for (let i = 0; i < 320 * 200; i++) wb(m, 0xa0000 + i, 0);
    }
  }
  function dumpPixels(m) {
    const out = new Uint8Array(320 * 200);
    for (let i = 0; i < out.length; i++) out[i] = rb(m, 0xa0000 + i);
    m.vgaPixels = out;
    return out;
  }

  /* ---------- AyeBIOS INT handlers ---------- */
  function int10(m) {
    const ah = (m.ax >> 8) & 0xff;
    const al = m.ax & 0xff;
    if (ah === 0x00) setMode(m, al);
    else if (ah === 0x0e) putChar(m, al, (m.bx & 0xff) || 0x07);
    else if (ah === 0x02) {
      m.cursor.r = (m.dx >> 8) & 0xff;
      m.cursor.c = m.dx & 0xff;
    } else if (ah === 0x03) {
      m.dx = (m.cursor.r << 8) | m.cursor.c;
      m.cx = 0x0607;
    } else if (ah === 0x09) {
      const n = m.cx || 1;
      const attr = m.bx & 0xff;
      for (let i = 0; i < n; i++) putChar(m, al, attr);
    } else if (ah === 0x0c) {
      const x = m.cx & 0xffff, y = m.dx & 0xffff;
      if (x < 320 && y < 200) wb(m, 0xa0000 + y * 320 + x, al);
    } else if (ah === 0x0f) {
      m.ax = (80 << 8) | (m.mode & 0xff);
      m.bx = m.bx & 0xff;
    } else if (ah === 0x13) {
      const n = m.cx & 0xffff;
      let off = m.bp, seg = m.es;
      m.cursor.r = (m.dx >> 8) & 0xff;
      m.cursor.c = m.dx & 0xff;
      for (let i = 0; i < n; i++) putChar(m, rb(m, phys(seg, u16(off + i))), 0x07);
    }
  }
  function int13(m) {
    const ah = (m.ax >> 8) & 0xff;
    const al = m.ax & 0xff;
    const c = (m.cx >> 8) & 0xff;
    const s = m.cx & 0x3f;
    const h = (m.dx >> 8) & 0xff;
    const dl = m.dx & 0xff;
    if (ah === 0x00) { m.ax = 0; m.flags &= ~CF; return; }
    if (ah === 0x08) {
      m.ax = 0;
      m.bx = 4;
      m.cx = ((CYL - 1) << 8) | CPT;
      m.dx = ((HEADS - 1) << 8) | 1;
      m.flags &= ~CF;
      return;
    }
    if (ah === 0x02 || ah === 0x03) {
      if (dl !== 0) { m.ax = 0x0100; m.flags |= CF; return; }
      const lba = chsToLba(c, h, s);
      const n = al || 1;
      let addr = phys(m.es, m.bx);
      for (let i = 0; i < n * SECTOR; i++) {
        const fi = lba * SECTOR + i;
        if (fi < 0 || fi >= m.floppy.length) { m.ax = 0x0400; m.flags |= CF; return; }
        if (ah === 0x02) wb(m, addr + i, m.floppy[fi]);
        else m.floppy[fi] = rb(m, addr + i);
      }
      m.ax = n;
      m.flags &= ~CF;
      return;
    }
    m.ax = 0x0100; m.flags |= CF;
  }
  function int16(m) {
    const ah = (m.ax >> 8) & 0xff;
    if (ah === 0x00) {
      if (!m.keys.length) { m.waiting = "key"; m.ip = u16(m.ip - 2); return; }
      const k = m.keys.shift();
      m.ax = ((k.scan || k.ch) << 8) | (k.ch & 0xff);
    } else if (ah === 0x01) {
      if (!m.keys.length) { m.flags |= ZF; m.ax = 0; }
      else { m.flags &= ~ZF; const k = m.keys[0]; m.ax = ((k.scan || k.ch) << 8) | (k.ch & 0xff); }
    }
  }
  function int19(m) { boot(m, m.floppy, { skipPost: true }); }
  function int1a(m) {
    const ah = (m.ax >> 8) & 0xff;
    if (ah === 0x00) { m.cx = 0; m.dx = (m.steps & 0xffff); m.ax = 0; }
  }

  function doInt(m, n) {
    m.lastInt = n;
    if (n === 0x10) int10(m);
    else if (n === 0x13) int13(m);
    else if (n === 0x16) int16(m);
    else if (n === 0x19) int19(m);
    else if (n === 0x1a) int1a(m);
    else {
      push(m, m.flags);
      push(m, m.cs);
      push(m, m.ip);
      m.flags &= ~IF;
      m.ip = rw(m, n * 4);
      m.cs = rw(m, n * 4 + 2);
    }
  }

  function pushKey(m, ch, scan) {
    m.keys.push({ ch: typeof ch === "string" ? ch.charCodeAt(0) : ch, scan: scan || 0 });
    if (m.waiting === "key") m.waiting = null;
  }

  /* ---------- decoder ---------- */
  function step(m) {
    if (m.halted || m.waiting) return false;
    m.steps++;
    let prefixSeg = null;
    let rep = 0;
    for (let g = 0; g < 4; g++) {
      const p = rb(m, phys(m.cs, m.ip));
      if (p === 0x26) { prefixSeg = m.es; m.ip = u16(m.ip + 1); }
      else if (p === 0x2e) { prefixSeg = m.cs; m.ip = u16(m.ip + 1); }
      else if (p === 0x36) { prefixSeg = m.ss; m.ip = u16(m.ip + 1); }
      else if (p === 0x3e) { prefixSeg = m.ds; m.ip = u16(m.ip + 1); }
      else if (p === 0xf3) { rep = 1; m.ip = u16(m.ip + 1); }
      else if (p === 0xf2) { rep = 2; m.ip = u16(m.ip + 1); }
      else break;
    }
    const op = fetchb(m);
    const w = op & 1;
    const d = (op >> 1) & 1;

    function jcc(cond) {
      const rel = s8(fetchb(m));
      if (cond) m.ip = u16(m.ip + rel);
    }
    const z = !!(m.flags & ZF), s = !!(m.flags & SF), c = !!(m.flags & CF), o = !!(m.flags & OF);

    if (op === 0x90) return true;
    if (op === 0xf4) { m.halted = true; return false; }
    if (op === 0xfa) { m.flags &= ~IF; return true; }
    if (op === 0xfb) { m.flags |= IF; return true; }
    if (op === 0xfc) { m.flags &= ~DF; return true; }
    if (op === 0xfd) { m.flags |= DF; return true; }
    if (op === 0xf8) { m.flags &= ~CF; return true; }
    if (op === 0xf9) { m.flags |= CF; return true; }
    if (op === 0xf5) { m.flags ^= CF; return true; }
    if (op === 0xc3) { m.ip = pop(m); return true; }
    if (op === 0xcb) { m.ip = pop(m); m.cs = pop(m); return true; }
    if (op === 0xcf) { m.ip = pop(m); m.cs = pop(m); m.flags = pop(m); return true; }
    if (op === 0xcd) { doInt(m, fetchb(m)); return true; }
    if (op === 0xcc) { doInt(m, 3); return true; }
    if (op === 0xe8) { const rel = s16(fetchw(m)); push(m, m.ip); m.ip = u16(m.ip + rel); return true; }
    if (op === 0xe9) { const rel = s16(fetchw(m)); m.ip = u16(m.ip + rel); return true; }
    if (op === 0xeb) { const rel = s8(fetchb(m)); m.ip = u16(m.ip + rel); return true; }
    if (op === 0xe2) { m.cx = u16(m.cx - 1); const rel = s8(fetchb(m)); if (m.cx) m.ip = u16(m.ip + rel); return true; }
    if (op === 0xe0) { m.cx = u16(m.cx - 1); const rel = s8(fetchb(m)); if (m.cx && !z) m.ip = u16(m.ip + rel); return true; }
    if (op === 0xe1) { m.cx = u16(m.cx - 1); const rel = s8(fetchb(m)); if (m.cx && z) m.ip = u16(m.ip + rel); return true; }
    if (op === 0xe3) { const rel = s8(fetchb(m)); if (m.cx === 0) m.ip = u16(m.ip + rel); return true; }
    if (op === 0x9c) { push(m, m.flags); return true; }
    if (op === 0x9d) { m.flags = pop(m); return true; }
    if (op === 0x9e) { m.flags = (m.flags & 0xff00) | (m.ax & 0xff); return true; }
    if (op === 0x9f) { m.ax = (m.ax & 0xff00) | (m.flags & 0xff); return true; }
    if (op === 0x98) { m.ax = (m.ax & 0x80) ? (m.ax | 0xff00) : (m.ax & 0x00ff); return true; }
    if (op === 0x99) { m.dx = (m.ax & 0x8000) ? 0xffff : 0; return true; }

    if (op >= 0x40 && op <= 0x47) { const i = op - 0x40; const v = u16(getR16(m, i) + 1); setR16(m, i, v); setZF(m, v, 16); return true; }
    if (op >= 0x48 && op <= 0x4f) { const i = op - 0x48; const v = u16(getR16(m, i) - 1); setR16(m, i, v); setZF(m, v, 16); return true; }
    if (op >= 0x50 && op <= 0x57) { push(m, getR16(m, op - 0x50)); return true; }
    if (op >= 0x58 && op <= 0x5f) { setR16(m, op - 0x58, pop(m)); return true; }
    if (op >= 0xb0 && op <= 0xb7) { setR8(m, op - 0xb0, fetchb(m)); return true; }
    if (op >= 0xb8 && op <= 0xbf) { setR16(m, op - 0xb8, fetchw(m)); return true; }
    if (op >= 0x90 && op <= 0x97) { const t = m.ax; m.ax = getR16(m, op - 0x90); setR16(m, op - 0x90, t); return true; }

    if (op === 0x70) { jcc(o); return true; }
    if (op === 0x71) { jcc(!o); return true; }
    if (op === 0x72) { jcc(c); return true; }
    if (op === 0x73) { jcc(!c); return true; }
    if (op === 0x74) { jcc(z); return true; }
    if (op === 0x75) { jcc(!z); return true; }
    if (op === 0x76) { jcc(c || z); return true; }
    if (op === 0x77) { jcc(!c && !z); return true; }
    if (op === 0x78) { jcc(s); return true; }
    if (op === 0x79) { jcc(!s); return true; }
    if (op === 0x7c) { jcc(s !== o); return true; }
    if (op === 0x7d) { jcc(s === o); return true; }
    if (op === 0x7e) { jcc(z || s !== o); return true; }
    if (op === 0x7f) { jcc(!z && s === o); return true; }

    if (op === 0xa0) { m.ax = (m.ax & 0xff00) | rb(m, phys(prefixSeg != null ? prefixSeg : m.ds, fetchw(m))); return true; }
    if (op === 0xa1) { m.ax = rw(m, phys(prefixSeg != null ? prefixSeg : m.ds, fetchw(m))); return true; }
    if (op === 0xa2) { wb(m, phys(prefixSeg != null ? prefixSeg : m.ds, fetchw(m)), m.ax); return true; }
    if (op === 0xa3) { ww(m, phys(prefixSeg != null ? prefixSeg : m.ds, fetchw(m)), m.ax); return true; }
    if (op === 0xa8) { alu(m, "test", m.ax & 0xff, fetchb(m), 8); return true; }
    if (op === 0xa9) { alu(m, "test", m.ax, fetchw(m), 16); return true; }

    if (op === 0xac) { m.ax = (m.ax & 0xff00) | rb(m, phys(prefixSeg != null ? prefixSeg : m.ds, m.si)); m.si = u16(m.si + ((m.flags & DF) ? -1 : 1)); return true; }
    if (op === 0xad) { m.ax = rw(m, phys(prefixSeg != null ? prefixSeg : m.ds, m.si)); m.si = u16(m.si + ((m.flags & DF) ? -2 : 2)); return true; }
    if (op === 0xaa || op === 0xab) {
      const ww_ = op === 0xab;
      const delta = ww_ ? 2 : 1;
      const dir = (m.flags & DF) ? -delta : delta;
      const n = rep ? (m.cx || 1) : 1;
      for (let i = 0; i < n; i++) {
        if (ww_) ww(m, phys(m.es, m.di), m.ax); else wb(m, phys(m.es, m.di), m.ax);
        m.di = u16(m.di + dir);
        if (rep) m.cx = u16(m.cx - 1);
      }
      return true;
    }
    if (op === 0xa4 || op === 0xa5) {
      const ww_ = op === 0xa5;
      const delta = ww_ ? 2 : 1;
      const dir = (m.flags & DF) ? -delta : delta;
      const n = rep ? (m.cx || 1) : 1;
      for (let i = 0; i < n; i++) {
        const v = ww_ ? rw(m, phys(prefixSeg != null ? prefixSeg : m.ds, m.si)) : rb(m, phys(prefixSeg != null ? prefixSeg : m.ds, m.si));
        if (ww_) ww(m, phys(m.es, m.di), v); else wb(m, phys(m.es, m.di), v);
        m.si = u16(m.si + dir); m.di = u16(m.di + dir);
        if (rep) m.cx = u16(m.cx - 1);
      }
      return true;
    }
    if (op === 0xaa || op === 0xab) return true;

    if (op === 0xc6 || op === 0xc7) {
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const v = (op === 0xc6) ? fetchb(m) : fetchw(m);
      writeEA(m, e, v, op === 0xc7);
      return true;
    }

    if ((op & 0xfc) === 0x88) {
      const modrm = fetchb(m);
      const wop = op & 1;
      const dop = (op >> 1) & 1;
      const e = ea(m, modrm, prefixSeg);
      const reg = (modrm >> 3) & 7;
      if (dop) {
        const v = readEA(m, e, wop);
        if (wop) setR16(m, reg, v); else setR8(m, reg, v);
      } else {
        const v = wop ? getR16(m, reg) : getR8(m, reg);
        writeEA(m, e, v, wop);
      }
      return true;
    }
    if (op === 0x8c) {
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      writeEA(m, e, getSreg(m, (modrm >> 3) & 7), 1);
      return true;
    }
    if (op === 0x8e) {
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      setSreg(m, (modrm >> 3) & 7, readEA(m, e, 1));
      return true;
    }
    if (op === 0x8d) {
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const reg = (modrm >> 3) & 7;
      setR16(m, reg, e.addr & 0xffff);
      return true;
    }
    if (op === 0x8f) {
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      writeEA(m, e, pop(m), 1);
      return true;
    }

    if (op === 0x04 || op === 0x05) { const bits = op === 0x04 ? 8 : 16; const b = bits === 8 ? fetchb(m) : fetchw(m); const r = alu(m, "add", m.ax, b, bits); if (bits === 8) setR8(m, 0, r); else m.ax = r; return true; }
    if (op === 0x0c || op === 0x0d) { const bits = op === 0x0c ? 8 : 16; const b = bits === 8 ? fetchb(m) : fetchw(m); const r = alu(m, "or", m.ax, b, bits); if (bits === 8) setR8(m, 0, r); else m.ax = r; return true; }
    if (op === 0x24 || op === 0x25) { const bits = op === 0x24 ? 8 : 16; const b = bits === 8 ? fetchb(m) : fetchw(m); const r = alu(m, "and", m.ax, b, bits); if (bits === 8) setR8(m, 0, r); else m.ax = r; return true; }
    if (op === 0x2c || op === 0x2d) { const bits = op === 0x2c ? 8 : 16; const b = bits === 8 ? fetchb(m) : fetchw(m); const r = alu(m, "sub", m.ax, b, bits); if (bits === 8) setR8(m, 0, r); else m.ax = r; return true; }
    if (op === 0x34 || op === 0x35) { const bits = op === 0x34 ? 8 : 16; const b = bits === 8 ? fetchb(m) : fetchw(m); const r = alu(m, "xor", m.ax, b, bits); if (bits === 8) setR8(m, 0, r); else m.ax = r; return true; }
    if (op === 0x3c || op === 0x3d) { const bits = op === 0x3c ? 8 : 16; const b = bits === 8 ? fetchb(m) : fetchw(m); alu(m, "cmp", m.ax, b, bits); return true; }

    if ((op & 0xc4) === 0x00 && (op & 6) !== 6 && op < 0x40) {
      const ops = ["add", "or", "adc", "sbb", "and", "sub", "xor", "cmp"];
      const group = (op >> 3) & 7;
      const wop = op & 1, dop = (op >> 1) & 1;
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const reg = (modrm >> 3) & 7;
      const bits = wop ? 16 : 8;
      const rv = wop ? getR16(m, reg) : getR8(m, reg);
      const ev = readEA(m, e, wop);
      if (dop) {
        const r = alu(m, ops[group], rv, ev, bits);
        if (ops[group] !== "cmp") { if (wop) setR16(m, reg, r); else setR8(m, reg, r); }
      } else {
        const r = alu(m, ops[group], ev, rv, bits);
        if (ops[group] !== "cmp") writeEA(m, e, r, wop);
      }
      return true;
    }

    if (op >= 0x80 && op <= 0x83) {
      const ops = ["add", "or", "adc", "sbb", "and", "sub", "xor", "cmp"];
      const wop = op & 1;
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const group = (modrm >> 3) & 7;
      let imm;
      if (op === 0x81) imm = fetchw(m);
      else if (op === 0x83) imm = s8(fetchb(m)) & 0xffff;
      else imm = fetchb(m);
      const bits = wop ? 16 : 8;
      const ev = readEA(m, e, wop);
      const r = alu(m, ops[group], ev, imm, bits);
      if (ops[group] !== "cmp") writeEA(m, e, r, wop);
      return true;
    }
    if (op === 0x84 || op === 0x85) {
      const wop = op & 1;
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const reg = (modrm >> 3) & 7;
      alu(m, "test", readEA(m, e, wop), wop ? getR16(m, reg) : getR8(m, reg), wop ? 16 : 8);
      return true;
    }
    if (op === 0x86 || op === 0x87) {
      const wop = op & 1;
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const reg = (modrm >> 3) & 7;
      const ev = readEA(m, e, wop);
      const rv = wop ? getR16(m, reg) : getR8(m, reg);
      writeEA(m, e, rv, wop);
      if (wop) setR16(m, reg, ev); else setR8(m, reg, ev);
      return true;
    }
    if (op === 0xfe || op === 0xff) {
      const wop = op & 1;
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const g = (modrm >> 3) & 7;
      if (g === 0) { const v = u16(readEA(m, e, wop) + 1); writeEA(m, e, v, wop); setZF(m, v, wop ? 16 : 8); }
      else if (g === 1) { const v = u16(readEA(m, e, wop) - 1); writeEA(m, e, v, wop); setZF(m, v, wop ? 16 : 8); }
      else if (g === 2) { push(m, m.ip); m.ip = readEA(m, e, 1); }
      else if (g === 4) { m.ip = readEA(m, e, 1); }
      else if (g === 6) { push(m, readEA(m, e, 1)); }
      return true;
    }
    if (op === 0xf6 || op === 0xf7) {
      const wop = op & 1;
      const modrm = fetchb(m);
      const e = ea(m, modrm, prefixSeg);
      const g = (modrm >> 3) & 7;
      const bits = wop ? 16 : 8;
      const ev = readEA(m, e, wop);
      if (g === 0) { const imm = wop ? fetchw(m) : fetchb(m); alu(m, "test", ev, imm, bits); }
      else if (g === 2) writeEA(m, e, (~ev) & (wop ? 0xffff : 0xff), wop);
      else if (g === 3) { const r = alu(m, "sub", 0, ev, bits); writeEA(m, e, r, wop); }
      else if (g === 4) {
        if (wop) { const r = (m.ax * ev) >>> 0; m.ax = r & 0xffff; m.dx = (r >>> 16) & 0xffff; setCF(m, m.dx !== 0); }
        else { const r = (m.ax & 0xff) * ev; m.ax = r & 0xffff; setCF(m, (r & 0xff00) !== 0); }
      }
      return true;
    }
    m.log.push("unknown opcode 0x" + op.toString(16) + " at " + m.cs.toString(16) + ":" + u16(m.ip - 1).toString(16));
    return true;
  }

  function run(m, maxSteps) {
    maxSteps = maxSteps || 100000;
    let n = 0;
    while (n < maxSteps && !m.halted && !m.waiting) {
      if (!step(m)) break;
      n++;
    }
    return { steps: n, halted: m.halted, waiting: m.waiting, text: dumpText(m), mode: m.mode };
  }

  /* ---------- assembler ---------- */
  function tokenizeAsm(src) {
    const lines = String(src).split(/\r?\n/);
    const out = [];
    for (let li = 0; li < lines.length; li++) {
      let s = lines[li].replace(/;.*$/, "").trim();
      if (!s) continue;
      const m = s.match(/^([A-Za-z_.][\w.]*)\s*:\s*(.*)$/);
      if (m) {
        out.push({ kind: "label", name: m[1].toLowerCase(), line: li + 1 });
        s = m[2].trim();
        if (!s) continue;
      }
      out.push({ kind: "stmt", text: s, line: li + 1 });
    }
    return out;
  }

  function parseImm(tok, labels, $, relaxed) {
    tok = String(tok).trim();
    while (tok.charAt(0) === "(" && tok.charAt(tok.length - 1) === ")") tok = tok.slice(1, -1).trim();
    if (tok === "$") return $;
    if (tok === "$$") return labels.$$ || 0;
    if (/^0x[0-9a-f]+$/i.test(tok) || /^[0-9a-f]+h$/i.test(tok)) {
      return parseInt(tok.replace(/h$/i, "").replace(/^0x/i, ""), 16);
    }
    if (/^[0-9]+$/.test(tok)) return parseInt(tok, 10);
    if (tok.charAt(0) === "'" && tok.length >= 3) return tok.charCodeAt(1);
    if (labels && tok.toLowerCase() in labels) return labels[tok.toLowerCase()];
    const m = tok.match(/^(.+?)\s*-\s*(.+)$/);
    if (m) return parseImm(m[1], labels, $, relaxed) - parseImm(m[2], labels, $, relaxed);
    const p = tok.match(/^(.+?)\s*\+\s*(.+)$/);
    if (p) return parseImm(p[1], labels, $, relaxed) + parseImm(p[2], labels, $, relaxed);
    if (relaxed) return 0;
    throw new Error("imm " + tok);
  }

  function parseDb(rest, labels, $, relaxed) {
    const bytes = [];
    let i = 0;
    while (i < rest.length) {
      while (rest[i] === " " || rest[i] === ",") { i++; }
      if (i >= rest.length) break;
      if (rest[i] === '"' || rest[i] === "'") {
        const q = rest[i++];
        let s = "";
        while (i < rest.length && rest[i] !== q) s += rest[i++];
        i++;
        for (let k = 0; k < s.length; k++) bytes.push(s.charCodeAt(k) & 0xff);
      } else {
        let j = i;
        while (j < rest.length && rest[j] !== ",") j++;
        bytes.push(parseImm(rest.slice(i, j), labels, $, relaxed) & 0xff);
        i = j;
      }
    }
    return bytes;
  }

  const R16N = ["ax", "cx", "dx", "bx", "sp", "bp", "si", "di"];
  const R8N = ["al", "cl", "dl", "bl", "ah", "ch", "dh", "bh"];

  function assemble(src, opt) {
    opt = opt || {};
    const org = opt.org != null ? opt.org : 0x7c00;
    const stmts = tokenizeAsm(src);
    const labels = { $$: org };
    function pass(write) {
      const buf = [];
      let pc = org;
      labels.$$ = org;
      const relx = !write;
      function emit(b) { if (write) buf.push(b & 0xff); pc++; }
      function emitw(w) { emit(w); emit(w >> 8); }
      function imm(tok) { return parseImm(tok, labels, pc, relx); }
      for (const st of stmts) {
        if (st.kind === "label") { labels[st.name] = pc; continue; }
        const t = st.text;
        const sp = t.match(/^(\S+)\s*(.*)$/);
        const mnem = sp[1].toLowerCase();
        const rest = sp[2] || "";
        const ops = rest ? rest.split(",").map((x) => x.trim()) : [];
        try {
          if (mnem === "org") { pc = imm(ops[0]); continue; }
          if (mnem === "times") {
            const parts = t.replace(/^times\s+/i, "").match(/^(.+?)\s+(db|dw)\s+(.+)$/i);
            const n = imm(parts[1]);
            const v = imm(parts[3]);
            for (let i = 0; i < n; i++) {
              if (/dw/i.test(parts[2])) emitw(v); else emit(v);
            }
            continue;
          }
          if (mnem === "db") { for (const b of parseDb(rest, labels, pc, relx)) emit(b); continue; }
          if (mnem === "dw") {
            const parts = rest.split(",");
            for (const p of parts) emitw(imm(p.trim()));
            continue;
          }
          if (mnem === "nop") { emit(0x90); continue; }
          if (mnem === "hlt") { emit(0xf4); continue; }
          if (mnem === "cli") { emit(0xfa); continue; }
          if (mnem === "sti") { emit(0xfb); continue; }
          if (mnem === "cld") { emit(0xfc); continue; }
          if (mnem === "std") { emit(0xfd); continue; }
          if (mnem === "clc") { emit(0xf8); continue; }
          if (mnem === "stc") { emit(0xf9); continue; }
          if (mnem === "ret") { emit(0xc3); continue; }
          if (mnem === "iret") { emit(0xcf); continue; }
          if (mnem === "lodsb") { emit(0xac); continue; }
          if (mnem === "lodsw") { emit(0xad); continue; }
          if (mnem === "stosb") { emit(0xaa); continue; }
          if (mnem === "stosw") { emit(0xab); continue; }
          if (mnem === "movsb") { emit(0xa4); continue; }
          if (mnem === "rep" && /^stosb/i.test(rest)) { emit(0xf3); emit(0xaa); continue; }
          if (mnem === "rep" && /^stosw/i.test(rest)) { emit(0xf3); emit(0xab); continue; }
          if (mnem === "int") { emit(0xcd); emit(imm(ops[0])); continue; }
          if (mnem === "push" && R16N.indexOf(ops[0].toLowerCase()) >= 0) { emit(0x50 + R16N.indexOf(ops[0].toLowerCase())); continue; }
          if (mnem === "pop" && R16N.indexOf(ops[0].toLowerCase()) >= 0) { emit(0x58 + R16N.indexOf(ops[0].toLowerCase())); continue; }
          if (mnem === "inc" && R16N.indexOf(ops[0].toLowerCase()) >= 0) { emit(0x40 + R16N.indexOf(ops[0].toLowerCase())); continue; }
          if (mnem === "dec" && R16N.indexOf(ops[0].toLowerCase()) >= 0) { emit(0x48 + R16N.indexOf(ops[0].toLowerCase())); continue; }
          if (mnem === "pushf") { emit(0x9c); continue; }
          if (mnem === "popf") { emit(0x9d); continue; }

          const JCC = { jo: 0x70, jno: 0x71, jb: 0x72, jc: 0x72, jnae: 0x72, jae: 0x73, jnb: 0x73, jnc: 0x73, je: 0x74, jz: 0x74, jne: 0x75, jnz: 0x75, jbe: 0x76, jna: 0x76, ja: 0x77, jnbe: 0x77, js: 0x78, jns: 0x79, jl: 0x7c, jnge: 0x7c, jge: 0x7d, jnl: 0x7d, jle: 0x7e, jng: 0x7e, jg: 0x7f, jnle: 0x7f };
          if (mnem in JCC) {
            emit(JCC[mnem]);
            const tgt = imm(ops[0]);
            emit(s8(tgt - (pc + 1)) & 0xff);
            continue;
          }
          if (mnem === "jmp") {
            emit(0xeb);
            const tgt = imm(ops[0]);
            emit((tgt - (pc + 1)) & 0xff);
            continue;
          }
          if (mnem === "loop") { emit(0xe2); emit(s8(imm(ops[0]) - (pc + 1)) & 0xff); continue; }
          if (mnem === "call") {
            emit(0xe8);
            const tgt = imm(ops[0]);
            emitw(tgt - (pc + 2));
            continue;
          }

          const ALU2 = { add: [0x00, 0x01], or: [0x08, 0x09], adc: [0x10, 0x11], sbb: [0x18, 0x19], and: [0x20, 0x21], sub: [0x28, 0x29], xor: [0x30, 0x31], cmp: [0x38, 0x39] };
          if (mnem in ALU2 && ops.length === 2) {
            const a = ops[0].toLowerCase(), b = ops[1].toLowerCase();
            if (R8N.indexOf(a) >= 0 && R8N.indexOf(b) >= 0) {
              emit(ALU2[mnem][0]); emit(0xc0 | (R8N.indexOf(b) << 3) | R8N.indexOf(a));
              continue;
            }
            if (R16N.indexOf(a) >= 0 && R16N.indexOf(b) >= 0) {
              emit(ALU2[mnem][1]); emit(0xc0 | (R16N.indexOf(b) << 3) | R16N.indexOf(a));
              continue;
            }
          }
          if (mnem === "test" && ops.length === 2 && R8N.indexOf(ops[0].toLowerCase()) >= 0 && R8N.indexOf(ops[1].toLowerCase()) >= 0) {
            emit(0x84); emit(0xc0 | (R8N.indexOf(ops[1].toLowerCase()) << 3) | R8N.indexOf(ops[0].toLowerCase()));
            continue;
          }
          if (mnem === "test" && ops.length === 2 && R16N.indexOf(ops[0].toLowerCase()) >= 0 && R16N.indexOf(ops[1].toLowerCase()) >= 0) {
            emit(0x85); emit(0xc0 | (R16N.indexOf(ops[1].toLowerCase()) << 3) | R16N.indexOf(ops[0].toLowerCase()));
            continue;
          }
          if (mnem === "test" && ops[0].toLowerCase() === "al") { emit(0xa8); emit(imm(ops[1])); continue; }
          if (mnem === "test" && ops[0].toLowerCase() === "ax") { emit(0xa9); emitw(imm(ops[1])); continue; }
          if (mnem === "cmp" && ops[0].toLowerCase() === "al") { emit(0x3c); emit(imm(ops[1])); continue; }
          if (mnem === "cmp" && ops[0].toLowerCase() === "ax") { emit(0x3d); emitw(imm(ops[1])); continue; }
          if (mnem === "add" && ops[0].toLowerCase() === "al") { emit(0x04); emit(imm(ops[1])); continue; }
          if (mnem === "add" && ops[0].toLowerCase() === "ax") { emit(0x05); emitw(imm(ops[1])); continue; }

          if (mnem === "mov") {
            const a = ops[0].toLowerCase(), b = ops[1];
            const bl = b.toLowerCase();
            if (a in SREG && R16N.indexOf(bl) >= 0) { emit(0x8e); emit(0xc0 | (SREG[a] << 3) | R16N.indexOf(bl)); continue; }
            if (bl in SREG && R16N.indexOf(a) >= 0) { emit(0x8c); emit(0xc0 | (SREG[bl] << 3) | R16N.indexOf(a)); continue; }
            if (R16N.indexOf(a) >= 0 && R16N.indexOf(bl) >= 0) { emit(0x89); emit(0xc0 | (R16N.indexOf(bl) << 3) | R16N.indexOf(a)); continue; }
            if (R8N.indexOf(a) >= 0 && R8N.indexOf(bl) >= 0) { emit(0x88); emit(0xc0 | (R8N.indexOf(bl) << 3) | R8N.indexOf(a)); continue; }
            if (R8N.indexOf(a) >= 0) { emit(0xb0 + R8N.indexOf(a)); emit(imm(b)); continue; }
            if (R16N.indexOf(a) >= 0) { emit(0xb8 + R16N.indexOf(a)); emitw(imm(b)); continue; }
          }
          throw new Error("unhandled " + t);
        } catch (e) {
          if (!write) continue;
          throw new Error("asm line " + st.line + ": " + e.message);
        }
      }
      return { bytes: buf, pc, size: pc - org };
    }
    pass(false);
    return pass(true);
  }

  const BOOT_ASM = `
org 0x7C00
start:
  cli
  xor ax, ax
  mov ds, ax
  mov es, ax
  mov ss, ax
  mov sp, 0x7C00
  sti
  mov ax, 0x0003
  int 0x10
  mov si, msg
print:
  lodsb
  test al, al
  jz waitk
  mov ah, 0x0E
  mov bx, 0x0007
  int 0x10
  jmp print
waitk:
  xor ah, ah
  int 0x16
  cmp al, 'v'
  je vga13
  cmp al, 't'
  je start
  jmp waitk
vga13:
  mov ax, 0x0013
  int 0x10
  mov ax, 0xA000
  mov es, ax
  xor di, di
  mov cx, 3200
  mov al, 14
  rep stosb
  jmp waitk
msg:
  db "AYEBIOS A Y E V I O S", 13, 10
  db "PANINI SeaBIOS x Guru", 13, 10
  db "POST 640K ok  FDD 1.44M", 13, 10
  db "INT 10 13 16 ready", 13, 10
  db "boot 0000:7C00", 13, 10
  db "[v] VGA 13h  [t] text", 13, 10, 0
  times 510-($-$$) db 0
  dw 0xAA55
`;

  function makeAyeFloppy() {
    const img = createFloppy();
    const { bytes } = assemble(BOOT_ASM, { org: 0x7c00 });
    img.set(bytes, 0);
    const magic = "AYEBIOS";
    for (let i = 0; i < magic.length; i++) img[0x200 + i] = magic.charCodeAt(i);
    return img;
  }

  function ayePost(m) {
    clearText(m, 0x07);
    m.cursor.r = 0; m.cursor.c = 0;
    writeString(m, "AYEBIOS  A Y E V I O S\r\n", 0x0e);
    writeString(m, "SeaBIOS x Guru  PANINI\r\n", 0x07);
    writeString(m, "POST 640K base memory ok\r\n", 0x07);
    writeString(m, "FDD0 1.44MB 80/2/18\r\n", 0x07);
    writeString(m, "INT 10h 13h 16h installed\r\n", 0x07);
    writeString(m, "loading floppy 0000:7C00\r\n", 0x07);
  }

  function boot(m, floppy, opt) {
    opt = opt || {};
    if (floppy) m.floppy = floppy;
    m.halted = false;
    m.waiting = null;
    m.steps = 0;
    m.keys = [];
    m.ax = m.bx = m.cx = m.dx = m.si = m.di = m.bp = 0;
    m.sp = 0x7c00; m.ss = 0; m.ds = 0; m.es = 0; m.cs = 0; m.ip = 0x7c00;
    m.flags = IF;
    setMode(m, 3);
    if (!opt.skipPost) ayePost(m);
    for (let i = 0; i < SECTOR; i++) wb(m, 0x7c00 + i, m.floppy[i]);
    if ((rw(m, 0x7c00 + 510) !== 0xaa55) && !opt.force) {
      writeString(m, "\r\nnot a bootable floppy (no 55AA)\r\n", 0x0c);
      m.halted = true;
      return { ok: false, reason: "no-signature", text: dumpText(m) };
    }
    const r = run(m, opt.maxSteps || 50000);
    r.ok = true;
    r.banner = m.ayebios.banner;
    return r;
  }

  function sectorHex(floppy, n) {
    const off = (n | 0) * SECTOR;
    const slice = floppy.slice(off, off + SECTOR);
    const lines = [];
    for (let i = 0; i < SECTOR; i += 16) {
      let hex = "", asc = "";
      for (let j = 0; j < 16; j++) {
        const b = slice[i + j];
        hex += (b < 16 ? "0" : "") + b.toString(16) + " ";
        asc += b >= 32 && b < 127 ? String.fromCharCode(b) : ".";
      }
      const addr = (off + i).toString(16).padStart(5, "0");
      lines.push(addr + "  " + hex + " " + asc);
    }
    return lines.join("\n");
  }

  function pokeSector(floppy, n, bytes) {
    const off = (n | 0) * SECTOR;
    for (let i = 0; i < SECTOR && i < bytes.length; i++) floppy[off + i] = bytes[i] & 0xff;
  }

  function parseHexDump(text, floppy, n) {
    const bytes = new Uint8Array(SECTOR);
    bytes.fill(0);
    let i = 0;
    const hex = String(text).replace(/[^0-9a-fA-F]/g, "");
    for (let k = 0; k + 1 < hex.length && i < SECTOR; k += 2) {
      bytes[i++] = parseInt(hex.slice(k, k + 2), 16);
    }
    pokeSector(floppy, n, bytes);
    return i;
  }

  return {
    FDD_BYTES, SECTOR, CPT, HEADS, CYL, BOOT_ASM,
    createMachine, createFloppy, assemble, makeAyeFloppy,
    boot, step, run, dumpText, dumpPixels, pushKey, setMode,
    sectorHex, pokeSector, parseHexDump, ayePost, writeString, clearText,
    chsToLba, phys,
  };
});
