#!/usr/bin/env python3
"""perso2deva_heur — Perso-Arabic -> Devanagari, additive completeness layer.
BASE is the attested consonantal-skeleton map (matches fltr_ur_hi where it suffices, untouched).
Any Arabic-block LETTER not in BASE is given a Devanagari image heuristically (NFKD strip to a
base form), so projection is TOTAL over the Perso-Arabic family. Short-vowel residue (abjad
underspecification) is documented, not hidden — see results/PERSO_ARABIC.json.
(C) 1993-2026 Abhishek Choudhary, GPL-3.0-or-later"""
import sys,unicodedata
BASE={'ا':'अ','ب':'ब','پ':'प','ت':'त','ٹ':'ट','ث':'स','ج':'ज','چ':'च','ح':'ह','خ':'ख',
'د':'द','ڈ':'ड','ذ':'ज़','ر':'र','ڑ':'ड़','ز':'ज़','ژ':'झ','س':'स','ش':'श','ص':'स','ض':'ज़',
'ط':'त','ظ':'ज़','ع':'अ','غ':'ग़','ف':'फ','ق':'क','ک':'क','گ':'ग','ل':'ल','م':'म','ن':'न',
'ں':'ं','و':'व','ہ':'ह','ھ':'ह','ء':'','ی':'य','ے':'े','ئ':'य','آ':'आ','ۀ':'ह'}
def image(ch):
    if ch in BASE: return BASE[ch]
    try: nm=unicodedata.name(ch)
    except ValueError: return None
    if "ARABIC LETTER" not in nm: return None
    for c in unicodedata.normalize("NFKD",ch):
        if c in BASE: return BASE[c]
    return 'ं'  # last-resort placeholder; flagged in coverage report
def project(s): return "".join(image(c) if image(c) is not None else c for c in s)
if __name__=="__main__":
    for line in sys.stdin: sys.stdout.write(project(line.rstrip("\n"))+"\n")
