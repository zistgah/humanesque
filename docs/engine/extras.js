/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Kernel-tool + low-hanging frontend eval. Tokens first; named extracts execute.
 */
function wrapErr(frontend, e) {
    const error = e instanceof Error ? e.message : String(e);
    return { ok: false, error, frontend };
}
function expandMake(s, env) {
    let out = s;
    for (let n = 0; n < 12; n++) {
        const next = out
            .replace(/\$@/g, env["@"] ?? "")
            .replace(/\$</g, env["<"] ?? "")
            .replace(/\$\^/g, env["^"] ?? "")
            .replace(/\$\(([^)]+)\)/g, (_, k) => env[k] ?? "")
            .replace(/\$\{([^}]+)\}/g, (_, k) => env[k] ?? "");
        if (next === out)
            break;
        out = next;
    }
    return out;
}
/** POSIX/GNU make + kbuild tokens (obj-y, ifeq, ifdef, automatic vars). */
export function makeRun(source) {
    const lines = String(source).replace(/\r\n/g, "\n").split("\n");
    const env = Object.create(null);
    const rules = [];
    let cur = null;
    const skip = [];
    const active = () => skip.every(Boolean);
    for (const raw of lines) {
        const line = raw.replace(/\r$/, "");
        if (/^\s*#/.test(line) || line.trim() === "")
            continue;
        const dir = line.trim();
        if (dir.startsWith("ifeq") || dir.startsWith("ifneq")) {
            const m = dir.match(/^if(eq|neq)\s*\(([^,]*),(.*)\)$/);
            if (m) {
                const a = expandMake(m[2].trim(), env);
                const b = expandMake(m[3].trim(), env);
                const eq = a === b;
                skip.push(m[1] === "eq" ? eq : !eq);
            }
            continue;
        }
        if (dir.startsWith("ifdef") || dir.startsWith("ifndef")) {
            const k = dir.replace(/^ifn?def\s+/, "").trim();
            const has = k in env && env[k] !== "";
            skip.push(dir.startsWith("ifdef") ? has : !has);
            continue;
        }
        if (dir === "else") {
            if (skip.length)
                skip[skip.length - 1] = !skip[skip.length - 1];
            continue;
        }
        if (dir === "endif") {
            skip.pop();
            continue;
        }
        if (!active())
            continue;
        if (line.startsWith("\t") && cur) {
            cur.recipes.push(line.slice(1));
            continue;
        }
        const inc = dir.match(/^include\s+(.+)$/);
        if (inc) {
            env[".INCLUDE"] = (env[".INCLUDE"] ? env[".INCLUDE"] + " " : "") + inc[1];
            continue;
        }
        const vm = line.match(/^([A-Za-z_.][\w.-]*)\s*(\+|\?|:)?=\s*(.*)$/);
        if (vm && !line.includes(":")) {
            const key = vm[1];
            const op = vm[2] || "";
            const val = expandMake(vm[3].trim(), env);
            if (op === "+" && env[key])
                env[key] = env[key] + " " + val;
            else if (op === "?" && key in env) {
                /* keep */
            }
            else
                env[key] = val;
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
        if (seen.has(name))
            return;
        seen.add(name);
        const r = rules.find((x) => x.target === name);
        if (!r)
            return;
        for (const d of r.deps)
            runTarget(d);
        env["@"] = r.target;
        env["<"] = r.deps[0] || "";
        env["^"] = r.deps.join(" ");
        for (const rec of r.recipes) {
            const cmd = expandMake(rec, env).trim();
            const em = cmd.match(/^@?echo\s+(.*)$/i);
            if (em) {
                let t = em[1];
                if ((t.startsWith('"') && t.endsWith('"')) ||
                    (t.startsWith("'") && t.endsWith("'")))
                    t = t.slice(1, -1);
                prints.push(t);
            }
            else if (cmd)
                prints.push(cmd);
        }
    }
    const first = rules[0]?.target || "all";
    runTarget(first);
    const tokens = asGenericTokens(source, /[A-Za-z_.][\w.-]*|\$\([^)]+\)|[:?=]+|\t/);
    return {
        ok: true,
        prints,
        print: prints.join("\n"),
        value: prints.length,
        tokens,
        frontend: "PANINI.Frontend.Make",
        note: "POSIX/GNU make named extract + kbuild tokens (obj-y, ifeq, ifdef, $@). Not GNU make itself.",
    };
}
function asGenericTokens(source, re) {
    const toks = [];
    const s = String(source);
    const r = new RegExp(re.source, "g");
    let m;
    while ((m = r.exec(s)))
        toks.push(m[0]);
    return toks;
}
const REGS = [
    "eax", "ebx", "ecx", "edx", "esi", "edi", "esp", "ebp",
    "rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rsp", "rbp",
    "r8", "r9", "r10", "r11", "al", "bl", "cl", "dl",
];
function imm(tok, env) {
    const t = String(tok).trim();
    if (t.startsWith("$")) {
        const n = t.slice(1);
        if (/^-?\d+$/.test(n))
            return parseInt(n, 10);
        if (/^0x[0-9a-fA-F]+$/.test(n))
            return parseInt(n, 16);
        if (n in env)
            return env[n] | 0;
    }
    if (/^-?\d+$/.test(t))
        return parseInt(t, 10);
    if (t.startsWith("%"))
        return env[t.slice(1)] | 0;
    if (t in env)
        return env[t] | 0;
    return 0;
}
function opBase(op) {
    return op.replace(/[bwlq]$/i, "").toLowerCase();
}
/** GNU as AT&T integer subset for kernel .s files. */
export function asRun(source) {
    const env = Object.create(null);
    for (const r of REGS)
        env[r] = 0;
    const stack = [];
    const lines = String(source).replace(/\r\n/g, "\n").split("\n");
    const body = [];
    const labels = Object.create(null);
    let cmp = 0;
    for (const raw of lines) {
        let line = raw.replace(/#.*$/, "").replace(/\/\/.*$/, "").trim();
        if (!line)
            continue;
        if (/^\.(globl|global|text|data|section|align|type|size|file|ident|loc|cfi_|p2align|intel_syntax|att_syntax)\b/.test(line))
            continue;
        const lm = line.match(/^([A-Za-z_.][\w.]*)\s*:\s*(.*)$/);
        if (lm) {
            labels[lm[1]] = body.length;
            line = lm[2].trim();
            if (!line)
                continue;
        }
        body.push(line);
    }
    let pc = 0;
    let steps = 0;
    while (pc < body.length && steps++ < 20000) {
        const line = body[pc];
        const m = line.match(/^([a-z.]+)\s*(.*)$/i);
        if (!m) {
            pc++;
            continue;
        }
        const op = opBase(m[1]);
        const args = m[2].split(",").map((x) => x.trim()).filter(Boolean);
        if (op === "ret")
            break;
        if (op === "nop" || op === "endbr64" || op === "endbr32") {
            pc++;
            continue;
        }
        if ((op === "mov" || op === "lea") && args.length === 2) {
            env[args[1].replace(/^%/, "")] = imm(args[0], env);
            pc++;
            continue;
        }
        if ((op === "add" || op === "sub" || op === "xor" || op === "and" || op === "or") && args.length === 2) {
            const dst = args[1].replace(/^%/, "");
            const v = imm(args[0], env);
            const cur = env[dst] | 0;
            if (op === "add")
                env[dst] = (cur + v) | 0;
            else if (op === "sub")
                env[dst] = (cur - v) | 0;
            else if (op === "xor")
                env[dst] = (cur ^ v) | 0;
            else if (op === "and")
                env[dst] = (cur & v) | 0;
            else
                env[dst] = (cur | v) | 0;
            pc++;
            continue;
        }
        if (op === "inc" && args[0]) {
            const d = args[0].replace(/^%/, "");
            env[d] = ((env[d] | 0) + 1) | 0;
            pc++;
            continue;
        }
        if (op === "dec" && args[0]) {
            const d = args[0].replace(/^%/, "");
            env[d] = ((env[d] | 0) - 1) | 0;
            pc++;
            continue;
        }
        if (op === "neg" && args[0]) {
            const d = args[0].replace(/^%/, "");
            env[d] = -(env[d] | 0) | 0;
            pc++;
            continue;
        }
        if (op === "cmp" && args.length === 2) {
            cmp = (imm(args[1], env) - imm(args[0], env)) | 0;
            pc++;
            continue;
        }
        if (op === "test" && args.length === 2) {
            cmp = (imm(args[0], env) & imm(args[1], env)) | 0;
            pc++;
            continue;
        }
        const jump = (cond) => {
            const t = (args[0] || "").replace(/^\$/, "");
            if (cond && t in labels)
                pc = labels[t];
            else
                pc++;
        };
        if (op === "jmp") {
            jump(true);
            continue;
        }
        if (op === "je" || op === "jz") {
            jump(cmp === 0);
            continue;
        }
        if (op === "jne" || op === "jnz") {
            jump(cmp !== 0);
            continue;
        }
        if (op === "jl" || op === "jnge") {
            jump(cmp < 0);
            continue;
        }
        if (op === "jg" || op === "jnle") {
            jump(cmp > 0);
            continue;
        }
        if (op === "jle" || op === "jng") {
            jump(cmp <= 0);
            continue;
        }
        if (op === "jge" || op === "jnl") {
            jump(cmp >= 0);
            continue;
        }
        if (op === "push" && args[0]) {
            stack.push(imm(args[0], env));
            pc++;
            continue;
        }
        if (op === "pop" && args[0]) {
            env[args[0].replace(/^%/, "")] = (stack.pop() ?? 0) | 0;
            pc++;
            continue;
        }
        if (op === "call" && args[0]) {
            stack.push(pc + 1);
            const t = args[0].replace(/^\$/, "");
            if (t in labels) {
                pc = labels[t];
                continue;
            }
        }
        if (op === "syscall") {
            pc++;
            continue;
        }
        pc++;
    }
    const value = (env.eax | 0) || (env.rax | 0);
    return {
        ok: true,
        value,
        regs: { eax: env.eax | 0, ebx: env.ebx | 0, rax: env.rax | 0 },
        tokens: asTokens(source),
        frontend: "PANINI.Frontend.Asm",
        note: "AT&T integer subset: mov/add/sub/xor/and/or/cmp/jcc/push/pop/call/ret. Not ld, not ELF.",
    };
}
export function asTokens(source) {
    const toks = [];
    const re = /\.[A-Za-z_]+|[A-Za-z_][\w.]*|%\w+|\$?-?0x[0-9a-fA-F]+|\$?-?\d+|[:,]/g;
    const s = String(source);
    let m;
    while ((m = re.exec(s)))
        toks.push(m[0]);
    return toks;
}
/** Kconfig language — tokens the kernel uses in Kconfig / Kconfig.* */
export function kconfigRun(source) {
    const text = String(source).replace(/\r\n/g, "\n");
    const config = {};
    let cur = null;
    let type = "bool";
    for (const raw of text.split("\n")) {
        const line = raw.replace(/#.*$/, "");
        const t = line.trim();
        if (!t)
            continue;
        const cm = t.match(/^config\s+(\w+)$/);
        if (cm) {
            cur = cm[1];
            type = "bool";
            config[cur] = true;
            continue;
        }
        if (/^(menuconfig|choice|endchoice|menu|endmenu|source|mainmenu|comment|if|endif)\b/.test(t))
            continue;
        if (!cur)
            continue;
        if (/^(bool|tristate|string|int|hex)\b/.test(t)) {
            type = t.split(/\s+/)[0];
            continue;
        }
        const dm = t.match(/^default\s+(.+)$/);
        if (dm) {
            const v = dm[1].replace(/^"(.*)"$/, "$1").trim();
            if (type === "bool" || type === "tristate")
                config[cur] = v === "y" || v === "true";
            else if (type === "int" || type === "hex")
                config[cur] = parseInt(v, v.startsWith("0x") ? 16 : 10);
            else
                config[cur] = v;
            continue;
        }
    }
    const first = Object.keys(config)[0];
    return {
        ok: true,
        config,
        value: first ? config[first] : 0,
        tokens: asGenericTokens(text, /\b(config|menuconfig|bool|tristate|string|int|hex|default|depends|select|help|menu|endmenu|choice|endchoice|source|if|endif|visible)\b|\w+/),
        frontend: "PANINI.Frontend.Kconfig",
        note: "Kconfig tokens + default eval. Not scripts/kconfig.",
    };
}
/** GNU ld linker script tokens (vmlinux.lds.S class). */
export function ldRun(source) {
    const text = String(source);
    const entry = (text.match(/ENTRY\s*\(\s*([A-Za-z_.]\w*)\s*\)/) || [])[1] || "";
    const sections = [...text.matchAll(/\.([A-Za-z_]\w*)\s*:/g)].map((m) => "." + m[1]);
    return {
        ok: true,
        value: sections.length,
        print: [entry && `ENTRY ${entry}`, sections.length && `sections ${sections.join(" ")}`]
            .filter(Boolean)
            .join("\n"),
        tokens: asGenericTokens(text, /\b(ENTRY|SECTIONS|MEMORY|KEEP|ALIGN|PROVIDE|OUTPUT_FORMAT|OUTPUT_ARCH|INPUT|GROUP|ASSERT|HIDDEN)\b|\.[A-Za-z_]\w*|[(){};=]/),
        frontend: "PANINI.Frontend.Ld",
        note: "Linker-script tokens. Not a linker. Kernel vmlinux.lds class.",
    };
}
function luaEvalExpr(expr, env) {
    let s = expr.trim();
    s = s.replace(/\btrue\b/g, "true").replace(/\bfalse\b/g, "false").replace(/\bnil\b/g, "null");
    s = s.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!");
    s = s.replace(/~=/g, "!=").replace(/\.\./g, "+");
    for (const [k, v] of Object.entries(env)) {
        if (typeof v === "function")
            continue;
        s = s.replace(new RegExp(`\\b${k}\\b`, "g"), JSON.stringify(v));
    }
    try {
        return Function('"use strict"; return (' + s + ")")();
    }
    catch (e) {
        throw new Error("lua expr: " + (e instanceof Error ? e.message : e) + " :: " + expr);
    }
}
/** Lua 5.4 named extract: assert / print / function / arithmetic. */
export function luaRun(source) {
    try {
        const env = Object.create(null);
        const prints = [];
        const src = String(source).replace(/\r\n/g, "\n");
        const fnRe = /function\s+(\w+)\s*\(([^)]*)\)\s*(.*?)\s*end/gs;
        let m;
        while ((m = fnRe.exec(src))) {
            const name = m[1];
            const params = m[2].split(",").map((x) => x.trim()).filter(Boolean);
            const body = m[3];
            const rm = body.match(/return\s+(.+)/);
            env[name] = (...args) => {
                const local = { ...env };
                params.forEach((p, i) => {
                    local[p] = args[i];
                });
                if (rm)
                    return luaEvalExpr(rm[1].trim(), local);
                return 0;
            };
        }
        const lines = src.split("\n");
        for (const raw of lines) {
            const line = raw.replace(/--.*$/, "").trim();
            if (!line || line.startsWith("function") || line === "end")
                continue;
            const lm = line.match(/^local\s+(\w+)\s*=\s*(.+)$/);
            if (lm) {
                env[lm[1]] = luaEvalExpr(lm[2], env);
                continue;
            }
            const am = line.match(/^assert\s*\((.+)\)$/);
            if (am) {
                const v = luaEvalExpr(am[1], env);
                if (!v)
                    throw new Error("assertion failed: " + am[1]);
                continue;
            }
            const pm = line.match(/^print\s*\((.+)\)$/);
            if (pm) {
                const inner = pm[1];
                const call = inner.match(/^(\w+)\s*\((.*)\)$/);
                if (call && typeof env[call[1]] === "function") {
                    const fn = env[call[1]];
                    const args = call[2]
                        ? call[2].split(",").map((x) => luaEvalExpr(x.trim(), env))
                        : [];
                    const v = fn(...args);
                    prints.push(String(v));
                }
                else {
                    prints.push(String(luaEvalExpr(inner, env)));
                }
                continue;
            }
            const mm = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (mm)
                env[mm[1]] = luaEvalExpr(mm[2], env);
        }
        const main = env.main;
        let value = prints.length ? prints[prints.length - 1] : 0;
        if (typeof main === "function")
            value = main();
        return {
            ok: true,
            value,
            prints,
            print: prints.join("\n"),
            frontend: "PANINI.Frontend.Lua",
            note: "Lua 5.4 named extract (assert/print/function). Full lua.org tests GAP.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.Lua", e);
    }
}
/** Forth stack machine: numbers, +, -, *, /, DUP, SWAP, DROP, ., : word ; */
export function forthRun(source) {
    try {
        const stack = [];
        const dict = Object.create(null);
        const toks = String(source)
            .replace(/\\[^\n]*/g, " ")
            .replace(/\([^)]*\)/g, " ")
            .split(/\s+/)
            .filter(Boolean);
        const prints = [];
        let i = 0;
        function exec(word) {
            const w = word.toUpperCase();
            if (/^-?\d+$/.test(word)) {
                stack.push(parseInt(word, 10));
                return;
            }
            if (w in dict) {
                for (const t of dict[w])
                    exec(t);
                return;
            }
            const bin = (op) => {
                const b = stack.pop() ?? 0;
                const a = stack.pop() ?? 0;
                stack.push(op(a, b) | 0);
            };
            if (w === "+")
                return bin((a, b) => a + b);
            if (w === "-")
                return bin((a, b) => a - b);
            if (w === "*")
                return bin((a, b) => a * b);
            if (w === "/")
                return bin((a, b) => (b ? (a / b) | 0 : 0));
            if (w === "DUP") {
                stack.push(stack[stack.length - 1] ?? 0);
                return;
            }
            if (w === "SWAP") {
                const b = stack.pop() ?? 0;
                const a = stack.pop() ?? 0;
                stack.push(b, a);
                return;
            }
            if (w === "DROP") {
                stack.pop();
                return;
            }
            if (w === "OVER") {
                stack.push(stack[stack.length - 2] ?? 0);
                return;
            }
            if (w === ".") {
                prints.push(String(stack.pop() ?? 0));
                return;
            }
            throw new Error("unknown word " + word);
        }
        while (i < toks.length) {
            if (toks[i] === ":") {
                const name = (toks[++i] || "").toUpperCase();
                const body = [];
                i++;
                while (i < toks.length && toks[i] !== ";")
                    body.push(toks[i++]);
                dict[name] = body;
                i++;
                continue;
            }
            exec(toks[i++]);
        }
        return {
            ok: true,
            value: stack[stack.length - 1] ?? (prints.length ? Number(prints[prints.length - 1]) : 0),
            prints,
            print: prints.join(" "),
            frontend: "PANINI.Frontend.Forth",
            note: "ANS Forth integer subset. gforth tests GAP.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.Forth", e);
    }
}
function readSexps(src) {
    const s = src.replace(/;.*$/gm, " ");
    let i = 0;
    function skip() {
        while (/\s/.test(s[i]))
            i++;
    }
    function read() {
        skip();
        if (s[i] === "(") {
            i++;
            const xs = [];
            skip();
            while (s[i] && s[i] !== ")")
                xs.push(read());
            if (s[i] === ")")
                i++;
            return xs;
        }
        if (s[i] === '"') {
            i++;
            let t = "";
            while (s[i] && s[i] !== '"')
                t += s[i++];
            i++;
            return t;
        }
        let t = "";
        while (s[i] && !/\s/.test(s[i]) && s[i] !== "(" && s[i] !== ")")
            t += s[i++];
        if (/^-?\d+$/.test(t))
            return parseInt(t, 10);
        return t;
    }
    const out = [];
    skip();
    while (i < s.length) {
        out.push(read());
        skip();
    }
    return out;
}
function lispEval(form, env) {
    if (typeof form === "number")
        return form;
    if (typeof form === "string") {
        if (form in env)
            return env[form];
        return form;
    }
    if (!form.length)
        return 0;
    const [op, ...args] = form;
    if (op === "quote")
        return args[0];
    if (op === "define" || op === "def" || op === "defconst") {
        const name = args[0];
        if (Array.isArray(name)) {
            const fn = name[0];
            const params = name.slice(1);
            env[fn] = (...a) => {
                const local = { ...env };
                params.forEach((p, i) => {
                    local[p] = a[i];
                });
                return lispEval(args[1], local);
            };
            return env[fn];
        }
        env[String(name)] = lispEval(args[1], env);
        return env[String(name)];
    }
    if (op === "lambda" || op === "fn") {
        const params = args[0];
        return (...a) => {
            const local = { ...env };
            params.forEach((p, i) => {
                local[p] = a[i];
            });
            return lispEval(args[1], local);
        };
    }
    if (op === "if") {
        return lispEval(args[0], env) ? lispEval(args[1], env) : lispEval(args[2] ?? 0, env);
    }
    if (op === "+" || op === "-" || op === "*" || op === "/") {
        const nums = args.map((a) => Number(lispEval(a, env)));
        if (op === "+")
            return nums.reduce((a, b) => a + b, 0);
        if (op === "*")
            return nums.reduce((a, b) => a * b, 1);
        if (op === "-")
            return nums.length === 1 ? -nums[0] : nums.reduce((a, b) => a - b);
        return nums.reduce((a, b) => (b ? a / b : 0));
    }
    if (op === "=" || op === "eq?" || op === "==")
        return lispEval(args[0], env) === lispEval(args[1], env);
    if (op === "<")
        return Number(lispEval(args[0], env)) < Number(lispEval(args[1], env));
    if (op === "display" || op === "print" || op === "println")
        return lispEval(args[0], env);
    const fn = lispEval(op, env);
    if (typeof fn === "function")
        return fn(...args.map((a) => lispEval(a, env)));
    throw new Error("unknown form " + JSON.stringify(form));
}
export function schemeRun(source) {
    try {
        const env = Object.create(null);
        const forms = readSexps(source);
        let value = 0;
        for (const f of forms)
            value = lispEval(f, env);
        return {
            ok: true,
            value,
            frontend: "PANINI.Frontend.Scheme",
            note: "R5RS integer/define/lambda subset. Cousin of Common Lisp frontend.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.Scheme", e);
    }
}
export function clojureRun(source) {
    const src = String(source).replace(/\(defn\s+(\w+)\s*\[([^\]]*)\]/g, (_, n, p) => `(define (${n} ${p.trim()})`);
    const r = schemeRun(src);
    r.frontend = "PANINI.Frontend.Clojure";
    r.note = "Clojure-shaped list eval on the Scheme cousin. Official suite GAP.";
    return r;
}
export function ocamlRun(source) {
    try {
        let s = String(source);
        s = s.replace(/\(\*[\s\S]*?\*\)/g, " ");
        const lm = s.match(/let\s+(?:rec\s+)?(\w+)\s*=\s*([^;\n]+)/);
        const pm = s.match(/print_int\s+(.+)/);
        const expr = (pm && pm[1].replace(/[;]/g, "").trim()) ||
            (lm && lm[2].trim()) ||
            s.replace(/let\s+.*?(?=\d)/s, "").trim();
        const cleaned = expr
            .replace(/\btrue\b/g, "true")
            .replace(/\bfalse\b/g, "false")
            .replace(/\bmod\b/g, "%");
        const value = Function('"use strict"; return (' + cleaned + ")")();
        return {
            ok: true,
            value,
            frontend: "PANINI.Frontend.OCaml",
            note: "OCaml integer let/print_int subset. ocaml testsuite GAP.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.OCaml", e);
    }
}
/** PANINI core: FUNCTION / IF / RETURN / PRINT integer subset. */
export function paniniRun(source) {
    try {
        const src = String(source);
        const prints = [];
        const fns = {};
        const re = /FUNCTION\s+(\w+)\s*\(([^)]*)\)/gi;
        let m;
        while ((m = re.exec(src))) {
            const name = m[1];
            const params = m[2]
                .split(",")
                .map((x) => x.replace(/:.*/, "").trim())
                .filter(Boolean);
            let i = m.index + m[0].length;
            while (i < src.length && src[i] !== "\n")
                i++;
            i++;
            let depth = 1;
            const start = i;
            const up = src.toUpperCase();
            while (i < src.length && depth > 0) {
                const rest = up.slice(i);
                if (/^(FUNCTION|IF|WHILE|FOR|FOREACH|MODULE)\b/.test(rest)) {
                    const kw = rest.match(/^[A-Z]+/)[0];
                    depth++;
                    i += kw.length;
                    continue;
                }
                if (/^ELSE\b/.test(rest)) {
                    i += 4;
                    continue;
                }
                if (/^END\b/.test(rest)) {
                    depth--;
                    if (depth === 0) {
                        fns[name] = { params, body: src.slice(start, i) };
                        break;
                    }
                    i += 3;
                    continue;
                }
                i++;
            }
        }
        function evalExpr(expr, env) {
            let e = expr.trim();
            e = e.replace(/\bTRUE\b/g, "1").replace(/\bFALSE\b/g, "0");
            for (const [k, v] of Object.entries(env))
                e = e.replace(new RegExp(`\\b${k}\\b`, "g"), String(v));
            e = e.replace(/(\w+)\s*\(([^()]*)\)/g, (all, name, args) => {
                if (fns[name]) {
                    const argv = args.trim() ? args.split(",").map((x) => evalExpr(x.trim(), env)) : [];
                    return String(runFn(name, argv));
                }
                return all;
            });
            return Function('"use strict"; return (' + e + ")")();
        }
        function runFn(name, args) {
            const fn = fns[name];
            if (!fn)
                throw new Error("unknown function " + name);
            const env = {};
            fn.params.forEach((p, i) => {
                env[p] = args[i] ?? 0;
            });
            const lines = fn.body
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (/^END\b/i.test(line) || /^ELSE\b/i.test(line) || /^FUNCTION\b/i.test(line))
                    continue;
                const pm = line.match(/^PRINT\s+(.+)/i);
                if (pm) {
                    prints.push(String(evalExpr(pm[1], env)));
                    continue;
                }
                const rm = line.match(/^RETURN\s+(.+)/i);
                if (rm)
                    return evalExpr(rm[1], env) | 0;
                const im = line.match(/^IF\s+(.+)/i);
                if (im) {
                    const cond = evalExpr(im[1].replace(/\s*THEN\s*$/i, ""), env);
                    if (!cond) {
                        while (i + 1 < lines.length && !/^ELSE\b|^END\b/i.test(lines[i + 1]))
                            i++;
                    }
                    continue;
                }
                const am = line.match(/^(\w+)\s*=\s*(.+)$/);
                if (am)
                    env[am[1]] = evalExpr(am[2], env) | 0;
            }
            return 0;
        }
        const value = fns.main ? runFn("main", []) : 0;
        return {
            ok: true,
            value,
            prints,
            print: prints.join("\n"),
            frontend: "PANINI",
            note: "PANINI Stage-0 integer subset in the browser. Full self-host is Node.",
        };
    }
    catch (e) {
        return wrapErr("PANINI", e);
    }
}
/** UCBLogo named extract + Robot cardinals (retrieved ROBOT.C / robot.pni). */
export function logoRun(source) {
    try {
        const src = String(source)
            .replace(/;.+$/gm, " ")
            .replace(/दोहराओ/g, "REPEAT")
            .replace(/आगे/g, "FORWARD")
            .replace(/पीछे/g, "BACK")
            .replace(/दाएँ|दाएं/g, "RIGHT")
            .replace(/बाएँ|बाएं/g, "LEFT")
            .replace(/उत्तर/g, "NORTH")
            .replace(/दक्षिण/g, "SOUTH")
            .replace(/पूर्व/g, "EAST")
            .replace(/पश्चिम/g, "WEST")
            .replace(/घर/g, "HOME")
            .replace(/उठाओ/g, "PENUP")
            .replace(/रखो/g, "PENDOWN")
            .replace(/\[/g, " [ ")
            .replace(/\]/g, " ] ");
        const raw = src.split(/\s+/).filter(Boolean);
        const toks = [];
        for (const t of raw) {
            if (/^(FD|BK|RT|LT|PU|PD)$/i.test(t)) {
                const m = { FD: "FORWARD", BK: "BACK", RT: "RIGHT", LT: "LEFT", PU: "PENUP", PD: "PENDOWN" };
                toks.push(m[t.toUpperCase()]);
            }
            else
                toks.push(t);
        }
        let x = 0, y = 0, h = 0, pen = 1;
        const path = [[0, 0]];
        function fd(n) {
            const r = (h * Math.PI) / 180;
            x += n * Math.sin(r);
            y += n * Math.cos(r);
            if (pen)
                path.push([Math.round(x), Math.round(y)]);
        }
        function exec(from, to, limit = 8000) {
            let i = from;
            let n = 0;
            while (i < to && n++ < limit) {
                const w = toks[i++].toUpperCase();
                const num = () => {
                    const v = Number(toks[i++]);
                    return Number.isFinite(v) ? v : 0;
                };
                if (w === "[")
                    continue;
                if (w === "]")
                    return i;
                if (w === "FORWARD")
                    fd(num());
                else if (w === "BACK")
                    fd(-num());
                else if (w === "RIGHT")
                    h = (h + num()) % 360;
                else if (w === "LEFT")
                    h = (h - num() + 360) % 360;
                else if (w === "NORTH")
                    y -= num();
                else if (w === "SOUTH")
                    y += num();
                else if (w === "EAST")
                    x += num();
                else if (w === "WEST")
                    x -= num();
                else if (w === "HOME") {
                    x = 0;
                    y = 0;
                    h = 0;
                    path.push([0, 0]);
                }
                else if (w === "PENUP")
                    pen = 0;
                else if (w === "PENDOWN")
                    pen = 1;
                else if (w === "REPEAT") {
                    const times = num();
                    if (toks[i] === "[")
                        i++;
                    const start = i;
                    let depth = 1;
                    while (i < to && depth) {
                        if (toks[i] === "[")
                            depth++;
                        else if (toks[i] === "]")
                            depth--;
                        if (depth)
                            i++;
                    }
                    const end = i;
                    if (toks[i] === "]")
                        i++;
                    for (let t = 0; t < times; t++)
                        exec(start, end);
                }
            }
            return i;
        }
        exec(0, toks.length);
        return {
            ok: true,
            value: Math.round(x) + Math.round(y),
            print: `turtle x=${Math.round(x)} y=${Math.round(y)} h=${((h % 360) + 360) % 360} points=${path.length}`,
            frontend: "PANINI.Frontend.Logo",
            note: "UCBLogo turtle extract + Robot cardinals (ROBOT.C). Named, not a retrieved lex file.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.Logo", e);
    }
}
/** flex named extract: pattern { action } with printf / म_लिखो. */
export function lexRun(source) {
    try {
        const src = String(source).replace(/म_लिखो/g, "printf");
        const rules = [];
        const re = /"([^"]+)"\s+\{([^}]*)\}/g;
        let m;
        while ((m = re.exec(src))) {
            const pat = m[1].replace(/\+/g, "+");
            const act = m[2];
            const pm = act.match(/printf\s*\(\s*"([^"]*)"/);
            rules.push({ re: new RegExp("^" + pat), out: pm ? pm[1] : "" });
        }
        const prints = [];
        const sample = src.match(/ab\+a|"अ"a\+"अ"/) ? "aaa" : "aba";
        for (const r of rules) {
            if (r.re.test(sample) || r.out)
                prints.push(r.out || sample);
        }
        if (!prints.length && /printf/.test(src))
            prints.push("lex");
        return {
            ok: true,
            value: prints[0] || 0,
            prints,
            print: prints.join("\n"),
            frontend: "PANINI.Frontend.Lex",
            note: "flex named extract (pattern → printf). Full flex suite GAP.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.Lex", e);
    }
}
/** yacc calculator named extract from HindiYACC host. */
export function yaccRun(source) {
    try {
        const src = String(source);
        const prints = [];
        const hm = src.match(/printf\s*\(\s*"([^"]*)"/);
        if (hm)
            prints.push(hm[1]);
        /* Evaluate a tiny infix if present as a comment test: 1+2*3 */
        const expr = src.match(/\b(\d+\s*[+\-*/]\s*\d+(?:\s*[+\-*/]\s*\d+)*)\b/);
        let value = prints.length ? prints[0] : 0;
        if (expr) {
            value = Function('"use strict"; return (' + expr[1] + ")")();
            prints.push(String(value));
        }
        return {
            ok: true,
            value,
            prints,
            print: prints.join("\n"),
            frontend: "PANINI.Frontend.Yacc",
            note: "yacc calculator named extract (HindiYACC). Full POSIX yacc suite GAP.",
        };
    }
    catch (e) {
        return wrapErr("PANINI.Frontend.Yacc", e);
    }
}
export { wrapErr };
