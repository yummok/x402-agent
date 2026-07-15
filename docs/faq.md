# Frequently Asked Questions

## General

### What is x402?

x402 is an HTTP-native payment protocol that enables micropayments using USDC stablecoins. It uses the HTTP 402 Payment Required status code to signal that a resource costs money, and the client pays by signing an off-chain authorization that gets settled onchain.

### Do I need ETH for gas?

No. The CDP facilitator sponsors gas for settlement transactions. Your wallet only needs USDC — no ETH required.

### What network does this use?

Base mainnet (chain ID 8453). The agent also supports Base Sepolia testnet for development.

### How much does each payment cost?

The demo endpoint charges 0.01 USDC per request. You can configure the amount in your own endpoints.

## Setup

### How do I get CDP credentials?

1. Sign up at [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/)
2. Navigate to API Keys
3. Create a new API key pair
4. Copy the Key ID and Secret into your `.env` file

### How do I fund my wallet with USDC on Base?

Send USDC on Base mainnet to your wallet address. You can bridge USDC from Ethereum mainnet to Base, or buy USDC directly on Base via a DEX.

### Why does my signature fail with "invalid signature"?

Make sure you're using "USD Coin" as the EIP-712 domain name, not "USDC". The USDC contract on Base mainnet uses "USD Coin" in its domain separator.

## Troubleshooting

### I get `self_send_not_allowed` error

You can't send USDC from your wallet to the same wallet. Use a different `payTo` address. The demo uses `0x0000000000000000000000000000000000000402`.

### I get `invalid_exact_evm_insufficient_balance`

Your wallet doesn't have enough USDC. Fund it with more USDC on Base mainnet.

### The 402 response doesn't have payment requirements

Make sure the response includes the `PAYMENT-REQUIRED` header (v2) or payment terms in the body (v1). The agent auto-detects the version.

### My facilitator call returns 401

Your CDP JWT may have expired. The agent generates a fresh JWT for each request, so this shouldn't happen — but check that your `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET` are correct.
