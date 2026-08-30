# Toolchain — from zistgah/panini_by_grok_toolchain_cgpt_fix

Copied whole from that repository, unmodified except that `bin/node_modules/`
was dropped (it is installed by `install.sh`, not vendored here).

46 Unix-named frontends: panc pancxx panpy panjs pants panjava pancs pankt panrb
panperl panphp pango panrs panzig panpas panbas panfort panhs panlisp panscm
panforth panlua pansql pancobol panada panlogo panlex panyacc panas panld
panmake pankconfig panml panjl panoct panpl panst panclj panr panscala panswift
pandart pansysml panpni panini.

**These are named extracts, not the host compilers.** `panc` is not gcc; `panpy`
is a `def`/`return`/`print` subset, not CPython. Exit codes: 0 ran, 1 diagnostic,
2 usage.

**This directory is isolated by design.** It comes from its own repository and
will be reached from there rather than vendored, once the component wiring is in
place. It is bundled here only so this build is presentable as one thing.
