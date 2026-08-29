/**
 * Host-speed C eval for heap-heavy programs (calloc / 8-queens).
 * Parse still happens in PANINI.Frontend.C. Semantics match c.pni.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import { ccpp } from "./ccpp.js";
import { clower } from "./clower.js";

class Jump {
  constructor(kind, val) { this.kind = kind; this.val = val; }
}

function tok(src) {
  const t = [];
  let i = 0;
  const n = src.length;
  const kw = new Set("int return void if else while for do char goto break continue struct typedef sizeof union enum switch case default".split(" "));
  const two = ["->","++","--","+=","-=","*=","==","!=","<=",">=","&&","||","<<",">>"];
  while (i < n) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === "#" || (c === "/" && src[i+1] === "/")) { while (i < n && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i+1] === "*") { i += 2; while (i+1 < n && !(src[i]==="*" && src[i+1]==="/")) i++; i += 2; continue; }
    if (c === '"') {
      i++; let s = "";
      while (i < n && src[i] !== '"') {
        if (src[i] === "\\" && src[i+1] === "n") { s += "\n"; i += 2; }
        else s += src[i++];
      }
      i++;
      while (/\s/.test(src[i])) i++;
      if (src[i] === '"') { i++; while (i < n && src[i] !== '"') s += src[i++]; i++; }
      t.push({k:"STR", v:s}); continue;
    }
    if (c === "'") { t.push({k:"NUM", v: src.charCodeAt(i+1)}); i += 3; continue; }
    if (c === "0" && (src[i+1]==="x"||src[i+1]==="X")) {
      i += 2; let h=0, hc=0;
      while (/[0-9a-fA-F]/.test(src[i])) { h = h*16 + parseInt(src[i++], 16); hc++; }
      t.push({k:"NUM", v: hc>8 ? -1 : h}); continue;
    }
    if (/\d/.test(c)) { let r=""; while (/\d/.test(src[i])) r += src[i++]; t.push({k:"NUM", v:+r}); continue; }
    if (/[A-Za-z_]/.test(c)) { let r=""; while (/\w/.test(src[i])) r += src[i++]; t.push({k: kw.has(r)?"KW":"IDENT", v:r}); continue; }
    const pair = src.slice(i, i+2);
    if (two.includes(pair)) { t.push({k:"OP", v:pair}); i += 2; continue; }
    t.push({k:"OP", v:c}); i++;
  }
  t.push({k:"EOF", v:""});
  return t;
}

export function cinterp(source) {
  source = clower(ccpp(String(source)));
  const T = tok(source);
  let i = 0;
  const peek = () => T[i] || {k:"EOF", v:""};
  const eat = () => T[i++];
  const at = (v) => peek().v === v;
  const foff = {};
  let off = 0;

  function skipType() {
    let stars = 0;
    while (peek().k === "KW" && ["int","char","void","struct","typedef","union","enum"].includes(peek().v)) {
      if (peek().v === "struct" || peek().v === "union") {
        const un = peek().v === "union"; eat();
        if (peek().k === "IDENT") eat();
        while (at("*")) eat();
        if (at("{")) harvest(un);
      } else eat();
    }
    while (at("*")) { stars++; eat(); }
    return stars;
  }
  function harvest(un) {
    eat();
    let d = 1;
    const base = off;
    while (d > 0 && peek().k !== "EOF") {
      if (at("{")) { d++; eat(); }
      else if (at("}")) { d--; eat(); }
      else if (peek().k === "KW" && ["int","char","void"].includes(peek().v)) eat();
      else if (peek().k === "KW" && (peek().v === "struct" || peek().v === "union")) {
        const iu = peek().v === "union"; eat();
        if (peek().k === "IDENT") eat();
        while (at("*")) eat();
        if (at("{")) { if (iu) { const s=off; harvest(true); off=s+1; } else harvest(false); }
        else if (peek().k === "IDENT") { foff[eat().v] = off; if (!un) off++; }
      } else if (peek().k === "IDENT") {
        const nm = eat().v; foff[nm] = off;
        if (at("[")) { while (!at("]") && peek().k!=="EOF") eat(); if (at("]")) eat(); off += 2; }
        else if (!un) off++;
      } else eat();
    }
  }
  function coff(f) { return foff[f] ?? (f==="b"||f==="y"?1:f==="c"?2:f==="d"||f==="s"||f==="sub"?3:0); }

  function pUnary() {
    if (at("*")) { eat(); return {op:"deref", e:pUnary()}; }
    if (at("&")) { eat(); return {op:"addr", e:pUnary()}; }
    if (at("!")) { eat(); return {op:"not", e:pUnary()}; }
    if (at("-")) { eat(); return {op:"neg", e:pUnary()}; }
    if (at("~")) { eat(); return {op:"bnot", e:pUnary()}; }
    if (at("++")) { eat(); return {op:"preinc", e:pUnary()}; }
    if (at("--")) { eat(); return {op:"predec", e:pUnary()}; }
    const t = peek();
    if (t.k==="KW" && t.v==="sizeof") {
      eat();
      if (at("(")) {
        eat();
        if (peek().k==="KW" && ["int","char","void","struct"].includes(peek().v)) {
          const ty = peek().v; skipType(); if (at(")")) eat();
          return {op:"const", value: ty==="char"?1: ty==="void"?8:4};
        }
        const e = pAssign(); if (at(")")) eat(); return {op:"sizeof", e};
      }
      return {op:"sizeof", e:pUnary()};
    }
    if (t.k==="NUM") { eat(); return {op:"const", value:t.v}; }
    if (t.k==="STR") { eat(); return {op:"str", value:t.v}; }
    if (t.k==="IDENT" || t.k==="KW") {
      eat(); return pPost({op:"load", name:t.v});
    }
    if (at("(")) {
      eat();
      if (peek().k==="KW" && ["int","char","void","struct"].includes(peek().v)) {
        skipType(); if (at(")")) eat(); return {op:"cast", e:pUnary()};
      }
      const e = pAssign(); if (at(")")) eat(); return pPost(e);
    }
    eat(); return {op:"const", value:0};
  }
  function pPost(left) {
    for (;;) {
      if (at("(")) {
        eat(); const args=[];
        while (!at(")") && peek().k!=="EOF") { args.push(pAssign()); if (at(",")) eat(); }
        if (at(")")) eat();
        left = {op:"call", name:left.name, args, callee:left};
      } else if (at("[")) {
        eat(); const ix=pAssign(); if (at("]")) eat(); left={op:"index", base:left, index:ix};
      } else if (at(".")) { eat(); left={op:"dot", base:left, field:eat().v}; }
      else if (at("->")) { eat(); left={op:"arrow", base:left, field:eat().v}; }
      else if (at("++")) { eat(); left={op:"postinc", e:left}; }
      else if (at("--")) { eat(); left={op:"postdec", e:left}; }
      else return left;
    }
  }
  const bin = (next, ops) => () => {
    let l = next();
    while (ops.includes(peek().v)) { const o=eat().v; l={op:"bin", operator:o, left:l, right:next()}; }
    return l;
  };
  const pMul = bin(pUnary, ["*","/","%"]);
  const pAdd = bin(pMul, ["+","-"]);
  const pSh = bin(pAdd, ["<<",">>"]);
  const pRel = bin(pSh, ["<",">","<=",">="]);
  const pEq = bin(pRel, ["==","!="]);
  const pBand = bin(pEq, ["&"]);
  const pBxor = bin(pBand, ["^"]);
  const pBor = bin(pBxor, ["|"]);
  function pAnd() { let l=pBor(); while(at("&&")){eat(); l={op:"and", left:l, right:pBor()};} return l; }
  function pOr() { let l=pAnd(); while(at("||")){eat(); l={op:"or", left:l, right:pAnd()};} return l; }
  function pCond() {
    let l=pOr();
    if (at("?")) { eat(); const t=pCond(); if (at(":")) eat(); return {op:"tern", c:l, t, f:pCond()}; }
    return l;
  }
  function pInit() {
    if (!at("{")) return pCond();
    eat(); const items=[];
    while (!at("}") && peek().k!=="EOF") {
      let des="";
      if (at(".")) { eat(); des=eat().v; if (at("=")) eat(); }
      else if (at("[")) { eat(); des=String(peek().v); eat(); if (at("]")) eat(); if (at("=")) eat(); }
      items.push({des, val:pInit()}); if (at(",")) eat();
    }
    if (at("}")) eat();
    return {op:"init", items};
  }
  function pAssign() {
    if (at("{")) return pInit();
    const l=pCond();
    if (["=","+=","-=","*="].includes(peek().v)) { const o=eat().v; return {op:"assign", target:l, operator:o, value:pAssign()}; }
    return l;
  }

  function pStmt() {
    const t = peek();
    if (at(";")) { eat(); return {op:"nop"}; }
    if (t.k==="KW" && t.v==="return") { eat(); const e=at(";")?{op:"const",value:0}:pAssign(); if(at(";"))eat(); return {op:"return", arg:e}; }
    if (t.k==="KW" && t.v==="if") {
      eat(); if(at("("))eat(); const cond=pAssign(); if(at(")"))eat();
      const th=pStmt(); let el={op:"nop"}; if(peek().k==="KW"&&peek().v==="else"){eat(); el=pStmt();}
      return {op:"if", cond, then:th, else:el};
    }
    if (t.k==="KW" && t.v==="while") { eat(); if(at("("))eat(); const c=pAssign(); if(at(")"))eat(); return {op:"while", cond:c, body:pStmt()}; }
    if (t.k==="KW" && t.v==="do") {
      eat(); const b=pStmt(); if(peek().v==="while")eat(); if(at("("))eat(); const c=pAssign(); if(at(")"))eat(); if(at(";"))eat();
      return {op:"do", cond:c, body:b};
    }
    if (t.k==="KW" && t.v==="for") {
      eat(); if(at("("))eat();
      const ini = at(";") ? (eat(), {op:"nop"}) : pStmt();
      const cond = at(";") ? {op:"const", value:1} : pAssign(); if(at(";"))eat();
      const inc = at(")") ? {op:"nop"} : {op:"expr", value:pAssign()}; if(at(")"))eat();
      return {op:"for", init:ini, cond, inc, body:pStmt()};
    }
    if (t.k==="KW" && t.v==="switch") { eat(); if(at("("))eat(); const c=pAssign(); if(at(")"))eat(); return {op:"switch", cond:c, body:pStmt()}; }
    if (t.k==="KW" && t.v==="case") { eat(); const v=pCond(); if(at(":"))eat(); return {op:"case", val:v, stmt:pStmt()}; }
    if (t.k==="KW" && t.v==="default") { eat(); if(at(":"))eat(); return {op:"default", stmt:pStmt()}; }
    if (t.k==="KW" && t.v==="break") { eat(); if(at(";"))eat(); return {op:"break"}; }
    if (t.k==="KW" && t.v==="continue") { eat(); if(at(";"))eat(); return {op:"continue"}; }
    if (t.k==="KW" && t.v==="goto") { const lab= (eat(), eat().v); if(at(";"))eat(); return {op:"goto", label:lab}; }
    if (t.k==="IDENT" && T[i+1] && T[i+1].v===":") { const lab=eat().v; eat(); return {op:"label", name:lab, stmt:pStmt()}; }
    if (at("{")) { eat(); const body=[]; while(!at("}")&&peek().k!=="EOF") body.push(pStmt()); if(at("}"))eat(); return {op:"block", body}; }
    if (t.k==="KW" && ["int","char","void","struct","typedef","enum","union"].includes(t.v)) {
      if (t.v==="typedef") { eat(); skipType(); if(peek().k==="IDENT")eat(); if(at(";"))eat(); return {op:"nop"}; }
      if (t.v==="enum") {
        eat(); if(peek().k==="IDENT")eat(); const body=[]; let n=0;
        if (at("{")) { eat(); while(!at("}")&&peek().k!=="EOF"){ const nm=eat().v; if(at("=")){eat(); n=+eat().v;} body.push({op:"decl", name:nm, size:{op:"none"}, init:{op:"const", value:n}}); n++; if(at(","))eat(); } if(at("}"))eat(); }
        if (peek().k==="IDENT") { body.push({op:"decl", name:eat().v, size:{op:"none"}, init:{op:"none"}}); }
        if(at(";"))eat(); return {op:"block", body};
      }
      const stars = skipType();
      let name="anon";
      if (peek().k==="IDENT") name=eat().v;
      if (at("(")) {
        eat(); const params=[];
        while(!at(")")&&peek().k!=="EOF"){ skipType(); if(peek().k==="IDENT") params.push(eat().v); else if(!at(")")&&!at(",")) eat(); if(at("[")){ while(!at("]"))eat(); if(at("]"))eat(); } if(at(","))eat(); }
        if(at(")"))eat();
        if(at(";")){ eat(); return {op:"nop"}; }
        const blk = pStmt();
        return {op:"def", name, params, body: blk.op==="block" ? blk.body : [blk] };
      }
      let size={op:"none"};
      if (at("[")) { eat(); if(at("]")) eat(); else { size=pAssign(); if(at("]"))eat(); } }
      let init={op:"none"};
      if (at("=")) { eat(); init=pInit(); }
      const extras=[];
      while (at(",")) {
        eat(); let ps=0; while(at("*")){ps++; eat();}
        let n2="anon"; if(peek().k==="IDENT") n2=eat().v;
        let sz2={op:"none"}; if(at("[")){ eat(); if(!at("]")) sz2=pAssign(); if(at("]"))eat(); }
        let i2={op:"none"}; if(at("=")){ eat(); i2=pInit(); }
        extras.push({op:"decl", name:n2, size:sz2, init:i2, ptr:ps});
      }
      if(at(";"))eat();
      const d0={op:"decl", name, size, init, ptr:stars};
      return extras.length ? {op:"block", body:[d0, ...extras]} : d0;
    }
    const e=pAssign(); if(at(";"))eat(); return {op:"expr", value:e};
  }

  const body=[];
  while (peek().k!=="EOF") body.push(pStmt());

  const mem = new Int32Array(2_000_000);
  let heapTop = 4096;
  let stackTop = 1_000_000;
  const env = { parent: null, foff };

  function alloc(n) {
    n = n | 0;
    if (n < 1) n = 1;
    const a = stackTop;
    stackTop += n;
    if (stackTop >= mem.length) throw new Error("virtual stack OOM");
    for (let j = 0; j < n; j++) mem[a + j] = 0;
    return a;
  }
  function calloc(n) {
    n = n | 0;
    if (n < 1) return 0;
    const a = heapTop;
    heapTop += n;
    if (heapTop >= 1_000_000) throw new Error("virtual heap OOM");
    for (let j = 0; j < n; j++) mem[a + j] = 0;
    return a;
  }
  function look(e, name) { if (e[name]!=null) return e[name]; if (e.parent) return look(e.parent, name); return null; }
  function cell(o) { return o && o.kind==="fn" ? o : o ? o.loc : 0; }

  function ev(e, env) {
    if (!e) return 0;
    switch (e.op) {
      case "const": return e.value;
      case "str": return e.value;
      case "load": {
        const o=look(env, e.name); if(!o) return 0;
        if (o.kind==="fn") return o;
        if (o.kind==="arr") return o.loc;
        return mem[o.loc];
      }
      case "addr":
        if (e.e.op==="load") return cell(look(env, e.e.name));
        if (e.e.op==="index") {
          const o=look(env, e.e.base.name);
          const ix=ev(e.e.index, env);
          return (o.kind==="arr"?o.loc:mem[o.loc]) + ix;
        }
        return 0;
      case "deref": return mem[ev(e.e, env)];
      case "index": {
        let b, ix=ev(e.index, env);
        if (e.base.op==="load") {
          const o=look(env, e.base.name);
          b = o.kind==="arr" ? o.loc : mem[o.loc];
        } else b = ev(e.base, env);
        if (typeof b==="string") return b.charCodeAt(ix);
        const slot=mem[b]; if (typeof slot==="string") return slot.charCodeAt(ix);
        return mem[b+ix]|0;
      }
      case "dot": {
        const b = e.base.op==="load" ? cell(look(env, e.base.name)) : ev(e.base, env);
        const off=coff(e.field);
        if (e.field==="s"||e.field==="sub") return b+off;
        return mem[b+off];
      }
      case "arrow": return mem[ev(e.base, env)+coff(e.field)];
      case "cast": return ev(e.e, env);
      case "sizeof": {
        if (e.e.op==="load") { const o=look(env,e.e.name); if(o?.kind==="arr") return o.n*4; if(o?.psz===8) return 8; }
        if (e.e.op==="addr") return 8;
        return 4;
      }
      case "tern": return ev(e.c, env) ? ev(e.t, env) : ev(e.f, env);
      case "bnot": return ~ev(e.e, env);
      case "not": return ev(e.e, env) ? 0 : 1;
      case "neg": return -ev(e.e, env);
      case "preinc": { const a=addr(e.e, env); return mem[a]=mem[a]+1; }
      case "predec": { const a=addr(e.e, env); return mem[a]=mem[a]-1; }
      case "postinc": { const a=addr(e.e, env); const v=mem[a]; mem[a]=v+1; return v; }
      case "postdec": { const a=addr(e.e, env); const v=mem[a]; mem[a]=v-1; return v; }
      case "and": return ev(e.left, env) && ev(e.right, env);
      case "or": return ev(e.left, env) || ev(e.right, env);
      case "bin": {
        const l=ev(e.left, env), r=ev(e.right, env);
        switch (e.operator) {
          case "+": return l+r; case "-": return l-r; case "*": return l*r;
          case "/": return Math.trunc(l/r); case "%": return l%r;
          case "<": return l<r?1:0; case ">": return l>r?1:0;
          case "<=": return l<=r?1:0; case ">=": return l>=r?1:0;
          case "==": return l===r?1:0; case "!=": return l!==r?1:0;
          case "&": return l&r; case "|": return l|r; case "^": return l^r;
          case "<<": return l<<r; case ">>": return l>>r;
        }
      }
      case "assign": {
        let v=ev(e.value, env);
        if (e.operator==="+=") v = (mem[addr(e.target,env)]+v);
        if (e.operator==="-=") v = (mem[addr(e.target,env)]-v);
        if (e.operator==="*=") v = (mem[addr(e.target,env)]*v);
        mem[addr(e.target, env)] = v; return v;
      }
      case "call": {
        if (e.name==="strlen") return String(ev(e.args[0], env)).length;
        if (e.name==="calloc"||e.name==="malloc") {
          const n=ev(e.args[0], env);
          return calloc(Math.max(1, n|0));
        }
        if (e.name==="printf") return 0;
        const fn = e.callee && e.callee.op!=="load" ? ev(e.callee, env) : look(env, e.name);
        if (!fn || fn.kind!=="fn") return 0;
        const saved = stackTop;
        const local={parent:env};
        fn.params.forEach((pn, j) => {
          const loc=alloc(1); local[pn]={kind:"cell", loc, psz:8};
          if (j<e.args.length) mem[loc]=ev(e.args[j], env);
        });
        try { return ex({op:"block", body:fn.body}, local); }
        catch (j) { if (j instanceof Jump && j.kind==="return") return j.val; throw j; }
        finally { stackTop = saved; }
      }
    }
    return 0;
  }
  function addr(e, env) {
    if (e.op==="load") return cell(look(env, e.name));
    if (e.op==="deref") return ev(e.e, env);
    if (e.op==="index") {
      if (e.base.op==="load") {
        const o=look(env, e.base.name); const ix=ev(e.index, env);
        return (o.kind==="arr"?o.loc:mem[o.loc])+ix;
      }
      return ev(e.base, env)+ev(e.index, env);
    }
    if (e.op==="dot") return (e.base.op==="load"?cell(look(env,e.base.name)):ev(e.base,env))+coff(e.field);
    if (e.op==="arrow") return ev(e.base, env)+coff(e.field);
    return 0;
  }
  function ex(s, env) {
    if (!s) return 0;
    switch (s.op) {
      case "nop": return 0;
      case "return": throw new Jump("return", ev(s.arg, env));
      case "break": throw new Jump("break");
      case "continue": throw new Jump("continue");
      case "goto": throw new Jump("goto", s.label);
      case "label": case "case": case "default": return ex(s.stmt, env);
      case "block": {
        const labs={};
        s.body.forEach((nd, bi) => { let x=nd; while(x&&x.op==="label"){ labs[x.name]=bi; x=x.stmt; } });
        for (let k=0; k<s.body.length; k++) {
          try { ex(s.body[k], env); }
          catch (j) {
            if (j instanceof Jump && j.kind==="goto" && labs[j.val]!=null) { k=labs[j.val]-1; continue; }
            throw j;
          }
        }
        return 0;
      }
      case "if": return ev(s.cond, env) ? ex(s.then, env) : ex(s.else, env);
      case "while":
        while (ev(s.cond, env)) {
          try { ex(s.body, env); } catch(j) {
            if (j instanceof Jump && j.kind==="break") break;
            if (j instanceof Jump && j.kind==="continue") continue;
            throw j;
          }
        }
        return 0;
      case "do":
        for (;;) {
          try { ex(s.body, env); } catch(j) {
            if (j instanceof Jump && j.kind==="break") break;
            if (j instanceof Jump && j.kind==="continue") {}
            else throw j;
          }
          if (!ev(s.cond, env)) break;
        }
        return 0;
      case "for":
        ex(s.init, env);
        while (ev(s.cond, env)) {
          try { ex(s.body, env); } catch(j) {
            if (j instanceof Jump && j.kind==="break") break;
            if (j instanceof Jump && j.kind==="continue") { ex(s.inc, env); continue; }
            throw j;
          }
          ex(s.inc, env);
        }
        return 0;
      case "switch": {
        const sw = s.body.op==="block"?s.body:{op:"block", body:[s.body]};
        const v=ev(s.cond, env);
        let start=-1, defi=-1;
        sw.body.forEach((nd, bi) => {
          if (nd.op==="case" && ev(nd.val, env)===v) start=bi;
          if (nd.op==="default") defi=bi;
        });
        if (start<0) start=defi;
        if (start<0) return 0;
        for (let k=start; k<sw.body.length; k++) {
          try { ex(sw.body[k], env); }
          catch(j) { if (j instanceof Jump && j.kind==="break") return 0; throw j; }
        }
        return 0;
      }
      case "def":
        env[s.name] = {kind:"fn", params:s.params, body: Array.isArray(s.body)?s.body:[s.body]};
        return 0;
      case "decl": {
        let n=8, knd="cell", psz = s.ptr>0?8:4;
        if (s.size && s.size.op!=="none") { n=ev(s.size, env); knd="arr"; }
        const loc=alloc(Math.max(1,n));
        env[s.name]={kind:knd, loc, n, psz};
        if (s.init && s.init.op!=="none" && s.init.op!=="init") mem[loc]=ev(s.init, env);
        return 0;
      }
      case "expr": return ev(s.value, env);
    }
    return 0;
  }

  body.forEach(s => { try { ex(s, env); } catch(j) { if (!(j instanceof Jump)) throw j; } });
  const main = look(env, "main");
  if (!main || main.kind!=="fn") return 1;
  try { return ex({op:"block", body:main.body}, env) || 0; }
  catch (j) { if (j instanceof Jump && j.kind==="return") return j.val|0; throw j; }
}
