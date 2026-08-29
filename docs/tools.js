/* Keyword tables below are NOT Hindawi and NOT ILM.
 * Hindawi Shaili Guru is acii2uni | h2c.lex | gcc (see hindawi.html).
 * These remain only as a labelled toy for the mathematician number words.
 */
window.PANINI_TOOLS = {
  HI: { FUNCTION: "कार्य", RETURN: "लौटाओ", END: "अंत", PRINT: "छापो", TRUE: "सत्य", FALSE: "असत्य", IF: "अगर", WHILE: "जबतक", MODULE: "मापांक" },
  AR: { FUNCTION: "دالة", RETURN: "أرجع", END: "نهاية", PRINT: "اطبع", TRUE: "صحيح", FALSE: "خطأ", IF: "إذا", WHILE: "بينما", MODULE: "وحدة" },
  BN: { FUNCTION: "ফাংশন", RETURN: "ফেরত", END: "শেষ", PRINT: "ছাপা", TRUE: "সত্য", FALSE: "মিথ্যা", IF: "যদি", WHILE: "যতক্ষণ", MODULE: "মডিউল" },
  TA: { FUNCTION: "செயல்", RETURN: "திருப்பு", END: "முடிவு", PRINT: "அச்சிடு", TRUE: "உண்மை", FALSE: "பொய்", IF: "ஆனால்", WHILE: "வரை", MODULE: "தொகுதி" },
  TE: { FUNCTION: "పని", RETURN: "తిరిగి", END: "ముగింపు", PRINT: "ముద్రించు", TRUE: "నిజం", FALSE: "అబద్ధం", IF: "అయితే", WHILE: "వరకు", MODULE: "మాడ్యూల్" },
  SA: { "शून्य": 0, "एक": 1, "द्वि": 2, "त्रि": 3, "चतुर्": 4, "पञ्च": 5, "षट्": 6, "सप्त": 7, "अष्ट": 8, "नव": 9, "दश": 10, "योग": "+", "गुणन": "*" },
};
window.PANINI_TOOLS.project = function (src, table) {
  let s = src;
  for (const [en, other] of Object.entries(table)) s = s.split(en).join(other);
  return s;
};
window.PANINI_TOOLS.deproject = function (src) {
  let s = src;
  for (const table of [this.HI, this.AR, this.BN, this.TA, this.TE]) {
    for (const [en, other] of Object.entries(table)) s = s.split(other).join(en);
  }
  return s;
};
window.PANINI_TOOLS.sanskritEval = function (line) {
  let s = line.trim();
  for (const [w, v] of Object.entries(this.SA)) s = s.split(w).join(String(v));
  if (!/^[\d+\-*/().\s]+$/.test(s)) return "unparsed: " + line;
  try { return Function("return (" + s + ")")(); } catch { return "unparsed: " + line; }
};
window.PANINI_TOOLS.axes = [
  "evaluation", "typing", "memory", "concurrency", "effects", "binding",
  "dispatch", "representation", "verification", "metaprogram", "distribution",
  "persistence", "provenance",
];
