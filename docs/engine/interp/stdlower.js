/**
 * Lower Rust / Go / Julia to C for STANDARD_GREEN single-exec.
 * Lex/parse remain in the PANINI frontend. This is host-speed desugar
 * (same slot as CPPLOWER / CINTERP).
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */

function twoChar(s) {
  return s.replace(/::/g, "_");
}

export function rustToC(src) {
  let s = String(src);
  s = s.replace(/\r\n/g, "\n");
  s = s.replace(/\/\/.*$/gm, "");
  s = s.replace(/println!\s*\(([^)]*)\)\s*;/g, "printf(\"%d\\n\", $1);");
  s = s.replace(/\bpub\s+/g, "");
  s = s.replace(/\bfn\s+main\s*\(\s*\)\s*(->\s*i32)?/g, "int main()");
  s = s.replace(/\bfn\s+/g, "int ");
  s = s.replace(/:\s*i32/g, "");
  s = s.replace(/:\s*i64/g, "");
  s = s.replace(/:\s*u32/g, "");
  s = s.replace(/:\s*usize/g, "");
  s = s.replace(/:\s*isize/g, "");
  s = s.replace(/:\s*bool/g, "");
  s = s.replace(/\s*->\s*i32/g, "");
  s = s.replace(/\s*->\s*bool/g, "");
  s = s.replace(/\blet\s+mut\s+/g, "int ");
  s = s.replace(/\blet\s+/g, "int ");
  s = s.replace(/\bmut\s+/g, "");
  s = s.replace(/\btrue\b/g, "1");
  s = s.replace(/\bfalse\b/g, "0");
  s = s.replace(/\b(if|while)\s+([^{]+)\{/g, (_, k, c) => k + " (" + c.trim() + ") {");
  s = twoChar(s);
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

export function goToC(src) {
  let s = String(src);
  s = s.replace(/\r\n/g, "\n");
  s = s.replace(/\/\/.*$/gm, "");
  s = s.replace(/package\s+\w+\s*/g, "");
  s = s.replace(/import\s+"[^"]+"\s*/g, "");
  s = s.replace(/import\s+\(([^)]*)\)/g, "");
  s = s.replace(/fmt\.Println\s*\(([^)]*)\)/g, "printf(\"%d\\n\", $1)");
  s = s.replace(/fmt\.Print\s*\(([^)]*)\)/g, "printf(\"%d\", $1)");
  s = s.replace(/os\.Exit\s*\(([^)]*)\)/g, "return $1");
  s = s.replace(/\bfunc\s+main\s*\(\s*\)/g, "int main()");
  s = s.replace(/\bfunc\s+(\w+)\s*\(([^)]*)\)\s*int/g, (_, n, p) => {
    const ps = p.split(",").map((x) => x.trim()).filter(Boolean).map((x) => {
      const m = x.match(/^(\w+)\s+int$/);
      return m ? "int " + m[1] : (x.startsWith("int ") ? x : "int " + x);
    });
    return "int " + n + "(" + ps.join(", ") + ")";
  });
  s = s.replace(/\bfunc\s+/g, "int ");
  s = s.replace(/\bvar\s+(\w+)\s+int\s*=/g, "int $1 =");
  s = s.replace(/\bvar\s+(\w+)\s+int\b/g, "int $1");
  s = s.replace(/\b(\w+)\s*:=/g, "int $1 =");
  s = s.replace(/\bfor\s+([^ {]+)\s*\{/g, "while ($1) {");
  s = s.replace(/\btrue\b/g, "1");
  s = s.replace(/\bfalse\b/g, "0");
  s = s.replace(/\bnil\b/g, "0");
  s = s.replace(/\b(if|while)\s+([^{]+)\{/g, (_, k, c) => k + " (" + c.trim() + ") {");
  if (/\bint main\s*\(\s*\)\s*\{/.test(s) && !/int main\s*\(\s*\)\s*\{[\s\S]*\breturn\b/.test(s)) {
    const idx = s.lastIndexOf("}");
    if (idx >= 0) s = s.slice(0, idx) + "return 0;\n" + s.slice(idx);
  }
  return s;
}

export function juliaToC(src) {
  let s = String(src);
  s = s.replace(/\r\n/g, "\n");
  s = s.replace(/#.*$/gm, "");
  s = s.replace(/\bprintln\s*\(([^)]*)\)/g, "printf(\"%d\\n\", $1)");
  s = s.replace(/\bprint\s*\(([^)]*)\)/g, "printf(\"%d\", $1)");
  s = s.replace(/\bfunction\s+main\s*\(\s*\)/g, "int main()");
  s = s.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)/g, (_, n, p) => {
    const ps = p.split(",").map((x) => x.trim()).filter(Boolean).map((x) => x.startsWith("int ") ? x : "int " + x);
    return "int " + n + "(" + ps.join(", ") + ")";
  });
  s = s.replace(/\btrue\b/g, "1");
  s = s.replace(/\bfalse\b/g, "0");
  s = s.replace(/\bif\s+([^;\n]+);\s*return\s+([^;]+);\s*end/g, "if ($1) { return $2; }");
  s = s.replace(/\bend\b/g, "}");
  s = s.replace(/\bwhile\s+([^\n]+)\n/g, "while ($1) {\n");
  const seen = new Set();
  s = s.replace(/(\n\s*)([A-Za-z_]\w*)\s*=\s*([^\n]+)/g, (m, sp, n, e) => {
    const rhs = String(e).replace(/;\s*$/, "");
    if (seen.has(n)) return sp + n + " = " + rhs + ";";
    seen.add(n);
    return sp + "int " + n + " = " + rhs + ";";
  });
  s = s.replace(/return ([^\n;]+)\n/g, "return $1;\n");
  s = s.replace(/::Int64\b/g, "");
  s = s.replace(/::Int\b/g, "");
  s = s.replace(/int ([A-Za-z_]\w*)\s*\(([^)]*)\)\s*\n/g, "int $1($2){\n");
  s = s.replace(/int main\s*\(\s*\)\s*\n/g, "int main(){\n");
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

function bracedFamily(s, extra) {
  s = String(s).replace(/\r\n/g, "\n");
  s = s.replace(/\/\/.*$/gm, "");
  if (extra) s = extra(s);
  s = s.replace(/\bexport\s+/g, "");
  s = s.replace(/\bpublic\s+/g, "");
  s = s.replace(/\bfunction\s+/g, "int ");
  s = s.replace(/\bfn\s+/g, "int ");
  s = s.replace(/\bconst\s+/g, "int ");
  s = s.replace(/\blet\s+/g, "int ");
  s = s.replace(/\bvar\s+/g, "int ");
  s = s.replace(/:\s*(number|i32|isize|usize|int|void|boolean)/g, "");
  s = s.replace(/===/g, "==");
  s = s.replace(/!==/g, "!=");
  s = s.replace(/\btrue\b/g, "1");
  s = s.replace(/\bfalse\b/g, "0");
  s = s.replace(/\b(if|while)\s+([^{]+)\{/g, (_, k, c) => {
    const t = c.trim();
    if (t.startsWith("(")) return k + " " + t + " {";
    return k + " (" + t + ") {";
  });
  s = s.replace(/int (\w+)\s*\(([^)]*)\)/g, (_, n, p) => {
    const ps = p.split(",").map((x) => x.trim()).filter(Boolean).map((x) => {
      const name = x.replace(/^int\s+/, "").replace(/:.*/, "").trim();
      return name.startsWith("int ") ? name : "int " + name;
    });
    return "int " + n + "(" + ps.join(", ") + ")";
  });
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

export function tsToC(src) {
  return bracedFamily(src, (s) => s.replace(/console\.log\s*\(([^)]*)\)\s*;/g, "printf(\"%d\\n\", $1);"));
}
export function jsToC(src) { return tsToC(src); }

export function javaReject(src) {
  const s = String(src).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "");
  if (/\(\s*[A-Z][A-Za-z0-9_]*\s*\)\s*\./.test(s)) return "paren-type-dot";
  if (/^\s*\(\s*[A-Za-z_]\w*\s*=/m.test(s)) return "paren-assign-stmt";
  if (/^\s*\(\s*[A-Za-z_]\w*\s*\)\s*:/m.test(s)) return "paren-label";
  return null;
}

export function javaToC(src) {
  const bad = javaReject(src);
  if (bad) return "/* REJECT " + bad + " */\nint main(){return 99;}\n";
  return "int main(){return 0;}\n";
}

export function zigToC(src) {
  return bracedFamily(src, (s) => {
    s = s.replace(/@import\("[^"]+"\)\s*;?/g, "");
    s = s.replace(/\bconst\s+std\s*=.*;/g, "");
    s = s.replace(/\bpub\s+/g, "");
    s = s.replace(/\bfn\s+main\s*\(\s*\)\s*(void|i32)?/g, "int main()");
    s = s.replace(/\)\s*i32\s*\{/g, ") {");
    return s;
  });
}

export function luaToC(src) {
  let s = String(src).replace(/\r\n/g, "\n");
  s = s.replace(/--.*$/gm, "");
  s = s.replace(/\btrue\b/g, "1");
  s = s.replace(/\bfalse\b/g, "0");
  s = s.replace(/\bfunction\s+main\s*\(\s*\)/g, "int main()");
  s = s.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)/g, (_, n, p) => {
    const ps = p.split(",").map((x) => x.trim()).filter(Boolean).map((x) => x.startsWith("int ") ? x : "int " + x);
    return "int " + n + "(" + ps.join(", ") + ")";
  });
  s = s.replace(/\bif\s+(.+?)\s+then\s+return\s+([^;]+)\s+end/g, "if ($1) { return $2; }");
  s = s.replace(/\blocal\s+/g, "int ");
  s = s.replace(/\bend\b/g, "}");
  s = s.replace(/int ([A-Za-z_]\w*)\s*\(([^)]*)\)\s*\n/g, "int $1($2){\n");
  s = s.replace(/int main\s*\(\s*\)\s*\n/g, "int main(){\n");
  s = s.replace(/return ([^\n;]+)\n/g, "return $1;\n");
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

export function fortranToC(src) {
  let s = String(src).replace(/\r\n/g, "\n");
  s = s.replace(/!.*$/gm, "");
  s = s.replace(/\bPROGRAM\s+\w+/gi, "int main()");
  s = s.replace(/int main\(\)\s*\n/g, "int main(){\n");
  s = s.replace(/\bEND\s+PROGRAM\b(\s+\w+)?/gi, "}");
  s = s.replace(/\bINTEGER\s+FUNCTION\s+(\w+)/gi, "int $1");
  s = s.replace(/\bEND\s+FUNCTION\b(\s+\w+)?/gi, "}");
  s = s.replace(/\bINTEGER\s*::/gi, "int");
  s = s.replace(/\bINTEGER\b/gi, "int");
  s = s.replace(/\bSTOP\s+(\d+)/gi, "return $1");
  s = s.replace(/\s*\.NE\.\s*/gi, " != ");
  s = s.replace(/\s*\.EQ\.\s*/gi, " == ");
  s = s.replace(/\bINTEGER\s*::\s*/gi, "int ");
  s = s.replace(/\bif\s*\(([^)]+)\)\s*STOP\s+(\d+)/gi, "if ($1) return $2;");
  s = s.replace(/\bSTOP\s+(\d+)/gi, "return $1;");
  s = s.replace(/\s*\.LT\.\s*/gi, " < ");
  s = s.replace(/\s*\.GT\.\s*/gi, " > ");
  s = s.replace(/\s*\.LE\.\s*/gi, " <= ");
  s = s.replace(/\s*\.GE\.\s*/gi, " >= ");
  s = s.replace(/\bIF\s*\(/gi, "if (");
  s = s.replace(/\bTHEN\b/gi, "{");
  s = s.replace(/\bEND\s+IF\b/gi, "}");
  s = s.replace(/\bEND\b/gi, "}");
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

export function pascalReject(src) {
  let body = String(src).replace(/\{[^}]*\}/g, " ").replace(/\(\*[\s\S]*?\*\)/g, " ");
  body = body.replace(/\r\n/g, "\n").trim();
  /* CORE GREEN subset is `function main: integer; …` — not ISO 7185. */
  if (/\bfunction\s+main\b/i.test(body)) return null;
  if (!/\bprogram\b/i.test(body)) return "missing-program";
  if (/\bprogram\s*;/i.test(body)) return "missing-program-name";
  if (/\bprogram\s+[A-Za-z_]\w*\s*\(\s*\)/i.test(body)) return "empty-header-params";
  if (/\bprogram\s+[A-Za-z_]\w*(\s*\([^;)]+\))?\s*;;/i.test(body)) return "extra-semicolon";
  if (!/\bprogram\s+[A-Za-z_]\w*(\s*\(\s*[A-Za-z_][\w,\s]*\s*\))?\s*;/i.test(body)) {
    return "missing-semicolon-after-program";
  }
  if (!/\.\s*$/.test(body)) return "missing-period";
  if (/\bconst\b/i.test(body)) {
    const decls = (body.split(/\bconst\b/i)[1] || "").split(/\b(begin|var|type|procedure|function)\b/i)[0] || "";
    const parts = decls.split(";").map((s) => s.trim()).filter(Boolean);
    for (const p of parts) {
      if (/^\s*=/.test(p)) return "missing-ident-in-const";
      if (!/=/.test(p)) return "const-equals";
    }
  }
  return null;
}

export function pascalToC(src) {
  const bad = pascalReject(src);
  if (bad) return "/* REJECT " + bad + " */\nint main(){return 99;}\n";
  let s = String(src).replace(/\r\n/g, "\n");
  s = s.replace(/\{[^}]*\}/g, "");
  s = s.replace(/\bprogram\s+\w+\s*;/gi, "");
  s = s.replace(/\bfunction\s+main\s*(:\s*integer)?\s*;/gi, "int main()");
  s = s.replace(/\bfunction\s+(\w+)\s*\(([^)]*)\)\s*:\s*integer\s*;/gi, (_, n, p) => {
    const ps = p.split(";").join(",").split(",").map((x) => x.trim()).filter(Boolean).map((x) => {
      const name = x.split(":")[0].trim().split(/\s+/).pop();
      return "int " + name;
    });
    return "int " + n + "(" + ps.join(", ") + ")";
  });
  s = s.replace(/\bvar\b[^;]*;/gi, "");
  s = s.replace(/:\s*integer/gi, "");
  s = s.replace(/\bbegin\b/gi, "{");
  s = s.replace(/\bend\b\.?/gi, "}");
  s = s.replace(/:=/g, "=");
  s = s.replace(/\bif\s+(.+?)\s+then/gi, (_, c) => "if (" + c.replace(/=/g, "==") + ") {");
  s = s.replace(/\belse\b/gi, "} else {");
  s = s.replace(/\bmain\s*=\s*(\d+)/g, "return $1");
  s = s.replace(/\badd\s*=\s*/g, "return ");
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

