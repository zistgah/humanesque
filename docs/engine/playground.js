/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 * Browser frontend exerciser. Errors surface as diagnostics.
 */
import { cinterp } from "./interp/cinterp.js";
import { clower } from "./interp/clower.js";
import { gnuc } from "./interp/gnuc.js";
import { ccpp } from "./interp/ccpp.js";
import { cpplower, cppReject } from "./interp/cpplower.js";
import { js262Run, ts262Run } from "./interp/js262.js";
import { haskellRun } from "./interp/hseval.js";
import { stRunFile, stFormat } from "./interp/steval.js";
import { qb64Run } from "./interp/qb64.js";
import { rustToC, goToC, juliaToC, zigToC, fortranToC, pascalToC, pascalReject, javaToC, javaReject, csharpToC, kotlinToC, swiftToC, scalaToC, dartToC, adaToC, } from "./interp/stdlower.js";
import { lispRun } from "./interp/cleval.js";
import { prologRun } from "./interp/pleval.js";
import { wrapErr, makeRun, asRun, kconfigRun, ldRun, luaRun, forthRun, schemeRun, ocamlRun, clojureRun, paniniRun, logoRun, lexRun, yaccRun, } from "./extras.js";
import { rubyRun, perlRun, phpRun, rRun, cobolRun, sqlRun, octaveRun, sysmlRun } from "./interp/appeval.js";
function cDiag(src) {
    let braces = 0;
    let parens = 0;
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (c === '"') {
            i++;
            while (i < src.length && src[i] !== '"')
                i += src[i] === "\\" ? 2 : 1;
            continue;
        }
        if (c === "{")
            braces++;
        else if (c === "}") {
            braces--;
            if (braces < 0)
                return "compile error: unmatched }";
        }
        else if (c === "(")
            parens++;
        else if (c === ")") {
            parens--;
            if (parens < 0)
                return "compile error: unmatched )";
        }
    }
    if (braces)
        return "compile error: unbalanced braces";
    if (parens)
        return "compile error: unbalanced parentheses";
    return null;
}
function cRun(src, frontend) {
    try {
        const diag = cDiag(src);
        if (diag)
            return { ok: false, error: diag, frontend };
        const c = clower(gnuc(src));
        const value = cinterp(c) | 0;
        return { ok: true, value, lowered: c, frontend };
    }
    catch (e) {
        return wrapErr(frontend, e);
    }
}
function lowerRun(toC, src, frontend) {
    try {
        const c = toC(src);
        const value = cinterp(c) | 0;
        return { ok: true, value, lowered: c, frontend };
    }
    catch (e) {
        return wrapErr(frontend, e);
    }
}
function pyQuick(src) {
    const m = String(src).match(/def\s+main\s*\([^)]*\)\s*:(?:.|\n)*?return\s+(.+)/);
    if (m) {
        let expr = m[1].split("\n")[0].trim();
        expr = expr.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
        try {
            const value = Function('"use strict"; return (' + expr + ")")();
            return {
                ok: true,
                value,
                frontend: "PANINI.Frontend.Python",
                note: "browser host-speed def-main subset; Node uses python.pni",
            };
        }
        catch (e) {
            return wrapErr("PANINI.Frontend.Python", e);
        }
    }
    const p = String(src).match(/print\s*\((.+)\)\s*$/m);
    if (p) {
        try {
            const value = Function('"use strict"; return (' + p[1] + ")")();
            return { ok: true, value, print: String(value), frontend: "PANINI.Frontend.Python" };
        }
        catch (e) {
            return wrapErr("PANINI.Frontend.Python", e);
        }
    }
    return {
        ok: false,
        error: "Python browser subset: def main(): return <expr> or print(<expr>). Full frontend is python.pni (Node).",
        frontend: "PANINI.Frontend.Python",
    };
}
const MONACO = {
    c: "c", cpp: "cpp", cppp: "c", python: "python", javascript: "javascript",
    typescript: "typescript", pascal: "pascal", basic: "vb", java: "java",
    go: "go", rust: "rust", lua: "lua", make: "plaintext", asm: "plaintext",
    kconfig: "plaintext", ld: "plaintext", scheme: "plaintext", forth: "plaintext",
    ocaml: "plaintext", clojure: "plaintext", panini: "plaintext", smalltalk: "plaintext",
    haskell: "plaintext", lisp: "plaintext", prolog: "plaintext", fortran: "plaintext",
    julia: "plaintext", zig: "plaintext", logo: "plaintext", lex: "plaintext", yacc: "plaintext",
    csharp: "csharp", kotlin: "plaintext", swift: "plaintext", scala: "plaintext", dart: "plaintext",
    ada: "plaintext", ruby: "ruby", perl: "plaintext", php: "php", r: "r", cobol: "plaintext",
    sql: "sql", octave: "plaintext", sysml: "plaintext",
};
export function monacoLang(id) { return MONACO[id] || "plaintext"; }
export async function runLang(id, source) {
    const src = String(source);
    try {
        switch (id) {
            case "c":
                return cRun(src, "PANINI.Frontend.C");
            case "cppp": {
                const out = ccpp(src);
                try {
                    return { ok: true, value: cinterp(clower(out)) | 0, lowered: out, frontend: "PANINI.Frontend.Cppp" };
                }
                catch {
                    return { ok: true, lowered: out, value: out, frontend: "PANINI.Frontend.Cppp" };
                }
            }
            case "cpp": {
                const why = cppReject(src);
                if (why)
                    return { ok: false, rejected: why, error: "compile error: " + why, frontend: "PANINI.Frontend.Cpp" };
                const c = cpplower(src);
                try {
                    return { ok: true, value: cinterp(c) | 0, lowered: c, frontend: "PANINI.Frontend.Cpp" };
                }
                catch (e) {
                    return wrapErr("PANINI.Frontend.Cpp", e);
                }
            }
            case "python":
                return pyQuick(src);
            case "javascript":
                return js262Run(src);
            case "typescript":
                return ts262Run(src);
            case "pascal": {
                const why = pascalReject(src);
                if (why)
                    return { ok: false, rejected: why, error: "compile error: " + why, frontend: "PANINI.Frontend.Pascal" };
                return lowerRun(pascalToC, src, "PANINI.Frontend.Pascal");
            }
            case "basic": {
                const r = qb64Run(src);
                return {
                    ok: r.ok !== false && !r.error,
                    value: (r.prints && r.prints[0]) ?? 0,
                    prints: (r.prints || []).map(String),
                    error: r.error,
                    frontend: r.frontend || "PANINI.Frontend.BASIC",
                };
            }
            case "java": {
                const why = javaReject(src);
                if (why)
                    return { ok: false, rejected: why, error: "compile error: " + why, frontend: "PANINI.Frontend.Java" };
                return lowerRun(javaToC, src, "PANINI.Frontend.Java");
            }
            case "smalltalk": {
                const r = stRunFile(src);
                return {
                    ok: r.ok,
                    prints: (r.prints || []).map((v) => stFormat(v)),
                    value: r.prints && r.prints[0],
                    error: r.error,
                    frontend: r.frontend || "PANINI.Frontend.Smalltalk",
                };
            }
            case "haskell":
                return haskellRun(src);
            case "lisp":
                return lispRun(src);
            case "prolog":
                return prologRun(src);
            case "fortran":
                return lowerRun(fortranToC, src, "PANINI.Frontend.Fortran");
            case "go":
                return lowerRun(goToC, src, "PANINI.Frontend.Go");
            case "rust":
                return lowerRun(rustToC, src, "PANINI.Frontend.Rust");
            case "julia":
                return lowerRun(juliaToC, src, "PANINI.Frontend.Julia");
            case "lua":
                return luaRun(src);
            case "zig":
                return lowerRun(zigToC, src, "PANINI.Frontend.Zig");
            case "make":
                return makeRun(src);
            case "asm":
                return asRun(src);
            case "kconfig":
                return kconfigRun(src);
            case "ld":
                return ldRun(src);
            case "scheme":
                return schemeRun(src);
            case "forth":
                return forthRun(src);
            case "ocaml":
                return ocamlRun(src);
            case "clojure":
                return clojureRun(src);
            case "logo":
                return logoRun(src);
            case "lex":
                return lexRun(src);
            case "yacc":
                return yaccRun(src);
            case "panini":
                return paniniRun(src);
            case "csharp":
                return lowerRun(csharpToC, src, "PANINI.Frontend.CSharp");
            case "kotlin":
                return lowerRun(kotlinToC, src, "PANINI.Frontend.Kotlin");
            case "swift":
                return lowerRun(swiftToC, src, "PANINI.Frontend.Swift");
            case "scala":
                return lowerRun(scalaToC, src, "PANINI.Frontend.Scala");
            case "dart":
                return lowerRun(dartToC, src, "PANINI.Frontend.Dart");
            case "ada":
                return lowerRun(adaToC, src, "PANINI.Frontend.Ada");
            case "ruby":
                return rubyRun(src);
            case "perl":
                return perlRun(src);
            case "php":
                return phpRun(src);
            case "r":
                return rRun(src);
            case "cobol":
                return cobolRun(src);
            case "sql":
                return sqlRun(src);
            case "octave":
                return octaveRun(src);
            case "sysml":
                return sysmlRun(src);
            default:
                return { ok: false, error: "unknown frontend " + id, frontend: "PANINI" };
        }
    }
    catch (e) {
        return wrapErr("PANINI.Frontend." + id, e);
    }
}
