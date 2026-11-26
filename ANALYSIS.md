# Metric trader analysis

Indexed cutoff: 2026-11-26T22:11:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 25,140 | 214,462 | $148,857,490 | 69.29% | 24.69% |
| 7d | 128,183 | 1,914,599 | $2,226,492,505 | 79.82% | 16.08% |
| all | 397,908 | 6,909,959 | $10,471,383,543 | 86.03% | 10.78% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x2e5ef37ade8afb712b8be858fec7389fe32857e2](https://etherscan.io/address/0x2e5ef37ade8afb712b8be858fec7389fe32857e2) | $12,440,953 | 68 | 33 | 57.4% | WETH/USDC |
| 2 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $6,090,729 | 25 | 25 | 100.0% | USDC/USDT |
| 3 | [0x67c9cc4af1bd9ec25d004d5c94d360009fab163c](https://etherscan.io/address/0x67c9cc4af1bd9ec25d004d5c94d360009fab163c) | $3,346,504 | 3 | 1 | 100.0% | WETH/USDC |
| 4 | [0xbee44aba13855ad98d57190906803b09c175cccb](https://etherscan.io/address/0xbee44aba13855ad98d57190906803b09c175cccb) | $2,866,472 | 44 | 39 | 0.0% | WETH/USDC |
| 5 | [0xf70da97812cb96acdf810712aa562db8dfa3dbef](https://bscscan.com/address/0xf70da97812cb96acdf810712aa562db8dfa3dbef) | $2,792,868 | 85 | 56 | 92.9% | USDC/USDT |
| 6 | [0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb](https://robinhoodchain.blockscout.com/address/0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb) | $2,143,909 | 49 | 49 | 0.0% | WETH/USDG |
| 7 | [0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024](https://bscscan.com/address/0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024) | $1,849,285 | 169 | 169 | 0.0% | ANTB/USDT |
| 8 | [0x621aac8763c5d90ad8d1a07bfee887328c265e32](https://robinhoodchain.blockscout.com/address/0x621aac8763c5d90ad8d1a07bfee887328c265e32) | $1,796,085 | 42 | 42 | 0.0% | WETH/USDG |
| 9 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $1,720,421 | 46 | 39 | 15.2% | WETH/USDC |
| 10 | [0x26de5022701d96c36d47f33b1d1a1c48032b1e00](https://robinhoodchain.blockscout.com/address/0x26de5022701d96c36d47f33b1d1a1c48032b1e00) | $1,702,955 | 40 | 40 | 0.0% | WETH/USDG |

## Interpretation

The top-volume cohort contains 252 addresses and accounts for 69.29% of estimated 24-hour pool turnover. Its entry cutoff is $109,579, compared with median wallet volume of $68.
Of 214,462 swaps, 214,438 have a USD estimate; 33,923 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,980 | 19,896 | 39,791 |
| Trading volume entry cutoff ≈ | $264,495 | $17,046 | $5,206 |
| Lifetime volume total ≈ | $9,008,735,519 | $10,130,192,836 | $10,319,273,383 |
| Volume in last 24h total ≈ | $115,900,844 | $141,441,797 | $145,106,659 |
| Lifetime volume median ≈ | $528,700 | $60,656 | $17,046 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 231 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 91 | 563 | 1034 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $3,639 | $2,207 | $1,528 |
| Lifetime deposits median, historical LPs only ≈ | $36,651 | $13,641 | $7,654 |

## Liquidity providers

Full LP history: complete. 7,189 historical owners; 4,991 owners with open shares; 4,990 positive, fully valued active portfolios.
Known active liquidity: $31,365,150. Cumulative deposits: $295,110,013; withdrawals: $263,729,132. Both token legs use synced spot quotes; repeated capital counts again in flows.
1 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $114,176 | 50 | 59.66% |
| Top 5% | $14,830 | 250 | 82.55% |
| Top 10% | $5,370 | 499 | 89.89% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $264,495 | 157 / 3,980 | 91 | $3,639 | $36,651 |
| Top 5% | $17,046 | 914 / 19,896 | 563 | $2,207 | $13,641 |
| Top 10% | $5,206 | 1,613 / 39,791 | 1,034 | $1,528 | $7,654 |

### LP snapshot verification

230 pools verified against pinned contract storage; 1,604 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26502276, 2026-11-26T22:11:23.000Z, hash 0x4b263409f99a64879ab1f35e5089a55cf151646e1de08322b4d81e19493f866a.
- BNB Chain: block 135926013, 2026-11-26T22:23:40.000Z, hash 0x4030e547d6ef7cf1c62975f8e0cfea45caee1f2816d1bd837a0ba9178ce0a6ac.
- Robinhood: block 123793636, 2026-11-26T22:24:14.000Z, hash 0x76716d0be674bf69e55a957d5c73e689ebac7e1346b8b23efde8f44f6dbd4fb3.
