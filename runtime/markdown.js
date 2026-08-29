/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Minimal CommonMark-ish extractor for cycler specs that arrived as Markdown.
 */
export function stripFences(src) {
  return String(src).replace(/```[\s\S]*?```/g, (block) => {
    const nl = block.indexOf("\n");
    if (nl < 0) return "";
    return block.slice(nl + 1, block.lastIndexOf("```"));
  });
}

export function parseMarkdown(src) {
  const text = String(src).replace(/\r\n/g, "\n");
  const sections = [];
  let current = { level: 0, title: "(preamble)", body: [] };
  for (const line of text.split("\n")) {
    const m = line.match(/^(#{1,6})\s+(.*)$/);
    if (m) {
      if (current.body.length || current.title !== "(preamble)") sections.push(flush(current));
      current = { level: m[1].length, title: m[2].replace(/\*+/g, "").trim(), body: [] };
    } else current.body.push(line);
  }
  sections.push(flush(current));
  return {
    kind: "markdown",
    title: sections.find((s) => s.level === 1)?.title || sections[0]?.title || "",
    sections,
  };
}

function flush(s) {
  return { level: s.level, title: s.title, body: s.body.join("\n").trim() };
}

export function parseIniSections(src) {
  const sections = [];
  let cur = { title: "(root)", fields: {} };
  for (const raw of String(src).split(/\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith(";")) continue;
    const sec = line.match(/^\[([^\]]+)\]$/);
    if (sec) {
      sections.push(cur);
      cur = { title: sec[1], fields: {} };
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w]*)\s*=\s*(.*)$/);
    if (kv) cur.fields[kv[1]] = kv[2].replace(/^"|"$/g, "");
  }
  sections.push(cur);
  return { kind: "ini", sections };
}
