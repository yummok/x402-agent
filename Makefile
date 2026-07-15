.PHONY: help seller buyer dashboard test fmt lint check clean validate examples cli pre-commit health tx

# Default target — show help
help:
	@echo "x402 Agent — Available Commands"
	@echo "================================"
	@echo ""
	@echo "  make seller      Start the x402 seller endpoint"
	@echo "  make buyer       Run the x402 buyer client"
	@echo "  make dashboard   Start the dashboard server"
	@echo "  make test        Run all unit tests"
	@echo "  make fmt         Format code with deno fmt"
	@echo "  make lint        Lint code with deno lint"
	@echo "  make check       Type-check the main files"
	@echo "  make validate    Validate environment variables"
	@echo "  make cli         Run the CLI fetch tool"
	@echo "  make pre-commit  Run the secret detection pre-commit check"
	@echo "  make health      Check all endpoint health"
	@echo "  make tx TX=0x..  Open a transaction on Basescan"
	@echo "  make clean       Remove build artifacts"
	@echo ""

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

# Validate environment variables
validate:
	deno run --allow-env scripts/validate-env.ts

# Run the CLI fetch example
cli:
	deno run --allow-net --allow-env scripts/cli-fetch.ts

# Run pre-commit secret check
pre-commit:
	bash scripts/pre-commit-check.sh

# Check endpoint health
health:
	bash scripts/health-check.sh

# Open a transaction on Basescan
tx:
	bash scripts/tx-lookup.sh $(TX)

# Clean build artifacts
clean:
	rm -rf dist build coverage *.tsbuildinfo
