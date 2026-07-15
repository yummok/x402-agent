# x402 Agent — USDC Micropayments on Base


![x402](https://img.shields.io/badge/⚡_x402-Payments-8A2BE2?style=for-the-badge)

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Network: Base](https://img.shields.io/badge/Network-Base%20Mainnet-0052FF)
![Protocol: x402 v2](https://img.shields.io/badge/Protocol-x402%20v2-8A2BE2)
![Token: USDC](https://img.shields.io/badge/Token-USDC-2775CA)
![CI](https://github.com/yummok/x402-agent/actions/workflows/ci.yml/badge.svg)

An AI agent that can **pay for and sell data** using the [x402 protocol](https://x402.org) — HTTP-native payments with USDC on Base mainnet. No API keys, no accounts, just stablecoin micropayments settled onchain.

**🌐 Live Dashboard: https://superagent-42aeca08.base44.app/functions/x402Dashboard**

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    x402 Agent                            │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │ x402SellPre- │    │ x402PayAnd   │    │ x402Dash- │  │
│  │ miumJoke     │    │ Fetch        │    │ board     │  │
│  │ (seller)     │    │ (buyer)      │    │ (UI)      │  │
│  │              │    │              │    │           │  │
│  │ 402 → verify │    │ 402 → sign   │    │ HTML page │  │
│  │ → settle     │    │ → retry → ✓  │    │ w/ fetch  │  │
│  └──────┬───────┘    └──────┬───────┘    └───────────┘  │
│         │                   │                          │
│         └───────┬───────────┘                          │
│                 │                                      │
│         ┌───────▼───────┐                              │
│         │ CDP Facilitator│                             │
│         │ (Coinbase)     │                             │
│         └───────┬───────┘                              │
│                 │                                      │
│         ┌───────▼───────┐                              │
│         │ USDC on Base  │                              │
│         │ Mainnet       │                              │
│         └───────────────┘                              │
│                                                         │
│  Automations:                                           │
│  • Daily scheduled x402 data purchase                   │
│  • Entity-triggered auto-pay on new data requests       │
└─────────────────────────────────────────────────────────┘
```

## Components

### Backend Functions

| Function | Role | Description |
|----------|------|-------------|
| `x402SellPremiumJoke` | Seller | Paywalled endpoint (0.01 USDC). Returns 402 with payment terms, verifies & settles via CDP facilitator, returns a joke on success. |
| `x402PayAndFetch` | Buyer | General-purpose x402 client. Takes any `{url, method}`, auto-detects 402, signs EIP-3009 `transferWithAuthorization`, retries with payment, returns unlocked content + settlement tx. |
| `x402Dashboard` | UI | Serves the hosted dashboard as HTML at `https://superagent-42aeca08.base44.app/functions/x402Dashboard`. Calls `x402PayAndFetch` directly via fetch for real onchain payments. |

### Entities

| Entity | Purpose |
|--------|---------|
| `X402PaymentLog` | Tracks all x402 payments made by the agent (endpoint, amount, tx hash, response) |
| `X402DataRequest` | Queue of data requests — creating a record triggers the auto-pay automation |

### Automations

| Name | Type | Trigger | Description |
|------|------|---------|-------------|
| Daily x402 Data Purchase | Scheduled | Every day at 9:00 AM (Rome) | Calls an external x402 API, pays 0.01 USDC, logs the result |
| x402 Auto-Pay on Data Request | Entity trigger | `X402DataRequest` record created | Reads URL from the new record, pays & fetches, updates the record with results |

### Dashboard

**Hosted**: https://superagent-42aeca08.base44.app/functions/x402Dashboard

**Source**: `dashboard/index.html` (also served via `functions/x402Dashboard.ts`)

A standalone web UI that lets you:
- Submit x402 data requests by entering any x402-gated URL
- View payment results (settlement tx, amount, payee, response)
- Browse payment history with links to Basescan
- See active automations and wallet stats

## Deployment Notes

> Full deployment log with technical details: [`DEPLOYMENT.md`](DEPLOYMENT.md)

### 2026-07-02 — Base Mainnet + Dashboard Live

**Status: Fully Operational ✅**

| Item | Value |
|------|-------|
| Network | Base mainnet (chainId 8453) |
| Protocol | x402 v2 (CDP facilitator) |
| Agent Wallet | `0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f` |
| USDC Balance | ~1.48 USDC |
| Payments Verified | 3 successful onchain settlements |
| GitHub Repo | [github.com/yummok/x402-agent](https://github.com/yummok/x402-agent) |

**Deployed components:**
- `x402SellPremiumJoke` — seller endpoint (0.01 USDC)
- `x402PayAndFetch` — universal x402 buyer client
- `x402Dashboard` — hosted interactive dashboard
- 2 automations (daily 9AM + entity-triggered auto-pay)

**Verified transactions:**
| # | Description | Tx | Network |
|---|-------------|-----|---------|
| 1 | Self-payment (joke) | [`0xb2d9…34bd`](https://basescan.org/tx/0xb2d9f8feb82a38705fd73096b71692866d567b6ed5fff0d259685c6b1e2234bd) | Base mainnet |
| 2 | Interzoid API | [`0x85e0…52a9`](https://basescan.org/tx/0x85e07f4938fabea8571d05011dbd9e124809aed23f11f211a88a658b82e552a9) | Base mainnet |
| 3 | x402.org protected | [`0xb331…5a37`](https://sepolia.basescan.org/tx/0xb331f0c4509568c718370950323c1f43f18809ce7c44440f91cd7fc464c55a37) | Base Sepolia |

**Key decisions:**
- USDC EIP-712 domain name must be `"USD Coin"` (not `"USDC"`) — mismatch causes signature rejection
- Demo payTo `0x000…0402` avoids `self_send_not_allowed` when agent pays its own endpoint
- CDP facilitator sponsors gas — wallet only needs USDC, no ETH

## Key Technical Details

### x402 v2 Protocol

This implementation uses x402 **v2** wire format:
- Payment requirements in `PAYMENT-REQUIRED` header (base64-encoded)
- Client sends payment in `PAYMENT-SIGNATURE` header
- Settlement returned in `PAYMENT-RESPONSE` header
- Network uses CAIP-2 format (`eip155:8453` for Base mainnet)

### EIP-712 Domain — Critical Fix

USDC on Base mainnet (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) uses **"USD Coin"** as its EIP-712 domain name, not "USDC". This must match the token contract's domain separator:

```
Contract DOMAIN_SEPARATOR(): 0x02fa7265e7c5d81118673727957699e4d68f74cd74b7db77da710fe8a2c7834f
Computed (USD Coin / v2):    0x02fa7265e7c5d81118673727957699e4d68f74cd74b7db77da710fe8a2c7834f ✓
```

Using the wrong name produces invalid signatures that the contract reverts on.

### CDP Facilitator

- **Verify**: `POST https://api.cdp.coinbase.com/platform/v2/x402/verify`
- **Settle**: `POST https://api.cdp.coinbase.com/platform/v2/x402/settle`
- **Auth**: JWT via `generateJwt()` from `@coinbase/cdp-sdk` with `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET`

### Contracts & Network

| Item | Value |
|------|-------|
| Network | Base mainnet (chainId 8453) |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC EIP-712 name | `USD Coin` |
| USDC EIP-712 version | `2` |
| Agent wallet | `0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f` |
| Demo payTo | `0x0000000000000000000000000000000000000402` |

## Setup

### Prerequisites

- A funded wallet with USDC on Base mainnet
- Coinbase Developer Platform (CDP) API credentials
- Node.js / Deno runtime for backend functions

### Environment Variables

See `.env.example`:

```env
X402_WALLET_PRIVATE_KEY=0x...        # Agent wallet private key
CDP_API_KEY_ID=your_cdp_key_id       # CDP API key ID
CDP_API_KEY_SECRET=your_cdp_secret   # CDP API key secret
```

### Running Tests

```bash
# Run unit tests with Deno
deno test --allow-read tests/

# Run a specific test file
deno test --allow-read tests/utils_test.ts
```

### Running Locally

```bash
# Start the seller endpoint
deno run --allow-net --allow-env x402SellPremiumJoke.ts

# Run the buyer client against any x402-gated URL
deno run --allow-net --allow-env x402PayAndFetch.ts
```

### Verified Transactions

- Self-payment (joke): `0xb2d9f8feb82a38705fd73096b71692866d567b6ed5fff0d259685c6b1e2234bd` on Base mainnet
- External payment (Interzoid): `0x85e07f4938fabea8571d05011dbd9e124809aed23f11f211a88a658b82e552a9` on Base mainnet
- x402.org protected: `0xb331f0c4509568c718370950323c1f43f18809ce7c44440f91cd7fc464c55a37` on Base Sepolia

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting bugs, suggesting features, and submitting pull requests.

## License

MIT — see [LICENSE](LICENSE)
