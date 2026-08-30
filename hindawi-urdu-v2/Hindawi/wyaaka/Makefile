#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili wyaaka (yacc) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2yacc_urdu yacc2h_urdu

h2yacc_urdu: h2yacc_urdu.uhin
	cat h2yacc_urdu.uhin | $(CHAIN) > h2yacc_urdu.lex
	flex -8 -olexyy.c h2yacc_urdu.lex
	gcc lexyy.c -oh2yacc_urdu -lfl

yacc2h_urdu: yacc2h_urdu.uhin
	cat yacc2h_urdu.uhin | $(CHAIN) > yacc2h_urdu.lex
	flex -8 -olexyy.c yacc2h_urdu.lex
	gcc lexyy.c -oyacc2h_urdu -lfl

install:
	install h2yacc_urdu $(INSTROOT)$(EXECDIR)/h2yacc_urdu
	install yacc2h_urdu $(INSTROOT)$(EXECDIR)/yacc2h_urdu
	install wyaakacc_urdu $(INSTROOT)$(EXECDIR)/wyaakacc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2yacc_urdu yacc2h_urdu
