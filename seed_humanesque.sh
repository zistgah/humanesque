#!/usr/bin/env bash
# seed_humanesque.sh — seed the merged release as zistgah/humanesque.
#
# Clause A: run it from anywhere. It finds the release beside itself, in $PWD,
# or EXTRACTS humanesque.tar.gz from either. It does not stop and ask
# you to unpack something it can unpack.
# Clause 7: stages in $PWD, never /tmp, never above the invocation directory.
set -uo pipefail
REPO="${REPO:-zistgah/humanesque}"; GATE="SEED humanesque"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="$PWD/.seed-humanesque-$(date -u +%Y%m%dT%H%M%SZ)"
PUSH=0; [ "${1:-}" = "--push" ] && PUSH=1
say(){ printf '%s\n' "$*"; }; ok(){ printf '  [ok]   %s\n' "$*"; }
die(){ printf '\nseed: %s\n' "$*" >&2; exit 2; }

resolve_src() {
  local looked=() c
  for c in "$HERE" "$PWD" "$HERE/humanesque" "$PWD/humanesque"; do
    looked+=("$c"); [ -f "$c/VERIFY.sh" ] && { printf '%s\n' "$c"; return 0; }
  done
  for c in "$HERE/humanesque.tar.gz" "$PWD/humanesque.tar.gz" \
           "$HERE/humanesque.tar" "$PWD/humanesque.tar"; do
    looked+=("$c")
    if [ -f "$c" ]; then
      mkdir -p "$WORK/extract" || die "cannot create $WORK/extract"
      tar -C "$WORK/extract" -xf "$c" || die "could not extract $c"
      local f; f="$(find "$WORK/extract" -name VERIFY.sh -print -quit)"
      [ -n "$f" ] && { printf '%s\n' "$(dirname "$f")"; return 0; }
      die "extracted $c but it contains no VERIFY.sh"
    fi
  done
  die "could not find the release. Looked in:
    $(printf '%s\n    ' "${looked[@]}")
  Put humanesque.tar.gz beside this script and run it again."
}

SRC="$(resolve_src)" || exit 2
say "source: $SRC"; say
command -v git >/dev/null || die "git is not on PATH"
( cd "$SRC" && bash VERIFY.sh ) || die "the tree did not verify. Nothing was staged."

mkdir -p "$WORK/repo" || die "cannot create $WORK/repo"
EXISTS=0
if git clone --depth 1 "https://github.com/$REPO.git" "$WORK/repo" 2>/dev/null; then
  say "  cloned $REPO"; EXISTS=1
else say "  $REPO not clonable; staging fresh"; ( cd "$WORK/repo" && git init -q ); fi
tar -C "$SRC" --exclude='.seed-*' --exclude='.git' -cf - . | tar -C "$WORK/repo" -xf -
( cd "$WORK/repo" && bash VERIFY.sh ) || die "the STAGED tree does not verify. Nothing will be pushed."
ok "staged tree verifies where it now lives"
say; say "staged at: $WORK/repo"
[ "$PUSH" -eq 1 ] || { say; say "Nothing was pushed. Run again with --push."; exit 0; }

say; say "This will push to https://github.com/$REPO"; say "Type exactly:  $GATE"
if [ -t 0 ]; then read -r -p "> " T < /dev/tty; else read -r T; fi
[ "$T" = "$GATE" ] || { say "Refused. Nothing pushed. Tree at $WORK/repo"; exit 1; }

cd "$WORK/repo" || die "cannot enter $WORK/repo"
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo AyeAI)}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo noreply@ayeai)}" \
    commit -q -m "Humanesque merged release

Full panini_by_grok tree — compiler, 21 frontends, 6 backends, Hindawi/ILM,
41 doc pages, factory, labs, tools, website — with the panini_by_claude engine
overlaid, Mez's workflows derived from the .pni cyclers, and four honesty
defects fixed: licence conflict, never_nonzero test policy, hardcoded A-vs-B
comparison, hand-authored workflow snapshot.

VERIFY.sh re-checks all 16 claims in one command." || say "  (nothing new to commit)"
git branch -M main
if [ "$EXISTS" -ne 1 ] && ! git ls-remote --exit-code "https://github.com/$REPO.git" >/dev/null 2>&1; then
  command -v gh >/dev/null || die "remote absent and gh not installed. Tree at $WORK/repo"
  say "  creating https://github.com/$REPO"
  OUT="$(gh repo create "$REPO" --public --description "Humanesque merged release — PANINI, ILM, Hindawi, cyclers, Mez" 2>&1)" \
    || case "$OUT" in *"already exists"*) : ;; *) die "could not create $REPO: $OUT";; esac
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
git push -u origin main || die "push failed. Tree intact at $WORK/repo"
L="$(git rev-parse HEAD)"; R2="$(git ls-remote origin refs/heads/main | cut -f1)"
[ "$L" = "$R2" ] || die "push reported success but origin/main != ${L:0:7}"
say; ok "pushed to https://github.com/$REPO"; ok "origin/main verified at ${L:0:7}"
