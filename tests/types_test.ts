/**
 * Type-level tests — verifies that interfaces compile correctly.
 * Run with: deno test --allow-read tests/types_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import type {
  Network,
  X402Version,
  Resource,
  PaymentRequirements,
  AuthorizationPayload,
  PaymentPayload,
  SettlementResponse,
  PayAndFetchResult,
} from "../src/types.ts";

Deno.test("Network type accepts valid CAIP-2 strings", () => {
  const mainnet: Network = "eip155:8453";
  const sepolia: Network = "eip155:84532";
  assertEquals(mainnet, "eip155:8453");
  assertEquals(sepolia, "eip155:84532");
});

Deno.test("Resource interface has required fields", () => {
  const resource: Resource = {
    url: "https://example.com/api",
    description: "Test resource",
    mimeType: "application/json",
  };
  assertEquals(resource.url, "https://example.com/api");
});

Deno.test("PaymentRequirements has all required fields", () => {
  const req: PaymentRequirements = {
    x402Version: 2,
    amount: "10000",
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    network: "eip155:8453",
    payTo: "0x0000000000000000000000000000000000000402",
    maxTimeoutSeconds: 60,
    resource: {
      url: "https://example.com",
      description: "Test",
      mimeType: "application/json",
    },
    extensions: {},
  };
  assertEquals(req.x402Version, 2);
});

Deno.test("AuthorizationPayload uses bigint for value and timestamps", () => {
  const auth: AuthorizationPayload = {
    from: "0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f",
    to: "0x0000000000000000000000000000000000000402",
    value: 10000n,
    validAfter: 0n,
    validBefore: 9999999999n,
    nonce: "0x" + "a".repeat(64),
  };
  assertEquals(typeof auth.value, "bigint");
});

Deno.test("SettlementResponse tracks paid status and tx hash", () => {
  const settlement: SettlementResponse = {
    paid: true,
    txHash: "0x1234",
    network: "eip155:8453",
  };
  assertEquals(settlement.paid, true);
});

Deno.test("PayAndFetchResult covers success and error cases", () => {
  const success: PayAndFetchResult = {
    success: true,
    status: 200,
    settlementTx: "0x1234",
    amountPaidUsdc: "0.01",
  };
  const error: PayAndFetchResult = {
    success: false,
    status: 500,
    error: "Wallet not configured",
  };
  assertEquals(success.success, true);
  assertEquals(error.success, false);
});
