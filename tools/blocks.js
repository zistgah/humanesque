/** Blocks frontend: Scratch-like JSON ↔ PANINI source. */

export function blocksToPanini(doc) {
  const lines = ["MODULE BlocksProgram", "FUNCTION main()"];
  for (const b of doc.blocks || []) {
    if (b.type === "print" || b.type === "say") lines.push(`    PRINT ${JSON.stringify(b.text ?? b.args?.[0] ?? "")}`);
    else if (b.type === "forward") lines.push(`    FORWARD ${Number(b.n || 0)}`);
    else if (b.type === "right") lines.push(`    RIGHT ${Number(b.n || 0)}`);
    else if (b.type === "set") lines.push(`    ${b.name} = ${b.value}`);
    else if (b.type === "call") lines.push(`    ${b.name}(${(b.args || []).join(", ")})`);
  }
  lines.push("    RETURN 0", "END", "END");
  return lines.join("\n") + "\n";
}

export function paniniToBlocks(source) {
  const blocks = [];
  for (const line of source.split("\n")) {
    const t = line.trim();
    let m = t.match(/^PRINT\s+(.+)$/);
    if (m) { blocks.push({ type: "print", text: m[1].replace(/^"|"$/g, "") }); continue; }
    m = t.match(/^FORWARD\s+(\d+)/); if (m) { blocks.push({ type: "forward", n: Number(m[1]) }); continue; }
    m = t.match(/^RIGHT\s+(\d+)/); if (m) { blocks.push({ type: "right", n: Number(m[1]) }); continue; }
  }
  return { blocks };
}
