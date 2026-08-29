/*                                                                                               
                            Abhishek Choudhary's                          [TM]
     ___________________    __                  ______________         
    / _________________ \  /\_\                / ____________ \            
   / /________________ \ \ \/_/               /\ \__________ \ \   
  /\ \           __   \ \ \       __          \ \ \     __  \ \ \
  \ \ \         /\ \   \ \_\     /\ \          \ \_\   /\ \  \ \ \
   \ \ \        \ \ \   \/_/     \ \ \          \/_/   \ \ \  \ \ \
    \ \ \        \ \ \            \ \ \                 \ \ \  \ \ \
     \ \ \        \/  \            \/  \             ____\_\ \  \ \ \
      \ \ \       /   /            /   /            /         \  \ \ \
       \ \ \     /   /            /   /            /   _______ \  \ \ \
        \ \ \   /\  /________    /   /            /\  /______ \ \  \ \ \
         \ \ \  \ \_  ______ \  /\  /             \ \ \      \ \ \  \ \ \
          \ \ \  \_/ /_____ \ \ \ \ \     ________ \ \ \      \ \ \  \ \ \
           \ \ \  /\ \     \ \_\ \ \ \   /\  ____ \ \ \ \______\_\ \  \ \ \
            \ \ \ \ \ \     \/_/  \ \ \  \ \ \__ \ \ \ \___________ \  \ \ \
             \ \ \ \ \ \           \ \ \  \ \ \ \ \ \ \___________ \ \  \ \ \
              \ \ \ \ \ \_______    \ \ \__\_\ \_\/ /             \ \ \  \ \ \
               \ \_\ \ \________\    \ \_______  __/               \ \_\  \ \_\
                \/_/  \_________/     \_______ \ \/                 \/_/   \/_/
                                              \ \_\
                                               \/_/
  
                    Hindawi Programming System for Indian Languages
  
   [TM] Notice:
   "Hindawi Programming System" and the Hindawi Logo in Devnagari script are
   trademarks of Abhishek Choudhary and Sweta Choudhary, licensed to be used
   without any royalty for Hindawi Programming System for Indian Languages
   software only, AND, any other usage of this Logo, title, or the graphic
   imitation of these in any form or media is not permitted without a prior
   and legally appropriate written permission from the holders of the 
   trademarks, WHEREAS, the software, ALONE, is under GPL and any derivative,
   WHATSOEVER, may be distributed according to the conditions of GNU GPL V2
   described below, as long as the Hindawi Logo or the "Hindawi Programming
   System" title are NOT replicated, NOTWITHSTANDING, the clauses of the GNU
   GPL V2 license, AND, other conditions and legislations applicable to the 
   use of the software and the trademarks, AS PER the appplicable laws of the
   country of usage.
  
   Copyright (C) 2003,2004,2005,2006 Abhishek Choudhary
   Copyright (C) 2007,2008 Sweta Choudhary
   This file is part of the Hindawi Programming System.
  
   The Hindawi Programming System is free software; 
   you can redistribute it and/or modify it under the terms of the 
   General Public License as published by the 
   Free Software Foundation; either version 2 of the License, or 
   (at your option) any later version.
   
   The Hindawi Programming System is distributed in the hope
   that it will be useful, but WITHOUT ANY WARRANTY; without 
   even the implied warranty of MERCHANTABILITY or FITNESS FOR 
   A PARTICULAR PURPOSE. See the GNU General Public License for 
   more details.
   
   You should have received a copy of the GNU General Public
   License along with this file; see the file COPYING. If
   not, write to the Free Software Foundation,
   51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
  
   You can get more information from the following sources
                  WWW:    http://www.hindawi.in
                  Email:  info@hindawi.in
  
*/

#include <stdio.h>
#include <string.h>
#include <stddef.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>
#include <ctype.h>
#include <conio.h>

#define LMAX 128 /* Max strig length */
#define PMAX 104

#include "apcisr.h"
#include "aci2cisr.h"
#include "globals.h"
#include "robgraph.h"
#include "keybrd.h"
#include "rmn2acii.h"

/*globals*/
cisr dvn;
char ikeyret2[15];
char *ikeyret=ikeyret2;
int _cur_x, _cur_y, _smx;


/*for the conversion functions*/
char msg2[2048], *msg=msg2;
signed short *array[10];
char unibuf[1024];

