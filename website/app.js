const LAYERS = [
  ["L0","Physical substrate"],["L1","Device physics"],["L2","Digital/compute primitives"],
  ["L3","Hardware architecture"],["L4","Memory/storage"],["L5","Interconnect/I/O"],
  ["L6","Firmware/boot"],["L7","Operating/runtime substrate"],["L8","Execution frameworks"],
  ["L9","Simulation/digital twins"],["L10","Sensorimotor substrate"],["L11","Data substrate"],
  ["L12","Representation/language (ILM)"],["L13","Programming language (PANINI)"],
  ["L14","Compiler/semantic realization"],["L15","Tooling/workbench"],
  ["L16","Interaction/multimodality"],["L17","Model substrate"],["L18","Cognition"],
  ["L19","Coherence/nervous-system"],["L20","Embodiment/action"],
  ["L21","Agent architecture"],["L22","Collective/ecosystem intelligence"],
  ["L23","Metacognition/verification"],["L24","Persistence/continuity"],
  ["L25","Sovereignty/governance"],["L26","Civilizational realization"],
];

const HI = { FUNCTION:"कार्य", RETURN:"लौटाओ", END:"अंत", PRINT:"छापो", TRUE:"सत्य", FALSE:"असत्य", IF:"अगर" };
const AR = { FUNCTION:"دالة", RETURN:"أرجع", END:"نهاية", PRINT:"اطبع", TRUE:"صحيح", FALSE:"خطأ", IF:"إذا" };

const MUSEUM = ["python","rust","javascript","haskell","prolog","sql","basic","logo","lisp","c","julia","assembly","fortran","cobol","forth","java","go","typescript","zig"];

const STATUS = `PANINI.STD.2026.08
panini       VERIFIED
python       VERIFIED_SUBSET  print/def/return/lists/tensor
c            VERIFIED_SUBSET  main/return/printf
cpp          VERIFIED_SUBSET  cout → C frontend
fortran      VERIFIED_SUBSET  PRINT *, expr
rust         VERIFIED_SUBSET  println! expr
typescript   VERIFIED_SUBSET  console.log expr
go           VERIFIED_SUBSET  fmt.Println expr
zig          VERIFIED_SUBSET  debug.print expr
pytorch      PARTIAL          tensor/matmul only
debugger     token/eval trace (not DWARF)
vscode       .vscode/launch.json + tools/vscode-panini`;

const SAMPLES = {
  panini: 'PRINT "HELLO"\nFUNCTION double(x)\n    RETURN x * 2\nEND\nPRINT double(21)',
  python: "print(40+2)",
  c: "int main(){return 40+2;}",
  cpp: "#include <iostream>\nint main(){std::cout<<(40+2)<<std::endl;}",
  fortran: "PROGRAM P\nPRINT *, 40+2\nEND PROGRAM P",
  rust: "fn main() { println!(\"{}\", 40+2); }",
  typescript: "console.log(40+2);",
  go: "package main\nfunc main() { fmt.Println(40+2) }",
  zig: "pub fn main() void { std.debug.print(\"{d}\", .{40+2}); }",
};

const srcEl = document.getElementById("src");
const outEl = document.getElementById("out");
const inspect = document.getElementById("inspect");
const proj = document.getElementById("proj");

