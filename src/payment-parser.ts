/**
 * Parses and validates x402 payment amounts.
 *
 * Payment requirements from the server can specify amounts in various
 * string formats. This module normalizes them to atomic units (bigint)
 * and human-readable USDC strings.
 */

import { USDC_DECIMALS } from "./x402-constants.ts";

/**
 * Parses a payment amount string from x402 requirements into atomic units.
 *
 * Handles formats like:
 * - "10000" (already atomic)
 * - "0.01" (human-readable USDC)
 * - "10000.0" (with decimal)
 *
 * @param amount - The amount string from payment requirements
 * @param isAtomic - Whether the input is already in atomic units (6 decimals)
 * @returns Amount in atomic units (bigint)
 */
export function parseAmount(amount: string, isAtomic: boolean = true): bigint {
  if (isAtomic) {
    // Already in atomic units — just parse as bigint
    const cleaned = amount.replace(/[^0-9]/g, "");
    if (!cleaned) throw new Error(`Invalid amount: "${amount}"`);
    return BigInt(cleaned);
  }

  // Human-readable USDC — convert to atomic
  const num = parseFloat(amount);
  if (isNaN(num) || num < 0) throw new Error(`Invalid amount: "${amount}"`);

  return BigInt(Math.round(num * Math.pow(10, USDC_DECIMALS)));
}

/**
 * Formats atomic units as a human-readable USDC string.
 *
 * @param atomic - Amount in atomic units (6 decimals)
 * @returns Human-readable string (e.g. "0.01")
 */
export function formatAmount(atomic: bigint): string {
  const divisor = BigInt(Math.pow(10, USDC_DECIMALS));
  const whole = atomic / divisor;
  const fraction = atomic % divisor;
  const fractionStr = fraction.toString().padStart(USDC_DECIMALS, "0").replace(/0+$/, "");
  return fractionStr ? `${whole}.${fractionStr}` : whole.toString();
}

/**
 * Validates that an amount string is a valid positive number.
 *
 * @param amount - Amount string to validate
 * @returns true if valid
 */
export function isValidAmount(amount: string): boolean {
  try {
    const parsed = parseFloat(amount);
    return !isNaN(parsed) && parsed > 0 && isFinite(parsed);
  } catch {
    return false;
  }
}

/**
 * Compares two amounts in atomic units.
 *
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareAmounts(a: bigint, b: bigint): -1 | 0 | 1 {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Checks if the wallet has enough balance for a payment.
 *
 * @param balanceAtomic - Wallet balance in atomic units
 * @param requiredAtomic - Required payment in atomic units
 * @returns true if sufficient
 */
export function hasSufficientBalance(balanceAtomic: bigint, requiredAtomic: bigint): boolean {
  return balanceAtomic >= requiredAtomic;
}
