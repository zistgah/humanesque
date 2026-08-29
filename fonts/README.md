# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
# Fonts

- `dos-8x16.f16` — 256 glyphs × 16 rows, 1 byte/row (VGA / CP437 raw).
- TTF load: `VT_LOAD_FONT("name", "/path/to/font.ttf")`  
  Parses `cmap` format 4 and simple `glyf` only (no composites, no CFF/OTF-CFF).