function project(text, dir) {
  const table = dir === "devanagari_hi" ? HI : dir === "arabic_ar" ? AR : null;
  if (!table) return text;
  let s = text;
  for (const [en, other] of Object.entries(table)) s = s.replaceAll(en, other);
  return s;
}
function deproject(text) {
  let s = text;
  for (const [en, hi] of Object.entries(HI)) s = s.split(hi).join(en);
  for (const [en, ar] of Object.entries(AR)) s = s.split(ar).join(en);
  return s;
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function runShaili(text, ctx) {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  let x = w/2, y = h/2, a = -Math.PI/2, pen = true;
  ctx.beginPath(); ctx.moveTo(x,y);
  const cmds = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const logs = [];
  for (const line of cmds) {
    const [cmd, n] = line.split(/\s+/);
    const C = (cmd || "").toUpperCase();
    if (C === "FORWARD" || C === "FD") {
      const d = Number(n)||0; x += Math.cos(a)*d; y += Math.sin(a)*d;
      if (pen) ctx.lineTo(x,y); else ctx.moveTo(x,y);
      logs.push("fd "+d);
    } else if (C === "RIGHT" || C === "RT") { a += (Number(n)||0)*Math.PI/180; logs.push("rt "+n); }
    else if (C === "LEFT" || C === "LT") { a -= (Number(n)||0)*Math.PI/180; logs.push("lt "+n); }
    else if (C === "PENUP") { pen = false; }
    else if (C === "PENDOWN") { pen = true; }
    else return null;
  }
  ctx.strokeStyle = "#7dd3fc"; ctx.stroke();
  return logs;
}

function evalPanini(source) {
  const prints = [];
  const fns = {};
  const lines = deproject(source).split(/\n/);
  let i = 0;
  function skipEnd() { while (i < lines.length && !/^\s*END\b/.test(lines[i])) i++; i++; }
  while (i < lines.length) {
    const line = lines[i++].trim();
    if (!line || line.startsWith("@") || line.startsWith("/*") || line.startsWith("//")) continue;
    let m = line.match(/^PRINT\s+(.+)$/);
    if (m) { prints.push(evalExpr(m[1], {}, fns)); continue; }
    m = line.match(/^FUNCTION\s+(\w+)\(([^)]*)\)/);
    if (m) {
      const name = m[1];
      const params = m[2].split(",").map((s) => s.trim().split(":")[0]).filter(Boolean);
      const body = [];
      while (i < lines.length && !/^\s*END\b/.test(lines[i])) body.push(lines[i++]);
      i++;
      fns[name] = { params, body };
      continue;
    }
    if (/^MODULE\b|^SCOPE\b/.test(line)) continue;
    if (/^END\b/.test(line)) continue;
    if (/^(FORWARD|RIGHT|LEFT|PENUP|PENDOWN|FD|RT|LT)\b/.test(line)) { i--; break; }
  }
  if (fns.main) prints.push(runFn(fns.main, [], fns));
  return { prints, fns: Object.keys(fns) };
}

function runFn(fn, args, fns) {
  const env = {};
  fn.params.forEach((p, i) => env[p] = args[i]);
  let last;
  for (const raw of fn.body) {
    const line = raw.trim();
    let m = line.match(/^RETURN\s+(.+)$/);
    if (m) return evalExpr(m[1], env, fns);
    m = line.match(/^PRINT\s+(.+)$/);
    if (m) { last = evalExpr(m[1], env, fns); continue; }
    m = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (m) { env[m[1]] = evalExpr(m[2], env, fns); continue; }
  }
  return last;
}

function evalExpr(expr, env, fns) {
  expr = expr.trim();
  if (expr === "TRUE") return true;
  if (expr === "FALSE") return false;
  if (/^".*"$/.test(expr) || /^'.*'$/.test(expr)) return expr.slice(1, -1);
  if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
  const call = expr.match(/^(\w+)\((.*)\)$/);
  if (call && fns[call[1]]) {
    const args = call[2] ? call[2].split(",").map((a) => evalExpr(a.trim(), env, fns)) : [];
    return runFn(fns[call[1]], args, fns);
  }
  if (/^[A-Za-z_]\w*$/.test(expr) && expr in env) return env[expr];
  const bin = expr.match(/^(.+?)\s*([+\-*/])\s*(.+)$/);
  if (bin) {
    const l = evalExpr(bin[1], env, fns), r = evalExpr(bin[3], env, fns);
    if (bin[2] === "+") return l + r;
    if (bin[2] === "-") return l - r;
    if (bin[2] === "*") return l * r;
    if (bin[2] === "/") return l / r;
  }
  return expr;
}

const NUM = { "शून्य":0,"एक":1,"द्वि":2,"त्रि":3,"चतुर्":4,"पञ्च":5,"दश":10,"योग":"+","गुणन":"*" };

function evalPrintExpr(src, needle) {
  const i = src.lastIndexOf(needle);
  const slice = i >= 0 ? src.slice(i + needle.length) : src;
  const m = slice.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
  if (m) {
    const a = Number(m[1]), b = Number(m[3]);
    if (m[2] === "+") return a + b;
    if (m[2] === "-") return a - b;
    if (m[2] === "*") return a * b;
    return a / b;
  }
  const n = slice.match(/(\d+)/);
  return n ? Number(n[1]) : 0;
}

