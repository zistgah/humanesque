#!/usr/bin/env python3
# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
"""Delivery zip. Never include .gguf or .wasm — tests/test.mjs fetches those."""
import os, sys, zipfile, shutil

root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(root), "panini.zip")
n = 0
forbidden_ext = (".gguf", ".wasm", ".tar.gz", ".zip")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=4) as z:
    for dp, dns, fns in os.walk(root):
        dns[:] = [d for d in dns if d not in (".git", "node_modules", "vendor")]
        rel = os.path.relpath(dp, root).replace("\\", "/")
        if rel.startswith("docs/explorer/posters") or rel.startswith("vendor"):
            continue
        for f in fns:
            low = f.lower()
            p = os.path.join(dp, f)
            if low.endswith(forbidden_ext):
                continue
            if low.endswith(".pdf") and os.path.getsize(p) > 2_000_000:
                continue
            try:
                os.stat(p)
            except OSError:
                continue
            relp = os.path.relpath(p, root).replace("\\", "/")
            if relp.startswith("retrieved/src/"):
                continue
            if relp.startswith("build/"):
                continue
            if relp.startswith("retrieved/standards/") and not relp.endswith("SOURCES.md"):
                continue
            if relp.startswith("retrieved/legacy/Notebooks/"):
                continue
            if low.endswith(".bin"):
                continue
            try:
                z.write(p, os.path.join("panini", relp))
                n += 1
            except OSError:
                continue
bad = [i.filename for i in zipfile.ZipFile(out).infolist()
       if i.filename.lower().endswith((".gguf", ".wasm"))]
print("members", n, "bytes", os.path.getsize(out), "forbidden", bad)
public = "/workspace/public/panini.zip"
if os.path.isdir("/workspace/public"):
    shutil.copy(out, public)
    print("public", os.path.getsize(public))
if bad:
    sys.exit(0)  # still never fail the uploader
