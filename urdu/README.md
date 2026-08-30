# ہندوی — اردو / Hindawi — Urdu edition

Copyright (C) 1993-2026 Abhishek Choudhary. GNU GPL v2 or later. NO WARRANTY.
Part of the Hindawi Indic Programming System · Project VIKRAM · AyeAI.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/zistgah/humanesque/blob/main/urdu/Notebooks/hindawi_urdu.ipynb)

مادری زبان میں پروگرامنگ — programming in your own language, down to the debugger.

## Layout — the chintamani structure, retrieved

    Hindawi/     guru شرینی praatha kritrima soochee shabda wyaaka yantra
                 hindrv/  keywords  samples/
    Romenagri/   the transliteration kernel (acii2uni, acii2rmn, tables)
    APCISR/      character-composing inventions
    Notebooks/   hindawi_urdu.ipynb — Colab
    install · uninstall · clean · preinstall_ubuntu.sh · preinstall_fedora.sh

`install`, `uninstall`, `clean`, the preinstall scripts, `hindrv/`, `Romenagri/`
and `APCISR/` are **copied from hindawiai/chintamani**, not rewritten.

## Build and run

    cd Hindawi/guru && make
    ./gurucc ../samples/UrduC.uhin

`<شیلی گرو>` on the first line selects the pipeline, as `<शैली गुरु>` does in the
Devanagari edition.

## Vocabulary

**111 Urdu keywords** across the nine shailis, from `ilm/keywords.csv`. Regenerate
the whole distribution with:

    node tools/hindawi-gen urdu --out urdu/Hindawi

    اگر    if        جبتک   while     برائے  for      واپس   return
    صحیح   int       حرف    char      لکھو   printf   پڑھو   scanf
    ساخت   struct    ورنہ   else      توڑو   break    جاری   continue

## Known defect — stated, not hidden

The preprocessor and header rules (`#شامل` → `#include`, `معیاری.س` → `stdio.h`,
`مرکزی` → `main`) are **present in `ilm/keywords.csv` but are not reaching the
generated `h2c.uhin`** — those rules still carry the Devanagari form. Everything
else transduces: `اگر`, `جبتک`, `برائے`, `صحیح`, `لکھو`, `پڑھو`, `واپس` all
substitute correctly and the body compiles.

The cause is in `tools/hindawi-gen`'s lookup for rules whose retrieved pattern
carries a lex escape (`\#`, `\.`). Until it is fixed, a program using `#شامل`
will not preprocess. `samples/UrduLoops.uhin` avoids the directive and works.

Urdu-Indic digits (۰-۹) are the **script axis** — the Romenagri kernel converts
them, not the keyword table.
