# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do NOT open a public issue** describing the vulnerability
2. Email the maintainer with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. You will receive a response within 48 hours

## Security Best Practices

This project handles cryptocurrency payments and private keys. Follow these guidelines:

- **Never commit private keys** — use environment variables and `.env` files
- **Never share your `.env` file** — it is gitignored by default
- **Review all dependencies** before adding them
- **Use CDP credentials** with minimal required permissions
- **Test on Base Sepolia** before deploying to mainnet

## Scope

This policy covers:
- The x402 payment functions (`x402SellPremiumJoke`, `x402PayAndFetch`)
- The dashboard (`x402Dashboard`)
- The entity schemas and automations

## Acknowledgments

We appreciate responsible disclosure and will credit reporters (with permission) for valid vulnerabilities.
