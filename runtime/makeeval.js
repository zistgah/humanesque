/**
 * POSIX / GNU make subset (variables, targets, tab recipes, echo).
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 *
 * Host-speed eval for GNU make manual named extract (STANDARD GREEN).
 * Not GNU make. Not kbuild. Recipes other than echo are reported, not exec.
 */
function expand(s, env) {
  let out = String(s);
  for (let n = 0; n < 8; n++) {
    const next = out
      .replace(/\$\(([^)]+)\)/g, (_, k) => (k in env ? env[k] : ""))
      .replace(/\$\{([^}]+)\}/g, (_, k) => (k in env ? env[k] : ""));
    if (next === out) break;
    out = next;
  }
  return out;
}

export function makeRun(source) {
  const lines = String(source).replace(/\r\n/g, "\n").split("\n");
  const env = Object.create(null);
  const rules = [];
  let cur = null;
  for (const line of lines) {
    if (/^\s*#/.test(line) || line.trim() === "") continue;
    if (line.startsWith("\t") && cur) {
      cur.recipes.push(line.slice(1));
      continue;
    }
    const vm = line.match(/^([A-Za-z_][\w.]*)\s*[?:]?=\s*(.*)$/);
    if (vm && !line.includes(":")) {
      env[vm[1]] = expand(vm[2].trim(), env);
      cur = null;
      continue;
    }
    const rm = line.match(/^([^:#]+):(.*)$/);
    if (rm) {
      cur = {
        target: rm[1].trim(),
        deps: rm[2].trim().split(/\s+/).filter(Boolean),
        recipes: [],
      };
      rules.push(cur);
    }
  }
  const prints = [];
  const seen = new Set();
  function runTarget(name) {
    if (seen.has(name)) return;
    seen.add(name);
    const r = rules.find((x) => x.target === name);
    if (!r) return;
    for (const d of r.deps) runTarget(d);
    for (const rec of r.recipes) {
      const cmd = expand(rec, env).trim();
      const em = cmd.match(/^@?echo\s+(.*)$/i);
      if (em) {
        let t = em[1];
        if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) t = t.slice(1, -1);
        prints.push(t);
      } else if (cmd) {
        prints.push(cmd);
      }
    }
  }
  const first = rules[0] ? rules[0].target : "all";
  runTarget(first);
  return { ok: true, prints, print: prints.join("\n"), value: prints.length, frontend: "PANINI.Frontend.Make" };
}
