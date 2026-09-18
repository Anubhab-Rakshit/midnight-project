# Meridian — User Guide

A step-by-step guide for using Meridian to split expenses privately with your group.

---

## Getting Started

### 1. Install a Wallet

You need a Midnight-compatible wallet to use Meridian:

- **1 AM Wallet** (recommended): [Chrome Web Store](https://chromewebstore.google.com/detail/1am-wallet)
- **Lace Wallet**: [lace.io](https://lace.io)

Install either extension and create a wallet. You'll receive testnet tokens (tNIGHT) automatically.

### 2. Open Meridian

Go to [https://meridian-midnight.vercel.app/](https://meridian-midnight.vercel.app/)

### 3. Connect Your Wallet

1. Click **"Connect Wallet"** in the top-right corner
2. Select your wallet (1 AM or Lace)
3. Approve the connection in your wallet popup
4. You'll see your wallet address and tNIGHT balance in the navbar

---

## Creating a Circle

1. Click **"+ New Circle"** on the Circles page
2. Enter a **circle name** (e.g., "Roommates", "Trip to Goa")
3. Optionally enter an **invite secret** (or leave blank for auto-generated)
4. Click **"Create Circle"**
5. Approve the transaction in your wallet
6. Wait for confirmation — you'll see a toast notification

**What happens**: A new smart contract is deployed on Midnight. You receive an invite secret to share with members.

### Sharing the Invite Secret

After creating a circle, share the invite secret with your friends via:
- Direct message
- Signal / WhatsApp
- Any secure channel

**Do NOT share the invite secret publicly.** Anyone with it can join your circle.

---

## Joining a Circle

1. Click **"# Join Circle"** on the Circles page
2. Enter the **contract address** (shared by the circle creator)
3. Enter the **invite secret** (shared by the circle creator)
4. Click **"Join Circle"**
5. Approve the transaction in your wallet

**What happens**: A ZK proof is generated proving you know the invite secret. The on-chain member count increments, but your identity is not revealed.

---

## Logging an Expense

1. Enter a circle by clicking **"Enter Vault"**
2. Go to the **"Roll"** tab (expenses list)
3. Click **"Add Expense"**
4. Fill in:
   - **Description**: What was the expense? (e.g., "Dinner at Dorsia")
   - **Amount**: How much? (e.g., "120.00")
   - **Category**: Food, Transport, Entertainment, etc.
5. Click **"Log Expense"**
6. Approve the transaction

**What happens**: The expense is committed on-chain as a ZK hash. The amount is stored privately in Supabase. Other circle members can see it in the app, but an observer on-chain only sees that a counter incremented.

---

## Viewing Balances

1. Enter a circle
2. Go to the **"Ledger"** tab
3. See the **net balances** for each member:
   - **Positive balance**: Others owe you money
   - **Negative balance**: You owe others money
   - **Zero**: You're settled

The balances are computed locally from the private expense data. They are never stored on-chain.

---

## Settling Up

1. Enter a circle
2. Go to the **"Settle"** tab
3. Review the **optimal transfer plan** — the minimum number of payments needed
4. Click **"Settle"**
5. Approve the transaction

**What happens**: 
- The netting engine computes the fewest payments to settle all debts
- A ZK proof is generated proving the settlement is correct and zero-sum
- The settlement is recorded on-chain as a hashed commitment
- The actual tNIGHT transfers happen in the shielded layer (private)

---

## Recurring Pacts

For regular shared expenses (rent, Netflix, subscriptions):

1. Go to the **"Pacts"** tab
2. Click **"Create Pact"**
3. Enter:
   - **Pact name** (e.g., "Netflix Family")
   - **Amount** (e.g., "15.99")
   - **Frequency** (Weekly / Biweekly / Monthly)
4. Click **"Save"**

The pact is stored in Supabase and will remind you when settlement is due.

---

## Analytics

Go to the **"Analytics"** tab to see:
- Total spending per category
- Average expense per member
- Spending distribution (who spends more/less)
- Member badges (Top Contributor, Fair Splitter, etc.)

All analytics are computed locally from private data. Nothing is shared on-chain.

---

## About Us

Click **"About Us"** in the navbar to learn about:
- Meridian's privacy-first philosophy
- How zero-knowledge proofs protect your data
- The technical architecture

---

## Frequently Asked Questions

**Q: Can anyone see my expenses?**
A: No. Only circle members can see expenses in the app. On-chain, only commitment hashes are visible.

**Q: Can the blockchain see how much I spent?**
A: No. Amounts are committed as ZK hashes. The on-chain state only shows counters (expense count, member count).

**Q: What if I lose my wallet?**
A: Your expenses are stored in Supabase and linked to your wallet address. If you recover your wallet (using the seed phrase), you can reconnect and see your data.

**Q: Can I leave a circle?**
A: Currently, there is no "leave" function. The circle creator can remove members in a future version.

**Q: Is this real money?**
A: On Preprod, it's testnet tokens (tNIGHT). On mainnet, it would be real tokens.

---

## Troubleshooting

**Wallet not connecting?**
- Make sure the wallet extension is installed and enabled
- Try refreshing the page
- Check that you're on the correct network (Preprod)

**Transaction stuck?**
- Wait a few minutes — the network may be slow
- Check your wallet for pending transactions
- Try again with a higher fee if needed

**Can't see my circles?**
- Make sure you're connected with the same wallet you used to create/join
- Check the Supabase connection in the console

---

## Support

- **GitHub Issues**: [github.com/Anubhab-Rakshit/midnight-project/issues](https://github.com/Anubhab-Rakshit/midnight-project/issues)
- **X / Twitter**: [@anubhab_26](https://x.com/anubhab_26)
