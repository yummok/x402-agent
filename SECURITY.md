
## Private Key Handling

The x402 agent stores private keys as environment variables and never:
- Logs or prints private key values
- Includes keys in API responses
- Writes keys to files
- Commits keys to version control

Keys are loaded from the environment at runtime and used only for:
- Signing EIP-3009 `transferWithAuthorization` payloads
- Generating wallet addresses for payment verification

## Report Timeline

| Step | Response Time |
|------|---------------|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 72 hours |
| Fix or mitigation | Within 7 days |
| Public disclosure | After fix is released |
