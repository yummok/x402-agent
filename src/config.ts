/**
 * Shared configuration constants for the x402 agent.
 *
 * These values define the network, contracts, and protocol parameters
 * used across all x402 payment functions.
 */

/** Base mainnet chain ID */
export const BASE_MAINNET_CHAIN_ID = 8453;

/** Base Sepolia testnet chain ID */
export const BASE_SEPOLIA_CHAIN_ID = 84532;

/** USDC contract address on Base mainnet */
export const USDC_MAINNET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

/** USDC contract address on Base Sepolia */
export const USDC_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

/** EIP-712 domain name for USDC on Base mainnet (must be "USD Coin", not "USDC") */
export const USDC_DOMAIN_NAME = "USD Coin" as const;

/** EIP-712 domain version for USDC */
export const USDC_DOMAIN_VERSION = "2" as const;

/** CAIP-2 network identifier for Base mainnet */
export const BASE_MAINNET_CAIP2 = "eip155:8453" as const;

/** CAIP-2 network identifier for Base Sepolia */
export const BASE_SEPOLIA_CAIP2 = "eip155:84532" as const;

/** CDP facilitator base URL */
export const CDP_FACILITATOR_URL = "https://api.cdp.coinbase.com/platform/v2/x402" as const;

/** CDP facilitator verify endpoint */
export const CDP_VERIFY_ENDPOINT = `${CDP_FACILITATOR_URL}/verify` as const;

/** CDP facilitator settle endpoint */
export const CDP_SETTLE_ENDPOINT = `${CDP_FACILITATOR_URL}/settle` as const;

/** Demo payTo address used in the seller endpoint (avoids self_send_not_allowed) */
export const DEMO_PAYTO = "0x0000000000000000000000000000000000000402" as const;

/** Default payment amount in USDC for the seller endpoint */
export const DEFAULT_PAYMENT_AMOUNT_USDC = "0.01" as const;

/** x402 protocol version */
export const X402_VERSION = 2 as const;
