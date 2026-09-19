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
| 1 | `mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za` | Deployer (v3) | Sep 19, 2026 |
| 2 | *(50 addresses to be added as users join)* | | |

### Contract Addresses (Preprod)

| Version | Address | Notes |
|---------|---------|-------|
| v3 (active) | `a9206339b84565fd515c0b2a49ae86783c7a7f278ed42414723b1053d489ecb8` | Deterministic salt, expense commitments on-chain |
| v2 (deprecated) | `d603069345cbafabe723511524a0bebd7649c842667dee171522b2fe63fc0e7d` | Expense commitments added, random salt |
| v1 (deprecated) | `2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d` | First Preprod deployment |

---

> **Note**: This file will be updated as more users interact with the Meridian contract on Preprod. Each address is verifiable on-chain via the explorer or indexer API.
