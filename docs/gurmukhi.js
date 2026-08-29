/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Browser load of retrieved Gurmukhi→Deva + Punjabi C maps.
 */
window.PANINI_PA = {
  async load() {
    const [script, kwText] = await Promise.all([
      fetch("retrieved/gurmukhi_to_deva.json").then((r) => r.json()),
      fetch("retrieved/punjabi_c.tsv").then((r) => r.text()),
    ]);
    const smap = new Map();
    for (const r of script.rows || []) smap.set(r.gurmukhi, r.deva);
    const kws = [];
    for (const line of kwText.split(/\n/)) {
      if (!line || line.startsWith("#")) continue;
      const [native, romenagri, c] = line.split("\t");
      if (native === "native" || !native || !c) continue;
      kws.push({ native, romenagri, c });
    }
    function applyKw(src, field) {
      let out = src;
      for (const r of kws.slice().sort((a, b) => b.native.length - a.native.length)) {
        out = out.split(r.native).join(r[field]);
      }
      return out;
    }
    return {
      script_count: smap.size,
      keyword_count: kws.length,
      toDeva: (s) => [...s].map((ch) => smap.get(ch) || ch).join(""),
      toRomenagri: (s) => applyKw(s, "romenagri"),
      toC: (s) => applyKw(s, "c"),
      unmapped: script.unmapped || [],
    };
  },
};
