/* Romenagri JS binding — table-driven from canonical_basis.json
   Copyright (C) 1993-2026 Abhishek Choudhary. GPL-3.0-or-later. */
class Romenagri {
  constructor(basis){ this.fwd=new Map(); this.rev=new Map();
    for(const e of basis){ const k=String.fromCharCode(...e.iscii_bytes);
      if(k){ this.fwd.set(k,e.romenagri); } if(e.romenagri){ this.rev.set(e.romenagri,k); } }
    this.revKeys=[...this.rev.keys()].sort((a,b)=>b.length-a.length); }
  toRomenagri(iscii){ let o=""; for(const ch of iscii) o+=this.fwd.get(ch)??ch; return o; }
  toIscii(rmn){ let o="",i=0; outer: while(i<rmn.length){
      for(const k of this.revKeys){ if(rmn.startsWith(k,i)){ o+=this.rev.get(k); i+=k.length; continue outer; } }
      o+=rmn[i++]; } return o; }
}
if(typeof module!=="undefined") module.exports={Romenagri};
