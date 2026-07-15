/**
 * Utility functions shared across x402 payment functions.
 */

/** USDC uses 6 decimals */
export const USDC_DECIMALS = 6;

/**
 * Convert USDC amount to atomic units (bigint).
 * @param usdc - Amount in USDC (e.g. "0.01")
 * @returns Atomic units as bigint (e.g. 10000n for 0.01 USDC)
 */
export function usdcToAtomic(usdc: string): bigint {
  const [whole, decimal = ""] = usdc.split(".");
  const paddedDecimal = decimal.padEnd(USDC_DECIMALS, "0").slice(0, USDC_DECIMALS);
  return BigInt(whole + paddedDecimal);
}

/**
 * Convert atomic units to USDC display string.
 * @param atomic - Amount in atomic units
 * @returns Human-readable USDC string (e.g. "0.01")
 */
export function atomicToUsdc(atomic: bigint): string {
  const str = atomic.toString().padStart(USDC_DECIMALS + 1, "0");
  const intPart = str.slice(0, -USDC_DECIMALS);
  const decPart = str.slice(-USDC_DECIMALS).replace(/0+$/, "");
  return decPart ? `${intPart}.${decPart}` : intPart;
}

/**
 * Generate a random hex nonce for EIP-3009 authorization.
 * @returns 32-byte hex string prefixed with 0x
 */
export function generateNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")}` as `0x${string}`;
}

/**
 * Get the current timestamp in seconds.
 * @returns Unix timestamp in seconds (bigint)
 */
export function getNowTimestamp(): bigint {
  return BigInt(Math.floor(Date.now() / 1000));
}

/**
 * Validate that a string is a valid Ethereum address.
 * @param addr - String to validate
 * @returns True if the string is a valid 0x-prefixed 40-char hex address
 */
export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

/**
 * Validate that a string is a valid private key.
 * @param key - String to validate
 * @returns True if the string is a valid 0x-prefixed 64-char hex key
 */
export function isValidPrivateKey(key: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(key);
}

/**
 * Truncate an address for display (e.g. 0x1234...5678).
 * @param addr - Full Ethereum address
 * @param prefixLength - Number of chars after 0x to show (default 4)
 * @returns Truncated address string
 */
export function truncateAddress(addr: string, prefixLength = 4): string {
  if (addr.length < prefixLength * 2 + 6) return addr;
  return `${addr.slice(0, prefixLength + 2)}...${addr.slice(-4)}`;
}

/**
 * Create a short summary of an API response body.
 * @param body - Response body string
 * @param maxLength - Maximum length of summary (default 200)
 * @returns Truncated summary
 */
export function summarizeResponse(body: string, maxLength = 200): string {
  const trimmed = body.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength) + "...";
}
