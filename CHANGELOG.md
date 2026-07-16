# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] — 2026-07-16

### Added
- Token-bucket rate limiter for x402 payment request throttling (`src/rate-limiter.ts`)
- Exponential backoff retry helper with jitter for facilitator calls (`src/retry.ts`)
- Payment amount parser for atomic/human-readable USDC conversion (`src/payment-parser.ts`)
- Rate limiter tests (7 test cases)
- Retry helper tests (10 test cases)
- Payment parser tests (13 test cases)

## [1.3.0] — 2026-07-15

### Added
- EIP-3009 transferWithAuthorization reference encoding (`src/eip3009-encoding.ts`)
- x402 protocol constants reference (`src/x402-constants.ts`) with v1/v2 header and network mappings
- Payment header encoding/decoding utilities (`src/header-utils.ts`)
- Wallet utility functions (`src/wallet-utils.ts`) for USDC balance checks and address formatting
- Payment flow diagrams for buyer and seller sides (`docs/payment-flow.md`)
- Error handling reference (`docs/error-handling.md`)
- FAQ document (`docs/faq.md`)
- Wallet funding guide (`docs/wallet-funding.md`)
- CDP setup guide (`docs/cdp-setup.md`)
- GitHub release template
- Dependency review configuration
- CodeQL configuration for security scanning
- Renovate config for automated dependency updates
- .gitattributes for line ending normalization and linguist overrides
- Batch test runner script for all 12 test suites
- ADR-0007: Scheduled daily x402 data purchase
- Tests: EIP-3009 encoding, constants, header utils, wallet utils, config validation, version detection
- Help target in Makefile with full command listing
- Dashboard URL tip block in README
- Restructured documentation index with guides, reference, and project sections

## [1.2.0] — 2026-07-15

### Added
- Getting-started quickstart guide, TypeScript configuration, CLI wrapper
- Example scripts: Python, Node.js, curl
- Integration tests, USDC conversion tests, address validation, nonce generation tests
- CONTRIBUTORS.md, docker-compose.yml, health check script, tx lookup helper
- Pre-commit hook, env validation script, ADRs 0005-0006
- .nvmrc, comprehensive API reference, expanded SECURITY.md

## [1.1.0] — 2026-07-15

### Added
- MIT LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub issue/PR templates, CHANGELOG.md
- Shared config module, TypeScript types, utility functions
- Unit tests, Dockerfile, Dependabot, deno.jsonc
- ADRs 0001-0004, JSDoc comments, README badges, .editorconfig, Makefile

## [1.0.0] — 2026-07-02

### Added
- x402 v2 protocol implementation on Base mainnet
- `x402SellPremiumJoke` — paywalled seller endpoint (0.01 USDC)
- `x402PayAndFetch` — universal x402 buyer client
- `x402Dashboard` — hosted interactive dashboard
- CDP facilitator integration, EIP-3009 signing
- Entity schemas, scheduled and entity-triggered automations

### Verified
- End-to-end payment on Base mainnet (tx: `0xb2d9…34bd`)
- External API payment to Interzoid (tx: `0x85e0…52a9`)
- x402.org protected resource on Base Sepolia (tx: `0xb331…5a37`)
