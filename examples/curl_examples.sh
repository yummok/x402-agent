#!/bin/bash
# Example curl commands for the x402 agent API.
# Run individual examples with: bash examples/curl_examples.sh <example_name>

set -e

BASE_URL="https://superagent-42aeca08.base44.app/functions"

echo "x402 Agent — curl examples"
echo "=========================="
echo ""

# Example 1: Check the seller endpoint (should return 402)
echo "--- Example 1: Check seller endpoint (expect 402) ---"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  "$BASE_URL/x402SellPremiumJoke" | head -20

echo -e "\n\n"

# Example 2: Pay and fetch from an x402-gated URL
echo "--- Example 2: Pay and fetch from a URL ---"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"url": "https://httpbin.org/x402", "method": "GET"}' \
  "$BASE_URL/x402PayAndFetch" | python3 -m json.tool 2>/dev/null || echo "(non-JSON response)"

echo -e "\n"

# Example 3: Open the dashboard
echo "--- Example 3: Dashboard URL ---"
echo "Open in browser: $BASE_URL/x402Dashboard"

echo -e "\n"

# Example 4: Check wallet balance via the dashboard API
echo "--- Example 4: Dashboard stats ---"
curl -s "$BASE_URL/x402Dashboard" | head -5
echo "..."
echo "(Open the full dashboard in a browser for interactive use)"
