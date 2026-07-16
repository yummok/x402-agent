/**
 * Simple token-bucket rate limiter for x402 payment requests.
 *
 * Prevents the agent from making too many paid requests in a short window,
 * which would drain the wallet. Defaults to 10 requests per minute.
 */

interface RateLimiterOptions {
  /** Maximum requests allowed in the window. Default: 10 */
  maxRequests?: number;
  /** Window size in milliseconds. Default: 60000 (1 minute) */
  windowMs?: number;
}

interface RateLimiterEntry {
  count: number;
  resetAt: number;
}

/**
 * Creates a rate limiter keyed by URL.
 *
 * @example
 * ```ts
 * const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
 * if (limiter.check("https://api.example.com/data")) {
 *   // proceed with payment
 * } else {
 *   // rate limited — skip or wait
 * }
 * ```
 */
export function createRateLimiter(options: RateLimiterOptions = {}) {
  const maxRequests = options.maxRequests ?? 10;
  const windowMs = options.windowMs ?? 60_000;
  const buckets = new Map<string, RateLimiterEntry>();

  return {
    /**
     * Returns true if the request is allowed, false if rate-limited.
     * Increments the counter either way.
     */
    check(url: string): boolean {
      const now = Date.now();
      const entry = buckets.get(url);

      if (!entry || now >= entry.resetAt) {
        buckets.set(url, { count: 1, resetAt: now + windowMs });
        return true;
      }

      if (entry.count < maxRequests) {
        entry.count++;
        return true;
      }

      return false;
    },

    /**
     * Returns remaining requests for a URL in the current window.
     */
    remaining(url: string): number {
      const now = Date.now();
      const entry = buckets.get(url);
      if (!entry || now >= entry.resetAt) return maxRequests;
      return Math.max(0, maxRequests - entry.count);
    },

    /**
     * Returns milliseconds until the rate limit resets for a URL.
     */
    resetInMs(url: string): number {
      const now = Date.now();
      const entry = buckets.get(url);
      if (!entry || now >= entry.resetAt) return 0;
      return entry.resetAt - now;
    },

    /**
     * Clears all rate limit entries.
     */
    reset(): void {
      buckets.clear();
    },

    /** Returns the max requests per window. */
    get max(): number {
      return maxRequests;
    },

    /** Returns the window size in ms. */
    get window(): number {
      return windowMs;
    },
  };
}
