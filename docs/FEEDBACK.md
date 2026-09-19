# Meridian — User Feedback

## Overview

Structured feedback from 51 Preprod users of Meridian, collected Sep 17-19, 2026. All participants connected a Preprod wallet and interacted with the contract on Midnight Preprod.

---

## Feedback Summary

| Metric | Value |
|--------|-------|
| Total responses | 51 |
| Wallet connections | 50 Yes / 1 No (98%) |
| Average rating | 8.8 / 10 |
| Median rating | 9 |
| Rating range | 4 — 10 |

### Rating Distribution

| Rating | Count | % |
|--------|-------|---|
| 10 | 18 | 35% |
| 9 | 17 | 33% |
| 8 | 8 | 16% |
| 7 | 6 | 12% |
| 6 | 1 | 2% |
| 4 | 1 | 2% |

---

## Feedback Themes

### Positive

- **Unique product concept** — "unique product", "Very exciting. Loved the idea and also the UI and UX", "fantastic", "Very good website"
- **Smooth UI/UX** — "I liked the ui, it is too smooth", "smooth", "interesting"
- **Would recommend** — "Have shared with my friends too", "wishing best in the future"

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
| Negative | 1 | "very bekar chi" (rating 4, did not connect wallet) |

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
| 13 | Sankhanil Chanda | 10 | Yes | Very exciting. Loved the idea and also the UI and UX. Great work |
| 14 | Rooplekha Banik | 9 | Yes | connected wallet, but couldn't open the circles |
| 15 | Sreejita Basu | 8 | Yes | It was oky |
| 16 | Aritra Sarkar | 4 | No | very bekar chi |
| 17 | Shreya Dey Sarkar | 9 | Yes | — |
| 18 | Anisha Ghosh | 8 | Yes | It is very good |
| 19 | Suniska Dey | 9 | Yes | No such thoughts but could be a bit simple |
| 20 | Ruparna | 9 | Yes | — |
| 21 | Ananya Basu | 10 | Yes | — |
| 22 | Soumyajit Mazumdar | 7 | Yes | want some more useful features |
| 23 | Pradipto Haldar | 10 | Yes | Very good website |
| 24 | Debanjali Chatterjee | 9 | Yes | — |
| 25 | Aabes Sarkar | 8 | Yes | I liked the ui, it is too smooth |
| 26 | Koyeli Kundu | 9 | Yes | — |
| 27 | Oyshee Ghosh | 9 | Yes | — |
| 28 | Arin Das | 10 | Yes | About us page is a lot lengthy |
| 29 | Subham Neogi | 8 | Yes | — |
| 30 | Anushka Sarkar | 10 | Yes | — |
| 31 | Avishikta Bagchi | 7 | Yes | found some issues in mobile view |
| 32 | Sayon Sarkar | 9 | Yes | — |
| 33 | Sohana Ghosh | 9 | Yes | Liked it. Have shared with my friends too |
| 34 | Moumita Rakshit | 9 | Yes | Found it interesting, wishing best in the future for this website |
| 35 | Ayanika Sen | 10 | Yes | — |
| 36 | Gargi Saha | 9 | Yes | — |
| 37 | Sreeja Ray | 10 | Yes | — |
| 38 | Maitri Golder | 6 | Yes | settlements are not working |
| 39 | Rick Acharjee | 10 | Yes | — |
| 40 | Sarin Sanyal | 7 | Yes | — |
| 41 | Subom Paul | 9 | Yes | — |
| 42 | Amitava Pal | 7 | Yes | I found some issue in settlements, maybe it is still in development |
| 43 | Tamisra Moitra | 10 | Yes | — |
| 44 | Shreyak Mitra | 8 | Yes | — |
| 45 | Praloy Sahoo | 10 | Yes | — |
| 46 | Reet Banerjee | 9 | Yes | — |
| 47 | Mukta Das | 8 | Yes | — |
| 48 | Adrish Karak | 10 | Yes | — |
| 49 | Upasana Aditya | 10 | Yes | Very good |
| 50 | Sanjuktta Kundu | 10 | Yes | — |
| 51 | Sanbartika Ghosh | 9 | Yes | — |

---

## How to Provide Feedback

1. **GitHub Issues**: [github.com/Anubhab-Rakshit/midnight-project/issues](https://github.com/Anubhab-Rakshit/midnight-project/issues)
2. **X/Twitter**: Reply to [@anubhab_26](https://x.com/anubhab_26)
