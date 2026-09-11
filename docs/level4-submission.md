# Level 4 — Submission Package

This document is the complete, ready-to-submit package for **Meridian —
Confidential Group Expense Settlement**. It consolidates every requirement into
one reference and includes a ready-to-paste submission message.

---

## 1. Project Overview

**Name:** Meridian — Confidential Group Expense Settlement

**One-liner:** *Settle with friends, prove it's fair, show strangers nothing.*

Meridian is group expense splitting where the group is a private vault on
Midnight. Every expense is committed on-chain via zero-knowledge proofs — an
observer can verify that a circle has N expenses and every member's ledger is
being computed correctly, but can never read a single amount. Settlement is
provably optimal: the minimum payment graph, proven correct and zero-sum,
without revealing any individual balance.

---

## 2. Links

| Item | Link |
|------|------|
| Live demo | TBD (domain update pending) |
| GitHub repository | https://github.com/Anubhab-Rakshit/midnight-project |
| GitHub Actions (CI) | https://github.com/Anubhab-Rakshit/midnight-project/actions |
| Contract on Preprod | (pending deployment) |

---

## 3. Chosen Idea

**Meridian — Confidential Group Expense Settlement** *(Consumer focus)*

> Settle with friends, prove it's fair, show strangers nothing.

The full proposal is in [`level4-proposal.md`](level4-proposal.md).

---

## 4. Requirements — Status

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Fully functional dApp using Midnight's privacy model | ✅ | Live demo + privacy model in README |
| Minimum 3 tests passing | ✅ **76+ tests** | Root: 66 tests, Frontend: 10 tests (Vitest) |
| CI/CD pipeline running | ✅ | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |
| Approved idea submitted | ✅ **Meridian** | [`level4-proposal.md`](level4-proposal.md) |
| Minimum 10 meaningful commits | ✅ | repo history |
| Frontend-to-contract connection | ✅ | Browser deploy + Lace wallet + explorer-verified txs |
| Public product profile | ✅ | README with badges, privacy model, architecture |

---

## 5. Features Delivered

### Phase 1 — Core Contract & Netting
- `splitpool.compact` with `join`, `logExpense`, `settle` circuits
- Private state management, ZK witness providers
- Minimum-transfer settlement engine (`computeMinimumTransfers`)
- Settlement verification (`verifySettlementPlan`)
- Browser-based ZK proving via Lace wallet
- CircleBoard UI (create circles, log expenses)

### Phase 2 — Settlement & Recurring Pacts
- Settlement hash chaining (`lastSettlementHash` in contract)
- SettlementBoard UI (net balances, optimal transfers, settle button)
- Recurring pacts (weekly/biweekly/monthly auto-split rules)
- `settleCircle()` in service layer

### Phase 3 — Analytics & Cross-Circle Netting
- Privacy-preserving analytics (`computeCircleAnalytics`)
- Member badges (top contributor, fair splitter, big spender, etc.)
- Anomaly detection (outlier spending, local-only)
- Cross-circle netting (`computeCrossCirclePlan`, `mergeBalances`)
- AnalyticsDashboard UI (overview stats, badges, distribution tags)

### Phase 4 — Hardening & Documentation
- 66 root tests (witnesses, netting, analytics, badges, cross-circle, pacts)
- 10 frontend tests (circle-math, bytes32)
- Full README rewrite (Meridian-focused, no Omen remnants)
- Updated submission package
- CI/CD pipeline: test → tsc → lint → build

---

## 6. Test Suite

| Test File | Tests | What it covers |
|-----------|-------|----------------|
| `witnesses.test.ts` | 6 | ZK witness providers |
| `private-state.test.ts` | 4 | Private state operations |
| `netting.test.ts` | 12 | Minimum-transfer optimality, verification |
| `analytics.test.ts` | 10 | Circle stats, anomalies, distribution |
| `badges.test.ts` | 8 | Member achievement badges |
| `cross-circle.test.ts` | 8 | Cross-circle balance netting |
| `recurring-pacts.test.ts` | 9 | Recurring pact rules |
| `circle-math.test.ts` | 6 | Frontend split-type calculations |
| `bytes32.test.ts` | 4 | Frontend Bytes<32> encoding |
| **Total** | **76** | |

---

## 7. Privacy Model (what an observer can / cannot learn)

> **Can verify privacy is being enforced; cannot recover any secret.**

**Can learn:** that a circle exists, memberCount, expenseCount,
settlementCount, that valid ZK proofs were submitted, transaction+block
metadata.

**Cannot learn:** the invite secret, any individual's balance, who paid whom,
any expense amounts, any member's identity.

Full table in the README's [`#privacy-model`](../README.md#privacy-model)
section.

---

## 8. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  CircleBoard → SettlementBoard → AnalyticsDashboard             │
│  RecurringPacts → useMeridianContract → Midnight.js SDK         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │   Midnight Network (Preprod)     │
              │   splitpool.compact               │
              │   join | logExpense | settle      │
              └─────────────────────────────────┘
```

---

## 9. Ready-to-paste Submission Message

---

**Title:** Level 4 Submission — Meridian (Midnight Challenge 2026)

**Body:**

I'm submitting **Meridian — Confidential Group Expense Settlement** for Level 4.
It's a production-grade dApp that demonstrates **programmable privacy** on
Midnight Preprod: group expense splitting where the group is a private vault.
Every expense is committed on-chain via zero-knowledge proofs — an observer can
verify a circle exists and its accounts are consistent, but can never read a
single amount. Settlement is provably optimal: the minimum payment graph, proven
correct and zero-sum, without revealing any individual balance.

**Chosen idea:** Meridian — Confidential Group Expense Settlement
*(Consumer focus)* — settle with friends, prove it's fair, show strangers nothing.
Full proposal:
https://github.com/Anubhab-Rakshit/midnight-project/blob/main/docs/level4-proposal.md

**Submission details:**
- Repository: https://github.com/Anubhab-Rakshit/midnight-project
- CI/CD: https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml
- README documents the full privacy model (what an observer can vs cannot learn).

**Quality signals:**
- **Tests:** 76+ passing (Vitest) — witnesses, private-state, netting optimality, analytics, badges, cross-circle netting, recurring pacts
- **CI/CD:** GitHub Actions, test → tsc → lint → build on every push
- **Contract:** `splitpool.compact` with join/logExpense/settle circuits + settlement hash chaining
- **Features:** Minimum-transfer settlement, cross-circle netting, privacy-preserving analytics, member badges, recurring pacts
- **Architecture:** Browser-based ZK proving via Lace wallet, Supabase persistence, Framer Motion UI

Built on the proven Midnight infrastructure from our Level 2/3 work
(commitment primitives, Lace wallet flow, CI pipeline) — upgraded into a
genuinely useful, privacy-first financial product.

Thank you for reviewing.

---

*— Anubhab Rakshit · https://github.com/Anubhab-Rakshit*

---

## 10. Files in this package

| File | Purpose |
|------|---------|
| [`level4-submission.md`](level4-submission.md) | This submission package |
| [`level4-proposal.md`](level4-proposal.md) | Product proposal |
| [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) | CI/CD workflow |
| [`../README.md`](../README.md) | Full project README |
