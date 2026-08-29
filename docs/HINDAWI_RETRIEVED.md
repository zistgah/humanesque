## Shaili Guru pipeline (retrieved)

`retrieved/legacy/Hindawi/guru/gurucc`:

    cat $1 | acii2uni | iconv -f UTF-16 -t UTF-8 | h2c > temp.c
    gcc temp.c

`h2c.lex` / `c2h.lex` are the token filters (321 / 319 rules extracted into
`docs/retrieved/h2c.map.json`). Those rules are **not invented**.

A keyword table `if` → `यदि` is not this system.
