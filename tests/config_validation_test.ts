/**
 * Tests for config module — validates contract addresses and network constants.
 * Run with: deno test --allow-read tests/config_validation_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import {
  USDC_MAINNET,
  USDC_SEPOLIA,
  BASE_MAINNET_CAIP2,
  BASE_SEPOLIA_CAIP2,
  X402_VERSION,
  AGENT_WALLET,
  DEMO_PAYTO,
  USDC_DOMAIN_NAME,
  USDC_DOMAIN_VERSION,
} from "../src/config.ts";

Deno.test("USDC mainnet address is 42 chars (0x + 40 hex)", () => {
  assertEquals(USDC_MAINNET.length, 42);
  assert(/^0x[a-fA-F0-9]{40}$/.test(USDC_MAINNET));
});

Deno.test("USDC Sepolia address is 42 chars (0x + 40 hex)", () => {
  assertEquals(USDC_SEPOLIA.length, 42);
  assert(/^0x[a-fA-F0-9]{40}$/.test(USDC_SEPOLIA));
});

Deno.test("Mainnet and Sepolia USDC addresses differ", () => {
  assert(USDC_MAINNET !== USDC_SEPOLIA);
});

Deno.test("Base mainnet CAIP-2 uses chain ID 8453", () => {
  assertEquals(BASE_MAINNET_CAIP2, "eip155:8453");
});

Deno.test("Base Sepolia CAIP-2 uses chain ID 84532", () => {
  assertEquals(BASE_SEPOLIA_CAIP2, "eip155:84532");
});

Deno.test("x402 version is 2", () => {
  assertEquals(X402_VERSION, 2);
});

Deno.test("Agent wallet is a valid address", () => {
  assertEquals(AGENT_WALLET.length, 42);
  assert(/^0x[a-fA-F0-9]{40}$/.test(AGENT_WALLET));
});

Deno.test("Demo payTo is the 0x...0402 address", () => {
  assertEquals(DEMO_PAYTO, "0x0000000000000000000000000000000000000402");
});

Deno.test("USDC domain name is 'USD Coin'", () => {
  assertEquals(USDC_DOMAIN_NAME, "USD Coin");
  assert(USDC_DOMAIN_NAME !== "USDC");
});

Deno.test("USDC domain version is '2'", () => {
  assertEquals(USDC_DOMAIN_VERSION, "2");
});
