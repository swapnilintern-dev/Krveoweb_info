#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Downloads the demo photography used across the site into assets/img/photos/
# at two widths (800w and 1600w) so the site ships self-contained.
#
# These are Unsplash stock photos used as PLACEHOLDERS. Replace them with
# Spokart's own product and facility photography before launch — keep the same
# file names and the markup needs no changes. See PHOTO-CREDITS.md.
#
# Usage: bash tools/fetch-photos.sh
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=assets/img/photos
mkdir -p "$OUT"

# slug|unsplash-photo-id
PHOTOS=(
  "hero-badminton|photo-1626224583764-f87db24ac4ea"
  "warehouse-aisle|photo-1553413077-190dd305871c"
  "football-match|photo-1543326727-cf6c39e8f84c"
  "cricket-ball|photo-1531415074968-036ba1b575da"
  "footballs-stack|photo-1579952363873-27f3bade9f55"
  "fitness-accessories|photo-1584735935682-2f2b69dff9d2"
  "tennis-clay|photo-1554068865-24cecd4e34b8"
  "gym-dumbbells|photo-1534438327276-14e5300c3a48"
  "runners-group|photo-1607962837359-5e7e89f86776"
  "swimmer|photo-1530549387789-4c1017266635"
  "gym-studio|photo-1571902943202-507ec2618e8f"
)

for entry in "${PHOTOS[@]}"; do
  slug="${entry%%|*}"
  id="${entry##*|}"
  for w in 800 1600; do
    printf 'fetching %-22s %sw\n' "$slug" "$w"
    curl -sS --fail --max-time 60 \
      -o "$OUT/$slug-$w.jpg" \
      "https://images.unsplash.com/$id?fm=jpg&fit=max&w=$w&q=60&auto=format"
  done
done

echo "Done. $(ls "$OUT" | wc -l | tr -d ' ') files in $OUT"
