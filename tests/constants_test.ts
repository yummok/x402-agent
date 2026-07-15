/**
 * Tests for x402 protocol constants.
 * Run with: deno test --allow-read tests/constants_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import {
  X402_VERSION_V1,
  X402_VERSION_V2,
  V2_HEADERS,
  V1_HEADERS,
  HTTP_402_PAYMENT_REQUIRED,
  NETWORKS,
  USDC_ADDRESSES,
  USDC_DOMAIN,
  CDP_FACILITATOR,
  LEGACY_FACILITATOR,
  USDC_DECIMALS,
  USDC_ATOMIC_PER_UNIT,
} from "../src/x402-constants.ts";

Deno.test("x402 versions are numeric", () => {
  assertEquals(X402_VERSION_V1, 1);
  assertEquals(X402_VERSION_V2, 2);
});

Deno.test("v2 headers differ from v1 headers", () => {
  assert(V2_HEADERS.PAYMENT_REQUIRED !== V1_HEADERS.X_PAYMENT);
  assert(V2_HEADERS.PAYMENT_RESPONSE !== V1_HEADERS.X_PAYMENT_RESPONSE);
});

Deno.test("HTTP 402 status code is correct", () => {
  assertEquals(HTTP_402_PAYMENT_REQUIRED, 402);
});

Deno.test("Base mainnet CAIP-2 identifier is correct", () => {
  assertEquals(NETWORKS.BASE_MAINNET, "eip155:8453");
});

Deno.test("Base Sepolia CAIP-2 identifier is correct", () => {
  assertEquals(NETWORKS.BASE_SEPOLIA, "eip155:84532");
});

Deno.test("USDC mainnet address is the known contract", () => {
  assertEquals(USDC_ADDRESSES.BASE_MAINNET.toLowerCase(), "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");
});

Deno.test("USDC domain name is 'USD Coin' not 'USDC'", () => {
  assertEquals(USDC_DOMAIN.NAME, "USD Coin");
  assert(USDC_DOMAIN.NAME !== "USDC");
});

Deno.test("USDC domain version is 2", () => {
  assertEquals(USDC_DOMAIN.VERSION, "2");
});

Deno.test("CDP facilitator URLs are HTTPS", () => {
  assert(CDP_FACILITATOR.BASE_URL.startsWith("https://"));
  assertEquals(CDP_FACILITATOR.VERIFY_PATH, "/platform/v2/x402/verify");
  assertEquals(CDP_FACILITATOR.SETTLE_PATH, "/platform/v2/x402/settle");
});

Deno.test("Legacy facilitator uses x402.org", () => {
  assertEquals(LEGACY_FACILITATOR.BASE_URL, "https://x402.org");
});

Deno.test("USDC has 6 decimals", () => {
  assertEquals(USDC_DECIMALS, 6);
  assertEquals(USDC_ATOMIC_PER_UNIT, 1_000_000);
});
