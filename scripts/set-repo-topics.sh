#!/bin/bash
# Set GitHub repository topics for discoverability
# Run: GITHUB_TOKEN=ghp_xxx ./scripts/set-repo-topics.sh
# Requires token with repo scope

set -e

REPO="yummok/x402-agent"
TOKEN="${GITHUB_TOKEN:?GITHUB_TOKEN is required}"

TOPICS='{"names":["x402","usdc","base","payments","micropayments","ai-agent","eip-3009","coinbase","blockchain","crypto","stablecoin","defi"]}'

echo "Setting topics for $REPO..."
curl -s -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.mercy-preview+json" \
  -d "$TOPICS" \
  "https://api.github.com/repos/$REPO/topics" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Topics: {\", \".join(d.get(\"names\", []))}') if 'names' in d else print(d)"
