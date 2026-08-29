/** Retrieved mapping of common Sanskrit quantity words → numbers.
 *  Not a reconstruction of Pāṇinian grammar; a lab seed.
 */
export const NUMERALS = {
  शून्य: 0, एक: 1, द्वि: 2, द्वे: 2, त्रि: 3, चतुर्: 4, पञ्च: 5,
  षष्: 6, सप्त: 7, अष्ट: 8, नव: 9, दश: 10,
  योग: "+", वियोग: "-", गुणन: "*", भाग: "/",
};

export function parseSanskritMath(text) {
  const tokens = text.trim().split(/\s+/);
  const out = [];
  for (const t of tokens) {
    if (t in NUMERALS) out.push({ kind: typeof NUMERALS[t] === "number" ? "num" : "op", value: NUMERALS[t], surface: t });
    else if (/^\d+$/.test(t)) out.push({ kind: "num", value: Number(t), surface: t });
    else out.push({ kind: "word", value: t, surface: t });
  }
  return { tokens: out, epistemic_status: "RETRIEVED_PARTIAL" };
}

export function evalSanskritMath(text) {
  const { tokens } = parseSanskritMath(text);
  let acc = null;
  let op = "+";
  for (const t of tokens) {
    if (t.kind === "op") { op = t.value; continue; }
    if (t.kind === "num") {
      if (acc == null) acc = t.value;
      else if (op === "+") acc += t.value;
      else if (op === "-") acc -= t.value;
      else if (op === "*") acc *= t.value;
      else if (op === "/") acc /= t.value;
    }
  }
  return acc;
}
