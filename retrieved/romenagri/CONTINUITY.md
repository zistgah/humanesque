# CONTINUITY — resume context for any new session
# Copyright (C) 1993-2026 Abhishek Choudhary.

## THE ARCHITECTURE (canonical, do not flatten)

THREE distinct axes — always keep separate:

AXIS 1 SCRIPT (Layer-1 projection tables):
  Any script → Devanagari hub → Romenagri ASCII-7
  Writing system, not language. tables/*.tsv

AXIS 2 LANGUAGE (langspec keyword registry):
  Bengali যদি = if, Tamil எனில் = if, Urdu اگر = if
  Each language's own vocabulary. langspec/data/lang_*.csv (68 langs × 201 constructs)

AXIS 3 STANDARD (construct ontology, full AGI stack):
  KW_IF → C 'if', Python 'if', VHDL 'elsif', CUDA '__if__'...
  L0 RTL/VHDL/Verilog → L1 Verification → L2 Synthesis → L3 Firmware →
  L4 Systems C/C++ → L5 Parallel CUDA/OpenCL → L6 Distributed →
  L7 AI → L8 Robotics → L9 AGI/ASI
  langspec/output/STANDARD_*.md are the per-language realizations.

WHAT IS ALREADY BUILT (in chintamani/Hindawi):
  hincc = localized C compiler (Hindi, fully working on GCC-15)
  h2c/c2h h2cpp/cpp2h h2yacc/yacc2h h2j/j2h h2b/b2h h2l/l2h = translators
  fltr_ur_hi / fltr_hi_ur = Urdu↔Hindi filters (real executables, not sed)
  HPS CONFORMANCE (Jun 2026): ASM OK, C OK, C++ OK, LEX OK, BASIC OK, YACC OK

AyeCNSe=Nervous System | AyeAI=Cognition | AyeAM=Embodiment (Sense/Think/Act)
System first. Software is one medium.

## MEASURED STATE (ilm01-lin, ~/work/11jun, Jun 2026)
- 2003-04 kernel: 98.68% rev-or-canonical, 1.31% irreducible ([a-z]^4 exhaustive)
- chintamani post-guard: 67.62% rev-or-canonical, 2.70% crash (regression documented)
- Compression: bytes 1.76x, alphabet 51→24, byte-positions 3x (lossless)
  BPE token k<1 at matched merges — honest, not hidden
- 44 Brahmi scripts: projection tables + compile-run conformance
- 68-language langspec: real translations (not transliterations), per-language standards
- Urdu round trip: 62 residue lines (abjad candra forms — characterized, not a failure)
- PA round trip scripted + md5-tracked

## PARETO OPTIMALITY THEOREM (WhatsApp analysis, Jun 12 2026)
Any architecture satisfying: Identity(1), Reversibility(1), Ecosystem(100%), T_independence(1)
must contain a canonical reversible identity layer → is structurally isomorphic to ILM →
belongs to the same equivalence class. No competitor can improve any axis without
violating a constraint. QED. Full theorem in langspec/output/ and on site.

## REMAINING
1. Zenodo DOI (your token, web UI)
2. OTS anchor (ots stamp after pip install --user --break-system-packages opentimestamps-client)
3. Full [a-z]^4 post-guard sweep (~45 min)
4. Real-corpora compression (IndicCorp/Leipzig/PIB news, Hindi/Urdu/Bengali/Telugu)
5. NW-Semitic full tables (in ilm-holy-grail package — extract into tables/)
6. RTIs (rtionline.gov.in, 7 drafts file-ready in outputs/)
7. Court bundle 4 Jul 2026 (capture_evidence.sh)
8. arXiv papers (Paper1 theorem, Paper4 efficiency — drafts in papers/)

## KNOWN BUGS FIXED
- msg pointer/array extern mismatch (root segfault, both kernels)
- tok[i-1] underflow at i=0
- *pop(1) unguarded derefs (matra path)
- qb2c Makefile: -std=gnu89 (GCC-15 C23 implicit-decl fix)
- APCISR make stubs (all/clean_all)
- YACC yyerror prototype: (char*) not ()

## CONSTRAINTS
GPL; © 1993-2026 Abhishek Choudhary; no employer refs; honest figures;
always name kernel variant; flagged-not-faked; systems-first framing.
Substrate independence (Jun 2026): bindings/c autoconf'd — ./configure --with-substrate=iscii|unicode|both builds libromenagri_iscii.a / libromenagri_unicode.a from ONE source set via substrate.h. acii_unicode.h is generated from acii.h. Generic forward differentially verified vs the 2003 byte matcher; Unicode binding roundtrips with zero ISCII. Canonical layer = Romenagri grammar; ISCII is one binding. 2004 sources preserved in bindings/c/lineage-2004/.
