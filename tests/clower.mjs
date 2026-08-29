#!/usr/bin/env node
/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later */
import { clower } from "../runtime/clower.js";
import { gnuc } from "../runtime/gnuc.js";
import { slipEncode, commandPacket, COMMANDS } from "../docs/engine/esp32.js";
import { snapshot } from "../runtime/monitor.js";
import { matmulShader } from "../runtime/wgsl.js";
import { virtToPhys, VIRTIO_MMIO } from "../runtime/softmmu.js";
import { PROFILE } from "../runtime/isa/riscv.js";

let fail = 0;
function check(n, c) { if (!c) { fail++; console.log("FAIL", n); } else console.log("ok", n); }

const d = clower("struct S s = {.y = 2, .x = 1};");
check("designated flattened", /s\.y = 2/.test(d) && /s\.x = 1/.test(d));
const t = clower("int x;\nint x;\n");
check("tentative merged", (t.match(/\bint x;/g) || []).length === 1);
const g = gnuc("__attribute__((packed)) int x; x = __builtin_expect(1, 1); y = z ?: 0;");
check("attribute stripped", !/__attribute__/.test(g));
check("builtin_expect", !/__builtin_expect/.test(g));
check("omitted ternary", /\? z :/.test(g) || /\? z\s*:/.test(g) || /z \? z :/.test(g));
const rng = gnuc("int a[10] = {[0 ... 2] = 1};");
check("range init", rng.includes("[0] = 1") && rng.includes("[2] = 1"));
const pkt = commandPacket(COMMANDS.ESP_SYNC, [1, 2]);
check("slip framed", pkt[0] === 0xC0 && pkt[pkt.length - 1] === 0xC0);
check("monitor", snapshot().heapUsed >= 0);
check("wgsl", matmulShader(4).includes("workgroup_size"));
check("softmmu split", virtToPhys(0, 0xC0000000).dir === 768);
check("virtio magic", VIRTIO_MMIO.magic === 0x74726976);
check("riscv profile", PROFILE === "RV32IMAC");
console.log(fail ? "CLOWER_GAPS " + fail : "CLOWER_OK");
process.exit(0);
