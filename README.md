# x402 Agent — USDC Micropayments on Base

An AI agent that can **pay for and sell data** using the [x402 protocol](https://x402.org) — HTTP-native payments with USDC on Base mainnet. No API keys, no accounts, just stablecoin micropayments settled onchain.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    x402 Agent                            │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │ x402SellPre- │    │ x402PayAnd   │                  │
│  │ miumJoke     │    │ Fetch        │                  │
│  │ (seller)     │    │ (buyer)      │                  │
│  │              │    │              │                  │
│  │ 402 → verify │    │ 402 → sign   │                  │
│  │ → settle     │    │ → retry → ✓  │                  │
│  └──────┬───────┘    └──────┬───────┘                  │
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
│                                                         │
│  Dashboard: dashboard/index.html                        │
└─────────────────────────────────────────────────────────┘
```

## Components

### Backend Functions

| Function | Role | Description |
|----------|------|-------------|
| `x402SellPremiumJoke` | Seller | Paywalled endpoint (0.01 USDC). Returns 402 with payment terms, verifies & settles via CDP facilitator, returns a joke on success. |
| `x402PayAndFetch` | Buyer | General-purpose x402 client. Takes any `{url, method}`, auto-detects 402, signs EIP-3009 `transferWithAuthorization`, retries with payment, returns unlocked content + settlement tx. |

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

`dashboard/index.html` — a standalone web UI that lets you:
- Submit x402 data requests by entering any x402-gated URL
- View payment results (settlement tx, amount, payee, response)
- Browse payment history with links to Basescan
- See active automations and wallet stats

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

### Verified Transactions

- Self-payment (joke): `0xb2d9f8feb82a38705fd73096b71692866d567b6ed5fff0d259685c6b1e2234bd` on Base mainnet
- External payment (Interzoid): `0x85e07f4938fabea8571d05011dbd9e124809aed23711f211a88a658b82e552a9` on Base mainnet
- x402.org protected: `0xb331f0c4509568c718370950323c1f43f18809ce7c44440f91cd7fc464c55a37` on Base Sepolia

## License

MIT
