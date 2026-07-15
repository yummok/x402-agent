/**
 * x402PayAndFetch — Universal x402 Buyer Client (Base Mainnet, x402 v2)
 *
 * Fetches a target URL. If the target responds with HTTP 402 (x402 protocol),
 * automatically signs a USDC "exact" payment authorization (EIP-3009,
 * gasless) with the agent's wallet and retries the request with proof of
 * payment attached. Supports both x402 v1 and v2 servers.
 *
 * Body params: { url: string, method?: string, body?: any }
 *
 * @module x402PayAndFetch
 */

import { privateKeyToAccount } from "npm:viem@2.54.1/accounts";

/** Default chain ID (Base mainnet) */
const DEFAULT_CHAIN_ID = 8453;

/** Networks the client prefers when selecting from payment options */
const PREFERRED_NETWORKS = ["eip155:8453", "base"];

/** Maps network identifiers to their chain IDs */
const NETWORK_CHAIN_IDS: Record<string, number> = {
  "eip155:8453": 8453,
  "eip155:84532": 84532,
  "base": 8453,
  "base-sepolia": 84532,
};

/**
 * Resolve a network identifier to a chain ID.
 * Falls back to Base mainnet if the network is unknown.
 * @param network - CAIP-2 identifier or network name (e.g. "eip155:8453", "base")
 * @returns Chain ID number
 */
function chainIdFromNetwork(network: string): number {
  if (NETWORK_CHAIN_IDS[network]) return NETWORK_CHAIN_IDS[network];
  if (network.startsWith("eip155:")) {
    const id = parseInt(network.split(":")[1], 10);
    if (!isNaN(id)) return id;
  }
  return DEFAULT_CHAIN_ID;
}

/**
 * Generate a random 32-byte nonce for EIP-3009 authorization.
 * @returns Hex-encoded nonce string prefixed with 0x
 */
function randomNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return ("0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as `0x${string}`;
}

/**
 * Safely parse JSON, returning the original string if parsing fails.
 * @param text - Text to parse
 * @returns Parsed JSON object or original string
 */
function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
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
 * @returns Parsed object or null on failure
 */
function b64Decode(str: string): unknown {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

/**
 * Main request handler — implements the x402 pay-and-fetch flow.
 *
 * 1. Makes an initial request to the target URL
 * 2. If the server returns 402, parses payment requirements
 * 3. Signs an EIP-3009 transferWithAuthorization with the agent wallet
 * 4. Retries the request with the payment proof attached
 * 5. Returns the unlocked content and settlement details
 */
Deno.serve(async (req: Request) => {
  try {
    const { url, method = "GET", body } = await req.json();

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "Missing required 'url' string parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const privateKey = Deno.env.get("X402_WALLET_PRIVATE_KEY");
    if (!privateKey) {
      return new Response(JSON.stringify({ error: "Agent wallet is not configured (missing X402_WALLET_PRIVATE_KEY secret)" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    /**
     * Fetch wrapper that injects custom headers into the request.
     * @param headers - Additional headers to send
     */
    const doFetch = (headers: Record<string, string>) =>
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: method !== "GET" && method !== "HEAD" && body !== undefined ? JSON.stringify(body) : undefined,
      });

    // Step 1: initial request, no payment
    const initRes = await doFetch({});

    // If the resource doesn't require payment, return the content directly
    if (initRes.status !== 402) {
      const text = await initRes.text();
      return new Response(
        JSON.stringify({
          paid: false,
          reason: "Resource did not require payment",
          status: initRes.status,
          body: safeJson(text),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Step 2: Parse 402 response — v2 uses PAYMENT-REQUIRED header, v1 uses body
    let paymentRequired: any = null;
    let isV2 = false;

    const payReqHeader = initRes.headers.get("PAYMENT-REQUIRED") || initRes.headers.get("Payment-Required");
    if (payReqHeader) {
      paymentRequired = b64Decode(payReqHeader);
      isV2 = (paymentRequired?.x402Version === 2);
    }

    if (!paymentRequired) {
      // Fall back to v1 body format
      const bodyText = await initRes.text();
      paymentRequired = safeJson(bodyText);
      isV2 = (paymentRequired?.x402Version === 2);
    }

    // Step 3: Select a compatible payment scheme
    const accepts = Array.isArray(paymentRequired?.accepts) ? paymentRequired.accepts : [];
    const requirement =
      accepts.find((a: any) => a.scheme === "exact" && PREFERRED_NETWORKS.includes(a.network)) ||
      accepts.find((a: any) => a.scheme === "exact");

    if (!requirement) {
      return new Response(
        JSON.stringify({ paid: false, error: "No compatible x402 payment method offered", paymentRequired }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Step 4: Build the EIP-3009 authorization message
    const amount = requirement.amount || requirement.maxAmountRequired;
    const chainId = chainIdFromNetwork(requirement.network);
    const now = Math.floor(Date.now() / 1000);
    const validAfter = "0";
    const validBefore = (now + (requirement.maxTimeoutSeconds || 60)).toString();
    const nonce = randomNonce();

    // EIP-712 domain — must use "USD Coin" for USDC on Base mainnet
    const domain = {
      name: requirement.extra?.name || "USDC",
      version: requirement.extra?.version || "2",
      chainId,
      verifyingContract: requirement.asset as `0x${string}`,
    };

    const types = {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    } as const;

    const message = {
      from: account.address,
      to: requirement.payTo as `0x${string}`,
      value: BigInt(amount),
      validAfter: BigInt(validAfter),
      validBefore: BigInt(validBefore),
      nonce,
    };

    // Sign the EIP-3009 transfer authorization
    const signature = await account.signTypedData({
      domain,
      types,
      primaryType: "TransferWithAuthorization",
      message,
    });

    // Step 5: Build payment payload — format depends on protocol version
    let paymentPayload: any;
    let paymentHeaderName: string;

    if (isV2) {
      paymentPayload = {
        x402Version: 2,
        resource: paymentRequired.resource,
        accepted: requirement,
        payload: {
          signature,
          authorization: {
            from: account.address,
            to: requirement.payTo,
            value: amount,
            validAfter,
            validBefore,
            nonce,
          },
        },
      };
      paymentHeaderName = "PAYMENT-SIGNATURE";
    } else {
      paymentPayload = {
        x402Version: 1,
        scheme: "exact",
        network: requirement.network,
        payload: {
          signature,
          authorization: {
            from: account.address,
            to: requirement.payTo,
            value: amount,
            validAfter,
            validBefore,
            nonce,
          },
        },
      };
      paymentHeaderName = "X-PAYMENT";
    }

    const paymentHeader = b64Encode(paymentPayload);

    // Step 6: Retry the original request with proof of payment
    const finalRes = await doFetch({ [paymentHeaderName]: paymentHeader });
    const finalText = await finalRes.text();

    // Parse settlement response — v2 uses PAYMENT-RESPONSE, v1 uses X-PAYMENT-RESPONSE
    const paymentResponseHeader =
      finalRes.headers.get("PAYMENT-RESPONSE") ||
      finalRes.headers.get("Payment-Response") ||
      finalRes.headers.get("X-PAYMENT-RESPONSE");

    return new Response(
      JSON.stringify({
        paid: finalRes.status === 200,
        status: finalRes.status,
        x402Version: isV2 ? 2 : 1,
        amountPaidAtomic: amount,
        asset: requirement.asset,
        network: requirement.network,
        payTo: requirement.payTo,
        payer: account.address,
        settlement: paymentResponseHeader ? b64Decode(paymentResponseHeader) : null,
        body: safeJson(finalText),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
