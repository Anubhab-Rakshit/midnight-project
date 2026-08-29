# 🌓 Level 3 — First Quarter Submission Package

This document is the complete, ready-to-submit package for the **Midnight Network
Challenge 2026 — Level 3 (First Quarter)**. It consolidates every requirement into
one reference and includes a ready-to-paste submission message that works on any
channel (form, email, forum, or Discord).

---

## 1. Project Overview

**Name:** Omen — A Cryptographic Premonition Registry

**One-liner:** *Write your future in zero-knowledge. Seal it on-chain. Prove it
without showing it.*

Omen demonstrates **Observable Privacy Behavior** on Midnight Preprod: a user
seals a secret prediction on-chain such that **only a cryptographic commitment
hash is public**, while the premonition text and its salt never leave the device.
A zero-knowledge circuit proves the commitment without revealing the secret.

---

## 2. Links

| Item | Link |
|------|------|
| Live demo | https://omen-midnight.vercel.app/ |
| Demo video (1 min) | https://youtu.be/7kM8HDzJAeI |
| GitHub repository | https://github.com/Anubhab-Rakshit/midnight-project |
| GitHub Actions (CI) | https://github.com/Anubhab-Rakshit/midnight-project/actions |
| Deployed Preprod contract | `5b7dcd349113b6dc0a11caa89b9245dc701d43e1cf114fc99bd10acf8e930f6c` |
| Example on-chain premonition tx | https://explorer.preprod.midnight.network/transactions/e765f0402df04ac3e0330192e86fd7ca225c4f10165d57057e9c791eade7c510 |

---

## 3. Chosen Idea (from the provided list)

**Private Allowlist Access** *(also framed as **Confidential Credentials**)*

> Prove membership without revealing identity.

The product proposal is in [`level3-proposal.md`](level3-proposal.md). It directly
extends Omen's already-working commitment/privacy primitive into a private
allowlist gate: prove "I hold a valid credential in the set" without disclosing
which one, your identity, or any attribute.

---

## 4. Requirements to Pass — Status

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Fully functional dApp using Midnight's privacy model | ✅ | Live demo + privacy model section |
| Minimum 3 tests passing | ✅ **13 tests** | [`test-results.md`](test-results.md) |
| CI/CD pipeline running (workflow + passing runs) | ✅ | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) + passing run |
| Approved idea submitted from provided list | ✅ **Private Allowlist Access** | [`level3-proposal.md`](level3-proposal.md) |
| Minimum 10 meaningful commits | ✅ **33 commits** | repo history |

---

## 5. Submission Checklist — Status

