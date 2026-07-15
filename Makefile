.PHONY: seller buyer dashboard test fmt lint check clean

# Start the x402 seller endpoint
seller:
	deno run --allow-net --allow-env x402SellPremiumJoke.ts

# Run the x402 buyer client
buyer:
	deno run --allow-net --allow-env x402PayAndFetch.ts

# Start the dashboard
dashboard:
	deno run --allow-net --allow-env functions/x402Dashboard.ts

# Run all tests
test:
	deno test --allow-read tests/

# Format code
fmt:
	deno fmt

# Lint code
lint:
	deno lint

# Type check
check:
	deno check x402SellPremiumJoke.ts x402PayAndFetch.ts

# Clean build artifacts
clean:
	rm -rf dist build coverage *.tsbuildinfo
