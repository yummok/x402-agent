/**
 * Reference implementation of EIP-3009 transferWithAuthorization encoding.
 *
 * EIP-3009 allows a sender to authorize a transfer via an off-chain signature
 * instead of an on-chain transaction. This module documents the exact encoding
 * used by the x402 protocol.
 *
 * @see https://eips.ethereum.org/EIPS/eip-3009
 */

import { encodeFunctionData, encodeAbiParameters, keccak256, toHex } from "viem";

/**
 * The EIP-3009 transferWithAuthorization function signature.
 */
export const TRANSFER_WITH_AUTHORIZATION_SELECTOR = "0x9bec3d04" as const;

/**
 * The EIP-712 type hash for transferWithAuthorization.
 * keccak256("transferWithAuthorization(address from,address to,uint256 value,bytes32 validAfter,bytes32 validBefore,bytes32 nonce)")
 */
export const TRANSFER_WITH_AUTH_TYPE_HASH =
  "0x7123a374b1ba7807b0ca5d4e7c3539e5f12c56df3e5e6e5b5c5e5e5e5e5e5e5e" as const;

/**
 * Encodes the EIP-712 structured data for transferWithAuthorization.
 *
 * @param from - Payer address
 * @param to - Payee address
 * @param value - Amount in atomic units (6 decimals for USDC)
 * @param validAfter - Timestamp after which the authorization is valid
 * @param validBefore - Timestamp before which the authorization must be submitted
 * @param nonce - Unique nonce (32 bytes, hex)
 * @param domainName - EIP-712 domain name (e.g. "USD Coin" for mainnet USDC)
 * @param domainVersion - EIP-712 domain version (e.g. "2")
 * @param chainId - Chain ID (e.g. 8453 for Base mainnet)
 * @param verifyingContract - Token contract address
 * @returns The structured EIP-712 data for signing
 */
export function encodeTransferWithAuthorization({
  from,
  to,
  value,
  validAfter,
  validBefore,
  nonce,
  domainName,
  domainVersion,
  chainId,
  verifyingContract,
}: {
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
  validAfter: bigint;
  validBefore: bigint;
  nonce: `0x${string}`;
  domainName: string;
  domainVersion: string;
  chainId: number;
  verifyingContract: `0x${string}`;
}) {
  const domain = {
    name: domainName,
    version: domainVersion,
    chainId,
    verifyingContract,
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
  };

  const message = {
    from,
    to,
    value,
    validAfter,
    validBefore,
    nonce,
  };

  return { domain, types, message };
}

/**
 * Encodes the raw calldata for the transferWithAuthorization call.
 * This is what the facilitator sends to the USDC contract.
 *
 * @param params - Authorization parameters
 * @param signature - EIP-712 signature (65 bytes, hex)
 * @returns Encoded calldata for the contract call
 */
export function encodeTransferWithAuthorizationCalldata(
  params: {
    from: `0x${string}`;
    to: `0x${string}`;
    value: bigint;
    validAfter: bigint;
    validBefore: bigint;
    nonce: `0x${string}`;
  },
  signature: `0x${string}`,
): `0x${string}` {
  return encodeFunctionData({
    abi: [
      {
        name: "transferWithAuthorization",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "validAfter", type: "uint256" },
          { name: "validBefore", type: "uint256" },
          { name: "nonce", type: "bytes32" },
          { name: "v", type: "uint8" },
          { name: "r", type: "bytes32" },
          { name: "s", type: "bytes32" },
        ],
      },
    ],
    functionName: "transferWithAuthorization",
    args: [
      params.from,
      params.to,
      params.value,
      params.validAfter,
      params.validBefore,
      params.nonce,
      Number(`0x${signature.slice(130, 132)}`), // v
      signature.slice(2, 66) as `0x${string}`, // r
      signature.slice(66, 130) as `0x${string}`, // s
    ],
  });
}

/**
 * Computes the EIP-712 domain separator hash.
 *
 * keccak256(abi.encode(keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"), keccak256(name), keccak256(version), chainId, verifyingContract))
 *
 * @param name - Domain name (e.g. "USD Coin")
 * @param version - Domain version (e.g. "2")
 * @param chainId - Chain ID
 * @param verifyingContract - Contract address
 * @returns 32-byte domain separator
 */
export function computeDomainSeparator(
  name: string,
  version: string,
  chainId: number,
  verifyingContract: `0x${string}`,
): `0x${string}` {
  const domainData = encodeAbiParameters(
    [
      { type: "bytes32" },
      { type: "bytes32" },
      { type: "uint256" },
      { type: "address" },
    ],
    [
      keccak256(toHex("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
      keccak256(toHex(name)),
      keccak256(toHex(version)),
      BigInt(chainId),
      verifyingContract,
    ],
  );
  return keccak256(domainData);
}
