# Dockerfile for local development and testing of the x402 agent
# Uses Deno as the runtime

FROM denoland/deno:latest

WORKDIR /app

# Copy dependency manifest first for better caching
COPY package.json ./

# Copy source files
COPY . .

# Cache dependencies
RUN deno cache x402SellPremiumJoke.ts x402PayAndFetch.ts 2>/dev/null || true

# Expose port for the seller endpoint
EXPOSE 8080

# Default: run the seller endpoint
CMD ["deno", "run", "--allow-net", "--allow-env", "x402SellPremiumJoke.ts"]
