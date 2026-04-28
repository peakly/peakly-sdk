#!/usr/bin/env bash
# Regenerates src/schema.d.ts from the live Peakly OpenAPI spec.
#
# Usage:
#   bash scripts/generate.sh [spec-source]
#
# spec-source can be:
#   - a URL (default: https://api.peakly.ar/openapi.json)
#   - a local file path for offline development (e.g. ./openapi.json)
#
# The canonical source is always the live API. The committed openapi.json is
# a bootstrap snapshot only — run this script to pick up new fields and endpoints.

set -euo pipefail

SPEC="${1:-https://api.peakly.ar/openapi.json}"

if [[ ! -f "$SPEC" && ! "$SPEC" =~ ^https?:// ]]; then
  echo "[generate] ✗ Spec file not found: $SPEC" >&2
  exit 1
fi

echo "[generate] Generating src/schema.d.ts from $SPEC..."
npx openapi-typescript "$SPEC" -o src/schema.d.ts
echo "[generate] ✓ Done"
