/**
 * Tests for the exponential backoff retry helper.
 * Run with: deno test --allow-read tests/retry_test.ts
 */
import { assertEquals, assert, assertRejects } from "jsr:@std/assert";
import { withRetry, shouldRetryHttpError } from "../src/retry.ts";

Deno.test("withRetry returns result on first success", async () => {
  let calls = 0;
  const result = await withRetry(async () => {
    calls++;
    return "success";
  });
  assertEquals(result, "success");
  assertEquals(calls, 1);
});

Deno.test("withRetry retries on failure then succeeds", async () => {
  let calls = 0;
  const result = await withRetry(
    async () => {
      calls++;
      if (calls < 3) throw new Error("fail");
      return "success";
    },
    { maxAttempts: 5, baseDelayMs: 1 },
  );
  assertEquals(result, "success");
  assertEquals(calls, 3);
});

Deno.test("withRetry throws after max attempts", async () => {
  let calls = 0;
  await assertRejects(
    () =>
      withRetry(
        async () => {
          calls++;
          throw new Error("always fails");
        },
        { maxAttempts: 3, baseDelayMs: 1 },
      ),
    Error,
    "always fails",
  );
  assertEquals(calls, 3);
});

Deno.test("withRetry respects shouldRetry predicate", async () => {
  let calls = 0;
  await assertRejects(
    () =>
      withRetry(
        async () => {
          calls++;
          throw new Error("non-retryable");
        },
        {
          maxAttempts: 5,
          baseDelayMs: 1,
          shouldRetry: (error) => {
            if (error instanceof Error && error.message === "non-retryable") return false;
            return true;
          },
        },
      ),
  );
  // Should only be called once since shouldRetry returned false
  assertEquals(calls, 1);
});

Deno.test("shouldRetryHttpError returns true for 429", () => {
  assertEquals(shouldRetryHttpError(new Error("HTTP 429: Too Many Requests")), true);
});

Deno.test("shouldRetryHttpError returns true for 503", () => {
  assertEquals(shouldRetryHttpError(new Error("HTTP 503: Service Unavailable")), true);
});

Deno.test("shouldRetryHttpError returns true for timeout", () => {
  assertEquals(shouldRetryHttpError(new Error("Request timeout")), true);
});

Deno.test("shouldRetryHttpError returns true for network error", () => {
  assertEquals(shouldRetryHttpError(new Error("Network error: connection refused")), true);
});

Deno.test("shouldRetryHttpError returns true for unknown errors", () => {
  assertEquals(shouldRetryHttpError("something"), true);
});
