#!/usr/bin/env python3
# Copyright (C) 1993-2026 Abhishek Choudhary
# SPDX-License-Identifier: GPL-3.0-or-later
"""Vesoha Hindi distribution tables.

C rows are copied from retrieved hindi_c.tsv (Hindawi 2004 bar).
Other frontend rows are Hindi computational vocabulary for the Vesoha pack.
They live in dist/hindawi/share/langs/hindi/ — not in retrieved/.
Do not invent maps inside retrieved/.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = Path("/workspace/public/site")
CAT = Path("/workspace/src/lib/panini/catalog.ts")
HINDI_C = SITE / "retrieved" / "hindi_c.tsv"

OUT_DIST = ROOT / "dist" / "hindawi" / "share" / "langs" / "hindi"
OUT_SITE = SITE / "vesoha" / "hindi"

# Extra frontends present in frontends.json but not catalog.ts keywords.
EXTRA = {
    "logo": ["FORWARD", "BACK", "LEFT", "RIGHT", "REPEAT", "TO", "END", "PENUP", "PENDOWN", "PRINT"],
    "lex": ["%%", "%{", "%}", "BEGIN", "return", "yytext"],
    "yacc": ["%token", "%start", "%%", "yyparse", "yylex"],
}

# Host keyword → Hindi. C rows win when the host token matches hindi_c.tsv.
LEXICON = {
    "if": "यदि", "else": "अन्यथा", "while": "जबतक", "do": "करो", "for": "हेतु",
    "break": "विराम", "continue": "जारी", "switch": "चयन", "case": "स्थिति",
    "default": "मूल", "return": "लौटाओ", "const": "अचर", "int": "पूर्णांक",
    "float": "दशमलव", "double": "द्विगुण", "char": "अक्षर", "void": "शून्य",
    "class": "वर्ग", "new": "नवीन", "public": "सार्वजनिक", "private": "निजी",
    "static": "स्थिर", "virtual": "आभासी", "struct": "संरचना", "include": "सम्मिलित",
    "printf": "लिखो", "scanf": "पढ़ो", "typedef": "रूपनाम", "sizeof": "आकार",
    "#define": "घोषणा", "#ifdef": "यदिपरिभाषित", "#ifndef": "यदिअप परिभाषित",
    "#include": "सम्मिलित", "#undef": "अघोषित", "defined": "परिभाषित",
    "bool": "बूल", "template": "साँचा", "namespace": "नामस्थान", "delete": "मिटाओ",
    "def": "परिभाषा", "true": "सत्य", "false": "असत्य", "none": "शून्य",
    "var": "चर", "let": "मान", "function": "कृत्य", "throw": "फेंको",
    "enum": "गणना", "interface": "अन्तरफलक", "type": "प्रकार", "as": "जैसा",
    "implements": "लागू", "program": "कार्यक्रम", "begin": "आरम्भ", "end": "समाप्त",
    "procedure": "प्रक्रिया", "then": "तो", "print": "लिखो", "next": "अगला",
    "dim": "आयाम", "sub": "उप", "eval": "मूल्यांकन", "nil": "शून्य",
    "self": "स्व", "super": "अधि", "main": "मुख्य", "where": "जहाँ",
    "in": "में", "module": "मापांक", "defun": "परिभाषा", "quote": "उद्धरण",
    "lambda": "लम्बक", "deftest": "परीक्षण", "is": "है", "fail": "असफल",
    ":-": "नियम", "stop": "रुको", "package": "संकुल", "func": "कृत्य",
    "fn": "कृत्य", "mut": "परिवर्त्य", "pub": "सार्वजनिक", "local": "स्थानीय",
    "assert": "अभिकथन", "ifeq": "यदिबराबर", "ifdef": "यदिपरिभाषित",
    "obj-y": "वस्तु-y", "phony": "कृत्रिम", "export": "निर्यात",
    ".globl": "वैश्विक", ".text": "पाठ", "movl": "स्थानान्तरण",
    "addl": "जोड़ो", "ret": "लौट", "%eax": "%पूर्णांकक", "$imm": "$तत्काल",
    "config": "विन्यास", "tristate": "त्रिस्थिति", "depends": "निर्भर",
    "select": "चयन", "help": "सहायता", "entry": "प्रवेश",
    "sections": "खण्ड", "keep": "रखो", "align": "संरेख",
    "provide": "प्रदान", "memory": "स्मृति", "define": "परिभाषा",
    ":": "परिभाषा", ";": "समाप्त", "dup": "द्विगुण", "swap": "अदलाबदली",
    "drop": "गिराओ", "over": "ऊपर", ".": "छापो", "rec": "पुनः",
    "match": "मेल", "defn": "परिभाषा", "console": "पटल",
    "writeline": "पङ्क्तिलिखो", "fun": "कृत्य", "val": "मान",
    "println": "पङ्क्तिलिखो", "object": "वस्तु", "integer": "पूर्णांक",
    "puts": "लिखो", "my": "मेरा", "say": "कहो", "echo": "प्रतिध्वनि",
    "identification": "पहचान", "division": "विभाग", "compute": "गणना",
    "display": "प्रदर्श", "run": "चलाओ", "from": "से",
    "where": "जहाँ", "insert": "डालो", "into": "में", "values": "मान",
    "create": "रचो", "table": "सारणी", "endfunction": "कृत्यसमाप्त",
    "disp": "प्रदर्श", "part": "भाग", "attribute": "विशेषता",
    "constraint": "बाधा", "requirement": "आवश्यकता",
    "constitution": "संविधान", "forward": "आगे", "back": "पीछे",
    "left": "बाएँ", "right": "दाएँ", "repeat": "दोहराओ", "to": "को",
    "penup": "कलमउठाओ", "pendown": "कलमरखो", "%%": "%%", "%{": "%{",
    "%}": "%}", "begin": "आरम्भ", "yytext": "yyपाठ",
    "%token": "%प्रतीक", "%start": "%आरम्भ", "yyparse": "yyविश्लेषण",
    "yylex": "yyलेख", "this": "यह", "and": "और", "or": "अथवा",
    "not": "नहीं", "elif": "अन्यथायदि", "except": "सिवाय",
    "import": "आयात", "from": "से", "pass": "जाओ", "lambda": "लम्बक",
    "true": "सत्य", "false": "असत्य",
}

# Devanagari → Romenagri in the hindi_c.tsv underscored style.
CONV = [
    ("क्ष", "k_sa"), ("त्र", "tra"), ("ज्ञ", "j_na"), ("श्र", "shra"),
    ("आ", "aa"), ("ई", "ii"), ("ऊ", "uu"), ("ए", "e"), ("ऐ", "ai"),
    ("ओ", "o"), ("औ", "au"), ("अ", "a"),
    ("क्", "k"), ("ख्", "kh"), ("ग्", "g"), ("घ्", "gh"),
    ("च्", "c"), ("छ्", "ch"), ("ज्", "j"), ("झ्", "jh"),
    ("ट्", "t"), ("ठ्", "th"), ("ड्", "d"), ("ढ्", "dh"),
    ("त्", "t"), ("थ्", "th"), ("द्", "d"), ("ध्", "dh"),
    ("न्", "n"), ("प्", "p"), ("फ्", "ph"), ("ब्", "b"), ("भ्", "bh"),
    ("म्", "m"), ("य्", "y"), ("र्", "r"), ("ल्", "l"), ("व्", "v"),
    ("श्", "sh"), ("ष्", "s"), ("स्", "s"), ("ह्", "h"),
    ("क", "ka"), ("ख", "kha"), ("ग", "ga"), ("घ", "gha"), ("ङ", "nga"),
    ("च", "ca"), ("छ", "cha"), ("ज", "ja"), ("झ", "jha"), ("ञ", "n_a"),
    ("ट", "ta"), ("ठ", "tha"), ("ड", "da"), ("ढ", "dha"), ("ण", "na"),
    ("त", "ta"), ("थ", "tha"), ("द", "da"), ("ध", "dha"), ("न", "na"),
    ("प", "pa"), ("फ", "pha"), ("ब", "ba"), ("भ", "bha"), ("म", "ma"),
    ("य", "ya"), ("र", "ra"), ("ल", "la"), ("व", "va"),
    ("श", "sha"), ("ष", "sa"), ("स", "sa"), ("ह", "ha"),
    ("ा", "aa"), ("ि", "i"), ("ी", "ii"), ("ु", "u"), ("ू", "uu"),
    ("े", "e"), ("ै", "ai"), ("ो", "o"), ("ौ", "au"),
    ("ं", "n"), ("ः", "h"), ("ँ", "n"), ("्", "_"),
    ("।", "."),
]


def to_romenagri(s: str) -> str:
    out, i = [], 0
    while i < len(s):
        hit = None
        for src, dst in CONV:
            if s.startswith(src, i):
                hit = (src, dst)
                break
        if hit:
            out.append(hit[1])
            i += len(hit[0])
        else:
            out.append(s[i])
            i += 1
    t = "".join(out)
    t = re.sub(r"a([aiu])", r"\1", t)
    t = re.sub(r"_+", "_", t).strip("_")
    return t or s


def parse_keywords(text: str) -> dict[str, list[str]]:
    ids: dict[str, list[str]] = {}
    cur = None
    for line in text.splitlines():
        m = re.match(r'\s*id:\s*"([^"]+)"', line)
        if m:
            cur = m.group(1)
        km = re.match(r"\s*keywords:\s*\[(.*)\]", line)
        if km and cur:
            ids[cur] = re.findall(r'"([^"]+)"', km.group(1))
    return ids


def load_hindi_c() -> dict[str, tuple[str, str]]:
    rows = {}
    for line in HINDI_C.read_text(encoding="utf-8").splitlines():
        if not line or line.startswith("#") or line.startswith("native"):
            continue
        parts = line.split("\t")
        if len(parts) >= 3:
            rows[parts[2].strip()] = (parts[0].strip(), parts[1].strip())
    return rows


def hindi_of(host: str, hindi_c: dict[str, tuple[str, str]]) -> tuple[str, str]:
    if host in hindi_c:
        return hindi_c[host]
    low = host.lower()
    if host in hindi_c:
        return hindi_c[host]
    for k, v in hindi_c.items():
        if k.lower() == low:
            return v
    native = LEXICON.get(host) or LEXICON.get(low)
    if not native:
        native = host  # keep host token; do not invent a fake Hindi word
    return native, to_romenagri(native) if native != host else host


def main() -> None:
    keys = parse_keywords(CAT.read_text(encoding="utf-8"))
    keys.update(EXTRA)
    fe = json.loads((SITE / "data" / "frontends.json").read_text(encoding="utf-8"))
    for f in fe["frontends"]:
        keys.setdefault(f["id"], [])
    hindi_c = load_hindi_c()
    OUT_DIST.mkdir(parents=True, exist_ok=True)
    OUT_SITE.mkdir(parents=True, exist_ok=True)
    index = []
    for fid, kws in sorted(keys.items()):
        seen = set()
        rows = []
        # Always include the Hindi C bar first so Guru flattening has the kernel.
        if fid == "c":
            for host, (nat, rom) in hindi_c.items():
                rows.append((nat, rom, host))
                seen.add(host.lower())
        for kw in kws:
            if kw.lower() in seen:
                continue
            nat, rom = hindi_of(kw, hindi_c)
            rows.append((nat, rom, kw))
            seen.add(kw.lower())
        body = ["# Vesoha Hindi · frontend " + fid + " · Devanagari | (C) 1993-2026 Abhishek Choudhary GPL-3.0-or-later",
                "# C kernel rows from retrieved/hindi_c.tsv. Other rows: Vesoha pack, not retrieved/.",
                "native\tromenagri\thost"]
        for nat, rom, host in rows:
            body.append(f"{nat}\t{rom}\t{host}")
        text = "\n".join(body) + "\n"
        (OUT_DIST / f"{fid}.tsv").write_text(text, encoding="utf-8")
        (OUT_SITE / f"{fid}.tsv").write_text(text, encoding="utf-8")
        index.append({"id": fid, "n": len(rows), "file": f"vesoha/hindi/{fid}.tsv"})
    all_rows = ["# Vesoha Hindi · all frontends | (C) 1993-2026 Abhishek Choudhary GPL-3.0-or-later",
                "frontend\tnative\tromenagri\thost"]
    for fid, kws in sorted(keys.items()):
        tsv = (OUT_SITE / f"{fid}.tsv").read_text(encoding="utf-8")
        for line in tsv.splitlines():
            if not line or line.startswith("#") or line.startswith("native"):
                continue
            p = line.split("\t")
            if len(p) >= 3:
                all_rows.append(f"{fid}\t{p[0]}\t{p[1]}\t{p[2]}")
    (OUT_SITE / "ALL.tsv").write_text("\n".join(all_rows) + "\n", encoding="utf-8")
    (OUT_DIST / "ALL.tsv").write_text("\n".join(all_rows) + "\n", encoding="utf-8")
    registry = {
        "copyright": "Copyright (C) 1993-2026 Abhishek Choudhary",
        "license": "GPL-3.0-or-later",
        "distribution": "Vesoha Hindi",
        "script": "devanagari",
        "language": "hindi",
        "shaili_default": "guru",
        "invented_in_retrieved": False,
        "frontends_enabled": [x["id"] for x in index],
        "n_frontends": len(index),
        "tables": index,
        "backends": ["wasm", "local", "gcc"],
        "note": "Hindi C 29-row bar is retrieved. Other frontend rows are Vesoha distribution tables.",
    }
    (OUT_SITE / "registry.json").write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT_DIST / "registry.json").write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (SITE / "data" / "vesoha-hindi.json").write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("frontends", len(index), "rows", len(all_rows) - 2, "dist", OUT_DIST, "site", OUT_SITE)


if __name__ == "__main__":
    main()
