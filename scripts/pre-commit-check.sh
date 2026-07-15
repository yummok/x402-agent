#!/bin/bash
# Pre-commit hook: check for secrets and private keys in staged files
# Install: cp scripts/pre-commit-check.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

set -e

echo "🔍 Checking staged files for secrets..."

# Check for private keys (0x + 64 hex chars)
if git diff --cached --name-only | grep -E '\.(ts|js|json|env)$' | xargs grep -lE "0x[a-fA-F0-9]{64}" 2>/dev/null; then
  echo "❌ Private key pattern detected in staged files!"
  echo "   Make sure you're not committing real private keys."
  exit 1
fi

# Check for GitHub tokens
if git diff --cached --name-only | grep -E '\.(ts|js|json)$' | xargs grep -lE "ghp_[a-zA-Z0-9]{36}" 2>/dev/null; then
  echo "❌ GitHub token detected in staged files!"
  exit 1
fi

# Check for .env files
if git diff --cached --name-only | grep -E "^\.env($|\.)(?!example)"; then
  echo "❌ .env file detected! Use .env.example for templates."
  exit 1
fi

echo "✅ No secrets detected."
