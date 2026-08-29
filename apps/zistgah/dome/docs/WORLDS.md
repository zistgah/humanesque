# WORLDS.md — the Zistgah cosmography

Everything is data: `ZP.worlds`. The canon ships in the lib —

| id | label | pin | arrival embodiment | gravity |
|---|---|---|---|---|
| earth | Earth (below the glass floor, coastlines from chakra-core) | — | — | 1 |
| moon | **Zistgah-e-Mahtab (Mah)** | OASIS | lander | 0.165 |
| mars | **Zistgah-e-Bahram (ZB)** | Mangal Kamna | quadrotor | 0.38 |

Thread the oculus and the other worlds come into view; tap one to launch — the craft
becomes a transfer rocket, and on arrival **the world dictates the body**.

## Extending — replicate the pattern, three times or thirty
Add worlds in `dome.config.json` (`worlds.add`), amend canon with `worlds.patch`.
Each world: `id · label · short · pin? · r · at[x,y,z] · tint · atmo · coast? ·
gravity? · habitat{domeR, embodiment} · kind?`.

- **Planetary habitat**: default `kind`. A sphere with atmosphere shell, optional
  coastlines, and a small wireframe habitat dome floating at the surface.
- **Orbital station**: `kind:"station"` — torus ring, hub, four spokes, beacon; the
  habitat floor sits at `0.30·r`. Gravity 0 pairs naturally with altitude hold.
- Names are rulings, not defaults: the shipped extensions (Ceres, Station A1) are
  labelled *pending your ruling* until the owner names them in the Mahtab/Bahram
  pattern.

## The planet turns with the dome
Dragging the hall rotates the worlds group in sync — the planet below moves with the
dome, as one place. At the moment the pilot threads the oculus, the accumulated hall
yaw is **baked into the pilot frame** (`F′ = R(−yaw)·F`, heading adjusted) and the
worlds group snaps to identity, so all world-space physics — bounds, docking, transit
arcs — remain exact without rotating a single target.
© 1993–2026 Abhishek Choudhary · AyeAI.
