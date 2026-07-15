/**
 * Example: Pay for an x402-gated resource using Node.js.
 *
 * Requirements:
 *   Node.js 18+ (built-in fetch)
 *
 * Usage:
 *   node examples/node_example.js https://api.example.com/data
 */

const AGENT_ENDPOINT = "https://superagent-42aeca08.base44.app/functions/x402PayAndFetch";

async function payAndFetch(url, method = "GET") {
  const response = await fetch(AGENT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, method }),
  });
  return response.json();
}

async function main() {
  const url = process.argv[2];
  const method = process.argv[3] || "GET";

  if (!url) {
    console.error("Usage: node_example.js <url> [method]");
    process.exit(1);
  }

  console.log(`\n🚀 Fetching ${url} via x402...\n`);

  const result = await payAndFetch(url, method);

  if (!result.success) {
    console.error(`❌ Payment failed: ${result.error || "Unknown error"}`);
    process.exit(1);
  }

  console.log("✅ Payment successful!\n");
  console.log(`   Amount:    ${result.amountPaidUsdc || "0.01"} USDC`);
  console.log(`   Network:   ${result.network || "eip155:8453"}`);
  console.log(`   TX:        ${result.settlementTx || "N/A"}`);
  console.log(`   Status:    ${result.status}`);
  console.log("\n📄 Response body:\n");

  try {
    const body = typeof result.body === "string" ? JSON.parse(result.body) : result.body;
    console.log(JSON.stringify(body, null, 2));
  } catch {
    console.log(result.body || "(no body)");
  }
  console.log();
}

main().catch(console.error);
