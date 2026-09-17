<div align="center">

# Meridian

### Confidential Group Expense Settlement

*Settle with friends, prove it's fair, show strangers nothing.*

<br/>

[![Midnight Network](https://img.shields.io/badge/Midnight_Network-0a0a0a?style=for-the-badge&logo=midnightnetwork&logoColor=white)]()
[![CI](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml/badge.svg)](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)]()

<br/>

**[GitHub](https://github.com/Anubhab-Rakshit/midnight-project)** · **[Live Demo](https://meridian-midnight.vercel.app/)** · **[Video Demo](https://youtu.be/CFae-K52us0)** · **[X](https://x.com/anubhab_26/status/2100218988907421779?s=20)**

<br/>

</div>

---

## Screenshots

<div align="center">

**Landing Page**

![Landing](images/hero.png)

<br/>

**Circles Dashboard** — create, join, and manage private expense circles

![Circles](images/circles.png)

<br/>

**About Us** — privacy-first philosophy

![About](images/about.png)

</div>

---

## What is Meridian?

Meridian is **confidential group expense settlement** on Midnight Network. It solves the same problem as Splitwise — but with one critical difference: **every amount stays private**.

When you log an expense, only a zero-knowledge commitment hash appears on-chain. Members see amounts locally. An observer can verify the circle exists and is consistent — but **never** sees who spent what, how much, or who settled whom.

> **Privacy model:** You can verify privacy is being enforced (valid ZK proofs exist on-chain), but you can never recover the amounts or identities behind them.

---

## Quick Links

| Resource | Link |
|----------|------|
| Live Demo | https://meridian-midnight.vercel.app |
| Video Walkthrough | https://youtu.be/CFae-K52us0 |
| GitHub | https://github.com/Anubhab-Rakshit/midnight-project |
| CI/CD | https://github.com/Anubhab-Rakshit/midnight-project/actions |
| Product Proposal | [docs/level4-proposal.md](docs/level4-proposal.md) |
| Architecture | [docs/architecture.md](docs/architecture.md) |
| X / Twitter | https://x.com/anubhab_26/status/2100218988907421779?s=20 |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contract | [Compact](https://docs.midnight.network/compact) (ZK circuits) |
| Blockchain | [Midnight Network](https://midnight.network) — Preprod testnet |
| SDK | [Midnight.js](https://docs.midnight.network/midnight.js) |
| Frontend | React 19 + Vite + Framer Motion |
| Backend | [Supabase](https://supabase.com) (PostgreSQL + RLS) |
| Wallets | [1 AM](https://1am.dev) / [Lace](https://lace.io) |
| Hosting | [Vercel](https://vercel.com) |

---

## Features

**Programmable Privacy**
- Expense amounts committed on-chain as ZK hashes — unrecoverable
- ZK invite-gated membership — no public member list
- Settlement proofs — prove fairness without revealing balances

**Optimal Settlement Engine**
- Minimum-transfer netting — fewest payments to settle a circle
- Cross-circle netting — merge balances across circles
- Provable correctness — zero-sum + consistency verification

**Privacy-Preserving Analytics**
- Aggregate stats without individual exposure
- Member badges (top contributor, fair splitter, settlement champion)
- Anomaly detection — outlier spending detection (local-only)

**Recurring Pacts**
- Auto-split rules (weekly, biweekly, monthly)
- Persistent across devices via Supabase

**Wallet Integration**
- Multi-wallet picker (1 AM, Lace) with Dust-free badge
- Browser wallet detection from `window.midnight`
- Private state persistence in localStorage

---

## Architecture

See [docs/architecture.md](docs/architecture.md) for detailed Mermaid diagrams:
- System overview (frontend → wallet → on-chain flow)
- ZK privacy sequence diagram
- Contract state machine
- Settlement engine flow
- Frontend component tree

---

## Deployed Contract

| Field | Value |
|-------|-------|
| Network | Midnight Preprod |
| Contract | `splitpool` |
| Address | `772cd2e005341311964fdad2fb6df79631acce35e2cfd832b1d2d8068c6ff63e` |
| Deployer | `mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za` |
| Deployed | Sep 17, 2026 |

> **Note:** The Preprod explorer has not yet indexed this contract. The contract is live and functional — verified via successful `deploy`, `join`, and `settle` transactions through the Midnight SDK.

---

## Getting Started

```bash
# Clone
git clone https://github.com/Anubhab-Rakshit/midnight-project.git
cd midnight-project

# Install Compact compiler
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Run dev server
cd frontend && npm run dev
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run compile:splitpool` | Compile the ZK contract |
| `npm run deploy:meridian -- --network preprod` | Deploy to Preprod |
| `npm test` | Run root test suite (66 tests) |
| `cd frontend && npm test` | Run frontend tests (10 tests) |
| `cd frontend && npm run build` | Build for production |

---

## Test Suite — 76 Tests

| Module | Tests | Coverage |
|--------|-------|----------|
| `netting.test.ts` | 12 | Minimum-transfer optimality |
| `analytics.test.ts` | 10 | Circle stats, anomalies |
| `recurring-pacts.test.ts` | 9 | Recurring pact rules |
| `badges.test.ts` | 8 | Member achievement badges |
| `cross-circle.test.ts` | 8 | Cross-circle netting |
| `witnesses.test.ts` | 6 | ZK witness providers |
| `circle-math.test.ts` | 6 | Frontend calculations |
| `private-state.test.ts` | 4 | Private state operations |
| `bytes32.test.ts` | 4 | Frontend encoding |

---

## Project Structure

```
midnight-project/
├── contracts/
│   ├── splitpool.compact              # ZK contract (join / logExpense / settle)
│   └── managed/splitpool/             # Compiled artifacts
├── src/meridian/                      # Core logic (netting, analytics, badges)
├── frontend/src/
│   ├── components/                    # React UI components
│   ├── hooks/                         # Contract + state hooks
│   ├── midnight/                      # SDK integration (service, providers)
│   └── context/                       # Wallet state provider
├── supabase/migrations/               # Database schema
├── docs/
│   ├── architecture.md                # System diagrams
│   ├── level4-proposal.md             # Product proposal
│   └── level4-submission.md           # Submission package
└── .github/workflows/ci.yml          # CI/CD pipeline
```

---

## Privacy Model

| What an observer CAN learn | What an observer CANNOT learn |
|---------------------------|------------------------------|
| A circle exists | The invite secret |
| Member/expense/settlement counts | Any expense amount |
| Valid ZK proofs were submitted | Who paid whom |
| Transaction hashes and timestamps | Individual balances |

---

## Resources

- [Midnight Documentation](https://docs.midnight.network)
- [Compact Language Guide](https://docs.midnight.network/compact)
- [Midnight.js SDK](https://docs.midnight.network/midnight.js)
- [DApp Connector API](https://docs.midnight.network/dapp-connector)
- [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev)

---

## License

Apache-2.0

---

<div align="center">

**Meridian** · Midnight Network Challenge 2026

*Built by [Anubhab Rakshit](https://github.com/Anubhab-Rakshit)*

</div>
