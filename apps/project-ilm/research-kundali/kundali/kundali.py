#!/usr/bin/env python3
"""
kundali.py — Research Kundali.

A kundali is computed from public birth data by a fixed procedure. A Research
Kundali is computed from public scholarly record by a fixed procedure: same
determinism, same reproducibility, no interpretation smuggled in.

Input is a person, a lab, an institute, an ORCID, or a DOI. Output is a chart of
what they have published, when, with whom, on what, and where the record lives —
plus a per-item hash so each work can carry its own timestamp, and a navigator
that seeds an AI conversation from any selection.

SOURCES, and why these:
  ORCID public API   pub.orcid.org      authoritative self-asserted record, no key
  OpenAlex           api.openalex.org   open corpus, works/authors/institutions, no key
  Crossref           api.crossref.org   registration metadata for DOIs, no key
  DataCite           api.datacite.org   datasets, software, theses, no key

GOOGLE SCHOLAR IS DELIBERATELY NOT USED. It publishes no API and its terms
prohibit automated access. A tool that quietly scrapes it would make every
downstream artefact legally contingent, which is the opposite of what a
provenance chain is for. OpenAlex covers the same ground with an open licence.
If a Scholar profile is wanted, the operator opens it themselves and pastes the
identifier; this tool will not fetch it.

RULES CARRIED FROM THE THIRD-PARTY WORK: index rather than copy (titles and
metadata only, never full text), attribution captured or explicitly absent, one
hash per item so proofs attach to works and not to bundles, and nothing is ever
minted on anyone's behalf.

© 1993–2026 Abhishek Choudhary. All rights reserved.
SPDX-License-Identifier: GPL-3.0-or-later
"""
from __future__ import annotations

import argparse, hashlib, json, os, re, sys, time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

try:
    os.nice(10)
except Exception:
    pass

UA = "research-kundali/0.1 (+https://github.com/project-ilm/research-kundali) AyeAI"
ORCID_RE = re.compile(r"^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$")
DOI_RE = re.compile(r"^10\.\d{4,9}/\S+$")


def jget(url: str, timeout: int = 30):
    req = Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


# --- adapters ---------------------------------------------------------------
def from_orcid(orcid: str, log) -> list[dict]:
    out = []
    try:
        d = jget(f"https://pub.orcid.org/v3.0/{orcid}/works")
    except Exception as e:
        log(f"  orcid: {type(e).__name__}"); return out
    for g in d.get("group", []):
        s = (g.get("work-summary") or [{}])[0]
        ids = {x.get("external-id-type"): x.get("external-id-value")
               for x in (s.get("external-ids") or {}).get("external-id", [])}
        out.append({
            "title": ((s.get("title") or {}).get("title") or {}).get("value", ""),
            "year": ((s.get("publication-date") or {}).get("year") or {}).get("value", ""),
            "type": (s.get("type") or "").lower().replace("_", " "),
            "doi": ids.get("doi", ""),
            "venue": (s.get("journal-title") or {}).get("value", "") if s.get("journal-title") else "",
            "source": "orcid",
            "authors": [],
        })
    log(f"  orcid {orcid}: {len(out)} works")
    return out


def from_openalex(query: str, is_orcid: bool, cap: int, log) -> list[dict]:
    out = []
    try:
        if is_orcid:
            flt = f"author.orcid:https://orcid.org/{query}"
        else:
            a = jget(f"https://api.openalex.org/authors?search={quote(query)}&per-page=1")
            res = a.get("results") or []
            if not res:
                log("  openalex: no such author"); return out
            flt = f"author.id:{res[0]['id'].rsplit('/',1)[-1]}"
            log(f"  openalex matched: {res[0].get('display_name')} "
                f"({res[0].get('works_count')} works)")
        page = 1
        while len(out) < cap:
            d = jget(f"https://api.openalex.org/works?filter={flt}"
                     f"&per-page=200&page={page}")
            rs = d.get("results") or []
            if not rs:
                break
            for w in rs:
                out.append({
                    "title": w.get("title") or "",
                    "year": str(w.get("publication_year") or ""),
                    "type": w.get("type") or "",
                    "doi": (w.get("doi") or "").replace("https://doi.org/", ""),
                    "venue": ((w.get("primary_location") or {}).get("source") or {}).get("display_name", "") or "",
                    "topics": [t.get("display_name") for t in (w.get("topics") or [])][:4],
                    "authors": [au.get("author", {}).get("display_name")
                                for au in (w.get("authorships") or [])][:20],
                    "cited_by": w.get("cited_by_count", 0),
                    "open_access": bool((w.get("open_access") or {}).get("is_oa")),
                    "source": "openalex",
                })
            if len(rs) < 200:
                break
            page += 1
    except Exception as e:
        log(f"  openalex: {type(e).__name__}")
    log(f"  openalex: {len(out)} works")
    return out


