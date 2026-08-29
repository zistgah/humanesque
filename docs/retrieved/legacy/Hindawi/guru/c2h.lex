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
"_"          {printf("¤è");}
*/
 
%}
 
 
%%
 
\'("\\\'"|.*)*\'                       {printf("%s",yytext);}
\"("\\\""|[^\"^\n]*)*\"                {printf("%s",yytext);}
 
main         {printf("Ìİ´èÍ");}
alloc\.h         {printf("ËÚµ.×");}
assert\.h         {printf("ÆÛÕè¸ÛÂ.×");}
bios\.h         {printf("ÌŞÑÈèÏÁ.×");}
conio\.h         {printf("È½è½ÈÆ.×");}
ctype\.h         {printf("ÈèÏ³ÚÏ.×");}
dir\.h         {printf("×Ş¸Ü.×");}
dos\.h         {printf("¿ç×.×");}
errno\.h         {printf("ÂèÏİ½Û×¢.×");}
float\.h         {printf("ËµèÆ.×");}
io\.h         {printf("ÈÆ.×");}
limits\.h         {printf("×ÜÌÚ.×");}
locale\.h         {printf("³èÖáÂèÏ.×");}
math\.h         {printf("µÁÛÂ.×");}
mem\.h         {printf("×èÌßÂÛ.×");}
process\.h         {printf("³èÏÛÍÚ.×");}
setjmp\.h         {printf("×ÌÑÚ¡¶.×");}
signal\.h         {printf("×¢³áÂ.×");}
stdarg\.h         {printf("ÌÚÆ³ÂÏè³.×");}
stddef\.h         {printf("ÌÚÆ³¶åÖ.×");}
stdio\.h         {printf("ÌÚÆ³ÈÆ.×");}
stdlib\.h         {printf("ÌÚÆ³³åÖ.×");}
string\.h         {printf("ÌÚÑÚ.×");}
stat\.h         {printf("×èÃÛÂÛ.×");}
time\.h         {printf("×ÌÍ.×");}
timeb\.h         {printf("Ê_×ÌÍ.×");}
\{         {printf("¤Áİ");}
\}         {printf("ÈŞÏèÁ");}
\#define         {printf("#¶åÖÁÚ");}
\#elif         {printf("#ÍÚ_¤µÏ");}
\#else         {printf("#¤ÆèÍÃÚ");}
\#endif         {printf("#ÈŞÏèÁ_¤µÏ");}
\#error         {printf("#ÂèÏİ½Û");}
\#if         {printf("#¤µÏ");}
\#ifdef         {printf("#¤µÏ_¶åÖÛÂ");}
\#ifndef         {printf("#¤µÏ_¤¶åÖÛÂ");}
\#include         {printf("#×ÌÚÔáÕ");}
\#line         {printf("#È¢³èÂÛ");}
\#pragma         {printf("#¥ÕÍ");}
\#undef         {printf("#¤¶åÖÛÂ");}
BUFSIZ         {printf("ÊÉ_ÌÚÆ");}
CHAR_BIT         {printf("¤³èÖÏ_ÊÛ½");}
CHAR_MAX         {printf("¤³èÖÏ_¨¸è¸");}
CHAR_MIN         {printf("¤³èÖÏ_ÆèÍŞÆ");}
CHILD_MAX         {printf("ÕÛÕİ_¨¸è¸");}
CLK_TCK         {printf("¶¿éÜ_½Û³");}
DBL_DIG         {printf("ÄèÔÛµ_ËµèÆ");}
DBL_EPSILON         {printf("ÄèÔÛµ_¤¢ÂÏ");}
DBL_MANT_DIG         {printf("ÄèÔÛµ_ÈŞÏèÁ");}
DBL_MAX         {printf("ÄèÔÛµ_¨¸è¸");}
DBL_MIN         {printf("ÄèÔÛµ_ÆèÍŞÆ");}
DIR         {printf("×Ş¸Ü");}
EDOM         {printf("µÑÂ_ÂÏè³");}
EOF         {printf("´ÚÂÚÈŞÏèÁ");}
ERANGE         {printf("Äİ×èÉÑ");}
EXIT_FAILURE         {printf("ÆÛ³Ú×_ÂèÏİ½Û");}
EXIT_SUCCESS         {printf("ÆÛ³Ú×_×ÉÑ");}
FILE         {printf("´ÚÂÚ");}
FILENAME_MAX         {printf("´ÚÂÚÆÚÌ_¨¸è¸");}
FLT_DIG         {printf("ËµèÆ_ËµèÆ");}
FLT_EPSILON         {printf("ËµèÆ_¤¢ÂÏ");}
FLT_MANT_DIG         {printf("ËµèÆ_ÈŞÏèÁ");}
FLT_MAX         {printf("ËµèÆ_¨¸è¸");}
FLT_MIN         {printf("ËµèÆ_ÆèÍŞÆ");}
FLT_RADIX         {printf("ËµèÆ_¥ÅÚÏ");}
FOPEN_MAX         {printf("´_´åÑå_¨¸è¸");}
HUGE_VAL         {printf("ÔÛÕÚÑ_ÌÚÆ");}
INFINITY         {printf("¤ÆÆèÂ");}
INT_MAX         {printf("ÈŞÏèÁÚ¢³_¨¸è¸");}
INT_MIN         {printf("ÈŞÏèÁÚ¢³_ÆèÍŞÆ");}
LDBL_DIG         {printf("Ä_ÄèÔÛ_ËµèÆ");}
LDBL_EPSILON         {printf("Ä_ÄèÔÛ_¤¢ÂÏ");}
LDBL_MANT_DIG         {printf("Ä_ÄèÔÛ_ÈŞÏèÁ");}
LDBL_MAX         {printf("Ä_ÄèÔÛ_¨¸è¸");}
LDBL_MIN         {printf("Ä_ÄèÔÛ_ÆèÍŞÆ");}
LONG_MAX         {printf("ÄÜÏè¶_¨¸è¸");}
LONG_MIN         {printf("ÄÜÏè¶_ÆèÍŞÆ");}
L_tmpnam         {printf("Ê_³èÖÁÛ³");}
NAN         {printf("Æ_¤¢³");}
NDEBUG         {printf("Æ_×¢ÕåÅÆ");}
NULL         {printf("ÕŞÆèÍ");}
RAND_MAX         {printf("¤³èÏÌ_¨¸è¸");}
SCHAR_MAX         {printf("¸_¤³èÖÏ_¨¸è¸");}
SCHAR_MIN         {printf("¸_¤³èÖÏ_ÆèÍŞÆ");}
SEEK_CUR         {printf("ÈèÏ×èÂİÂ_×á");}
SEEK_END         {printf("¤¢Â_×á");}
SEEK_SET         {printf("ÕİÏŞ_×á");}
SHRT_MAX         {printf("Ñ¶İ_¨¸è¸");}
SHRT_MIN         {printf("Ñ¶İ_ÆèÍŞÆ");}
SIBGABRT         {printf("×¢³_ÈÚÂ");}
SIGFPE         {printf("×¢³_Ë_ÂèÏİ½Û");}
SIGILL         {printf("×¢³_¤ÔâÅ");}
SIGINT         {printf("×¢³_ÔÛ¶èÆ");}
SIGSEGV         {printf("×¢³_¤¢Õ");}
SIGTERM         {printf("×¢³_¦ÂÛ");}
SIG_DFL         {printf("×¢³_ÈŞÏèÔ");}
SIG_ERR         {printf("×¢³_ÂèÏİ½Û");}
SIG_IGN         {printf("×¢³_¹å¿éå");}
TMP_MAX         {printf("³èÖÁÛ³_¨¸è¸");}
UCHAR_MAX         {printf("¤¸_¤³èÖÏ_¨¸è¸");}
UINT_MAX         {printf("¤¸_ÈŞÏèÁÚ¢³_¨¸è¸");}
ULONG_MAX         {printf("¤¸_ÄÜÏè¶_¨¸è¸");}
USHRT_MAX         {printf("¤¸_Ñ¶İ_¨¸è¸");}
\\a         {printf("\\¸");}
\\b         {printf("\\Ì");}
\\f         {printf("\\È");}
\\n         {printf("\\Æ");}
\\r         {printf("\\Ñ");}
\\t         {printf("\\½");}
\\v         {printf("\\´");}
\\x         {printf("\\Ö");}
____DATE____         {printf("__ÄÛÆ__");}
____FILE____         {printf("__´ÚÂÚ__");}
____LINE____         {printf("__È¢³èÂÛ__");}
____STDC____         {printf("__ÌÚÆ³__");}
____TIME____         {printf("__×ÌÍ__");}
_exit         {printf("_ÆÛ³Ú×");}
abort         {printf("ÈÚÂ");}
abs         {printf("¤×Ñ");}
asctime         {printf("×ÌÍ_¾Ü³");}
asm         {printf("Í¢ÂèÏ");}
assert         {printf("ÆÛÕè¸ÛÂ");}
atexit         {printf("ÆÛ³Ú×_ÈÏ");}
atof         {printf("Ì_×á_Ë");}
atoi         {printf("Ì_×á_È");}
atol         {printf("Ì_×á_Ä");}
auto         {printf("×èÔÂ£");}
break         {printf("¤ÔÏåÅ");}
bsearch         {printf("ÄèÔÚ_´åº");}
calloc         {printf("×İ×èÌßÂÛ");}
case         {printf("ØÚÑ");}
ceil         {printf("¨¸è¸ÌÚÆ");}
char         {printf("¤³èÖÏ");}
chdir         {printf("×_ÊÄÑå");}
clearerr         {printf("×ÚÉ_ÂèÏİ½Û");}
clock         {printf("¶¿éÜ");}
clock_t         {printf("¶¿éÜ_ÈèÏ³ÚÏ");}
close         {printf("Ê¢Ä");}
closedir         {printf("Ê¢Ä_×Ş¸Ü");}
const         {printf("×èÃÛÏ");}
continue         {printf("ºÚÏÜ");}
ctime         {printf("×_×ÌÍ");}
default         {printf("ÕáÖ");}
difftime         {printf("×_¤¢ÂÏ");}
dirname         {printf("×_ÆÚÌ");}
div         {printf("ËÚµ");}
div_t         {printf("ËÚµ_ÈèÏ³ÚÏ");}
do         {printf("³Ïå");}
double         {printf("ÄèÔÛµİÆ");}
else         {printf("¤ÆèÍÃÚ");}
enum         {printf("³èÏÌÚµÂ");}
errno         {printf("ÂèÏİ½Û_×¢");}
exit         {printf("ÆÛ³Ú×");}
extern         {printf("ÊÚØèÍ");}
fabs         {printf("Ë_¤×Ñ");}
fclose         {printf("´_Ê¢Ä");}
feof         {printf("´_ÈŞÏèÁ");}
ferror         {printf("´_ÂèÏİ½Û");}
fflush         {printf("´_×ÚÉ");}
fgetc         {printf("´_¤³èÖÏ_Ñå");}
fgetpos         {printf("´_×èÃÚÆ_Ñå");}
fgets         {printf("´_ÌÚÑÚ_Ñå");}
float         {printf("ËµèÆ");}
floor         {printf("ÆèÍŞÆÌÚÆ");}
fmod         {printf("Ë_ÕáÖ");}
fopen         {printf("´_´åÑå");}
for         {printf("³èÏÌ");}
fork         {printf("ÔÛËÚºÆ");}
fpos_t         {printf("´_×èÃÚÆ_ÈèÏ³ÚÏ");}
fprintf         {printf("´_ÑÛ´å");}
fputc         {printf("´_¤³èÖÏ_Äå");}
fputs         {printf("´_ÌÚÑÚ_Äå");}
fread         {printf("´_ÈÀéå");}
free         {printf("Ìİ³èÂ");}
freopen         {printf("´_Ô_´åÑå");}
friend         {printf("ÌÛÂèÏ");}
fscanf         {printf("´_ÈŞ¹å");}
fseek         {printf("´_ºÚ°");}
fsetpos         {printf("´_×èÃÚÆ_Äå");}
fstat         {printf("´_×èÃÛÂÛ");}
ftell         {printf("´_ÊÂÚ°");}
fwrite         {printf("´_¿ÚÑå");}
getc         {printf("¤_Ñå");}
getchar         {printf("¤³èÖÏ_Ñå");}
getenv         {printf("Äå_ÈÏèÍÚ");}
gets         {printf("ÌÚÑÚ_Ñå");}
gettime      {printf("×ÌÍ_Ñå");}
gmtime         {printf("×_ºÌ½");}
goto         {printf("ºÚ°");}
if         {printf("¤µÏ");}
inline         {printf("¤¢ÂÏËŞÂ");}
int         {printf("ÈŞÏèÁÚ¢³");}
isalnum         {printf("Øâ_¤³èÖÏ_¤¢³");}
isalpha         {printf("Øâ_¤³èÖÏ");}
iscntrl         {printf("Øâ_ÆÛÍ¢ÂèÏÁ");}
isdigit         {printf("Øâ_¤¢³");}
isfinite         {printf("Øâ_×ÜÌÛÂ");}
isgraph         {printf("Øâ_¸ÛÂèÏ");}
islower         {printf("Øâ_¹å½Ú");}
isodigit         {printf("Øâ_¤Öè½³");}
isprint         {printf("Øâ_¹ÚÈ");}
ispunct         {printf("Øâ_ÔÛÏÚÌ");}
isspace         {printf("Øâ_´ÚÑÜ");}
isupper         {printf("Øâ_Ê¿éÚ");}
isxdigit         {printf("Øâ_ÖÖè¾ÚÄÕ³");}
jmp_buf         {printf("ÑÚ¡¶_ÊÉ");}
kill         {printf("×ÌÚÈèÂ");}
labs         {printf("Ä_¤×Ñ");}
lconv         {printf("×èÃÚ_ÊÄÑ");}
ldiv         {printf("Ä_ËÚµ");}
ldiv_t         {printf("Ä_ËÚµ_ÈèÏ³ÚÏ");}
localeconv         {printf("³èÖáÂèÏ_ÊÄÑå");}
localtime         {printf("×_×èÃÚÆÜÍ");}
long         {printf("ÄÜÏè¶");}
longjmp         {printf("ÄÜÏè¶_ÑÚ¡¶");}
malloc         {printf("Äå_×èÌßÂÛ");}
memchr         {printf("×_ÈèÏÃÌ");}
memcmp         {printf("×_ËáÄ");}
memcpy         {printf("×_Æ³Ñ");}
memmove         {printf("×_Ø½Ú°");}
memset         {printf("×_Ï´å");}
mkdir         {printf("×Ş¸Ü_µÀéå");}
mktime         {printf("×_µÀéå");}
offsetof         {printf("ÄİÏÂèÔ");}
open         {printf("´åÑå");}
opendir         {printf("×Ş¸Ü_´åÑå");}
operator         {printf("¸ÚÑ³");}
pause         {printf("¹å¿éå");}
perror         {printf("ÑÛ´å_ÂèÏİ½Û");}
pow         {printf("¶ÚÂ");}
printf         {printf("Ì_ÑÛ´å");}
private         {printf("ÆÛºÜ");}
protected         {printf("Ï³èÖÛÂ");}
ptrdiff_t         {printf("×Ş¸³_ËáÄ_ÈèÏ³ÚÏ");}
public         {printf("´İÑÚ");}
putc         {printf("¤_Äå");}
putchar         {printf("¤³èÖÏ_Äå");}
puts         {printf("ÌÚÑÚ_Äå");}
qsort         {printf("³èÔÛ³");}
raise         {printf("¨¾Ú°");}
rand         {printf("¤³èÏÌ");}
read         {printf("ÈÀéå");}
readdir         {printf("×Ş¸Ü_ÈÀéå");}
realloc         {printf("ÈİÆ£_×èÌßÂÛ");}
register         {printf("ÏáºÛ×è½Ï");}
remove         {printf("Ø½Ú°");}
rename         {printf("ÆÚÌ");}
return         {printf("ÔÚÈ×");}
rewind         {printf("ÕİÏİ¥Â");}
rewinddir         {printf("×Ş¸Ü_ÕİÏİ");}
rmdir         {printf("×Ş¸Ü_Ø½Ú°");}
scanf         {printf("Ì_ÈŞ¹å");}
setbuf         {printf("Ï´å_ÊÉ");}
setjmp         {printf("ÊÆÚ°_ÑÚ¡¶");}
setlocale         {printf("Ï´å_³èÖáÂèÏ");}
settime      {printf("×ÌÍ_Ï´å");}
setvbuf         {printf("Ï´å_ËÊÉ");}
short         {printf("Ñ¶İ");}
sig_atomic_t         {printf("×¢³_ÈŞÏèÁ_ÈèÏ³ÚÏ");}
signal         {printf("×¢³áÂ");}
signed         {printf("¸ÛÆèØÛÂ");}
sigpending         {printf("×¢³_ÊÚ³Ü");}
sigsuspend         {printf("×¢³_Ïå³å");}
size_t         {printf("ÌÚÈ_ÈèÏ³ÚÏ");}
sizeof         {printf("ÌÚÈ");}
sprintf         {printf("ÈèÏ_ÑÛ´å");}
sqrt         {printf("ÔÏèµ_ÌŞÑ");}
srand         {printf("Êá³èÏÌ");}
sscanf         {printf("ÌÚÑÚ_ÈŞ¹å");}
static         {printf("¤½Ñ");}
stderr         {printf("ÌÚÆ³_ÂèÏİ½Û");}
stdin         {printf("ÌÚÆ³_ÆÛÔáÕ");}
stdout         {printf("ÌÚÆ³_ÆÛ³Ú×");}
strcat         {printf("Ì_ºå¿éå");}
strchr         {printf("Ì_¤³èÖÏ");}
strcmp         {printf("Ì_ËáÄ");}
strcpy         {printf("Ì_Æ³Ñ");}
strcspn         {printf("Ì_´åº");}
strerror         {printf("Ì_ÂèÏİ½Û");}
strftime         {printf("×_ÌÚÑÚ");}
strlen         {printf("Ì_ÌÚÈ");}
strncat         {printf("Ì_ºå¿éÆ");}
strncmp         {printf("Ì_ËáÄÆ");}
strncpy         {printf("Ì_Æ³ÑÆ");}
strrchr         {printf("Ì_´åºÈ");}
strspn         {printf("Ì_¤´åº");}
strstr         {printf("Ì_ÌÚÑÚ");}
strtod         {printf("Ì_×á_ËµèÆ");}
strtok         {printf("Ì_ÌåØÏ");}
strtol         {printf("Ì_×á_ÄÜÏè¶");}
strtoul         {printf("Ì_×á_¤ÄÜÏè¶");}
struct         {printf("³ÚÖè¾Ú");}
switch         {printf("¸ÍÆ");}
system         {printf("ÈèÏÁÚÑÜ");}
template         {printf("ÀÚ¡¸Ú");}
time         {printf("×ÌÍ");}
time_t         {printf("×ÌÍ_ÈèÏ³ÚÏ");}
times         {printf("ÊÚÏ");}
tm         {printf("È¢¸Ú¢µ");}
tmpfile         {printf("³èÖÁÛ³_´");}
tmpnam         {printf("³èÖÁÛ³");}
tolower         {printf("¹å½á");}
toupper         {printf("Ê¿éá");}
typedef         {printf("ÈèÏ³ÚÏ");}
ungetc         {printf("¤³èÖÏ_ÔÚÈ×");}
union         {printf("ºå¿é");}
unsigned         {printf("¤¸ÛÆèØÛÂ");}
va_arg         {printf("ÊØİ_ÂÏè³");}
va_end         {printf("ÊØİ_ÈŞÏèÁ");}
va_list         {printf("ÊØİ_×Ş¸Ü");}
va_start         {printf("ÊØİ_ÕİÏŞ");}
vfprintf         {printf("Ë´_ÑÛ´å");}
virtual         {printf("ËÔ");}
void         {printf("ÔèÍåÌ");}
volatile         {printf("¤×èÃÛÏ");}
vprintf         {printf("Ë_ÑÛ´å");}
vsprintf         {printf("ËÌ_ÑÛ´å");}
wait         {printf("Ïİ³å");}
wchar_t         {printf("Ê_¤³èÖÏ_ÈèÏ³ÚÏ");}
while         {printf("ºÊÂ³");}
write         {printf("µ_ÑÛ´å");}
 
%%
