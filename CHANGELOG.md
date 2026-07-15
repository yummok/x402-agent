# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] — 2026-07-15

### Added
- Getting-started quickstart guide (`docs/getting-started.md`)
- TypeScript configuration (`tsconfig.json`) for IDE support
- CLI wrapper script (`scripts/cli-fetch.ts`) with pretty output
- Example scripts: Python (`examples/python_example.py`), Node.js (`examples/node_example.js`), curl (`examples/curl_examples.sh`)
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
- .editorconfig for consistent editor formatting
- .nvmrc specifying Node.js 20 LTS
- Makefile with validate, cli, and pre-commit targets
- GitHub repo topics script for discoverability
- Comprehensive API reference documentation
- Documentation index linking all project docs
- Expanded SECURITY.md with private key handling and report timeline

### Changed
- Improved .env.example with detailed comments and optional vars
- Updated CHANGELOG with all 1.2.0 additions
- Updated Makefile with new targets (validate, cli, pre-commit)
- Updated ADR index to include ADR-0005 and ADR-0006

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

### Verified
- End-to-end payment on Base mainnet (tx: `0xb2d9…34bd`)
- External API payment to Interzoid (tx: `0x85e0…52a9`)
- x402.org protected resource on Base Sepolia (tx: `0xb331…5a37`)
