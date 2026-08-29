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
 
mukhya                     {printf("main");}
praa_thamika\.sa                  {printf("basstub.c");}
bhaaga\.sa                  {printf("alloc.h");}
nishchi_ta\.sa              {printf("assert.h");}
moolapra_nna\.sa              {printf("bios.h");}
pattapana\.sa              {printf("conio.h");}
prakaara\.sa                 {printf("ctype.h");}
soochee\.sa                  {printf("dir.h");}
dausa\.sa                  {printf("dos.h");}
_trutisa_m\.sa                 {printf("errno.h");}
bhagna\.sa                 {printf("float.h");}
pana\.sa                  {printf("io.h");}
seemaa\.sa                  {printf("limits.h");}
kxae_tra\.sa                  {printf("locale.h");}
ga_nni_ta\.sa                {printf("math.h");}
sm_ri_ti\.sa                 {printf("mem.h");}
kriyaa\.sa                 {printf("process.h");}
samalaa_nagha\.sa              {printf("setjmp.h");}
sa_mkae_ta\.sa                {printf("signal.h");}
maanaka_tarka\.sa            {printf("stdarg.h");}
maanakaghoaxa\.sa            {printf("stddef.h");}
maanakapana\.sa            {printf("stdio.h");}
maanakakoaxa\.sa            {printf("stdlib.h");}
maalaa\.sa                  {printf("string.h");}
s_thi_ti\.sa                {printf("stat.h");}
samaya\.sa                {printf("time.h");}
ba_samaya\.sa             {printf("timeb.h");}
 
