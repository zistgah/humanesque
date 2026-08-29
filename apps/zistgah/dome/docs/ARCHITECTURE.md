# ARCHITECTURE.md — how the lib relates to the landing

`dome.js` is the zistgah.org landing's dome script **verbatim**, transformed by a
deterministic build with every modification *marked and counted*. Grep the markers:

| Marker | Count | Meaning |
|---|---|---|
| `ZDOME-SEAM` | 17 | The configuration surface: config root, `dome.config.json` loader (boot defers until the merge), content writers, pillars, exhibit names/subs, worlds, spawn, displays, gallery, videos, custom display hook. |
| `FLIGHT-MOD` | 14 | Altitude hold default + gravity toggle; yaw slowed and yaw/pitch/roll sensitivities; thrust-vectored roll; 10 Hz drone emitter; settings wiring. |
| `WORLD-MOD` | 16 | Worlds group turning with the hall + escape-time frame bake; per-world gravity; station bodies; station floor height; chakra dial + oculus jewels parented into the hall (one entity). |
| `UI-MOD` | 9 | Debug overlay; the display hit registry (`ZDOME_HIT`) joined into the dome's projection-based hover/click chain; pop-card action buttons. |
| `STAR-MOD` | 2 | Boundary stars spread across a deep 70–160 shell. |
| `ZDOME-BUILTIN-DISPLAYS` | 1 | The built-in display module: point cloud (after ilm.codes/explore — per-point deterministic scatter, per-point float, window-level picking), viewer's gallery, video screens. |

Two consumers, one source: the FAKIR page and this lib are extracted from the **same
transform output**, so they cannot drift. The landing repository itself remains
untouched; it can adopt the lib whenever its owner chooses.

Boot order: parse → fetch `dome.config.json` → deep-merge → `__worldsCfg()` →
`__spawn()` → `initGL()` (scene, displays, hit registry) → settings → content writers.
Worlds and spawn are set **before** GL so flight state exists even where WebGL does not.
© 1993–2026 Abhishek Choudhary · AyeAI.
