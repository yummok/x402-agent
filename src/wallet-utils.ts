/**
 * Wallet utility functions for checking balances and wallet status.
 */

import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";
import { USDC_ADDRESSES, USDC_DECIMALS } from "./x402-constants.ts";

/**
 * Creates a viem public client for Base mainnet.
 */
export function createBaseClient() {
  return createPublicClient({
    chain: base,
    transport: http("https://mainnet.base.org"),
  });
}

/**
 * Reads the USDC balance of an address on Base mainnet.
 *
 * @param address - Wallet address
 * @returns USDC balance as a human-readable string (e.g. "1.5")
 */
export async function getUsdcBalance(address: `0x${string}`): Promise<string> {
  const client = createBaseClient();

  const balance = await client.readContract({
    address: USDC_ADDRESSES.BASE_MAINNET as `0x${string}`,
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const,
    functionName: "balanceOf",
    args: [address],
  });

  return formatUnits(balance as bigint, USDC_DECIMALS);
}

/**
 * Reads the ETH balance of an address on Base mainnet.
 * (Not needed for x402 — gas is sponsored — but useful for debugging.)
 *
 * @param address - Wallet address
 * @returns ETH balance in wei
 */
export async function getEthBalance(address: `0x${string}`): Promise<bigint> {
  const client = createBaseClient();
  const balance = await client.getBalance({ address });
  return balance;
}

/**
 * Formats an address for display (0x1234...5678).
 *
 * @param address - Full address
 * @returns Truncated address
 */
export function shortAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Checks if the wallet has sufficient USDC for a payment.
 *
 * @param address - Wallet address
 * @param requiredUsdc - Required amount in USDC (e.g. "0.01")
 * @returns true if balance is sufficient
 */
export async function hasSufficientUsdc(
  address: `0x${string}`,
  requiredUsdc: string,
): Promise<boolean> {
  const balance = await getUsdcBalance(address);
  return parseFloat(balance) >= parseFloat(requiredUsdc);
}
