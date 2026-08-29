#!/bin/sh
# Retrieve official standards. Do not invent.
# Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
set -e
d="$(cd "$(dirname "$0")/.." && pwd)/retrieved/standards"
mkdir -p "$d"
cd "$d"
curl -fsSL -o n1570.pdf "https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf"
curl -fsSL -o n4296.pdf "https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4296.pdf"
curl -fsSL -o go-spec.html "https://go.dev/ref/spec"
curl -fsSL -o ecma262.html "https://tc39.es/ecma262/"
curl -fsSL -o python-grammar.html "https://docs.python.org/3.12/reference/grammar.html"
curl -fsSL -o lua-5.4-manual.html "https://www.lua.org/manual/5.4/manual.html"
curl -fsSL -o rust-reference.html "https://doc.rust-lang.org/reference/"
curl -fsSL -o zig-langref.html "https://ziglang.org/documentation/master/"
echo "ok $d"
