/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Kitab-style theme switcher. Presets + custom CSS vars in localStorage.
 * Jazz is the default (estate navy is a skin, paper is manuscript not white).
 */
(function () {
  var PRESETS = {
    jazz: { label: "Jazz", href: "skins/jazz.css" },
    bells: { label: "Bells", href: "skins/bells.css" },
    estate: { label: "Estate", href: null },
    night: { label: "Night", href: "skins/night.css" },
    manuscript: { label: "Manuscript", href: "skins/manuscript.css" },
    terminal: { label: "Terminal", href: "skins/terminal.css" },
    contrast: { label: "Contrast", href: "skins/contrast.css" }
  };
  var path = location.pathname.indexOf("/dome/") >= 0 || location.pathname.indexOf("/mez/") >= 0 || location.pathname.indexOf("/skins/") >= 0 ? "../" : "";
  function apply(id) {
    if (!PRESETS[id]) id = "jazz";
    try { localStorage.setItem("panini-theme", id); } catch (e) {}
    document.documentElement.setAttribute("data-theme", id);
    var el = document.getElementById("panini-skin");
    if (el) el.remove();
    var spec = PRESETS[id];
    if (spec && spec.href) {
      el = document.createElement("link");
      el.id = "panini-skin";
      el.rel = "stylesheet";
      el.href = path + spec.href;
      document.head.appendChild(el);
    }
    var custom;
    try { custom = JSON.parse(localStorage.getItem("panini-theme-custom") || "null"); } catch (e) { custom = null; }
    var st = document.getElementById("panini-custom");
    if (st) st.remove();
    if (custom && typeof custom === "object") {
      st = document.createElement("style");
      st.id = "panini-custom";
      var body = ":root{";
      for (var k in custom) if (Object.prototype.hasOwnProperty.call(custom, k)) body += k + ":" + custom[k] + ";";
      body += "}";
      st.textContent = body;
      document.head.appendChild(st);
    }
  }
  window.PANINI_THEME = {
    presets: PRESETS,
    apply: apply,
    current: function () { try { return localStorage.getItem("panini-theme") || "jazz"; } catch (e) { return "jazz"; } },
    saveCustom: function (obj) {
      try { localStorage.setItem("panini-theme-custom", JSON.stringify(obj || {})); } catch (e) {}
      apply(this.current());
    },
    clearCustom: function () {
      try { localStorage.removeItem("panini-theme-custom"); } catch (e) {}
      apply(this.current());
    },
    exportJSON: function () {
      return JSON.stringify({
        preset: this.current(),
        custom: JSON.parse(localStorage.getItem("panini-theme-custom") || "null")
      }, null, 2);
    }
  };
  var bar = document.createElement("div");
  bar.id = "panini-rung";
  bar.style.cssText = "display:flex;flex-wrap:wrap;gap:.45rem;align-items:center;padding:.3rem 1rem;font:12px/1.3 ui-monospace,monospace;background:#05070c;color:#e8d9a8;border-bottom:1px solid rgba(201,162,39,.35);";
  var html = '<a href="' + path + 'index.html" style="color:#c9a227;font-weight:600">Home</a>';
  html += '<a href="' + path + 'console.html" style="color:#e8d9a8">Console</a>';
  html += '<a href="' + path + 'workbench.html" style="color:#e8d9a8">Workbench</a>';
  html += '<a href="' + path + 'theme.html" style="color:#e8d9a8">Themes</a>';
  html += '<span style="opacity:.5">·</span>';
  Object.keys(PRESETS).forEach(function (k) {
    html += '<button type="button" data-skin="' + k + '" style="background:#1a3348;color:#e8d9a8;border:1px solid #c9a227;cursor:pointer">' + PRESETS[k].label + "</button>";
  });
  bar.innerHTML = html;
  if (document.body) document.body.insertBefore(bar, document.body.firstChild);
  else document.addEventListener("DOMContentLoaded", function () {
    document.body.insertBefore(bar, document.body.firstChild);
  });
  bar.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.getAttribute("data-skin")) apply(t.getAttribute("data-skin"));
  });
  apply((function () { try { return localStorage.getItem("panini-theme") || "jazz"; } catch (e) { return "jazz"; } })());
})();
