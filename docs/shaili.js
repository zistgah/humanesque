/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Applies retrieved Hindawi h2c/c2h maps. Does not invent keywords.
 */
window.PANINI_SHAILI = {
  async load() {
    const [h, c] = await Promise.all([
      fetch("retrieved/h2c.map.json").then((r) => r.json()),
      fetch("retrieved/c2h.map.json").then((r) => r.json()),
    ]);
    if (h.invented || c.invented) throw new Error("maps marked invented — refuse");
    const h2c = h.rules || [];
    const c2h = c.rules || [];
    function apply(src, rules) {
      const sorted = rules.slice().sort((a, b) => b.from.length - a.from.length);
      let out = src;
      for (const r of sorted) {
        const from = r.from.replace(/\\./g, (m) => m[1]);
        if (!from) continue;
        out = out.split(from).join(r.to);
      }
      return out;
    }
    return {
      h2c, c2h,
      source: h.source,
      applyH2c: (s) => apply(s, h2c),
      applyC2h: (s) => apply(s, c2h),
    };
  },
};
