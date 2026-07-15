# ADR-0007: Scheduled Daily x402 Data Purchase

**Status:** Accepted  
**Date:** 2026-07-02

## Context

The agent needs to demonstrate continuous, autonomous x402 payment capability — making real micropayments on a regular schedule to show the system is operational.

## Decision

Create a scheduled automation that runs daily at 9:00 AM (Europe/Rome timezone) and calls `x402PayAndFetch` against an external x402-gated API (Interzoid name matching).

## Consequences

- One USDC micropayment (0.01 USDC) is made daily on Base mainnet
- Each payment generates a real on-chain settlement transaction
- Results are logged in the `X402PaymentLog` entity
- Demonstrates continuous operation and builds payment history
- Monthly cost: ~0.30 USDC