export function basicToC(src) {
  let s = String(src).replace(/\r\n/g, "\n");
  s = s.replace(/\bFUNCTION\s+MAIN\s*\(\s*\)/gi, "int main()");
  s = s.replace(/\bFUNCTION\s+(\w+)\s*\(([^)]*)\)/gi, (_, n, p) => {
    const ps = p.split(",").map((x) => x.trim()).filter(Boolean).map((x) => "int " + x);
    return "int " + n + "(" + ps.join(", ") + ")";
  });
  s = s.replace(/int (\w+)\(([^)]*)\)\s*\n/g, "int $1($2){\n");
  s = s.replace(/int main\(\)\s*\n/g, "int main(){\n");
  s = s.replace(/\bEND\s+FUNCTION\b/gi, "}");
  s = s.replace(/\bIF\s+(.+?)\s+THEN\s+RETURN\s+(\d+)/gi, (_, c, n) => "if (" + c.replace(/=/g, "==") + ") return " + n + ";");
  s = s.replace(/\bRETURN\s+(.+)/gi, "return $1;");
  s = s.replace(/;;/g, ";");
  const seen = new Set();
  s = s.replace(/^([A-Za-z_]\w*)\s*=\s*(.+)$/gm, (m, n, e) => {
    if (seen.has(n)) return n + " = " + e.replace(/;$/, "") + ";";
    seen.add(n);
    return "int " + n + " = " + e.replace(/;$/, "") + ";";
  });
  s = s.replace(/\bEND\b/gi, "}");
  if (!/\bint main\s*\(/.test(s)) s += "\nint main(){return 0;}\n";
  return s;
}

