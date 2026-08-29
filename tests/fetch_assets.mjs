/**
 * Fetch large assets the zip must not ship. Called from tests/run.mjs.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import fs from "node:fs";
import path from "node:path";
import { BIOS_URL } from "../runtime/vfs_bios.js";

const SPECS = [
  { file: "n1570.pdf", url: "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf" },
  { file: "go-spec.html", url: "https://go.dev/ref/spec" },
  { file: "python-grammar.html", url: "https://docs.python.org/3.12/reference/grammar.html" },
];

async function get(url) {
  const r = await fetch(url, { redirect: "follow" });
  if (!r.ok) throw new Error(url + " " + r.status);
  return Buffer.from(await r.arrayBuffer());
}

export async function fetchLocalAssets(root) {
  const notes = [];
  const std = path.join(root, "retrieved/standards");
  fs.mkdirSync(std, { recursive: true });
  for (const s of SPECS) {
    const p = path.join(std, s.file);
    if (fs.existsSync(p) && fs.statSync(p).size > 100) {
      notes.push("have " + s.file);
      continue;
    }
    try {
      const buf = await get(s.url);
      fs.writeFileSync(p, buf);
      notes.push("fetched " + s.file + " " + buf.length);
    } catch (e) {
      notes.push("skip " + s.file + " " + e.message);
    }
  }
  const biosDir = path.join(root, "retrieved/ayebios/out");
  fs.mkdirSync(biosDir, { recursive: true });
  const biosPath = path.join(biosDir, "bios.bin");
  if (!(fs.existsSync(biosPath) && fs.statSync(biosPath).size > 1000)) {
    try {
      const buf = await get(BIOS_URL);
      fs.writeFileSync(biosPath, buf);
      notes.push("fetched bios.bin " + buf.length);
    } catch (e) {
      fs.writeFileSync(biosPath, Buffer.from("AYEB\x00SeaBIOS stand-in fetch failed\n"));
      notes.push("bios stub " + e.message);
    }
  } else notes.push("have bios.bin");
  return { notes, biosPath };
}
