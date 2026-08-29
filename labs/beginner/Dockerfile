# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# L15/L16 beginner lab. PRINT / LOGO / praatha. No gcc.
FROM node:22-bookworm-slim
WORKDIR /panini
COPY package.json ./
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["node", "src/cli.js", "help"]
