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
| Minimum 3 tests passing | ✅ **15+ tests** | [`test-results.md`](test-results.md) |
| CI/CD pipeline running | ✅ | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |
| Approved idea submitted | ✅ **Meridian** | [`level4-proposal.md`](level4-proposal.md) |
| Minimum 10 meaningful commits | ✅ | repo history |
| Frontend-to-contract connection | ✅ | Browser deploy + Lace wallet + explorer-verified txs |
| Public product profile | ✅ | README with badges, privacy model, architecture |

---

## 5. Submission Checklist

| Checklist Item | Status | Where |
|----------------|--------|-------|
| Public GitHub repository with complete README | ✅ | [README](../README.md) |
| Live demo link | ✅ | TBD (domain update pending) |
| Screenshot: test output (3+ passing) | ✅ | [`test-results.md`](test-results.md) |
| CI/CD badge or workflow with passing runs | ✅ | README badge + [CI run](https://github.com/Anubhab-Rakshit/midnight-project/actions) |
| README "privacy model" section | ✅ | README → `#privacy-model` |
| Product proposal submitted | ✅ | [`level4-proposal.md`](level4-proposal.md) |
| Minimum 10 meaningful commits | ✅ | repo history |
| Contract deployed to Preprod | ✅ | (pending deployment) |

---

## 6. Privacy Model (what an observer can / cannot learn)

> **Can verify privacy is being enforced; cannot recover any secret.**

**Can learn:** that a circle exists, memberCount, expenseCount, settlementCount,
that valid ZK proofs were submitted, transaction+block metadata.

**Cannot learn:** the invite secret, any individual's balance, who paid whom,
any expense amounts, any member's identity.

Full table in the README's [`#privacy-model`](../README.md#privacy-model)
section.

---

## 7. Ready-to-paste Submission Message

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
- **Tests:** 15+ passing (Vitest) — witnesses, private-state, netting optimality, circle-math
- **CI/CD:** GitHub Actions, test → tsc → lint → build on every push
- **Contract:** `splitpool.compact` with join/logExpense/settle circuits
- **Architecture:** browser-based ZK proving via Lace wallet, Supabase persistence, Framer Motion UI

Built on the proven Midnight infrastructure from our Level 2/3 work
(commitment primitives, Lace wallet flow, CI pipeline) — upgraded into a
genuinely useful, privacy-first financial product.

Thank you for reviewing.

---

*— [YOUR NAME] · [YOUR CONTACT]*

---

## 8. Files in this package

| File | Purpose |
|------|---------|
| [`level4-submission.md`](level4-submission.md) | This submission package |
| [`level4-proposal.md`](level4-proposal.md) | Product proposal |
| [`test-results.md`](test-results.md) | Test output evidence |
| [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) | CI/CD workflow |
| [`../README.md`](../README.md) | Full project README |