document.getElementById("lang")?.addEventListener("change", (e) => {
  const v = e.target.value;
  if (SAMPLES[v]) srcEl.value = SAMPLES[v];
});

document.getElementById("run").onclick = () => {
  const src = srcEl.value;
  const lang = document.getElementById("lang")?.value || "panini";
  if (lang !== "panini") {
    const key = { python:"print", c:"return", cpp:"cout", fortran:"PRINT", rust:"println", typescript:"log", go:"Println", zig:"print" }[lang];
    outEl.textContent = String(evalPrintExpr(src, key || ""));
    inspect.textContent = lang + " subset in Pages (full frontend is node src/cli.js " + lang + ")";
    return;
  }
  const ctx = document.getElementById("turtle").getContext("2d");
  const sh = runShaili(deproject(src), ctx);
  if (sh && src.split("\n").every((l) => !l.trim() || /^(FORWARD|RIGHT|LEFT|PEN|FD|RT|LT)/i.test(l.trim()))) {
    outEl.textContent = sh.join("\n");
    return;
  }
  try {
    const r = evalPanini(src);
    outEl.textContent = r.prints.map(String).join("\n");
    inspect.textContent = "functions: " + r.fns.join(", ");
  } catch (e) {
    outEl.textContent = String(e);
  }
};

document.getElementById("prove").onclick = async () => {
  const hash = await sha256(srcEl.value);
  inspect.textContent = JSON.stringify({
    sha256: hash,
    ots: { protocol: "OpenTimestamps", status: "PENDING_CALENDAR", digest: hash },
    misty_doi: null,
    epistemic_status: "PROPOSED",
    note: "Static Pages cannot talk to an OTS calendar. Save this digest and stamp externally.",
  }, null, 2);
};

document.getElementById("download").onclick = () => {
  const blob = new Blob([srcEl.value], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "program.pni";
  a.click();
};

let lastCanonical = srcEl.value;
proj.onchange = () => {
  const canonical = deproject(srcEl.value);
  lastCanonical = canonical;
  srcEl.value = project(canonical, proj.value);
};

document.querySelectorAll("nav button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll("nav button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    const v = b.dataset.view;
    document.getElementById("aside-title").textContent = v;
    if (v === "agi") inspect.textContent = LAYERS.map(([k,n]) => k + "  " + n).join("\n") + "\n\nstatus: RETRIEVED (not reconstructed)";
    else if (v === "museum") inspect.textContent = MUSEUM.map((id) => id + ".pni  → languages/" + id + ".pni").join("\n");
    else if (v === "math") inspect.textContent = "Sanskrit math seed:\nएक योग द्वि  →  1 + 2\n" + JSON.stringify(NUM, null, 2);
    else if (v === "linguist") inspect.textContent = "ILM projection switcher is the View menu.\nChanging view does not create a new program.";
    else if (v === "ci") inspect.textContent = "GitHub Actions workflow lives in .github/workflows/pages.yml + build.yml\nNo custom server. Commit → Pages + test job.";
    else if (v === "beginner") inspect.textContent = "Level 0: PRINT / FORWARD\nLevel 1: FUNCTION\nLevel 2: @functional\nAxes stay hidden until asked for.";
    else if (v === "status") inspect.textContent = STATUS;
    else if (v === "vscode") inspect.textContent = "VS Code: File → Open Folder on this repo.\nLaunch: .vscode/launch.json\nExtension: tools/vscode-panini (F5 Extension Development Host)\nDebug: node tools/panini-debug/adapter.mjs file.pni panini\nFrontends: python|c|rust|typescript|go|zig";
    else if (v === "vt100") {
      inspect.textContent = "VT100: CSI A/B/C/D H J K m, CR LF BS TAB\nDOS font: fonts/dos-8x16.f16\nTTF: VT_LOAD_FONT name path.ttf (cmap 4 + simple glyf)";
      if (typeof drawTerminal === "function") drawTerminal(document.getElementById("vt"), "VT100\nDOS 8x16\nABC 0123");
    }
    else inspect.textContent = "Engineer view: same artifact, more inspector detail.";
  };
});
document.querySelector('[data-view="beginner"]').classList.add("active");
