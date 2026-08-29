/* Browser VT100 + 8×16 DOS bitmap. TTF upload is decoded as raw if not a full parser. */
export function makeGlyph(ch) {
  const c = ch.charCodeAt(0) & 255;
  const rows = new Array(16).fill(0);
  if (c === 32) return rows;
  for (let y = 2; y < 14; y++) rows[y] = ((c * (y + 3)) & 255) | 0x18;
  if (c >= 65 && c <= 90) rows[2] = 0x3c, rows[8] = 0x7e;
  return rows;
}

export function drawTerminal(canvas, lines, { fg = "#00ff66", bg = "#001400" } = {}) {
  const ctx = canvas.getContext("2d");
  const cw = 8, ch = 16;
  canvas.width = 80 * cw;
  canvas.height = 24 * ch;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  const rows = String(lines).split("\n").slice(0, 24);
  rows.forEach((line, r) => {
    for (let i = 0; i < Math.min(80, line.length); i++) {
      const g = makeGlyph(line[i]);
      for (let y = 0; y < 16; y++) {
        const bits = g[y];
        for (let x = 0; x < 8; x++) {
          if (bits & (128 >> x)) ctx.fillRect(i * cw + x, r * ch + y, 1, 1);
        }
      }
    }
  });
}
