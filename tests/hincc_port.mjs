/**
 * Local Hindawi: Hindi C compiles with gcc. #include survives.
 * Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { compileFile } from "../tools/hincc.mjs";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hincc-"));
const src = "retrieved/legacy/Hindawi/samples/HindiC.uhin";
const r = compileFile(src, { lang: "hindi", shaili: "guru", outdir: tmp, output: path.join(tmp, "hello") });
assert.equal(r.ok, true, r.error);
assert.ok(r.host_text.includes("#include"), r.host_text.slice(0, 200));
assert.ok(r.host_text.includes("<stdio.h>"), "angle include kept");
assert.ok(r.host_text.includes("int main"), r.host_text);
assert.ok(fs.existsSync(path.join(tmp, "hello")));
console.log("ok   hindi_c_gcc");
console.log("ok   samavesh_include");
console.log("HINCC_PORT_OK");
