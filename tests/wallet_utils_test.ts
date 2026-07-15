/**
 * Tests for wallet utility functions.
 * Run with: deno test --allow-read tests/wallet_utils_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import { shortAddress } from "../src/wallet-utils.ts";

Deno.test("shortAddress truncates long addresses correctly", () => {
  const result = shortAddress("0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f");
  assertEquals(result, "0x5F3b...4c6f");
});

Deno.test("shortAddress returns short addresses unchanged", () => {
  const result = shortAddress("0x1234");
  assertEquals(result, "0x1234");
});

Deno.test("shortAddress handles empty string", () => {
  const result = shortAddress("");
  assertEquals(result, "");
});

Deno.test("shortAddress handles minimum truncatable length", () => {
  const addr = "0x1234567890ab";
  const result = shortAddress(addr);
  assertEquals(result, "0x1234...0ab");
});

Deno.test("shortAddress preserves 0x prefix", () => {
  const result = shortAddress("0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f");
  assert(result.startsWith("0x"));
});
