# Hindawi / ILM distribution

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

Keyword tables for the Hindawi Indic Programming System across 27 human
languages and 9 shailis (शैली — host-language styles).

    maps/<shaili>.map.json      the computational standard: romenagri or
                                Devanagari -> host keyword. Extracted from the
                                2003-2023 transducers. invented: false.
    langs/<language>/<shaili>.tsv   native <-> romenagri <-> host keyword

**A row with an empty native column is UNRESOLVED**: a speaker must author it.
Nothing here invents a native keyword. A wrong Kashmiri keyword is worse than
an absent one.

Regenerate everything from the retrieved sources:

    node extract_maps.mjs        # nine shailis from the transducers
    node build_ilm_matrix.mjs    # 27 languages x 9 shailis

Three axes, never conflated: SCRIPT (writing system) · LANGUAGE (the
programmer's vocabulary) · STANDARD (the computational construct).
