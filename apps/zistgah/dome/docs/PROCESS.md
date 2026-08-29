# PROCESS.md — the engineering process this repository is built under

This file documents the working method practised between the owner (Abhishek Choudhary)
and the AI builder (Claude Fable 5, Anthropic) across the FAKIR/dome build — recorded
because the process itself proved as valuable as the artefacts. It is AAB (آب) over VGC
(doi:10.5281/zenodo.21264248), as actually lived.

## 1 · Verify by execution — no oracle, no glow
Nothing is claimed done because it parses or looks right. Every increment carries an
executable oracle: `node --check` on every script block; **headless jsdom harnesses
that boot the real shipped page** (polyfilling only genuine environment gaps —
IntersectionObserver, Path2D — and stubbing only the network), assert DOM outcomes,
run the physics (`altitude holds to ±0.001`; `yaw = 0.99 rad/s`; `roll drift −2.66 in
x, ~0 in z`), and prove interaction by **synthesising the user's events** (a window-level
pointerdown/up whose seeded point must sit within a few pixels under the cursor).
When an assertion fails, first ask whether the assertion is wrong (measuring absolute
position instead of drift; demanding a specific point where "nearest under cursor" is
the truth). GPU rasterisation is named explicitly as the one oracle only human eyes run.

## 2 · Reuse verbatim; change through counted seams
The dome was never rebuilt — it is the owner's proven, live code. Changes are surgical
substitutions with unique anchors (`assert count==1`), each carrying a marker
(`ZDOME-SEAM`, `FLIGHT-MOD`, …). The build prints the marker census; the apply script
re-asserts the same numbers on the target machine. Defaults preserve original
behaviour: unconfigured, the lib **is** the landing.

## 3 · Deterministic transforms, not hand edits
Every deliverable is produced by a build script from pristine sources, so it can be
regenerated, diffed, and gated. The library is extracted from the same output as the
consuming page — drift is structurally impossible.

## 4 · Data is count-gated at every boundary
Exhaustive datasets (1,505 nodes: 21/88/238/419 · 10/43/130/436 · 11/29/80) are
asserted at build, at apply, and in the harness. "Exhaustive" is a checked property,
not a description.

## 5 · One-shot scripts; typed human assertions for the irreversible
Delivery is a single `bash apply_*.sh`: verify bundle sha → overlay → structural gates
→ seal → commit — then stop. `git push`, Pages, and DOI minting execute **only** when
the human types the word (`PUSH` / `PAGES` / `MINT`) and a reason; each assertion is
written as an in-toto **Candor receipt** (digest · action · reason · UTC · host),
OTS-stamped, committed. Non-interactive runs auto-skip every gate. The AI never pushes,
never mints.

## 6 · Provenance without fabrication
DOIs are never invented: metadata carries `DOI-PENDING` until a real mint returns one,
then the value is recorded back and committed (`record DOIs … [Candor <digest>]`).
Superseded OpenTimestamps proofs are archived under `attest/history/`, never
overwritten. `MANIFEST.sha256` covers exactly the tracked tree.

## 7 · Scripts live where they run
Working scripts stay inside the invocation directory (`./…`), announce long silent
waits (an unannounced OTS wait once read as a hang), and print what they did in
verifiable terms.

## 8 · Corrections are canon
The owner's review is the highest oracle. Each correction round is captured
(memory + docs), turned into an assertion where possible (the click that "was gone"
is now a synthesized-event test), and answered with the smallest faithful change.
Retrieval precedes architecture: the Mahtab/Bahram worlds pattern was **retrieved**
from the owner's prior rulings, then generalised — never re-invented. Naming remains
the owner's: placeholders say so.

© 1993–2026 Abhishek Choudhary. All rights reserved. · AyeAI ·
Process co-executed and documented with Claude Fable 5 (Anthropic).
