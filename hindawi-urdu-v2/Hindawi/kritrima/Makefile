#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili kritrima (Java) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2j_urdu j2h_urdu

h2j_urdu: h2j_urdu.uhin
	cat h2j_urdu.uhin | $(CHAIN) > h2j_urdu.lex
	flex -8 -olexyy.c h2j_urdu.lex
	gcc lexyy.c -oh2j_urdu -lfl

j2h_urdu: j2h_urdu.uhin
	cat j2h_urdu.uhin | $(CHAIN) > j2h_urdu.lex
	flex -8 -olexyy.c j2h_urdu.lex
	gcc lexyy.c -oj2h_urdu -lfl

install:
	install h2j_urdu $(INSTROOT)$(EXECDIR)/h2j_urdu
	install j2h_urdu $(INSTROOT)$(EXECDIR)/j2h_urdu
	install kritrimacc_urdu $(INSTROOT)$(EXECDIR)/kritrimacc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2j_urdu j2h_urdu
