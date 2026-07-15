/**
 * Unit tests for Ethereum address validation.
 * Run with: deno test --allow-read tests/address_validation_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import { isValidAddress, isValidPrivateKey } from "../src/utils.ts";

Deno.test("isValidAddress accepts valid checksummed address", () => {
  assertEquals(isValidAddress("0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f"), true);
});

Deno.test("isValidAddress accepts valid lowercase address", () => {
  assertEquals(isValidAddress("0x5f3b6a74f61ed68b14844af8b72c2d78bad24c6f"), true);
});

Deno.test("isValidAddress accepts valid uppercase address", () => {
  assertEquals(isValidAddress("0x5F3B6A74F61ED68B14844AF8B72C2D78BAD24C6F"), true);
});

Deno.test("isValidAddress rejects address without 0x prefix", () => {
  assertEquals(isValidAddress("5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f"), false);
});

Deno.test("isValidAddress rejects too-short address", () => {
  assertEquals(isValidAddress("0x1234"), false);
});

Deno.test("isValidAddress rejects empty string", () => {
  assertEquals(isValidAddress(""), false);
});

Deno.test("isValidAddress rejects address with non-hex chars", () => {
  assertEquals(isValidAddress("0xZZ3b6a74f61ED68B14844af8b72C2D78bAD24c6f"), false);
});

Deno.test("isValidPrivateKey accepts valid 64-char hex key", () => {
  assertEquals(isValidPrivateKey("0x" + "a".repeat(64)), true);
});

Deno.test("isValidPrivateKey rejects key without 0x prefix", () => {
  assertEquals(isValidPrivateKey("a".repeat(64)), false);
});

Deno.test("isValidPrivateKey rejects too-short key", () => {
  assertEquals(isValidPrivateKey("0x1234"), false);
});

Deno.test("isValidPrivateKey rejects empty string", () => {
  assertEquals(isValidPrivateKey(""), false);
});
