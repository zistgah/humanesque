#!/usr/bin/env python3
# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
"""Lean delivery zip.

Not a dump of the sandbox. Compiler + retrieved Hindawi/Romenagri + the site.
ISO PDFs, GGUF, WASM, firmware blobs, and alias HTML pages stay out.
"""
import os
import sys
import zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = "/workspace/public/site"
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/panini.zip"

SKIP_DIR = {".git", "node_modules", "vendor", "AyeCNSe"}
SKIP_EXT = (".gguf", ".wasm", ".tar.gz", ".zip", ".pdf", ".bin")
SKIP_PREFIX = (
    "docs/",                 # overlay SITE as panini/docs
    "retrieved/standards/",  # ISO/WG14/WG21/ECMA dumps — fetch from the issuing body
    "retrieved/ayebios/",    # firmware blobs
    "retrieved/legacy/Notebooks/",
    "retrieved/src/",
    "tests/iso/",
    "apps/AyeCNSe/",
    "dist/",
    "build/",
    "vendor/",
)
# Copies of *-c / *-cpp / *-basic. One file per stack.
SKIP_ALIAS = ("-guru.html", "-shraeni.html", "-praatha.html")


def skip_rel(rel, name):
    low = name.lower()
    if low.endswith(SKIP_EXT) or low.endswith(".zip"):
        return True
    if rel.startswith(SKIP_PREFIX):
        return True
    if rel.startswith("docs/explorer/posters"):
        return True
    if any(low.endswith(a) for a in SKIP_ALIAS):
        return True
    return False


def add_tree(z, src, prefix, skip_docs_retrieved=False):
    n = 0
    bytes_in = 0
    for dp, dns, fns in os.walk(src):
        dns[:] = [d for d in dns if d not in SKIP_DIR]
        for f in fns:
            p = os.path.join(dp, f)
            rel = os.path.relpath(p, src).replace("\\", "/")
            if skip_rel(rel, f):
                continue
            if skip_docs_retrieved and (rel.startswith("retrieved/") or rel.startswith("explorer/posters")):
                continue
            try:
                st = os.stat(p)
            except OSError:
                continue
            if st.st_size > 2_000_000:
                continue
            arc = os.path.join(prefix, rel).replace("\\", "/")
            try:
                z.write(p, arc)
            except OSError:
                continue
            n += 1
            bytes_in += st.st_size
    return n, bytes_in


def main():
    os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
    tmp = OUT + ".partial"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        n1, b1 = add_tree(z, ROOT, "panini")
        n2, b2 = add_tree(z, SITE, "panini/docs")
        z.writestr(
            "panini/PACKING.txt",
            "PANINI local tree\n"
            "Copyright (C) 1993-2026 Abhishek Choudhary  GPL-3.0-or-later\n\n"
            "This zip is the runnable tree, not a dump of every retrieved ISO PDF.\n"
            "Left out on purpose (named, not hidden):\n"
            "  - retrieved/standards  ISO/ECMA HTML+PDF (n1570, n4296, ECMA-262, …)\n"
            "  - GGUF / WASM guests   fetched at run time by llama.cpp / wllama\n"
            "  - AyeBIOS firmware blobs\n"
            "  - alias standard pages (*-guru.html is *-c.html)\n\n"
            "Web host:  node src/cli.js run examples/hello.pni\n"
            "Binary:    node src/cli.js binary examples/factorial.pni --out factorial\n"
            "Site copy: docs/index.html\n",
        )
    os.replace(tmp, OUT)
    z = zipfile.ZipFile(OUT)
    bad = [i.filename for i in z.infolist() if i.filename.lower().endswith((".gguf", ".wasm", ".pdf"))]
    err = z.testzip()
    print(
        "members", n1 + n2 + 1,
        "src_bytes", b1 + b2,
        "zip_bytes", os.path.getsize(OUT),
        "compiler", n1,
        "docs", n2,
        "testzip", err,
        "forbidden", bad,
    )
    if err or bad:
        sys.exit(1)


if __name__ == "__main__":
    main()