/* Function declarations */
extern char  *MID_S(char *, int, int);
extern char  *STR_S(double);
extern int    VAL(char *);
extern int    LEN(char *);
extern char  *COMMAND_S(int, char *argv_S[]);
extern char  *DATE_S(int);
extern char  *TIME_S(int);
extern long   Int(double);

extern char  *poorwakxaya_S(char*);
extern char  *_a_m_takxaya_S(char*);


/* Shared variables and arrays declarations */
static char   w__S[16][LMAX];
static int    j__S = 0, j__Stmp;
static int    w__s[16];
static int    i__s = 0, i__stmp;
static float  w__f[16];
static int    i__f = 0, i__ftmp;
static double w__d[16];
static int    i__d = 0, i__dtmp;
static char tws__S[LMAX];
static char poorwaa_daesha_S[LMAX];

/* Open files pointers */
FILE *fp__1;
char fn1__S[160];

main(int n_arg_int, char *argv_S[])
{
 static int  dummy_int, i_int, px_int, py_int, fx_int, fy_int, ix_int, iy_int, c_int, nl_int;
 static float interface, skip, done, a, tx, ty, root_two, pen_nib, u_pnt;
 static char a_S[PMAX], g_S[PMAX], _di_S[PMAX], abs_S[PMAX], ka_S[PMAX];
 static char g1_S[PMAX], b_S[PMAX];
 /*main*/
 int ____i____=0;
 FILE *fp;
 _wscroll=0; _smx=16;
 _cur_x=wherex(); _cur_y=wherey();
 /*system("if exist allegro.cfg del allegro.cfg");*/

 for(____i____=0;____i____<10;____i____++){array[____i____]=(signed short *)malloc(sizeof(signed short) * 64002);}
 n_arg_int--; strcpy(poorwaa_daesha_S,COMMAND_S(n_arg_int, argv_S));

 n_arg_int--;

 chou_rdaa_ee(1);

  clrscr();
  gotoxy(1,1);
  _cur_x=1; _cur_y=1;
 interface = 0;
 skip = 1;
 strcpy(a_S,poorwaa_daesha_S);
 if(LEN(a_S) == 0)
 {
  interface = 1;
 }
 else
 {
  if((fp__1 = fopen(strcpy(fn1__S,a_S), "r")) == NULL)
  {
   fprintf(stderr,"´ÚÂÚ ÆØÜ¢ ´ÝÑÚ %s\n",fn1__S); exit(1);
  }
  par_daa(1);
 }
 done = 0;
 strcpy(g_S,"");
 while(done == 0)
 {
  if(interface == 1)
  {
	par_daa(1);
  }
  /* prathmik shailee equiv of BASIC's DRAW */
  /* mid$ kae li_ae neechae kee laa_eena _aawashyaka then */
  dummy_int = VAL(MID_S("1234", 2, 2));
  i_int = 1;
  px_int = 0;
  py_int = 0;
  fx_int = 0;
  fy_int = 0;
  ix_int = 0;
  iy_int = 0;
  c_int = 15;
  a = 0;
  tx = 0;
  ty = 0;
  root_two = sqrt(2);
  pen_nib = 1;
  u_pnt = 1;
  px_int=fx_int=ScreenWidth/2;
  py_int=fy_int=ScreenHeight/2;

  while(i_int < LEN(g_S))
  {
   ix_int = 0;
   iy_int = 0;
	nl_int = 0;
		 if(strcmp(MID_S(g_S,i_int,2),"©#")==0)
  {
    while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+2+nl_int,1)[0] >= 48 &&
           MID_S(g_S,i_int+2+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = -1*(int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
	 ix_int = (int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
  }
  else if(strcmp(MID_S(g_S,i_int,2),"Æ#")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+2+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+2+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = (int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
	 ix_int = -1*(int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
  }
  else if(strcmp(MID_S(g_S,i_int,2),"Ê#")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+2+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+2+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = -1*(int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
	 ix_int = -1*(int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
  }
  else if(strcmp(MID_S(g_S,i_int,2),"Ä#")==0)
  {
    while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
    while( MID_S(g_S,i_int+2+nl_int,1)[0] >= 48 &&
           MID_S(g_S,i_int+2+nl_int,1)[0] <= 57 ){nl_int++;}
    iy_int = (int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
    ix_int = (int)(VAL(MID_S(g_S,i_int+2,nl_int)) / root_two);
  }
  else if(strcmp(MID_S(g_S,i_int,1),"©")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = -1 * VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"Æ")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"Ê")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 ix_int = -1 * VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"Ä")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 ix_int = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"³")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 pen_nib = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"Ñ")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 u_pnt = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"Ï")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 c_int = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"¶")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( (MID_S(g_S,i_int+1+nl_int,1)[0] >= 48  &&
				MID_S(g_S,i_int+1+nl_int,1)[0] <= 57) ||
				MID_S(g_S,i_int+1+nl_int,1)[0] == 'E' ||
				MID_S(g_S,i_int+1+nl_int,1)[0] == '+' ||
				MID_S(g_S,i_int+1+nl_int,1)[0] == '-' ||
				MID_S(g_S,i_int+1+nl_int,1)[0] == '.' ){nl_int++;}
	 a = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"º")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 ix_int = VAL(MID_S(g_S,i_int+1,nl_int))-px_int;
	 i_int+=(nl_int+1); nl_int=0;
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 44 ){nl_int++; i_int++;}
	 nl_int=0;
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = VAL(MID_S(g_S,i_int+1,nl_int))-py_int;
  }
  else if(strcmp(MID_S(g_S,i_int,1),"È")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 px_int = VAL(MID_S(g_S,i_int+1,nl_int));
	 i_int+=(nl_int+1); nl_int=0;
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 44 ){nl_int++; i_int++;}
	 nl_int=0;
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 py_int = VAL(MID_S(g_S,i_int+1,nl_int));
  }
  else if(strcmp(MID_S(g_S,i_int,1),"Ë")==0)
  {
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 ix_int = VAL(MID_S(g_S,i_int+1,nl_int));
	 i_int+=(nl_int+1); nl_int=0;
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 44 ){nl_int++; i_int++;}
	 nl_int=0;
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] == 32 ){nl_int++; i_int++;}
	 while( MID_S(g_S,i_int+1+nl_int,1)[0] >= 48 &&
			  MID_S(g_S,i_int+1+nl_int,1)[0] <= 57 ){nl_int++;}
	 iy_int = VAL(MID_S(g_S,i_int+1,nl_int));
	bharoa(ix_int, iy_int, c_int);
	ix_int = 0;
	iy_int = 0;
  }
  else {i_int++; continue;}

	/* translate final points */
	fx_int = px_int + ix_int;
	fy_int = py_int + iy_int;
	/* rotate final points */
	/* tx = px% + (fx% - px%) * cos(a) - (fy% - py%) * sin(a) */
	/* ty = py% + (fx% - px%) * sin(a) + (fy% - py%) * cos(a) */
  tx=px_int+(fx_int-px_int);
  ty=py_int+(fy_int-py_int);
  fx_int=(int)tx;
  fy_int=(int)ty;
	if(pen_nib == 1)
	{
	 raekhaa(px_int, py_int, fx_int, fy_int, c_int,0);
	}
	if(u_pnt == 1)
	{
	 px_int = fx_int;
	 py_int = fy_int;
	}
	i_int = i_int + 1;
  }
  if(!skip && interface) while(!kbhit());


  if(interface == 1)
  {
	if(LEN(g_S) > 0)
	{
	 wila_mba();
	}
	par_daa(0);
	chou_rdaa_ee(1);

  clrscr();
  gotoxy(1,1);
  _cur_x=1; _cur_y=1;
	s_thaana(1,1);
	ra_mga(15,14);
	likhoa("    ÕâÑÜ ÏåÊå½ ×¢×è³ÏÁ- 0.2.1 ³    ");
	s_thaana(1,2);
	ra_mga(1,10);
	likhoa("  Copyright (C)2006 ¤ËÛÖá³ ¸æÅÏÜ  ");
	s_thaana(1,3);
	sprintf(_di_S,"%s%s"," ÄÛÆÚ¢³: ",DATE_S(0));
	sprintf(abs_S,"%s%s","×ÌÍ: ",TIME_S(0));
	sprintf(ka_S,"%s%s%s",_di_S,"  ",abs_S);
	ra_mga(15,11);
	likhoa(ka_S);
	ra_mga(12,0);
	s_thaana(40,1);
	likhoa("GNU-GPL V2.");
	ra_mga(15,0);
	likhoa(" Visit http://www.hindawi.in");
	ra_mga(7,0);
	s_thaana(40,2);
	likhoa("If you cannot see Hindi press Alt-Enter ");
	s_thaana(40,3);
	likhoa("×ØÚÍÂÚ :");
	ra_mga(15,0);
	likhoa("ÌÄÄ");
	ra_mga(7,0);
	likhoa("   ÆÛ³Ú× :");
	ra_mga(15,0);
	likhoa("¦ÂÛ");
	ra_mga(7,0);
	s_thaana(1,4);
	sprintf(g1_S,"%s %s","¥ÄáÕ->",g_S);
	likhoa(g1_S);
	s_thaana(8,4);
	poochhoa("", g_S);
  }
  else
  {
	if(! feof(fp__1))
	{
	 fgets(b_S, LMAX, fp__1);
	 b_S[strlen(b_S) - 1] = '\0';
	 strcpy(g_S,b_S);
	 if(strcmp(poorwakxaya_S(_a_m_takxaya_S(g_S)), "<ÕâÑÜ ÈèÏÚÃÌÛ³>") == 0)
	 {
	  strcpy(g_S,"");
	 }
	}
	else
	{
	 strcpy(g_S,"¦ÂÛ");
	}
  }
  if(strcmp(poorwakxaya_S(_a_m_takxaya_S(g_S)), "¦ÂÛ") == 0)
  {
	done = 1;
  }
  if(strcmp(poorwakxaya_S(_a_m_takxaya_S(g_S)), "ÌÄÄ") == 0)
  {

  clrscr();
	s_thaana(1,1);
	ra_mga(15,1);
	likhoa("ÕâÑÜ ÏåÊå½ ³á ¥ÄáÕ");
	ra_mga(7,0);
	s_thaana(5,2);
	likhoa("© x    : x ³ÄÌ ©ÈÏ ³Ü °Ï Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,3);
	likhoa("Æ x    : x ³ÄÌ ÆÜ¸á ³Ü °Ï Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,4);
	likhoa("Ê x    : x ³ÄÌ ÊÚ¡¬ °Ï Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,5);
	likhoa("Ä x     : x ³ÄÌ ÄÚ¡¬ °Ï Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,6);
	likhoa("©# x   : x ³ÄÌ ©ÈÏ ³Ü °Ï ÂÛÏ¹Ü Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,7);
	likhoa("Æ# x   : x ³ÄÌ ÆÜ¸á ³Ü °Ï ÂÛÏ¹Ü Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,8);
	likhoa("Ê# x   : x ³ÄÌ ÊÚ¡¬ °Ï ÂÛÏ¹Ü Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,9);
	likhoa("Ä# x    : x ³ÄÌ ÄÚ¡¬ °Ï ÂÛÏ¹Ü Ïá´Ú ´Ü¢¸Æá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,10);
	likhoa("³ x    : x=0 ³ÑÌ ©ÈÏ;   x=1 ³ÑÌ ÆÜ¸á");
	s_thaana(5,11);
	likhoa("Ï x     : Ï¢µ x ¸ÍÆ ³ÏÆá ØáÂÝ");
	s_thaana(5,12);
	likhoa("Ñ x    : x=0 Ñæ½å;   x=1 ÌÂ Ñæ½å");
	s_thaana(5,13);
	likhoa("¶ x    : ¸ÛÂèÏ-È½è½ ³å x ³åÁ radian ¶ÝÌÚÆá ØáÂÝ ¥ÄáÕ");
	s_thaana(5,14);
	likhoa("º(x,y) : (x,y) ÊÛÆèÄÝ Â³ Ïá´Ú ´Ü¢¸³Ï ºÚÆá ØáÂÝ");
	s_thaana(5,15);
	likhoa("È(x,y) : (x,y) ÊÛÆèÄÝ ÈÏ ÈØÝ¡¸Æá ØáÂÝ");
	s_thaana(5,16);
	likhoa("Ë(x,y) : (x,y) ÊÛÆèÄÝ ³å ³á¢ÄèÏÛÂ ³Ï Ï¢µ ËÏÆá ØáÂÝ ¥ÄáÕ");
	wila_mba();
  }
  skip = 0;
 }

 if(interface != 1)
 {
  fclose(fp__1);
	while(!kbhit());
 }
 par_daa(-1);
 chou_rdaa_ee(1);

  clrscr();
  gotoxy(1,1);
  _cur_x=1; _cur_y=1;
	return 0;
} /* End of MAIN */






/*- User SUB--Start -*/
extern char  *chaabee_S()
{
  return inkeyread();
}


/*- User SUB--Start -*/
extern float chaabee__dabaayaa()
{
  return kbhit();
}


/*- User SUB--Start -*/
extern float cha__dabaayaa()
{
  return kbhit();
}


/*- User SUB--Start -*/
int chou_rdaa_ee(int   i_int)
{
	textmode(C4350);
	system("fontdo");
	_smx=16;
	return _smx;
}




/*- User SUB--Start -*/
int na_s_thaana(int   m_int)
{

 naweena_s_thaana(m_int);

 return m_int;
}




/*- User SUB--Start -*/
int naweena_s_thaana(int   m_int)
{
  int  x_int, y_int;


 /* new-line */

 x_int = 0;
 y_int = 0;

  x_int=_cur_x=1; y_int=_cur_y+=3;

 if(y_int > m_int * 3)
 {
  y_int = 1;
 }

  gotoxy(1,y_int);
  _cur_x=1; _cur_y=y_int;

  return 0;
}




/*- User SUB--Start -*/
extern char  *_dwi_S(long  kc_long)
{
  char b_S[LMAX];
  long p_long, c_long;


 /* returns a value */

  unsigned long k, mask = 15;

  int c, i = 0;

  k = (unsigned long)kc_long;

  if (++j__S == 16) j__S=0;

 strcpy(b_S,"");

 p_long = 0;

  p_long=k;

 while(p_long)
 {

  c_long = p_long % 2;

  sprintf(tws__S,"%s%s",poorwakxaya_S(STR_S(c_long)),b_S);
  strcpy(b_S,tws__S);

  p_long = Int(p_long / 2);

 }

 /* b$ = STRING$(16 - LEN(b$), 48) + b$ */

  b_S[16]=0;

  strcpy(w__S[j__S],b_S);

  return w__S[j__S];

}




/*- User SUB--Start -*/
extern char  *_dwaapa_da_S(int   p_int)
{

 return _dwi_S(p_int);

}




/*- User SUB--Start -*/
extern char  *poorwakxaya_S(char  *g_S)
{
  int  p_int;


 /* returns a value */

 p_int = 0;

  while((p_int<strlen(g_S)) && g_S[p_int]==32){p_int++;}

  return(g_S+p_int);

}




/*- User SUB--Start -*/
extern char  *_an_takxaya_S(char  *g_S)
{
  int  p_int;


 /* returns a value */

 p_int = 0;

  p_int=strlen(g_S)-1;

  while(p_int && g_S[p_int]==32) { p_int--;}

  g_S[p_int+1]=0;
 return g_S;
}




/*- User SUB--Start -*/
extern char  *_a_m_takxaya_S(char  *g_S)
{

 /* returns a value */

 return _an_takxaya_S(g_S);

}



/*- User SUB--Start -*/
int s_thaana(int x, int y)
{

 /* locate */

 if(x < 1)
 {
  x = 1;
 }

 if(y < 1)
 {
  y = 1;
 }

  gotoxy(x,(y-1)*3+1);
  _cur_x=wherex(); _cur_y=wherey();

  return 0;
}




/*- User SUB--Start -*/
int moola_s_thaana(int   x_int, int   y_int)
{

  gotoxy(x_int, y_int);

  _cur_x=wherex(); _cur_y=wherey();

  return 0;
}




/*- User SUB--Start -*/
int ma_s_thaana(int   x_int, int   y_int)
{

 return moola_s_thaana(x_int, y_int);

}


/*- User SUB--Start -*/
int likhoa(char  *likhanae_S)
{

 /* print // likhoa */

  int x;

  dvn=acii2cisr(likhanae_S,strlen(likhanae_S));

 /* C printf("\n\n%d ", dvn.curpos); */

  cisr_printf(_cur_x,_cur_y,dvn);

  _cur_x+=dvn.curpos+1;

  gotoxy(_cur_x,_cur_y);

  _cur_x=wherex(); _cur_y=wherey();
  return 0;
}




/*- User SUB--Start -*/
int poochhoa(char  *q_S, char  *a_S)
{
  float i;
  char b_S[LMAX], c_S[LMAX];


 /* set x,y */

  int x,y;

  x=wherex(); y=wherey();

 /* first ask the question */

 likhoa(q_S);

 /* input a$ */

 i = 1;

 strcpy(b_S,"");

 strcpy(c_S,"");

 while(i)
 {

  strcpy(b_S,inkeyread());

  if(strcmp(b_S,"ret")==0) {i=0;}

  else if(strcmp(b_S,"bksp")==0) {a_S[strlen(a_S)-1]=0;}

  else {strcat(a_S,b_S);}

  strcpy(c_S,q_S);

  strcat(c_S,a_S);

  strcat(c_S," ");

  gotoxy(x,y);
  _cur_x=wherex(); _cur_y=wherey();

  likhoa(c_S);

 }
  return 0;
}


/*- User SUB--Start -*/
int ra_mga(int f, int b)
{

  textbackground(b);

  textcolor(f);
  return 0;
}




/*- User SUB--Start -*/
int ranga(int f, int b)
{

 return ra_mga(f, b);

}




/*- User SUB--Start -*/
int ra_ngga(int f, int b)
{

 return ra_mga(f, b);

}




/*- User SUB--Start -*/
int wila_mba()
{

 /* pause */

  inkeyread();
  return 0;

}






/*- User SUB--Start -*/
int ba_daloa(float *a, float *b)
{
  float t;


 t = *a;

 *a = *b;

 *b = t;
  return 0;
}




/*- User SUB--Start -*/
int par_daa(int   m_int)
{
  _par_daa(m_int);
  return 0;
}




/*- User SUB--Start -*/
int raekhaa(int   a_int, int   b_int, int   c_int, int   d_int, int   e_int, int   f_int)
{

  _raekhaa(a_int,b_int,c_int,d_int,e_int,f_int);
  return 0;
}



/*- User SUB--Start -*/
int bharoa(int   x_int, int   y_int, int   colour_int)
{

  _bharoa(x_int,y_int,colour_int);
	 return 0;
}




/*- User SUBs--End -*/

/* Translates of used QB's intrinsic functions: */

extern char *MID_S(char *a_S, int start, int length)
{

 if (++j__S == 16) j__S=0;
 if(length < 0) {
  printf("Error: in MID_S: length < 0\n");
  exit(0); }
 if(start  < 0) {
  printf("Error: in MID_S: start < 1\n");
  exit(0); }
 if(start > strlen(a_S))
 { w__S[j__S][0]='\0'; }
 else
 { strncpy(w__S[j__S], &a_S[start-1], length);
	w__S[j__S][length]='\0'; }

 return w__S[j__S];
}


extern int VAL(char *a_S)
{
 if (++i__d == 16) i__d = 0;
 w__d[i__d] = atoi(a_S);
 return w__d[i__d];
}

extern int LEN(char *a_S)
{
	return strlen(a_S);
}


extern long Int(double x)
{
 return floor(x);
}


extern char *COMMAND_S(int n_arg_int, char *argv_S[])
{
 int i;

 if (++j__S == 16) j__S=0;
 for(i = 1; i <= n_arg_int; i++)
 {
  strcat(w__S[j__S],argv_S[i]);
  strcat(w__S[j__S]," ");
 }
 w__S[j__S][strlen(w__S[j__S])-1]='\0';
 return w__S[j__S];
}

extern char *STR_S(double d)
{

 if (++j__S == 16) j__S=0;
 sprintf(w__S[j__S],"% G",d);
 return w__S[j__S];
}


extern char *DATE_S(int i)
{
 static struct tm *tp;
 time_t elapse_time;

 if (++j__S == 16) j__S=0;
 time(&elapse_time);
 tp=localtime(&elapse_time);
 switch (i) {
  case 1:  strftime(w__S[j__S],LMAX,"%d.%m.%Y",tp);
  break;
  case 2:  strftime(w__S[j__S],LMAX,"%d/%m/%Y",tp);
  break;
  case 3:  strftime(w__S[j__S],LMAX,"%d-%b-%Y",tp);
  break;
  case 4:  strcpy(w__S[j__S],asctime(tp));
			  w__S[j__S][strlen(w__S[j__S])-1]='\0';
  break;
  default: strftime(w__S[j__S],LMAX,"%m-%d-%Y",tp);
  break;
 }
 return w__S[j__S];
}

extern char *TIME_S(int i)
{
 static struct tm *tp;
 time_t elapse_time;

 if (++j__S == 16) j__S=0;
 time(&elapse_time);
 tp=localtime(&elapse_time);
 strftime(w__S[j__S],LMAX,"%H:%M:%S",tp);
 return w__S[j__S];
}

