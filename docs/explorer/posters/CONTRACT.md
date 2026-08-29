# CONTRACT overlay — zistgah/cycles

This is the publication/execution contract for the **Cycles** poster book. It adds constraints to the governing Zistgah architecture; it does not relax higher-level governance.

## 1. Canonical corpus

The Cycles corpus contains **135 poster records**. Poster identity is canonical data.

A published poster is not silently rewritten to repair a discovered defect. A substantive correction becomes a new version/plate with traceable provenance.

## 2. Filename identity is immutable data

**NEVER change the `file` field merely to improve a slug, title, description, or filename.**

The metadata model distinguishes:

- `file` — source/upload poster identity;
- `slug` — semantic/public identifier;
- `title` — human-readable title;
- `sha256` — content identity where available;
- `alsoKnownAs` — explicit alternate identities where present.

Filename matching and slug generation are separate operations.

## 3. No accidental renaming

Any seeding, metadata-filling, slug-fixing, or publication script MUST preserve the existing poster filename exactly unless an explicit migration operation is separately authorized.

A script that changes `file` while generating a slug is contractually incorrect.

## 4. Slug policy

Slugs are generated from the semantic description/title and must be:

- deterministic;
- unique;
- stable once published;
- filesystem-safe;
- independent of the source filename;
- free of vendor/provider names where the contract prohibits them.

A slug collision must be resolved in the slug namespace. It must never be resolved by mutating `file`.

## 5. Source fidelity

The book is seeded from the Cycles corpus. Retrieved material must remain distinguishable from interpretation or later proposal.

Do not silently turn:

- retrieved → generated;
- inferred → established;
- proposed → canonical;
- simulation → experiment;
- commentary → artifact.

## 6. FAKIR invariant

FAKIR obeys:

**RETRIEVE, DON'T RECONSTRUCT.**

Its task is domainal retrieval and orientation, not identity assignment.

ISIC, ISCO and ISCED are source coordinate systems for recovering domains. The classification itself must not be mistaken for the sovereign's identity.

## 7. Varzish invariant

When FAKIR routes toward Varzish, the practice/development environment is retrieved and evidenced rather than invented as an authoritative inheritance.

## 8. Charbagh invariant

Charbagh is triage and wayfinding.

It may:

- route;
- compose;
- initiate derivative-estate constitution;
- invoke GENIE when conceptualization is blocked.

It must not silently become a permanent identity classifier.

## 9. GENIE invariant

GENIE is a meta-cycler, not a stateless text generator.

GENIE may:

- conceptualize;
- orchestrate;
- compose cycles;
- elevate cyclers;
- descend into cycler categories;
- split;
- merge;
- recursively meta-cycle;
- move across modalities;
- manage end-to-end deliverables.

These operations must preserve provenance, identity, state, and applicable contracts.

## 10. Interoperability invariant

**Shared interoperability ≠ shared workflow.**

Composition may connect cyclers through common contracts, but it must not erase:

- lifecycle identity;
- state;
- invariants;
- failure modes;
- artifact semantics;
- evidence requirements;
- governance boundaries.

## 11. Determinism boundary

Lifecycle orchestration should be deterministic wherever contractually possible.

Probabilistic AI/model operations are explicitly delimited from deterministic control semantics.

Replacing a provider must not alter the semantic lifecycle contract.

## 12. Evidence and epistemic status

Claims, measurements, verification states, and release states must retain the evidence required by their cycler.

Simulation and experiment have different epistemic statuses.

Canonical output must not contain an untagged claim whose status or provenance has been erased by synthesis.

## 13. Human gates

Consequential transitions may require explicit human:

- review;
- approval;
- consent;
- authorization;
- release.

An AI may prepare a gate decision or script, but an externally consequential action requiring human authorization is not silently minted by the AI.

## 14. Artifact-first rule

Every meaningful execution step should operate on an artifact, state, evidence record, or explicitly defined lifecycle object.

Prompts are not the deliverable merely because a model emitted text.

## 15. Multimodal semantics

Text, code, data, documents, images, audio, video, models, immersive assets, embodied systems, and memory records may share artifact semantics while retaining modality-specific contracts.

MIME and profiled MIME semantics may participate in validation and routing.

## 16. Architecture/infrastructure separation

Architecture owns:

- semantics;
- state;
- lifecycle;
- provenance;
- contracts;
- invariants.

Infrastructure owns implementation.

The semantic lifecycle must remain portable across local, edge, cloud, simulation, robotics, and other heterogeneous substrates.

## 17. Resolution invariant

EASY, MID and PRO are operating resolutions of the same lifecycle family.

Changing resolution must not silently change the cycler's identity or core invariants.

## 18. Publication integrity

Poster metadata should retain, where available:

- exact `file`;
- `sha256`;
- `slug`;
- title;
- subtitle;
- lead;
- explanation;
- topics;
- part;
- exercise;
- cover status;
- explicit alternate filenames.

Do not collapse these fields into one derived description.

## 19. Seeder requirements

A seeder must:

1. validate the corpus before minting;
2. detect duplicate slugs;
3. detect missing files;
4. detect undeclared assets;
5. preserve exact source filenames;
6. preserve hashes where present;
7. validate required metadata fields;
8. fail loudly on contract violations;
9. produce a deterministic manifest;
10. never push/mint consequential outputs without the required typed human gate.

## 20. Asset discipline

`assets/figures` is data.

Only declared figures and explicitly declared cover assets belong there. An undeclared asset is a contract violation because the seeding system may otherwise mint it unintentionally.

## 21. Tool-interface discipline

Tool interfaces are discovered/read rather than recalled from memory.

A discovered verb does not imply a discovered signature. Execution scripts must use the actual discovered interface and arguments.

## 22. No vendor/provider names in prohibited text layers

Where the governing contract prohibits vendor names, they must not appear in titles, slugs, configuration, metadata, overlays, or other prohibited text layers.

Provider neutrality is an architectural invariant.

## 23. Contractual hierarchy

This overlay is subordinate to the governing Zistgah/Humanesque governance architecture.

Where two rules appear to conflict:

1. preserve source identity and provenance;
2. preserve constitutional/epistemic distinctions;
3. preserve human authorization;
4. preserve artifact and lifecycle semantics;
5. preserve interoperability without homogenization.

## 24. Canonical compact form

```text
INTENT
  → CONCEPT
  → SPECIFY
  → GATE
  → REALIZE
  → TEST
  → VERIFY
  → PACKAGE
  → RELEASE
  → PRESERVE
  → OBSERVE
  → REVISE
  → CONTINUE

FAKIR     → RETRIEVE / ORIENT
CHARBAGH  → ROUTE / COMPOSE / DERIVE
GENIE     → CONCEIVE / ORCHESTRATE / META-CYCLE
CYCLER    → EXECUTE
VARZISH   → PRACTICE / DEVELOP / EVIDENCE
KITAB     → PRESERVE
ZISTGAH   → HOST / INTEROPERATE
HUMANESQUE→ CONSTITUTIONAL GROUND
```
