# Hindawi — manipuri_bengali (bengali)

Copyright (C) 1993-2026 Abhishek Choudhary. GPL-3.0-or-later.
Part of the Hindawi Indic Programming System.

## Layout — the original structure

    guru/      गुरु      C        h2c.uhin  c2h.uhin  Makefile  gurucc
    shraeni/   श्रेणी     C++
    praatha/   प्राथमिक   BASIC
    kritrima/  कृत्रिम    Java
    soochee/   सूची      Python
    shabda/    शब्द      lex      composes:  h2l | h2c
    wyaaka/    व्याकरण   yacc     composes:  h2yacc | h2c
    yantra/    यंत्र      asm
    robot/     रोबोट     LOGO
    hindrv/    drivers   hincc  hin2std  std2hin
    keywords   one keyword per line
    samples/   runnable
    exercises/ do these

## Build and run

    cd guru && make          # h2c.uhin -> h2c.lex -> flex -> cc
    ./gurucc ../samples/01-namaste.uhin

A `<शैली …>` line selects the pipeline, as it always has.

## Keyword provenance — undefined keywords

- `projected`

`tsv`/`csv` are retrieved tables. `inherited` takes the vocabulary of a language
written in the same script and register. `projected` maps a Devanagari word
character-wise through this script's own transliteration table;
`projected-partial` means at least one character had no mapping and was carried
through unchanged. **All of it is editable** — this is a starting vocabulary for a
speaker to correct, not a claim of authority. Edit `guru/h2c.uhin` and re-make.

## Script round trip — bengali

79 characters in the table. **79 round-trip exactly; 0 do not.**
bijective over this table
