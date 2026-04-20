#!/usr/bin/env bash

# Skrypt waliduje nowe pliki wiki/**/*.md pod kątem wymaganych sekcji redakcyjnych.
set -euo pipefail

MODE="${1:-staged}"

# Wyznacza katalog główny repozytorium niezależnie od miejsca wywołania.
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

collect_staged_files() {
  # Pobiera nowe (A) pliki dodane do indeksu.
  git diff --cached --name-status --diff-filter=A -- 'wiki/**/*.md' \
    | awk '$1 == "A" {print $2}'
}

collect_push_files() {
  # Pobiera nowe pliki względem gałęzi upstream; jeśli brak upstream, fallback do staged.
  local upstream
  if upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null)"; then
    git diff --name-status --diff-filter=A "$upstream...HEAD" -- 'wiki/**/*.md' \
      | awk '$1 == "A" {print $2}'
  else
    collect_staged_files
  fi
}

if [[ "$MODE" == "push" ]]; then
  mapfile -t FILES < <(collect_push_files)
else
  mapfile -t FILES < <(collect_staged_files)
fi

if [[ "${#FILES[@]}" -eq 0 ]]; then
  echo "Brak nowych plików wiki/**/*.md do walidacji."
  exit 0
fi

echo "Walidacja nowych artykułów (${#FILES[@]}):"
printf ' - %s\n' "${FILES[@]}"

python3 tools/konwerter.py validate-article "${FILES[@]}"
