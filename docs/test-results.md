# Test Results — Vitest

76 tests passing (root 66 + frontend 10). Run in CI on every push.

## Root (`npm test`) — src/meridian + src/omen

### Meridian Tests

- src/meridian/witnesses.test.ts (6 tests)
  - ZK witness providers: localSecret, localSalt, settlementHash
- src/meridian/private-state.test.ts (4 tests)
  - Private state: create, serialize, deserialize, round-trip
- src/meridian/netting.test.ts (12 tests)
  - Minimum-transfer settlement optimality
  - Settlement verification (zero-sum, balance consistency)
  - Dust balance filtering, sub-optimal plan detection
- src/meridian/analytics.test.ts (10 tests)
  - Circle analytics: total, average, distribution tags
  - Member stats: spending ratio, settlement rate
  - Anomaly detection: outlier spending
- src/meridian/badges.test.ts (8 tests)
  - Member badges: top contributor, fair splitter, big spender
  - Badge computation: all members, empty state
- src/meridian/cross-circle.test.ts (8 tests)
  - Cross-circle netting: balance merging, optimal transfers
  - Total net balance computation
- src/meridian/recurring-pacts.test.ts (9 tests)
  - Recurring pact rules: weekly, biweekly, monthly
  - Pact persistence and active/inactive status

### Legacy Omen Tests

- src/omen/witnesses.test.ts (6 tests)
  - Legacy Omen witness providers
- src/omen/private-state.test.ts (3 tests)
  - Legacy Omen private state operations

## Frontend (`cd frontend && npm test`) — src/lib

- src/lib/circle-math.test.ts (6 tests)
  - Split-type calculations (equal, exact, percentage, shares)
  - Edge cases: single member, zero amounts
- src/lib/bytes32.test.ts (4 tests)
  - toBytes32 returns exactly 32 bytes
  - zero-pads short string to the right
  - truncates strings longer than 32 bytes
  - handles multibyte UTF-8, truncating at the 32nd byte

```
Root:    9 test files, 66 tests passed
Frontend: 2 test files, 10 tests passed
Total:  76 tests passed
```