| Checklist Item | Status | Where |
|----------------|--------|-------|
| Public GitHub repository with complete README | ✅ | [README](../README.md) |
| Live demo link | ✅ | https://omen-midnight.vercel.app/ |
| Screenshot: test output (3+ passing) | ✅ | [`test-results.md`](test-results.md) |
| CI/CD badge or workflow with passing runs | ✅ | README badge + [CI run](https://github.com/Anubhab-Rakshit/midnight-project/actions) |
| Demo video (1 minute) | ✅ | https://youtu.be/7kM8HDzJAeI |
| README "privacy model" section | ✅ | README → `#privacy-model` |
| Product proposal submitted for approval | ✅ (ready) | [`level3-proposal.md`](level3-proposal.md) |
| Minimum 10 meaningful commits | ✅ **33 commits** | repo history |

---

## 6. Test Output (13 passing)

```
 Test Files  3 passed (3)
      Tests  13 passed (13)
```

Breakdown — [`test-results.md`](test-results.md):

- **Root** (`src/omen`) — 9 tests
  - `witnesses.test.ts` (6): `localPremonition` Bytes<32> padding/truncation/
    exact/identity, `localSalt` valid-32 / length-guard throw
  - `private-state.test.ts` (3): serialize/deserialize round-trip, salt hex
    encoding, initial-state factory
- **Frontend** (`src/lib`) — 4 tests
  - `bytes32.test.ts` (4): `toBytes32` exact 32 bytes, zero-padding, truncation,
    multibyte UTF-8 at the 32-byte boundary

Run locally:

```bash
npm test                 # root
cd frontend && npm test  # frontend
```

---

## 7. CI/CD

`.github/workflows/ci.yml` runs on **every push/PR to `main`**:

1. Install root + frontend dependencies (`npm ci`)
2. **Test** — root + frontend Vitest suites
3. **Typecheck** — `tsc --noEmit` (root), `tsc -b` (frontend)
4. **Lint** — `oxlint`
5. **Build** — `vite build`
6. *Optional:* Compact contract-compile job (`compile:premonition`)

Result: **passing run** — https://github.com/Anubhab-Rakshit/midnight-project/actions
Badge in the README reflects this.

---

## 8. Privacy Model (what an observer can / cannot learn)

> **Can verify privacy is being enforced; cannot recover the secret.**

**Can learn:** that a premonition exists, that a valid ZK proof was submitted,
the commitment hash, `sealedCount`, contract address, transaction+block metadata.

**Cannot learn:** the premonition text (private witness), the salt (32-byte
private witness), the original input from the hash (one-way SHA-256), or which
identity sealed it.

Full table in the README's [`#privacy-model`](../README.md#privacy-model) section.

---

## 9. Ready-to-paste Submission Message

Use this on any channel (form, email, forum, or Discord). Replace `[CHANNEL]`/
`[YOUR NAME]` as needed.

---

**Title:** Level 3 — First Quarter Submission — Omen (Midnight Challenge 2026)

**Body:**

I'm submitting **Omen — A Cryptographic Premonition Registry** for Level 3
(First Quarter). It's a polished, production-grade dApp that demonstrates
**Observable Privacy Behavior** on Midnight Preprod: a user seals a secret
prediction on-chain such that only a cryptographic commitment hash is public,
while the premonition and its salt never leave the device — a ZK circuit proves
the commitment without revealing the secret.

**Chosen idea (from the provided list): Private Allowlist Access**
(Confidential Credentials) — prove membership without revealing identity. It
directly extends Omen's already-working commitment primitive. Full proposal:
https://github.com/Anubhab-Rakshit/midnight-project/blob/main/docs/level3-proposal.md

**Submission details:**
- Live demo: https://omen-midnight.vercel.app/
- Demo video (1 min): https://youtu.be/7kM8HDzJAeI
- Repository: https://github.com/Anubhab-Rakshit/midnight-project
- Deployed Preprod contract: `5b7dcd349113b6dc0a11caa89b9245dc701d43e1cf114fc99bd10acf8e930f6c`
- Example on-chain tx: https://explorer.preprod.midnight.network/transactions/e765f0402df04ac3e0330192e86fd7ca225c4f10165d57057e9c791eade7c510

**Quality signals:**
- **Tests:** 13 passing (Vitest) — https://github.com/Anubhab-Rakshit/midnight-project/blob/main/docs/test-results.md
- **CI/CD:** GitHub Actions, passing on every push — https://github.com/Anubhab-Rakshit/midnight-project/actions/workflows/ci.yml
- **README** documents the full privacy model (what an observer can vs cannot learn).
- 33 meaningful commits.

Winning-quality, production-grade, privacy-first. Thank you for reviewing.

---

*— [YOUR NAME] · [YOUR CONTACT]*

---

## 10. Files in this package

| File | Purpose |
|------|---------|
| [`level3-submission.md`](level3-submission.md) | This submission package |
| [`level3-proposal.md`](level3-proposal.md) | Chosen idea — product proposal |
| [`test-results.md`](test-results.md) | Test output evidence (screenshot-equivalent) |
| [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml) | CI/CD workflow |
| [`../README.md`](../README.md) | Full project README |
