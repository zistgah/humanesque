#!/bin/sh
# Build llama.cpp (llm.cpp) with the host C++11 toolchain.
# Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
# GPU SDKs are optional: -DGGML_CUDA=ON / -DGGML_HIP=ON / -DGGML_VULKAN=ON
set -e
ROOT="${LLM_SRC:-${1:-}}"
if [ -z "$ROOT" ]; then
  echo "usage: LLM_SRC=/path/to/llama.cpp $0" >&2
  echo "  or: $0 /path/to/llama.cpp" >&2
  echo "clone: git clone --depth 1 https://github.com/ggml-org/llama.cpp.git" >&2
  exit 2
fi
export PATH="$HOME/.local/bin:/usr/bin:$PATH"
command -v cmake >/dev/null || { echo "cmake missing (python3 -m pip install cmake)"; exit 1; }
command -v g++ >/dev/null || { echo "g++ missing"; exit 1; }
cmake -B "$ROOT/build" -S "$ROOT" \
  -DCMAKE_BUILD_TYPE=Release \
  -DGGML_NATIVE=OFF \
  -DLLAMA_BUILD_TESTS=OFF \
  -DLLAMA_CURL=OFF \
  -DGGML_BLAS=OFF
cmake --build "$ROOT/build" --config Release -j"$(nproc 2>/dev/null || echo 2)" --target llama-cli
BIN="$ROOT/build/bin/llama-cli"
if [ ! -x "$BIN" ]; then
  BIN=$(find "$ROOT/build" -name llama-cli -type f | head -1)
fi
echo "LLM_CLI=$BIN"
"$BIN" --version || "$BIN" -h | head -20
