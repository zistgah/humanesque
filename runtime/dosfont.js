/** DOS / VGA 8×16 bitmap fonts (CP437-style raw .f16 = 256×16 bytes). */

export function makeDos8x16() {
  const data = new Uint8Array(256 * 16);
  for (let c = 32; c < 127; c++) plotAscii(data, c);
  plotBox(data);
  return data;
}

function row(data, ch, y, bits) {
  data[ch * 16 + y] = bits & 0xff;
}

function plotAscii(data, ch) {
  const g = GLYPHS[String.fromCharCode(ch)];
  if (!g) {
    row(data, ch, 15, 0);
    return;
  }
  for (let y = 0; y < 16; y++) row(data, ch, y, g[y] || 0);
}

const GLYPHS = {};

function pat(ch, rows) {
  const out = new Array(16).fill(0);
  const pad = Math.floor((16 - rows.length) / 2);
  for (let i = 0; i < rows.length; i++) {
    let bits = 0;
    const s = rows[i].padEnd(8, " ");
    for (let x = 0; x < 8; x++) if (s[x] === "#") bits |= 128 >> x;
    out[pad + i] = bits;
  }
  GLYPHS[ch] = out;
}

pat(" ", []);
pat("!", ["##", "##", "##", "##", "##", "", "##"]);
pat("\"", ["# #", "# #"]);
pat("#", [" # # ", "#####", " # # ", "#####", " # # "]);
pat("$", [" ###", "# #", " ##", "  # #", " ###"]);
pat("%", ["##   #", "##  #", "   #", "  #  ##", " #   ##"]);
pat("&", [" ##", "#  #", " ##", "#  # #", " ## #"]);
pat("'", ["##", "#"]);
pat("(", [" #", "#", "#", "#", "#", " #"]);
pat(")", ["#", " #", " #", " #", " #", "#"]);
pat("*", ["  #", "# # #", " ###", "# # #", "  #"]);
pat("+", ["  #", "  #", "#####", "  #", "  #"]);
pat(",", ["", "", "", "", "##", "#"]);
pat("-", ["#####"]);
pat(".", ["", "", "", "", "##", "##"]);
pat("/", ["    #", "   #", "  #", " #", "#"]);
for (let d = 0; d <= 9; d++) {
  const S = [
    " ### ", "#   #", "#  ##", "# # #", "##  #", "#   #", " ### ",
  ];
  // keep simple shared body; override per digit below
}
pat("0", [" ### ", "#   #", "#  ##", "# # #", "##  #", "#   #", " ### "]);
pat("1", ["  #", " ##", "  #", "  #", "  #", "  #", " ###"]);
pat("2", [" ### ", "#   #", "    #", "   #", "  #", " #", "#####"]);
pat("3", [" ### ", "#   #", "    #", "  ## ", "    #", "#   #", " ### "]);
pat("4", ["   #", "  ##", " # #", "#  #", "#####", "   #", "   #"]);
pat("5", ["#####", "#", "#### ", "    #", "    #", "#   #", " ### "]);
pat("6", [" ### ", "#", "#### ", "#   #", "#   #", "#   #", " ### "]);
pat("7", ["#####", "    #", "   #", "  #", " #", " #", " #"]);
pat("8", [" ### ", "#   #", "#   #", " ### ", "#   #", "#   #", " ### "]);
pat("9", [" ### ", "#   #", "#   #", " ####", "    #", "    #", " ### "]);
pat(":", ["##", "##", "", "##", "##"]);
pat(";", ["##", "##", "", "##", "#"]);
pat("<", ["   #", "  #", " #", "  #", "   #"]);
pat("=", ["#####", "", "#####"]);
pat(">", ["#", " #", "  #", " #", "#"]);
pat("?", [" ### ", "#   #", "    #", "   #", "  #", "", "  #"]);
pat("@", [" ### ", "#   #", "# ###", "# # #", "# ###", "#", " ####"]);
const letters = {
  A: [" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  B: ["#### ", "#   #", "#   #", "#### ", "#   #", "#   #", "#### "],
  C: [" ### ", "#   #", "#", "#", "#", "#   #", " ### "],
  D: ["#### ", "#   #", "#   #", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#", "#", "####", "#", "#", "#####"],
  F: ["#####", "#", "#", "####", "#", "#", "#"],
  G: [" ### ", "#   #", "#", "# ###", "#   #", "#   #", " ### "],
  H: ["#   #", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"],
  I: [" ###", "  #", "  #", "  #", "  #", "  #", " ###"],
  J: ["  ###", "   #", "   #", "   #", "   #", "#  #", " ## "],
  K: ["#   #", "#  #", "# #", "##", "# #", "#  #", "#   #"],
  L: ["#", "#", "#", "#", "#", "#", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#   #", "#### ", "#", "#", "#"],
  Q: [" ### ", "#   #", "#   #", "#   #", "# # #", "#  #", " ## #"],
  R: ["#### ", "#   #", "#   #", "#### ", "# #", "#  #", "#   #"],
  S: [" ### ", "#   #", "#", " ### ", "    #", "#   #", " ### "],
  T: ["#####", "  #", "  #", "  #", "  #", "  #", "  #"],
  U: ["#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", "#   #", "#   #", " # #", "  #"],
  W: ["#   #", "#   #", "#   #", "# # #", "# # #", "## ##", "#   #"],
  X: ["#   #", "#   #", " # #", "  #", " # #", "#   #", "#   #"],
  Y: ["#   #", "#   #", " # #", "  #", "  #", "  #", "  #"],
  Z: ["#####", "    #", "   #", "  #", " #", "#", "#####"],
};
for (const [k, v] of Object.entries(letters)) {
  pat(k, v);
  pat(k.toLowerCase(), v);
}
pat("[", ["###", "#", "#", "#", "#", "#", "###"]);
pat("\\", ["#", " #", "  #", "   #", "    #"]);
pat("]", ["###", "  #", "  #", "  #", "  #", "  #", "###"]);
pat("^", ["  #", " # #", "#   #"]);
pat("_", ["", "", "", "", "", "", "#####"]);
pat("`", ["#", " #"]);
pat("{", ["  ##", " #", " #", "##", " #", " #", "  ##"]);
pat("|", ["#", "#", "#", "#", "#", "#", "#"]);
pat("}", ["##", " #", " #", "  ##", " #", " #", "##"]);
pat("~", [" #  #", "#  # "]);

function plotBox(data) {
  const full = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
  for (let y = 0; y < 16; y++) data[219 * 16 + y] = full[y];
  for (let y = 8; y < 16; y++) data[220 * 16 + y] = 0xff;
  for (let y = 0; y < 8; y++) data[223 * 16 + y] = 0xff;
}

export function parseF16(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (u8.length < 16) throw new Error("font too small");
  const height = u8.length % 256 === 0 ? u8.length / 256 : 16;
  const width = 8;
  return { kind: "dos-bitmap", width, height, glyphs: 256, data: u8 };
}

export function glyphBits(font, code) {
  const ch = code & 255;
  const h = font.height || 16;
  const rows = [];
  for (let y = 0; y < h; y++) rows.push(font.data[ch * h + y] || 0);
  return rows;
}

export function renderTextBitmap(font, text, cols = 80) {
  const h = font.height || 16;
  const lines = String(text).split("\n");
  const rows = [];
  for (const line of lines) {
    const slice = [];
    for (let y = 0; y < h; y++) {
      const bits = [];
      for (let i = 0; i < Math.min(line.length, cols); i++) {
        const g = font.data[(line.charCodeAt(i) & 255) * h + y] || 0;
        for (let x = 0; x < 8; x++) bits.push((g & (128 >> x)) ? 1 : 0);
      }
      slice.push(bits);
    }
    rows.push(...slice);
  }
  return { width: Math.min(cols, Math.max(0, ...lines.map((l) => l.length))) * 8, height: rows.length, rows };
}
