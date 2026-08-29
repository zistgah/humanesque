/* Canonical site spine. Include on every public page. Do not duplicate menus.
 * Navigation and breadcrumbs live here. Do not reinvent them per page.
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
  var LABELS = {
    "index.html": "Home",
    "standards": "Standards",
    "stack.html": "Stack",
    "nb.html": "Notebook",
    "nb.frozen.html": "Original notebook",
    "workbench.html": "Workbench",
    "frontends.html": "Frontends",
    "languages.html": "Frontends",
    "path": "Path",
    "roundtrip.html": "Romenagri",
    "research.html": "Research",
    "linguist.html": "Linguist",
    "hindawi.html": "Hindawi",
    "ilm": "ILM",
    "deposits": "Deposits",
    "mez": "Mez",
    "sims": "Sims",
    "console.html": "Console",
    "emu.html": "x86 guest",
    "agi.html": "Status",
    "roadmap.html": "Roadmap"
  };
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
  function injectNav(data, bundle) {
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
      drop.querySelector("button").addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = drop.classList.contains("open");
        nav.querySelectorAll(".spine-drop.open").forEach(function (n) { n.classList.remove("open"); });
        if (!open) drop.classList.add("open");
      });
      nav.appendChild(drop);
    });
    head.appendChild(nav);
    var quick = el("nav", { class: "spine-quick", "aria-label": "Primary" });
    [
      ["index.html", "Home"],
      ["workbench.html", "Workbench"],
      ["nb.html", "Notebook"],
      ["stack.html", "Stack"],
      ["standards/", "Standards"],
      ["local.html", "Download"]
    ].forEach(function (pair) {
      quick.appendChild(el("a", { href: rel(pair[0]), text: pair[1] }));
    });
    var zip = el("a", { href: "/panini.zip", text: "panini.zip" });
    zip.setAttribute("download", "panini.zip");
    quick.appendChild(zip);
    head.appendChild(quick);
  }
  function injectCrumbs() {
    var path = (location.pathname || "").replace(/\/+$/, "");
    var segs = path.split("/").filter(Boolean);
    if (segs[0] === "site") segs.shift();
    var nav = document.querySelector("nav.crumbs");
    if (!nav) {
      nav = el("nav", { class: "crumbs", "aria-label": "Breadcrumb" });
      var head = document.querySelector("header.site-head");
      if (head && head.parentNode) head.parentNode.insertBefore(nav, head.nextSibling);
      else document.body.insertBefore(nav, document.body.firstChild);
    }
    nav.innerHTML = "";
    nav.appendChild(el("a", { href: rel("index.html"), text: "Home" }));
    if (!segs.length || (segs.length === 1 && segs[0] === "index.html")) return;
    var acc = [];
    segs.forEach(function (seg, i) {
      acc.push(seg);
      nav.appendChild(el("span", { text: " / " }));
      var last = i === segs.length - 1;
      var name = LABELS[seg] || decodeURIComponent(seg).replace(/\.html$/, "").replace(/[-_]/g, " ");
      if (last) {
        nav.appendChild(el("span", { text: name }));
        return;
      }
      var href;
      if (seg === "standards") href = rel("standards/");
      else if (seg === "path") href = rel("path/");
      else if (seg === "ilm") href = rel("ilm/");
      else if (seg === "deposits") href = rel("deposits/");
      else href = rel(acc.join("/"));
      nav.appendChild(el("a", { href: href, text: name }));
    });
  }
  var FALLBACK = {
    brand: "PANINI",
    menu: [
      { id: "estate", label: "Estate", items: [
        { href: "index.html", label: "Home" },
        { href: "workbench.html", label: "Workbench" },
        { href: "nb.html", label: "Notebook" },
        { href: "local.html", label: "Download zip" }
      ]},
      { id: "machine", label: "Machine", items: [
        { href: "console.html", label: "Console" },
        { href: "nb.html", label: "Notebook" },
        { href: "workbench.html", label: "Workbench" },
        { href: "story.html", label: "Story" }
      ]},
      { id: "languages", label: "Languages", href: "stack.html", items: [
        { href: "stack.html", label: "Stack" },
        { href: "standards/", label: "Standards" }
      ]},
      { id: "cyclers", label: "Cyclers", items: [
        { href: "cyclers.html", label: "Cyclers" },
        { href: "mez/desk.html", label: "Mez desk" }
      ]}
    ]
  };
  injectNav(FALLBACK, {});
  injectCrumbs();
  fetch(base + "spine.json").then(function (r) {
    if (!r.ok) throw new Error("spine.json " + r.status);
    return r.json();
  }).then(function (data) {
    injectNav(data, {});
    injectCrumbs();
    fetch(base + "engine/bundle.json").then(function (r) { return r.json(); }).then(function (bundle) {
      injectNav(data, bundle);
    }).catch(function () {});
  }).catch(function (e) {
    console.warn("spine.json failed, fallback menu stays", e);
  });
})();
