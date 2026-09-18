# Meridian — Security Model

## Overview

This document describes the security model, cryptographic invariants, and threat countermeasures for the Meridian privacy-preserving expense settlement system on Midnight Network.

---

## Security Properties

### 1. Invite Secret Confidentiality

**Property**: The invite secret is never revealed on-chain or to non-members.

**Implementation**:
- The secret is generated client-side and stored in `localStorage`
- Joining uses a ZK proof: `assert(inviteRoot == commitSecret(s, salt))`
- The proof reveals only that the prover knows a valid secret, not the secret itself

**Threat**: An observer sees a valid `join` proof and tries to extract the secret.

**Mitigation**: ZK proofs are zero-knowledge — they reveal nothing beyond the statement being proved. The secret remains in the prover's private memory.

### 2. Expense Amount Confidentiality

**Property**: Expense amounts are never stored on-chain.

**Implementation**:
- Expenses are logged via `logExpense()` which only increments `expenseCount`
- The actual amount is stored in Supabase (off-chain) and linked to a commitment hash
- No token transfer occurs during expense logging

**Threat**: An observer correlates `logExpense` transactions with off-chain data.

**Mitigation**: The on-chain state only shows a counter increment. There is no amount, no recipient, and no timestamp linking to a specific expense.

### 3. Settlement Integrity

**Property**: Settlements are provably correct and zero-sum.

**Implementation**:
- `settle()` ZK proof verifies membership and chains the settlement hash
- The settlement plan is computed off-chain using `computeMinimumTransfers()`
- `verifySettlementPlan()` checks that all nets sum to zero

**Threat**: A malicious member submits an incorrect settlement.

**Mitigation**: The ZK proof requires knowledge of the invite secret (proving membership). The settlement plan is verified off-chain before submission. The `lastSettlementHash` provides an audit trail.

### 4. Member Unlinkability

**Property**: On-chain transactions cannot be linked to specific members.

**Implementation**:
- ZK proofs are generated client-side with the user's private witnesses
- The wallet address is the only identifier, and it's the user's choice to share it
- Shielded transactions (ZSwap) hide token movements

**Threat**: An observer correlates multiple transactions from the same address.

**Mitigation**: This is by design — the wallet address is the user's public identity. However, the address reveals nothing about the user's expenses, balances, or identity within the circle.

---

## Circuit Invariants

### `join` Circuit

```
assert(inviteRoot == commitSecret(s, salt))
```

- **Invariant**: Only someone who knows the secret that produced `inviteRoot` can join
- **Soundness**: The proof cannot be forged without the secret
- **Zero-knowledge**: The proof reveals nothing about `s` or `salt`

### `logExpense` Circuit

```
assert(inviteRoot == commitSecret(s, salt))
expenseCount.increment(1)
```

- **Invariant**: Only circle members can log expenses
- **Soundness**: The proof cannot be forged without membership
- **Zero-knowledge**: The proof reveals nothing about the expense amount

### `settle` Circuit

```
assert(inviteRoot == commitSecret(s, salt))
lastSettlementHash = disclose(sh)
settlementCount.increment(1)
```

- **Invariant**: Only circle members can trigger settlement
- **Soundness**: The settlement hash is correctly chained
- **Auditability**: Previous settlement hashes are preserved for verification

---

## Attack Mitigations

### Front-Running

**Risk**: An attacker sees a `join` transaction and tries to front-run it.

**Mitigation**: The invite secret is required to generate a valid proof. Without it, the attacker cannot produce a valid `join` proof.

### Replay Attacks

**Risk**: An attacker replays a valid `join` proof to join multiple times.

**Mitigation**: The contract tracks `memberCount` and the private state tracks membership. Each proof is bound to a specific contract instance.

### Amount Brute-Force

**Risk**: An attacker tries all possible amounts to find which one matches a commitment hash.

**Mitigation**: The salt is 256-bit random. Even if the amount space is small (e.g., $0.01 to $10,000), the salt makes brute-force infeasible ($2^{256}$ possibilities).

### collusion

**Risk**: Multiple observers collude to reconstruct private data.

**Mitigation**: Each member only knows their own expenses. Collusion between observers reveals nothing beyond what a single observer sees. The invite secret is per-member and not shared.

### Side-Channel Attacks

**Risk**: An attacker observes timing, network patterns, or other side channels.

**Mitigation**: All ZK proofs are generated client-side. The only on-chain interaction is the proof submission, which is constant-time regardless of the private data.

---

## Disclosure Policy

| Data | Disclosure |
|------|-----------|
| Contract address | Public (for verification) |
| Invite secret | Shared with circle members only |
| Expense amounts | Circle members only (off-chain) |
| Settlement plan | Computed off-chain, never disclosed |
| Member wallet addresses | User's choice to share |
| ZK proofs | Public (for verification) |

---

## Security Assumptions

1. **Trusted setup**: The ZK circuit compilation is performed by the developer. The proving and verification keys are generated by the Midnight proof server.
2. **Client-side security**: The user's device is not compromised. The secret is stored in `localStorage` which is accessible only to the browser.
3. **Network security**: The Midnight network and indexer are honest. Transactions are not censored or reordered.
4. **Wallet security**: The user's wallet (1 AM / Lace) is not compromised. The wallet handles signing and transaction submission.

---

## Recommendations for Users

1. **Never share your invite secret** with anyone outside the circle
2. **Use a hardware wallet** if available for maximum security
3. **Verify the contract address** before joining a circle
4. **Check transaction history** in your wallet for unexpected activity
5. **Report suspicious behavior** to the circle creator
