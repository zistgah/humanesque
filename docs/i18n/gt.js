/* Google Translate for page chrome only. Code, keywords, .uhin, WAT stay untranslated.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
(function () {
  function markCode() {
    document.querySelectorAll("pre, code, textarea, samp, kbd, .mono, .watbox, tt").forEach(function (el) {
      el.classList.add("notranslate");
      el.setAttribute("translate", "no");
    });
  }
  function bar() {
    if (document.getElementById("gt-bar")) return;
    var nav = document.querySelector(".site-head nav") || document.querySelector("header nav") || document.querySelector("header");
    if (!nav) return;
    var sel = document.createElement("select");
    sel.id = "gt-bar";
    sel.title = "Google Translate page chrome. Programming language text is not translated.";
    sel.innerHTML =
      '<option value="">Page language</option>' +
      '<option value="en">English</option>' +
      '<option value="hi">हिन्दी</option>' +
      '<option value="bn">বাংলা</option>' +
      '<option value="ta">தமிழ்</option>' +
      '<option value="te">తెలుగు</option>' +
      '<option value="mr">मराठी</option>' +
      '<option value="gu">ગુજરાતી</option>' +
      '<option value="pa">ਪੰਜਾਬੀ</option>' +
      '<option value="ur">اردو</option>' +
      '<option value="ar">العربية</option>' +
      '<option value="fr">Français</option>' +
      '<option value="es">Español</option>' +
      '<option value="zh-CN">中文</option>' +
      '<option value="ja">日本語</option>';
    sel.onchange = function () {
      if (!sel.value) return;
      var u = location.href.split("#")[0];
      location.href = "https://translate.google.com/translate?sl=auto&tl=" + encodeURIComponent(sel.value) + "&u=" + encodeURIComponent(u);
    };
    nav.appendChild(sel);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { markCode(); bar(); });
  else { markCode(); bar(); }
})();
