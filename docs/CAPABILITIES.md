# PANINI OOP / FP (this tree)

Copyright (C) 1993-2026 Abhishek Choudhary  

Retrieved from the self-hosting spec + parser/interpreter, not a wish list.

| Feature | Spec | This runtime |
|---|---|---|
| MODULE / FUNCTION / IF / WHILE / FOR / FOREACH | yes | yes |
| CLASS / FIELD / METHOD / NEW | yes | yes (init/construct) |
| TRAIT / INTERFACE | keywords | parsed; runtime is structural |
| LAMBDA / `FUNCTION (x) … END` as expression | yes | yes |
| MAP / LIST / index assign | yes | yes |
| MATCH / CASE | v2 | yes |
| ELSEIF | v2/v3 frontends | yes (keyword; nested ELSE IF is nested) |
| Unicode identifiers | ILM | yes |
| मुख्य as entry | linguistic equity | yes |

Gaps: full trait dispatch, typechecker enforcement, ISO-green hosts. Do not claim those.

Theme presets live in `docs/skins/` as CSS (Pages). A PANINI map of the same names is `src/panini/theme.pni` so the configuration is not CSS-only.
