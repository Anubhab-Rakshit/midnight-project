# Test Results — Vitest

13 tests passing (root 9 + frontend 4). Run in CI on every push.

## Root (`npm test`) — src/omen

- src/omen/witnesses.test.ts (6 tests)
  - localPremonition witness: pads short premonition to 32 bytes / truncates
    >32 / keeps exact 32-byte / returns unchanged private state
  - localSalt witness: returns valid 32-byte salt / throws on non-32-byte salt
- src/omen/private-state.test.ts (3 tests)
  - serialize/deserialize round-trip without data loss
  - salt serialized as lowercase hex
  - createInitialPrivateState produces 32-byte salt + ISO timestamp

## Frontend (`cd frontend && npm test`) — src/lib

- src/lib/bytes32.test.ts (4 tests)
  - toBytes32 returns exactly 32 bytes
  - zero-pads short string to the right
  - truncates strings longer than 32 bytes
  - handles multibyte UTF-8, truncating at the 32nd byte

```
 Test Files  3 passed (3)
      Tests  13 passed (13)
```
