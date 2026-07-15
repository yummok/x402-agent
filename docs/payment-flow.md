# x402 Payment Flow

This document describes the full end-to-end payment flow for both the buyer and seller sides.

## Seller Flow (x402SellPremiumJoke)

```
Client                    Seller                   CDP Facilitator         USDC Contract
  │                         │                          │                       │
  │── GET /joke ───────────▶│                          │                       │
  │                         │ (no payment header)      │                       │
  │◀── 402 + PAYMENT-REQ ───│                          │                       │
  │                         │                          │                       │
  │ (decode requirements)   │                          │                       │
  │ (sign EIP-3009)         │                          │                       │
  │                         │                          │                       │
  │── GET /joke ───────────▶│                          │                       │
  │   + PAYMENT-SIGNATURE    │                          │                       │
  │                         │── POST /verify ─────────▶│                       │
  │                         │◀── verified: true ────────│                       │
  │                         │                          │                       │
  │                         │── POST /settle ──────────▶│── transferWithAuth() ─▶│
  │                         │◀── settled: txHash ───────│◀── Transfer event ────│
  │                         │                          │                       │
  │◀── 200 + joke ──────────│                          │                       │
  │   + PAYMENT-RESPONSE     │                          │                       │
```

## Buyer Flow (x402PayAndFetch)

```
Agent                     Target URL               CDP Facilitator         USDC Contract
  │                         │                          │                       │
  │── GET /resource ───────▶│                          │                       │
  │◀── 402 + PAYMENT-REQ ───│                          │                       │
  │                         │                          │                       │
  │ (decode requirements)                               │                       │
  │ (generate nonce)                                   │                       │
  │ (sign EIP-3009 transferWithAuthorization)           │                       │
  │ (encode payment payload to base64)                 │                       │
  │                         │                          │                       │
  │── GET /resource ───────▶│                          │                       │
  │   + PAYMENT-SIGNATURE    │                          │                       │
  │                         │── POST /verify ─────────▶│                       │
  │                         │◀── verified: true ────────│                       │
  │                         │── POST /settle ──────────▶│── transferWithAuth() ─▶│
  │                         │◀── settled: txHash ───────│◀── Transfer event ────│
  │                         │                          │                       │
  │◀── 200 + content ───────│                          │                       │
  │   + PAYMENT-RESPONSE     │                          │                       │
```

## Key Steps

1. **402 Detection**: The client sends a request without payment. The server responds with HTTP 402 and payment requirements in a header.

2. **Signature**: The client decodes the requirements and signs an EIP-3009 `transferWithAuthorization` message using the USDC EIP-712 domain (name: "USD Coin", version: "2").

3. **Retry with Payment**: The client retries the original request with the `PAYMENT-SIGNATURE` header containing the base64-encoded payment payload.

4. **Verification**: The server (or facilitator) verifies the signature is valid and the nonce hasn't been used.

5. **Settlement**: The facilitator calls `transferWithAuthorization` on the USDC contract, moving USDC from payer to payee. Gas is sponsored by the facilitator.

6. **Response**: The server returns the protected content with the `PAYMENT-RESPONSE` header containing the settlement transaction hash.
