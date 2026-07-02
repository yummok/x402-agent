# x402 AI Agent — USDC Micropayments on Base

An AI agent that can **send and receive** USDC micropayments using the [x402 protocol](https://x402.org) — internet-native payments over HTTP. No accounts, no API keys, no intermediaries. Just pay-per-request with stablecoins on Base.

Built on [Base44](https://base44.com) as a Superagent backend function deployment.

## How x402 Works

```
1. Agent → Server:  GET /resource (no payment)
2. Server → Agent:  402 Payment Required + payment terms
3. Agent → Server:  GET /resource + PAYMENT-SIGNATURE header (signed USDC transfer)
4. Server → Agent:  200 OK + content + PAYMENT-RESPONSE header (settlement proof)
```

The agent signs a gasless [EIP-3009](https://eips.ethereum.org/EIPS/eip-3009) `transferWithAuthorization` for USDC. The [Coinbase Developer Platform (CDP)](https://portal.cdp.coinbase.com/) facilitator verifies the signature and settles the transfer onchain. No ETH needed for gas — the facilitator sponsors it.

## What's Included

### `x402SellPremiumJoke.ts` — Receive Payments (Seller)
A paywalled endpoint that charges **0.01 USDC** on Base mainnet. Returns a `402` with payment terms if unpaid, verifies and settles via the CDP facilitator on payment, then returns a premium joke.

- **x402 v2 protocol**: uses `PAYMENT-REQUIRED` / `PAYMENT-SIGNATURE` / `PAYMENT-RESPONSE` headers (base64-encoded)
- **CDP facilitator**: JWT-authenticated verify + settle via `api.cdp.coinbase.com`
- **Network**: Base mainnet (`eip155:8453`)
- **Asset**: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)

### `x402PayAndFetch.ts` — Send Payments (Buyer)
A general-purpose x402 client. Give it any URL — if the server responds with `402`, it automatically:
1. Parses the payment requirements (v1 or v2)
2. Signs an EIP-3009 `transferWithAuthorization` with the agent wallet
3. Retries the request with proof of payment
4. Returns the unlocked content + onchain settlement details

Works against **any x402-gated URL on the web**, not just our own endpoint.

## Setup

### Prerequisites
- A [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) account with API keys
- An EVM wallet with USDC on Base mainnet (for sending payments)
- A [Base44](https://base44.com) Superagent account (for hosting backend functions)

### Environment Variables
Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `CDP_API_KEY_ID` | CDP API key ID from portal.cdp.coinbase.com |
| `CDP_API_KEY_SECRET` | CDP API key secret |
| `X402_WALLET_PRIVATE_KEY` | EVM private key for signing payments |

### Funding the Wallet
For the payment flow to complete, the agent wallet needs **real USDC on Base mainnet**:
- Send USDC to the agent wallet address on the Base network
- No ETH needed — gas is sponsored by the CDP facilitator

## API Reference

### Sell Endpoint
```
GET https://<your-domain>/functions/x402SellPremiumJoke
```

Without payment → `402` with `PAYMENT-REQUIRED` header containing base64-encoded payment terms.

With `PAYMENT-SIGNATURE` header → `200` with joke in body and `PAYMENT-RESPONSE` header with settlement details.

### Pay & Fetch Endpoint
```
POST https://<your-domain>/functions/x402PayAndFetch
Content-Type: application/json

{
  "url": "https://any-x402-gated-url.com/resource",
  "method": "GET"
}
```

Returns:
```json
{
  "paid": true,
  "status": 200,
  "x402Version": 2,
  "amountPaidAtomic": "10000",
  "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "network": "eip155:8453",
  "payer": "0x...",
  "settlement": { "success": true, "transaction": "0x...", "network": "eip155:8453" },
  "body": { ... unlocked content ... }
}
```

## Protocol Details

This implementation follows the **x402 v2 specification**:

- **Payment Required** (402): Carried in the `PAYMENT-REQUIRED` response header as base64-encoded JSON with `x402Version: 2`, `resource` metadata, `accepts` array, and `extensions`
- **Payment Payload**: Sent in the `PAYMENT-SIGNATURE` request header as base64-encoded JSON with `x402Version: 2`, `resource`, `accepted` (payment requirements), and `payload` (signature + authorization)
- **Settlement Response**: Carried in the `PAYMENT-RESPONSE` response header with onchain transaction hash and network
- **Network identifiers**: CAIP-2 format (`eip155:8453` for Base mainnet)
- **Payment scheme**: `exact` (EIP-3009 `transferWithAuthorization` for USDC)

### v1 Backward Compatibility
`x402PayAndFetch` also supports x402 v1 servers:
- v1 uses `X-PAYMENT` / `X-PAYMENT-RESPONSE` headers and puts payment terms in the 402 body
- v1 uses `maxAmountRequired` instead of `amount` and human-readable network names (`base`, `base-sepolia`)

## Tech Stack
- **Runtime**: Deno (via Base44 backend functions)
- **Crypto**: viem for EIP-712 typed data signing
- **Facilitator**: Coinbase Developer Platform (CDP) x402 facilitator
- **Blockchain**: Base (Ethereum L2 by Coinbase)
- **Token**: USDC (Circle)

## License
MIT
