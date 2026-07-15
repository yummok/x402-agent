# ADR-0001: Use x402 v2 Protocol

**Status:** Accepted  
**Date:** 2026-07-02

## Context

The x402 protocol has two versions:
- v1: payment requirements in response body, `X-PAYMENT` / `X-PAYMENT-RESPONSE` headers
- v2: payment requirements in `PAYMENT-REQUIRED` header (base64), `PAYMENT-SIGNATURE` / `PAYMENT-RESPONSE` headers

The CDP facilitator on Base mainnet requires v2 format. The x402.org public facilitator (used for testnet) uses v1.

## Decision

Implement x402 v2 as the primary protocol for mainnet, with backward compatibility for v1 in the buyer client (x402PayAndFetch).

## Consequences

- Buyer client supports both v1 and v2 servers
- Seller endpoint only emits v2 format
- Header names differ between versions, requiring careful version detection
