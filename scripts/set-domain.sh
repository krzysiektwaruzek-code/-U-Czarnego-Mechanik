#!/usr/bin/env bash
# Podmienia znacznik __DOMAIN__ na prawdziwą domenę w plikach SEO
# (canonical, Open Graph, JSON-LD, sitemap.xml, robots.txt).
#
# Użycie:  scripts/set-domain.sh twojadomena.pl
set -euo pipefail

domain="${1:-}"
if [[ -z "$domain" ]]; then
  echo "Użycie: scripts/set-domain.sh twojadomena.pl" >&2
  exit 1
fi

# Dopuszczamy wpisanie z https:// i końcowym ukośnikiem.
domain="${domain#https://}"
domain="${domain#http://}"
domain="${domain%/}"

if [[ ! "$domain" =~ ^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
  echo "To nie wygląda na poprawną domenę: $domain" >&2
  exit 1
fi

cd "$(dirname "$0")/.."

files=$(grep -rl "__DOMAIN__" --include='*.html' --include='*.xml' --include='*.txt' \
  --include='*.webmanifest' --include='*.json' . | grep -v '^\./docs/' | grep -v '^\./\.git/' || true)

if [[ -z "$files" ]]; then
  echo "Nie znaleziono znacznika __DOMAIN__ — domena została już ustawiona."
  exit 0
fi

while IFS= read -r file; do
  sed -i "s#__DOMAIN__#${domain}#g" "$file"
  echo "zaktualizowano: $file"
done <<< "$files"

echo "Gotowe. Domena: https://${domain}/"
