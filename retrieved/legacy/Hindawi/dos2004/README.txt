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

=============
A Guided Tour
=============

   We understand that the amount of documentation provided with Hindawi falls
short of what is required for the introduction of a new software as complex
in nature as Hindawi. However, we take you on this guided tour of Hindawi
so that you may at least be introduced to some of the features of this suite
of programming languages and systems tools for Indian languages. For the
beginners let us mention that Hindawi offers the equivalents of assembly, Logo,
BASIC, C, C++, Java, lex and yacc for now, and many more languages are to
follow soon. Hindawi supports UNICODE. As of now Hindawi supports
PCL compatible printers.

============
Installation
============

(Note: If you are using the version of Hindawi@DOS packaged for DOSBox for
Microsoft Windows[tm] please simply run setup.exe for installation.
Hindawi@Linux setup instructions are completely different and available
with the Hindawi@Linux distribution. You are, however, encouraged to
try out Hindawi@DOS using DOSBox under Linux and other OS. An online version
of Hindawi is also available if you do not want to install anything - 
visit http://hindawi.in/online/)

   Hindawi installation is very simple indeed, provided you have a standard
PC or compatible with a respectable amount of RAM and hard-drive space. You
MUST follow these steps EXACTLY unless of course you know better. (In that
case do drop in a letter or mail with a few suggestions!)

i) Get to a TEXT-MODE DOS-PROMPT

   -How to do this depends on your OS

   -If you are using plain DOS (I feel nostalgic), you ARE in TEXT-MODE!

   -Windows users (Win9x(TM), Win2K(TM), WinXP(TM), etc.) go to command
    prompt

   -DOSBox / DOSEmu: Install as under plain DOS

ii) Now from the directory where you have place the Hindawi installation files
   type SETUP.(You must at least have setup.exe and hindawi3.zip)

   -Press any key on the opening screen to move on to the next screen

   -Here you have to enter the name of the directory where you wish to install
   the files for Hindawi. Simply pressing Enter will install in the default
   location; i.e. C:\hindawi\

   -Next Enter the location for DJGPPv2. If you already have DJGPPv2 you may
   enter NO for the location which will prevent the installation of DJGPPv2
   (However, note that Hindawi requires a GNU-GCC backend for supporting
   Hindi versions of C, C++, lex and yacc. You may use some other distribution
   of GCC such as MinGW, CygWin etc. but then you'll also need to download and
   install Allegro graphics library.)

   -You need a Java(TM) compiler if you plan to compile Shaili Kritrim 
    programs. 

   -If everything has gone right, you are ready to experience the revolution
   in mother tongue computing

**NOTE: If setup.exe fails then manually unzip the hindawi and djgpp files
to a directory of your choice, and set up these THREE environment variables:

HINHOME=directory of Hindawi
HOME=directory of DJGPP
DJGPP=%HOME%\DJGPP.ENV

=================
Launching Hindawi
=================

i) You may launch Hindawi by simply going into the directory of installation
and typing "hindawi". This will set the above environment variables for you
and launch Hindawi-Aadesh - the mother tongue command shell with online help
(Your system policy may prevent the batch file from setting  the environment
variables. In that case you have to set it by right-clicking 'My Computer',
choose 'Properties', click on 'Advanced' and then click on 'Environment
Variables'; or better consult your computer Guru or write to us at
info@hindawi.in)

ii) Now launch Lekhak. (You may give the command in "English" or mother tongue
(only Hindi is supported now. though Bangla, Gurati and Assomiya fonts are
ready. Besides many languages use Devnagri font, so a trivial word for word
translation will port Hindawi to these languages.)

iii) Lekhak starts with a welcome message, which is a part of its online help
system, accessible anytime by pressing F1. All mother tongue typing in Hindawi is
based on the Inscript keyboard layout. To open a menu, press Alt+letter. Some
key bindings of Lekhak are as follows:

   F1:  Help
   F2:  Save
   F3:  Load
   F4:  Search
   F5:  Compile and Run
   F9:  Compile only
   F10: Menu

   **Other bindings are similar to other editors, such as Ctrl-Del, Ctrl-Ins,
   Shift-Ins, Ctrl-Home, Ctrl-End etc. Try them out for yourself. We have
   provided as many bindings as we could, given the time crunch. (We are
   launching a revolution after all!!). Just one point in hand, you can only
   cut-paste whole lines or blocks of lines, not words and characters. 

