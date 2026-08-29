# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# L23 mathematician lab. Theorems, tensors, Sanskrit keyword math.
FROM node:22-bookworm-slim
WORKDIR /panini
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates python3 \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["node", "scripts/prove_v2.mjs"]
