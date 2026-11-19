# Metric trader analysis

Indexed cutoff: 2026-11-19T01:02:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 18,266 | 164,540 | $313,248,231 | 75.80% | 24.14% |
| 7d | 81,334 | 1,038,839 | $2,397,772,036 | 86.99% | 22.69% |
| all | 309,080 | 4,825,571 | $7,957,704,148 | 85.39% | 11.32% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $25,428,080 | 255 | 228 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $9,636,634 | 12,120 | 12,120 | 100.0% | USDC/USDT |
| 3 | [0x259e7b199c9643c973747632cb5effe1d4a8c801](https://etherscan.io/address/0x259e7b199c9643c973747632cb5effe1d4a8c801) | $9,036,723 | 16 | 16 | 0.0% | USDC/USDT |
| 4 | [0xad6717893bd4f413f3a5ca50b80e98aba04b9091](https://etherscan.io/address/0xad6717893bd4f413f3a5ca50b80e98aba04b9091) | $5,087,956 | 13 | 13 | 0.0% | USDC/USDT |
| 5 | [0xc33137a51e05922f23bcdf97da3f3c217c3ce4a8](https://etherscan.io/address/0xc33137a51e05922f23bcdf97da3f3c217c3ce4a8) | $4,901,356 | 13 | 13 | 0.0% | USDC/USDT |
| 6 | [0xff5c19bdc40ced71e3c8f38b7a09bf6f0b7abcbe](https://etherscan.io/address/0xff5c19bdc40ced71e3c8f38b7a09bf6f0b7abcbe) | $4,833,902 | 13 | 12 | 0.0% | USDC/USDT |
| 7 | [0x8cda33303e4d192c84127f778ffc5cf67d846e22](https://etherscan.io/address/0x8cda33303e4d192c84127f778ffc5cf67d846e22) | $4,411,695 | 33 | 20 | 0.0% | USDC/USDT |
| 8 | [0x0e0674412aba2303ac2aa3e669b295c6269e2c9a](https://etherscan.io/address/0x0e0674412aba2303ac2aa3e669b295c6269e2c9a) | $4,377,977 | 8 | 8 | 0.0% | USDC/USDT |
| 9 | [0xbee355e5a9b1c5359796cf907138448b27f0ccca](https://etherscan.io/address/0xbee355e5a9b1c5359796cf907138448b27f0ccca) | $4,164,236 | 51 | 44 | 0.0% | WETH/USDC |
| 10 | [0x927723690aab3380e7fa6b30d68cfe62ae029d95](https://etherscan.io/address/0x927723690aab3380e7fa6b30d68cfe62ae029d95) | $3,735,335 | 40 | 36 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 183 addresses and accounts for 75.80% of estimated 24-hour pool turnover. Its entry cutoff is $273,393, compared with median wallet volume of $100.
Of 164,540 swaps, 164,540 have a USD estimate; 62,217 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,091 | 15,454 | 30,908 |
| Trading volume entry cutoff ≈ | $243,434 | $18,830 | $5,909 |
| Lifetime volume total ≈ | $6,794,923,937 | $7,656,492,496 | $7,819,633,127 |
| Volume in last 24h total ≈ | $283,827,057 | $305,464,343 | $309,072,347 |
| Lifetime volume median ≈ | $501,909 | $63,356 | $18,830 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 155 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 72 | 441 | 805 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $5,259 | $2,135 | $1,513 |
| Lifetime deposits median, historical LPs only ≈ | $26,003 | $10,399 | $6,278 |

## Liquidity providers

Full LP history: complete. 6,338 historical owners; 4,657 owners with open shares; 4,657 positive, fully valued active portfolios.
Known active liquidity: $26,012,390. Cumulative deposits: $209,822,772; withdrawals: $183,763,436. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $99,980 | 47 | 58.37% |
| Top 5% | $12,955 | 233 | 82.84% |
| Top 10% | $4,811 | 466 | 89.94% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $243,434 | 116 / 3,091 | 72 | $5,259 | $26,003 |
| Top 5% | $18,830 | 652 / 15,454 | 441 | $2,135 | $10,399 |
| Top 10% | $5,909 | 1,197 / 30,908 | 805 | $1,513 | $6,278 |

### LP snapshot verification

192 pools verified against pinned contract storage; 1,074 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26445710, 2026-11-19T01:02:23.000Z, hash 0xeb99ef692961807abb559b7b38d859fd9325876b38c03b0c2830db35d96d3137.
- BNB Chain: block 134413530, 2026-11-19T01:14:38.000Z, hash 0x026315478d48a6b6f4b99e945802d444699d5fa1fb01d9f4abb94491957ced4b.
- Robinhood: block 117840535, 2026-11-19T01:15:13.000Z, hash 0x61fc5c2fbd3d0defb7e78e2ca8eddc476dafd1738ddeea5964a52df3d1990edd.
