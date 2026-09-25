# Meridian — User Feedback

## Overview

Structured feedback from 70 Preprod users of Meridian, collected Sep 17-25, 2026. All participants connected a Preprod wallet and interacted with the contract on Midnight Preprod.

> **Google Form**: [Feedback Form](https://forms.gle/hCDimFx3mNSBUo1e7) · **Responses**: [Google Sheet](https://docs.google.com/spreadsheets/d/1DOKjU134rzaJq5stoeGXu6EfACsXkBQ9n39viYquQ9c/edit?usp=sharing)

---

## Feedback Summary

| Metric | Value |
|--------|-------|
| Total responses | 70 |
| Wallet connections | 69 Yes / 1 No (99%) |
| Average rating | 8.9 / 10 |
| Median rating | 9 |
| Rating range | 4 — 10 |

### Rating Distribution

| Rating | Count | % |
|--------|-------|---|
| 10 | 26 | 37% |
| 9 | 24 | 34% |
| 8 | 11 | 16% |
| 7 | 6 | 9% |
| 6 | 2 | 3% |
| 4 | 1 | 1% |

---

## Feedback Themes

### Positive

- **Unique product concept** — "unique product", "Very exciting. Loved the idea and also the UI and UX", "fantastic", "Very good website", "Great use of midnight blockchain"
- **Smooth UI/UX** — "I liked the ui, it is too smooth", "UI is too good", "smooth"
- **Would recommend** — "Have shared with my friends too", "wishing best in the future"
- **Non-web3 users liked it** — "Not a web3 developer but surely liked the idea and the UI is too good"

### Areas for Improvement

| Theme | Count | Examples |
|-------|-------|---------|
| Mobile layout issues | 4 | "navigation issues in mobile", "found some issues in mobile view" |
| Settlement broken (pre-fix) | 2 | "settlements are not working", "I found some issue in settlements" |
| Circle creation slow | 1 | "taking time in creating circle" |
| Animations lagging | 1 | "animations lagging should be fixed" |
| About page too long | 1 | "About us page is a lot lengthy" |
| Too complex | 1 | "bit complex" |
| Could be simpler | 1 | "could be a bit simple" |
| Wallet couldn't open circles | 1 | "connected wallet, but couldn't open the circles" |
| Wants more features | 1 | "want some more useful features" |
| Negative | 1 | "Idk but I didn't like it" (rating 4, did not connect wallet) |

---

## Response Actions

| Feedback | Action Taken | Status |
|----------|-------------|--------|
| Mobile layout issues | Responsive nav-pill, floating nav spacing, connect-button sizing fixed (`afa1f90`, `bbc22ae`) | Done |
| Settlements not working | Fixed .bzkir IR route + settlement round closing (`57179a4`, `bbc22ae`) | Done |
| RLS UPDATE policy missing | Added `allow_update_expenses` policy (`006_add_expenses_update_policy.sql`) | Done |
| Animations lagging | Known — CSS transition perf, low priority | Backlog |
| About page length | Known — can trim for mobile | Backlog |
| Circle creation slow | Infra — proving server latency, local proving fast | Backlog |
| Wallet couldn't open circles | Transient wallet-connection issue, not reproduced | Monitoring |

---

## Individual Feedback

| # | Name | Rating | Wallet Connected | Feedback |
|---|------|--------|-----------------|----------|
| 1 | Rupam Ghosh | 9 | Yes | — |
| 2 | Bodhisatwa Dutta | 10 | Yes | no |
| 3 | Snigdhanil Basu | 8 | Yes | some navigation issues in mobile |
| 4 | Kausheya Roy | 10 | Yes | — |
| 5 | Vibhan Dutta | 9 | Yes | liked it |
| 6 | Sampad De | 7 | Yes | — |
| 7 | Amit Rakshit | 10 | Yes | fantastic |
| 8 | Prajit Bakshi | 7 | Yes | animations lagging should be fixed |
| 9 | Subham Bhat | 9 | Yes | — |
| 10 | Saketh Ram | 8 | Yes | taking time in creating circle |
| 11 | Tathagata Ghosh | 10 | Yes | unique product |
| 12 | Raja | 8 | Yes | bit complex |
| 13 | Sankhanil Chanda | 10 | Yes | Very exciting . Loved the idea and also the UI and UX . Great work |
| 14 | Rooplekha Banik | 9 | Yes | i have connected wallet but couldn't open the circles please fix this issue |
| 15 | Sreejita Basu | 8 | Yes | It was oky |
| 16 | Aritra Sarkar | 4 | No | Idk but I didn't like it |
| 17 | Shreya Dey Sarkar | 9 | Yes | — |
| 18 | Suniska Dey | 9 | Yes | No such thoughts but could be a bit simple |
| 19 | Ruparna | 9 | Yes | — |
| 20 | Ananya Basu | 10 | Yes | — |
| 21 | Soumyajit Mazumdar | 7 | Yes | want some more useful features |
| 22 | Pradipto Haldar | 10 | Yes | Very good website |
| 23 | Debanjali Chatterjee | 9 | Yes | — |
| 24 | Aabes Sarkar | 8 | Yes | I liked the ui it is too smooth |
| 25 | Koyeli Kundu | 9 | Yes | — |
| 26 | Oyshee Ghosh | 9 | Yes | — |
| 27 | Arin Das | 10 | Yes | About us page is a lot lengthy |
| 28 | Subham Neogi | 8 | Yes | — |
| 29 | Anushka Sarkar | 10 | Yes | — |
| 30 | Avishikta Bagchi | 7 | Yes | found some issues in mobile view |
| 31 | Sayon Sarkar | 9 | Yes | — |
| 32 | Sohana Ghosh | 9 | Yes | Liked it . Have shared with my friends too |
| 33 | Moumita Rakshit | 9 | Yes | Found it interesting wishing best in the future for this website |
| 34 | Ayanika Sen | 10 | Yes | — |
| 35 | Gargi Saha | 9 | Yes | — |
| 36 | Sreeja Ray | 10 | Yes | — |
| 37 | Maitri Golder | 6 | Yes | settlements are not working |
| 38 | Rick Acharjee | 10 | Yes | — |
| 39 | Sarin Sanyal | 7 | Yes | — |
| 40 | Subom Paul | 9 | Yes | — |
| 41 | Amitava Pal | 7 | Yes | I found some issue in settlements maybe it is still in development admin please have a look into it |
| 42 | Tamisra Moitra | 10 | Yes | — |
| 43 | Shreyak Mitra | 8 | Yes | — |
| 44 | Praloy Sahoo | 10 | Yes | — |
| 45 | Reet Banerjee | 9 | Yes | — |
| 46 | Mukta Das | 8 | Yes | — |
| 47 | Adrish Karak | 10 | Yes | — |
| 48 | Upasana Aditya | 10 | Yes | Very good |
| 49 | Sanbartika Ghosh | 9 | Yes | — |
| 50 | Pooja Das | 8 | Yes | — |
| 51 | Subrata Rakshit | 10 | Yes | — |
| 52 | Antara Bhattacharjee | 10 | Yes | I liked it |
| 53 | Taniya Singh | 9 | Yes | — |
| 54 | Snigdha | 9 | Yes | — |
| 55 | Shreyasi Paul | 8 | Yes | Very good |
| 56 | Srinjoy Mukherjee | 10 | Yes | — |
| 57 | Ayush Sarkar | 9 | Yes | — |
| 58 | Soumili Das | 9 | Yes | — |
| 59 | Susmita Rakshit | 10 | Yes | — |
| 60 | Rasa Majumdar | 10 | Yes | — |
| 61 | Supratik Paul | 6 | Yes | — |
| 62 | Mithu Rakshit | 10 | Yes | — |
| 63 | Debasmit Bose | 10 | Yes | Great use of midnight blockchain . I was also developing in this blockchain and the idea is superb |
| 64 | Sayanaditya Das | 9 | Yes | — |
| 65 | Sayantika Haldar | 8 | Yes | — |
| 66 | Mourya Saha | 9 | Yes | Not a web3 developer but surely liked the idea and the UI is too good |
| 67 | Srijit Das | 10 | Yes | Great work Anubhab |
| 68 | Ruhani Chakrabarti | 9 | Yes | — |
| 69 | Nobojit Mondal | 10 | Yes | — |
| 70 | Anisha Ghosh | 10 | Yes | — |

---

## How to Provide Feedback

1. **Google Form**: [Feedback Form](https://forms.gle/hCDimFx3mNSBUo1e7)
2. **Google Sheet**: [All Responses](https://docs.google.com/spreadsheets/d/1DOKjU134rzaJq5stoeGXu6EfACsXkBQ9n39viYquQ9c/edit?usp=sharing)
3. **GitHub Issues**: [github.com/Anubhab-Rakshit/midnight-project/issues](https://github.com/Anubhab-Rakshit/midnight-project/issues)
4. **X/Twitter**: Reply to [@anubhab_26](https://x.com/anubhab_26)
