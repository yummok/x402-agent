/**
 * Tests for the payment amount parser.
 * Run with: deno test --allow-read tests/payment_parser_test.ts
 */
import { assertEquals, assert, assertThrows } from "jsr:@std/assert";
import {
  parseAmount,
  formatAmount,
  isValidAmount,
  compareAmounts,
  hasSufficientBalance,
} from "../src/payment-parser.ts";

Deno.test("parseAmount parses atomic string correctly", () => {
  assertEquals(parseAmount("10000"), 10_000n);
  assertEquals(parseAmount("0"), 0n);
  assertEquals(parseAmount("999999999"), 999_999_999n);
});

Deno.test("parseAmount handles human-readable USDC", () => {
  assertEquals(parseAmount("0.01", false), 10_000n);
  assertEquals(parseAmount("1.0", false), 1_000_000n);
  assertEquals(parseAmount("0.5", false), 500_000n);
});

Deno.test("parseAmount throws on invalid input", () => {
  assertThrows(() => parseAmount(""));
  assertThrows(() => parseAmount("abc"));
  assertThrows(() => parseAmount("-1", false));
  assertThrows(() => parseAmount("NaN", false));
});

Deno.test("formatAmount converts atomic to human-readable", () => {
  assertEquals(formatAmount(10_000n), "0.01");
  assertEquals(formatAmount(1_000_000n), "1");
  assertEquals(formatAmount(500_000n), "0.5");
  assertEquals(formatAmount(0n), "0");
  assertEquals(formatAmount(1n), "0.000001");
});

Deno.test("formatAmount strips trailing zeros", () => {
  assertEquals(formatAmount(100_000n), "0.1");
  assertEquals(formatAmount(10_000n), "0.01");
  assertEquals(formatAmount(1_000_000n), "1");
});

Deno.test("isValidAmount returns true for valid amounts", () => {
  assertEquals(isValidAmount("0.01"), true);
  assertEquals(isValidAmount("1.5"), true);
  assertEquals(isValidAmount("100"), true);
});

Deno.test("isValidAmount returns false for invalid amounts", () => {
  assertEquals(isValidAmount("0"), false);
  assertEquals(isValidAmount("-1"), false);
  assertEquals(isValidAmount("abc"), false);
  assertEquals(isValidAmount(""), false);
});

Deno.test("compareAmounts returns correct ordering", () => {
  assertEquals(compareAmounts(100n, 200n), -1);
  assertEquals(compareAmounts(200n, 100n), 1);
  assertEquals(compareAmounts(100n, 100n), 0);
});

Deno.test("hasSufficientBalance returns true when enough", () => {
  assertEquals(hasSufficientBalance(1_000_000n, 10_000n), true);
  assertEquals(hasSufficientBalance(10_000n, 10_000n), true);
});

Deno.test("hasSufficientBalance returns false when not enough", () => {
  assertEquals(hasSufficientBalance(5_000n, 10_000n), false);
  assertEquals(hasSufficientBalance(0n, 1n), false);
});
