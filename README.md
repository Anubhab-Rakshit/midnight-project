<div align="center">

# Meridian

### Confidential Group Expense Settlement

*Settle with friends, prove it's fair, show strangers nothing.*

<br/>

[![Midnight Network](https://img.shields.io/badge/Midnight_Network-0a0a0a?style=for-the-badge&logo=midnightnetwork&logoColor=white)]()
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)]()
[![CI](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml/badge.svg)](https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml)

<br/>

**[GitHub repository](https://github.com/Anubhab-Rakshit/midnight-project)** · **[Contract on Preprod](https://explorer.preprod.midnight.network/)**

<br/>

</div>

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
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

</div>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  Monolith    │  │  Chronicles  │  │  Midnight Wallet    │   │
│  │  (Oracle)    │  │  (Gallery)   │  │  Context            │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────┬──────────┘   │
│         │                │                      │               │
│         └────────────────┼──────────────────────┘               │
│                          │                                      │
│                    ┌─────▼─────┐                                │
│                    │ useOmen   │                                │
│                    │ Contract  │                                │
│                    └─────┬─────┘                                │
└──────────────────────────┼──────────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   Midnight.js SDK       │
              │   (ZK Circuit Exec)     │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   Midnight Network      │
              │   (Preprod Testnet)     │
              └─────────────────────────┘
```

---

## Features

### 🔐 Programmable Privacy
- **Expense Commitments**: Amounts stored as ZK hashes — unrecoverable by observers
- **ZK Invite Gate**: Join a circle by proving knowledge of the invite — no public member list
- **Settlement Proofs**: Prove a settlement is correct and zero-sum without revealing balances

### 💳 Wallet Integration
- **Lace Wallet**: Connect/disconnect via Midnight DApp connector
- **Browser ZK Proving**: All proofs generated client-side via Lace

### 📊 Live Indexer
- **Real-time Data**: Fetches circle state from Midnight Preprod indexer
- **Supabase Persistence**: Circles, expenses, settlements cached cross-device

### 🎨 Production-Grade UI
- **Circle Board**: Create circles, log expenses, view summaries
- **Settlement View**: Run the netting engine, see optimal transfer plans
- **Framer Motion**: Smooth animations throughout

---

## Getting Started

### Prerequisites

| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 22+ | `node --version` |
| npm | 10+ | `npm --version` |
| Docker | 29+ | `docker --version` |
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
# Start local devnet (requires Docker)
npm run setup

# Run frontend dev server
cd frontend
npm run dev
```

### Build & Deploy

```bash
# Compile the Compact contract
cd contracts
compact compile premonition.compact managed/premonition

# Deploy to Preprod (requires wallet + tNIGHT)
npm run deploy -- --network preprod

# Build frontend for production
cd frontend
npm run build
```

### Testing & CI/CD

```bash
# Run the test suite (13 tests: witnesses, private state, Bytes<32> encoding)
npm test                 # root (contract/vm unit tests)
cd frontend && npm test  # frontend unit tests
cd ..

# Typecheck + lint + build
npx tsc --noEmit
cd frontend && npx tsc -b && npm run lint && npm run build
```

- **CI** runs on every push/PR via GitHub Actions (`.github/workflows/ci.yml`):
  install → **test** → typecheck → lint → build, plus an optional Compact
  contract-compile job. See the [CI badge](#) and [test results](docs/test-results.md).
- **Product proposal:** [Level 3 — Private Allowlist Access](docs/level3-proposal.md).
- **📦 Ready-to-submit package:** [`docs/level3-submission.md`](docs/level3-submission.md) —
  full Level 3 submission package including a ready-to-paste submission message.

---

## Project Structure

```
midnight-project/
├── contracts/
│   ├── splitpool.compact        # Meridian ZK contract source
│   ├── premonition.compact      # Omen contract (legacy)
│   └── managed/
│       ├── splitpool/           # Compiled ZK artifacts
│       │   ├── compiler/        # Circuit metadata
│       │   ├── contract/        # TypeScript bindings
│       │   ├── keys/            # Prover/Verifier keys
│       │   └── zkir/            # ZK Intermediate Rep
│       └── premonition/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CircleBoard.tsx  # Circle creation & expense logger
│   │   │   ├── Chronicles.tsx   # Activity feed
│   │   │   ├── Navbar.tsx       # Navigation
│   │   │   ├── Footer.tsx       # Footer
│   │   │   ├── LiquidAura.tsx   # Background effects
│   │   │   └── Preloader.tsx    # Loading screen
│   │   ├── context/
│   │   │   └── MidnightWalletContext.tsx  # Wallet state
│   │   ├── hooks/
│   │   │   ├── useMeridianContract.ts  # Contract interaction
│   │   │   └── useCirclesStore.ts      # Supabase persistence
│   │   ├── midnight/
│   │   │   ├── service.ts       # Browser deploy & prove
│   │   │   ├── providers.ts     # ZK config & wallet providers
│   │   │   └── contract/        # Compiled contract types
│   │   ├── lib/
│   │   │   ├── bytes32.ts       # Bytes<32> encoding
│   │   │   └── supabase.ts      # Supabase client
│   │   ├── App.tsx              # Main app
│   │   └── main.tsx             # Entry point
│   ├── package.json
│   └── vite.config.ts
├── src/
│   ├── meridian/
│   │   ├── witnesses.ts         # ZK witness providers
│   │   ├── private-state.ts     # Private state schema
│   │   ├── contract.ts          # Contract bindings
│   │   ├── indexer.ts           # GraphQL queries
│   │   ├── netting.ts           # Off-chain settlement engine
│   │   └── index.ts             # Module exports
│   └── omen/                    # Legacy Omen modules
├── supabase/
│   └── migrations/
│       ├── 001_create_premonitions.sql
│       └── 002_create_meridian.sql
└── .github/workflows/ci.yml
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

// Private witnesses — never leave the client
witness localSecret(): Bytes<32>;
witness localSalt(): Bytes<32>;

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

// settle — prove settlement round complete
export circuit settle(): [] {
    const s = localSecret();
    const salt = localSalt();
    assert(inviteRoot == commitSecret(s, salt), "Cannot verify settlement");
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
└──────────────────┘     └──────────────────┘
         │                        │
         │    ZK Circuit          │
         └───────────┬────────────┘
                     │
              Only commitment hashes
              Amounts are LOST
```

---

## Network Configuration

| Network | Purpose | Explorer |
|---------|---------|----------|
| `undeployed` | Local devnet | N/A |
| `preview` | Public preview | [Explorer](https://explorer.preview.midnight.network) |
| `preprod` | **Production testnet** | [Explorer](https://explorer.preprod.midnight.network) |

### Preprod Deployment

```bash
# 1. Ensure wallet is funded (get tNIGHT from faucet)
npm run check-balance -- --network preprod

# 2. Deploy contract
npm run deploy -- --network preprod

# 3. Contract address will be saved to .midnight-state.json
```

### On-Chain Premonition

In the browser, each inscription deploys a **fresh `premonition` contract instance**. The deploy transaction is the on-chain record — proven, balanced and submitted through the Lace wallet, then captured (with its transaction hash and block height) and persisted to Supabase. An example of a recorded on-chain premonition transaction (open the transaction on the explorer):

```
https://explorer.preprod.midnight.network/transactions/e765f0402df04ac3e0330192e86fd7ca225c4f10165d57057e9c791eade7c510
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run compile:splitpool` | Compile Meridian contract |
| `npm run compile:premonition` | Compile Omen contract (legacy) |
| `npm run setup` | Start local devnet + compile + deploy |
| `npm run deploy -- --network preprod` | Deploy to Preprod |
| `npm run test` | Run root test suite |
| `cd frontend && npm run dev` | Start frontend dev server |
| `cd frontend && npm run build` | Build frontend for production |

---

## Environment Variables

Create `.env` files based on the examples:

```bash
# Root level
cp .env.example .env

# Frontend
cp frontend/.env.example frontend/.env
```

---

## Submission Checklist

- [x] Fully functional dApp meaningfully using Midnight's privacy model
- [x] Minimum 3 tests passing (15+ tests)
- [x] CI/CD pipeline running ([workflow](.github/workflows/ci.yml) + badge)
- [x] Approved idea: Meridian — Confidential Group Expense Settlement
- [x] Minimum 10 meaningful commits
- [x] Public GitHub repository with complete README
- [x] README privacy model section: [what an observer can and cannot learn](#privacy-model)
- [x] Product proposal: [docs/level4-proposal.md](docs/level4-proposal.md)
- [x] 📦 Complete submission package: [docs/level4-submission.md](docs/level4-submission.md)

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
