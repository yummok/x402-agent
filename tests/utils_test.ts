/**
 * Unit tests for src/utils.ts
 * Run with: deno test --allow-read tests/utils_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import {
  usdcToAtomic,
  atomicToUsdc,
  generateNonce,
  isValidAddress,
  isValidPrivateKey,
  truncateAddress,
  summarizeResponse,
} from "../src/utils.ts";

Deno.test("usdcToAtomic converts 0.01 to 10000n", () => {
  assertEquals(usdcToAtomic("0.01"), 10000n);
});

Deno.test("usdcToAtomic converts 1.5 to 1500000n", () => {
  assertEquals(usdcToAtomic("1.5"), 1500000n);
});

Deno.test("usdcToAtomic converts 0 to 0n", () => {
  assertEquals(usdcToAtomic("0"), 0n);
});

Deno.test("atomicToUsdc converts 10000n to 0.01", () => {
  assertEquals(atomicToUsdc(10000n), "0.01");
});

Deno.test("atomicToUsdc converts 1500000n to 1.5", () => {
  assertEquals(atomicToUsdc(1500000n), "1.5");
});

Deno.test("usdcToAtomic and atomicToUsdc are inverse operations", () => {
  const original = "0.42";
  const atomic = usdcToAtomic(original);
  const result = atomicToUsdc(atomic);
  assertEquals(result, original);
});

Deno.test("generateNonce returns a 0x-prefixed 64-char hex string", () => {
  const nonce = generateNonce();
  assert(nonce.startsWith("0x"));
  assertEquals(nonce.length, 66); // 0x + 64 hex chars
  assert(/^0x[a-f0-9]{64}$/.test(nonce));
});

Deno.test("isValidAddress accepts a valid address", () => {
  assert(isValidAddress("0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f"));
});

Deno.test("isValidAddress rejects an invalid address", () => {
  assert(!isValidAddress("0x123"));
  assert(!isValidAddress("not an address"));
});

Deno.test("isValidPrivateKey accepts a valid private key", () => {
  assert(isValidPrivateKey("0x" + "a".repeat(64)));
});

Deno.test("isValidPrivateKey rejects an invalid key", () => {
  assert(!isValidPrivateKey("0x123"));
  assert(!isValidPrivateKey("short"));
});

Deno.test("truncateAddress truncates correctly", () => {
  const addr = "0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f";
  const truncated = truncateAddress(addr);
  assertEquals(truncated, "0x5F3b...4c6f");
});

Deno.test("summarizeResponse truncates long bodies", () => {
  const longBody = "x".repeat(300);
  const summary = summarizeResponse(longBody, 200);
  assert(summary.endsWith("..."));
  assertEquals(summary.length, 203); // 200 + "..."
});

Deno.test("summarizeResponse preserves short bodies", () => {
  const shortBody = '{"status":"ok"}';
  assertEquals(summarizeResponse(shortBody), shortBody);
});
