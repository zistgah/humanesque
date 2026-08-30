#!/usr/bin/gawk -f

#Copyright (C) 2006 Abhishek Choudhary
#This file is part of the Hindawi Indic Programming System.
#
#The Hindawi Indic Programming System is free software; 
#you can redistribute it and/or modify it under the terms of the 
#GNU General Public License as published by the 
#Free Software Foundation; either version 2 of the License, or 
#(at your option) any later version.
#
#The Hindawi Indic Programming System is distributed in the hope 
#that it will be useful, but WITHOUT ANY WARRANTY; without 
#even the implied warranty of MERCHANTABILITY or FITNESS FOR 
#A PARTICULAR PURPOSE. See the GNU General Public License for 
#more details.
#
#You should have received a copy of the GNU General Public
#License along with this file; see the file COPYING. If
#not, write to the Free Software Foundation,
#51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
#
#Modifi(echo \"<shailee " cc "\"; cations: (Please maintain in reverse chronological order)
#
#  dd-mmm-yyyy, Nature of change,
#                 Changed by <alias>,
#                 email@server.tld
#
#  31-Jul-2006, Created script, Ver. 0.2.0,
#                 Abhishek Choudhary <hi_pedler>,
#                 choudhary@indicybers.net

#Script for Hindawi Indic Programming System Ver. 0.2.0 - hincc backend

BEGIN	{lc=0; cc="???>"}
/.*/	{
		if ($1=="<shailee")
		{
			if (lc > 0)
				print "शैली का उल्लेख पहली पंक्ति में करें - Speciy Shali to enable Hindawi to Standard transpilation";
			else
				cc=$2;
		}
		else
		{
			print $0 > "tempfil012345.temphin";
			lc = lc + 1;
		}
	}
END	{
		if (lc > 0)
		{
			if (cc=="praa_tha>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | tr 'A-Z' 'a-z' | b2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="praa_thamika>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | tr 'A-Z' 'a-z' | b2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="guru>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | c2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="guroo>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | c2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="shraee_nnee>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | cpp2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="shraee_nneeba_d_dha>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | cpp2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="shab_da>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | l2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
                        else if (cc=="soochee>")
                                system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | py2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="wyaaka>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | yacc2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="ya_m_tra>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | y2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="yaa_m_trika>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | y2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
			else if (cc=="roaboata>")
				system("(echo Not supported as yet. Raise ECR if needed; (echo \"<shailee " cc "\"; cat tempfil012345.temphin  > hin.uhin");
			else if (cc=="k_ri_trima>")
				system("(echo \"<shailee " cc "\"; cat tempfil012345.temphin | j2h | sed 's/_/__/g') | rmn2acii | acii2uni | iconv -futf16 -tutf8 > hin.uhin");
		}
		else
			print "शैली का उल्लेख पहली पंक्ति में करें - Speciy Shali to enable Hindawi to Standard transpilation"
	}
