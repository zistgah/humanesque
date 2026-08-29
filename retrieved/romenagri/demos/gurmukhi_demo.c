/* Gurmukhi systems-programming demo — Hindawi/ILM localized C
   native: ਜੇ / ਜਦੋਂ ਤੱਕ / ਛਾਪੋ
   Keyword localization per ILM langspec registry; identifiers are
   Romenagri (trigraph _-forms), fully C-identifier-legal.
   Copyright (C) 1993-2026 Abhishek Choudhary. GPL. */
#include <stdio.h>
#define je if
#define jada_taka while
#define chhapo printf
int main(void){
  int gi_n_tee = 0;                 /* counter */
  jada_taka (gi_n_tee < 5) {
    je (gi_n_tee % 2 == 0) chhapo("%d sam\n", gi_n_tee);
    gi_n_tee++;
  }
  return 0;
}
