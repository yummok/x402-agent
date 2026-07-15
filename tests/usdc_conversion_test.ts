/**
 * Unit tests for USDC atomic <-> decimal conversion utilities.
 * Run with: deno test --allow-read tests/usdc_conversion_test.ts
 */
import { assertEquals } from "jsr:@std/assert";
import { usdcToAtomic, atomicToUsdc } from "../src/utils.ts";

Deno.test("usdcToAtomic converts 0.01 USDC to 10000 atomic units", () => {
  assertEquals(usdcToAtomic("0.01"), "10000");
});

Deno.test("usdcToAtomic converts 1.0 USDC to 1000000 atomic units", () => {
  assertEquals(usdcToAtomic("1.0"), "1000000");
});

Deno.test("usdcToAtomic converts 0.001 USDC to 1000 atomic units", () => {
  assertEquals(usdcToAtomic("0.001"), "1000");
});

Deno.test("usdcToAtomic handles large amounts", () => {
  assertEquals(usdcToAtomic("1000"), "1000000000");
});

Deno.test("atomicToUsdc converts 10000 atomic to 0.01 USDC", () => {
  assertEquals(atomicToUsdc("10000"), "0.01");
});

Deno.test("atomicToUsdc converts 1000000 atomic to 1.0 USDC", () => {
  assertEquals(atomicToUsdc("1000000"), "1");
});

Deno.test("atomicToUsdc converts 1000000000 atomic to 1000 USDC", () => {
  assertEquals(atomicToUsdc("1000000000"), "1000");
});

Deno.test("Round-trip: usdcToAtomic then atomicToUsdc preserves value", () => {
  const original = "0.01";
  const atomic = usdcToAtomic(original);
  const back = atomicToUsdc(atomic);
  assertEquals(parseFloat(back), parseFloat(original));
});
