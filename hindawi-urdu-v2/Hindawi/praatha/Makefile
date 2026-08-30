#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili praatha (BASIC) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2b_urdu b2h_urdu

h2b_urdu: h2b_urdu.uhin
	cat h2b_urdu.uhin | $(CHAIN) > h2b_urdu.lex
	flex -8 -olexyy.c h2b_urdu.lex
	gcc lexyy.c -oh2b_urdu -lfl

b2h_urdu: b2h_urdu.uhin
	cat b2h_urdu.uhin | $(CHAIN) > b2h_urdu.lex
	flex -8 -olexyy.c b2h_urdu.lex
	gcc lexyy.c -ob2h_urdu -lfl

install:
	install h2b_urdu $(INSTROOT)$(EXECDIR)/h2b_urdu
	install b2h_urdu $(INSTROOT)$(EXECDIR)/b2h_urdu
	install praathacc_urdu $(INSTROOT)$(EXECDIR)/praathacc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2b_urdu b2h_urdu
