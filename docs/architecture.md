# Meridian — Architecture

## System Overview

```mermaid
graph TB
    subgraph Frontend["Frontend — React + Vite"]
        UI[UI Components]
        Hooks[React Hooks]
        Midnight[midnight/ Service Layer]
    end

    subgraph Wallet["Browser Wallet"]
        W1[1 AM Wallet]
        W2[Lace Wallet]
        API[ConnectedAPI]
    end

    subgraph OnChain["Midnight Network — Preprod"]
        Contract["splitpool.compact"]
        Ledger[Public Ledger State]
        ZK[ZK Proof Verification]
    end

    subgraph Storage["Off-Chain Storage"]
        SB[Supabase — Circles, Expenses, Pacts]
        LS[localStorage — Private State]
    end

    UI --> Hooks
    Hooks --> Midnight
    Hooks --> SB
    Hooks --> LS
    Midnight --> API
    API --> W1
    API --> W2
    API --> Contract
    Contract --> Ledger
    Contract --> ZK
```

---

## ZK Privacy Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Wallet
    participant ProofServer
    participant Midnight

    User->>Frontend: Log expense ($120 dinner)
    Frontend->>Frontend: Build ZK witness<br/>(amount, salt, secret)
    Frontend->>ProofServer: Generate ZK proof
    ProofServer-->>Frontend: Return proof
    Frontend->>Wallet: Submit transaction
    Wallet->>Midnight: Submit ZK proof + commitment hash
    Midnight->>Midnight: Verify proof on-chain
    Midnight-->>Wallet: Confirm transaction

    Note over Midnight: Only commitment hash stored<br/>Amounts are NEVER on-chain
    Note over User: Members see amount locally<br/>Observer sees nothing
```

---

## Contract State Machine

```mermaid
stateDiagram-v2
    [*] --> Empty: Deploy
    Empty --> Active: join()
    Active --> Active: join() — memberCount++
    Active --> Active: logExpense() — expenseCount++
    Active --> Settled: settle() — settlementCount++
    Settled --> Active: logExpense() or join()

    state Empty {
        [*] --> inviteRootSet: constructor()
        inviteRootSet --> [*]
    }

    state Active {
        [*] --> MembersJoining
        MembersJoining --> ExpensesLogged
        ExpensesLogged --> MembersJoining
    }

    state Settled {
        [*] --> HashChained: lastSettlementHash updated
    }
```

---

## On-Chain vs Off-Chain Data

```mermaid
graph LR
    subgraph OnChain["On-Chain — Public"]
        A[inviteRoot]
        B[memberCount]
        C[expenseCount]
        D[settlementCount]
        E[lastSettlementHash]
    end

    subgraph OffChain["Off-Chain — Private"]
        F[Expense Amounts]
        G[Member Balances]
        H[Invite Secret]
        I[Settlement Plan]
        J[Member Identities]
    end

    subgraph Supabase["Supabase — Cached"]
        K[Circles]
        L[Expenses]
        M[Recurring Pacts]
    end

    OffChain -->|ZK commitment| OnChain
    OffChain --> Supabase
```

---

## Settlement Engine Flow

```mermaid
flowchart TD
    A[Circle Members] --> B[Log Expenses]
    B --> C[computeMinimumTransfers]
    C --> D{Net Balances}
    D -->|Creditors| E[People owed money]
    D -->|Debtors| F[People who owe]
    E --> G[Match pairs]
    F --> G
    G --> H{Single transfer needed?}
    H -->|Yes| I[1 payment]
    H -->|No| J[Chain: debtor → creditor]
    J --> K[settle() — ZK proof on-chain]
    I --> K
    K --> L[settlementCount++<br/>lastSettlementHash updated]
```

---

## Frontend Component Tree

```mermaid
graph TD
    App --> Router
    Router --> CirclesPage
    Router --> AboutPage

    CirclesPage --> CircleList
    CirclesPage --> CreateCircleForm
    CirclesPage --> JoinCircleForm

    CircleList --> CircleCard
    CircleCard --> CircleDetail

    CircleDetail --> TabRoll
    CircleDetail --> TabLedger
    CircleDetail --> TabSettle
    CircleDetail --> TabAnalytics
    CircleDetail --> TabPacts

    TabRoll --> ExpenseForm
    TabRoll --> MemberList
    TabSettle --> SettlementBoard
    TabAnalytics --> AnalyticsDashboard
    TabPacts --> RecurringPacts

    App --> Navbar
    App --> WalletConnect
    App --> TransactionToast
```

---

## ZK Circuit Architecture

```mermaid
graph LR
    subgraph Public["Public Ledger"]
        IR[inviteRoot]
        MC[memberCount]
        EC[expenseCount]
        SC[settlementCount]
        SH[lastSettlementHash]
    end

    subgraph Private["Private Witness"]
        S[secret]
        Salt[salt]
        SH2[settlementHash]
    end

    subgraph Circuits["ZK Circuits"]
        Join["join()"]
        LogExp["logExpense()"]
        Settle["settle()"]
    end

    S --> Join
    Salt --> Join
    Join -->|prove membership| MC

    S --> LogExp
    Salt --> LogExp
    LogExp -->|prove membership| EC

    S --> Settle
    Salt --> Settle
    SH2 --> Settle
    Settle -->|prove settlement| SC
    Settle --> SH
```

---

## Data Flow Summary

| Action | Private Input | ZK Proof | On-Chain State |
|--------|---------------|----------|----------------|
| Create circle | invite secret, salt | `commitSecret(s, salt)` | `inviteRoot` set |
| Join circle | invite secret, salt | Proves `inviteRoot == commitSecret(s, salt)` | `memberCount++` |
| Log expense | amount, secret, salt | Proves membership | `expenseCount++` |
| Settle | settlement plan, secret, salt | Proves membership + correctness | `settlementCount++`, `lastSettlementHash` updated |
