/* Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
 *
 * This file is the WRONG approach, kept as a negative example.
 * #define cannot localize a programming language. After gcc -E the
 * vernacular tokens are gone. gdb, nm, and diagnostics speak English.
 * Hindawi changes the lexer (kernel mappings on Romenagri), not the
 * preprocessor. See docs/WHY_DEFINE_IS_NOT_LOCALIZATION.md and docs/faq.html.
 */
#define je if
#define jada_taka while
#define chhapo printf
int main(void) {
  int gi_n_tee = 0;
  jada_taka (gi_n_tee < 3) {
    je (gi_n_tee % 2 == 0) chhapo("%d\n", gi_n_tee);
    gi_n_tee++;
  }
  return 0;
}
