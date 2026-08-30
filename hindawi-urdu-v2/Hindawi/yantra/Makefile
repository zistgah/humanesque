#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili yantra (asm) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2y_urdu y2h_urdu

h2y_urdu: h2y_urdu.uhin
	cat h2y_urdu.uhin | $(CHAIN) > h2y_urdu.lex
	flex -8 -olexyy.c h2y_urdu.lex
	gcc lexyy.c -oh2y_urdu -lfl

y2h_urdu: y2h_urdu.uhin
	cat y2h_urdu.uhin | $(CHAIN) > y2h_urdu.lex
	flex -8 -olexyy.c y2h_urdu.lex
	gcc lexyy.c -oy2h_urdu -lfl

install:
	install h2y_urdu $(INSTROOT)$(EXECDIR)/h2y_urdu
	install y2h_urdu $(INSTROOT)$(EXECDIR)/y2h_urdu
	install yantracc_urdu $(INSTROOT)$(EXECDIR)/yantracc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2y_urdu y2h_urdu
