/* Copyright (C) 1993-2026 Abhishek Choudhary
 * SPDX-License-Identifier: GPL-3.0-or-later
 * One terminal: VT100 display + shell (bash | COMMAND.COM).
 */
(function (g) {
  const cols = 80, rows = 24;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(" "));
  let r = 0, c = 0;
  function put(ch) {
    if (ch === "\n") { r = Math.min(rows - 1, r + 1); c = 0; return; }
    if (ch === "\r") { c = 0; return; }
    if (ch === "\b") { c = Math.max(0, c - 1); return; }
    if (ch === "\x1b") return;
    grid[r][c] = ch;
    c++;
    if (c >= cols) { c = 0; r = Math.min(rows - 1, r + 1); }
  }
  function write(s) {
    for (const ch of String(s)) put(ch);
  }
  function dump() {
    return grid.map((row) => row.join("").replace(/\s+$/, "")).join("\n");
  }
  function paint(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = 8, ch = 16;
    canvas.width = cols * cw;
    canvas.height = rows * ch;
    ctx.fillStyle = "#001400";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff66";
    ctx.font = "14px ui-monospace, monospace";
    dump().split("\n").forEach((line, i) => ctx.fillText(line, 2, 14 + i * ch));
    ctx.fillRect(c * cw, r * ch, 7, 14);
  }
  function exec(line, shell) {
    const prompt = shell === "command" ? "C>" : "$";
    write(prompt + " " + line + "\n");
    const out = shell === "command"
      ? g.PANINI_CONSOLE.commandCom(line)
      : g.PANINI_CONSOLE.bash(line);
    if (out === "\x1b[2J") {
      for (let y = 0; y < rows; y++) grid[y] = Array(cols).fill(" ");
      r = 0; c = 0;
    } else if (out) write(String(out) + "\n");
  }
  write("VT100 80x24  shell=bash|COMMAND.COM\n");
  g.PANINI_VT = { write, dump, paint, exec, grid };
})(window);
