/**
 * Resource monitor — linear-memory / VFS pressure.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
export function snapshot(extra) {
  const mem = typeof process !== "undefined" && process.memoryUsage ? process.memoryUsage() : {};
  return {
    when: new Date().toISOString(),
    rss: mem.rss || 0,
    heapUsed: mem.heapUsed || 0,
    heapTotal: mem.heapTotal || 0,
    note: "Browser: wire to WebAssembly.Memory + IndexedDB paging (REQ-10).",
    ...(extra || {}),
  };
}

export function vfsBytes(vfs) {
  if (!vfs || typeof vfs !== "object") return 0;
  let n = 0;
  const walk = (node) => {
    if (!node) return;
    if (typeof node.content === "string") n += node.content.length;
    if (node.children) Object.values(node.children).forEach(walk);
  };
  walk(vfs.root || vfs);
  return n;
}
