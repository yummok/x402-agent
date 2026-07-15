/**
 * Tests for x402 payment header utilities.
 * Run with: deno test --allow-read tests/header_utils_test.ts
 */
import { assertEquals, assert, assertThrows } from "jsr:@std/assert";
import {
  encodePaymentRequirements,
  decodePaymentRequirementsHeader,
  encodePaymentPayload,
  decodePaymentResponseHeader,
  detectX402Version,
  getPaymentRequirementsHeader,
  getPaymentResponseHeader,
} from "../src/header-utils.ts";

Deno.test("encodePaymentRequirements produces valid base64", () => {
  const req = { x402Version: 2, amount: "10000" };
  const encoded = encodePaymentRequirements(req);
  const decoded = JSON.parse(atob(encoded));
  assertEquals(decoded.x402Version, 2);
  assertEquals(decoded.amount, "10000");
});

Deno.test("decodePaymentRequirementsHeader round-trips correctly", () => {
  const original = { x402Version: 2, amount: "10000", network: "eip155:8453" };
  const encoded = encodePaymentRequirements(original);
  const decoded = decodePaymentRequirementsHeader(encoded);
  assertEquals(decoded.x402Version, 2);
  assertEquals(decoded.amount, "10000");
  assertEquals(decoded.network, "eip155:8453");
});

Deno.test("decodePaymentRequirementsHeader throws on invalid base64", () => {
  assertThrows(() => decodePaymentRequirementsHeader("!!!invalid!!!"));
});

Deno.test("encodePaymentPayload produces valid base64", () => {
  const payload = { signature: "0xdeadbeef", x402Version: 2 };
  const encoded = encodePaymentPayload(payload);
  const decoded = JSON.parse(atob(encoded));
  assertEquals(decoded.signature, "0xdeadbeef");
});

Deno.test("decodePaymentResponseHeader round-trips correctly", () => {
  const original = { paid: true, txHash: "0x1234" };
  const encoded = encodePaymentPayload(original);
  const decoded = decodePaymentResponseHeader(encoded);
  assertEquals(decoded.paid, true);
  assertEquals(decoded.txHash, "0x1234");
});

Deno.test("detectX402Version returns 2 for PAYMENT-REQUIRED header", () => {
  const headers = new Headers({ "PAYMENT-REQUIRED": "abc123" });
  assertEquals(detectX402Version(headers), 2);
});

Deno.test("detectX402Version returns 1 for X-PAYMENT header", () => {
  const headers = new Headers({ "X-PAYMENT": "abc123" });
  assertEquals(detectX402Version(headers), 1);
});

Deno.test("detectX402Version returns 0 when no payment headers", () => {
  const headers = new Headers({ "Content-Type": "application/json" });
  assertEquals(detectX402Version(headers), 0);
});

Deno.test("getPaymentRequirementsHeader prefers v2 over v1", () => {
  const headers = new Headers({
    "PAYMENT-REQUIRED": "v2-data",
    "X-PAYMENT": "v1-data",
  });
  assertEquals(getPaymentRequirementsHeader(new Response(null, { headers })), "v2-data");
});

Deno.test("getPaymentResponseHeader falls back to v1", () => {
  const headers = new Headers({ "X-PAYMENT-RESPONSE": "v1-data" });
  assertEquals(getPaymentResponseHeader(new Response(null, { headers })), "v1-data");
});
