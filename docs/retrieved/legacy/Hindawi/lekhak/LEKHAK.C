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
                                                                                                                       

#include <conio.h>                                                                                                             
#include <stdio.h>                                                                                                             
#include <stdlib.h>                                                                                                            
#include <string.h>                                                                                                            
#include <dos.h>                                                                                                               
#include <dir.h>                                                                                                               
#include <dirent.h>                                                                                                            
#include <unistd.h>

#include "..\..\include\apcisr.h"                                                                                              
#include "..\..\include\aci2cisr.h"                                                                                            
#include "..\..\include\acii.h"                                                                                                
#include "..\..\include\acii2hin.h"                                                                                            
#include "..\..\include\acii2rmn.h"                                                                                            
#include "..\..\include\aciihin.h"                                                                                             
#include "..\..\include\btree.h"                                                                                               
#include "..\..\include\cisr2asc.h"                                                                                            
#include "..\..\include\comdialg.h"                                                                                            
#include "..\..\include\cursor.h"                                                                                              
#include "..\..\include\disp.h"                                                                                                
#include "..\..\include\filefunc.h"                                                                                            
#include "..\..\include\genutils.h"                                                                                            
#include "..\..\include\globals.h"                                                                                             
#include "..\..\include\helpfunc.h"                                                                                            
#include "..\..\include\init.h"                                                                                                
#include "..\..\include\inscript.h"                                                                                            
#include "..\..\include\lexer.h"                                                                                               
#include "..\..\include\magic.h"                                                                                               
#include "..\..\include\menu.h"                                                                                                
#include "..\..\include\progfunc.h"                                                                                            
#include "..\..\include\rmn2acii.h"                                                                                            
#include "..\..\include\keybrd.h"                                                                                              
#include "..\..\include\globals.h"                                                                                             
#include "..\..\include\textutil.h"                                                                                            
#include "..\..\include\stack.h"                                                                                               
                                                                                                                               
                                                                                                                               
/*some globals*/                                                                                                               
textlist *head=NULL, *tail=NULL, *cent=NULL;                                                                                   
textlist *clip_brd, *after_cut; /*so that's the limit*/                                                                        
char ikeyret2[15],flnm2[15],search_str2[128];   /* quite a lot :-( */                                                          
char *ikeyret=ikeyret2,*flnm=flnm2,*search_str=search_str2;   /* quite a lot :-( */                                            
char HOME2[255],*HOME=HOME2;                                                                                                   
char hist[32][128], histn=0, histtmp=0;
int tot_lines=1, top_dis=1,edlin=0,edpos=1,revamp=0,centurion=0;                                                               
int search_res=0,search_pos=0, search_start=1;                                                                                 
int sel_start=0, sel_end=0, clip_stat=0, clip_size=0;                                                                          
int txt_chng=0;
cisr *dvn_base2[14];
cisr **dvn_base=dvn_base2;                                                                                                     
                                                                                                                               
