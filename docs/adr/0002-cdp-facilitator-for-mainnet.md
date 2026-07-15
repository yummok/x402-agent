# ADR-0002: Use CDP Facilitator for Mainnet

**Status:** Accepted  
**Date:** 2026-07-02

## Context

On Base mainnet, the x402.org public facilitator is not available. Coinbase Developer Platform (CDP) provides a production facilitator at api.cdp.coinbase.com.

## Decision

Use the CDP facilitator for all mainnet x402 operations. Authenticate with JWT generated via @coinbase/cdp-sdk using CDP_API_KEY_ID and CDP_API_KEY_SECRET.

## Consequences

- Requires CDP API credentials (free tier available)
- JWT tokens are short-lived (120s) and auto-generated per request
- Gas is sponsored by the facilitator — wallet only needs USDC, no ETH