_a_nnu                     {printf("{");}
poor_nna                     {printf("}");}
\#ghoaxa_nnaa                   {printf("#define");}
\#yaa__agara                 {printf("#elif");}
\#_anya_thaa                  {printf("#else");}
\#poor_nna__agara               {printf("#endif");}
\#_truti                      {printf("#error");}
\#_agara                    {printf("#if");}
\#_agara_ghoaxi_ta             {printf("#ifdef");}
\#_agara__aghoaxi_ta           {printf("#ifndef");}
\#samaawaesha                 {printf("#include");}
\#pa_mk_ti                     {printf("#line");}
\#_aashaya                   {printf("#pragma");}
\#_aghoaxi_ta                 {printf("#undef");}
bapha_maana                 {printf("BUFSIZ");}
_akxara_bita                {printf("CHAR_BIT");}
_akxara__uchcha                {printf("CHAR_MAX");}
_akxara_nyoona               {printf("CHAR_MIN");}
shishu__uchcha                {printf("CHILD_MAX");}
gha_rdee_tika                 {printf("CLK_TCK");}
_dwiga_bhagna              {printf("DBL_DIG");}
_dwiga__a_m_tara              {printf("DBL_EPSILON");}
_dwiga_poor_nna               {printf("DBL_MANT_DIG");}
_dwiga__uchcha               {printf("DBL_MAX");}
_dwiga_nyoona               {printf("DBL_MIN");}
soochee                       {printf("DIR");}
gala_ta__tarka                {printf("EDOM");}
khaa_taapoor_nna                       {printf("EOF");}
_dusphala                     {printf("ERANGE");}
nikaasa__truti                {printf("EXIT_FAILURE");}
nikaasa_saphala             {printf("EXIT_SUCCESS");}
khaa_taa                       {printf("FILE");}
khaa_taanaama__uchcha              {printf("FILENAME_MAX");}
bhagna_bhagna                {printf("FLT_DIG");}
bhagna__a_m_tara                {printf("FLT_EPSILON");}
bhagna_poor_nna                 {printf("FLT_MANT_DIG");}
bhagna__uchcha                 {printf("FLT_MAX");}
bhagna_nyoona                {printf("FLT_MIN");}
bhagna__aa_dhaara                {printf("FLT_RADIX");}
kha_khoaloa__uchcha               {printf("FOPEN_MAX");}
wishaala_maana               {printf("HUGE_VAL");}
_anan_ta                    {printf("INFINITY");}
poor_nnaa_mka__uchcha                {printf("INT_MAX");}
poor_nnaa_mka_nyoona               {printf("INT_MIN");}
_da__dwi_bhagna               {printf("LDBL_DIG");}
_da__dwi__a_m_tara               {printf("LDBL_EPSILON");}
_da__dwi_poor_nna                {printf("LDBL_MANT_DIG");}
_da__dwi__uchcha                {printf("LDBL_MAX");}
_da__dwi_nyoona               {printf("LDBL_MIN");}
_deergha__uchcha                  {printf("LONG_MAX");}
_deergha_nyoona                 {printf("LONG_MIN");}
ba_kxa_nnika                  {printf("L_tmpnam");}
na__a_mka                    {printf("NAN");}
na_sa_mshoa_dhana                {printf("NDEBUG");}
shoonya                      {printf("NULL");}
_akrama__uchcha                {printf("RAND_MAX");}
cha__akxara__uchcha              {printf("SCHAR_MAX");}
cha__akxara_nyoona             {printf("SCHAR_MIN");}
pras_tu_ta_sae                 {printf("SEEK_CUR");}
_a_m_ta_sae                    {printf("SEEK_END");}
shuroo_sae                     {printf("SEEK_SET");}
laghu__uchcha                  {printf("SHRT_MAX");}
laghu_nyoona                 {printf("SHRT_MIN");}
sa_mka_paa_ta                  {printf("SIBGABRT");}
sa_mka_bha__truti                {printf("SIGFPE");}
sa_mka__awai_dha                {printf("SIGILL");}
sa_mka_wighna                {printf("SIGINT");}
sa_mka__a_msha                  {printf("SIGSEGV");}
sa_mka__i_ti                  {printf("SIGTERM");}
sa_mka_poorwa                  {printf("SIG_DFL");}
sa_mka__truti                   {printf("SIG_ERR");}
sa_mka_chhoa_rdoa                  {printf("SIG_IGN");}
kxa_nnika__uchcha                {printf("TMP_MAX");}
_acha__akxara__uchcha            {printf("UCHAR_MAX");}
_acha_poor_nnaa_mka__uchcha           {printf("UINT_MAX");}
_acha__deergha__uchcha             {printf("ULONG_MAX");}
_acha_laghu__uchcha             {printf("USHRT_MAX");}
\\cha                       {printf("\\a");} /*chae_taawanee*/
\\ma                       {printf("\\b");} /*mitaa_oa*/
\\pa                       {printf("\\f");} /*p_rixtha*/
\\na                       {printf("\\n");} /*na_ee pa_mk_ti*/
\\la                       {printf("\\r");} /*loutaa_oa*/
\\ta                        {printf("\\t");} /*taiba*/
\\kha                       {printf("\\v");} /*kha_rdaa taiba*/
\\xa                       {printf("\\x");} /*xaxthaa_dashaka - hexadecimal*/
_____dina____                   {printf("__DATE__");}
____khaa_taa____                   {printf("__FILE__");}
____pa_mk_ti____                   {printf("__LINE__");}
____maanaka____                 {printf("__STDC__");}
____samaya____                 {printf("__TIME__");}
paa_ta                        {printf("abort");}
_asala                        {printf("abs");}
samaya_theeka                    {printf("asctime");}
ya_m_tra                       {printf("asm");}
nishchi_ta                   {printf("assert");}
nikaasa_para                   {printf("atexit");}
ma_sae_bha                     {printf("atof");}
ma_sae_pa                     {printf("atoi");}
ma_sae__da                     {printf("atol");}
swa_ta_hh                      {printf("auto");}
_awaroa_dha                   {printf("break");}
_dwaa_khoaja                   {printf("bsearch");}
susm_ri_ti                   {printf("calloc");}
_haala                       {printf("case");}
_uchchamaana                    {printf("ceil");}
_akxara                      {printf("char");}
sa_ba_daloa                   {printf("chdir");}
saapha__truti                 {printf("clearerr");}
gha_rdee                       {printf("clock");}
gha_rdee_prakaara                 {printf("clock_t");}
ba_m_da                        {printf("close");}
ba_m_da_soochee                   {printf("closedir");}
s_thira                      {printf("const");}
jaaree                       {printf("continue");}
sa_samaya                      {printf("ctime");}
shaexa                       {printf("default");}
sa__a_m_tara                     {printf("difftime");}
sa_naama                    {printf("dirname");}
bhaaga                       {printf("div");}
bhaaga_prakaara                 {printf("div_t");}
karoa                       {printf("do");}
_dwiguna                   {printf("double");}
_anya_thaa                    {printf("else");}
kramaaga_ta                   {printf("enum");}
_truti_sa_m                     {printf("errno");}
nikaasa                    {printf("exit");}
baa_hya                      {printf("extern");}
bha__asala                      {printf("fabs");}
kha_ba_m_da                     {printf("fclose");}
kha_poor_nna                    {printf("feof");}
kha__truti                {printf("ferror");}
kha_saapha                      {printf("fflush");}
kha__akxara_loa                 {printf("fgetc");}
kha_s_thaana_loa                    {printf("fgetpos");}
kha_maalaa_loa                  {printf("fgets");}
bhagna                      {printf("float");}
nyoonamaana                   {printf("floor");}
bha_shaexa                      {printf("fmod");}
kha_khoaloa                    {printf("fopen");}
krama                       {printf("for");}
wibhaajana                  {printf("fork");}
kha_s_thaana_prakaara             {printf("fpos_t");}
kha_likhoa                   {printf("fprintf");}
kha__akxara__doa             {printf("fputc");}
kha_maalaa__doa              {printf("fputs");}
kha_pa_rdhoa                    {printf("fread");}
muk_ta                       {printf("free");}
kha_wa_khoaloa                    {printf("freopen");}
mi_tra                      {printf("friend");}
kha_poochhoa                    {printf("fscanf");}
kha_jaa_oa                      {printf("fseek");}
kha_s_thaana__doa                   {printf("fsetpos");}
kha_s_thi_ti                  {printf("fstat");}
kha_ba_taa_oa                     {printf("ftell");}
kha_daaloa                     {printf("fwrite");}
_a_loa                       {printf("getc");}
_akxara_loa                   {printf("getchar");}
_doa_paryaa                   {printf("getenv");}
maalaa_loa                    {printf("gets");}
sa_jamata                      {printf("gmtime");}
jaa_oa                       {printf("goto");}
_agara                      {printf("if");}
_a_m_tarabhoo_ta                  {printf("inline");}
poor_nnaa_mka                     {printf("int");}
_hai__akxara__a_mka               {printf("isalnum");}
_hai__akxara                    {printf("isalpha");}
_hai_niya_m_tra_nna                {printf("iscntrl");}
_hai__a_mka                     {printf("isdigit");}
_hai_seemi_ta                   {printf("isfinite");}
_hai_chi_tra                    {printf("isgraph");}
_hai_chhoataa                     {printf("islower");}
_hai__axtaka                   {printf("isodigit");}
_hai_chhaapa                     {printf("isprint");}
_hai_wiraama                   {printf("ispunct");}
_hai_khaalee                     {printf("isspace");}
_hai_ba_rdaa                     {printf("isupper");}
_hai_xaxthaa_dashaka                {printf("isxdigit");}
laa_nagha_bapha                  {printf("jmp_buf");}
samaap_ta                    {printf("kill");}
_da__asala                      {printf("labs");}
s_thaa_ba_dala                   {printf("lconv");}
_da_bhaaga                     {printf("ldiv");}
_da_bhaaga_prakaara               {printf("ldiv_t");}
kxae_tra_ba_daloa               {printf("localeconv");}
sa_s_thaaneeya                  {printf("localtime");}
_deergha                       {printf("long");}
_deergha_laa_nagha                 {printf("longjmp");}
_doa_sm_ri_ti                   {printf("malloc");}
sa_pra_thama                    {printf("memchr");}
sa_bhae_da                      {printf("memcmp");}
sa_nakala                      {printf("memcpy");}
sa__hataa_oa                     {printf("memmove");}
sa_rakhoa                      {printf("memset");}
soochee_ga_rdhoa                  {printf("mkdir");}
sa_ga_rdhoa                     {printf("mktime");}
_dura_twa                      {printf("offsetof");}
khoaloa                       {printf("open");}
soochee_khoaloa                  {printf("opendir");}
chaalaka                     {printf("operator");}
chhoa_rdoa                       {printf("pause");}
likhoa__truti                {printf("perror");}
ghaa_ta                        {printf("pow");}
ma_likhoa                     {printf("printf");}
nijee                      {printf("private");}
rakxi_ta                     {printf("protected");}
soochaka_bhae_da_prakaara           {printf("ptrdiff_t");}
khulaa                       {printf("public");}
_a__doa                       {printf("putc");}
_akxara__doa                   {printf("putchar");}
maalaa__doa                    {printf("puts");}
kwika                      {printf("qsort");}
_uthaa_oa                       {printf("raise");}
_akrama                      {printf("rand");}
pa_rdhoa                       {printf("read");}
soochee_pa_rdhoa                  {printf("readdir");}
puna_hh_sm_ri_ti                {printf("realloc");}
raejistara                    {printf("register");}
_hataa_oa                       {printf("remove");}
naama                       {printf("rename");}
waapasa                     {printf("return");}
shuru_aa_ta                      {printf("rewind");}
soochee_shuru                   {printf("rewinddir");}
soochee__hataa_oa                 {printf("rmdir");}
ma_poochhoa                     {printf("scanf");}
rakhoa_bapha                     {printf("setbuf");}
banaa_oa_laa_nagha                  {printf("setjmp");}
rakhoa_kxae_tra                {printf("setlocale");}
rakhoa_bhabapha                    {printf("setvbuf");}
laghu                       {printf("short");}
sa_mka_poor_nna_prakaara            {printf("sig_atomic_t");}
sa_mkae_ta                     {printf("signal");}
chin_hi_ta                    {printf("signed");}
sa_mka_baakee                  {printf("sigpending");}
sa_mka_roakoa                  {printf("sigsuspend");}
maapa_prakaara                 {printf("size_t");}
maapa                       {printf("sizeof");}
pra_likhoa                   {printf("sprintf");}
warga_moola                  {printf("sqrt");}
baekrama                     {printf("srand");}
maalaa_poochhoa                  {printf("sscanf");}
_atala                        {printf("static");}
maanaka__truti                 {printf("stderr");}
maanaka_niwaesha             {printf("stdin");}
maanaka_nikaasa             {printf("stdout");}
ma_joa_rdoa                  {printf("strcat");}
ma__akxara                    {printf("strchr");}
ma_bhae_da                      {printf("strcmp");}
ma_nakala                {printf("strcpy");}
ma_khoaja                      {printf("strcspn");}
ma__truti                   {printf("strerror");}
sa_maalaa                     {printf("strftime");}
ma_maapa                  {printf("strlen");}
ma_joa_rdana                    {printf("strncat");}
ma_bhae_dana                     {printf("strncmp");}
ma_nakalana                  {printf("strncpy");}
ma_khoajapa                     {printf("strrchr");}
ma__akhoaja                     {printf("strspn");}
ma_maalaa                     {printf("strstr");}
ma_sae_bhagna               {printf("strtod");}
ma_moa_hara                  {printf("strtok");}
ma_sae__deergha              {printf("strtol");}
ma_sae__a_deergha           {printf("strtoul");}
kaaxthaa                      {printf("struct");}
chayana                     {printf("switch");}
pra_nnaalee                     {printf("system");}
dhaa_nachaa                       {printf("template");}
samaya                     {printf("time");}
samaya_prakaara               {printf("time_t");}
baara                        {printf("times");}
pa_mchaa_ngga                    |
pa_mchaa_mga                     {printf("tm");}
kxa_nnika_kha                   {printf("tmpfile");}
kxa_nnika                     {printf("tmpnam");}
chhoatae                        {printf("tolower");}
ba_rdae                        {printf("toupper");}
prakaara                      {printf("typedef");}
_akxara_waapasa                 {printf("ungetc");}
joa_rda                        {printf("union");}
_achin_hi_ta                   {printf("unsigned");}
ba_hu__tarka              {printf("va_arg");}
ba_hu_poor_nna              {printf("va_end");}
ba_hu_soochee              {printf("va_list");} /*ba_hu _tarka*/
ba_hu_shuroo               {printf("va_start");}
bhakha_likhoa                    {printf("vfprintf");}
bhawa                       {printf("virtual");}
wyoama                      {printf("void");}
_as_thira                     {printf("volatile");}
bha_likhoa                     {printf("vprintf");}
bhama_likhoa                    {printf("vsprintf");}
rukoa                        {printf("wait");}
ba__akxara_prakaara             {printf("wchar_t");}
jaba_taka                   {printf("while");}
ga_likhoa                      {printf("write");}
 
samaya_loa      {printf("gettime");}
samaya_rakhoa     {printf("settime");}
%%
