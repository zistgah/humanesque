#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili shabda (lex) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2l_urdu l2h_urdu

h2l_urdu: h2l_urdu.uhin
	cat h2l_urdu.uhin | $(CHAIN) > h2l_urdu.lex
	flex -8 -olexyy.c h2l_urdu.lex
	gcc lexyy.c -oh2l_urdu -lfl

l2h_urdu: l2h_urdu.uhin
	cat l2h_urdu.uhin | $(CHAIN) > l2h_urdu.lex
	flex -8 -olexyy.c l2h_urdu.lex
	gcc lexyy.c -ol2h_urdu -lfl

install:
	install h2l_urdu $(INSTROOT)$(EXECDIR)/h2l_urdu
	install l2h_urdu $(INSTROOT)$(EXECDIR)/l2h_urdu
	install shabdacc_urdu $(INSTROOT)$(EXECDIR)/shabdacc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2l_urdu l2h_urdu
