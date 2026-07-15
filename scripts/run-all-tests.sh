#!/bin/bash
# Run all test suites and report results.
# Usage: bash scripts/run-all-tests.sh

set -e

echo "🧪 x402 Agent — Full Test Suite"
echo "================================"
echo ""

PASS=0
FAIL=0
SKIP=0

run_test() {
  local name="$1"
  local file="$2"

  if [ ! -f "$file" ]; then
    echo "  ⏭️  $name — SKIPPED (file not found)"
    SKIP=$((SKIP + 1))
    return
  fi

  echo -n "  ▶️  $name... "

  if deno test --allow-read "$file" 2>&1 | grep -q "test result: .*passed.* 0 failed"; then
    echo "✅ PASSED"
    PASS=$((PASS + 1))
  else
    echo "❌ FAILED"
    FAIL=$((FAIL + 1))
  fi
}

run_test "Utils tests" "tests/utils_test.ts"
run_test "Config tests" "tests/config_test.ts"
run_test "Constants tests" "tests/constants_test.ts"
run_test "Types tests" "tests/types_test.ts"
run_test "Config validation" "tests/config_validation_test.ts"
run_test "USDC conversion" "tests/usdc_conversion_test.ts"
run_test "Address validation" "tests/address_validation_test.ts"
run_test "Nonce generation" "tests/nonce_test.ts"
run_test "EIP-3009 encoding" "tests/eip3009_encoding_test.ts"
run_test "Header utils" "tests/header_utils_test.ts"
run_test "Wallet utils" "tests/wallet_utils_test.ts"
run_test "Integration" "tests/integration_test.ts"

echo ""
echo "Results: $PASS passed, $FAIL failed, $SKIP skipped"

if [ $FAIL -gt 0 ]; then
  exit 1
fi
