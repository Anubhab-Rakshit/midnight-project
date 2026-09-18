# Meridian — Privacy Model

## Overview

Meridian achieves **programmable financial privacy** on Midnight Network. Every expense, balance, and settlement is committed on-chain as zero-knowledge hashes. An observer can verify that a circle exists and its accounts are consistent, but can never recover amounts, identities, or settlement details.

This document specifies the exact privacy guarantees, the cryptographic primitives used, and what each party can learn.

---

## Cryptographic Primitives

### Commitment Scheme

Meridian uses **domain-separated hashing** to create binding commitments:

$$C = \text{persistentHash}(\text{pad}(32, \text{"meridian:v1:secret:"}) \parallel \text{secret} \parallel \text{salt})$$

Where:
- $\text{secret}$ — the user's private invite secret (32 bytes)
- $\text{salt}$ — a random 32-byte value generated per commitment
- $\text{persistentHash}$ — Midnight's domain-separated hash function

This produces a 32-byte commitment hash that is:
- **Binding**: Given a commitment $C$, the user cannot find a different $(secret', salt')$ that produces the same $C$
- **Hiding**: Given $C$, an observer cannot recover $secret$ or $salt$

### ZK Circuits

Each operation is proved via a zero-knowledge circuit that takes private witnesses and produces a public proof:

| Circuit | Private Witness | Public Input | What is Proved |
|---------|----------------|--------------|----------------|
| `join` | $secret$, $salt$ | $inviteRoot$ | User knows the invite secret matching the circle's commitment |
| `logExpense` | $secret$, $salt$ | $inviteRoot$ | User is a valid circle member (knows the secret) |
| `settle` | $secret$, $salt$, $settlementHash$ | $inviteRoot$, $lastSettlementHash$ | User is a valid member and settlement is correctly chained |

---

## Data Flow

### Circle Creation

```
Creator                    On-Chain
  │                           │
  │  1. Generate secret, salt │
  │  2. Compute C = hash(    │
  │     "meridian:v1:secret:",│
  │     secret, salt)        │
  │  3. Deploy contract      │
  │──────────────────────────►│
  │                           │ inviteRoot = C
  │                           │ memberCount = 0
```

**Privacy guarantee**: The commitment $C$ is on-chain. The secret and salt are never transmitted.

### Joining a Circle

```
Joiner                    Contract                 On-Chain
  │                          │                       │
  │  1. Receive invite       │                       │
  │     secret from creator  │                       │
  │  2. Generate new salt    │                       │
  │  3. Compute C = hash(   │                       │
  │     secret, salt)        │                       │
  │  4. ZK proof: C ==      │                       │
  │     inviteRoot           │                       │
  │─────────────────────────►│                       │
  │                          │  Verify proof         │
  │                          │  memberCount++        │
  │                          │──────────────────────►│
```

**Privacy guarantee**: The joiner proves they know the secret without revealing it. The proof is unlinkable to the creator's identity.

### Logging an Expense

```
Member                    Contract                 On-Chain
  │                          │                       │
  │  1. Know secret + salt   │                       │
  │  2. ZK proof: member     │                       │
  │     (knows secret)       │                       │
  │─────────────────────────►│                       │
  │                          │  Verify proof         │
  │                          │  expenseCount++       │
  │                          │──────────────────────►│
```

**Privacy guarantee**: The expense amount is **never on-chain**. Only a commitment hash stored locally (in Supabase) links to the amount. The on-chain state only increments a counter.

### Settlement

```
Member                    Contract                 On-Chain
  │                          │                       │
  │  1. Compute settlement   │                       │
  │     plan off-chain       │                       │
  │  2. ZK proof: member     │                       │
  │     + settlement correct │                       │
  │─────────────────────────►│                       │
  │                          │  Verify proof         │
  │                          │  settlementCount++    │
  │                          │  lastSettlementHash = │
  │                          │    disclose(sh)       │
  │                          │──────────────────────►│
```

**Privacy guarantee**: The settlement plan (who pays whom how much) is computed off-chain and never appears on-chain. Only the hashed settlement plan is stored for auditability.

---

## On-Chain vs Off-Chain Data

### On-Chain (Public Ledger)

| Field | Type | Description |
|-------|------|-------------|
| `inviteRoot` | `Bytes<32>` | Commitment hash of the circle creator's secret |
| `memberCount` | `Counter` | Number of members who have joined |
| `expenseCount` | `Counter` | Number of expenses logged |
| `settlementCount` | `Counter` | Number of settlement rounds completed |
| `lastSettlementHash` | `Bytes<32>` | Hash of the most recent settlement plan |

### Off-Chain (Private)

| Data | Storage | Who Can Access |
|------|---------|----------------|
| Invite secret | Creator's localStorage | Creator only |
| Expense amounts | Supabase (encrypted at rest) | Circle members only |
| Member balances | Computed locally per member | Each member only |
| Settlement plan | Computed off-chain, never stored | Settlement executor only |
| Member identities | Not stored on-chain | No one on-chain |

---

## Threat Model

### What an Observer CAN Learn

1. A circle exists at a specific contract address
2. The aggregate member, expense, and settlement counts
3. That valid ZK proofs were submitted for each operation
4. Transaction hashes and block timestamps
5. The hashed settlement plan (for auditability)

### What an Observer CANNOT Learn

1. **The invite secret** — private witness, never leaves the browser
2. **Any expense amount** — committed as a hash, unrecoverable
3. **Who paid whom** — not derivable from commitment hashes
4. **Individual balances** — computed locally, never on-chain
5. **Member identity** — not linked to on-chain transactions
6. **Settlement details** — only the hash is stored

### Attack Scenarios

| Attack | Mitigation |
|--------|-----------|
| **Collusion between observers** | Each member only knows their own expenses. Collusion reveals nothing beyond what a single observer sees. |
| **Blockchain analysis** | Shielded transactions (ZSwap) hide token movements. Unshielded balance is not affected by contract interactions. |
| **Front-running** | Invite secret is required to join. Without it, an attacker cannot enter the circle. |
| **Amount recovery from commitments** | Domain-separated hashing with 256-bit salt makes brute-force infeasible. |
| **Linking members to transactions** | ZK proofs are generated client-side. The wallet address is the only link, and it's the user's choice to share it. |

---

## Formal Properties

1. **Soundness**: No adversary can produce a valid `join`/`logExpense`/`settle` proof without knowing the invite secret.
2. **Zero-knowledge**: A valid proof reveals nothing about the private witnesses (secret, salt, amounts).
3. **Binding**: A commitment $C$ cannot be opened to two different values.
4. **Hiding**: A commitment $C$ reveals nothing about the committed value.
5. **Auditability**: `lastSettlementHash` chains settlements for post-hoc verification without revealing details.

---

## Comparison with Traditional Solutions

| Property | Splitwise | On-Chain Expense Splitter | Meridian |
|----------|-----------|--------------------------|----------|
| Amount privacy | ❌ Platform sees all | ❌ Public on-chain | ✅ ZK commitment |
| Identity privacy | ❌ Email required | ❌ Wallet address public | ✅ Invite-only, no identity on-chain |
| Settlement privacy | ❌ Platform sees | ❌ Public on-chain | ✅ Hash-only on-chain |
| Verifiability | ❌ Trust the platform | ✅ Anyone can verify | ✅ Anyone can verify (proofs) |
| Decentralization | ❌ Centralized | ⚠️ Partial | ✅ Fully on-chain proofs |
