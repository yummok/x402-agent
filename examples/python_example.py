"""
Example: Pay for an x402-gated resource using the x402 agent API.

Requirements:
    pip install requests

Usage:
    python examples/python_example.py https://api.example.com/data
"""

import sys
import json
import requests

AGENT_ENDPOINT = "https://superagent-42aeca08.base44.app/functions/x402PayAndFetch"


def pay_and_fetch(url: str, method: str = "GET") -> dict:
    """Send a payment request to the x402 agent and return the result."""
    payload = {"url": url, "method": method}
    response = requests.post(AGENT_ENDPOINT, json=payload, timeout=30)
    return response.json()


def main():
    if len(sys.argv) < 2:
        print("Usage: python_example.py <url> [method]")
        sys.exit(1)

    url = sys.argv[1]
    method = sys.argv[2] if len(sys.argv) > 2 else "GET"

    print(f"\n🚀 Fetching {url} via x402...\n")

    result = pay_and_fetch(url, method)

    if not result.get("success", False):
        print(f"❌ Payment failed: {result.get('error', 'Unknown error')}")
        sys.exit(1)

    print("✅ Payment successful!\n")
    print(f"   Amount:    {result.get('amountPaidUsdc', '0.01')} USDC")
    print(f"   Network:   {result.get('network', 'eip155:8453')}")
    print(f"   TX:        {result.get('settlementTx', 'N/A')}")
    print(f"   Status:    {result.get('status', 200)}")
    print("\n📄 Response body:\n")

    body = result.get("body", result.get("responseBody", {}))
    try:
        if isinstance(body, str):
            body = json.loads(body)
        print(json.dumps(body, indent=2))
    except (json.JSONDecodeError, TypeError):
        print(body)


if __name__ == "__main__":
    main()
