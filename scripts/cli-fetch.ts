#!/usr/bin/env -S deno run --allow-net --allow-env
/**
 * CLI wrapper for x402PayAndFetch.
 * Usage:
 *   deno run --allow-net --allow-env scripts/cli-fetch.ts <url> [method]
 *
 * Examples:
 *   deno run --allow-net --allow-env scripts/cli-fetch.ts https://example.com/api
 *   deno run --allow-net --allow-env scripts/cli-fetch.ts https://example.com/api POST
 *
 * Or via Makefile:
 *   make buyer URL=https://example.com/api
 */

const url = Deno.args[0];
const method = (Deno.args[1] || "GET").toUpperCase();

if (!url) {
  console.error("Usage: cli-fetch.ts <url> [method]");
  console.error("Example: cli-fetch.ts https://api.example.com/data GET");
  Deno.exit(1);
}

console.log(`\n🚀 Fetching ${url} via x402...\n`);

const response = await fetch("https://superagent-42aeca08.base44.app/functions/x402PayAndFetch", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, method }),
});

const result = await response.json();

if (result.success === false) {
  console.error(`❌ Payment failed: ${result.error || "Unknown error"}`);
  console.error(`   Status: ${result.status}`);
  Deno.exit(1);
}

console.log("✅ Payment successful!\n");
console.log(`   Amount:    ${result.amountPaidUsdc || "0.01"} USDC`);
console.log(`   Network:   ${result.network || "eip155:8453"}`);
console.log(`   TX:        ${result.settlementTx || "N/A"}`);
console.log(`   Status:    ${result.status}`);
console.log(`   Version:   x402 v${result.x402Version || 2}`);
console.log("\n📄 Response body:\n");

try {
  const body = typeof result.body === "string" ? JSON.parse(result.body) : result.body;
  console.log(JSON.stringify(body, null, 2));
} catch {
  console.log(result.body || result.responseBody || "(no body)");
}
console.log();
