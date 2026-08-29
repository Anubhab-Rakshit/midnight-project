# Level 3 — Product Proposal

## Chosen Idea: Private Allowlist Access / Confidential Credentials

*"Prove membership without revealing identity."*

---

### 1. Problem

Membership and credential checks today are all-or-nothing reveals. To prove you
are on an allowlist, are of age, hold a valid credential, or belong to an
organization, you typically hand over — and the verifier retains — the very
datum that identifies you (an email, a wallet address, a full credential).

This forces a false choice:

- **Reveal everything** to prove one property (over-sharing, linkable, a honeypot),
- **Show nothing** and be denied access.

Neither is acceptable in a private, self-sovereign world.

---

### 2. The Midnight Solution (Observable Privacy)

Omen already demonstrates the core mechanism on Preprod: a user commits to a
secret on-chain such that **only the commitment hash is public**, while the
secret (premonition text) never leaves the device. A ZK proof proves knowledge
of the secret **without revealing it**.

We extend this exact, already-working primitive into a production-grade **private
allowlist / confidential credential gate**:

- A trusted issuer publishes a **commitment** of each credential (or the root of
  a Merkle allowlist) on-chain.
- A user who actually holds a matching credential generates a ZK circuit proof
  showing **"I hold a valid credential in the set"** — without disclosing *which*
  one, their identity, or any attribute.
- The verifier checks the ZK proof and grants access. Anyone can *observe* that
  the proof is valid (it is on-chain), but nobody can learn who proved what.

This is **observable privacy behavior**: you can verify a proof exists and is
valid, but you cannot learn the private inputs behind it.

---

### 3. How it builds on the existing project

The Level 2 `premonition.compact` contract already has:

- A `seal` circuit that commits a secret via `persistentHash` (domain-separated),
- A `verify` circuit that proves knowledge **without disclosing** the input,
- Private witnesses that never leave the client,
- Browser-based proof generation + Lace submission on Preprod,
- A live React frontend, Supabase persistence, and CI-ready monorepo.

The allowlist gate reuses all of this: swap "premonition" for "credential" and
the membership proof for the commitment check. The privacy model is identical;
the application surface is a real, defensible product.

---

### 4. What an observer can and cannot learn

| Concept | Observer can verify | Observer cannot learn |
|---------|--------------------|------------------------|
| Proof validity | A valid ZK proof was submitted and accepted | The credential/premonition behind it |
| Membership | That *some* valid member accessed | Which member, or their identity |
| On-chain record | Commitment hash + proof exists (block, height) | The secret value, salt, or address linkage |
| Issuance | That *a* credential is registered | Who holds it, or its attributes |

---

### 5. Deliverables this cycle

- **Tests (Vitest, 13 passing):** witness encoding, Bytes<32> padding, private
  state serialization round-trip — deterministic, no chain needed.
- **CI/CD (GitHub Actions):** `test → typecheck → lint → build` on every push,
  plus an optional Compact contract-compile job. Badge in README.
- **Polished build:** production `vite build`, tsc-clean, oxlint-clean.
- **README privacy model section** documenting the observer model above.

---

### 6. Product direction & future

- **Phase 1 (this cycle):** proof-of-concept allowlist gate reusing the Omen
  commitment primitive; full test + CI discipline.
- **Phase 2:** a dedicated `allowlist.compact` circuit with a Merkle root,
  `proveMembership()`/`proveAttribute()` circuits, and multiple issuers.
- **Phase 3:** confidential credentials (age/eligibility thresholds proven via
  range proofs) and a reusable "credential wallet" in Lace.

**Idea submitted for approval** from the Level 3 provided list: **Private
Allowlist Access** (also framed as **Confidential Credentials**).
