/**
 * Shared TypeScript types for the x402 protocol implementation.
 *
 * These interfaces model the x402 v2 wire format, including payment
 * requirements, payment payloads, and settlement responses.
 */

/** Network identifier in CAIP-2 format (e.g. "eip155:8453" for Base mainnet) */
export type Network = `eip155:${number}`;

/** x402 protocol version */
export type X402Version = 1 | 2;

/** Description of a resource that requires payment to access */
export interface Resource {
  /** URL of the paywalled resource */
  url: string;
  /** Human-readable description of what's being sold */
  description: string;
  /** MIME type of the response content */
  mimeType: string;
}

/** Payment requirements returned in a 402 response (x402 v2) */
export interface PaymentRequirements {
  /** x402 protocol version */
  x402Version: X402Version;
  /** Required payment amount in atomic units (6 decimals for USDC) */
  amount: string;
  /** USDC token contract address */
  tokenAddress: `0x${string}`;
  /** CAIP-2 network identifier */
  network: Network;
  /** Address that will receive the payment */
  payTo: `0x${string}`;
  /** Maximum time the payment is valid (in seconds) */
  maxTimeoutSeconds: number;
  /** The resource being paywalled */
  resource: Resource;
  /** Protocol extensions (empty in v2) */
  extensions: Record<string, never>;
  /** Optional extra metadata (e.g. EIP-712 domain name override) */
  extra?: {
    name?: string;
    version?: string;
  };
}

/** EIP-3009 authorization payload for USDC transferWithAuthorization */
export interface AuthorizationPayload {
  /** Sender address */
  from: `0x${string}`;
  /** Recipient address */
  to: `0x${string}`;
  /** Transfer value in atomic units */
  value: bigint;
  /** Valid after timestamp (Unix seconds) */
  validAfter: bigint;
  /** Valid before timestamp (Unix seconds) */
  validBefore: bigint;
  /** Unique nonce to prevent replay */
  nonce: `0x${string}`;
}

/** Signed payment payload sent by the client */
export interface PaymentPayload {
  /** x402 protocol version */
  x402Version: X402Version;
  /** The resource being paid for */
  resource: Resource;
  /** Echoed payment requirements */
  accepted: PaymentRequirements;
  /** Signature and authorization data */
  payload: {
    /** EIP-712 signature (hex) */
    signature: `0x${string}`;
    /** EIP-3009 authorization data */
    authorization: AuthorizationPayload;
    /** Optional extra metadata */
    extra?: Record<string, string>;
  };
}

/** Settlement response from the facilitator */
export interface SettlementResponse {
  /** Whether the payment was settled onchain */
  paid: boolean;
  /** Transaction hash of the settlement */
  txHash?: `0x${string}`;
  /** Network the settlement occurred on */
  network: Network;
  /** Error message if settlement failed */
  error?: string;
}

/** Result of a pay-and-fetch operation */
export interface PayAndFetchResult {
  success: boolean;
  status: number;
  settlementTx?: string;
  amountPaidUsdc?: string;
  payee?: string;
  responseBody?: string;
  responseSummary?: string;
  network?: string;
  error?: string;
}
