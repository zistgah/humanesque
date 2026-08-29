/* Canonical site spine. Include on every public page. Do not duplicate menus.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
(function () {
  var script = document.currentScript;
  var src = (script && script.src) || "";
  var base = src.replace(/spine\.js(?:\?.*)?$/, "");
  function rel(href) {
    if (!href) return href;
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    return base + href;
  }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function langSelect(bundle) {
    var sel = el("select", { id: "spine-lang", "aria-label": "Language stack" });
    sel.appendChild(el("option", { value: "", text: "Language stack…" }));
    var langs = (bundle && bundle.langs) || {};
    Object.keys(langs).sort().forEach(function (id) {
      var rows = (langs[id].rows || []).length;
      var o = el("option", { value: id, text: id + " (" + rows + " keywords)" });
      sel.appendChild(o);
    });
    sel.onchange = function () {
      if (sel.value) location.href = rel("stack.html?lang=" + encodeURIComponent(sel.value));
    };
    var q = new URLSearchParams(location.search).get("lang");
    if (q) sel.value = q;
    return sel;
  }
  function inject(data, bundle) {
    var head = document.querySelector("header.site-head");
    if (!head || head.getAttribute("data-no-spine") === "1") return;
    head.innerHTML = "";
    head.appendChild(el("a", { href: rel("index.html"), class: "brand" }, [
      el("strong", { text: data.brand || "PANINI" })
    ]));
    var nav = el("nav", { class: "spine-nav", "aria-label": "Spine" });
    (data.menu || []).forEach(function (m) {
      if (m.kind === "lang-select") {
        var wrap = el("div", { class: "spine-drop spine-langs" });
        wrap.appendChild(el("a", { href: rel(m.href || "stack.html"), text: m.label }));
        wrap.appendChild(langSelect(bundle));
        nav.appendChild(wrap);
        return;
      }
      var drop = el("div", { class: "spine-drop" });
      drop.appendChild(el("button", { type: "button", text: m.label }));
      var ul = el("ul");
      (m.items || []).forEach(function (it) {
        ul.appendChild(el("li", null, [el("a", { href: rel(it.href), text: it.label })]));
      });
      drop.appendChild(ul);
      nav.appendChild(drop);
    });
    head.appendChild(nav);
  }
  Promise.all([
    fetch(base + "spine.json").then(function (r) { return r.json(); }),
    fetch(base + "engine/bundle.json").then(function (r) { return r.json(); }).catch(function () { return {}; })
  ]).then(function (pair) { inject(pair[0], pair[1]); })
    .catch(function (e) { console.warn("spine", e); });
})();
