all: h2logo logo2h
h2logo: h2logo.lex
	flex -8 -oh2logo.yy.c h2logo.lex && cc h2logo.yy.c -oh2logo -lfl
h2logo.lex: h2logo.uhin
	cat h2logo.uhin | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf > h2logo.lex
logo2h: logo2h.lex
	flex -8 -ologo2h.yy.c logo2h.lex && cc logo2h.yy.c -ologo2h -lfl
logo2h.lex: logo2h.uhin
	cat logo2h.uhin | iconv -f utf-8 -t utf-16 | uni2acii | acii2cf > logo2h.lex
clean:
	rm -f *.lex *.yy.c h2logo logo2h
