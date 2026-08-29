/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Literate PANINI weaver / tangler (Knuth).
 * Upstream cycler .pni files are not rewritten.
 */
import { parseMarkdown, parseIniSections } from "./markdown.js";
import { parse } from "../compiler/parser.js";

export function identSafe(name) {
  const s = String(name).replace(/[^A-Za-z0-9_]/g, "_");
  return /^[A-Za-z]/.test(s) ? s : "C_" + s;
}

function q(s) {
  return '"' + String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").replace(/\r/g, "").slice(0, 240) + '"';
}

const CODE_LEAD = /^(MODULE|SCOPE|END|FUNCTION|PROGRAM|CONSTITUTION|TYPE|CLASS|TRAIT|INTERFACE|IF|ELSE|ELSEIF|WHILE|FOR|FOREACH|RETURN|PRINT|LET|VAR|IMPORT|EXPORT|CYCLER|META_CYCLER|TEST|ENUM|SCHEMA|FILE|INPUT|ENTRY|CONTRACT|INVARIANT|PURPOSE|KIND|VERSION|DOMAIN|ARTIFACT|THEOREM|RULE|GATE|CYCLE|STATE|STAGE|BOOTSTRAP|DOCUMENT|RUNTIME|ESTATE|CLAIM|TASK|SERIALIZE|SIGNAL|COMPONENT|POLICY|PACKAGE|SYNTAX|RESOLUTION|WATCH|ACTOR|EVENT|MODEL|PROMPT|AGENT|CONSTRAINT|MEASUREMENT|CHECKPOINT|RESTORE|PROPERTY|CONFIGURATION)\b/i;

export function extractMeta(src, filename) {
  const md = parseMarkdown(src);
  const ini = parseIniSections(src);
  const fields = {};
  for (const sec of ini.sections || []) Object.assign(fields, sec.fields || {});
  const kv = {};
  for (const line of String(src).split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z][A-Za-z0-9_\-]*)\s*[:=]\s*(.+?)\s*$/);
    if (m) kv[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  const title = md.title || fields.name || kv.NAME || kv.name || filename;
  const kind = fields.kind || kv.KIND || kv.TYPE || kv.type || "cycler";
  const sections = [
    ...(md.sections || []).map((s) => s.title).filter(Boolean),
    ...(ini.sections || []).map((s) => s.title).filter(Boolean),
  ].slice(0, 40);
  return {
    title: String(title).replace(/^#+\s*/, ""),
    kind: String(kind),
    version: fields.version || kv.VERSION || kv.PNI_VERSION || "1.0.0",
    purpose: fields.purpose || kv.PURPOSE || kv.PRIMARY_PURPOSE || "",
    sections,
    fences: (String(src).match(/```[\s\S]*?```/g) || []).length,
  };
}

export function identityModule(name, src) {
  const meta = extractMeta(src, name);
  const id = identSafe(name);
  const secList = "[" + meta.sections.map((s) => q(s)).join(", ") + "]";
  return `MODULE Cycler_${id}
FUNCTION cycler_identity()
    RETURN {name: ${q(name)}, title: ${q(meta.title)}, kind: ${q(meta.kind)}, version: ${q(meta.version)}, literate: TRUE, sections: ${secList}}
END
FUNCTION main()
    id = cycler_identity()
    PRINT id.name
    RETURN 0
END
END
`;
}

export function tangle(name, src) {
  try {
    parse(src, name);
    return { kind: "native", code: src };
  } catch {
    /* documentation-heavy: extract code-shaped lines */
  }
  const lines = String(src).split(/\n/);
  let fence = null;
  const out = [];
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("```")) {
      fence = fence ? null : (t.slice(3).trim().toLowerCase() || "text");
      out.push("REM fence");
      continue;
    }
    if (fence) {
      if (fence === "pni" || fence === "panini" || fence === "panini-lang") out.push(line);
      else out.push("REM " + line);
      continue;
    }
    if (!t) { out.push(""); continue; }
    if (t.startsWith("#") || /^\s*REM\b/i.test(line) || t.startsWith(";") || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) {
      out.push(t.startsWith("#") ? line : (/^\s*REM\b/i.test(line) ? line : "REM " + line));
      continue;
    }
    if (/^\[[A-Za-z0-9_]+\]/.test(t)) { out.push("REM " + line); continue; }
    if (CODE_LEAD.test(t)) { out.push(line); continue; }
    out.push("REM " + line);
  }
  let code = out.join("\n");
  try {
    parse(code, name + ".tangle");
    if (!/\bFUNCTION\s+main\b/i.test(code) && !/\bPROGRAM\s+main\b/i.test(code)) {
      code += `
FUNCTION main()
    PRINT ${q(name)}
    RETURN 0
END
`;
      parse(code, name + ".tangle-main");
    }
    return { kind: "tangled", code };
  } catch {
    return { kind: "identity", code: identityModule(name, src) };
  }
}

export function weaveCycler(name, src) {
  return tangle(name, src).code;
}
