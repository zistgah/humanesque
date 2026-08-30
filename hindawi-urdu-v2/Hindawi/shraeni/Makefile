#Copyright (C) 1993-2026 Abhishek Choudhary. GPL v2 or later.
#Hindawi — shaili shraeni (C++) — urdu
EXECDIR=/usr/bin
CHAIN=fixuninum | fltr_ur_hi | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf | tail +2

all: h2cpp_urdu cpp2h_urdu

h2cpp_urdu: h2cpp_urdu.uhin
	cat h2cpp_urdu.uhin | $(CHAIN) > h2cpp_urdu.lex
	flex -8 -olexyy.c h2cpp_urdu.lex
	gcc lexyy.c -oh2cpp_urdu -lfl

cpp2h_urdu: cpp2h_urdu.uhin
	cat cpp2h_urdu.uhin | $(CHAIN) > cpp2h_urdu.lex
	flex -8 -olexyy.c cpp2h_urdu.lex
	gcc lexyy.c -ocpp2h_urdu -lfl

install:
	install h2cpp_urdu $(INSTROOT)$(EXECDIR)/h2cpp_urdu
	install cpp2h_urdu $(INSTROOT)$(EXECDIR)/cpp2h_urdu
	install shraenicc_urdu $(INSTROOT)$(EXECDIR)/shraenicc_urdu

clean_all: clean
clean:
	rm -f lexyy.c *.lex h2cpp_urdu cpp2h_urdu
