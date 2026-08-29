/* tree-rev: 2026.08.28 */
/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
/** ILM projection: human representation → canonical English keywords.
 *  Architectural scope claim of 68 systems is NOT proven here.
 *  Covered projections: latin_en, devanagari_hi, arabic_ar (keyword subset).
 */
export const PROJECTIONS = {
  latin_en: {},
  devanagari_hi: {
    "कार्य": "FUNCTION",
    "फलन": "FUNCTION",
    "लौटाओ": "RETURN",
    "वापस": "RETURN",
    "अगर": "IF",
    "अन्यथा": "ELSE",
    "अंत": "END",
    "दायरा": "SCOPE",
    "सत्य": "TRUE",
    "असत्य": "FALSE",
    "छापो": "PRINT",
    "जबतक": "WHILE",
    "प्रत्येक": "FOREACH",
    "में": "IN",
    "मापांक": "MODULE",
  },
  arabic_ar: {
    "دالة": "FUNCTION",
    "أرجع": "RETURN",
    "إذا": "IF",
    "وإلا": "ELSE",
    "نهاية": "END",
    "نطاق": "SCOPE",
    "صحيح": "TRUE",
    "خطأ": "FALSE",
    "اطبع": "PRINT",
  },
};

export function projectToCanonical(source, projection = "latin_en") {
  const table = PROJECTIONS[projection] || {};
  if (Object.keys(table).length === 0) return source;
  const keys = Object.keys(table).sort((a, b) => b.length - a.length);
  let out = source;
  for (const k of keys) {
    out = out.split(k).join(table[k]);
  }
  return out;
}

export function detectProjection(source) {
  if (/[\u0900-\u097F]/.test(source)) return "devanagari_hi";
  if (/[\u0600-\u06FF]/.test(source)) return "arabic_ar";
  return "latin_en";
}
