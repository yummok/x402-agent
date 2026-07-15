/**
 * Unit tests for nonce generation.
 * Run with: deno test --allow-read tests/nonce_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import { generateNonce } from "../src/utils.ts";

Deno.test("generateNonce returns a 0x-prefixed hex string", () => {
  const nonce = generateNonce();
  assert(nonce.startsWith("0x"));
  assertEquals(nonce.length, 66); // 0x + 64 hex chars
});

Deno.test("generateNonce produces unique values", () => {
  const nonces = new Set<string>();
  for (let i = 0; i < 100; i++) {
    nonces.add(generateNonce());
  }
  assertEquals(nonces.size, 100, "Nonces should be unique");
});

Deno.test("generateNonce contains only valid hex characters", () => {
  const nonce = generateNonce();
  const hexPart = nonce.slice(2);
  assert(/^[0-9a-fA-F]{64}$/.test(hexPart));
});
