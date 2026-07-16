/**
 * Retry helper with exponential backoff for x402 facilitator calls.
 *
 * The CDP facilitator can occasionally return 429 (rate limited) or
 * 500 (internal error). This module provides a typed retry wrapper.
 */

export interface RetryOptions {
  /** Maximum number of attempts (including the first). Default: 3 */
  maxAttempts?: number;
  /** Base delay in ms. Default: 1000 */
  baseDelayMs?: number;
  /** Maximum delay between retries. Default: 10_000 */
  maxDelayMs?: number;
  /** Jitter factor (0-1). Default: 0.1 (±10%) */
  jitter?: number;
  /** Predicate to decide whether to retry. Default: retry on error */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Executes a function with exponential backoff retry.
 *
 * @example
 * ```ts
 * const result = await withRetry(async () => {
 *   const res = await fetch(url);
 *   if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *   return res.json();
 * }, { maxAttempts: 5 });
 * ```
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 10_000;
  const jitter = options.jitter ?? 0.1;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }

      // Exponential backoff: base * 2^(attempt-1)
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt - 1),
        maxDelayMs,
      );

      // Apply jitter
      const jitterMs = delay * jitter * (Math.random() * 2 - 1);
      const finalDelay = Math.max(0, Math.round(delay + jitterMs));

      await new Promise((resolve) => setTimeout(resolve, finalDelay));
    }
  }

  throw lastError;
}

/**
 * Predicate for retrying HTTP errors (429, 500, 502, 503, 504).
 */
export function shouldRetryHttpError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("429") ||
      msg.includes("500") ||
      msg.includes("502") ||
      msg.includes("503") ||
      msg.includes("504") ||
      msg.includes("rate limit") ||
      msg.includes("timeout") ||
      msg.includes("network")
    );
  }
  return true;
}
