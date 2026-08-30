#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili soochee (Python) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2py_urdu py2h_urdu

h2py_urdu: h2py_urdu.uhin
	cat h2py_urdu.uhin | $(CHAIN) > h2py_urdu.lex
	flex -8 -olexyy.c h2py_urdu.lex
	gcc lexyy.c -oh2py_urdu -lfl

py2h_urdu: py2h_urdu.uhin
	cat py2h_urdu.uhin | $(CHAIN) > py2h_urdu.lex
	flex -8 -olexyy.c py2h_urdu.lex
	gcc lexyy.c -opy2h_urdu -lfl

install:
	install h2py_urdu $(INSTROOT)$(EXECDIR)/h2py_urdu
	install py2h_urdu $(INSTROOT)$(EXECDIR)/py2h_urdu
	install soocheecc_urdu $(INSTROOT)$(EXECDIR)/soocheecc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2py_urdu py2h_urdu
