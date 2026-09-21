# Meridian — User Guide

A complete, step-by-step guide for using Meridian to split expenses privately with your group.

> **Live app**: [meridian-midnight.vercel.app](https://meridian-midnight.vercel.app/)
> **Feedback**: [Google Form](https://forms.gle/hCDimFx3mNSBUo1e7) · [Responses](https://docs.google.com/spreadsheets/d/1zyc14ihbuKbWa3QTvLeydI8nc6QvWfSaSG8ie6bCbLU/edit?usp=sharing)
> **Support**: [GitHub Issues](https://github.com/Anubhab-Rakshit/midnight-project/issues) · [@meridian_split](https://x.com/meridian_split)

---

## Table of Contents

1. [What is Meridian?](#what-is-meridian)
2. [Prerequisites](#prerequisites)
3. [Connect Your Wallet](#connect-your-wallet)
4. [Create a Circle](#create-a-circle)
5. [Invite Members](#invite-members)
6. [Join a Circle](#join-a-circle)
7. [Log an Expense](#log-an-expense)
8. [View Balances](#view-balances)
9. [Settle Up](#settle-up)
10. [Recurring Pacts](#recurring-pacts)
11. [Analytics Dashboard](#analytics-dashboard)
12. [How Privacy Works](#how-privacy-works)
13. [FAQ](#frequently-asked-questions)
14. [Troubleshooting](#troubleshooting)

---

## What is Meridian?

Meridian is a **confidential group expense settlement** tool built on Midnight Network. It lets you:

- Split expenses with friends, family, or colleagues
- Keep amounts private — only circle members can see them
- Settle debts using zero-knowledge proofs that prove fairness without revealing numbers
- Verify everything on-chain — no trusting a middleman

**The core promise**: settle with friends, prove it's fair, show strangers nothing.

---

## Prerequisites

Before using Meridian, you need:

### 1. A Midnight-Compatible Wallet

Install one of these browser extensions:

| Wallet | Install | Notes |
|--------|---------|-------|
| **1 AM Wallet** (recommended) | [Chrome Web Store](https://chromewebstore.google.com/detail/1am-wallet) | Best compatibility with Meridian |
| **Lace Wallet** | [lace.io](https://lace.io) | Also supported |

After installing, create a new wallet and save your seed phrase somewhere safe. You'll automatically receive testnet tokens (tNIGHT) on the Preprod network.

### 2. A Modern Browser

Chrome, Firefox, Edge, or Brave — any browser that supports wallet extensions.

---

## Connect Your Wallet

1. Go to [meridian-midnight.vercel.app](https://meridian-midnight.vercel.app/)
2. Click **"Connect Wallet"** in the top-right corner
3. Select your wallet (1 AM or Lace)
4. Approve the connection in the wallet popup
5. You'll see your **wallet address** and **tNIGHT balance** in the navbar

> **Tip**: If the wallet doesn't appear, make sure the extension is installed and enabled. Try refreshing the page.

---

## Create a Circle

A "circle" is a group of people who share expenses. Each circle is backed by a smart contract on Midnight.

1. Click **"+ New Circle"** on the Circles page
2. Enter a **circle name** — something recognizable like "Roommates", "Trip to Goa", or "Office Lunch"
3. Enter an **invite secret** — this is a shared password that lets people join your circle. You can:
   - Type your own (e.g., `my-secret-123`)
   - Leave blank to auto-generate one
4. Click **"Create Circle"**
5. Approve the transaction in your wallet
6. Wait for confirmation — you'll see a toast notification

### What happens under the hood

- A new smart contract is deployed on Midnight Preprod
- Your wallet becomes the circle's **admin**
- The invite secret is shared with members (off-chain) — it's never stored on-chain
- The contract tracks member count, but not identities

### After creating

- **Copy the invite secret** — you'll need to share it with your friends
- **Copy the contract address** — this is the circle's unique identifier on-chain
- Share both via DM, Signal, WhatsApp, or any secure channel

> **Security**: Never share the invite secret publicly. Anyone with it can join your circle.

---

## Invite Members

After creating a circle, share these two things with each member:

| What | Example | Where to find it |
|------|---------|-----------------|
| **Contract address** | `a9206339b8...` | Shown after creating the circle |
| **Invite secret** | `my-secret-123` | Shown after creating the circle |

Share via:
- Direct message
- Signal / WhatsApp / Telegram
- Any encrypted channel

**Do NOT share the invite secret in public spaces** (Twitter, Discord, group chats with strangers).

---

## Join a Circle

1. Click **"# Join Circle"** on the Circles page
2. Enter the **contract address** (the circle creator shares this with you)
3. Enter the **invite secret** (the circle creator shares this with you)
4. Click **"Join Circle"**
5. Approve the transaction in your wallet

### What happens under the hood

- A **zero-knowledge proof** is generated proving you know the invite secret
- The on-chain member count increments by 1
- Your identity is **never revealed** — the blockchain only sees that "someone joined"
- No one can tell which wallet joined which circle by looking at the chain

> **Note**: You need tNIGHT tokens in your wallet to pay the transaction fee. If you're on Preprod, tokens are provided automatically.

---

## Log an Expense

Once you're inside a circle, you can log shared expenses.

1. Enter a circle by clicking **"Enter Vault"**
2. Go to the **"Roll"** tab (expenses list)
3. Click **"Add Expense"**
4. Fill in the details:
   - **Description**: What was the expense? (e.g., "Dinner at Dorsia", "Uber to airport")
   - **Amount**: How much? (e.g., "120.00")
   - **Category**: Pick one — Food, Transport, Entertainment, Shopping, Utilities, Other
5. Click **"Log Expense"**
6. Approve the transaction in your wallet

### What happens under the hood

- The expense is committed on-chain as a **ZK hash** (a cryptographic commitment)
- The actual amount is stored privately in Supabase, linked to your wallet
- Other circle members can see the expense in the app
- An observer on-chain only sees that "an expense was logged" — not the amount, description, or who logged it

### Who sees what

| Viewer | Description | Amount | Category |
|--------|------------|--------|----------|
| You | Yes | Yes | Yes |
| Circle members | Yes | Yes | Yes |
| On-chain observer | No | No | No |
| Meridian servers | No (stored encrypted) | No (stored encrypted) | No |

---

## View Balances

1. Enter a circle
2. Go to the **"Ledger"** tab
3. See the **net balances** for each member:

| Balance | Meaning |
|---------|---------|
| **Positive** (+) | Others owe you money |
| **Negative** (-) | You owe others money |
| **Zero** (0) | You're settled |

The balances are computed locally from the private expense data. They are **never stored on-chain**.

> **Example**: If you logged a $100 dinner for 4 people, each person's balance shows -$25 (they owe $25), and your balance shows +$75 (you're owed $75).

---

## Settle Up

When everyone is ready to pay up:

1. Enter a circle
2. Go to the **"Settle"** tab
3. Review the **optimal transfer plan** — the minimum number of payments needed to settle all debts
4. Click **"Settle"**
5. Approve the transaction

### What happens under the hood

1. The **netting engine** computes the fewest payments to settle all debts
2. A **ZK proof** is generated proving the settlement is correct and zero-sum (total in = total out)
3. The settlement is recorded on-chain as a hashed commitment
4. The actual tNIGHT transfers happen in the shielded layer (private)
5. All expenses in the round are marked **settled** — balances reset to zero

### After settling

- Balances reset to $0 for all members
- Settled expenses show a **checkmark** in the ledger
- You can start logging new expenses for the next round

> **Note**: Settlement requires a ZK proof server. Locally this works out of the box. On the hosted app, proving is routed to a local proof server (see [Deployment Strategy](README.md#public-proof-server--deployment-strategy)).

---

## Recurring Pacts

For regular shared expenses (rent, Netflix, subscriptions):

1. Go to the **"Pacts"** tab
2. Click **"Create Pact"**
3. Enter:
   - **Pact name** (e.g., "Netflix Family", "Monthly Rent")
   - **Amount** (e.g., "15.99")
   - **Frequency**: Weekly, Biweekly, or Monthly
4. Click **"Save"**

The pact is stored and will remind you when settlement is due.

---

## Analytics Dashboard

Go to the **"Analytics"** tab inside any circle to see:

- **Total spending per category** — where does the money go?
- **Average expense per member** — who spends more/less?
- **Spending distribution** — visual breakdown of contributions
- **Member badges** — Top Contributor, Fair Splitter, etc.

All analytics are computed locally from private data. Nothing is shared on-chain.

---

## How Privacy Works

Meridian uses **zero-knowledge proofs** to protect your financial data. Here's what stays private:

| Data | On-Chain | In App | On Server |
|------|----------|--------|-----------|
| Expense amounts | Hidden | Visible to members | Encrypted |
| Who logged what | Hidden | Visible to members | Encrypted |
| Settlement amounts | Hidden | Visible to members | Encrypted |
| Member identities | Hidden | Visible to members | Visible |
| Contract state | Public (counters only) | Full | Full |

### The privacy model

1. **Expenses** are committed on-chain as ZK hashes — the chain knows "an expense exists" but not the amount
2. **Settlements** prove zero-sum (fairness) without revealing who paid how much
3. **Members** join via ZK proof of knowing the invite secret — identity never hits the chain
4. **Balances** are computed locally — never stored on-chain or on any server

> For the full technical model, see [docs/privacy-model.md](privacy-model.md).

---

## Frequently Asked Questions

**Q: Can anyone see my expenses?**
A: Only circle members can see expenses in the app. On-chain, only commitment hashes are visible — no amounts, no descriptions, no identities.

**Q: Can the blockchain see how much I spent?**
A: No. Amounts are committed as ZK hashes. The on-chain state only shows counters (expense count, member count).

**Q: What if I lose my wallet?**
A: Your expenses are stored in Supabase and linked to your wallet address. If you recover your wallet (using the seed phrase), you can reconnect and see your data.

**Q: Can I leave a circle?**
A: Currently, there is no "leave" function. The circle creator can manage members in a future version.

**Q: Is this real money?**
A: On Preprod, it's testnet tokens (tNIGHT). On mainnet, it would be real tokens.

**Q: How many people can be in a circle?**
A: There's no hard limit. The contract supports any number of members.

**Q: What if two people log the same expense?**
A: Each expense is a separate commitment. Members can see all expenses in the ledger and identify duplicates manually.

**Q: Can I edit or delete an expense?**
A: Currently, expenses cannot be edited or deleted after logging. This is a deliberate design choice for auditability.

---

## Troubleshooting

### Wallet not connecting?

- Make sure the wallet extension is installed and enabled
- Try refreshing the page
- Check that you're on the correct network (Preprod)
- Try disconnecting and reconnecting

### Transaction stuck?

- Wait a few minutes — the Preprod network may be slow
- Check your wallet for pending transactions
- Try again with a higher fee if needed
- Check the [1AM Explorer](https://explorer.1am.xyz) to see if the transaction confirmed

### Can't see my circles?

- Make sure you're connected with the **same wallet** you used to create/join
- Check the browser console for errors
- Try refreshing the page

### Settlement failed?

- Make sure you have enough tNIGHT for the transaction fee
- Check if the proof server is running (locally it should be automatic)
- Try again — proof generation can occasionally time out

### Balance shows $0 but I have expenses?

- Make sure you're in the correct circle
- Check that expenses were logged successfully (look for them in the Roll tab)
- If a settlement was done, balances reset — this is expected behavior

---

## Support

- **GitHub Issues**: [github.com/Anubhab-Rakshit/midnight-project/issues](https://github.com/Anubhab-Rakshit/midnight-project/issues)
- **X / Twitter**: [@meridian_split](https://x.com/meridian_split)
- **Developer**: [@anubhab_26](https://x.com/anubhab_26)
