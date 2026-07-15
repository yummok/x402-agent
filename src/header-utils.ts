/**
 * Utilities for encoding and decoding x402 payment headers.
 *
 * x402 v2 uses base64-encoded JSON in HTTP headers.
 * This module provides typed helpers for encode/decode operations.
 */

/**
 * Encodes a payment requirements object as base64 for the PAYMENT-REQUIRED header.
 *
 * @param requirements - The payment requirements object
 * @returns Base64-encoded string suitable for the PAYMENT-REQUIRED header
 */
export function encodePaymentRequirements(requirements: object): string {
  return btoa(JSON.stringify(requirements));
}

/**
 * Decodes a base64-encoded payment requirements header.
 *
 * @param header - Base64-encoded string from the PAYMENT-REQUIRED header
 * @returns Parsed payment requirements object
 * @throws If the header is not valid base64 JSON
 */
export function decodePaymentRequirementsHeader<T = any>(header: string): T {
  try {
    return JSON.parse(atob(header)) as T;
  } catch {
    throw new Error(`Invalid payment requirements header: not valid base64 JSON`);
  }
}

/**
 * Encodes a payment payload as base64 for the PAYMENT-SIGNATURE header.
 *
 * @param payload - The payment payload (signature + authorization)
 * @returns Base64-encoded string suitable for the PAYMENT-SIGNATURE header
 */
export function encodePaymentPayload(payload: object): string {
  return btoa(JSON.stringify(payload));
}

/**
 * Decodes a base64-encoded payment response header.
 *
 * @param header - Base64-encoded string from the PAYMENT-RESPONSE header
 * @returns Parsed settlement response
 * @throws If the header is not valid base64 JSON
 */
export function decodePaymentResponseHeader<T = any>(header: string): T {
  try {
    return JSON.parse(atob(header)) as T;
  } catch {
    throw new Error(`Invalid payment response header: not valid base64 JSON`);
  }
}

/**
 * Detects x402 version from response headers.
 *
 * @param headers - Response headers object
 * @returns 2 for v2, 1 for v1, 0 if no payment headers found
 */
export function detectX402Version(headers: Headers): number {
  if (headers.get("PAYMENT-REQUIRED")) return 2;
  if (headers.get("X-PAYMENT")) return 1;
  return 0;
}

/**
 * Extracts the payment requirements header from a Response, regardless of version.
 *
 * @param response - The fetch Response object
 * @returns The raw header value, or null if not found
 */
export function getPaymentRequirementsHeader(response: Response): string | null {
  return response.headers.get("PAYMENT-REQUIRED") || response.headers.get("X-PAYMENT") || null;
}

/**
 * Extracts the payment response header from a Response, regardless of version.
 *
 * @param response - The fetch Response object
 * @returns The raw header value, or null if not found
 */
export function getPaymentResponseHeader(response: Response): string | null {
  return response.headers.get("PAYMENT-RESPONSE") || response.headers.get("X-PAYMENT-RESPONSE") || null;
}
