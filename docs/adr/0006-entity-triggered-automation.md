# ADR-0006: Entity-Triggered Automation for Data Requests

**Status:** Accepted  
**Date:** 2026-07-02

## Context

The agent needs to automatically process requests for x402-gated data. When a user (or the agent itself) creates a record in the `X402DataRequest` entity, the agent should:
1. Read the URL and method from the record
2. Execute a payment via `x402PayAndFetch`
3. Store the result back in the entity

## Decision

Use a Base44 entity-triggered automation on the `X402DataRequest` entity for `create` events. When triggered, the agent receives the entity data and processes the payment.

## Consequences

- Payments are processed automatically when new data requests are created
- The agent handles the full lifecycle: read entity → pay → update entity with results
- No polling needed — the automation fires on creation
- Entity tracks the full state: pending → paid → completed/failed
