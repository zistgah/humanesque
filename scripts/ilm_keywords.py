#!/usr/bin/env python3
"""Complete ILM C-keyword tables to the Hindi bar using retrieved flatten maps.
Do not invent Romenagri letter maps. Existing unique translations win.
Copyright (C) 1993-2026 Abhishek Choudhary | GPL-3.0-or-later
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = json.loads((ROOT / "docs/engine/bundle.json").read_text(encoding="utf-8"))
OUT_JSON = ROOT / "docs/data/ilm-keywords.json"
DEP = ROOT / "deposits/linguist"
DEP.mkdir(parents=True, exist_ok=True)
DOCS_RET = ROOT / "docs/retrieved"
DOCS_RET.mkdir(parents=True, exist_ok=True)

HINDI_ROWS = list(BUNDLE["langs"]["hindi"]["rows"])
BAR = len(HINDI_ROWS)

SCRIPT_OF = {
    "assamese": "bengali",
    "bengali": "bengali",
    "gujarati": "gujarati",
    "punjabi": "gurmukhi",
    "odia": "odia",
    "tamil": "tamil",
    "telugu": "telugu",
    "kannada": "kannada",
    "malayalam": "malayalam",
}

DEVA_LANGS = {"hindi", "sanskrit", "marathi", "nepali", "pali", "prakrit"}
PERSO_LANGS = set(BUNDLE.get("perso_family") or [])
# Semitic inventories are not C shailis; do not invent keywords.
LEAVE = {"aramaic", "hebrew", "phoenician", "syriac"}


def apply_map(text: str, mapping: dict[str, str]) -> str:
    if not mapping:
        return text
    keys = sorted(mapping, key=len, reverse=True)
    out, i, s = [], 0, text
    while i < len(s):
        hit = None
        for k in keys:
            if k and s.startswith(k, i):
                hit = k
                break
        if hit:
            out.append(mapping[hit])
            i += len(hit)
        else:
            out.append(s[i])
            i += 1
    return "".join(out)


def reverse_flatten(script: str) -> dict[str, str]:
    return dict((BUNDLE.get("flatten") or {}).get("reverse") or {}).get(script) or {}


def perso_map() -> dict[str, str]:
    m = {}
    for r in (BUNDLE.get("urdu_map") or {}).get("rows") or []:
        d, a = r.get("deva") or "", r.get("arab") or ""
        if d and a and d not in m:
            m[d] = a
    return m


PERSO = perso_map()


def fill_native(lang: str, hindi_native: str) -> str:
    if lang in DEVA_LANGS:
        return hindi_native
    if lang in SCRIPT_OF:
        return apply_map(hindi_native, reverse_flatten(SCRIPT_OF[lang]))
    if lang in PERSO_LANGS:
        return apply_map(hindi_native, PERSO)
    return hindi_native


def complete_lang(lang: str, existing: list[dict]) -> tuple[list[dict], list[str]]:
    have_c = {r.get("c") for r in existing}
    rows = [dict(r) for r in existing]
    filled = []
    if lang in LEAVE:
        return rows, filled
    for h in HINDI_ROWS:
        c = h.get("c")
        if c in have_c:
            continue
        native = fill_native(lang, h.get("native") or "")
        rows.append({
            "native": native,
            "romenagri": h.get("romenagri") or "",
            "c": c,
            "fill": "hindi-hub+retrieved-flatten",
        })
        have_c.add(c)
        filled.append(c)
    return rows, filled


report = {
    "copyright": "Copyright (C) 1993-2026 Abhishek Choudhary",
    "license": "GPL-3.0-or-later",
    "bar": BAR,
    "bar_language": "hindi",
    "note": "Existing unique translations kept. Missing C keys filled from Hindi hub through retrieved flatten reverse / urdu_map. Semitic inventories not completed. retrieved/romenagri is read-only.",
    "invented_maps": False,
    "languages": {},
}

for lang, spec in sorted(BUNDLE["langs"].items()):
    existing = list(spec.get("rows") or [])
    rows, filled = complete_lang(lang, existing)
    unique_c = sorted({r.get("c") for r in rows if r.get("c")})
    report["languages"][lang] = {
        "n": len(rows),
        "unique_c": len(unique_c),
        "bar": BAR,
        "complete": lang not in LEAVE and len(unique_c) >= 27,
        "filled_c": filled,
        "roundtrip": spec.get("roundtrip"),
        "left_as_inventory": lang in LEAVE,
        "rows": rows,
    }
    # deposits (writable). Not retrieved/.
    tsv = DEP / f"{lang}_c.tsv"
    lines = [
        f"# {lang} C keywords — Hindi bar {BAR}. Existing translations kept; missing filled via retrieved ILM flatten. GPL-3.0-or-later",
        "native\tromenagri\tc",
    ]
    for r in rows:
        lines.append(f"{r.get('native','')}\t{r.get('romenagri','')}\t{r.get('c','')}")
    tsv.write_text("\n".join(lines) + "\n", encoding="utf-8")
    if lang in {"hindi", "sanskrit", "marathi", "nepali", "punjabi"}:
        (DOCS_RET / f"{lang}_c.tsv").write_text("\n".join(lines) + "\n", encoding="utf-8")

OUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
n_complete = sum(1 for v in report["languages"].values() if v["complete"])
print("ilm-keywords", n_complete, "/", len(report["languages"]), "complete vs unique-c 27; bar rows", BAR)
for lang, v in report["languages"].items():
    mark = "OK" if v["complete"] else ("INV" if v["left_as_inventory"] else "GAP")
    print(f"  {lang:16} n={v['n']:2} unique={v['unique_c']:2} filled={v['filled_c']} {mark}")
