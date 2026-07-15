/**
 * x402SellPremiumJoke — Demo x402 Seller Endpoint (Base Mainnet, x402 v2)
 *
 * A demo x402-gated resource: paying 0.01 USDC on Base mainnet unlocks a
 * premium AI joke. Uses the Coinbase Developer Platform (CDP) facilitator
 * with JWT authentication.
 *
 * Flow:
 *   No PAYMENT-SIGNATURE header  → 402 + PAYMENT-REQUIRED header (base64-encoded)
 *   Valid PAYMENT-SIGNATURE header → verifies & settles via CDP facilitator,
 *                                    returns 200 + joke + PAYMENT-RESPONSE header
 *
 * Required env vars:
 *   CDP_API_KEY_ID     — Coinbase Developer Platform API key ID
 *   CDP_API_KEY_SECRET — Coinbase Developer Platform API key secret
 *
 * @module x402SellPremiumJoke
 */

import { generateJwt } from "npm:@coinbase/cdp-sdk@1.51.2/auth";

/** CDP facilitator host */
const FACILITATOR_HOST = "api.cdp.coinbase.com";

/** USDC contract address on Base mainnet */
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

/** Demo receiving address (avoids self_send_not_allowed when agent pays itself) */
const RECEIVING_ADDRESS = "0x0000000000000000000000000000000000000402";

/** Public URL of this endpoint */
const RESOURCE_URL = "https://superagent-42aeca08.base44.app/functions/x402SellPremiumJoke";

/** Price in atomic units (0.01 USDC = 10000 with 6 decimals) */
const PRICE_ATOMIC = "10000";

/** Base mainnet in CAIP-2 format */
const NETWORK = "eip155:8453";

/**
 * IMPORTANT: USDC on Base mainnet uses "USD Coin" as the EIP-712 domain name
 * (not "USDC"). This must match the token contract's domain separator.
 * Verified: 0x02fa7265e7c5d81118673727957699e4d68f74cd74b7db77da710fe8a2c7834f
 */
const EIP712_NAME = "USD Coin";
const EIP712_VERSION = "2";

/** Collection of premium jokes returned on successful payment */
const JOKES = [
  "Why did the blockchain go to therapy? It had too many unresolved forks.",
  "How many Ethereum devs does it take to change a lightbulb? None — they just hard-fork the room.",
  "I tried to pay for coffee with USDC. The barista said they only accept... never mind, the facilitator handled it.",
  "Why did the smart contract break up with the oracle? It said the oracle was feeding it bad data.",
  "What is a smart contract's favorite type of music? Heavy meta-transaction.",
  "I asked the facilitator for gas money. It said: don't worry, I'll sponsor it."
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my computer I needed a break, and it froze.",
  "There are only 10 types of people: those who understand binary and those who don't.",
  "Why did the USDC cross the chain? To settle on the other side.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
];

/**
 * Build the x402 v2 payment requirements object.
 * @returns Payment requirements with scheme, network, amount, and EIP-712 metadata
 */
function paymentRequirementsV2() {
  return {
    scheme: "exact",
    network: NETWORK,
    amount: PRICE_ATOMIC,
    asset: USDC_BASE,
    payTo: RECEIVING_ADDRESS,
    maxTimeoutSeconds: 60,
    extra: { name: EIP712_NAME, version: EIP712_VERSION },
  };
}

/**
 * Build the full payment-required response object (x402 v2).
 * @param error - Error message explaining why payment is required
 * @returns Payment-required object with resource metadata and accepted schemes
 */
function paymentRequiredV2(error: string) {
  return {
    x402Version: 2,
    error,
    resource: {
      url: RESOURCE_URL,
      description: "Access to a premium AI-generated joke",
      mimeType: "application/json",
    },
    accepts: [paymentRequirementsV2()],
    extensions: {},
  };
}

/**
 * Base64-encode an object as JSON.
 * @param obj - Object to encode
 * @returns Base64 string
 */
