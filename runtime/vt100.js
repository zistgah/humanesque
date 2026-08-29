/** VT100 / ANSI subset: cursor, erase, SGR colors, wrap. */

const COLORS = {
  30: [0, 0, 0], 31: [192, 0, 0], 32: [0, 192, 0], 33: [192, 192, 0],
  34: [0, 0, 192], 35: [192, 0, 192], 36: [0, 192, 192], 37: [192, 192, 192],
  90: [64, 64, 64], 91: [255, 80, 80], 92: [80, 255, 80], 93: [255, 255, 80],
  94: [80, 80, 255], 95: [255, 80, 255], 96: [80, 255, 255], 97: [255, 255, 255],
};

export function createVt100({ rows = 24, cols = 80 } = {}) {
  const term = {
    rows, cols,
    grid: [],
    r: 0, c: 0,
    saved: { r: 0, c: 0 },
    fg: 37, bg: 40, bold: false,
    fontName: "dos-8x16",
  };
  resetGrid(term);
  return term;
}

function cell(term, ch = " ") {
  return { ch, fg: term.fg, bg: term.bg, bold: term.bold };
}

function resetGrid(term) {
  term.grid = Array.from({ length: term.rows }, () => Array.from({ length: term.cols }, () => cell(term, " ")));
  term.r = 0; term.c = 0;
}

export function vtWrite(term, text) {
  const s = String(text);
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "\x1b") {
      i = parseEsc(term, s, i + 1);
      continue;
    }
    if (ch === "\n") { term.r = Math.min(term.rows - 1, term.r + 1); term.c = 0; i++; continue; }
    if (ch === "\r") { term.c = 0; i++; continue; }
    if (ch === "\b") { term.c = Math.max(0, term.c - 1); i++; continue; }
    if (ch === "\t") { term.c = Math.min(term.cols - 1, term.c + (8 - (term.c % 8))); i++; continue; }
    if (ch === "\x07") { i++; continue; }
    put(term, ch);
    i++;
  }
  return term;
}

function put(term, ch) {
  if (term.r >= term.rows) term.r = term.rows - 1;
  if (term.c >= term.cols) { term.c = 0; term.r = Math.min(term.rows - 1, term.r + 1); }
  term.grid[term.r][term.c] = cell(term, ch);
  term.c++;
  if (term.c >= term.cols) { term.c = 0; term.r = Math.min(term.rows - 1, term.r + 1); }
}

function parseEsc(term, s, i) {
  if (s[i] === "7") { term.saved = { r: term.r, c: term.c }; return i + 1; }
  if (s[i] === "8") { term.r = term.saved.r; term.c = term.saved.c; return i + 1; }
  if (s[i] !== "[") return i + 1;
  i++;
  let raw = "";
  while (i < s.length && s[i] >= "0" && s[i] <= "?") { raw += s[i]; i++; }
  const cmd = s[i] || "";
  i++;
  const nums = raw.split(";").filter(Boolean).map((n) => Number(n) || 0);
  const n = nums[0] || 0;
  if (cmd === "A") term.r = Math.max(0, term.r - (n || 1));
  else if (cmd === "B") term.r = Math.min(term.rows - 1, term.r + (n || 1));
  else if (cmd === "C") term.c = Math.min(term.cols - 1, term.c + (n || 1));
  else if (cmd === "D") term.c = Math.max(0, term.c - (n || 1));
  else if (cmd === "H" || cmd === "f") {
    term.r = Math.max(0, Math.min(term.rows - 1, (nums[0] || 1) - 1));
    term.c = Math.max(0, Math.min(term.cols - 1, (nums[1] || 1) - 1));
  }
  else if (cmd === "J") eraseDisplay(term, n);
  else if (cmd === "K") eraseLine(term, n);
  else if (cmd === "m") applySgr(term, nums.length ? nums : [0]);
  else if (cmd === "s") term.saved = { r: term.r, c: term.c };
  else if (cmd === "u") { term.r = term.saved.r; term.c = term.saved.c; }
  return i;
}

function eraseDisplay(term, n) {
  if (n === 2 || n === 3) { resetGrid(term); return; }
  if (n === 0) {
    eraseLine(term, 0);
    for (let r = term.r + 1; r < term.rows; r++) term.grid[r] = term.grid[r].map(() => cell(term, " "));
  }
}

function eraseLine(term, n) {
  const row = term.grid[term.r];
  if (n === 2) { term.grid[term.r] = row.map(() => cell(term, " ")); return; }
  const start = n === 1 ? 0 : term.c;
  const end = n === 1 ? term.c : term.cols;
  for (let c = start; c < end; c++) row[c] = cell(term, " ");
}

function applySgr(term, nums) {
  for (const n of nums) {
    if (n === 0) { term.fg = 37; term.bg = 40; term.bold = false; }
    else if (n === 1) term.bold = true;
    else if (n === 22) term.bold = false;
    else if ((n >= 30 && n <= 37) || (n >= 90 && n <= 97)) term.fg = n;
    else if ((n >= 40 && n <= 47) || (n >= 100 && n <= 107)) term.bg = n;
    else if (n === 39) term.fg = 37;
    else if (n === 49) term.bg = 40;
  }
}

export function vtPlain(term) {
  return term.grid.map((row) => row.map((c) => c.ch).join("").replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
}

export function vtSnapshot(term) {
  return {
    rows: term.rows, cols: term.cols, r: term.r, c: term.c,
    fontName: term.fontName,
    text: vtPlain(term),
  };
}

export { COLORS };
