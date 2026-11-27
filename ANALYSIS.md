# Metric trader analysis

Indexed cutoff: 2026-11-27T14:55:11.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 26,512 | 207,539 | $240,949,501 | 78.15% | 38.70% |
| 7d | 122,330 | 1,851,814 | $2,173,899,203 | 80.19% | 18.15% |
| all | 405,289 | 7,057,242 | $10,673,840,986 | 86.16% | 10.73% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x621aac8763c5d90ad8d1a07bfee887328c265e32](https://robinhoodchain.blockscout.com/address/0x621aac8763c5d90ad8d1a07bfee887328c265e32) | $14,077,886 | 368 | 368 | 0.0% | WETH/USDG |
| 2 | [0x84e8004bd8984101aa62d4a433393019547b90d3](https://robinhoodchain.blockscout.com/address/0x84e8004bd8984101aa62d4a433393019547b90d3) | $13,725,086 | 377 | 377 | 0.0% | WETH/USDG |
| 3 | [0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb](https://robinhoodchain.blockscout.com/address/0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb) | $13,444,606 | 368 | 368 | 0.0% | WETH/USDG |
| 4 | [0x0963545d05996d4b6deb88704ce25cbb3a73e52e](https://robinhoodchain.blockscout.com/address/0x0963545d05996d4b6deb88704ce25cbb3a73e52e) | $13,371,891 | 365 | 365 | 0.0% | WETH/USDG |
| 5 | [0x26de5022701d96c36d47f33b1d1a1c48032b1e00](https://robinhoodchain.blockscout.com/address/0x26de5022701d96c36d47f33b1d1a1c48032b1e00) | $13,307,118 | 363 | 363 | 0.0% | WETH/USDG |
| 6 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $10,655,867 | 42 | 42 | 100.0% | USDC/USDT |
| 7 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $6,597,246 | 30 | 30 | 0.0% | USDC/USDT |
| 8 | [0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024](https://bscscan.com/address/0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024) | $2,993,911 | 174 | 174 | 0.0% | ANTB/USDT |
| 9 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $2,607,643 | 35 | 29 | 20.0% | WETH/USDC |
| 10 | [0x4378ea8ab36a309ee2fbba9de6f5ff5e27c6a50a](https://bscscan.com/address/0x4378ea8ab36a309ee2fbba9de6f5ff5e27c6a50a) | $2,470,419 | 437 | 434 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 266 addresses and accounts for 78.15% of estimated 24-hour pool turnover. Its entry cutoff is $128,103, compared with median wallet volume of $66.
Of 207,539 swaps, 207,539 have a USD estimate; 39,549 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 4,053 | 20,265 | 40,529 |
| Trading volume entry cutoff ≈ | $265,612 | $16,916 | $5,140 |
| Lifetime volume total ≈ | $9,196,482,037 | $10,330,365,394 | $10,520,890,239 |
| Volume in last 24h total ≈ | $204,493,657 | $232,893,537 | $236,989,296 |
| Lifetime volume median ≈ | $525,738 | $59,726 | $16,916 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 233 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 86 | 564 | 1033 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $1,685 | $2,648 | $1,527 |
| Lifetime deposits median, historical LPs only ≈ | $30,413 | $14,874 | $7,513 |

## Liquidity providers

Full LP history: complete. 7,254 historical owners; 4,867 owners with open shares; 4,860 positive, fully valued active portfolios.
Known active liquidity: $31,816,096. Cumulative deposits: $298,951,927; withdrawals: $267,171,875. Both token legs use synced spot quotes; repeated capital counts again in flows.
7 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $115,509 | 49 | 59.13% |
| Top 5% | $15,177 | 243 | 82.68% |
| Top 10% | $5,517 | 486 | 90.06% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $265,612 | 161 / 4,053 | 86 | $1,685 | $30,413 |
| Top 5% | $16,916 | 945 / 20,265 | 564 | $2,648 | $14,874 |
| Top 10% | $5,140 | 1,661 / 40,529 | 1,033 | $1,527 | $7,513 |

### LP snapshot verification

231 pools verified against pinned contract storage; 1,656 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26507275, 2026-11-27T14:55:11.000Z, hash 0xe24e6ed20e2aee677afaf0d73d0c66b53d32e5f12fb373945acdde77b6288342.
- BNB Chain: block 136059806, 2026-11-27T15:07:25.000Z, hash 0xdad4cd90c447ef1a9edda10ab4cd1556b9a7e654e5b15792b9d88b87dc2fcfe2.
- Robinhood: block 124339348, 2026-11-27T15:08:01.000Z, hash 0xfecb9bc4c52009a4024bdb1d6e80e04efd3dd47f4d7f4f0d03cf410e36d2abc5.
