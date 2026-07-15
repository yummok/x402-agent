# Getting Started

This guide walks you through setting up the x402 agent from scratch.

## Prerequisites

- [Deno](https://deno.land/) 1.40+ (runtime)
- A Coinbase Developer Platform account (free) — [sign up](https://portal.cdp.coinbase.com/)
- USDC on Base mainnet (you can get a small amount for testing)

## Step 1: Clone & Install

```bash
git clone https://github.com/yummok/x402-agent.git
cd x402-agent
```

No `npm install` needed — Deno fetches dependencies automatically.

## Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

| Variable | Where to get it |
|----------|----------------|
| `CDP_API_KEY_ID` | CDP Portal → API Keys |
| `CDP_API_KEY_SECRET` | CDP Portal → API Keys (shown once) |
| `X402_WALLET_PRIVATE_KEY` | Generate with `npx viem generate-private-key` |

## Step 3: Fund Your Wallet

Send USDC on Base mainnet to your wallet's public address. You can check the balance on [Basescan](https://basescan.org/).

> The facilitator sponsors gas — your wallet only needs USDC, no ETH required.

## Step 4: Validate Setup

```bash
deno run --allow-env scripts/validate-env.ts
```

If all variables pass, you're ready to go.

## Step 5: Try It Out

### Start the seller endpoint

```bash
make seller
# or: deno run --allow-net --allow-env x402SellPremiumJoke.ts
```

### Pay for a resource on the web

```bash
make buyer
# or: deno run --allow-net --allow-env x402PayAndFetch.ts
```

### Open the dashboard

Navigate to the [hosted dashboard](https://superagent-42aeca08.base44.app/functions/x402Dashboard) for an interactive UI.

## Step 6: Run Tests

```bash
make test
```

All tests should pass.

## Next Steps

- Read the [API reference](API.md) for endpoint details
- Check the [ADRs](adr/) for architectural decisions
- Review [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute
