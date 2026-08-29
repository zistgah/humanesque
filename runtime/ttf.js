/** Minimal TrueType loader: cmap format 4 + simple glyf rasterizer. */

export function parseTtf(buf) {
  const view = buf instanceof DataView ? buf : new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const ntables = view.getUint16(4);
  const tables = {};
  for (let i = 0; i < ntables; i++) {
    const o = 12 + i * 16;
    const tag = str(view, o, 4);
    tables[tag] = { offset: view.getUint32(o + 8), length: view.getUint32(o + 12) };
  }
  need(tables, "cmap"); need(tables, "head"); need(tables, "loca"); need(tables, "glyf"); need(tables, "maxp");
  const unitsPerEm = view.getUint16(tables.head.offset + 18);
  const indexToLocFormat = view.getInt16(tables.head.offset + 50);
  const numGlyphs = view.getUint16(tables.maxp.offset + 4);
  const cmap = parseCmap(view, tables.cmap.offset);
  return { view, tables, unitsPerEm, indexToLocFormat, numGlyphs, cmap, kind: "ttf" };
}

function need(tables, tag) {
  if (!tables[tag]) throw new Error("TTF missing table " + tag);
}

function str(view, o, n) {
  let s = "";
  for (let i = 0; i < n; i++) s += String.fromCharCode(view.getUint8(o + i));
  return s;
}

function parseCmap(view, off) {
  const n = view.getUint16(off + 2);
  let best = null;
  for (let i = 0; i < n; i++) {
    const plat = view.getUint16(off + 4 + i * 8);
    const enc = view.getUint16(off + 6 + i * 8);
    const offset = view.getUint32(off + 8 + i * 8);
    const format = view.getUint16(off + offset);
    if (format === 4 && (plat === 3 || plat === 0)) best = off + offset;
  }
  if (best == null) throw new Error("no cmap format 4");
  const segCount = view.getUint16(best + 6) / 2;
  const endOff = best + 14;
  const startOff = endOff + 2 + segCount * 2;
  const deltaOff = startOff + segCount * 2;
  const rangeOff = deltaOff + segCount * 2;
  const endCode = [], startCode = [], idDelta = [], idRange = [];
  for (let i = 0; i < segCount; i++) {
    endCode.push(view.getUint16(endOff + i * 2));
    startCode.push(view.getUint16(startOff + i * 2));
    idDelta.push(view.getInt16(deltaOff + i * 2));
    idRange.push(view.getUint16(rangeOff + i * 2));
  }
  return { segCount, endCode, startCode, idDelta, idRange, rangeOff };
}

export function glyphIndex(font, code) {
  const { cmap, view } = font;
  for (let i = 0; i < cmap.segCount; i++) {
    if (code > cmap.endCode[i]) continue;
    if (code < cmap.startCode[i]) return 0;
    if (cmap.idRange[i] === 0) return (code + cmap.idDelta[i]) & 0xffff;
    const off = cmap.rangeOff + i * 2 + cmap.idRange[i] + (code - cmap.startCode[i]) * 2;
    const g = view.getUint16(off);
    return g ? (g + cmap.idDelta[i]) & 0xffff : 0;
  }
  return 0;
}

function locaOff(font, gi) {
  const { view, tables, indexToLocFormat } = font;
  if (indexToLocFormat === 0) return tables.glyf.offset + view.getUint16(tables.loca.offset + gi * 2) * 2;
  return tables.glyf.offset + view.getUint32(tables.loca.offset + gi * 4);
}

export function loadSimpleGlyph(font, gi) {
  const { view } = font;
  const o = locaOff(font, gi);
  const next = locaOff(font, gi + 1);
  if (next <= o) return { contours: [] };
  const nCont = view.getInt16(o);
  if (nCont < 0) return { contours: [] };
  const endPts = [];
  for (let i = 0; i < nCont; i++) endPts.push(view.getUint16(o + 10 + i * 2));
  const inst = view.getUint16(o + 10 + nCont * 2);
  let p = o + 12 + nCont * 2 + inst;
  const nPts = endPts[endPts.length - 1] + 1;
  const flags = [];
  for (let i = 0; i < nPts; ) {
    const f = view.getUint8(p++);
    flags.push(f);
    i++;
    if (f & 8) {
      const r = view.getUint8(p++);
      for (let k = 0; k < r; k++) { flags.push(f); i++; }
    }
  }
  const xs = [], ys = [];
  let x = 0, y = 0;
  for (let i = 0; i < nPts; i++) {
    const f = flags[i];
    if (f & 2) { const d = view.getUint8(p++); x += (f & 16) ? d : -d; }
    else if (!(f & 16)) { x += view.getInt16(p); p += 2; }
    xs.push(x);
  }
  for (let i = 0; i < nPts; i++) {
    const f = flags[i];
    if (f & 4) { const d = view.getUint8(p++); y += (f & 32) ? d : -d; }
    else if (!(f & 32)) { y += view.getInt16(p); p += 2; }
    ys.push(y);
  }
  const contours = [];
  let start = 0;
  for (const end of endPts) {
    const pts = [];
    for (let i = start; i <= end; i++) pts.push({ x: xs[i], y: ys[i], on: !!(flags[i] & 1) });
    contours.push(pts);
    start = end + 1;
  }
  return { contours };
}

export function rasterizeGlyph(font, code, px = 16) {
  const gi = glyphIndex(font, code);
  const g = loadSimpleGlyph(font, gi);
  const scale = px / font.unitsPerEm;
  const w = Math.max(8, px), h = Math.max(8, px);
  const bits = Array.from({ length: h }, () => new Array(w).fill(0));
  const polys = g.contours.map((c) => expandOnOff(c).map((p) => ({
    x: Math.round(p.x * scale + w * 0.1),
    y: Math.round(h - 2 - p.y * scale * 0.8),
  })));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (inside(polys, x + 0.5, y + 0.5)) bits[y][x] = 1;
    }
  }
  return { width: w, height: h, bits };
}

function expandOnOff(pts) {
  if (!pts.length) return [];
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    out.push(a);
    if (!a.on && !b.on) out.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true });
  }
  return out.filter((p) => p.on);
}

function inside(polys, x, y) {
  let w = 0;
  for (const poly of polys) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[j], b = poly[i];
      if ((a.y > y) !== (b.y > y)) {
        const t = (y - a.y) / ((b.y - a.y) || 1e-6);
        if (x < a.x + t * (b.x - a.x)) w++;
      }
    }
  }
  return w % 2 === 1;
}

export function ttfToDosLike(font, px = 16) {
  const data = new Uint8Array(256 * px);
  for (let c = 32; c < 127; c++) {
    const g = rasterizeGlyph(font, c, px);
    for (let y = 0; y < px; y++) {
      let bits = 0;
      for (let x = 0; x < 8; x++) if (g.bits[y]?.[x]) bits |= 128 >> x;
      data[c * px + y] = bits;
    }
  }
  return { kind: "dos-bitmap", width: 8, height: px, glyphs: 256, data };
}