function b64Encode(obj: unknown): string {
  return btoa(JSON.stringify(obj));
}

/**
 * Decode a base64-encoded JSON string.
 * @param str - Base64 string to decode
 * @returns Parsed object
 */
function b64Decode(str: string): any {
  return JSON.parse(atob(str));
}

/**
 * Create a 402 Payment Required response with the x402 v2 header.
 * @param error - Error message for the client
 * @returns HTTP 402 response with PAYMENT-REQUIRED header
 */
function paymentRequiredResponse(error: string) {
  const pr = paymentRequiredV2(error);
  return new Response(JSON.stringify({}), {
    status: 402,
    headers: {
      "Content-Type": "application/json",
      "PAYMENT-REQUIRED": b64Encode(pr),
    },
  });
}

/**
 * Call the CDP facilitator endpoint with JWT authentication.
 *
 * Generates a short-lived JWT using CDP API credentials and makes
 * a POST request to the specified facilitator path.
 *
 * @param path - API path (e.g. "/platform/v2/x402/verify")
 * @param body - Request body object
 * @returns Response status and parsed JSON
 */
async function cdpFacilitatorCall(path: string, body: unknown) {
  const keyId = Deno.env.get("CDP_API_KEY_ID");
  const keySecret = Deno.env.get("CDP_API_KEY_SECRET");
  if (!keyId || !keySecret) {
    throw new Error("CDP API credentials not configured");
  }

  const jwt = await generateJwt({
    apiKeyId: keyId,
    apiKeySecret: keySecret,
    requestMethod: "POST",
    requestHost: FACILITATOR_HOST,
    requestPath: path,
    expiresIn: 120,
  });

  const res = await fetch(`https://${FACILITATOR_HOST}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return { ok: res.ok, status: res.status, json };
}

/**
 * Main request handler — implements the x402 seller flow.
 *
 * 1. Checks for a PAYMENT-SIGNATURE header from the client
 * 2. If present, verifies the payment via CDP facilitator
 * 3. If valid, settles the payment onchain via CDP facilitator
 * 4. Returns a premium joke with the settlement response
 */
Deno.serve(async (req: Request) => {
  try {
    const paymentHeader =
      req.headers.get("PAYMENT-SIGNATURE") ||
      req.headers.get("Payment-Signature") ||
      req.headers.get("X-PAYMENT");

    // No payment header → return 402 with payment requirements
    if (!paymentHeader) {
      return paymentRequiredResponse("PAYMENT-SIGNATURE header is required");
    }

    // Decode the payment payload
    let paymentPayload;
    try {
      paymentPayload = b64Decode(paymentHeader);
    } catch {
      return paymentRequiredResponse("Malformed payment header");
    }

    const requirements = paymentRequirementsV2();
    const x402Ver = paymentPayload.x402Version || 2;

    const requestBody = {
      x402Version: x402Ver,
      paymentPayload,
      paymentRequirements: requirements,
    };

    // Step 1: Verify payment with CDP facilitator
    const verifyResult = await cdpFacilitatorCall("/platform/v2/x402/verify", requestBody);
    if (!verifyResult.ok) {
      return paymentRequiredResponse(`Facilitator verify failed: ${verifyResult.status}`);
    }
    if (!verifyResult.json.isValid) {
      return paymentRequiredResponse(verifyResult.json.invalidReason || "Payment verification failed");
    }

    // Step 2: Settle onchain via CDP facilitator
    const settleResult = await cdpFacilitatorCall("/platform/v2/x402/settle", requestBody);
    if (!settleResult.ok || !settleResult.json.success) {
      return paymentRequiredResponse(settleResult.json.errorMessage || settleResult.json.errorReason || "Payment settlement failed");
    }

    // Step 3: Return the premium content
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];

    return new Response(
      JSON.stringify({
        joke,
        paidWith: "USDC on Base",
        amountAtomic: PRICE_ATOMIC,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "PAYMENT-RESPONSE": b64Encode(settleResult.json),
        },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
