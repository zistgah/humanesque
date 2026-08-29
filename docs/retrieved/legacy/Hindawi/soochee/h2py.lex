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
mariyu       {printf("and");}
wa_mti       {printf("as");}
chaatukoawada_m       {printf("assert");}
_asamakaaleeka       {printf("async");}
_ae_duru       {printf("await");}
wida_teeyu       {printf("break");}
_taraga_ti       {printf("class");}
kownasaagi_mchu       {printf("continue");}
nirwachi_mchu       {printf("def");}
_towlagi_mchu       {printf("del");}
waeeraee__u_mtaee       {printf("elif");}
waeeraee       {printf("else");}
_tappa       {printf("except");}
_amaluparachu       {printf("exec");}
_tappu       {printf("false");}
chiwaraku       {printf("finally");}
koasa_m       {printf("for");}
nu_mdi       {printf("from");}
prapa_mcha       {printf("global");}
_u_mtaee       {printf("if");}
_diguma_ti       {printf("import");}
loa       {printf("in");}
_u_m_di       {printf("is");}
_aeemeekaa_du       {printf("None");}
s_thaanika_m_kaani_di       {printf("nonlocal");}
kaa_du       {printf("not");}
laee_daa       {printf("or");}
_u_teer_nna_ta       {printf("pass");}
mu_dri_mchu       {printf("print");}
pae_mchu       {printf("raise");}
_tirigi       {printf("return");}
nija_m       {printf("true");}
praya_tni_mchu       {printf("try");}
_ayi_ta       {printf("while");}
_toa       {printf("with");}
_digubadi       {printf("yield");}
%%