/*for the conversion functions*/                                                                                               
char msg2[10240], *msg=msg2;                                                                                                   
                                                                                                                               
                                                                                                                               
int main(int argc, char *argv[])
{                                                                                                                              
   cisr dvn, tmp2, dvn_ed[14], dvtmp; /*the life of dvn_ed should be akin to that of dvn_base*/                                
   char tmp[15], tr[511][128];                                                                                                 
   int insert=1,pralaya=0,pos=1,i=0,j=0,k=0,l=0,m=0,ref=0, retake=0;                                                           
   textlist *line, *temp;                                                                                                      
   char topic[25], hlp_fl[256];                                                                                                
                                                                                                                               
   printf("\nHindawi Lekhak 0.1.1a - 1st May 2004\n");                                                                         
   printf("Copyright (C) 2004,2005 Abhishek Choudhary\n");                                                                          
   printf("GNU GPL V2 license. No warranty whatsoever.\n");                                                                          
   strcpy(HOME,getenv("HINHOME"));                                                                                             
   tmp[0]=0;                                                                                                                   
   /*initialize*/                                                                                                              
   for(i=0;i<128;i++){search_str[i]=0;}                                                                                        
   for(i=0;i<13;i++){flnm[i]=0;}                                                                                               
   init();                                                                                                                     
   cursor(2,6);                                                                                                                
   top_dis=1;                                                                                                                  
   tot_lines=1;                                                                                                                
   revamp=0;                                                                                                                   
   for(histtmp=0;histtmp<32;histtmp++)
   {
      hist[histtmp][0]=NULL;
   }
                                                                                                                               
   clip_brd=(textlist *)malloc(sizeof(textlist));                                                                              
   clip_brd->str=(char *)malloc(128*sizeof(char));                                                                             
   for(i=0;i<127;i++){clip_brd->str[i]=32;} /*just in case*/                                                                   
   clip_brd->str[127]=0;                                                                                                       
   clip_brd->no=0;/*the head of the clip_brd*/                                                                                 
   clip_brd->prev=clip_brd->next=NULL;                                                                                         
                                                                                                                               
                                                                                                                               
   for(i=0;i<14;i++)                                                                                                           
   {                                                                                                                           
      dvn_base[i]=dvn_ed+i;                                                                                                    
      for(j=0;j<1024;j++)                                                                                                      
      {                                                                                                                        
         dvn_ed[i].urdha [j]=0;                                                                                                
         dvn_ed[i].madhya[j]=0;                                                                                                
         dvn_ed[i].nimna [j]=0;                                                                                                
      }                                                                                                                        
   }                                                                                                                           
                                                                                                                               
                                                                                                                               
   /*make the textlist*/                                                                                                       
   cent=(textlist *)malloc(sizeof(textlist ));                                                                                 
   cent->str=(char *)malloc(128*sizeof(char));                                                                                 
   for(i=0;i<127;i++){cent->str[i]=32;} /*just in case*/                                                                       
   cent->str[127]=0;                                                                                                           
   cent->no=0;/*centurion becomes the head of the pack but OS cleans it*/                                                      
   cent->prev=NULL;                                                                                                            
                                                                                                                               
   cent->next=(textlist *)malloc(sizeof(textlist ));                                                                           
   line=cent->next;                                                                                                            
   line->prev=cent;                                                                                                            
   line->str=(char *)malloc(128*sizeof(char));                                                                                 
   for(i=0;i<127;i++){line->str[i]=32;}                                                                                        
   line->str[127]=0;                                                                                                           
   line->no=line->prev->no+1;                                                                                                  
   line->next=NULL;                                                                                                            
   tot_lines=1;                                                                                                                
   head=cent; tail=line;                                                                                                       
                                                                                                                               

   if(argc>1)
   {
      strcpy(flnm,argv[1]);
      file_load_start();
   }
   else
   {
      strcpy(topic,"welcome");                                                                                                       
      strcpy(hlp_fl,HOME);                                                                                                        
      i=strlen(hlp_fl)-1;                                                                                                         
      while(i>=0 && hlp_fl[i]==32){hlp_fl[i]=0;i--;}                                                                              
      strcat(hlp_fl,"\\bin\\");                                                                                                   
      strcat(hlp_fl,"sahayata.hlp");                                                                                              
      file_list_box(hlp_fl,topic);                                                                                                
   }

   /*program loop*/                                                                                                            
   while(!pralaya) /*ad inifinitum*/                                                                                           
   {                                                                                                                           
      revamp=0;                                                                                                                
      ref=0;                                                                                                                   
      retake=0;                                                                                                                
      search_start=line->no;                                                                                                   
      _setcursortype(_NOCURSOR);                                                                                               
      if(strcmp(tmp,"F10")==0)                                                                                                 
      {                                                                                                                        
         menu(0);                                                                                                              
      }                                                                                                                        
      else if(strcmp(tmp,"F1")==0)                                                                                             
      {                                                                                                                        
         help_word();                                                                                                          
      }                                                                                                                        
      else if(strcmp(tmp,"Alt-F1")==0)
      {
         help_hist();
      }
      else if(strcmp(tmp,"F2")==0)                                                                                             
      {                                                                                                                        
         file_save();                                                                                                          
      }                                                                                                                        
      else if(strcmp(tmp,"F3")==0)                                                                                             
      {                                                                                                                        
         file_load();                                                                                                          
      }                                                                                                                        
      else if(strcmp(tmp,"F4")==0)                                                                                             
      {                                                                                                                        
         if(strlen(search_str))                                                                                                
         {                                                                                                                     
            program_search(search_start+1,1);                                                                                  
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            program_search(search_start+1,0);                                                                                  
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"F5")==0)                                                                                             
      {                                                                                                                        
         program_run();                                                                                                        
      }                                                                                                                        
      else if(strcmp(tmp,"F6")==0)                                                                                             
      {                                                                                                                        
         program_run_only();                                                                                                        
      }                                                                                                                        
      else if(strcmp(tmp,"F7")==0)                                                                                             
      {                                                                                                                        
         program_deploy();                                                                                                        
      }                                                                                                                        
      else if(strcmp(tmp,"F9")==0)                                                                                             
      {                                                                                                                        
         program_compile();                                                                                                    
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-ins")==0)                                                                                       
      {                                                                                                                        
         program_copy();                                                                                                       
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-del")==0)                                                                                       
      {                                                                                                                        
         txt_chng=1;
         program_clear();
      }                                                                                                                        
      else if(strcmp(tmp,"Shift-ins")==0)                                                                                      
      {                                                                                                                        
         txt_chng=1;
         program_paste(line->no);                                                                                              
      }                                                                                                                        
      else if(strcmp(tmp,"Shift-del")==0)                                                                                      
      {                                                                                                                        
         txt_chng=1;
         program_cut();                                                                                                        
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-Y")==0)                                                                                         
      {                                                                                                                        
         txt_chng=1;
         for(i=0;i<127;i++){line->str[i]=32;}                                                                                  
         strcpy(tmp,"del");                                                                                                    
         edpos=1;                                                                                                              
         continue;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-end")==0)                                                                                       
      {                                                                                                                        
         line=cent->next;                                                                                                      
         while(line->no<tot_lines && line->next){line=line->next;}                                                             
         strcpy(tmp,"pgdn");                                                                                                   
         continue;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-home")==0)                                                                                      
      {                                                                                                                        
         line=cent->next;                                                                                                      
         strcpy(tmp,"pgup");                                                                                                   
         continue;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"Shift-up")==0)                                                                                       
      {                                                                                                                        
         if((sel_start-line->no)==1 || (sel_start-line->no)==0)                                                                
         {                                                                                                                     
            sel_start--;                                                                                                       
            if(sel_start<1){sel_start=1;}                                                                                      
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            sel_start=0;                                                                                                       
         }                                                                                                                     
         if(!sel_start)                                                                                                        
         {                                                                                                                     
            sel_start=sel_end=line->no;                                                                                        
         }                                                                                                                     
         strcpy(tmp,"up");                                                                                                     
         continue;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"Shift-dn")==0)                                                                                       
      {                                                                                                                        
         if((line->no-sel_end)==1 || (line->no-sel_end)==0)                                                                    
         {                                                                                                                     
            sel_end++;                                                                                                         
            if(sel_end>tot_lines){sel_end=tot_lines;}                                                                          
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            sel_start=0;                                                                                                       
         }                                                                                                                     
         if(!sel_start)                                                                                                        
         {                                                                                                                     
            sel_start=sel_end=line->no;                                                                                        
         }                                                                                                                     
         strcpy(tmp,"dn");                                                                                                     
         continue;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"esc")==0)                                                                                            
      {                                                                                                                        
         sel_start=0; sel_end=0;                                                                                               
      }                                                                                                                        
      else if(strcmp(tmp,"Alt-F3")==0)                                                                                         
      {                                                                                                                        
         file_new();                                                                                                           
      }                                                                                                                        
      else if(strcmp(tmp,"Alt-K")==0)                                                                                          
      {                                                                                                                        
         menu(1);                                                                                                              
      }                                                                                                                        
      else if(strcmp(tmp,"Alt-C")==0)                                                                                          
      {                                                                                                                        
         menu(2);                                                                                                              
      }                                                                                                                        
      else if(strcmp(tmp,"Alt-M")==0)                                                                                          
      {                                                                                                                        
         menu(3);                                                                                                              
      }                                                                                                                        
      else if(strcmp(tmp,"Alt-X")==0)                                                                                          
      {                                                                                                                        
         file_exit();                                                                                                          
      }                                                                                                                        
      else if(strcmp(tmp,"ins")==0)                                                                                            
      {                                                                                                                        
         insert=insert ^ 1; /* ^ is xor not power as in BASIC*/                                                                
      }                                                                                                                        
      else if(strcmp(tmp,"tab")==0)                                                                                            
      {                                                                                                                        
         txt_chng=1;
         strcpy(tmp,"   ");                                                                                                    
         continue;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"dn")==0)                                                                                             
      {                                                                                                                        
         if(line->no<tot_lines)                                                                                                
         {                                                                                                                     
            line=next_line(line);                                                                                              
            retake=1;                                                                                                          
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"up")==0)                                                                                             
      {                                                                                                                        
         if(line->no>1)                                                                                                        
         {                                                                                                                     
            line=prev_line(line);                                                                                              
            retake=1;                                                                                                          
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-lf")==0)                                                                                        
      {                                                                                                                        
         edpos--;                                                                                                              
         if(edpos<1){edpos=1;}                                                                                                 
         if(line->str[edpos-1]!=32)                                                                                            
         {                                                                                                                     
            while(line->str[edpos-1]!=32)                                                                                      
            {                                                                                                                  
               edpos--;                                                                                                        
               if(edpos<1){edpos=1; break;}                                                                                    
            }                                                                                                                  
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            while(line->str[edpos-1]==32)                                                                                      
            {                                                                                                                  
               edpos--;                                                                                                        
               if(edpos<1){edpos=1; break;}                                                                                    
            }                                                                                                                  
            while(line->str[edpos-1]!=32)                                                                                      
            {                                                                                                                  
               edpos--;                                                                                                        
               if(edpos<1){edpos=1; break;}                                                                                    
            }                                                                                                                  
         }                                                                                                                     
         if(line->str[edpos-1]==32) {edpos++;}                                                                                 
         retake=1;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"Ctrl-rt")==0)                                                                                        
      {                                                                                                                        
         /*edpos++;                                                                                                            
         if(edpos>126){edpos=126;}*/                                                                                           
         while(line->str[edpos-1]!=32)                                                                                         
         {                                                                                                                     
            edpos++;                                                                                                           
            if(edpos>126){edpos=126; break;}                                                                                   
         }                                                                                                                     
         while(line->str[edpos-1]==32)                                                                                         
         {                                                                                                                     
            edpos++;                                                                                                           
            if(edpos>126){edpos=126; break;}                                                                                   
         }                                                                                                                     
         /*edpos+=2;*/                                                                                                         
         if(edpos>nlen(line->str)){edpos=nlen(line->str);}                                                                     
         retake=1;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"lf")==0)                                                                                             
      {                                                                                                                        
         edpos--;                                                                                                              
         if(edpos<1){edpos=1;}                                                                                                 
         retake=1;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"rt")==0)                                                                                             
      {                                                                                                                        
         edpos++;                                                                                                              
         if(edpos>126){edpos=126;}                                                                                             
         retake=1;                                                                                                             
      }                                                                                                                        
      else if(strcmp(tmp,"end")==0)                                                                                            
      {                                                                                                                        
         edpos=nlen(line->str)+1;                                                                                              
         if(edpos>126){edpos=126;}                                                                                             
         retake=1;                                                                                                             
         /*ref=1;*/                                                                                                            
      }                                                                                                                        
      else if(strcmp(tmp,"home")==0)                                                                                           
      {                                                                                                                        
         edpos=1;                                                                                                              
         retake=1;                                                                                                             
         /*ref=1;*/                                                                                                            
      }                                                                                                                        
      else if(strcmp(tmp,"pgup")==0)                                                                                           
      {                                                                                                                        
         for(i=0;i<12;i++)                                                                                                      
         {                                                                                                                     
            if(line->no>1)                                                                                                     
            {                                                                                                                  
               line=prev_line(line);                                                                                           
            }                                                                                                                  
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"pgdn")==0)                                                                                           
      {                                                                                                                        
         for(i=0;i<12;i++)                                                                                                      
         {                                                                                                                     
            if(line->no<tot_lines)                                                                                             
            {                                                                                                                  
               line=next_line(line);                                                                                           
            }                                                                                                                  
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"del")==0)                                                                                            
      {                                                                                                                        
         txt_chng=1;
/**/     if(edpos>=nlen(line->str) &&                                                                                          
           (line->no<tot_lines-1) &&                                                                                           
           (edpos>1))                                                                                                          
         {                                                                                                                     
            /*move up as much as possible*/                                                                                    
            /*c3n_printf(3,3,"moveup");*/                                                                                      
            j=edpos-1;                                                                                                         
            k=0;                                                                                                               
            while(j<126)                                                                                                       
            {                                                                                                                  
               line->str[j]=line->next->str[k];                                                                                
               j++;                                                                                                            
               k++;                                                                                                            
            }                                                                                                                  
            for(j=0;j<k;j++)                                                                                                   
            {                                                                                                                  
               for(l=0;l<126;l++)                                                                                              
               {                                                                                                               
                  line->next->str[l]=line->next->str[l+1];                                                                     
               }                                                                                                               
               line->next->str[126]=32;                                                                                        
            }                                                                                                                  
            if(nlen(line->next->str)<=1)                                                                                       
            {                                                                                                                  
               if(line->no<tot_lines-1)                                                                                        
               {                                                                                                               
                  temp=line;                                                                                                   
                  line=line->next;                                                                                             
                  temp->next=line->next;                                                                                       
                  if(line->next){ line->next->prev=temp; }                                                                     
                  free(line->str);                                                                                             
                  free(line);                                                                                                  
                  line=temp;                                                                                                   
                  tot_lines--;                                                                                                 
                  /*reset line nos*/                                                                                           
                  temp=cent->next;                                                                                             
                  while(temp)                                                                                                  
                  {                                                                                                            
                     temp->no=temp->prev->no+1;                                                                                
                     temp=temp->next;                                                                                          
                  }                                                                                                            
               }                                                                                                               
            }                                                                                                                  
            textbackground(BLUE);                                                                                              
            textcolor(LIGHTGRAY);                                                                                              
            edlin=disp_edit(line,pos,1);                                                                                       
         }                                                                                                                     
         else if(nlen(line->str)==0)                                                                                           
         {                                                                                                                     
            if(line->no>=tot_lines) /*greater???!!!*/                                                                          
            {                                                                                                                  
               tmp[0]=0;                                                                                                       
               continue;                                                                                                       
            }                                                                                                                  
            /*we have to remove a line here*/                                                                                  
            temp=line;/*sure!! this is how we always begin*/                                                                   
            tot_lines--;                                                                                                       
            while(temp->next)                                                                                                  
            {                                                                                                                  
               temp->next->no--;                                                                                               
               temp=temp->next;                                                                                                
            }                                                                                                                  
            /*temp on tail*/                                                                                                   
            temp=line->next;                                                                                                   
            temp->prev=line->prev;                                                                                             
            if(line->prev){line->prev->next=temp;}                                                                             
            free(line->str); /*very important*/                                                                                
            free(line);                                                                                                        
            line=temp; /*yes and not temp=line... Pleaseeeeeeeee*/                                                             
            edpos=1;                                                                                                           
            pos=1;                                                                                                             
            /*reset line nos*/                                                                                                 
            temp=cent->next;                                                                                                   
            while(temp)                                                                                                        
            {                                                                                                                  
               temp->no=temp->prev->no+1;                                                                                      
               temp=temp->next;                                                                                                
            }                                                                                                                  
            textbackground(BLUE);                                                                                              
            textcolor(LIGHTGRAY);                                                                                              
            edlin=disp_edit(line,pos,1);                                                                                       
            /*retake=1;*/                                                                                                      
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            for(j=edpos-1;j<126;j++)                                                                                           
            {                                                                                                                  
               line->str[j]=line->str[j+1];                                                                                    
            }                                                                                                                  
            line->str[126]=32;                                                                                                 
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"bksp")==0)                                                                                           
      {                                                                                                                        
         txt_chng=1;
         if(edpos==1 &&                                                                                                        
           (line->no>1))                                                                                                       
         {                                                                                                                     
            /*c3n_printf(3,3,"move-back-up");*/                                                                                
            j=nlen(line->prev->str);                                                                                           
            m=j+1;                                                                                                             
            if(m>126){m=126;}                                                                                                  
            /*copy up as much as possible*/                                                                                    
            for(k=0;(k+j)<126;k++)                                                                                             
            {                                                                                                                  
               line->prev->str[j+k]=line->str[k];                                                                              
            }                                                                                                                  
            /*clear up on line*/                                                                                               
            for(l=0;l<k;l++)                                                                                                   
            {                                                                                                                  
               for(j=edpos-1;j<126;j++)                                                                                        
               {                                                                                                               
                  line->str[j]=line->str[j+1];                                                                                 
               }                                                                                                               
               line->str[126]=32;                                                                                              
            }                                                                                                                  
            /*move up*/                                                                                                        
            line=line->prev;                                                                                                   
            edpos=m;/* that's we must be on the upper line*/                                                                   
            if(nlen(line->next->str)<=1)                                                                                       
            {                                                                                                                  
               if(line->no<tot_lines-1)                                                                                        
               {                                                                                                               
                  temp=line;                                                                                                   
                  line=line->next;                                                                                             
                  temp->next=line->next;                                                                                       
                  if(line->next){ line->next->prev=temp; }                                                                     
                  free(line->str);                                                                                             
                  free(line);                                                                                                  
                  line=temp;                                                                                                   
                  tot_lines--;                                                                                                 
                  /*reset line nos*/                                                                                           
                  temp=cent->next;                                                                                             
                  while(temp)                                                                                                  
                  {                                                                                                            
                     temp->no=temp->prev->no+1;                                                                                
                     temp=temp->next;                                                                                          
                  }                                                                                                            
               }                                                                                                               
            }                                                                                                                  
            textbackground(BLUE);                                                                                              
            textcolor(LIGHTGRAY);                                                                                              
            edlin=disp_edit(line,pos,1);                                                                                       
            retake=1;                                                                                                          
         }                                                                                                                     
         else if(nlen(line->str)==0)                                                                                           
         {                                                                                                                     
            if(line->no>=tot_lines) /*greater???!!!*/                                                                          
            {                                                                                                                  
               tmp[0]=0;                                                                                                       
               continue;                                                                                                       
            }                                                                                                                  
            /*we have to remove a line here*/                                                                                  
            temp=line;/*sure!! this is how we always begin*/                                                                   
            tot_lines--;                                                                                                       
            while(temp->next)                                                                                                  
            {                                                                                                                  
               temp->next->no--;                                                                                               
               temp=temp->next;                                                                                                
            }                                                                                                                  
            /*temp on tail*/                                                                                                   
            temp=line->next;                                                                                                   
            temp->prev=line->prev;                                                                                             
            if(line->prev){line->prev->next=temp;}                                                                             
            free(line->str); /*very important*/                                                                                
            free(line);                                                                                                        
            line=temp; /*yes and not temp=line... Pleaseeeeeeeee*/                                                             
            edpos=1;                                                                                                           
            pos=1;                                                                                                             
            /*reset line nos*/                                                                                                 
            temp=cent->next;                                                                                                   
            while(temp)                                                                                                        
            {                                                                                                                  
               temp->no=temp->prev->no+1;                                                                                      
               temp=temp->next;                                                                                                
            }                                                                                                                  
            textbackground(BLUE);                                                                                              
            textcolor(LIGHTGRAY);                                                                                              
            edlin=disp_edit(line,pos,1);                                                                                       
            /*retake=1;*/                                                                                                      
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            if(edpos>=2)                                                                                                       
            {                                                                                                                  
               edpos--;                                                                                                        
               for(j=edpos-2;j<126;j++)                                                                                        
               {                                                                                                               
                  line->str[j+1]=line->str[j+2];                                                                               
               }                                                                                                               
               line->str[126]=32;                                                                                              
            }                                                                                                                  
         }                                                                                                                     
      }                                                                                                                        
      else if(strcmp(tmp,"ret")==0)                                                                                            
      {                                                                                                                        
         txt_chng=1;
         /*line=new_line(line);*/                                                                                              
         tot_lines++;                                                                                                          
         temp=(textlist *)malloc(sizeof(textlist));                                                                            
         temp->str=(char *)malloc(128*sizeof(char));                                                                           
         i=0;                                                                                                                  
         for(;edpos<127;edpos++)                                                                                               
         {                                                                                                                     
            temp->str[i]=line->str[edpos-1];                                                                                   
            line->str[edpos-1]=32;                                                                                             
            i++;                                                                                                               
         }                                                                                                                     
         for(;i<127;i++){temp->str[i]=32;}                                                                                     
         temp->str[127]=0;                                                                                                     
                                                                                                                               
                                                                                                                               
         temp->prev=line;                                                                                                      
         temp->next=line->next;                                                                                                
         if(temp->next) {temp->next->prev=temp;}                                                                               
         temp->no=line->no+1;                                                                                                  
         line->next=temp;                                                                                                      
         line=temp;  /*move onto new line*/                                                                                    
         /*reset line nos*/                                                                                                    
         temp=cent->next;                                                                                                      
         while(temp)                                                                                                           
         {                                                                                                                     
            temp->no=temp->prev->no+1;                                                                                         
            temp=temp->next;                                                                                                   
         }                                                                                                                     
         /*while(temp->next)                                                                                                   
         {                                                                                                                     
            temp->next->no+=1;                                                                                                 
            temp=temp->next;                                                                                                   
         }*/                                                                                                                   
         edpos=1; /*first position obviously*/                                                                                 
         pos=1;                                                                                                                
         textbackground(BLUE);                                                                                                 
         textcolor(LIGHTGRAY);                                                                                                 
         edlin=disp_edit(line,1,1);/*refresh*/                                                                                 
                                                                                                                               
                                                                                                                               
      }                                                                                                                        
      else                                                                                                                     
      {                                                                                                                        
         if(insert==1)                                                                                                         
         {                                                                                                                     
            i=0;                                                                                                               
            while(tmp[i])                                                                                                      
            {                                                                                                                  
               txt_chng=1;
               for(j=126;j>=edpos;j--)                                                                                         
               { /*this shifts out for inserting else there would be overwrite*/                                                                                                              
                  line->str[j]=line->str[j-1];                                                                                 
               }                                                                                                               
               line->str[edpos-1]=tmp[i];                                                                                      
               i++; edpos++;                                                                                                   
               if(edpos>126){edpos=126;}                                                                                       
            }                                                                                                                  
         }                                                                                                                     
         else                                                                                                                  
         {                                                                                                                     
            i=0;                                                                                                               
            while(tmp[i])                                                                                                      
            {                                                                                                                  
               txt_chng=1;
               line->str[edpos-1]=tmp[i];                                                                                      
               i++;edpos++;                                                                                                    
               if(edpos>126){edpos=126;}                                                                                       
            }                                                                                                                  
         }                                                                                                                     
      }                                                                                                                        
      if(after_cut)                                                                                                            
      {                                                                                                                        
         if(top_dis>tot_lines){top_dis=tot_lines;}                                                                             
         line=after_cut;                                                                                                       
         after_cut=0;                                                                                                          
         edpos=1;                                                                                                              
         pos=1;                                                                                                                
         edlin=disp_edit(line,1,1);                                                                                            
      }                                                                                                                        
      if(centurion)                                                                                                            
      {                                                                                                                        
         retake=1;                                                                                                             
         centurion=0;                                                                                                          
         line=cent->next;                                                                                                      
         edlin=disp_edit(line,1,1);                                                                                            
         sel_start=sel_end=0;                                                                                                  
         revamp=1;                                                                                                             
      }                                                                                                                        
      if(revamp)                                                                                                               
      {                                                                                                                        
         tmp[0]=0;                                                                                                             
         line=cent->next;                                                                                                      
         edpos=1;                                                                                                              
         pos=1;                                                                                                                
         ref=1;                                                                                                                
         continue;                                                                                                             
      }                                                                                                                        
      if(search_res)                                                                                                           
      {                                                                                                                        
         tmp[0]=0;                                                                                                             
         line=cent->next;                                                                                                      
         for(i=0;i<search_res-1;i++)                                                                                           
         {                                                                                                                     
            if(line->no<tot_lines)                                                                                             
            {                                                                                                                  
               line=next_line(line);                                                                                           
            }                                                                                                                  
         }                                                                                                                     
         edpos=search_pos;                                                                                                     
         if(edpos<1){edpos=1;}                                                                                                 
         if(edpos>126){edpos=126;}                                                                                             
         search_res=0;                                                                                                         
         retake=1;                                                                                                             
      }                                                                                                                        
      textbackground(BLUE);                                                                                                    
      textcolor(LIGHTGRAY);                                                                                                    
      edlin=disp_edit(line,pos,0+ref);                                                                                         
      dvn_ed[edlin]=acii2cisr(line->str,edpos);                                                                                
      strcpy(tmp2.urdha,dvn_ed[edlin].urdha+pos-1);                                                                            
      strcpy(tmp2.madhya,dvn_ed[edlin].madhya+pos-1);                                                                          
      strcpy(tmp2.nimna,dvn_ed[edlin].nimna+pos-1);                                                                            
      tmp2.urdha [78]=0;                                                                                                       
      tmp2.madhya[78]=0;                                                                                                       
      tmp2.nimna [78]=0;                                                                                                       
      if((line->no>=sel_start)&&(line->no<=sel_end))                                                                           
      {                                                                                                                        
         textbackground(LIGHTGRAY);                                                                                            
         textcolor(BLACK);                                                                                                     
      }                                                                                                                        
      else                                                                                                                     
      {                                                                                                                        
         textbackground(BLUE);                                                                                                 
         textcolor(LIGHTGRAY);                                                                                                 
      }                                                                                                                        
      cisr_printf_clean(2,5+edlin*3,tmp2);                                                                                     
      pos=dvn_ed[edlin].curpos-76;                                                                                             
      if(pos<1){pos=1;}                                                                                                        
      pos_disp(line->no,edpos);                                                                                                
      /*gotoxy(40,40);cprintf("%d of %d",line->no,tot_lines);*/                                                                
      if(dvn_ed[edlin].curpos<1) {dvn_ed[edlin].curpos=1;}                                                                     
      if(insert==1)                                                                                                            
      {                                                                                                                        
         ins_cursor(dvn_ed[edlin].curpos+2-pos,6+edlin*3);                                                                     
      }                                                                                                                        
      else                                                                                                                     
      {                                                                                                                        
         cursor(dvn_ed[edlin].curpos+2-pos,6+edlin*3);                                                                         
      }                                                                                                                        
      if(!retake)                                                                                                              
      {                                                                                                                        
         strcpy(tmp,inkeyread());
      }                                                                                                                        
      else                                                                                                                     
      {                                                                                                                        
         tmp[0]=0;                                                                                                             
      }                                                                                                                        
   }                                                                                                                           
   return 1;                                                                                                                   
}                                                                                                                              
                                                                                                                               
                                                                                                                               
/*int main()                                                                                                                   
{                                                                                                                              
   init();                                                                                                                     
   getfilename();                                                                                                              
   printf("\n\n%s",flnm);                                                                                                      
   cisr_printf(2,5,acii2cisr(flnm,1));                                                                                         
   printf("\n\n",flnm);                                                                                                        
   main1();                                                                                                                    
   now make file list box                                                                                                      
   file_list_box("sahayata.hlp","top3");                                                                                       
   file_list_box("sahayata.hlp","top7");                                                                                       
   return 1;                                                                                                                   
}*/                                                                                                                            