def from_crossref(doi: str, log) -> list[dict]:
    try:
        m = jget(f"https://api.crossref.org/works/{quote(doi, safe='')}").get("message", {})
    except Exception as e:
        log(f"  crossref: {type(e).__name__}"); return []
    return [{
        "title": (m.get("title") or [""])[0],
        "year": str(((m.get("issued") or {}).get("date-parts") or [[""]])[0][0] or ""),
        "type": m.get("type", ""), "doi": m.get("DOI", ""),
        "venue": (m.get("container-title") or [""])[0],
        "authors": [f"{a.get('given','')} {a.get('family','')}".strip()
                    for a in (m.get("author") or [])][:20],
        "cited_by": m.get("is-referenced-by-count", 0), "source": "crossref",
    }]


def from_datacite(query: str, cap: int, log) -> list[dict]:
    out = []
    try:
        d = jget(f"https://api.datacite.org/dois?query={quote(query)}&page[size]={min(cap,200)}")
    except Exception as e:
        log(f"  datacite: {type(e).__name__}"); return out
    for r in d.get("data", []):
        a = r.get("attributes", {})
        out.append({
            "title": ((a.get("titles") or [{}])[0]).get("title", ""),
            "year": str(a.get("publicationYear") or ""), "doi": a.get("doi", ""),
            "type": ((a.get("types") or {}).get("resourceTypeGeneral") or "").lower(),
            "venue": a.get("publisher", ""),
            "authors": [c.get("name", "") for c in (a.get("creators") or [])][:20],
            "source": "datacite",
        })
    log(f"  datacite: {len(out)} records")
    return out


# --- chart ------------------------------------------------------------------
def chart(subject: str, works: list[dict], log) -> dict:
    seen, uniq = set(), []
    for w in works:
        k = (w.get("doi") or "").lower() or re.sub(r"\W+", "", (w.get("title") or "").lower())[:80]
        if k and k in seen:
            continue
        if k:
            seen.add(k)
        w["sha256"] = hashlib.sha256(
            json.dumps({x: w.get(x) for x in ("title", "doi", "year", "venue")},
                       sort_keys=True).encode()).hexdigest()
        uniq.append(w)
    log(f"  {len(works)} raw -> {len(uniq)} distinct works")

    years = Counter(w["year"] for w in uniq if w.get("year"))
    coauth = Counter(a for w in uniq for a in (w.get("authors") or [])
                     if a and a.lower() != subject.lower())
    return {
        "subject": subject,
        "generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "counts": {"works": len(uniq),
                   "with_doi": sum(1 for w in uniq if w.get("doi")),
                   "open_access": sum(1 for w in uniq if w.get("open_access")),
                   "citations": sum(w.get("cited_by", 0) for w in uniq)},
        "years": dict(sorted(years.items())),
        "types": dict(Counter(w.get("type") or "unknown" for w in uniq)),
        "venues": dict(Counter(w["venue"] for w in uniq if w.get("venue")).most_common(25)),
        "topics": dict(Counter(t for w in uniq for t in (w.get("topics") or [])).most_common(30)),
        "coauthors": dict(coauth.most_common(40)),
        "sources": dict(Counter(w["source"] for w in uniq)),
        "works": sorted(uniq, key=lambda w: (w.get("year") or ""), reverse=True),
    }


