# Contributing to x402 Agent

Thanks for your interest in contributing! This project is an AI agent that sends and receives USDC micropayments via the x402 protocol on Base.

## How to Contribute

### Reporting Bugs

1. Check existing [issues](https://github.com/yummok/x402-agent/issues) to avoid duplicates
2. Open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Network (Base mainnet / Sepolia)
   - Relevant transaction hashes (if applicable)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the use case and expected outcome
3. If possible, outline a rough implementation approach

### Submitting Pull Requests

1. Fork the repo and create a branch: `git checkout -b feature/my-feature`
2. Make your changes with clear, atomic commits
3. Ensure no secrets or private keys are included
4. Update `.env.example` if you add new environment variables
5. Test your changes locally with Deno: `deno run --allow-net --allow-env functions/x402SellPremiumJoke.ts`
6. Open a PR with a description of what changed and why

### Code Style

- TypeScript / Deno style
- Use JSDoc comments for exported functions
- Keep functions small and focused
- No hardcoded secrets — use environment variables

### Project Structure

```
functions/     Backend functions (deployed)
dashboard/     Frontend dashboard HTML
entities/      Entity schema definitions
x402PayAndFetch.ts    Standalone buyer client
x402SellPremiumJoke.ts  Standalone seller endpoint
```

## Questions?

Open an issue or reach out via the repo discussions tab.
