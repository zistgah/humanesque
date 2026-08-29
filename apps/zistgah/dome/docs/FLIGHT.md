# FLIGHT.md — the flight system

Embodiments: **quadrotor** (hall and planetary habitats), **transfer rocket**
(world-to-world transits fly themselves), **lander** (low-gravity arrivals). Controls:
`W/S` climb · `A/D` yaw · arrows pitch/roll · `R` reset · gamepad (mode-2) · on-screen
sticks on touch.

## Altitude hold (default) and gravity (optional)
By default the craft **holds altitude**: the throttle axis commands climb *rate*
(±2.4 u/s, smoothly approached), and there is no gravity term — release the stick and
it stays. Switch **⚙ → Gravity** on to restore the original ballistic physics: thrust
along the body's up-vector against `g`, hover near `thr ≈ hoverThr`. The HUD arm
message states which regime you are in.

## Per-world gravity
Effective gravity is `ZP.flight.g × (world.gravity ?? embodiment.g)` — the world wins
when it declares one. Canon: Earth 1 · Mahtab 0.165 · Bahram 0.38 (config patch);
extensions: Ceres 0.029, orbital stations 0. On Ceres at modest throttle the ballistic
craft *climbs* — that is correct, not a bug: the hover point sits near thr ≈ 0.018.

## Sensitivities
⚙ → Flight sliders: **Yaw rate** (default **0.45×** — the original 2.2 rad/s was too
fast), **Pitch sens**, **Roll sens** (default 1×). Persisted.

## Roll is thrust-vectored
Tilt right → thrust vector leans right → the craft moves **right**. (The original
mapping was mirrored; the sign is fixed at the up-vector, with the visual tilt
unchanged.)

## The drone emitter
While piloting, the dome broadcasts `zdome:drone` at ~10 Hz (see API.md) — position,
attitude, velocity, throttle, zone, embodiment, pilot id. This is deliberately
transport-agnostic: pipe it over WebRTC/WebSocket and replay remote details as ghost
craft to put many pilots in the same dome.
© 1993–2026 Abhishek Choudhary · AyeAI.
