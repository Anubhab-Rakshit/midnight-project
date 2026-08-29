<div align="center">

# 🌙 Omen

### A Cryptographic Premonition Registry

*Write your future in zero-knowledge. Seal it on-chain. Prove it without showing it.*

<br/>

[![Level 2 — First Thread](https://img.shields.io/badge/Level_2—First_Thread-FFD700?style=for-the-badge&labelColor=1a1a2e)]()
[![Midnight Network](https://img.shields.io/badge/Midnight_Network-0a0a0a?style=for-the-badge&logo=midnightnetwork&logoColor=white)]()
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)]()

<br/>

**[Live Demo](https://omen-midnight.vercel.app/)** · **[Contract on Preprod](https://explorer.preprod.midnight.network/contract/5b7dcd349113b6dc0a11caa89b9245dc701d43e1cf114fc99bd10acf8e930f6c)** · **[🎬 Video Demo](https://youtu.be/7kM8HDzJAeI)**

<br/>

</div>

---

## What is Omen?

Omen is a **Cryptographic Premonition Registry** built on the Midnight Network. It demonstrates **Observable Privacy Behavior** — a core concept in zero-knowledge systems.

### The Privacy Claim

> **Your premonition text never leaves your browser. Only a cryptographic commitment hash is stored on-chain.**

When you inscribe a premonition:
1. Your text + a random salt are **private witnesses** (never leave your device)
2. A SHA-256 hash is computed locally in a **ZK circuit**
3. Only the **commitment hash** is stored on the Midnight Preprod ledger
4. The original premonition **cannot be recovered** from the hash

This is **Observable Privacy Behavior** — you can *see* that privacy is being enforced (the hash exists on-chain) without being able to *break* it (the premonition is unrecoverable).

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

### 🔐 Observable Privacy Behavior
- **Private Witnesses**: Premonition text + salt never leave the browser
- **Public Commitment**: Only the SHA-256 hash is stored on-chain
- **ZK Proof**: Cryptographic guarantee that the hash matches the premonition

### 💳 Wallet Integration
- **Lace Wallet**: Connect/disconnect via Midnight DApp connector
- **Demo Mode**: Mock provider for testing without wallet extension

### 📊 Live Indexer
- **Real-time Data**: Fetches premonitions from Midnight Preprod indexer
- **Fallback Mode**: Mock data when indexer is unavailable

### 🎨 Awwwards-Level UI
- **3D Tilt Effects**: Framer Motion powered interactions
- **Matrix Decrypt**: Character-by-character reveal animation
- **Liquid Glass**: Translucent card effects
- **Custom Cursor**: Interactive magnetic hover states

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

---

## Project Structure

```
midnight-project/
├── contracts/
│   ├── premonition.compact          # Omen ZK contract source
│   ├── hello-world.compact          # Level 1 contract
│   └── managed/
│       ├── premonition/             # Compiled ZK artifacts
│       │   ├── compiler/            # Circuit metadata
│       │   ├── contract/            # TypeScript bindings
│       │   ├── keys/                # Prover/Verifier keys
│       │   └── zkir/                # ZK Intermediate Rep
│       └── hello-world/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Monolith.tsx         # Oracle (inscription UI)
│   │   │   ├── Chronicles.tsx       # Premonition gallery
│   │   │   ├── Navbar.tsx           # Navigation
│   │   │   ├── Footer.tsx           # Footer
│   │   │   ├── LiquidAura.tsx       # Background effects
│   │   │   ├── LiquidImage.tsx      # Image component
│   │   │   ├── CustomCursor.tsx     # Custom cursor
│   │   │   ├── Magnetic.tsx         # Magnetic hover
│   │   │   └── Preloader.tsx        # Loading screen
│   │   ├── context/
│   │   │   └── MidnightWalletContext.tsx  # Wallet state
│   │   ├── hooks/
│   │   │   ├── useOmenContract.ts   # Contract interaction
│   │   │   └── usePremonitions.ts   # Indexer queries
│   │   ├── App.tsx                  # Main app
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   └── vite.config.ts
├── src/
│   ├── omen/
│   │   ├── contract.ts              # Contract bindings
│   │   ├── witnesses.ts             # ZK witness providers
│   │   ├── private-state.ts         # Private state schema
│   │   ├── indexer.ts               # GraphQL queries
│   │   └── index.ts                 # Module exports
│   ├── deploy.ts                    # Preprod deployment
│   └── setup.ts                     # Devnet orchestrator
└── .midnight-state.json             # Network config
```

---

## The Contract

### `premonition.compact`

```compact
pragma language_version >= 0.22

// Private witnesses — never leave the client
var localPremonition: Field;
var localSalt: Field;

// Public ledger state — stored on-chain
ledger premonition_commitment: Bytes<32>;

// Seal circuit — generates commitment hash
export circuit seal(premonition: Opaque<"string">, salt: Opaque<"string">): [] {
    // Compute hash locally (private)
    localPremonition = hash(premonition);
    localSalt = hash(salt);
    
    // Store only the commitment on-chain
    premonition_commitment = hash(localPremonition, localSalt);
}

// Verify circuit — proves knowledge without revealing
export circuit verify(premonition: Opaque<"string">, salt: Opaque<"string">): [] {
    // Proves that the commitment matches without revealing inputs
    assert(hash(hash(premonition), hash(salt)) == premonition_commitment);
}
```

### Privacy Flow

```
┌──────────────────┐     ┌──────────────────┐
│  User Input      │     │  On-Chain State   │
│  (Private)       │     │  (Public)         │
├──────────────────┤     ├──────────────────┤
│  "I foresee..."  │ ──► │  commitment_hash  │
│  salt: 0x8f3a... │     │  0x7e8b9f2d1a... │
└──────────────────┘     └──────────────────┘
         │                        │
         │    ZK Circuit          │
         └───────────┬────────────┘
                     │
              Only hash is stored
              Premonition is LOST
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
| `npm run setup` | Start local devnet + compile + deploy |
| `npm run compile` | Compile Compact contracts |
| `npm run deploy -- --network preprod` | Deploy to Preprod |
| `npm run check-balance -- --network preprod` | Check wallet balance |
| `npm run test:e2e` | Run end-to-end tests |
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

- [x] Lace wallet connect / disconnect implemented
- [x] Circuit called successfully from frontend
- [x] Observable privacy behavior (premonition hash on-chain, text stays private)
- [x] Contract deployed to Preprod with verifiable address
- [x] Minimum 8 meaningful commits (13 total)
- [x] Public GitHub repository with README
- [x] Live demo link: [omen-midnight.vercel.app](https://omen-midnight.vercel.app/)
- [x] Demo video (live on-chain premonition): [youtu.be/7kM8HDzJAeI](https://youtu.be/7kM8HDzJAeI)
- [x] README documenting privacy claim
- [x] Contract deployed to Preprod: `5b7dcd349113b6dc0a11caa89b9245dc701d43e1cf114fc99bd10acf8e930f6c`

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

**Level 2 — First Thread** · Midnight Network Challenge 2026

*Built with 🌙 by [Anubhab Rakshit](https://github.com/Anubhab-Rakshit)*

</div>
