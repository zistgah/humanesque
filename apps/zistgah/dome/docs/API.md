# API.md — the window surface

## Inbound (you → dome)
- `window.ZISTGAH_DOME` — the config object (CONFIG.md). Read once; the JSON file
  merges over it before boot.
- `window.ZISTGAH_DOME.display(api)` — mount custom geometry.
  `api = { THREE, scene, G, camera, renderer, R, D, domePoint, makeDome }`.
  Add to **`G`** (the hall group) so your work turns with the dome.
- `window.ZDOME_HIT({v, r, name, sub, actLabel, act})` — register a screen-projection
  hit target (a THREE.Vector3 `v` in hall space, pixel radius `r`); it joins the dome's
  own hover/click chain and pops the standard card with your action button.

## Outbound (dome → you)
- **`zdome:drone`** `CustomEvent` at ~10 Hz while piloting —
  `detail = { id, t, zone, emb, x, y, z, yaw, pitch, roll, vx, vy, vz, thr }`.
  The same object is mirrored at `window.ZDOME_DRONE`. This is the seam for showing
  many pilots' drones in one dome: forward the stream, replay remote streams as ghost
  craft. `id` comes from `config.drone.id`.
- `window.ZDOME_POINTCLOUD` — `{ highlight(nodes[]), tick(t), posOf(k,li), count }`
  once a point-cloud display is built (e.g. wire your search box to `highlight`).
- `window.showFlightUI()` — re-evaluate HUD/stick visibility after changing modes.

## Settings persistence
User settings live in `localStorage['zistgah-scene']` — shared across every property on
the origin **by design**: the dome behaves identically everywhere. Keys added by this
lib: `gravity`, `sYaw`, `sPitch`, `sRoll`, `debug`.

## Debug overlay
⚙ → Debug overlay (or `S.debug=true`) shows live variables — zone, embodiment, camera,
hall yaw, F position/velocity/heading, gravity mode, sensitivities, last emit — so a
review round can point at exact numbers.
© 1993–2026 Abhishek Choudhary · AyeAI.
