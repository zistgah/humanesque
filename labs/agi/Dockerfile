# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# L18–L26 AGI lab. Cyclers, FAKIR data, mez harness (still no vendor API).
FROM node:22-bookworm-slim
WORKDIR /panini
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["node", "src/cli.js", "help"]
