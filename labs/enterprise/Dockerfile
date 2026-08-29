# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# L15/L24/L25 enterprise lab. Tests, provenance gates. No secrets in the image.
FROM node:22-bookworm-slim
WORKDIR /panini
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates git python3 \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["node", "tests/panini_torture.mjs"]
