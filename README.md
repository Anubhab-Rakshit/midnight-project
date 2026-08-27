# Midnight Hello World - Level 1: New Moon

A privacy-first smart contract built on the Midnight Network using the Compact language. This project demonstrates zero-knowledge proof capabilities with public ledger state and private witness patterns.

## Project Overview

This is a **Level 1 — New Moon** submission for the Midnight Network challenge. It includes:

- A Compact smart contract (`hello-world.compact`) with public ledger state
- Compiled ZK circuits and cryptographic keys
- Deployment configuration for Preview/Preprod testnets
- Full toolchain setup documentation

## Quick Start

### Prerequisites

- **Node.js 22+** (`nvm install 22`)
- **Docker Desktop** (running with Docker Compose v2)
- **Compact compiler** (installed via Midnight toolchain)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Anubhab-Rakshit/midnight-project.git
cd midnight-project

# 2. Install Compact compiler (if not installed)
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update

# 3. Install project dependencies
npm install

# 4. Start local devnet (Docker required)
npm run setup

# 5. Test the contract
npm run test:e2e
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | One-shot: start devnet, compile, deploy |
| `npm run compile` | Compile the Compact contract |
| `npm run deploy` | Deploy compiled contract to local devnet |
| `npm run cli` | Interactive CLI to call circuits |
| `npm run check-balance` | Check NIGHT and DUST balances |
| `npm run test:e2e` | Run end-to-end tests |

## The Smart Contract

### Public State vs Private Witness

Midnight's Compact language enables **selective privacy** — you control exactly what becomes public on the blockchain.

#### Public Ledger State (`ledger`)

```compact
export ledger message: Opaque<"string">;
```

- **What it is**: A state variable stored on the blockchain
- **Visibility**: **Public** — anyone can read this value
- **Use case**: Data you want transparent (e.g., contract address, public announcements, verified hashes)

#### Private Witness (`circuit` parameters)

```compact
export circuit storeMessage(customMessage: Opaque<"string">): [] {
    message = disclose(customMessage);
}
```

- **What it is**: Input parameters to circuit functions
- **Visibility**: **Private by default** — not visible on-chain unless explicitly disclosed
- **Use case**: Sensitive data (e.g., personal information, secrets, private keys)

#### The `disclose()` Function

The `disclose()` function is the **privacy bridge** — it deliberately marks private data as safe to store publicly:

```compact
message = disclose(customMessage);
```

Without `disclose()`, assigning a private parameter directly to a ledger field causes a **compiler error**. This forces developers to make explicit privacy decisions.

### How It Works

1. **Input**: User provides `customMessage` (private)
2. **Processing**: Circuit evaluates the logic
3. **Output**: If `disclose()` is used, the value becomes public ledger state
4. **Result**: `message` is now readable by anyone on the blockchain

## Compilation Output

The contract compiles to:

```
contracts/managed/hello-world/
├── compiler/          # Compiler metadata
├── contract/          # TypeScript types + JS implementation
├── keys/              # ZK proving/verifying keys
│   ├── storeMessage.prover
│   └── storeMessage.verifier
└── zkir/              # Zero-Knowledge Intermediate Representation
```

### Compilation Command

```bash
cd contracts
compact compile hello-world.compact managed/hello-world
```

Expected output:
```
Compiling 1 circuits:
  circuit "storeMessage" (k=6, rows=26)
```

### Screenshots

#### Toolchain Verification
```
🌙 Midnight Toolchain Verification
==================================

1. Checking Node.js...
   ✅ Node.js: v22.15.1
   ✅ Version 22+ confirmed

2. Checking Docker...
   ✅ Docker: 29.4.0
   ✅ Docker Compose v2: v5.1.1

3. Checking Compact compiler...
   ✅ Compact CLI: compact 0.5.2
   ✅ Compiler: 0.34.0

4. Checking contract compilation...
   ✅ Contract compiled
   📁 Output: contracts/managed/hello-world/

==================================
Verification complete!
```

#### Successful Compile Output
```
$ compact compile hello-world.compact managed/hello-world
Compiling 1 circuits:
```

#### Compiled Contract Structure
```
contracts/managed/hello-world/
├── compiler/
│   ├── contract-info.json
│   └── contract-manifest.json
├── contract/
│   ├── index.d.ts
│   ├── index.js
│   └── index.js.map
├── keys/
│   ├── storeMessage.prover
│   └── storeMessage.verifier
└── zkir/
    ├── storeMessage.bzkir
    └── storeMessage.zkir
```

## Network Configuration

| Network | Purpose | Faucet |
|---------|---------|--------|
| `undeployed` | Local devnet (default) | N/A — pre-funded |
| `preview` | Public preview testnet | [Preview Faucet](https://midnight-tmnight-preview.nethermind.dev) |
| `preprod` | Public preprod testnet | [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev) |

### Deploy to Preprod

```bash
# 1. Start proof server
npm run proof-server:start

# 2. Deploy to Preprod (will prompt for wallet setup)
npm run deploy -- --network preprod

# 3. Fund wallet via faucet (URL shown in output)

# 4. Wait for confirmation, then verify
npm run check-balance -- --network preprod
```

## Initial Product Idea

**Privacy-First Voting Platform**: A decentralized voting system where voters can prove eligibility (e.g., token ownership, DAO membership) without revealing their identity. The contract would maintain:
- **Public state**: Total vote counts, proposal hashes, deadline timestamps
- **Private witnesses**: Individual votes, voter credentials, vote choices

Using Midnight's `disclose()` selectively, votes could be proven valid (ZK proof) while keeping voter identity hidden. This enables anonymous but verifiable governance — perfect for DAOs, community decisions, or any scenario requiring privacy-preserving consensus.

## Project Structure

```
midnight-project/
├── contracts/
│   ├── hello-world.compact          # Compact source
│   └── managed/hello-world/         # Compiled output
│       ├── compiler/
│       ├── contract/
│       ├── keys/
│       └── zkir/
├── src/
│   ├── network.ts                   # Network selection
│   ├── wallet.ts                    # Wallet construction
│   ├── setup.ts                     # Orchestrator
│   ├── deploy.ts                    # Deployment logic
│   ├── cli.ts                       # Interactive CLI
│   └── check-balance.ts             # Balance checker
├── scripts/
│   └── e2e-check.ts                 # End-to-end tests
├── docker-compose.yml               # Local devnet
└── package.json
```

## Resources

- [Midnight Documentation](https://docs.midnight.network)
- [Compact Language Guide](https://docs.midnight.network/compact)
- [Hello World Tutorial](https://docs.midnight.network/getting-started/hello-world)
- [Example Repository](https://github.com/midnightntwrk/example-hello-world)

## License

Apache-2.0

---

**Level 1 — New Moon** | Midnight Network Challenge 2026
