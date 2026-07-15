# ADR-0004: Use Demo payTo Address

**Status:** Accepted  
**Date:** 2026-07-02

## Context

When the agent's wallet pays its own seller endpoint, the CDP facilitator rejects the transaction with `self_send_not_allowed`. This happens when the payer and payee are the same address.

## Decision

Use a demo payTo address (0x0000000000000000000000000000000000000402) in the seller endpoint. This is a burn-like address that will never be used for real payments.

## Consequences

- Self-payments work without errors
- The demo address should never receive real funds
- In production, the payTo would be the actual resource owner's address
