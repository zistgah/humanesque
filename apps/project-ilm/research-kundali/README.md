# Research Kundali · ریسرچ کنڈلی

A kundali is computed from public birth data by a fixed procedure. A **Research
Kundali** is computed from the public scholarly record by a fixed procedure: the
same determinism, the same reproducibility, and no interpretation smuggled in.

```
python3 kundali/kundali.py 0000-0002-1825-0097 --out out   # an ORCID
python3 kundali/kundali.py "Some Lab Name"     --out out   # a lab or institute
python3 kundali/kundali.py 10.1000/xyz123      --out out   # a single DOI
```

Produces a chart (output by year, topics, venues, co-authors), a filterable list of
works, a digest per work so each can carry its own timestamp, an `ASSUMPTIONS.md`
recording every decision taken without asking, and a navigator page where selecting
any text seeds an AI conversation.

## Sources, and one deliberate omission

ORCID · OpenAlex · Crossref · DataCite — all open, all keyless.

**Google Scholar is not queried.** It publishes no API and its terms prohibit
automated access. A tool that quietly scraped it would make every artefact
downstream of it legally contingent, which is the opposite of what a provenance
chain is for. OpenAlex covers the same ground under an open licence.

## Rules carried from the third-party work

Index rather than copy — titles and metadata, never full text. Attribution captured
or explicitly absent, never inferred. One proof per work, because a proof over a
bundle credits nobody. And nothing is ever minted on anyone's behalf.

## Disclaimers

A chart counts what the public record contains. It is not an assessment of quality,
originality or standing, and the record is incomplete for everyone — unevenly so by
discipline, language and geography. Absence from it means nothing about a person.

© 1993–2026 Abhishek Choudhary. All rights reserved.
