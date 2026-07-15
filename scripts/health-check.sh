#!/bin/bash
# Health check script — verifies all x402 agent endpoints are responding.
# Usage: bash scripts/health-check.sh

set -e

BASE_URL="https://superagent-42aeca08.base44.app/functions"
PASS=0
FAIL=0

check() {
  local name="$1"
  local url="$2"
  local expected_code="$3"

  response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

  if [ "$response" = "$expected_code" ]; then
    echo "  ✅ $name — HTTP $response (expected $expected_code)"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $name — HTTP $response (expected $expected_code)"
    FAIL=$((FAIL + 1))
  fi
}

echo "🔍 x402 Agent — Health Check"
echo "============================"
echo ""

check "Seller endpoint" "$BASE_URL/x402SellPremiumJoke" "402"
check "Dashboard" "$BASE_URL/x402Dashboard" "200"

echo ""
echo "Results: $PASS passed, $FAIL failed"

if [ $FAIL -gt 0 ]; then
  exit 1
fi
