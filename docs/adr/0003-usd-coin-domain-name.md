# ADR-0003: Use "USD Coin" as EIP-712 Domain Name

**Status:** Accepted  
**Date:** 2026-07-02

## Context

USDC on Base mainnet (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913) uses "USD Coin" as its EIP-712 domain name, not "USDC". This was discovered after signature verification failures during testing.

## Decision

Set the EIP-712 domain name to "USD Coin" (version "2") for all USDC signature operations on Base mainnet. The seller includes this in `extra.name`; the buyer reads it from the server's payment requirements.

## Consequences

- Signatures now match the contract's domain separator (verified: 0x02fa7265...)
- Must be overridden per-network — Sepolia testnet USDC may use a different name
- Documented in seller code with a comment explaining the mismatch
