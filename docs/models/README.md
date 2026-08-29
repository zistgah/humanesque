# Models — not in the delivery zip

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later

The GGUF weights are **not** shipped in `panini.zip` (stories15M Q4_0 is ~19 MB raw / ~9 MB compressed — two-thirds of the previous archive).

`llama-cli` on the VFS loads them at run time:

1. Local (dev tree only): `docs/models/stories15M.Q4_0.gguf`
2. Fetch: [ggml-org/models tinyllamas stories15M-q4_0](https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories15M-q4_0.gguf)

Do not add `*.gguf` to the zip. See `docs/engine/llm.js`.
