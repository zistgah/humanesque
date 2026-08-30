#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili guru (C) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2c_urdu c2h_urdu

h2c_urdu: h2c_urdu.uhin
	cat h2c_urdu.uhin | $(CHAIN) > h2c_urdu.lex
	flex -8 -olexyy.c h2c_urdu.lex
	gcc lexyy.c -oh2c_urdu -lfl

c2h_urdu: c2h_urdu.uhin
	cat c2h_urdu.uhin | $(CHAIN) > c2h_urdu.lex
	flex -8 -olexyy.c c2h_urdu.lex
	gcc lexyy.c -oc2h_urdu -lfl

install:
	install h2c_urdu $(INSTROOT)$(EXECDIR)/h2c_urdu
	install c2h_urdu $(INSTROOT)$(EXECDIR)/c2h_urdu
	install gurucc_urdu $(INSTROOT)$(EXECDIR)/gurucc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2c_urdu c2h_urdu
