#!/usr/bin/env bash
# Regenerates src/schema.d.ts from the OpenAPI spec.
#
# Usage:
#   bash scripts/generate.sh [spec-source]
#
# spec-source can be:
#   - a local file path (default: ./openapi.json)
#   - a URL (e.g. https://api.peakly.io/openapi.json)
#
# The peakly-v2-api repo includes scripts/dump-openapi.sh to refresh the
# committed openapi.json snapshot when the API changes.

set -euo pipefail

SPEC="${1:-openapi.json}"

if [[ ! -f "$SPEC" && ! "$SPEC" =~ ^https?:// ]]; then
  echo "[generate] ✗ Spec file not found: $SPEC" >&2
  exit 1
fi

echo "[generate] Generating src/schema.d.ts from $SPEC..."
npx openapi-typescript "$SPEC" -o src/schema.d.ts
echo "[generate] ✓ Done"
