# Deployment Log — x402 Agent

## 2026-07-02 — Base Mainnet + Dashboard Live

### Status: Fully Operational ✅

**Live Dashboard:** https://superagent-42aeca08.base44.app/functions/x402Dashboard

---

### Network & Protocol

| Item | Value |
|------|-------|
| Network | Base mainnet (chainId 8453) |
| Protocol | x402 v2 |
| Facilitator | Coinbase Developer Platform (CDP) |
| USDC Contract | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| USDC EIP-712 Domain | `USD Coin` (version `2`) |
| Agent Wallet | `0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f` |
| Wallet Balance | ~1.48 USDC |

### Deployed Backend Functions

| Function | Endpoint | Description |
|----------|----------|-------------|
| `x402SellPremiumJoke` | `https://superagent-42aeca08.base44.app/functions/x402SellPremiumJoke` | Seller endpoint. Paywalled at 0.01 USDC. Returns 402 with payment terms in `PAYMENT-REQUIRED` header, verifies & settles via CDP facilitator, returns a joke on success. |
| `x402PayAndFetch` | `https://superagent-42aeca08.base44.app/functions/x402PayAndFetch` | Universal x402 buyer client. Takes any `{url, method}`, auto-detects 402, signs EIP-3009 `transferWithAuthorization`, retries with `PAYMENT-SIGNATURE` header, returns unlocked content + settlement tx. |
| `x402Dashboard` | `https://superagent-42aeca08.base44.app/functions/x402Dashboard` | Serves the hosted dashboard as HTML. Calls `x402PayAndFetch` directly via fetch for real onchain payments. |

### Entities

| Entity | Purpose |
|--------|---------|
| `X402PaymentLog` | Tracks all x402 payments (endpoint, amount, tx hash, response, status) |
| `X402DataRequest` | Queue of data requests — creating a record triggers the auto-pay automation |

### Automations

| Name | Type | Trigger | Cost |
|------|------|---------|------|
| Daily x402 Data Purchase | Scheduled | Every day at 9:00 AM (Rome) | 0.01 USDC/run |
| x402 Auto-Pay on Data Request | Entity trigger | `X402DataRequest` record created | 0.01 USDC/run |

### Verified Onchain Transactions

| # | Description | Tx Hash | Network |
|---|-------------|---------|---------|
| 1 | Self-payment (premium joke) | [`0xb2d9…34bd`](https://basescan.org/tx/0xb2d9f8feb82a38705fd73096b71692866d567b6ed5fff0d259685c6b1e2234bd) | Base mainnet |
| 2 | Interzoid API – Name Match | [`0x85e0…52a9`](https://basescan.org/tx/0x85e07f4938fabea8571d05011dbd9e124809aed23711f211a88a658b82e552a9) | Base mainnet |
| 3 | x402.org protected endpoint | [`0xb331…5a37`](https://sepolia.basescan.org/tx/0xb331f0c4509568c718370950323c1f43f18809ce7c44440f91cd7fc464c55a37) | Base Sepolia |

### Key Technical Decisions

1. **USDC EIP-712 domain name**: Must use `"USD Coin"` (not `"USDC"`) to match the contract's domain separator `0x02fa7265…`. Using the wrong name produces invalid signatures.
2. **CDP facilitator JWT auth**: Uses `generateJwt()` from `@coinbase/cdp-sdk` with `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET`.
3. **Demo payTo address**: `0x0000000000000000000000000000000000000402` — avoids `self_send_not_allowed` error when the agent pays its own endpoint.
4. **v2 wire format**: Payment requirements in `PAYMENT-REQUIRED` header (base64), payment in `PAYMENT-SIGNATURE` header, settlement in `PAYMENT-RESPONSE` header. Network uses CAIP-2 (`eip155:8453`).
5. **Gas sponsorship**: The CDP facilitator sponsors gas, so the agent wallet doesn't need ETH — only USDC for payments.

### Environment Variables

See [`.env.example`](.env.example):

| Variable | Description |
|----------|-------------|
| `X402_WALLET_PRIVATE_KEY` | Agent wallet private key (for signing EIP-3009 authorizations) |
| `CDP_API_KEY_ID` | Coinbase Developer Platform API key ID |
| `CDP_API_KEY_SECRET` | Coinbase Developer Platform API key secret |

### Migration History

- **Base Sepolia → Base mainnet**: Migrated from x402 v1 (x402.org facilitator) to x402 v2 (CDP facilitator). Updated wire format, headers, CAIP-2 network identifiers, and EIP-712 domain name.

### GitHub

- Repository: https://github.com/yummok/x402-agent
- Branch: `main`
- Commits: 7
