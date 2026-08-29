# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# L7–L14 engineer lab. Host toolchains for heritage shailis.
FROM node:22-bookworm-slim
WORKDIR /panini
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates build-essential gcc g++ gfortran flex bison python3 make \
    && rm -rf /var/lib/apt/lists/*
COPY . .
CMD ["node", "tests/hindawi_ports.mjs"]
