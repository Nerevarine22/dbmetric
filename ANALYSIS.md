# Metric trader analysis

Indexed cutoff: 2026-11-25T11:12:47.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 26,504 | 200,573 | $281,544,895 | 79.20% | 33.09% |
| 7d | 127,541 | 1,866,860 | $2,441,626,215 | 80.84% | 15.43% |
| all | 384,862 | 6,600,016 | $10,199,948,961 | 85.88% | 10.69% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $46,734,692 | 140 | 140 | 100.0% | USDC/USDT |
| 2 | [0x32e5a17db695b812526e9140b4aea4f11fd05fdf](https://bscscan.com/address/0x32e5a17db695b812526e9140b4aea4f11fd05fdf) | $16,456,331 | 8,811 | 8,811 | 100.0% | USDC/USDT |
| 3 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $7,321,370 | 243 | 207 | 0.0% | USDC/USDT |
| 4 | [0x6a9d8c0fa7eb894125be86d75080b43b26a65f36](https://etherscan.io/address/0x6a9d8c0fa7eb894125be86d75080b43b26a65f36) | $3,921,068 | 44 | 41 | 0.0% | USDC/USDT |
| 5 | [0xbee44aba13855ad98d57190906803b09c175cccb](https://etherscan.io/address/0xbee44aba13855ad98d57190906803b09c175cccb) | $3,896,714 | 42 | 38 | 2.4% | USDC/USDT |
| 6 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $3,526,667 | 29 | 26 | 0.0% | USDC/USDT |
| 7 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $3,091,710 | 268 | 268 | 100.0% | ANTB/USDT |
| 8 | [0x95dd2666643bf9a74201ae5cf88365898604b730](https://bscscan.com/address/0x95dd2666643bf9a74201ae5cf88365898604b730) | $2,788,687 | 263 | 263 | 100.0% | ANTB/USDT |
| 9 | [0x5ae90d59f100692f24b0f72acd99b7dc223046cc](https://bscscan.com/address/0x5ae90d59f100692f24b0f72acd99b7dc223046cc) | $2,733,116 | 254 | 254 | 100.0% | ANTB/USDT |
| 10 | [0xf3a3ab25347de13b6955868a88c4b25da6007a1f](https://etherscan.io/address/0xf3a3ab25347de13b6955868a88c4b25da6007a1f) | $2,705,644 | 52 | 51 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 266 addresses and accounts for 79.20% of estimated 24-hour pool turnover. Its entry cutoff is $149,016, compared with median wallet volume of $52.
Of 200,573 swaps, 200,533 have a USD estimate; 48,436 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,849 | 19,244 | 38,487 |
| Trading volume entry cutoff ≈ | $266,002 | $17,398 | $5,332 |
| Lifetime volume total ≈ | $8,760,093,958 | $9,862,794,223 | $10,049,516,396 |
| Volume in last 24h total ≈ | $251,184,489 | $274,932,689 | $278,078,450 |
| Lifetime volume median ≈ | $533,805 | $62,191 | $17,398 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 213 | 18 | 10 |
| Active UTC days median | 13 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 89 | 543 | 1009 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $2,910 | $2,690 | $1,514 |
| Lifetime deposits median, historical LPs only ≈ | $31,156 | $13,262 | $7,662 |

## Liquidity providers

Full LP history: complete. 7,065 historical owners; 4,955 owners with open shares; 4,953 positive, fully valued active portfolios.
Known active liquidity: $30,813,391. Cumulative deposits: $276,119,415; withdrawals: $244,999,124. Both token legs use synced spot quotes; repeated capital counts again in flows.
2 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $100,128 | 50 | 60.14% |
| Top 5% | $14,796 | 248 | 82.70% |
| Top 10% | $5,297 | 496 | 89.97% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $266,002 | 149 / 3,849 | 89 | $2,910 | $31,156 |
| Top 5% | $17,398 | 862 / 19,244 | 543 | $2,690 | $13,262 |
| Top 10% | $5,332 | 1,552 / 38,487 | 1,009 | $1,514 | $7,662 |

### LP snapshot verification

222 pools verified against pinned contract storage; 1,517 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26491820, 2026-11-25T11:12:47.000Z, hash 0x1342ec2ced4a582e05638bf7dc21ea4b570c9b5e6d4122a61aa7e03f4061750c.
- BNB Chain: block 135646399, 2026-11-25T11:25:02.000Z, hash 0xb21190d4d2aafdda8ef8b8d9433c88cc48db19349fd6f078127f5e17c8ccea57.
- Robinhood: block 123003577, 2026-11-25T11:25:36.000Z, hash 0xb3a35654bfe4a2886a711af8b093dbb2d14dbdd22346bfc8addd2e1fb9b59c11.
