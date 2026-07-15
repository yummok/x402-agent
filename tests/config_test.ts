/**
 * Unit tests for src/config.ts
 * Run with: deno test --allow-read tests/config_test.ts
 */
import { assertEquals } from "jsr:@std/assert";
import {
  BASE_MAINNET_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_ID,
  USDC_MAINNET,
  USDC_SEPOLIA,
  USDC_DOMAIN_NAME,
  USDC_DOMAIN_VERSION,
  BASE_MAINNET_CAIP2,
  BASE_SEPOLIA_CAIP2,
  CDP_FACILITATOR_URL,
  CDP_VERIFY_ENDPOINT,
  CDP_SETTLE_ENDPOINT,
  DEMO_PAYTO,
  DEFAULT_PAYMENT_AMOUNT_USDC,
  X402_VERSION,
} from "../src/config.ts";

Deno.test("BASE_MAINNET_CHAIN_ID is 8453", () => {
  assertEquals(BASE_MAINNET_CHAIN_ID, 8453);
});

Deno.test("BASE_SEPOLIA_CHAIN_ID is 84532", () => {
  assertEquals(BASE_SEPOLIA_CHAIN_ID, 84532);
});

Deno.test("USDC_MAINNET is the correct contract address", () => {
  assertEquals(USDC_MAINNET.toLowerCase(), "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");
});

Deno.test("USDC_SEPOLIA is the correct contract address", () => {
  assertEquals(USDC_SEPOLIA.toLowerCase(), "0x036cbd53842c5426634e7929541ec2318f3dcf7e");
});

Deno.test("USDC_DOMAIN_NAME is 'USD Coin'", () => {
  assertEquals(USDC_DOMAIN_NAME, "USD Coin");
});

Deno.test("USDC_DOMAIN_VERSION is '2'", () => {
  assertEquals(USDC_DOMAIN_VERSION, "2");
});

Deno.test("BASE_MAINNET_CAIP2 is eip155:8453", () => {
  assertEquals(BASE_MAINNET_CAIP2, "eip155:8453");
});

Deno.test("CDP_VERIFY_ENDPOINT ends with /verify", () => {
  assertEquals(CDP_VERIFY_ENDPOINT.endsWith("/verify"), true);
});

Deno.test("CDP_SETTLE_ENDPOINT ends with /settle", () => {
  assertEquals(CDP_SETTLE_ENDPOINT.endsWith("/settle"), true);
});

Deno.test("DEMO_PAYTO ends with 0402", () => {
  assertEquals(DEMO_PAYTO.endsWith("0402"), true);
});

Deno.test("DEFAULT_PAYMENT_AMOUNT_USDC is 0.01", () => {
  assertEquals(DEFAULT_PAYMENT_AMOUNT_USDC, "0.01");
});

Deno.test("X402_VERSION is 2", () => {
  assertEquals(X402_VERSION, 2);
});
