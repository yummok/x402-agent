# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-07-15

### Added
- MIT LICENSE file
- CONTRIBUTING.md with contribution guidelines
- Code of Conduct adapted from Contributor Covenant
- Security policy with vulnerability reporting guidelines
- GitHub issue templates for bugs and feature requests
- Pull request template
- CHANGELOG.md following Keep a Changelog format
- Shared config module (`src/config.ts`) with network and contract constants
- TypeScript type definitions (`src/types.ts`) for x402 protocol data structures
- Utility functions (`src/utils.ts`) for USDC conversion, address validation, and nonce generation
- Unit tests for utils and config (Deno test runner)
- Dockerfile and .dockerignore for container development
- Dependabot configuration for npm and GitHub Actions
- `deno.jsonc` with task definitions and formatting/lint config
- FUNDING.yml linking to x402 dashboard
- .editorconfig for consistent editor formatting
- Makefile with common dev commands
- Environment variable validation script
- Comprehensive API reference documentation
- Architecture Decision Records (ADRs) for key protocol decisions
- JSDoc comments and step-by-step documentation on both main files
- 6 additional premium jokes
- README badges (license, network, protocol, token, CI)
- Contributing section in README

### Changed
- Bumped version to 1.1.0
- Expanded .gitignore with coverage, Deno, and OS-specific entries
- Added test, fmt, lint, check scripts to package.json

## [1.0.0] — 2026-07-02

### Added
- x402 v2 protocol implementation on Base mainnet
- `x402SellPremiumJoke` — paywalled seller endpoint (0.01 USDC)
- `x402PayAndFetch` — universal x402 buyer client
- `x402Dashboard` — hosted interactive dashboard
- CDP facilitator integration for verify & settle
- EIP-3009 `transferWithAuthorization` signing
- Entity schemas: `X402PaymentLog`, `X402DataRequest`
- Scheduled automation: daily x402 data purchase
- Entity-triggered automation: auto-pay on new data requests
- Base Sepolia testnet support (legacy)
- MIT license

### Verified
- End-to-end payment on Base mainnet (tx: `0xb2d9…34bd`)
- External API payment to Interzoid (tx: `0x85e0…52a9`)
- x402.org protected resource on Base Sepolia (tx: `0xb331…5a37`)
