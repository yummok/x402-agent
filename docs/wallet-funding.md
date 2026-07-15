# Wallet Funding Guide

The x402 agent wallet needs USDC on Base mainnet to make payments. This guide covers how to fund it.

## Agent Wallet

| Item | Value |
|------|-------|
| Address | `0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f` |
| Network | Base mainnet (chain ID 8453) |
| Token | USDC |
| Gas | Sponsored by CDP facilitator (no ETH needed) |

## Option 1: Bridge from Ethereum Mainnet

Use [across.to](https://across.to) or [jumper.exchange](https://jumper.exchange) to bridge USDC from Ethereum to Base.

1. Connect your wallet to the bridge
2. Select USDC → Base
3. Send the amount you want on Base
4. Wait for confirmation (~2-5 minutes)

## Option 2: Buy USDC on Base DEX

1. Send ETH to Base (or bridge ETH to Base)
2. Swap ETH → USDC on [Aerodrome](https://aerodrome.finance) or [Uniswap](https://app.uniswap.org)
3. Transfer USDC to the agent wallet address

## Option 3: Send from Another Wallet

If you already have USDC on Base, simply send it to the agent wallet address.

## Option 4: Coinbase (Easiest)

1. Buy USDC on Coinbase
2. Withdraw to "Base Network"
3. Use the agent wallet address as destination

## How Much to Fund

- Each x402 micropayment is 0.01 USDC
- Daily automation makes 1 payment/day
- Monthly cost: ~0.30 USDC
- Recommended: fund with 1-5 USDC for months of operation

## Verify Balance

After funding, verify the balance:

```bash
# Using cast (foundry)
cast call 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
  "balanceOf(address)(uint256)" \
  0x5F3b6a74f61ED68B14844af8b72C2D78bAD24c6f \
  --rpc-url https://mainnet.base.org
```

Or check on [Basescan](https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913):
1. Go to the Token Tracker page
2. Search for the agent wallet address
3. View the balance
