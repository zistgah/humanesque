# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# L12 linguist lab. Flatten, Romenagri, Hindawi port. icu for Unicode analysis.
FROM node:22-bookworm-slim
WORKDIR /panini
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates icu-devtools python3 \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["node", "src/cli.js", "hindawi-flow"]
