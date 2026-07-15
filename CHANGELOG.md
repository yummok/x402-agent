# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Changed
- Updated CHANGELOG to v1.3.0
- Updated Makefile with health, tx, help, and validate targets
- Updated ADR index to include ADR-0007

## [1.2.0] — 2026-07-15

### Added
- Getting-started quickstart guide (`docs/getting-started.md`)
- TypeScript configuration (`tsconfig.json`) for IDE support
- CLI wrapper script (`scripts/cli-fetch.ts`) with pretty output
- Example scripts: Python, Node.js, curl
- Integration tests with mocked CDP facilitator flow
- USDC atomic/decimal conversion tests
- Ethereum address and private key validation tests
- Nonce generation tests for uniqueness and format
- CONTRIBUTORS.md listing project contributors
- docker-compose.yml for local multi-service development
- Health check script for endpoint monitoring
- Transaction lookup helper linking to Basescan
- Pre-commit hook script for secret detection
- Environment variable validation script
- ADR-0005: Dashboard as backend function
- ADR-0006: Entity-triggered automation for data requests
- Examples section in README with language-specific quick links
- Stale bot config for auto-closing inactive issues/PRs
- .nvmrc specifying Node.js 20 LTS
- Makefile with validate, cli, and pre-commit targets
- Comprehensive API reference documentation
- Expanded SECURITY.md with private key handling and report timeline

## [1.1.0] — 2026-07-15

### Added
- MIT LICENSE file
- CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub issue templates and pull request template
- CHANGELOG.md following Keep a Changelog format
- Shared config module, TypeScript types, utility functions
- Unit tests for utils and config
- Dockerfile and .dockerignore
- Dependabot configuration
- `deno.jsonc` with task definitions
- Architecture Decision Records (ADRs 0001-0004)
- JSDoc comments on both main files
- 6 additional premium jokes
- README badges
- .editorconfig
- Makefile

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

### Verified
- End-to-end payment on Base mainnet (tx: `0xb2d9…34bd`)
- External API payment to Interzoid (tx: `0x85e0…52a9`)
- x402.org protected resource on Base Sepolia (tx: `0xb331…5a37`)
