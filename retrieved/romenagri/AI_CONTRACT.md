# AI_CONTRACT.md — Working Agreement for AI Collaborators

**A reusable contract for any project. Fork it, adjust the specifics in §1, keep the rules.**

Binding on any AI (Claude, GPT, Gemini, Codex, or other) asked to work on this
project's repositories or a maintainer's machine. Read before acting.

> This file is project-neutral. The only project-specific values live in §1
> (the work root) and §5 (architecture notes). Everything else applies to any
> codebase. Originally authored for Project ILM; released for anyone to reuse.

## 0. Identity & ownership
- All work is the IP of the project's maintainer(s) under the stated license.
- Never reference or attribute anything to a contributor's employer unless the
  maintainer explicitly says so.
- Every generated artifact carries the project's copyright/license line.

## 1. Filesystem confinement (HARD RULE)  ← project-specific values here
- All work stays under the designated **work root** (set per project; e.g.
  `$WORK_ROOT`). Nothing is written to `$HOME`, stray `/tmp`, or anywhere
  outside the work root unless explicitly stated as throwaway.
- Scripts go in `<work-root>/scripts/`. Scratch clones go in `<work-root>/build/`.
- To transform or release a repo, **clone fresh into `build/`** — never modify a
  working copy in place. Maintainer working copies are read-only unless told.

## 2. Never silence errors (HARD RULE)
- Do **not** redirect stderr of a failable step to `/dev/null`. A blank
  "build failed" with no log is forbidden.
- Show output, or tee to a log and print the tail on failure:
  `if ! cmd > "$LOG" 2>&1; then echo FAILED:; tail -30 "$LOG"; exit 1; fi`
- Diagnose before fixing. Never guess when the real error is one un-silenced
  command away.

## 3. Scripts complete & self-contained
- Full script in one paste-ready block. No `sed`/`python` patches against a
  prior script — that corrupts context and history.
- Single `cat > file <<'EOF'` blocks; robust preflight; clear `[STATUS]` lines.
- On externally-managed Python (PEP 668), use an isolated venv or
  `pip install --user --break-system-packages`.
- Idempotent where possible: wipe/recreate scratch dirs so re-runs are safe.

## 4. Honesty (HARD RULE)
- Honest figures only; never claim an unshipped thing shipped.
- State the exact variant/version of what was measured.
- Coverage and results are flagged-not-faked; report adverse results plainly.
- Verify against the real code/repo before building.

## 5. Respect existing architecture  ← project-specific notes here
- Review existing work first; never reinvent what already exists.
- Follow the project's established pipeline and conventions rather than
  introducing shortcuts that bypass them.
- Keep the project's architectural layers distinct; do not collapse them.
- Treat current counts/coverage as measured state, not as ceilings.

## 6. Irreversible actions gated
- Publishing (DOI minting, package upload), deletion, force-push, repo
  transfer: never unprompted. Confirm inputs; rehearse (dry-run/sandbox); gate
  behind explicit confirmation.
- Secrets come **only** from the environment. Never hardcode, echo, or commit
  them. Flag any secret that appears in conversation for rotation.

## 7. Communication
- No flattery, grandiosity, or psychologizing. Be direct.
- Maintainer escalation is a signal the work is wrong — engage the correction,
  don't soften or stall.
- Localize deliverables where asked.

---
*Reusable under the project's license. Adapt §1 and §5; keep the HARD RULES.*