Note: Under JPC port of Hindawi, the IDE Lekhak is replaced by a scaled down 
version Laghu.

==============
Demonstrations
==============

Note: Some of the description applies only to Lekhak. For Laghu usage check
online help and videos.

We wanted to include 'thousands' of demos with Hindawi, but we also need to
feed ourselves! The few demos we have provided here are available in the
'samples' directory.

   -Press F3 to bring up the load_file dialog box.

   -Pressing Tab changes between file-name and file-list.

   -To change a drive, enter the new drive letter follower by a : (colon) and
   a \ (backslash)

   -To change directory enter the directory name followed by a \ (backslash)

   -Load any demo file and press F5 to compile and execute it
   (for errors and questions visit http://www.hindawi.in)

   -Most Hindawi langauges are compatible with their english counterparts
   and we have also provided translators to generate Hindawi source from
   C, C++, Java, assembly, lex and yacc!!

   -For executing your programs from within Lekhak the first line should be
   a Shaili specification. This is not necessary outside Lekhak, unless you
   use Hind or Hindrun.

   -With Hind or Hindrun specify full file names, with other compilers
   specify the name without extension, which in this case must be .HIN

   -Bugs list of Hindawi will be available on SourceForge
   http://sf.net/projects/hindawi

   -Many of Hindawi components have themselves been written in Hindawi, so
   they are a good demonstration. (Bootstrapped!)

**Note: We are looking for publishers to publish Team Hindawi's
books on Hindawi. If you are a publisher and interested, please call
Team Hindawi on mobile NOW... +91-9860700184

===========
Executables
===========
Given below is a description of the Hindawi (main) executables. Please ensure
that the following environment variables are set before executing these files.

HINHOME=directory of Hindawi
HOME=directory of DJGPP
DJGPP=%HOME%\DJGPP.ENV

AADESH.EXE      : mother tongue command shell
acii2cf.exe     : ISCII to Compilation Format filter
acii2csr.exe    : ISCII to Shringar Format filter
acii2hin.exe    : ISCII to Romenagri(Saral) Format filter
acii2pcf.exe    : ISCII to Pascal Compilation Format filter
acii2rmn.exe    : ISCII to Romenagri(Purna) Format filter
c2h.exe         : C to Hindawi converter
CALC.EXE        : Hindawi Calculator (Vyaakaran demo)
cpp2h.exe       : C++ to Hindawi converter
CSR2HP.EXE      : HP printer driver for Shringar
FROMUNI.EXE     : UNICODE (little endian) to ISCII converter (control-less)
h2y.exe         : Hindawi to x86-Assembly converter
h2b.exe         : Hindawi to BASIC converter
h2c.exe         : Hindawi to C converter
h2cpp.exe       : Hindawi to C++ converter
h2j.exe         : Hindawi to Java(TM) converter
h2l.exe         : Hindawi to lex converter
h2yacc.exe      : Hindawi to yacc converter
hinhelp.exe     : Online help for Aadesh
j2h.exe         : Java to Hindawi converter
l2h.exe         : lex to Hindawi converter
rmn2acii.exe    : Romenagri to ISCII converter
ROBOT.EXE       : Shaili Robot or Hindi Logo
TOUNI.EXE       : ISCII to UNICODE (little endian) converter
y2h.exe         : Assembly to Hindawi converter
yacc2h.exe      : Yacc to Hindawi converter
CHAAPOA.BAT     : Printer helper
fontdo.bat      : Font helper
guru.bat        : Shaili Guru or Hindi C
HIND.BAT        : Common mode compilation driver, similar to gcc
kritrim.bat     : Shaili Kritrim or Hindi Java
lekhak.bat      : Hindawi multifunction IDE with UNICODE and printing support
prath.bat       : Shaili Prathmik or Hindi BASIC
shabda.bat      : Shaili Shabda or Hindi lex
shraeni.bat     : Shaili Shraeni or Hindi C++
vyaak.bat       : Shaili Vyaak or Hindi Yacc
yantra.bat      : Shaili Yantra or Hindi x86-assembly

** There are many more executables. Please download the most recent
documentation from http://www.hindawi.in

=======
Finally
=======

A Free Open Source Software (FOSS) like Hindawi can only prosper with
community support. Please help us in bridging the digital divide.


Cheers,
Team Hindawi

  
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

