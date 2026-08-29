#!/bin/sh
# Run llama-cli. LLM_CLI and LLM_MODEL may be set.
# Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
set -e
CLI="${LLM_CLI:-}"
if [ -z "$CLI" ]; then
  for c in ./build/bin/llama-cli /tmp/llm/src/build/bin/llama-cli; do
    if [ -x "$c" ]; then CLI=$c; break; fi
  done
fi
if [ -z "$CLI" ] || [ ! -x "$CLI" ]; then
  echo "llama-cli not found. Build with tools/llm/build.sh" >&2
  exit 2
fi
DIR=$(dirname "$CLI")
export LD_LIBRARY_PATH="$DIR:${LD_LIBRARY_PATH:-}"
if [ "${1:-}" = "--version" ] || [ -z "${1:-}" ]; then
  exec "$CLI" --version
fi
MODEL="${LLM_MODEL:-$2}"
PROMPT="${3:-Once upon a time}"
exec "$CLI" -m "$MODEL" -p "$PROMPT" -n 16 -c 128 -t 1 --temp 0 -st --no-jinja
