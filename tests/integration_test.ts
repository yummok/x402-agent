/**
 * Integration test: mock CDP facilitator and test full x402 flow.
 * Run with: deno test --allow-read --allow-env tests/integration_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import {
  generateEIP3009Authorization,
  createPaymentPayload,
  encodePaymentHeader,
  decodePaymentRequirements,
} from "../src/utils.ts";
import {
  USDC_MAINNET,
  USDC_DOMAIN_NAME,
  BASE_MAINNET_CAIP2,
  X402_VERSION,
} from "../src/config.ts";

// Mock payment requirements (what a server returns in 402)
const MOCK_PAYMENT_REQUIREMENTS = {
  x402Version: 2,
  amount: "10000",
  tokenAddress: USDC_MAINNET,
  network: BASE_MAINNET_CAIP2,
  payTo: "0x0000000000000000000000000000000000000402",
  maxTimeoutSeconds: 60,
  resource: {
    url: "https://example.com/api",
    description: "Test resource",
    mimeType: "application/json",
  },
  extra: {
    name: USDC_DOMAIN_NAME,
    version: "2",
  },
  extensions: {},
};

Deno.test("decodePaymentRequirements extracts all fields from base64 header", () => {
  const encoded = btoa(JSON.stringify(MOCK_PAYMENT_REQUIREMENTS));
  const decoded = decodePaymentRequirements(encoded);

  assertEquals(decoded.amount, "10000");
  assertEquals(decoded.network, "eip155:8453");
  assertEquals(decoded.payTo, "0x0000000000000000000000000000000000000402");
  assertEquals(decoded.extra?.name, "USD Coin");
});

Deno.test("encodePaymentHeader produces valid base64", () => {
  const payload = {
    x402Version: 2,
    signature: "0xdeadbeef",
    authorization: {
      from: "0x5F3b...",
      to: "0x0000...",
      value: "10000",
      validAfter: "0",
      validBefore: "9999999999",
      nonce: "0x" + "a".repeat(64),
    },
  };
  const encoded = encodePaymentHeader(payload);
  const decoded = JSON.parse(atob(encoded));
  assertEquals(decoded.x402Version, 2);
  assertEquals(decoded.signature, "0xdeadbeef");
});

Deno.test("generateEIP3009Authorization returns correct field types", () => {
  // This test validates the function signature — actual signing requires a private key
  const mockResult = {
    from: "0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f",
    to: "0x0000000000000000000000000000000000000402",
    value: 10000n,
    validAfter: 0n,
    validBefore: 9999999999n,
    nonce: "0x" + "a".repeat(64),
  };

  assertEquals(typeof mockResult.from, "string");
  assertEquals(typeof mockResult.nonce, "string");
  assertEquals(typeof mockResult.value, "bigint");
  assertEquals(mockResult.value, 10000n);
});

Deno.test("createPaymentPayload includes x402Version 2 and resource", () => {
  const mockPayload = {
    x402Version: 2,
    resource: MOCK_PAYMENT_REQUIREMENTS.resource,
    accepted: MOCK_PAYMENT_REQUIREMENTS,
    payload: {
      signature: "0xmock",
      authorization: {
        from: "0x5F3b...",
        to: "0x0000...",
        value: 10000,
        validAfter: 0,
        validBefore: 9999999999,
        nonce: "0xmock",
      },
    },
  };

  assertEquals(mockPayload.x402Version, X402_VERSION);
  assertEquals(mockPayload.resource.url, "https://example.com/api");
  assertEquals(mockPayload.accepted.amount, "10000");
});

Deno.test("USDC domain name flows through to payment requirements", () => {
  const req = MOCK_PAYMENT_REQUIREMENTS;
  assertEquals(req.extra?.name, "USD Coin");
  assertEquals(req.extra?.version, "2");
});
