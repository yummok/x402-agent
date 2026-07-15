# API Reference

## x402SellPremiumJoke

**Endpoint:** `https://superagent-42aeca08.base44.app/functions/x402SellPremiumJoke`  
**Method:** Any (GET, POST)  
**Price:** 0.01 USDC on Base mainnet

### Request (no payment)

```bash
curl https://superagent-42aeca08.base44.app/functions/x402SellPremiumJoke
```

**Response:** `402 Payment Required`
- Header `PAYMENT-REQUIRED`: base64-encoded JSON with payment requirements
- Body: empty JSON object

### Request (with payment)

```bash
curl -H "PAYMENT-SIGNATURE: <base64-encoded-payment-payload>" \
  https://superagent-42aeca08.base44.app/functions/x402SellPremiumJoke
```

**Response:** `200 OK`
```json
{
  "joke": "Why do programmers prefer dark mode? Because light attracts bugs.",
  "paidWith": "USDC on Base",
  "amountAtomic": "10000"
}
```
- Header `PAYMENT-RESPONSE`: base64-encoded settlement details (tx hash, network)

---

## x402PayAndFetch

**Endpoint:** `https://superagent-42aeca08.base44.app/functions/x402PayAndFetch`  
**Method:** POST  

### Request

```json
{
  "url": "https://example.com/api/x402-gated-endpoint",
  "method": "GET"
}
```

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `url` | string | Yes | — | URL of the x402-gated resource to fetch |
| `method` | string | No | `"GET"` | HTTP method (GET, POST, etc.) |
| `body` | any | No | — | Request body for POST/PUT methods |

### Response

```json
{
  "paid": true,
  "status": 200,
  "x402Version": 2,
  "amountPaidAtomic": "10000",
  "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "network": "eip155:8453",
  "payTo": "0x...",
  "payer": "0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f",
  "settlement": { "txHash": "0x...", "network": "eip155:8453" },
  "body": { "data": "unlocked content" }
}
```

### Error Responses

| Status | Reason |
|--------|--------|
| 400 | Missing `url` parameter |
| 500 | Wallet not configured or internal error |
| 200 with `paid: false` | Resource didn't require payment or no compatible scheme |

---

## x402Dashboard

**Endpoint:** `https://superagent-42aeca08.base44.app/functions/x402Dashboard`  
**Method:** GET  

Returns a self-contained HTML dashboard for interactive x402 payments. No parameters needed.

---

## Entity Schemas

### X402PaymentLog

| Field | Type | Description |
|-------|------|-------------|
| endpoint | string | URL that was paid |
| amountPaidUsdc | string | Amount in USDC (e.g. "0.01") |
| amountPaidAtomic | string | Amount in atomic units |
| network | string | Network identifier |
| settlementTx | string | On-chain transaction hash |
| payee | string | Recipient address |
| responseSummary | string | Truncated API response |
| responseBody | string | Full API response body |
| status | string | Payment status |
| runSource | string | What triggered the payment |

### X402DataRequest

| Field | Type | Description |
|-------|------|-------------|
| url | string | URL to pay and fetch |
| method | string | HTTP method |
| status | string | Processing status |
| responseBody | string | API response |
| responseSummary | string | Truncated response |
| settlementTx | string | Transaction hash |
| amountPaidUsdc | string | Amount paid |
| network | string | Network used |
| payee | string | Recipient address |
| processedAt | string | Processing timestamp |
