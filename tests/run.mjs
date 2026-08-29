import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lex } from "../compiler/lexer.js";
import { parse } from "../compiler/parser.js";
import { typecheck } from "../compiler/typechecker.js";
import { compile } from "../compiler/compile.js";
import { runSource } from "../runtime/interpreter.js";
import { display, unwrap } from "../runtime/values.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const examples = path.join(root, "examples");

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  ok   ${name}`);
  } catch (e) {
    failed += 1;
    console.error(`  FAIL ${name}`);
    console.error("       " + (e.stack || e.message));
  }
}

await test("lexer_basic", () => {
  const tokens = lex('FUNCTION f(x:Int) -> Int RETURN x END', "t.pni");
  assert.ok(tokens.length > 0);
  assert.equal(tokens[0].value, "FUNCTION");
  assert.ok(tokens.some((t) => t.kind === "IDENT" && t.value === "f"));
});

await test("lexer_comments_and_strings", () => {
  const tokens = lex('/* c */ // line\nPRINT "hi\\n"\n', "t.pni");
  const kinds = tokens.map((t) => t.kind);
  assert.ok(kinds.includes("STRING"));
  assert.equal(tokens.find((t) => t.kind === "STRING").value, "hi\n");
});

await test("parser_basic", () => {
  const ast = parse("RETURN 42", "t.pni");
  assert.equal(ast.kind, "Program");
  assert.equal(ast.body[0].kind, "Return");
  assert.equal(ast.body[0].argument.value, 42);
});

await test("parser_function", () => {
  const ast = parse(`
    FUNCTION factorial(n:Int) -> Int
      IF n <= 1
        RETURN 1
      ELSE
        RETURN n * factorial(n - 1)
      END
    END
  `, "fact.pni");
  const fn = ast.body[0];
  assert.equal(fn.kind, "FunctionDecl");
  assert.equal(fn.name, "factorial");
  assert.equal(fn.params[0].name, "n");
});

await test("typechecker_basic", () => {
  const ast = parse("FUNCTION f(x:Int) -> Int RETURN x END", "t.pni");
  const result = typecheck(ast);
  assert.equal(result.ok, true);
  assert.equal(result.types.f, "Function");
});

await test("compile_pipeline", () => {
  const result = compile("FUNCTION f(x:Int) -> Int RETURN x + 1 END", { filename: "t.pni" });
  assert.equal(result.success, true);
  assert.equal(result.ir.kind, "panini-ir");
  assert.ok(result.ir.functions.some((f) => f.name === "f"));
  assert.ok(result.binary.length > 0);
});

await test("hello_example", async () => {
  const src = fs.readFileSync(path.join(examples, "hello.pni"), "utf8");
  const { result, runtime } = await runSource(src, "hello.pni");
  assert.equal(unwrap(result), 0);
  assert.ok(runtime.prints.includes("Hello, PANINI"));
});

await test("factorial_example", async () => {
  const src = fs.readFileSync(path.join(examples, "factorial.pni"), "utf8");
  const { result } = await runSource(src, "factorial.pni");
  assert.equal(unwrap(result), 720);
});

await test("control_example", async () => {
  const src = fs.readFileSync(path.join(examples, "control.pni"), "utf8");
  const { result, runtime } = await runSource(src, "control.pni");
  // 0..10 sum except 5 = 55-5=50
  assert.equal(unwrap(result), 50);
  assert.ok(runtime.prints.includes("three"));
});

await test("closures_and_lists", async () => {
  const src = `
    FUNCTION compose(f, g)
      RETURN FUNCTION(x)
        RETURN f(g(x))
      END
    END
    FUNCTION inc(x) RETURN x + 1 END
    FUNCTION dbl(x) RETURN x * 2 END
    FUNCTION main()
      h = compose(inc, dbl)
      RETURN h(10)
    END
  `;
  const { result } = await runSource(src, "compose.pni");
  assert.equal(unwrap(result), 21);
});

await test("try_catch", async () => {
  const src = `
    FUNCTION main()
      TRY
        ASSERT FALSE
        RETURN 1
      CATCH error
        RETURN 7
      END
    END
  `;
  const { result } = await runSource(src, "try.pni");
  assert.equal(unwrap(result), 7);
});

await test("file_and_artifact_blocks", async () => {
  const src = fs.readFileSync(path.join(examples, "artifacts.pni"), "utf8");
  const { runtime } = await runSource(src, "artifacts.pni");
  assert.ok(runtime.artifacts.getFile("hello.generated.pni"));
  assert.ok(runtime.artifacts.byId.has("requirements"));
});

await test("selfhost_lexer_in_panini", async () => {
  const src = fs.readFileSync(path.join(examples, "selfhost_lexer.pni"), "utf8");
  const { result, runtime } = await runSource(src, "selfhost_lexer.pni");
  assert.ok(unwrap(result) > 0);
  assert.ok(runtime.prints.includes("FUNCTION"));
  assert.ok(runtime.prints.includes("42"));
});

await test("maps_and_index_assign", async () => {
  const src = `
    FUNCTION main()
      entries = {}
      entries["id"] = "a1"
      RETURN entries["id"]
    END
  `;
  const { result } = await runSource(src, "map.pni");
  assert.equal(unwrap(result), "a1");
});

await test("compiler_idempotence_ir", () => {
  const src = "FUNCTION f(x:Int) -> Int RETURN x END";
  const a = compile(src, { filename: "a.pni" });
  const b = compile(src, { filename: "a.pni" });
  const ja = JSON.stringify(a.ir.functions);
  const jb = JSON.stringify(b.ir.functions);
  assert.equal(ja, jb);
});

await test("spec_parses", () => {
  const src = fs.readFileSync(path.join(root, "spec/PANINI_SELF_HOSTING_SPEC.pni"), "utf8");
  const ast = parse(src, "spec.pni");
  assert.equal(ast.kind, "Program");
  const n = ast.body[0]?.kind === "Module" ? ast.body[0].body.length : ast.body.length;
  assert.ok(n > 10);
});

await test("spec_runnable", async () => {
  const src = fs.readFileSync(path.join(root, "spec/PANINI_SELF_HOSTING_SPEC.pni"), "utf8");
  const { runtime } = await runSource(src, "spec.pni", { specMode: true, runMain: false });
  assert.ok(runtime.functions.size > 0);
});

await test("theorem_modules_run", async () => {
  for (const f of ["stdlib/runtime_interfaces.pni", "stdlib/tests.pni", "src/panini/build.pni", "src/panini/theorem.pni"]) {
    const src = fs.readFileSync(path.join(root, f), "utf8");
    const { runtime } = await runSource(src, f);
    assert.ok(runtime.functions.size > 0);
  }
});

await test("v2_ilm_sri", async () => {
  const { compileV2, irIdentity } = await import("../compiler/v2compile.js");
  const en = compileV2(fs.readFileSync(path.join(root, "examples/v2_functional.pni"), "utf8"));
  const hi = compileV2(fs.readFileSync(path.join(root, "examples/v2_devanagari.pni"), "utf8"));
  assert.equal(irIdentity(en.ir), irIdentity(hi.ir));
});

await test("codegen_js_target", () => {
  const r = compile("FUNCTION add(x,y) RETURN x + y END", { filename: "add.pni", target: "js" });
  assert.ok(r.binary.toString("utf8").includes("function add"));
});

await test("emit_python_c_fortran", () => {
  const src = "FUNCTION add(x,y) RETURN x + y END";
  assert.ok(compile(src, { target: "python" }).binary.toString().includes("def add"));
  assert.ok(compile(src, { target: "c" }).binary.toString().includes("int add"));
  assert.ok(compile(src, { target: "fortran" }).binary.toString().includes("FUNCTION add") || compile(src, { target: "fortran" }).binary.toString().includes("add"));
  assert.ok(compile(src, { target: "torch" }).binary.toString().includes("import torch"));
});

await test("blas_gemm_autotune", async () => {
  const { gemm, autotuneGemm } = await import("../runtime/blas.js");
  assert.deepEqual(gemm(2, 2, 2, [1, 0, 0, 1], [2, 3, 4, 5]), [2, 3, 4, 5]);
  const t = autotuneGemm(16, 16, 16, Array(256).fill(1), Array(256).fill(1), [8, 16]);
  assert.ok(t.best.block);
});

await test("blocks_roundtrip", async () => {
  const { blocksToPanini, paniniToBlocks } = await import("../tools/blocks.js");
  const p = blocksToPanini({ blocks: [{ type: "print", text: "HELLO" }] });
  assert.ok(p.includes("PRINT"));
  assert.equal(paniniToBlocks(p).blocks[0].type, "print");
});

await test("foreign_python_cc", async () => {
  const { runPython, runC, which } = await import("../runtime/toolchain.js");
  assert.ok(which("python"));
  const py = runPython("print(40+2)");
  assert.ok(py.ok);
  assert.equal(py.stdout.trim(), "42");
  if (which("cc")) {
    const c = runC('#include <stdio.h>\nint main(){printf("42\\n");return 0;}\n');
    assert.ok(c.ok, c.stderr);
    assert.equal(c.stdout.trim(), "42");
  }
});

await test("stdlib_cyclers_genie_fakir_charbagh", async () => {
  const src = fs.readFileSync(path.join(root, "stdlib/cyclers.pni"), "utf8");
  const { result, runtime } = await runSource(src, "cyclers.pni");
  assert.equal(unwrap(result), 0);
  assert.ok(runtime.prints.some((p) => String(p).includes("RETRIEVE")));
  assert.ok(runtime.prints.includes("EXISTING_ESTATE"));
  assert.ok(runtime.prints.includes("GENIE"));
});

await test("fetch_specs_and_bios_rom_on_vfs", async () => {
  const { fetchLocalAssets } = await import("./fetch_assets.mjs");
  const { createVfs } = await import("../runtime/vfs.js");
  const { mountBios, BIOS_VFS_PATH } = await import("../runtime/vfs_bios.js");
  const got = await fetchLocalAssets(root);
  const vfs = createVfs();
  let bytes = "AYEB";
  try {
    bytes = fs.readFileSync(got.biosPath, "latin1");
  } catch { /* stub */ }
  assert.ok(mountBios(vfs, bytes));
  const rom = vfs.read(BIOS_VFS_PATH);
  assert.ok(rom.ok);
  assert.ok(String(rom.content).length > 0);
  console.log("       assets", (got.notes || []).join("; "));
});

await test("agi_stack_ship_and_standard_green", async () => {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, [path.join(root, "scripts/agi_green.mjs")], { encoding: "utf8" });
  assert.equal(r.status, 0);
  const g = JSON.parse(fs.readFileSync(path.join(root, "docs/data/agi-green.json"), "utf8"));
  assert.equal(g.n, 27);
  assert.equal(g.standard_green, 1);
  assert.ok(g.layers.find((x) => x.id === "L13" && x.standard === "STANDARD GREEN"));
  assert.ok(g.layers.find((x) => x.id === "L15" && x.ship === "SHIP GREEN"));
  assert.ok(g.layers.find((x) => x.id === "L18" && x.ship === "GAP"));
});

await test("python_standard_green_cpython_language", async () => {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, [path.join(root, "scripts/py_std_green.mjs")], { encoding: "utf8" });
  assert.equal(r.status, 0);
  const g = JSON.parse(fs.readFileSync(path.join(root, "docs/data/python-std-green.json"), "utf8"));
  assert.equal(g.skip0, true);
  assert.ok(g.pass >= 60);
});

await test("qb64_pascal_fortran_std_green", async () => {
  const { spawnSync } = await import("node:child_process");
  for (const s of ["qb64_std_green.mjs", "pascal_std_green.mjs", "fortran_std_green.mjs"]) {
    const r = spawnSync(process.execPath, [path.join(root, "scripts", s)], { encoding: "utf8" });
    assert.equal(r.status, 0, s + " " + (r.stderr || r.stdout || ""));
  }
  const q = JSON.parse(fs.readFileSync(path.join(root, "docs/data/qb64-std-green.json"), "utf8"));
  const p = JSON.parse(fs.readFileSync(path.join(root, "docs/data/pascal-std-green.json"), "utf8"));
  const f = JSON.parse(fs.readFileSync(path.join(root, "docs/data/fortran-std-green.json"), "utf8"));
  assert.equal(q.skip0, true);
  assert.equal(q.standard_green, true);
  assert.ok(q.pass >= 30);
  assert.equal(p.skip0, true);
  assert.equal(p.standard_green, true);
  assert.equal(f.standard_green, false);
});

await test("oop_standard_green_cpp_js_ts_java_st_hs", async () => {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, [path.join(root, "scripts/oop_std_green.mjs")], { encoding: "utf8", timeout: 120000 });
  assert.equal(r.status, 0, r.stderr || r.stdout || "");
  for (const name of ["cpp", "javascript", "typescript", "java", "smalltalk", "haskell"]) {
    const g = JSON.parse(fs.readFileSync(path.join(root, "docs/data", name + "-std-green.json"), "utf8"));
    assert.equal(g.skip0, true, name + " skip0 " + JSON.stringify(g.fails || []).slice(0, 200));
    assert.equal(g.standard_green, true, name);
    assert.ok(g.pass > 0, name);
    assert.equal(g.skip, 0, name);
  }
});

await test("lisp_prolog_standard_green", async () => {
  const { spawnSync } = await import("node:child_process");
  const r = spawnSync(process.execPath, [path.join(root, "scripts/lisp_prolog_std_green.mjs")], { encoding: "utf8", timeout: 120000 });
  assert.equal(r.status, 0, r.stderr || r.stdout || "");
  for (const name of ["lisp", "prolog"]) {
    const g = JSON.parse(fs.readFileSync(path.join(root, "docs/data", name + "-std-green.json"), "utf8"));
    assert.equal(g.skip0, true, name + " skip0 " + JSON.stringify(g.fails || []).slice(0, 200));
    assert.equal(g.standard_green, true, name);
    assert.ok(g.pass > 0, name);
    assert.equal(g.skip, 0, name);
  }
});

await test("console_one_glass_vga", async () => {
  const html = fs.readFileSync(path.join(root, "docs/console.html"), "utf8");
  assert.equal((html.match(/<canvas/g) || []).length, 1);
  assert.ok(html.includes('id="glass"'));
  assert.ok(!html.includes('id="vtcan"'));
  assert.ok(html.includes('c === "vga"'));
  assert.ok(html.includes('c === "screen"'));
  assert.ok(html.includes("pset"));
  const { createVga, vgaPset, vgaScreen, vgaToImageData } = await import("../runtime/vga.js");
  const v = createVga(13);
  assert.equal(v.w, 320);
  assert.equal(v.h, 200);
  vgaPset(v, 10, 10, 14);
  assert.equal(v.pixels[10 * 320 + 10], 14);
  vgaScreen(v, 12);
  assert.equal(v.w, 640);
  assert.equal(v.h, 480);
  const img = vgaToImageData(v);
  assert.equal(img.w, 640);
  vgaScreen(v, 101);
  assert.equal(v.w, 640);
  vgaScreen(v, 103);
  assert.equal(v.w, 800);
  assert.equal(v.h, 600);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
