// x402SellPremiumJoke — Base Mainnet, x402 v2
//
// A demo x402-gated resource: paying 0.01 USDC on Base mainnet unlocks a
// premium AI joke. Uses the Coinbase Developer Platform (CDP) facilitator
// with JWT authentication.
//
// No PAYMENT-SIGNATURE header  -> 402 + PAYMENT-REQUIRED header (base64-encoded)
// Valid PAYMENT-SIGNATURE header -> verifies & settles via CDP facilitator,
//                                   returns 200 + joke + PAYMENT-RESPONSE header
//
// Required env vars:
//   CDP_API_KEY_ID     — Coinbase Developer Platform API key ID
//   CDP_API_KEY_SECRET — Coinbase Developer Platform API key secret

import { generateJwt } from "npm:@coinbase/cdp-sdk@1.51.2/auth";

const FACILITATOR_HOST = "api.cdp.coinbase.com";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const RECEIVING_ADDRESS = "0x0000000000000000000000000000000000000402";
const RESOURCE_URL = "https://superagent-42aeca08.base44.app/functions/x402SellPremiumJoke";
const PRICE_ATOMIC = "10000"; // 0.01 USDC (6 decimals)
const NETWORK = "eip155:8453"; // Base mainnet (CAIP-2)

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I told my computer I needed a break, and it froze.",
  "There are only 10 types of people: those who understand binary and those who don't.",
  "Why did the USDC cross the chain? To settle on the other side.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
];

function paymentRequirementsV2() {
  return {
    scheme: "exact",
    network: NETWORK,
    amount: PRICE_ATOMIC,
    asset: USDC_BASE,
    payTo: RECEIVING_ADDRESS,
    maxTimeoutSeconds: 60,
    extra: { name: "USDC", version: "2" },
  };
}

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

function b64Encode(obj: unknown): string {
  return btoa(JSON.stringify(obj));
}

function b64Decode(str: string): any {
  return JSON.parse(atob(str));
}

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

Deno.serve(async (req: Request) => {
  try {
    const paymentHeader =
      req.headers.get("PAYMENT-SIGNATURE") ||
      req.headers.get("Payment-Signature") ||
      req.headers.get("X-PAYMENT");

    if (!paymentHeader) {
      return paymentRequiredResponse("PAYMENT-SIGNATURE header is required");
    }

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

    // Verify payment with CDP facilitator
    const verifyResult = await cdpFacilitatorCall("/platform/v2/x402/verify", requestBody);
    if (!verifyResult.ok) {
      return paymentRequiredResponse(`Facilitator verify failed: ${verifyResult.status}`);
    }
    if (!verifyResult.json.isValid) {
      return paymentRequiredResponse(verifyResult.json.invalidReason || "Payment verification failed");
    }

    // Settle onchain via CDP facilitator
    const settleResult = await cdpFacilitatorCall("/platform/v2/x402/settle", requestBody);
    if (!settleResult.ok || !settleResult.json.success) {
      return paymentRequiredResponse(settleResult.json.errorMessage || settleResult.json.errorReason || "Payment settlement failed");
    }

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
