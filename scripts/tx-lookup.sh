#!/bin/bash
# Look up an x402 settlement transaction on Basescan.
# Usage: bash scripts/tx-lookup.sh <tx_hash>

if [ -z "$1" ]; then
  echo "Usage: tx-lookup.sh <tx_hash>"
  echo "Example: tx-lookup.sh 0xb2d9f8feb82a38705fd73096b71692866d567b6ed5fff0d259685c6b1e2234bd"
  exit 1
fi

TX_HASH="$1"
echo "🔍 Looking up transaction: $TX_HASH"
echo ""

# Validate format
if [[ ! "$TX_HASH" =~ ^0x[a-fA-F0-9]{64}$ ]]; then
  echo "❌ Invalid transaction hash format"
  exit 1
fi

# Open in browser (macOS) or print URL
if command -v open &>/dev/null; then
  open "https://basescan.org/tx/$TX_HASH"
elif command -v xdg-open &>/dev/null; then
  xdg-open "https://basescan.org/tx/$TX_HASH"
else
  echo "View on Basescan: https://basescan.org/tx/$TX_HASH"
fi