def main():
    ap = argparse.ArgumentParser(description="Research Kundali — a chart from the public scholarly record")
    ap.add_argument("subject", help="a name, an ORCID, a DOI, a lab or an institute")
    ap.add_argument("--out", default="kundali-out")
    ap.add_argument("--cap", type=int, default=1000)
    ap.add_argument("--fetchers", type=int, default=8)
    ap.add_argument("--fixture", help="offline: read *.json from this directory as OpenAlex pages")
    a = ap.parse_args()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    log = lambda s: print(s, flush=True)
    subj = a.subject.strip()

    log(f"== Research Kundali: {subj}")
    works: list[dict] = []
    if a.fixture:
        for f in sorted(Path(a.fixture).glob("*.json")):
            d = json.loads(f.read_text())
            for w in d.get("results", []):
                works.append({
                    "title": w.get("title") or "", "year": str(w.get("publication_year") or ""),
                    "type": w.get("type") or "",
                    "doi": (w.get("doi") or "").replace("https://doi.org/", ""),
                    "venue": ((w.get("primary_location") or {}).get("source") or {}).get("display_name", "") or "",
                    "topics": [t.get("display_name") for t in (w.get("topics") or [])][:4],
                    "authors": [au.get("author", {}).get("display_name")
                                for au in (w.get("authorships") or [])][:20],
                    "cited_by": w.get("cited_by_count", 0),
                    "open_access": bool((w.get("open_access") or {}).get("is_oa")),
                    "source": "openalex"})
        log(f"  fixture: {len(works)} works")
    else:
        jobs = []
        with ThreadPoolExecutor(max_workers=a.fetchers) as ex:
            if ORCID_RE.match(subj):
                jobs.append(ex.submit(from_orcid, subj, log))
                jobs.append(ex.submit(from_openalex, subj, True, a.cap, log))
            elif DOI_RE.match(subj):
                jobs.append(ex.submit(from_crossref, subj, log))
            else:
                jobs.append(ex.submit(from_openalex, subj, False, a.cap, log))
                jobs.append(ex.submit(from_datacite, subj, a.cap, log))
            for f in as_completed(jobs):
                works += f.result()

    if not works:
        log("STOP: the public record returned nothing for this subject.")
        log("      Not writing an empty chart. Try an ORCID, or a fuller name.")
        return 2

    k = chart(subj, works, log)
    (out / "kundali.json").write_text(json.dumps(k, indent=2))

    items = out / "items"; items.mkdir(exist_ok=True)
    for w in k["works"]:
        (items / f"{w['sha256'][:16]}.sha256").write_text(
            f"{w['sha256']}  {w.get('doi') or w.get('title','')[:120]}\n"
            f"# subject: {subj}\n# year: {w.get('year','')}\n"
            f"# venue: {w.get('venue','')}\n# source: {w['source']}\n"
            f"# read: {k['generated_utc']}\n")
    log(f"  per-work digests: {len(k['works'])} (each can carry its own proof)")

    (out / "ASSUMPTIONS.md").write_text(f"""# Assumptions — Research Kundali for {subj}

| # | Assumed | Why safe | If wrong |
|---|---|---|---|
| K1 | A kundali is computed, not interpreted: a fixed procedure over public record | No claim is made that the chart means anything beyond what it counts | Nothing to undo |
| K2 | Name matching via OpenAlex author resolution | Reversible; the resolved name is printed | Re-run with an ORCID |
| K3 | Works are de-duplicated by DOI, else by normalised title | Standard practice | Adjust the key |
| K4 | Google Scholar is NOT queried — no API, terms prohibit automated access | Keeps every downstream artefact legally clean | Paste identifiers manually |
| K5 | Titles and metadata only; never full text | Indexing, not copying | Nothing to undo |
| K6 | A proof attaches to a work, not to the chart | A bundle proof credits nobody | Nothing to undo |

Nothing here has been minted. Generated {k['generated_utc']}.

(c) 1993-2026 Abhishek Choudhary. All rights reserved.
""")

    tpl = Path(__file__).with_name("navigator.html")
    if tpl.exists():
        (out / "index.html").write_text(tpl.read_text().replace("__DATA__", json.dumps(k)))
        log(f"== done -> {out}/index.html")
    else:
        log(f"== done -> {out}/kundali.json (navigator.html template absent)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
