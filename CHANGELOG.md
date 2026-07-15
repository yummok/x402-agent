# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI workflow with Deno lint, format check, and secret scanning
- Issue and PR templates
- Security policy and Code of Conduct
- Contributing guidelines

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
