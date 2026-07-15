# ADR-0005: Dashboard as Backend Function

**Status:** Accepted  
**Date:** 2026-07-02

## Context

The x402 agent needs an interactive dashboard for users to:
- View wallet balance and stats
- Submit x402 payment requests to any URL
- View payment history

Options considered:
1. A separate static site (e.g. GitHub Pages)
2. A separate Base44 app with pages and entities
3. A backend function that serves HTML directly

## Decision

Implement the dashboard as a Base44 backend function (`x402Dashboard`) that returns self-contained HTML.

## Consequences

- Single deployment target — no separate hosting
- Dashboard URL is predictable: `/functions/x402Dashboard`
- HTML is generated server-side, keeping it self-contained
- No build step or bundler needed
- Can call other backend functions (x402PayAndFetch) directly via relative URL
- No client-side routing — single page with tab switching via JS
