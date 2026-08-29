# Hindawi local toolchain — modern Makefile
# Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
-include config.mk
PANINI_ROOT ?= $(abspath ../..)
PREFIX ?= /usr/local
BINDIR ?= $(PREFIX)/bin
DATADIR ?= $(PREFIX)/share/hindawi
NODE ?= node
CC ?= gcc
DESTDIR ?=

.PHONY: all check install uninstall dist-local clean examples

all: examples
	@echo "hincc ready. Try: make check"
	@echo "compile: $(NODE) $(PANINI_ROOT)/tools/hincc.mjs examples/hindi/guru.uhin"

examples:
	$(NODE) $(PANINI_ROOT)/scripts/release_hindawi.mjs

check: examples
	$(NODE) $(PANINI_ROOT)/tools/hincc.mjs --lang hindi --outdir $(CURDIR)/build \
	  -o $(CURDIR)/build/hindi_guru $(CURDIR)/examples/hindi/guru.uhin
	test -x $(CURDIR)/build/hindi_guru
	grep -q '#include <stdio.h>' $(CURDIR)/build/guru.c
	$(NODE) $(PANINI_ROOT)/tools/hincc.mjs --lang punjabi --emit-only --outdir $(CURDIR)/build \
	  $(CURDIR)/examples/punjabi/guru.uhin
	@echo CHECK_OK

install:
	install -d $(DESTDIR)$(BINDIR) $(DESTDIR)$(DATADIR)
	install -m 0755 bin/hincc bin/guru bin/shraeni $(DESTDIR)$(BINDIR)/
	cp -R examples share $(DESTDIR)$(DATADIR)/
	@echo "installed hincc guru shraeni to $(DESTDIR)$(BINDIR)"

uninstall:
	rm -f $(DESTDIR)$(BINDIR)/hincc $(DESTDIR)$(BINDIR)/guru $(DESTDIR)$(BINDIR)/shraeni
	rm -rf $(DESTDIR)$(DATADIR)

clean:
	rm -rf build

dist-local:
	@echo "The panini zip is the distro. This directory is the local toolchain."
