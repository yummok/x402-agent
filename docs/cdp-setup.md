# Coinbase Developer Platform (CDP) Setup

The CDP facilitator handles payment verification and settlement on Base mainnet. This guide covers how to get your credentials.

## Step 1: Create a CDP Account

1. Go to [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/)
2. Sign up with your email or Coinbase account
3. Accept the terms of service

## Step 2: Create API Keys

1. Navigate to **API Keys** in the left sidebar
2. Click **Create API Key**
3. Name it (e.g. "x402-agent")
4. Copy the **Key ID** — you'll need this
5. Copy the **Secret** — shown only once, store it securely

## Step 3: Configure the Agent

Add your credentials to `.env`:

```env
CDP_API_KEY_ID=your_key_id_here
CDP_API_KEY_SECRET=your_secret_here
```

Validate:

```bash
deno run --allow-env scripts/validate-env.ts
```

## Step 4: Understand the Facilitator

The CDP facilitator provides two endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/platform/v2/x402/verify` | POST | Verify a payment signature is valid |
| `/platform/v2/x402/settle` | POST | Execute the on-chain settlement |

Authentication uses a JWT generated from your API key credentials via `@coinbase/cdp-sdk`:

```typescript
import { generateJwt } from "@coinbase/cdp-sdk";

const jwt = await generateJwt({
  apiKeyId: Deno.env.get("CDP_API_KEY_ID"),
  apiKeySecret: Deno.env.get("CDP_API_KEY_SECRET"),
});
```

The JWT is sent as `Authorization: Bearer <jwt>` in the facilitator request header.

## Troubleshooting

### "Project not found" in CDP portal

- Make sure you're signed in to the same account you created
- Try incognito mode
- Check if your project is under a different organization

### 401 Unauthorized from facilitator

- Verify your Key ID and Secret are correct
- Check that the keys haven't been revoked
- Ensure there are no trailing spaces in your .env file

### 403 Forbidden from facilitator

- Your API key may lack x402 permissions
- Create a new key with full permissions
