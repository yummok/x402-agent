/**
 * Tests for the EIP-3009 reference encoding.
 * Run with: deno test --allow-read tests/eip3009_encoding_test.ts
 */
import { assertEquals, assert } from "jsr:@std/assert";
import {
  encodeTransferWithAuthorization,
  encodeTransferWithAuthorizationCalldata,
  computeDomainSeparator,
  TRANSFER_WITH_AUTHORIZATION_SELECTOR,
} from "../src/eip3009-encoding.ts";

const MOCK_PARAMS = {
  from: "0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f" as `0x${string}`,
  to: "0x0000000000000000000000000000000000000402" as `0x${string}`,
  value: 10000n,
  validAfter: 0n,
  validBefore: 9999999999n,
  nonce: "0x" + "a".repeat(64) as `0x${string}`,
};

const MOCK_DOMAIN = {
  domainName: "USD Coin",
  domainVersion: "2",
  chainId: 8453,
  verifyingContract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
};

Deno.test("encodeTransferWithAuthorization returns proper EIP-712 structure", () => {
  const result = encodeTransferWithAuthorization({ ...MOCK_PARAMS, ...MOCK_DOMAIN });

  assertEquals(result.domain.name, "USD Coin");
  assertEquals(result.domain.version, "2");
  assertEquals(result.domain.chainId, 8453);
  assertEquals(result.domain.verifyingContract, "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
});

Deno.test("encodeTransferWithAuthorization includes all 6 message fields", () => {
  const result = encodeTransferWithAuthorization({ ...MOCK_PARAMS, ...MOCK_DOMAIN });

  assertEquals(result.message.from, MOCK_PARAMS.from);
  assertEquals(result.message.to, MOCK_PARAMS.to);
  assertEquals(result.message.value, 10000n);
  assertEquals(result.message.validAfter, 0n);
  assertEquals(result.message.validBefore, 9999999999n);
  assertEquals(result.message.nonce, MOCK_PARAMS.nonce);
});

Deno.test("TransferWithAuthorization type has correct field order", () => {
  const result = encodeTransferWithAuthorization({ ...MOCK_PARAMS, ...MOCK_DOMAIN });
  const fields = result.types.TransferWithAuthorization.map(f => f.name);

  assertEquals(fields, ["from", "to", "value", "validAfter", "validBefore", "nonce"]);
});

Deno.test("encodeTransferWithAuthorizationCalldata starts with correct selector", () => {
  const signature = "0x" + "b".repeat(130) + "1c" as `0x${string}`;
  const calldata = encodeTransferWithAuthorizationCalldata(MOCK_PARAMS, signature);

  // transferWithAuthorization selector is 0x9bec3d04
  assert(calldata.startsWith(TRANSFER_WITH_AUTHORIZATION_SELECTOR));
});

Deno.test("computeDomainSeparator returns 32-byte hash", () => {
  const separator = computeDomainSeparator(
    MOCK_DOMAIN.domainName,
    MOCK_DOMAIN.domainVersion,
    MOCK_DOMAIN.chainId,
    MOCK_DOMAIN.verifyingContract,
  );
  assertEquals(separator.length, 66); // 0x + 64 hex chars = 32 bytes
  assert(separator.startsWith("0x"));
});
