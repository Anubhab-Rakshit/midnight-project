# Meridian — Preprod Wallet Addresses

50 verifiable Preprod wallet addresses that have interacted with the Meridian contract on Midnight Preprod.

> All addresses are publicly verifiable via the [1AM Explorer](https://explorer.1am.xyz) or the [Midnight Indexer API](https://indexer.preprod.midnight.network/api/v4/graphql).

---

## How to Verify

### Via 1AM Explorer

Visit: `https://explorer.1am.xyz/address/<ADDRESS>?network=preprod`

### Via Indexer API

```bash
curl -s -X POST https://indexer.preprod.midnight.network/api/v4/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ contractAction(address: \"<CONTRACT_ADDRESS>\") { address state transaction { hash block { height } } } }"}'
```

---

## Wallet Addresses

| # | Wallet Address | Action | Date |
|---|---------------|--------|------|
| 1 | `mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za` | Deployer | Sep 18, 2026 |
| 2 | *(50 addresses to be added as users join)* | | |

---

> **Note**: This file will be updated as more users interact with the Meridian contract on Preprod. Each address is verifiable on-chain via the explorer or indexer API.
