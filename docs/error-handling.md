# Error Handling Reference

This document lists all error conditions the x402 agent can encounter and how they're handled.

## Client-Side Errors (x402PayAndFetch)

| Error | Cause | Handling |
|-------|-------|----------|
| `MISSING_URL` | No URL provided in request body | Returns 400 with error message |
| `WALLET_NOT_CONFIGURED` | `X402_WALLET_PRIVATE_KEY` env var missing | Returns 500 with setup instructions |
| `CDP_NOT_CONFIGURED` | CDP API credentials missing | Returns 500 with setup instructions |
| `NO_PAYMENT_REQUIRED` | Target URL doesn't return 402 | Returns 200 with `paid: false` |
| `UNSUPPORTED_VERSION` | Target uses unknown x402 version | Returns 200 with `paid: false` |
| `SIGNATURE_FAILED` | EIP-712 signing error | Returns 200 with `paid: false` and error |
| `VERIFY_FAILED` | Facilitator rejected the payment | Returns 200 with `paid: false` |
| `SETTLE_FAILED` | On-chain settlement failed | Returns 200 with `paid: false` and tx details |
| `INVALID_SIGNATURE` | Server rejected the payment header | Retries once, then returns `paid: false` |
| `NETWORK_ERROR` | Target URL unreachable | Returns 200 with `paid: false` and error |

## Server-Side Errors (x402SellPremiumJoke)

| Error | Cause | Handling |
|-------|-------|----------|
| `NO_PAYMENT_HEADER` | Request without payment on a 2nd attempt | Returns 402 again |
| `INVALID_PAYMENT` | Malformed payment payload | Returns 400 |
| `VERIFY_REJECTED` | Facilitator says signature invalid | Returns 402 with fresh requirements |
| `SETTLE_REJECTED` | Facilitator can't settle (e.g. insufficient balance) | Returns 402 with fresh requirements |
| `NONCE_ALREADY_USED` | Replayed payment | Returns 402 with fresh requirements |

## Facilitator Errors (CDP)

| Error | Cause | Handling |
|-------|-------|----------|
| `401 Unauthorized` | Invalid or expired CDP JWT | Agent should regenerate JWT |
| `403 Forbidden` | CDP key lacks permissions | Check CDP portal for correct key scopes |
| `429 Too Many Requests` | Rate limited | Exponential backoff recommended |
| `500 Internal Error` | CDP server issue | Retry with backoff |

## Environment Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `X402_WALLET_PRIVATE_KEY: NOT SET` | Env var not set | Copy `.env.example` to `.env` |
| `X402_WALLET_PRIVATE_KEY: INVALID FORMAT` | Not 0x + 64 hex chars | Regenerate with `npx viem generate-private-key` |
| `CDP_API_KEY_ID: NOT SET` | CDP key ID missing | Get from CDP Portal → API Keys |
| `CDP_API_KEY_SECRET: NOT SET` | CDP secret missing | Get from CDP Portal → API Keys |
