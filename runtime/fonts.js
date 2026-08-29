import fs from "node:fs";
import { makeDos8x16, parseF16 } from "./dosfont.js";
import { parseTtf, ttfToDosLike } from "./ttf.js";

const registry = new Map();

export function defaultDosFont() {
  if (!registry.has("dos-8x16")) registry.set("dos-8x16", parseF16(makeDos8x16()));
  return registry.get("dos-8x16");
}

export function loadFont(name, bytes, hint = "") {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const isTtf = u8.length > 4 && u8[0] === 0 && u8[1] === 1 && u8[2] === 0 && u8[3] === 0;
  const kind = hint || (isTtf || name.toLowerCase().endsWith(".ttf") ? "ttf" : "f16");
  let font;
  if (kind === "ttf") font = ttfToDosLike(parseTtf(u8), 16);
  else font = parseF16(u8);
  font.name = name;
  registry.set(name, font);
  return font;
}

export function loadFontFile(name, path) {
  return loadFont(name, fs.readFileSync(path), path.toLowerCase().endsWith(".ttf") ? "ttf" : "f16");
}

export function getFont(name) {
  if (!name || name === "dos-8x16") return defaultDosFont();
  return registry.get(name) || defaultDosFont();
}

export function listFonts() {
  defaultDosFont();
  return [...registry.keys()];
}
