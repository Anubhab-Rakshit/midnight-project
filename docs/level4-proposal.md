# Level 4 — Product Proposal

## Chosen Idea: Meridian — Confidential Group Expense Settlement

*"Settle with friends, prove it's fair, show strangers nothing."*

---

### 1. Problem

Splitting money with friends is the most-used social-finance ritual on earth —
dinners, trips, rent, group purchases. Every product that solves it (Splitwise,
and on-chain apps on public ledgers) inherits the same hard ceiling: **every
amount is visible to anyone watching.**

A public chain reveals your entire social-spending graph — who you eat with, how
much you spend, who you owe. A corporate server collects and monetizes it.
Neither is acceptable in a private, self-sovereign world.

---

### 2. The Midnight Solution (Programmable Privacy)

Meridian is group expense splitting where the group is a **private vault** on
Midnight:

- **Money stays hidden.** Every expense is committed on-chain via ZK — an
  observer can verify that a circle has 14 expenses and every member's ledger is
  being computed correctly, but can never read a single amount. Only members
  holding the circle key see what they need.
- **Joining doesn't out you.** Membership is proven by knowledge of the invite in
  zero knowledge — outsiders can't even tell who is in the circle, let alone who
  owes whom.
- **Settlement is provably fair.** The signature of Splitwise-class products is
  "settle with the fewest transfers." Meridian makes that a *cryptographic fact*:
  at settle-night, an engine computes the minimum transaction graph and a Compact
  circuit proves on-chain that every committed balance is preserved, the graph
  nets each person to exactly zero, and it uses the fewest possible transfers —
  while no participant's balance is ever exposed.

---

### 3. How it builds on the existing project

The Level 2/3 `premonition.compact` contract already has:

- A `seal` circuit that commits a secret via `persistentHash` (domain-separated),
- A `verify` circuit that proves knowledge **without disclosing** the input,
- Private witnesses that never leave the client,
- Browser-based proof generation + Lace submission on Preprod,
- A live React frontend, Supabase persistence, and CI-ready monorepo.

Meridian reuses all of this: the commitment primitive becomes the circle vault,
the invite secret replaces the premonition, and the settlement circuit extends
the verification pattern into a new, genuinely useful proof.

---

### 4. What an observer can and cannot learn

| Concept | Observer can verify | Observer cannot learn |
|---------|--------------------|------------------------|
| Circle exists | inviteRoot on-chain, memberCount, expenseCount | The invite secret, who is in the circle |
| Proof validity | A valid ZK proof was submitted for join/expense/settle | Which member proved what, or any amounts |
| Settlement | The settlement round completed, settlementCount incremented | Who paid whom, how much, individual balances |
| On-chain record | Transaction hash, block height, timestamps | Any private input behind the commitment |

---

### 5. Deliverables this cycle

- **Contract:** `splitpool.compact` with join/logExpense/settle circuits + settlement hash chaining on Preprod.
- **Netting engine:** Minimum-transfer settlement, settlement verification, cross-circle netting.
- **Analytics:** Privacy-preserving circle stats, member badges, anomaly detection.
- **Recurring pacts:** Weekly/biweekly/monthly auto-split rules with Supabase persistence.
- **Tests (Vitest):** 66 root tests + 10 frontend tests — witnesses, netting, analytics, badges, cross-circle, pacts.
- **CI/CD (GitHub Actions):** test → typecheck → lint → build on every push, plus optional Compact contract-compile job.
- **Polished frontend:** CircleBoard, SettlementBoard, RecurringPacts, AnalyticsDashboard — Framer Motion UI.
- **Supabase persistence:** circles, expenses, settlements, recurring pacts — raw amounts stored only in client-side private state.

---

### 6. What was built

| Phase | Status | Details |
|-------|--------|---------|
| Phase 1 | ✅ Complete | Core contract, netting engine, CircleBoard, CI/CD |
| Phase 2 | ✅ Complete | SettlementBoard, settlement hash chaining, recurring pacts |
| Phase 3 | ✅ Complete | Analytics, badges, cross-circle netting, AnalyticsDashboard |
| Phase 4 | ✅ Complete | Hardening, 76+ tests, README rewrite, documentation |

---

### 7. Product direction & future

- **Phase 1–4 (completed):** Private circles + ZK invite-join + expense commitments + provably-optimal settlement + recurring pacts + analytics + cross-circle netting.
- **Next:** Contract compilation (requires `compact` CLI + proof-server), Preprod deployment, Vercel domain setup.
- **Future:** Stablecoin settlement rails, auditor/verifier API, security review.

**Idea submitted for approval:** Meridian — Confidential Group Expense
Settlement. Category: **Consumer focus**.
