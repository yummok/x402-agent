/**
 * Tests for x402 version detection from HTTP headers.
 * Run with: deno test --allow-read tests/version_detection_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import { detectX402Version } from "../src/header-utils.ts";

Deno.test("detectX402Version returns 2 when PAYMENT-REQUIRED header present", () => {
  const headers = new Headers();
  headers.set("PAYMENT-REQUIRED", "eyJ4NDAyVmVyc2lvbiI6IDJ9");
  assertEquals(detectX402Version(headers), 2);
});

Deno.test("detectX402Version returns 1 when X-PAYMENT header present (v1)", () => {
  const headers = new Headers();
  headers.set("X-PAYMENT", "eyJ4NDAyVmVyc2lvbiI6IDF9");
  assertEquals(detectX402Version(headers), 1);
});

Deno.test("detectX402Version returns 0 when no payment headers present", () => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  assertEquals(detectX402Version(headers), 0);
});

Deno.test("detectX402Version prefers v2 when both headers present", () => {
  const headers = new Headers();
  headers.set("PAYMENT-REQUIRED", "v2-data");
  headers.set("X-PAYMENT", "v1-data");
  assertEquals(detectX402Version(headers), 2);
});

Deno.test("detectX402Version handles empty headers object", () => {
  const headers = new Headers();
  assertEquals(detectX402Version(headers), 0);
});

Deno.test("detectX402Version ignores unrelated headers", () => {
  const headers = new Headers();
  headers.set("Authorization", "Bearer token");
  headers.set("Cookie", "session=abc");
  headers.set("X-Forwarded-For", "1.2.3.4");
  assertEquals(detectX402Version(headers), 0);
});
