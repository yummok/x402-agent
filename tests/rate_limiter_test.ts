/**
 * Tests for the token-bucket rate limiter.
 * Run with: deno test --allow-read tests/rate_limiter_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import { createRateLimiter } from "../src/rate-limiter.ts";

Deno.test("allows requests up to maxRequests", () => {
  const limiter = createRateLimiter({ maxRequests: 3, windowMs: 60_000 });
  assertEquals(limiter.check("https://example.com"), true);
  assertEquals(limiter.check("https://example.com"), true);
  assertEquals(limiter.check("https://example.com"), true);
  assertEquals(limiter.check("https://example.com"), false);
});

Deno.test("tracks different URLs independently", () => {
  const limiter = createRateLimiter({ maxRequests: 2, windowMs: 60_000 });
  assertEquals(limiter.check("https://a.com"), true);
  assertEquals(limiter.check("https://a.com"), true);
  assertEquals(limiter.check("https://a.com"), false);
  // Different URL has its own bucket
  assertEquals(limiter.check("https://b.com"), true);
});

Deno.test("remaining returns correct count", () => {
  const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
  assertEquals(limiter.remaining("https://example.com"), 5);
  limiter.check("https://example.com");
  assertEquals(limiter.remaining("https://example.com"), 4);
  limiter.check("https://example.com");
  assertEquals(limiter.remaining("https://example.com"), 3);
});

Deno.test("resetInMs returns 0 for unknown URL", () => {
  const limiter = createRateLimiter();
  assertEquals(limiter.resetInMs("https://unknown.com"), 0);
});

Deno.test("reset clears all entries", () => {
  const limiter = createRateLimiter({ maxRequests: 1, windowMs: 60_000 });
  limiter.check("https://example.com");
  assertEquals(limiter.check("https://example.com"), false);
  limiter.reset();
  assertEquals(limiter.check("https://example.com"), true);
});

Deno.test("max and window getters return configured values", () => {
  const limiter = createRateLimiter({ maxRequests: 7, windowMs: 30_000 });
  assertEquals(limiter.max, 7);
  assertEquals(limiter.window, 30_000);
});

Deno.test("uses defaults when no options provided", () => {
  const limiter = createRateLimiter();
  assertEquals(limiter.max, 10);
  assertEquals(limiter.window, 60_000);
});
