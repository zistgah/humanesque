# `#define je if` is not localization

Retrieved from a Claude note (28 Aug 2026) recording the architect’s
bar. Not reconstructed.

`retrieved/romenagri/demos/gurmukhi_demo.c` is **not done**.
`retrieved/legacy/Hindawi/samples/HindiC.uhin` (2004, GPL) is the bar.

1. `gcc -E` evaporates every vernacular token. The translation unit never
   knew Punjabi existed.
2. Diagnostics name `while` / `if` and point at expanded text.
3. gdb / `break main` is English.
4. `nm` / `.debug_str` hold `gi_n_tee`, not `ਗਿਣਤੀ`. Romenagri is a
   round-trip kernel, not the authoring surface.
5. Three macros vs bidirectional lex transducers for C, C++, BASIC, Java,
   Python, lex, yacc, asm.
6. Macros collide with identifiers.

ILM axes stay separate: **script**, **language**, **standard**.
`#define` cannot reach the script axis; the lexer must.

Done means: a deliberate syntax error, gdb, and `nm` still answer in the
programmer’s language. HindiC.uhin already clears that bar.
