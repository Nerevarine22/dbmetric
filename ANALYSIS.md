# Metric trader analysis

Indexed cutoff: 2026-11-26T12:23:47.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 26,417 | 211,923 | $201,174,803 | 73.97% | 30.28% |
| 7d | 130,661 | 1,922,286 | $2,345,433,036 | 80.54% | 15.74% |
| all | 394,834 | 6,823,775 | $10,415,472,672 | 86.02% | 10.79% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $20,127,475 | 63 | 63 | 100.0% | USDC/USDT |
| 2 | [0x2e5ef37ade8afb712b8be858fec7389fe32857e2](https://robinhoodchain.blockscout.com/address/0x2e5ef37ade8afb712b8be858fec7389fe32857e2) | $12,318,470 | 76 | 38 | 60.5% | WETH/USDC |
| 3 | [0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024](https://bscscan.com/address/0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024) | $6,297,877 | 503 | 503 | 0.0% | ANTB/USDT |
| 4 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $4,574,077 | 47 | 38 | 12.8% | USDC/USDT |
| 5 | [0x36c74ed01f8df60172b7a6ce885400b9bec653a7](https://etherscan.io/address/0x36c74ed01f8df60172b7a6ce885400b9bec653a7) | $3,591,401 | 4 | 4 | 100.0% | USDC/USDT |
| 6 | [0x67c9cc4af1bd9ec25d004d5c94d360009fab163c](https://etherscan.io/address/0x67c9cc4af1bd9ec25d004d5c94d360009fab163c) | $3,346,504 | 3 | 1 | 100.0% | WETH/USDC |
| 7 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $3,272,361 | 14 | 14 | 0.0% | USDC/USDT |
| 8 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $2,786,633 | 222 | 178 | 0.0% | USDC/USDT |
| 9 | [0xf70da97812cb96acdf810712aa562db8dfa3dbef](https://etherscan.io/address/0xf70da97812cb96acdf810712aa562db8dfa3dbef) | $2,404,429 | 104 | 61 | 93.3% | USDC/USDT |
| 10 | [0xbee44aba13855ad98d57190906803b09c175cccb](https://etherscan.io/address/0xbee44aba13855ad98d57190906803b09c175cccb) | $2,188,384 | 47 | 43 | 0.0% | WETH/USDC |

## Interpretation

The top-volume cohort contains 265 addresses and accounts for 73.97% of estimated 24-hour pool turnover. Its entry cutoff is $122,628, compared with median wallet volume of $67.
Of 211,923 swaps, 211,899 have a USD estimate; 41,686 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,949 | 19,742 | 39,484 |
| Trading volume entry cutoff ≈ | $264,678 | $17,110 | $5,215 |
| Lifetime volume total ≈ | $8,959,285,333 | $10,076,158,469 | $10,264,135,503 |
| Volume in last 24h total ≈ | $167,065,876 | $194,191,676 | $197,248,414 |
| Lifetime volume median ≈ | $532,950 | $60,967 | $17,109 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 227 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 94 | 569 | 1035 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $3,779 | $2,279 | $1,524 |
| Lifetime deposits median, historical LPs only ≈ | $36,672 | $13,571 | $7,616 |

## Liquidity providers

Full LP history: complete. 7,153 historical owners; 4,992 owners with open shares; 4,991 positive, fully valued active portfolios.
Known active liquidity: $31,078,397. Cumulative deposits: $293,113,955; withdrawals: $261,993,206. Both token legs use synced spot quotes; repeated capital counts again in flows.
1 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $109,742 | 50 | 59.53% |
| Top 5% | $14,839 | 250 | 82.43% |
| Top 10% | $5,378 | 500 | 89.79% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $264,678 | 157 / 3,949 | 94 | $3,779 | $36,672 |
| Top 5% | $17,110 | 900 / 19,742 | 569 | $2,279 | $13,571 |
| Top 10% | $5,215 | 1,594 / 39,484 | 1,035 | $1,524 | $7,616 |

### LP snapshot verification

230 pools verified against pinned contract storage; 1,564 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26499351, 2026-11-26T12:23:47.000Z, hash 0xe87b4c0e0ab8cc3a34574207c28493c8292d1fa8982dd72deaf437f1268e2088.
- BNB Chain: block 135847743, 2026-11-26T12:36:03.000Z, hash 0x15ad162d5a59044297dbee8709c0e07f16f6c2be11d5e42fb8f3fa309f5d05c6.
- Robinhood: block 123609944, 2026-11-26T12:36:21.000Z, hash 0xc76054a0a0365f07292097ac50a9e54c9d45ab54934ede29a3c78f666509507d.
