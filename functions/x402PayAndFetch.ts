// x402PayAndFetch (Base Mainnet, x402 v2)
// Fetches a target URL. If the target responds with HTTP 402 (x402 protocol),
// automatically signs a USDC "exact" payment authorization (EIP-3009,
// gasless) with the agent's wallet and retries the request with proof of
// payment attached. Supports both x402 v1 and v2 servers.
//
// Body params: { url: string, method?: string, body?: any }

import { privateKeyToAccount } from "npm:viem@2.54.1/accounts";

const DEFAULT_CHAIN_ID = 8453; // Base mainnet
const PREFERRED_NETWORKS = ["eip155:8453", "base"];

const NETWORK_CHAIN_IDS: Record<string, number> = {
  "eip155:8453": 8453,
  "eip155:84532": 84532,
  "base": 8453,
  "base-sepolia": 84532,
};

function chainIdFromNetwork(network: string): number {
  if (NETWORK_CHAIN_IDS[network]) return NETWORK_CHAIN_IDS[network];
  if (network.startsWith("eip155:")) {
    const id = parseInt(network.split(":")[1], 10);
    if (!isNaN(id)) return id;
  }
  return DEFAULT_CHAIN_ID;
}

function randomNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return ("0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")) as `0x${string}`;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function b64Encode(obj: unknown): string {
  return btoa(JSON.stringify(obj));
}

function b64Decode(str: string): unknown {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

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

    const doFetch = (headers: Record<string, string>) =>
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: method !== "GET" && method !== "HEAD" && body !== undefined ? JSON.stringify(body) : undefined,
      });

    // Step 1: initial request, no payment
    const initRes = await doFetch({});

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

    // Parse 402 response — v2 uses PAYMENT-REQUIRED header, v1 uses body
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

    // v2 uses "amount", v1 uses "maxAmountRequired"
    const amount = requirement.amount || requirement.maxAmountRequired;
    const chainId = chainIdFromNetwork(requirement.network);
    const now = Math.floor(Date.now() / 1000);
    const validAfter = "0";
    const validBefore = (now + (requirement.maxTimeoutSeconds || 60)).toString();
    const nonce = randomNonce();

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

    const signature = await account.signTypedData({
      domain,
      types,
      primaryType: "TransferWithAuthorization",
      message,
    });

    // Build payment payload — v2 format
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
      // v1 format
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

    // Step 2: retry with proof of payment attached
    const finalRes = await doFetch({ [paymentHeaderName]: paymentHeader });
    const finalText = await finalRes.text();

    // v2 uses PAYMENT-RESPONSE, v1 uses X-PAYMENT-RESPONSE
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
