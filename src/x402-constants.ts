/**
 * x402 Protocol Constants Reference
 *
 * This file documents the key constants and header names used by the x402
 * protocol v1 and v2, for quick reference and to detect version differences.
 */

// ── x402 Versions ──────────────────────────────────────────────

export const X402_VERSION_V1 = 1 as const;
export const X402_VERSION_V2 = 2 as const;

// ── HTTP Headers ───────────────────────────────────────────────

// v2 headers
export const V2_HEADERS = {
  PAYMENT_REQUIRED: "PAYMENT-REQUIRED",
  PAYMENT_SIGNATURE: "PAYMENT-SIGNATURE",
  PAYMENT_RESPONSE: "PAYMENT-RESPONSE",
} as const;

// v1 headers (legacy, Base Sepolia testnet)
export const V1_HEADERS = {
  X_PAYMENT: "X-PAYMENT",
  X_PAYMENT_RESPONSE: "X-PAYMENT-RESPONSE",
} as const;

// ── HTTP Status ────────────────────────────────────────────────

export const HTTP_402_PAYMENT_REQUIRED = 402 as const;

// ── Networks (CAIP-2) ──────────────────────────────────────────

export const NETWORKS = {
  BASE_MAINNET: "eip155:8453",
  BASE_SEPOLIA: "eip155:84532",
} as const;

// ── USDC Contract Addresses ────────────────────────────────────

export const USDC_ADDRESSES = {
  BASE_MAINNET: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  BASE_SEPOLIA: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
} as const;

// ── USDC EIP-712 Domain ────────────────────────────────────────

export const USDC_DOMAIN = {
  NAME: "USD Coin",
  VERSION: "2",
} as const;

// ── CDP Facilitator Endpoints ──────────────────────────────────

export const CDP_FACILITATOR = {
  BASE_URL: "https://api.cdp.coinbase.com",
  VERIFY_PATH: "/platform/v2/x402/verify",
  SETTLE_PATH: "/platform/v2/x402/settle",
} as const;

// ── Legacy Facilitator (Base Sepolia) ─────────────────────────

export const LEGACY_FACILITATOR = {
  BASE_URL: "https://x402.org",
  VERIFY_PATH: "/facilitator/verify",
  SETTLE_PATH: "/facilitator/settle",
} as const;

// ── USDC Decimals ──────────────────────────────────────────────

export const USDC_DECIMALS = 6 as const;
export const USDC_ATOMIC_PER_UNIT = 1_000_000 as const;
