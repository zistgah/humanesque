# PANINI repository layout (spin-off ready)

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  

GitHub Pages publishes **`docs/` only**.

```
spec/ compiler/ runtime/ src/ cyclers/ examples/ tests/ scripts/ stdlib/
    → stays as zistgah/panini_by_grok  (the language)

docs/                 Pages
  index.html          entry
  nb.html             Hindawi notebook UI
  mez/                Cognitive Workbench (2D rung)
  fakir/              ISIC/ISCO/ISCED explorer
  ilm/                ilm.codes migration
  engine/             flatten + language bundle
  DOCUMENTATION.md SPINOFF.md ESTATE.md …

apps/
  mez/                future zistgah/mez root
  fakir/              future zistgah/fakir slice (domains, not the 90MB dome)
  ilm/                future project-ilm/ilm.codes slice
  hindawi/            future hindawiai docs

factory/              REGISTRY.json · CORRELATION.md · freeze protocol
    scripts/factory_scan.mjs factory_sync.mjs

```

See `docs/SPINOFF.md`.
