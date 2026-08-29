%{
/*
Copyright (C) 2003-2023 Abhishek Choudhary
This file is part of the Hindawi Indic Programming System.

The Hindawi Indic Programming Systemis free software; 
you can redistribute it and/or modify it under the terms of the 
GNU General Public License as published by the 
Free Software Foundation; either version 2 of the License, or 
(at your option) any later version.

The Hindawi Indic Programming System is distributed in the hope 
that it will be useful, but WITHOUT ANY WARRANTY; without 
even the implied warranty of MERCHANTABILITY or FITNESS FOR 
A PARTICULAR PURPOSE. See the GNU General Public License for 
more details.

You should have received a copy of the GNU General Public
License along with this file; see the file COPYING. If
not, write to the Free Software Foundation,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
*/

/*
Modifications: (Please maintain reverse chronological order)

	dd-mmm-yyyy, Nature of modification,
                        Name of modifier <alias>,
			email adress of modifier

        31-Jul-2006, Added the modifications section,
                        Abhishek Choudhary <hi_pedler>,
                        choudhary@indicybers.net

End of modifications.
*/

%}


%%

\'("\\\'"|.*)*\'                       {printf("%s",yytext);}
\"("\\\""|[^\"^\n]*)*\"                {printf("%s",yytext);}                                                                  
and       {printf("ÌÏÛÍİ");}
as       {printf("Ô¢½Û");}
assert       {printf("¸Ú½İ³åÔ¿¢");}
async       {printf("¤×Ì³ÚÑÜ³");}
await       {printf("«ÄİÏİ");}
break       {printf("ÔÛ¿ÂÜÍİ");}
class       {printf("ÂÏµÂÛ");}
continue       {printf("³äÆ×ÚµÛ¢¸İ");}
def       {printf("ÆÛÏèÔ¸Û¢¸İ");}
del       {printf("ÂäÑµÛ¢¸İ");}
elif       {printf("ÔáÏá_¨¢½á");}
else       {printf("ÔáÏá");}
except       {printf("ÂÈèÈ");}
exec       {printf("¤ÌÑİÈÏ¸İ");}
false       {printf("ÂÈèÈİ");}
finally       {printf("¸ÛÔÏ³İ");}
for       {printf("³å×¢");}
from       {printf("Æİ¢¿Û");}
global       {printf("ÈèÏÈ¢¸");}
if       {printf("¨¢½á");}
import       {printf("ÄÛµİÌÂÛ");}
in       {printf("Ñå");}
is       {printf("¨¢ÄÛ");}
None       {printf("¬ÌÜ³ÚÄİ");}
nonlocal       {printf("×èÃÚÆÛ³¢_³ÚÆÛÄÛ");}
not       {printf("³ÚÄİ");}
or       {printf("ÑáÄÚ");}
pass       {printf("¨ÂÜÏèÁÂ");}
print       {printf("ÌİÄèÏÛ¢¸İ");}
raise       {printf("Èà¢¸İ");}
return       {printf("ÂÛÏÛµÛ");}
true       {printf("ÆÛº¢");}
try       {printf("ÈèÏÍÂèÆÛ¢¸İ");}
while       {printf("¤ÍÛÂ");}
with       {printf("Âå");}
yield       {printf("ÄÛµİÊ¿Û");}
%%

