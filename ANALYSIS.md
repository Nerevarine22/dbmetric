# Metric trader analysis

Indexed cutoff: 2026-11-26T02:40:11.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 26,908 | 203,323 | $219,210,073 | 76.68% | 31.32% |
| 7d | 129,787 | 1,891,677 | $2,389,356,218 | 80.79% | 15.57% |
| all | 390,391 | 6,727,594 | $10,360,228,788 | 86.00% | 10.80% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $22,840,738 | 70 | 70 | 100.0% | USDC/USDT |
| 2 | [0x2e5ef37ade8afb712b8be858fec7389fe32857e2](https://etherscan.io/address/0x2e5ef37ade8afb712b8be858fec7389fe32857e2) | $11,810,128 | 59 | 38 | 69.5% | WETH/USDC |
| 3 | [0x32e5a17db695b812526e9140b4aea4f11fd05fdf](https://bscscan.com/address/0x32e5a17db695b812526e9140b4aea4f11fd05fdf) | $7,693,124 | 4,261 | 4,261 | 100.0% | USDC/USDT |
| 4 | [0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024](https://bscscan.com/address/0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024) | $5,432,023 | 431 | 431 | 0.0% | ANTB/USDT |
| 5 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $5,095,346 | 41 | 33 | 7.3% | USDC/USDT |
| 6 | [0x36c74ed01f8df60172b7a6ce885400b9bec653a7](https://etherscan.io/address/0x36c74ed01f8df60172b7a6ce885400b9bec653a7) | $3,591,401 | 4 | 4 | 100.0% | USDC/USDT |
| 7 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $3,452,143 | 15 | 15 | 0.0% | USDC/USDT |
| 8 | [0x67c9cc4af1bd9ec25d004d5c94d360009fab163c](https://etherscan.io/address/0x67c9cc4af1bd9ec25d004d5c94d360009fab163c) | $3,346,504 | 3 | 1 | 100.0% | WETH/USDC |
| 9 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $2,948,488 | 281 | 229 | 0.0% | USDC/USDT |
| 10 | [0x5d1c00b0c10d2a4cf4c0ecaf091ee6d4f4f70c4a](https://etherscan.io/address/0x5d1c00b0c10d2a4cf4c0ecaf091ee6d4f4f70c4a) | $2,446,681 | 28 | 24 | 0.0% | WETH/USDC |

## Interpretation

The top-volume cohort contains 270 addresses and accounts for 76.68% of estimated 24-hour pool turnover. Its entry cutoff is $125,101, compared with median wallet volume of $53.
Of 203,323 swaps, 203,301 have a USD estimate; 45,406 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,904 | 19,520 | 39,040 |
| Trading volume entry cutoff ≈ | $265,836 | $17,239 | $5,272 |
| Lifetime volume total ≈ | $8,910,016,765 | $10,021,456,479 | $10,209,123,957 |
| Volume in last 24h total ≈ | $188,417,926 | $212,646,635 | $215,486,668 |
| Lifetime volume median ≈ | $535,060 | $61,483 | $17,239 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 224.5 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 90 | 547 | 1009 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $4,178 | $2,493 | $1,539 |
| Lifetime deposits median, historical LPs only ≈ | $40,466 | $13,908 | $7,805 |

## Liquidity providers

Full LP history: complete. 7,112 historical owners; 4,955 owners with open shares; 4,953 positive, fully valued active portfolios.
Known active liquidity: $31,402,087. Cumulative deposits: $286,542,063; withdrawals: $255,101,710. Both token legs use synced spot quotes; repeated capital counts again in flows.
2 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $106,418 | 50 | 59.94% |
| Top 5% | $14,887 | 248 | 82.74% |
| Top 10% | $5,377 | 496 | 89.98% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $265,836 | 153 / 3,904 | 90 | $4,178 | $40,466 |
| Top 5% | $17,239 | 880 / 19,520 | 547 | $2,493 | $13,908 |
| Top 10% | $5,272 | 1,571 / 39,040 | 1,009 | $1,539 | $7,805 |

### LP snapshot verification

226 pools verified against pinned contract storage; 1,547 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26496441, 2026-11-26T02:40:11.000Z, hash 0x6111f30601efde4d75d3a32d0901c9cc493b42042b855a2f64f2e412fef8e519.
- BNB Chain: block 135769968, 2026-11-26T02:52:25.000Z, hash 0x53fdffb2cd955efbbf07c7005e022ca1a5c915b1709ae2dd03d519005ab042c8.
- Robinhood: block 123415197, 2026-11-26T02:52:53.000Z, hash 0x4b0b9f1a88ab81df2f057d6a9fa09aafb7285c966a1b773bc101ea65fcaf775f.
