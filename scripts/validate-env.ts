/**
 * Environment variable validation script.
 * Run with: deno run --allow-env scripts/validate-env.ts
 *
 * Checks that all required environment variables are set and properly formatted.
 */

const REQUIRED_VARS = [
  { name: "X402_WALLET_PRIVATE_KEY", pattern: /^0x[a-fA-F0-9]{64}$/, description: "Ethereum private key (0x + 64 hex chars)" },
  { name: "CDP_API_KEY_ID", pattern: /^.+$/, description: "Coinbase Developer Platform API key ID" },
  { name: "CDP_API_KEY_SECRET", pattern: /^.+$/, description: "Coinbase Developer Platform API key secret" },
];

console.log("🔍 Validating environment variables...\n");

let hasErrors = false;

for (const { name, pattern, description } of REQUIRED_VARS) {
  const value = Deno.env.get(name);

  if (!value) {
    console.error(`  ❌ ${name}: NOT SET — ${description}`);
    hasErrors = true;
  } else if (!pattern.test(value)) {
    console.error(`  ❌ ${name}: INVALID FORMAT — expected ${description}`);
    hasErrors = true;
  } else {
    console.log(`  ✅ ${name}: set and valid`);
  }
}

console.log();

if (hasErrors) {
  console.error("❌ Environment validation failed. Copy .env.example to .env and fill in your values.");
  Deno.exit(1);
} else {
  console.log("✅ All environment variables are properly configured.");
}
