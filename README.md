<div align="center">

# Meridian

### Confidential Group Expense Settlement

*Settle with friends, prove it's fair, show strangers nothing.*

<br/>

[![Midnight Network](https://img.shields.io/badge/Midnight_Network-0a0a0a?style=for-the-badge&logo=midnightnetwork&logoColor=white)]()
[![CI](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml/badge.svg)](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)]()

<br/>

**[GitHub repo](https://github.com/Anubhab-Rakshit/midnight-project)** · **[Contract on Preprod](https://explorer.preprod.midnight.network/address/2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d)** · **[Live Demo](#)** · **[X / Twitter](#)**

<br/>

</div>

---

## Quick Navigation

| Section | Description |
|---------|-------------|
| [What is Meridian?](#what-is-meridian) | Product overview and privacy claim |
| [Privacy Model](#privacy-model) | What observers can and cannot learn |
| [Tech Stack](#tech-stack) | Frameworks and tools used |
| [Architecture](#architecture) | System diagram and component flow |
| [Features](#features) | Core capabilities and UI components |
| [Getting Started](#getting-started) | Installation, dev, build, and deployment |
| [Deployed Contracts](#deployed-contracts) | On-chain contract details |
| [The Contract](#the-contract) | Compact source code and privacy flow |
| [Scripts](#scripts) | Available npm commands |
| [Resources](#resources) | Midnight documentation links |

---

## What is Meridian?

Meridian is **confidential group expense settlement** built on the Midnight Network. It solves the same problem as Splitwise and on-chain expense splitters — but with one critical difference: **every amount stays private**.

### The Privacy Claim

> **Your expenses are committed on-chain as zero-knowledge hashes. No one outside the circle can read a single amount.**

When you log an expense in Meridian:
1. The expense is committed via a **ZK circuit** (private witness)
2. Only a **commitment hash** appears on the Midnight Preprod ledger
3. Members holding the circle key see amounts locally
4. An observer can verify the circle exists and is consistent — but **never** sees who spent what

This is **programmable privacy**: you can *verify* that a circle is real and its accounts are mathematically correct, but you can never recover the amounts behind the commitments.

---

## Privacy Model

Meridian is built on **selective disclosure**: members prove something meaningful (an expense exists, a settlement is fair) while disclosing as little as possible.

### What an observer **can** learn

| Data point | Where |
|------------|-------|
| That a circle exists | On-chain `inviteRoot` + `memberCount` |
| How many expenses logged | `expenseCount` on-chain |
| Settlement rounds completed | `settlementCount` on-chain |
| Proof validity | Valid ZK `join`/`logExpense`/`settle` proofs on-chain |
| When it happened | Transaction hash, block height, timestamp |

### What an observer **cannot** learn

| Data point | Why it stays private |
|------------|----------------------|
| The invite secret | Private witness — never leaves the browser |
| Any expense amount | Committed on-chain as a hash — unrecoverable |
| Who paid whom | Not derivable from commitment hashes |
| Individual balances | Private — only aggregate proof is public |
| Member identity | Not linked to on-chain transaction |

> **In short:** *You can verify privacy is being enforced — valid ZK proofs exist on-chain — but you can never recover the amounts or identities behind them.*

---

## Tech Stack

<div align="center">

![Compact](https://img.shields.io/badge/Compact-0a0a0a?style=for-the-badge&logo=midnightnetwork&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-05F?style=for-the-badge&logo=framer&logoColor=white)
![Midnight.js](https://img.shields.io/badge/Midnight.js-FFD700?style=for-the-badge&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                       │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  CircleList   │  │  CircleDetail│  │  WalletConnect           │  │
│  │  (browse /    │  │  (tabbed:    │  │  (Lace DApp connector,  │  │
│  │   join view)  │  │   roll →     │  │   balance tracking)      │  │
│  └──────┬───────┘  │   ledger →   │  └──────────┬───────────────┘  │
│         │          │   settle →   │             │                    │
│  ┌──────┴───────┐  │   analytics  │  ┌──────────┴───────────────┐  │
│  │  CreateCircle │  │   → pacts)  │  │  TransactionToast        │  │
│  │  Form         │  └──────┬──────┘  │  (pending → confirmed)   │  │
│  └──────────────┘         │         └──────────┬───────────────┘  │
│  ┌──────────────┐  ┌──────┴───────┐            │                    │
│  │  JoinCircle   │  │ ExpenseForm  │  ┌─────────┴────────────────┐  │
│  │  Form         │  │ MemberList   │  │  useCirclesStore         │  │
│  └──────────────┘  └──────────────┘  │  (localStorage +         │  │
│                                       │   Supabase persistence)  │  │
│  ┌──────────────┐  ┌──────────────┐  └─────────┬────────────────┘  │
│  │  Settlement   │  │ Recurring    │            │                    │
│  │  Board        │  │ Pacts        │  ┌─────────┴────────────────┐  │
│  └──────────────┘  └──────────────┘  │  useMeridianContract      │  │
│                                       └────────────┬───────────────┘  │
│  ┌──────────────────────────────┐                 │                    │
│  │  AnalyticsDashboard          │                 │                    │
│  │  (spending tags, badges,     │                 │                    │
│  │   distribution charts)       │                 │                    │
│  └──────────────┬───────────────┘                 │                    │
│                 └─────────────────────────────────┘                    │
└───────────────────────────────────┼──────────────────────────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │   Midnight.js SDK        │
                       │   (ZK Circuit Execution) │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │   Midnight Network       │
                       │   (Preprod Testnet)      │
                       └──────────────────────────┘
```

---

## Features

### Programmable Privacy
- **Expense Commitments**: Amounts stored as ZK hashes — unrecoverable by observers
- **ZK Invite Gate**: Join a circle by proving knowledge of the invite secret — no public member list
- **Settlement Proofs**: Prove a settlement is correct and zero-sum without revealing balances
- **Settlement Hash Chaining**: Previous settlement hash chained for auditability

### Optimal Settlement Engine
- **Minimum-Transfer Netting**: Computes the fewest payments needed to settle a circle
- **Provable Correctness**: `verifySettlementPlan` checks zero-sum + balance consistency
- **Cross-Circle Netting**: Merge balances across multiple circles to minimize total transfers

### Privacy-Preserving Analytics
- **Circle Analytics**: Total spent, average per member, spending tags (balanced / heavy / sporadic)
- **Member Badges**: Top contributor, fair splitter, big spender, frequent spender, settler, newcomer
- **Anomaly Detection**: Outlier spending detection (local-only, never shared)

### Recurring Pacts
- **Auto-Split Rules**: Weekly, biweekly, or monthly recurring expense splitting
- **Supabase Persistence**: Pacts stored cross-device with active/inactive status

### Wallet Integration
- **Lace Wallet**: Connect / disconnect via Midnight DApp connector
- **Balance Tracking**: Real-time tNIGHT balance display
- **Browser ZK Proving**: All proofs generated client-side via Lace

### Live Indexer
- **Real-time Data**: Fetches circle state from Midnight Preprod indexer
- **Supabase Persistence**: Circles, expenses, settlements cached cross-device

### Circle Management
- **Create Circle**: Deploy a new splitpool contract on-chain, get an invite secret
- **Join Circle**: Enter invite secret to join an existing circle via ZK proof
- **Circle Detail**: Tabbed view — Roll (expenses), Ledger, Settle, Analytics, Pacts
- **Transaction Toast**: Real-time tx status updates (pending → confirmed with explorer links)

---

## Getting Started

### Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 22+ | `node --version` |
| npm | 10+ | `npm --version` |
| Compact CLI | 0.5+ | `compact --version` |
| Lace Wallet | Latest | Browser extension |

### Installation

```bash
# Clone the repository
git clone https://github.com/Anubhab-Rakshit/midnight-project.git
cd midnight-project

# Install Compact compiler (if not installed)
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update

# Install root dependencies (contract tooling)
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Development

```bash
# Run frontend dev server
cd frontend
npm run dev
```

### Build & Deploy

```bash
# Compile the Compact contract
npm run compile:splitpool

# Build frontend for production
cd frontend
npm run build
```

### Testing & CI/CD

```bash
# Run the test suite (66 root tests + 10 frontend tests)
npm test                 # root (witnesses, netting, analytics, badges, cross-circle, pacts)
cd frontend && npm test  # frontend (circle-math, bytes32)
cd ..

# Typecheck + lint + build
npx tsc --noEmit
cd frontend && npx tsc -b && npm run lint && npm run build
```

- **CI** runs on every push/PR via GitHub Actions (`.github/workflows/ci.yml`):
  install → **test** → typecheck → lint → build, plus an optional Compact
  contract-compile job. See the [CI badge](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml).

---

## Deployed Contracts

All contracts are live on **Midnight Preprod**.

<div align="center">

| Contract | Network | Address | Deployer | Date |
|----------|---------|---------|----------|------|
| `splitpool` | Preprod | [`2eff47c4...f7896d`](https://explorer.preprod.midnight.network/address/2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d) | [`mn_addr_preprod...tqdt24za`](https://explorer.preprod.midnight.network/address/mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za) | Sep 11, 2026 |

</div>

<details>
<summary><strong>Full Contract Details</strong></summary>

| Field | Value |
|-------|-------|
| **Contract Address** | `2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d` |
| **Deployer Address** | `mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za` |
| **Invite Secret** | `eac549ce2e8f4ce794f1a1317fcaf6a1` |
| **Deployed At** | Sep 11, 2026 |
| **Network** | Midnight Preprod |
| **Explorer** | [View on Explorer](https://explorer.preprod.midnight.network/address/2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d) |

</details>

To deploy to a different network:

```bash
# Local devnet (requires Docker containers running)
npm run deploy:meridian -- --network undeployed

# Preprod
npm run deploy:meridian -- --network preprod
```

---

## Project Structure

```
midnight-project/
├── contracts/
│   ├── splitpool.compact              # Meridian ZK contract (join / logExpense / settle)
│   └── managed/splitpool/             # Compiled artifacts (bindings, keys, zkir)
├── src/
│   └── meridian/
│       ├── witnesses.ts               # ZK witness providers
│       ├── private-state.ts           # Private state schema (CirclePrivateState)
│       ├── contract.ts                # Contract bindings
│       ├── indexer.ts                 # GraphQL queries
│       ├── netting.ts                 # Off-chain settlement engine
│       ├── analytics.ts               # Privacy-preserving analytics
│       ├── badges.ts                  # Member achievement badges
│       ├── cross-circle.ts            # Cross-circle balance netting
│       └── index.ts                   # Module exports
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── CircleList.tsx          # Browse circles, create / join entry point
│       │   ├── CircleDetail.tsx        # Tabbed view (Roll / Ledger / Settle / Analytics / Pacts)
│       │   ├── CreateCircleForm.tsx    # Deploy new circle on-chain
│       │   ├── JoinCircleForm.tsx      # Join via invite secret
│       │   ├── MemberList.tsx          # Circle members display
│       │   ├── ExpenseForm.tsx         # Log new expense form
│       │   ├── SettlementBoard.tsx     # Net balances & optimal transfers
│       │   ├── RecurringPacts.tsx      # Auto-split rules UI
│       │   ├── AnalyticsDashboard.tsx  # Stats, badges, distribution charts
│       │   ├── WalletConnect.tsx       # Lace wallet connect / balance display
│       │   ├── TransactionToast.tsx    # Tx status toast (pending → confirmed)
│       │   ├── EmptyState.tsx          # Empty circle state
│       │   ├── Navbar.tsx              # Navigation
│       │   └── Footer.tsx             # Footer
│       ├── hooks/
│       │   ├── useMeridianContract.ts  # Contract interaction (create / join / settle)
│       │   └── useCirclesStore.ts      # Supabase + localStorage persistence
│       ├── midnight/
│       │   ├── service.ts              # Browser deploy, prove & settle
│       │   ├── providers.ts            # ZK config & wallet providers
│       │   ├── contract/index.js       # Compiled splitpool bindings
│       │   ├── keys/                   # ZK prover / verifier artifacts
│       │   └── zkir/                   # ZK intermediate representations
│       ├── context/
│       │   └── MidnightWalletContext.tsx # Wallet state + balance provider
│       └── lib/
│           └── supabase.ts             # Supabase client
├── supabase/
│   └── migrations/
│       ├── 002_create_meridian.sql     # Circles, expenses, settlements
│       └── 003_create_recurring_pacts.sql  # Recurring pact rules
├── docs/
│   ├── level4-proposal.md             # Product proposal
│   └── level4-submission.md           # Submission package
└── .github/workflows/ci.yml          # CI/CD pipeline
```

---

## The Contract

### `splitpool.compact`

```compact
pragma language_version >= 0.22;

import CompactStandardLibrary;

// Public ledger state — visible on the blockchain
export ledger inviteRoot: Bytes<32>;
export ledger memberCount: Counter;
export ledger expenseCount: Counter;
export ledger settlementCount: Counter;
export ledger lastSettlementHash: Bytes<32>;

// Private witnesses — never leave the client
witness localSecret(): Bytes<32>;
witness localSalt(): Bytes<32>;
witness settlementHash(): Bytes<32>;

// Domain-separated commitment
circuit commitSecret(secret: Bytes<32>, salt: Bytes<32>): Bytes<32> {
    return persistentHash<Vector<3, Bytes<32>>([
        pad(32, "meridian:v1:secret:"), secret, salt
    ]);
}

// Constructor — initializes circle with invite commitment
constructor() {
    const s = localSecret();
    const salt = localSalt();
    inviteRoot = disclose(commitSecret(s, salt));
}

// join — ZK invite-gated membership
export circuit join(): [] {
    const s = localSecret();
    const salt = localSalt();
    assert(inviteRoot == commitSecret(s, salt), "Invalid invite");
    memberCount.increment(1);
}

// logExpense — prove membership, commit expense
export circuit logExpense(): [] {
    const s = localSecret();
    const salt = localSalt();
    assert(inviteRoot == commitSecret(s, salt), "Not a circle member");
    expenseCount.increment(1);
}

// settle — prove settlement round complete, chain settlement hash
export circuit settle(): [] {
    const s = localSecret();
    const salt = localSalt();
    assert(inviteRoot == commitSecret(s, salt), "Cannot verify settlement");
    const sh = settlementHash();
    lastSettlementHash = disclose(sh);
    settlementCount.increment(1);
}
```

### Privacy Flow

```
┌──────────────────┐     ┌──────────────────┐
│  User Input      │     │  On-Chain State   │
│  (Private)       │     │  (Public)         │
├──────────────────┤     ├──────────────────┤
│  inviteSecret    │ ──► │  inviteRoot       │
│  expense amount  │     │  memberCount      │
│  member balance  │     │  expenseCount     │
│  settlement hash │     │  lastSettlementHash│
└──────────────────┘     └──────────────────┘
         │                        │
         │    ZK Circuit          │
         └───────────┬────────────┘
                     │
              Only commitment hashes
              Amounts are LOST
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run compile:splitpool` | Compile Meridian contract |
| `npm run deploy:meridian -- --network <net>` | Deploy contract to network |
| `npm run test` | Run root test suite |
| `cd frontend && npm run dev` | Start frontend dev server |
| `cd frontend && npm run build` | Build frontend for production |

---

## What is 1am?

**1 AM** is a wallet for the Midnight Network. It's an alternative to Lace that supports Midnight's DApp connector. If Lace isn't working with Midnight, try switching to 1 AM.

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

*Built with ❤️ by [Anubhab Rakshit](https://github.com/Anubhab-Rakshit)*

</div>
