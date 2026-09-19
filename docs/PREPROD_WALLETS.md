# Meridian — Preprod Wallet Addresses

51 Preprod wallet addresses that have interacted with the Meridian contract on Midnight Preprod.

> All addresses are publicly verifiable via the [1AM Explorer](https://explorer.1am.xyz) or the [Midnight Indexer API](https://indexer.preprod.midnight.network/api/v4/graphql).

---

## How to Verify

### Via 1AM Explorer

Visit: `https://explorer.1am.xyz/address/<ADDRESS>?network=preprod`

### Via Indexer API

```bash
curl -s -X POST https://indexer.preprod.midnight.network/api/v4/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ contractAction(address: \"<CONTRACT_ADDRESS>\") { address state transaction { hash block { height } } } }"}'
```

---

## Contract Addresses (Preprod)

| Version | Address | Explorer | Notes |
|---------|---------|----------|-------|
| v3 (active) | `a9206339b84565fd515c0b2a49ae86783c7a7f278ed42414723b1053d489ecb8` | [View](https://explorer.1am.xyz/address/a9206339b84565fd515c0b2a49ae86783c7a7f278ed42414723b1053d489ecb8?network=preprod) | Deterministic salt, expense commitments on-chain |
| v2 (deprecated) | `d603069345cbafabe723511524a0bebd7649c842667dee171522b2fe63fc0e7d` | [View](https://explorer.1am.xyz/address/d603069345cbafabe723511524a0bebd7649c842667dee171522b2fe63fc0e7d?network=preprod) | Expense commitments added, random salt |
| v1 (deprecated) | `2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d` | [View](https://explorer.1am.xyz/address/2eff47c41ca88490d61278c27e6942ff4b758ffd4eb3e929e9cd5e0812f7896d?network=preprod) | First Preprod deployment |

| Role | Address | Date |
|------|---------|------|
| Deployer (v3) | `mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za` | Sep 19, 2026 |

---

## Wallet Addresses (51 Users)

| # | Name | Wallet Address | Rating | Date |
|---|------|---------------|--------|------|
| 1 | Rupam Ghosh | `mn_addr_preprod140wauv4fws3xr46qxgssacdhjkfrxuvjv95kmcv08fpf67ft7zes7r6x57` | 9 | Sep 17 |
| 2 | Bodhisatwa Dutta | `mn_addr_preprod16qtu7l4lgx8hcw5em5tjq75yq59dyra3cd8memr7cfgv7lz7506q52f4jd` | 10 | Sep 17 |
| 3 | Snigdhanil Basu | `mn_addr_preprod1a4n6rqulslhf59j24salg9dejqtfg8xymcg9xssjv59r8zr94x2spt3pug` | 8 | Sep 17 |
| 4 | Kausheya Roy | `mn_addr_preprod1fnwnmmgsdk6zg782fhdqj8wn0ndluaqcxad2tuweectecz0uaf8sg0lq0n` | 10 | Sep 17 |
| 5 | Vibhan Dutta | `mn_addr_preprod15kx769kwfaw7yarf24s5l6kjlzpn7ylcvta54dmwmwphwrtdkurq97cgr4` | 9 | Sep 17 |
| 6 | Sampad De | `mn_addr_preprod1c4dle6ystrg2fzqllrznsd2axxs8wzatskra99nfdjj7056snkps5j99rk` | 7 | Sep 17 |
| 7 | Amit Rakshit | `mn_addr_preprod1334m6h9j54rq8l4xpumnl52349r7s93p4w2juac2erf4h55cqnyqpxspy4` | 10 | Sep 17 |
| 8 | Prajit Bakshi | `mn_addr_preprod1p874ecyu2ygkq6pmk8j9ug0gx256kt3kgug6chcmkn0s4kpxnt0qjh8awj` | 7 | Sep 17 |
| 9 | Subham Bhat | `mn_addr_preprod15ggp8x65pvkx8z3ek2xd26ryqtulsk3mc4zt3cank3svzyf2z3es6jru3d` | 9 | Sep 17 |
| 10 | Saketh Ram | `mn_addr_preprod1ss0hew4qhwaksjmagm74q8ts9daqdj4enkckwgrlrc683cl0psts3mhm3t` | 8 | Sep 17 |
| 11 | Tathagata Ghosh | `mn_addr_preprod1k9x28wd2nt5ptz08xvw46ugwnau2crp8mz8rwv6shggdp4e44cfsucdnu8` | 10 | Sep 17 |
| 12 | Raja | `mn_addr_preprod1c0sez6fqfv2g7km4gw6hva9xtkqyxnurnc5enxn7avcrcvmldafquth68e` | 8 | Sep 17 |
| 13 | Sankhanil Chanda | `mn_addr_preprod1523chzum0jyelcv8f35yp2ua74gje87yztxdruq4cyuvltp7fwls3ex8vj` | 10 | Sep 17 |
| 14 | Rooplekha Banik | `mn_addr_preprod1kvq2egk76h9v2pc8upyh5dpklt30my7guyks0h3qajul6hzk47csq2gc9r` | 9 | Sep 17 |
| 15 | Sreejita Basu | `mn_addr_preprod164fh96sxtwla2jncujgu3avrsgw5zg72q6m6v23uqk3s00fynxzsrc20y6` | 8 | Sep 17 |
| 16 | Aritra Sarkar | `mn_addr_preprod1wg8gaqrqn8yn958lpsarh6meslfepr86cd5em6k6y7rqrvpa9eeqcvr379` | 4 | Sep 17 |
| 17 | Shreya Dey Sarkar | `mn_addr_preprod1ak6pgcd7rt3ndutvj4njg6jjlhlt4v747sqkrtjdkzgm24y7cxlsn7sdkz` | 9 | Sep 18 |
| 18 | Anisha Ghosh | `mn_addr_preprod1690euzgz8a9sed7vwly6ms5ggjfs0kv0qxm3nkh4g4xalyt24apq9d6sn5` | 8 | Sep 18 |
| 19 | Suniska Dey | `mn_addr_preprod1nus525thcpwhcmyss8mmeaqhc440ua2c9jkmdvsyrdjg9d62hu7qs9xasg` | 9 | Sep 18 |
| 20 | Ruparna | `mn_addr_preprod14erua8cg5zrjdg5g2lwasau9er87hrra95884xgypy5s0ldsrdsq7uvdnr` | 9 | Sep 18 |
| 21 | Ananya Basu | `mn_addr_preprod1nh9wy5d8224s9gymfrukwc887txdg78z5jyvawr45qqmwfj699ls42qp2q` | 10 | Sep 18 |
| 22 | Soumyajit Mazumdar | `mn_addr_preprod122w38gq0wfzvnrd757zej6vy5nryjr54ku3yfk2skl6q492n7frq06u9sf` | 7 | Sep 18 |
| 23 | Pradipto Haldar | `mn_addr_preprod1c32lg5rkrlmda2s5aknwcarshzsrrx0pry8pm7mvhuc7dg0hln0syd8rg7` | 10 | Sep 18 |
| 24 | Debanjali Chatterjee | `mn_addr_preprod1cxx2qszmxgf96gcld2qnt84vaeumn238hma82e59y9jj7gjc8p8sap5d4f` | 9 | Sep 18 |
| 25 | Aabes Sarkar | `mn_addr_preprod13rs8z572up7qw25j2xslmew88jxf3k2h5wsrwp07w3fh88yemgvq887jjg` | 8 | Sep 18 |
| 26 | Koyeli Kundu | `mn_addr_preprod1snhk2eyw67t3vs657uu5g0v6pws4u37uktl5uj3jj2ls5ftac3aqwyluep` | 9 | Sep 18 |
| 27 | Oyshee Ghosh | `mn_addr_preprod1d072uk080ngt9wncx3hcp5fjg762wq5s7fyy577fhkfcg4g95lds8yppq4` | 9 | Sep 18 |
| 28 | Arin Das | `mn_addr_preprod18jqnldwdhdxk6haaha707mcrmhvpc5f4pznpt3xx44d2n2y8jassalkjgr` | 10 | Sep 18 |
| 29 | Subham Neogi | `mn_addr_preprod1d8e3pnwuag82vutdhzuejkh3ywm7hxurz65th9exc24lua7ks86stsd75j` | 8 | Sep 18 |
| 30 | Anushka Sarkar | `mn_addr_preprod1sggslvd05fqdtkur6kz84vld3h3pexp232enl9u9l6jnyh4zseeqr6r3v7` | 10 | Sep 18 |
| 31 | Avishikta Bagchi | `mn_addr_preprod1v3rr5v9gqxkp6twzvlq0l85zsu8pvnmar57l2c4jyn8ulql4aaxq2nzz5y` | 7 | Sep 18 |
| 32 | Sayon Sarkar | `mn_addr_preprod16q7axcpjz6xec30xgqk7vfe2mf2mr0nsp23pfyz65rj0lx5jcmtsghp55w` | 9 | Sep 18 |
| 33 | Sohana Ghosh | `mn_addr_preprod1ltmj8urdpevp3zdpax5c80lnlc2e83xs3dqgftqjv2ulfnq0nj4qgvuuz3` | 9 | Sep 18 |
| 34 | Moumita Rakshit | `mn_addr_preprod1tdxl2uvfca30mqsnu3z8g7sdr20xkc7mpd2yuc7384suuftfllaszm54fh` | 9 | Sep 18 |
| 35 | Ayanika Sen | `mn_addr_preprod1ffjf0ng49x6k3wx27gnvn5qkz8xns55r8y5394288s8rmpu5dq5shvkxcz` | 10 | Sep 19 |
| 36 | Gargi Saha | `mn_addr_preprod126plssmyfh2ene5z4p6820fs82h5l3earkt8z4gq4v90wvkxlg0s78ggk2` | 9 | Sep 19 |
| 37 | Sreeja Ray | `mn_addr_preprod1h7s7wcx6fdyk54elnapyuz8m7hys2r7m9cjs6wlp7de0rvwk25hqt5vzkk` | 10 | Sep 19 |
| 38 | Maitri Golder | `mn_addr_preprod1frcdh490mryjpy4ef55mxhl7mlx6s0g2j9qz5pv6y49rkxx7vcvsgn3dak` | 6 | Sep 19 |
| 39 | Rick Acharjee | `mn_addr_preprod1ehm6s3e6x5xecur5t9pvwjwxn65unhduj0jcl3qu74y7q39j320qlsx39c` | 10 | Sep 19 |
| 40 | Sarin Sanyal | `mn_addr_preprod10ycpshvqn7hpec5tv0nyyj2w7fggtcjg6fke5glrmh23f5fauqfqr87mst` | 7 | Sep 19 |
| 41 | Subom Paul | `mn_addr_preprod1gkkyay25ec4h4mhu8rdqrqd428683d63tkx0pmetnprcdurp4fysgrtx5t` | 9 | Sep 19 |
| 42 | Amitava Pal | `mn_addr_preprod1nyd6v9futt9v3vpvkn07apyd7fl8s884d2edscxef3taexneegmqdfmn6e` | 7 | Sep 19 |
| 43 | Tamisra Moitra | `mn_addr_preprod1k62wdw7fycndqjgy533cazu5qfxhqvtv0fmqgq5gadc7qn6s4xtswuzdhu` | 10 | Sep 19 |
| 44 | Shreyak Mitra | `mn_addr_preprod1h86qpnzmy4ep8zf3mu2dpg7u5apxhsskwl83znk5tweqq4uucguq4tyu9h` | 8 | Sep 19 |
| 45 | Praloy Sahoo | `mn_addr_preprod17xc9vdngf2tfjfy3h52j900qmacsvrxnxp4legs5xjpnrvq62y3s7ychak` | 10 | Sep 19 |
| 46 | Reet Banerjee | `mn_addr_preprod1jmdpww7nz7ce8lqt38q3hukwxtgtksfspe9heq9a34meemd67wqqfh7289` | 9 | Sep 19 |
| 47 | Mukta Das | `mn_addr_preprod1f66zgjvpmnh5arwl94fplymyjpe2ztljmlyh5mp5m9yjncyd5v4qgwkjmp` | 8 | Sep 19 |
| 48 | Adrish Karak | `mn_addr_preprod17h5afvjuxth0ll9fwwxghset70yvjmdsy4r73ylgyktdaugspfasg39zc8` | 10 | Sep 19 |
| 49 | Upasana Aditya | `mn_addr_preprod1hkcqv6xhmxkqnzg5m0zjxfg9ynq2r2sfdse3c5yeacr8rs6zwn8q6300va` | 10 | Sep 19 |
| 50 | Sanjuktta Kundu | `mn_addr_preprod100dkk5jm336dzav66a6l2a4cpkrwkh3xr9up4q3chedz0lmjm98qmg67tj` | 10 | Sep 19 |
| 51 | Sanbartika Ghosh | `mn_addr_preprod1asdehuvhzmmevdvvt9p4dd4uyzudy05rwu9zjq048qzm97ka9qds7t4xez` | 9 | Sep 19 |

---

## Transaction History

11 on-chain transactions across 3 contract versions (v1 → v2 → v3). Contracts were redeployed as the codebase evolved, so transactions span multiple addresses.

| # | Tx Hash | Explorer |
|---|---------|----------|
| 1 | `f3b9d2c314dbb8b1e878f43af7037a7d22c0dcf584da52d5452a8e66295a7ea0` | [Night Scan ↗](https://explorer.preprod.midnight.network/transactions/f3b9d2c314dbb8b1e878f43af7037a7d22c0dcf584da52d5452a8e66295a7ea0) |
| 2 | `8d1fd961376ce65e1647df41cccc52d6716e4ac94f66ad88c8f5c14735de7950` | [1AM ↗](https://explorer.1am.xyz/tx/8d1fd961376ce65e1647df41cccc52d6716e4ac94f66ad88c8f5c14735de7950?network=preprod) |
| 3 | `20300e1e437fda967b91434def7174c071369b73832bdf983ad993067d710b36` | [1AM ↗](https://explorer.1am.xyz/tx/20300e1e437fda967b91434def7174c071369b73832bdf983ad993067d710b36?network=preprod) |
| 4 | `8eb01b267ce29bb227961657cf1f4fa472e1f34dec0d0437d69b72a4fea0ce08` | [1AM ↗](https://explorer.1am.xyz/tx/8eb01b267ce29bb227961657cf1f4fa472e1f34dec0d0437d69b72a4fea0ce08?network=preprod) |
| 5 | `1ad04ce4f18b00447fc498ce1348a0e26722815d303353ce4ee02041102018c2` | [1AM ↗](https://explorer.1am.xyz/tx/1ad04ce4f18b00447fc498ce1348a0e26722815d303353ce4ee02041102018c2?network=preprod) |
| 6 | `50d7068908308ac886fb4d7efd0093f64534e7b44a4beb325636fc4f891b25d4` | [1AM ↗](https://explorer.1am.xyz/tx/50d7068908308ac886fb4d7efd0093f64534e7b44a4beb325636fc4f891b25d4?network=preprod) |
| 7 | `47ff2e9cf842a3901509641e93b2138195fdd77340909c6295ba9aefc526e73f` | [1AM ↗](https://explorer.1am.xyz/tx/47ff2e9cf842a3901509641e93b2138195fdd77340909c6295ba9aefc526e73f?network=preprod) |
| 8 | `4a369685da78d4e0101d5f880c00987e9b6594bf75b18e7bbdbd373fed70b2fd` | [1AM ↗](https://explorer.1am.xyz/tx/4a369685da78d4e0101d5f880c00987e9b6594bf75b18e7bbdbd373fed70b2fd?network=preprod) |
| 9 | `1f1f78dfe72a5f016443a8fe088fe0244cd2e46172099baccba08baa8220b7eb` | [1AM ↗](https://explorer.1am.xyz/tx/1f1f78dfe72a5f016443a8fe088fe0244cd2e46172099baccba08baa8220b7eb?network=preprod) |
| 10 | `a8294c6643639a5c9cea13ee9d14057791c1258136d05edcccc0314d1318b242` | [1AM ↗](https://explorer.1am.xyz/tx/a8294c6643639a5c9cea13ee9d14057791c1258136d05edcccc0314d1318b242?network=preprod) |
| 11 | `55590bf00725ef16d038f2344c3baafe6b4685fcdb8cc7c47d12834055578864` | [1AM ↗](https://explorer.1am.xyz/tx/55590bf00725ef16d038f2344c3baafe6b4685fcdb8cc7c47d12834055578864?network=preprod) |

> Contracts were redeployed as the codebase evolved (v1 → v2 → v3), so these transactions span multiple contract addresses. The final settle tx (`55590bf...`) is on the active v3 contract.

---

> **Summary**: 51 unique user wallets + 1 deployer = 52 total addresses. All verified on Midnight Preprod between Sep 17-19, 2026. Average rating: 8.7/10.
