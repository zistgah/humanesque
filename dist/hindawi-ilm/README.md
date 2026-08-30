# Hindawi / ILM distribution

© 1993–2026 Abhishek Choudhary. AyeAI. GPL-3.0-or-later.

Keyword tables for the Hindawi Indic Programming System: 27 human languages ×
9 shailis (शैली), **2,555 rules**, every one read out of the 2003–2023
transducers. `invented: false` on every map.

## The transducers COMPOSE — this is the algorithm

    shabdacc:  cat $1 | acii2uni | iconv | h2l   | h2c | flex | gcc
    wyaakacc:  cat $1 | acii2uni | iconv | h2yacc| h2c | bison

`h2l` carries only the four things lex adds beyond C — श_शब्द→yylex,
श_ब_मान→yylval, श_माला→yytext, श_पंक्ति→yylineno — and pipes into `h2c` for the
rest, because **a lex action block is C**. So shabda is 6 own + 321 composed =
**327**, not 6. Reading a composing shaili on its own reports a working system as
a broken one.

    node hindawi_pipeline.mjs <file.uhin>   # which pipeline, how many rules
    node ../../tools/hincc.mjs <file.uhin>  # actually compile it

Three axes, never conflated: **SCRIPT** (acii2uni, the transliteration tables) ·
**LANGUAGE** (the shaili keyword vocabulary) · **STANDARD** (flex, cc, bison).
The `<शैली …>` line selects the pipeline.

A row with an empty native column is **UNRESOLVED**: a speaker must author it.
Nothing here invents a native keyword.
