# Estate inventory — retrieved, not a live walk

Copyright (C) 1993-2026 Abhishek Choudhary  
SPDX-License-Identifier: GPL-3.0-or-later  
Status: RETRIEVED from the architect, 28 Aug 2026 (07:49).  
**This is not a live estate walk.** The authoritative list is
`gh api user/orgs --paginate` plus per-org repo pagination **on the
architect’s machine**. Recorded scale: **105 orgs / 486 repos**. Below is
the working subset the architect handed over. TRUST ME: do not re-fetch
or re-derive this list as if it were incomplete memory.

This tree (`zistgah/panini_by_grok`) is one sibling implementation. It
does not operate the mint/seal chain, and it does not author ontologies.

Independence: see `INDEPENDENCE.md`. Past employment is biography, not
ownership of this estate.

## zistgah

| Repo | What | State (as handed) |
|---|---|---|
| governance | Master CONTRACT/CONTEXT/AGENTS, `ops/zops.sh`, `zmark.sh`, `contribution_gate.sh`, REGISTRY.json | live; `_z_create_remote_if_needed` has no call site |
| panini | Prompt-cycle language, 6 cyclers as `.pni` | 45/45, not pushed |
| panini_by_claude | Sibling implementation | LIVE, pushed 28 Aug |
| panini_by_grok | This tree | live |
| mez | The desk | live, Pages on |
| fakir | UKOP kernel + dome explorer | live, minted 21436550 / posters 21436552 |
| dome | Shared virtual dome lib | live |
| transeg, transeg-idgov, transeg-research | Embodiment / digital twin | live; #1 open |
| matba · khwab · awaz · tilasm · pench · yadein | Six cyclers | live + minted |
| genie | GENIE + poster book | live |
| kitab | Book template | live |
| poie | Proclamation of Individual Equity | live, 21397274 |
| aab · fiza · zamin | Elemental set | live |
| estate | Estate inventory tool | live |
| tabdili · tarbiyat · zindagi · qaem · paradox | Poster books | tabdili live+minted; others built, mint gated |
| dukedom · duke2 | Vols I/II | built, not pushed |
| amal · copa · vakil | Kaivalyik AGI · COPA · vakil skeleton | various |
| ztools | `zseed` engine | live; force-push defect recorded |
| mrd | MRD corpus | seed built |

## project-ilm

| Repo | What | State |
|---|---|---|
| chakra | Astronomical observatory | live; ~72 open issues |
| misty-doi | `misty` CLI, PyPI | live 1.1.2; 1.1.3 built not landed; DOI 20719388 |
| tok-doi | Atomic OTS layer | live, 21402745 |
| qedler | QEDLER physics | live, Pages on, **not minted** |
| research-kundali | Publication chart | live |
| ilm / ilm.codes | Integrative Linguistic Multiscript | live |
| ops | `publish_paper.sh`, `patent_track.sh`, `convergence_driver`, `dedupe_scan`, `mirror_forges` | live — **retrieve before rebuilding** |
| romenagri · pratik_core_mvp | | live, PWA-seeded |
| .github · ilm-data · ilm-validation | Engineering checklists | live |

## Other orgs (as named)

| Repo | What |
|---|---|
| pvjournal/pajr · pvjournal/pilla | PaJR harvest; PILLA article |
| obonac/tb | zbook tools (zbook itself unpublished) |
| hindawiai / hindawi-legacy | HPS reconstruction |

## Named, no repo

- **spiguard** — extracted from misty on a CBE ruling; **no repo**. Blocks qedler mint (`clearance.require=true` fails closed).
- **zbook** — publishing toolchain, never published.
- AtlasViz, ESL system — in memory, no slug recorded.

## Sites

`zistgah.org` · `ilm.codes` · `hindawi.in` · `humanesque.site` · `forms.ayecnse.site` · `sims.ayecnse.site` · `zistgah.github.io/mez` · `project-ilm.github.io/qedler` · `project-ilm.github.io/tok-doi`

## Gaps named by the architect

1. spiguard has no home (blocks qedler).
2. **175 repos carry no licence** — recorded as the largest legal exposure.
3. REGISTRY.json (5 orgs / 25 repos) is stale against 105 / 486.

Mint/seal, spiguard, and ontology extraction are **out of scope for this tree**.
