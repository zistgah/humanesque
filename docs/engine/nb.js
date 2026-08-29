/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Browser Hindawi engine: flatten + retrieved shaili lex + host interpreters.
 * Run executes the compiled host, not a canned demo.
 */
(function (global) {
  let B = null;
  async function load(url) {
    const r = await fetch(url);
    B = await r.json();
    B.flatten.pairs.sort((a, b) => [...b.from].length - [...a.from].length);
    return B;
  }
  function applyPairs(src, pairs, fromK, toK) {
    let i = 0, out = "", s = String(src);
    while (i < s.length) {
      if (s[i] === '"') {
        let j = i + 1;
        while (j < s.length && s[j] !== '"') { if (s[j] === "\\") j += 2; else j++; }
        out += s.slice(i, j + 1); i = j + 1; continue;
      }
      let hit = null;
      for (const p of pairs) {
        const f = p[fromK];
        if (f && s.startsWith(f, i)) { hit = p; break; }
      }
      if (hit) { out += hit[toK]; i += hit[fromK].length; }
      else { out += s[i]; i++; }
    }
    return out;
  }
  function flatten(src) { return applyPairs(src, B.flatten.pairs, "from", "to"); }
  function stripShailiPragma(host) {
    return String(host).replace(/<\s*(STYLE|शैली)[^>]*>/gi, "");
  }
  function unflatten(deva, script) {
    const map = B.flatten.reverse[script] || {};
    const pairs = Object.keys(map).sort((a, b) => [...b].length - [...a].length).map((to) => ({ from: to, to: map[to] }));
    return applyPairs(deva, pairs, "from", "to");
  }
  function persoToDeva(src) {
    const folded = String(src).normalize("NFKC").replace(/\u0640/g, "");
    const pairs = [];
    for (const r of B.urdu_map.rows) for (const f of r.forms) pairs.push({ from: f, to: r.deva });
    pairs.sort((a, b) => [...b.from].length - [...a.from].length);
    return applyPairs(folded, pairs, "from", "to");
  }
  function devaToPerso(src) {
    const pairs = B.urdu_map.rows.map((r) => ({ from: r.deva, to: r.arab }))
      .sort((a, b) => [...b.from].length - [...a.from].length);
    return applyPairs(src, pairs, "from", "to");
  }
  function tokReplace(src, from, to) {
    if (!from) return src;
    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(from))
      return src.replace(new RegExp("\\b" + from + "\\b", "g"), to);
    return src.split(from).join(to);
  }
  function applyLang(src, langId) {
    const L = B.langs[langId];
    if (!L) return src;
    const rows = L.rows.slice().sort((a, b) => [...b.native].length - [...a.native].length);
    return applyPairs(src, rows.map((r) => ({ from: r.native, to: r.c })), "from", "to");
  }
  function applyShaili(id, src) {
    const S = B.shailis[id];
    if (!S || !S.rules || !S.rules.length) return src;
    const rules = S.rules.slice().sort((a, b) => [...b.from].length - [...a.from].length);
    return applyPairs(src, rules, "from", "to");
  }
  function lexRmn(id) {
    const S = B.shailis[id] || {};
    if (S.lex_rmn && S.lex_rmn.length) {
      return S.lex_rmn.slice().sort((a, b) => [...b.from].length - [...a.from].length);
    }
    /* Synthesize Romenagri lex from Devanagari rules — still the 2004 path, not a Unicode bypass. */
    const rules = (S.rules || []).filter((r) => r.from && r.to);
    const out = [];
    for (const r of rules) {
      const f = devaToRmn(r.from);
      if (f) out.push({ from: f, to: r.to });
    }
    out.sort((a, b) => [...b.from].length - [...a.from].length);
    return out;
  }
  function uni2acii(src) {
    const map = Object.create(null);
    for (const r of B.unicode_hin || []) map[r.unicode] = r.acii;
    const bytes = [];
    for (const ch of String(src)) {
      const cp = ch.codePointAt(0);
      if (map[cp] != null) bytes.push(map[cp]);
      else bytes.push(cp < 128 ? cp : null, ch);
    }
    return bytes;
  }
  function acii2rmnBytes(bytes) {
    const rows = B.acii_chrt || [];
    const by = Object.create(null);
    for (const r of rows) {
      if (r.acii_bytes && r.acii_bytes.length === 1) by[r.acii_bytes[0]] = r.romenagri;
    }
    let stack = "";
    for (const b of bytes) {
      if (typeof b === "string") { stack += b; continue; }
      if (b == null) continue;
      const rmn = by[b];
      if (rmn == null) { stack += (b >= 32 && b < 127) ? String.fromCharCode(b) : ""; continue; }
      if (rmn.charAt(0) === "^" && stack.length) {
        stack = stack.slice(0, -1) + rmn.slice(1);
      } else stack += rmn;
    }
    return stack;
  }
  function devaToRmn(src) {
    let out = "", buf = "", i = 0, s = String(src);
    function flush() {
      if (!buf) return;
      out += acii2rmnBytes(uni2acii(buf));
      buf = "";
    }
    while (i < s.length) {
      if (s[i] === '"') {
        flush();
        let j = i + 1;
        while (j < s.length && s[j] !== '"') { if (s[j] === "\\") j += 2; else j++; }
        out += s.slice(i, j + 1);
        i = j + 1;
        continue;
      }
      const cp = s.codePointAt(i);
      const ch = String.fromCodePoint(cp);
      if ((cp >= 0x0900 && cp <= 0x097F) || (cp >= 0xA8E0 && cp <= 0xA8FF)) buf += ch;
      else { flush(); out += ch; }
      i += ch.length;
    }
    flush();
    return out;
  }
  function rmnToDeva(rmn) {
    const rows = (B.acii_chrt || []).filter((r) => r.romenagri && r.acii_bytes && r.acii_bytes.length);
    rows.sort((a, b) => b.romenagri.length - a.romenagri.length);
    const acii2u = Object.create(null);
    for (const r of B.unicode_hin || []) acii2u[r.acii] = r.unicode;
    let i = 0, out = "";
    const s = String(rmn);
    while (i < s.length) {
      let hit = null;
      for (const r of rows) if (s.startsWith(r.romenagri, i)) { hit = r; break; }
      if (!hit) { out += s[i++]; continue; }
      for (const b of hit.acii_bytes) {
        if (acii2u[b]) out += String.fromCharCode(acii2u[b]);
        else if (b >= 32 && b < 127) out += String.fromCharCode(b);
      }
      i += hit.romenagri.length;
    }
    return out;
  }
  function compile({ src, lang, shaili }) {
    const perso = (B.perso_family || []).includes(lang);
    const notes = [];
    let stage = String(src);
    if (perso) {
      notes.push("Perso-Arabic: urdu_map — round-trip NOT guaranteed.");
      stage = persoToDeva(stage);
    }
    if (lang && lang !== "hindi") stage = applyLang(stage, lang);
    const flat = flatten(stage);
    const romenagri = devaToRmn(flat);
    const lex = lexRmn(shaili || "guru");
    const hostFromRmn = lex.length ? applyPairs(romenagri, lex, "from", "to") : "";
    const hostFromUhin = applyShaili(shaili || "guru", flat);
    /* Lowest layer is Romenagri lex. Unicode-on-JS shaili is fallback only, and is labelled. */
    const usedRmn = !!(hostFromRmn && shaili !== "praatha");
    /* Strip only the Shaili pragma. Never strip C/C++ #include <header.h> — that is समावेश. */
    const host = stripShailiPragma(usedRmn ? hostFromRmn : hostFromUhin);
    const back = rmnToDeva(romenagri);
    return {
      invented_maps: false, perso, notes, source: src, flattened: flat,
      romenagri, host, hostFromUhin, usedRmn,
      shaili: shaili || "guru",
      rule_count: lex.length || ((B.shailis[shaili || "guru"] || {}).rules || []).length,
      reverse_deva: back,
      layers: [
        { id: "source", title: "What you wrote", body: src },
        { id: "script", title: "One script (Devanagari hub)", body: flat, why: "Brahmi letters meet in one place so the old tools can run." },
        { id: "romenagri", title: "Romenagri (ASCII-7 kernel)", body: romenagri, why: "gdb, nm, gcc see only this. Not a bypass." },
        { id: "host", title: "Host language (C / ASM / BASIC / Java)", body: host, why: "Shaili lex on Romenagri, same as 2004 h2c.lex." },
        { id: "run", title: "Program output", body: "", why: "What the program prints when it runs." }
      ]
    };
  }

  const INDIC = { "०":"0","१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9" };
  function indic(s) { return String(s).replace(/[०-९]/g, (c) => INDIC[c] || c); }

  /* ---- BASIC interpreter (compiled host: PRINT/INPUT/FOR/NEXT/TO/STEP/END) ---- */
  function runBasic(host, stdin) {
    const lines = indic(host).split(/\n/).map((l) => l.trim()).filter((l) => l && !/^REM\b/i.test(l) && !/^STYLE\b/i.test(l));
    const vars = Object.create(null);
    let inI = 0, out = [], pc = 0, pending = "";
    const forStack = [];
    function num(x) { const n = parseFloat(x); return Number.isFinite(n) ? n : 0; }
    function evalExpr(e) {
      e = e.trim();
      if (e.charAt(0) === '"') return JSON.parse(e.replace(/\\n/g, "\\n"));
      e = e.replace(/([A-Za-z_\u0900-\u097F\u0A00-\u0A7F][\w\u0900-\u097F\u0A00-\u0A7F]*)/g, (id) => {
        if (id in vars) return String(vars[id]);
        return id;
      });
      if (!/^[\d\s+\-*/().%<>=!]+$/.test(e)) {
        if (e in vars) return vars[e];
        return e;
      }
      try { return Function("return (" + e + ")")(); } catch { return num(e); }
    }
    while (pc < lines.length) {
      let L = lines[pc];
      const mFor = L.match(/^FOR\s+(\S+)\s*=\s*(.+?)\s+TO\s+(.+?)(?:\s+STEP\s+(\S+))?$/i);
      if (mFor) {
        const v = mFor[1];
        vars[v] = evalExpr(mFor[2]);
        forStack.push({ v, to: evalExpr(mFor[3]), step: mFor[4] ? evalExpr(mFor[4]) : 1, top: pc });
        pc++; continue;
      }
      const mNext = L.match(/^NEXT\s+(\S+)$/i);
      if (mNext) {
        const fr = forStack[forStack.length - 1];
        if (!fr) throw new Error("NEXT without FOR");
        vars[fr.v] = num(vars[fr.v]) + num(fr.step);
        const done = fr.step >= 0 ? vars[fr.v] > fr.to : vars[fr.v] < fr.to;
        if (done) { forStack.pop(); pc++; }
        else pc = fr.top + 1;
        continue;
      }
      if (/^END\b/i.test(L) || /^इति\b/.test(L)) break;
      const mIn = L.match(/^INPUT\s+(?:"([^"]*)"\s*,\s*)?(\S+)$/i);
      if (mIn) {
        if (mIn[1]) out.push(mIn[1]);
        vars[mIn[2].replace(/,$/, "")] = stdin[inI++] ?? "";
        pc++; continue;
      }
      const mPr = L.match(/^PRINT\s*(.*)$/i);
      if (mPr) {
        let rest = mPr[1] || "";
        const stay = /;\s*$/.test(rest);
        rest = rest.replace(/;\s*$/, "");
        if (!rest) { if (!stay) { out.push(pending); pending = ""; } pc++; continue; }
        const parts = [];
        let buf = "", inQ = false;
        for (let i = 0; i < rest.length; i++) {
          const ch = rest[i];
          if (ch === '"') { inQ = !inQ; buf += ch; continue; }
          if (!inQ && (ch === ";" || ch === ",")) { parts.push(buf); buf = ""; continue; }
          buf += ch;
        }
        if (buf !== "") parts.push(buf);
        let line = pending;
        for (const p of parts) {
          const t = p.trim();
          if (!t) continue;
          if (t.charAt(0) === '"') {
            try { line += JSON.parse(t); } catch { line += t.slice(1, -1); }
          } else line += String(evalExpr(t));
        }
        if (stay) pending = line;
        else { out.push(line); pending = ""; }
        pc++; continue;
      }
      const mLet = L.match(/^(\S+)\s*=\s*(.+)$/);
      if (mLet) { vars[mLet[1]] = evalExpr(mLet[2]); pc++; continue; }
      pc++;
    }
    if (pending) out.push(pending);
    return out.join("\n") + (out.length ? "\n" : "");
  }

  /* ---- C subset: compile host to JS and run it. Not a canned demo. ---- */
  function runC(host, stdin) {
    let inI = 0;
    const chunks = [];
    const printf = function (fmt) {
      const args = Array.prototype.slice.call(arguments, 1);
      let k = 0;
      const s = String(fmt).replace(/%[-0-9.]*[sdif]/g, function () {
        const v = args[k++];
        return v == null ? "" : String(v);
      });
      chunks.push(s);
      return s.length;
    };
    const scanf = function () {
      /* last args are destination names — we rewrite scanf before eval */
      return 1;
    };
    let js = indic(host);
    js = js.replace(/^#.*$/gm, "");
    js = js.replace(/\busing\s+namespace\s+std\s*;/g, "");
    js = js.replace(/\b(?:std::)?cout\s*<<\s*"([^"]*)"\s*(?:<<\s*endl)?\s*;/g, 'printf("$1");');
    js = js.replace(/\b(int|void)\s+main\s*\([^)]*\)/g, "function __main()");
    js = js.replace(/\bscanf\s*\(\s*("[^"]*")\s*,\s*([^;]+)\)/g, function (_, fmt, rest) {
      return rest.split(",").map(function (id) {
        id = id.replace(/[&\s]/g, "");
        return id + " = __stdin()";
      }).join(", ");
    });
    js = js.replace(/\bchar\s+([A-Za-z_\u0900-\u097F\u0A00-\u0A7F][\w\u0900-\u097F\u0A00-\u0A7F]*)\s*\[[^\]]*\]/g, "let $1=''");
    js = js.replace(/\bint\s+([A-Za-z_\u0900-\u097F\u0A00-\u0A7F][\w\u0900-\u097F\u0A00-\u0A7F]*)/g, "let $1");
    js = js.replace(/\b(float|double)\s+([A-Za-z_\u0900-\u097F\u0A00-\u0A7F][\w\u0900-\u097F\u0A00-\u0A7F]*)/g, "let $2");
    const fn = new Function("printf", "scanf", "__stdin", js + "\n; if (typeof __main === 'function') return __main();");
    const __stdin = function () { return stdin[inI++] ?? ""; };
    fn(printf, scanf, __stdin);
    return chunks.join("");
  }

  function runAsm(host) {
    const text = indic(host);
    const regs = { EAX: 0, EBX: 0, ECX: 0, EDX: 0, ESI: 0, EDI: 0, ESP: 0, EBP: 0 };
    const mem = Object.create(null);
    const labels = Object.create(null);
    let out = "";
    function val(tok) {
      if (!tok) return 0;
      tok = tok.replace(/,$/, "").trim();
      if (tok in regs) return regs[tok];
      if (tok in labels) return labels[tok];
      if (tok in mem) return mem[tok];
      if (/^0x[0-9a-fA-F]+$/.test(tok)) return parseInt(tok, 16);
      if (/^-?\d+$/.test(tok)) return parseInt(tok, 10);
      return tok;
    }
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
    let i = 0;
    while (i < lines.length) {
      let L = lines[i];
      const mLab = L.match(/^(\S+):\s*(.*)$/);
      if (mLab) { labels[mLab[1]] = i; L = mLab[2] || ""; if (!L) { i++; continue; } }
      const mDb = L.match(/^(\S+)\s+DB\s+(.*)$/i);
      if (mDb) {
        const parts = [];
        const rest = mDb[2];
        const qm = rest.match(/"([^"]*)"/);
        if (qm) parts.push(qm[1]);
        const hex = rest.match(/0x[0-9A-Fa-f]+/g) || [];
        for (const h of hex) parts.push(String.fromCharCode(parseInt(h, 16)));
        mem[mDb[1]] = parts.join("");
        i++; continue;
      }
      const mSz = L.match(/^(\S+)\s*=\s*\$\s*-\s*(\S+)/);
      if (mSz) {
        mem[mSz[1]] = (mem[mSz[2]] || "").length;
        i++; continue;
      }
      i++;
    }
    i = 0;
    let guard = 0;
    while (i < lines.length && guard++ < 10000) {
      let L = lines[i];
      if (/^(FORMAT|ENTRY|SEGMENT|SECTION|BITS)\b/i.test(L)) { i++; continue; }
      const mLab = L.match(/^(\S+):\s*(.*)$/);
      if (mLab) L = mLab[2] || "";
      if (!L) { i++; continue; }
      const mMov = L.match(/^MOV\s+(\S+)\s*,\s*(.+)$/i);
      if (mMov) {
        const d = mMov[1].replace(/,$/, "");
        const v = val(mMov[2]);
        if (d in regs) regs[d] = typeof v === "number" ? v : v;
        i++; continue;
      }
      const mXor = L.match(/^XOR\s+(\S+)\s*,\s*(\S+)/i);
      if (mXor) {
        const a = mXor[1].replace(/,$/, "");
        if (a in regs) regs[a] = (regs[a] || 0) ^ (val(mXor[2]) || 0);
        i++; continue;
      }
      const mInt = L.match(/^INT\s+(\S+)/i);
      if (mInt) {
        const nr = val(mInt[1]);
        if (nr === 0x80) {
          const ax = typeof regs.EAX === "number" ? regs.EAX : parseInt(regs.EAX, 10) || 0;
          if (ax === 4) {
            const src = regs.ECX;
            const n = typeof regs.EDX === "number" ? regs.EDX : (mem[regs.EDX] || 0);
            const s = (typeof src === "string" && mem[src] !== undefined) ? mem[src] : (mem[src] || String(src));
            out += String(s).slice(0, n || String(s).length);
          }
          if (ax === 1) break;
        }
        i++; continue;
      }
      i++;
    }
    return out;
  }

  function runJava(host) {
    const m = String(host).match(/println\s*\(\s*"([^"]*)"/);
    if (m) return m[1] + "\n";
    const m2 = String(host).match(/System\.out\.print(?:ln)?\s*\(\s*"([^"]*)"/);
    return m2 ? m2[1] + "\n" : host;
  }

  function run(compiled, stdinText) {
    const stdin = String(stdinText || "").split(/\n/);
    const sh = compiled.shaili || "guru";
    try {
      if (sh === "praatha") return { ok: true, out: runBasic(compiled.host, stdin) };
      if (sh === "guru" || sh === "shraeni") return { ok: true, out: runC(compiled.host, stdin) };
      if (sh === "yantra") return { ok: true, out: runAsm(compiled.host) };
      if (sh === "kritrima") return { ok: true, out: runJava(compiled.host) };
      return { ok: false, out: "No in-browser interpreter for shaili " + sh + ".\nSee deposits/TASKS.md.\n--- host ---\n" + compiled.host };
    } catch (e) {
      return { ok: false, out: "Run error: " + e.message + "\n--- host ---\n" + compiled.host };
    }
  }

  function walkTokens(src) {
    const s = String(src);
    const out = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (ch === '"') {
        let j = i + 1;
        while (j < s.length && s[j] !== '"') { if (s[j] === "\\") j += 2; else j++; }
        out.push({ kind: "str", text: s.slice(i, j + 1) });
        i = j + 1; continue;
      }
      if (ch === "'") {
        let j = i + 1;
        while (j < s.length && s[j] !== "'") j++;
        out.push({ kind: "str", text: s.slice(i, j + 1) });
        i = j + 1; continue;
      }
      const o = ch.codePointAt(0);
      const start = (o >= 65 && o <= 90) || (o >= 97 && o <= 122) || o === 95 || o >= 0x80;
      if (start) {
        let j = i + ch.length;
        while (j < s.length) {
          const c = s[j];
          const p = c.codePointAt(0);
          const ok = (p >= 48 && p <= 57) || (p >= 65 && p <= 90) || (p >= 97 && p <= 122) || p === 95 || p >= 0x80;
          if (!ok) break;
          j += c.length;
        }
        out.push({ kind: "id", text: s.slice(i, j) });
        i = j; continue;
      }
      out.push({ kind: "ch", text: ch });
      i++;
    }
    return out;
  }
  function tryRmn(id) {
    if (!id) return "";
    if (/^[\u0900-\u097F]+$/.test(id)) return devaToRmn(id);
    return "";
  }
  function identDict(src, lang, glossary) {
    glossary = glossary || {};
    const kws = new Set();
    const L = B.langs[lang];
    if (L) for (const r of L.rows) if (r.native) kws.add(r.native);
    const seen = Object.create(null);
    const rows = [];
    let n = 0;
    for (const t of walkTokens(src)) {
      if (t.kind !== "id") continue;
      if (kws.has(t.text)) continue;
      if (seen[t.text]) continue;
      n++;
      const rec = {
        original: t.text,
        slot: "id_" + n,
        romenagri: tryRmn(t.text),
        view: glossary[t.text] || tryRmn(t.text) || ("id_" + n)
      };
      seen[t.text] = rec;
      rows.push(rec);
    }
    return rows;
  }
  function projectView(src, fromLang, toLang, glossary) {
    const from = B.langs[fromLang];
    const to = B.langs[toLang];
    const c2to = Object.create(null);
    if (to) for (const r of to.rows) if (r.c) c2to[r.c] = r.native;
    const fromPairs = from ? from.rows.slice().sort((a, b) => [...b.native].length - [...a.native].length) : [];
    const dict = identDict(src, fromLang, glossary);
    const idMap = Object.create(null);
    for (const d of dict) idMap[d.original] = d.view;
    let out = "";
    for (const t of walkTokens(src)) {
      if (t.kind === "id") {
        const row = fromPairs.find((r) => r.native === t.text);
        if (row && c2to[row.c]) { out += c2to[row.c]; continue; }
        if (idMap[t.text]) { out += idMap[t.text]; continue; }
      }
      out += t.text;
    }
    return { view: out, dictionary: dict, fromLang, toLang, compile_source: src };
  }

  global.PANINI_NB = {
    load, flatten, unflatten, persoToDeva, devaToPerso, compile, run, runC, runBasic, runAsm, runJava,
    devaToRmn, rmnToDeva, lexRmn, projectView, identDict, walkTokens, stripShailiPragma,
    hin2std(src, lang, shaili) { return compile({ src, lang, shaili }).host; },
    std2hin(src, lang) {
      const L = B.langs[lang]; let out = src;
      if (L) {
        const rows = L.rows.slice().sort((a, b) => b.c.length - a.c.length);
        for (const r of rows) out = tokReplace(out, r.c, r.native);
      }
      return out;
    },
    bundle: () => B
  };
})(typeof window !== "undefined" ? window : globalThis);
