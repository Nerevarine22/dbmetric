# Metric trader analysis

Indexed cutoff: 2026-11-28T16:42:35.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 29,111 | 179,571 | $201,925,864 | 79.44% | 25.41% |
| 7d | 122,423 | 1,687,142 | $1,963,525,012 | 83.53% | 21.41% |
| all | 417,604 | 7,257,717 | $10,937,043,758 | 86.44% | 10.78% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $11,482,366 | 39 | 39 | 100.0% | USDC/USDT |
| 2 | [0x3980daa7eaad0b7e0c53cfc5c2760037270da54d](https://etherscan.io/address/0x3980daa7eaad0b7e0c53cfc5c2760037270da54d) | $5,577,190 | 7 | 4 | 85.7% | WETH/USDC |
| 3 | [0x54e1d0283cbc300030b83cb1cec8c9f70db5e6e7](https://bscscan.com/address/0x54e1d0283cbc300030b83cb1cec8c9f70db5e6e7) | $5,110,310 | 2,548 | 1,832 | 0.0% | ANTB/USDT |
| 4 | [0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb](https://robinhoodchain.blockscout.com/address/0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb) | $4,613,494 | 141 | 141 | 0.0% | WETH/USDG |
| 5 | [0x84e8004bd8984101aa62d4a433393019547b90d3](https://robinhoodchain.blockscout.com/address/0x84e8004bd8984101aa62d4a433393019547b90d3) | $4,387,560 | 141 | 141 | 0.0% | WETH/USDG |
| 6 | [0x26de5022701d96c36d47f33b1d1a1c48032b1e00](https://robinhoodchain.blockscout.com/address/0x26de5022701d96c36d47f33b1d1a1c48032b1e00) | $4,339,311 | 131 | 131 | 0.0% | WETH/USDG |
| 7 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $4,296,909 | 23 | 23 | 0.0% | USDC/USDT |
| 8 | [0x0963545d05996d4b6deb88704ce25cbb3a73e52e](https://robinhoodchain.blockscout.com/address/0x0963545d05996d4b6deb88704ce25cbb3a73e52e) | $4,209,560 | 124 | 124 | 0.0% | WETH/USDG |
| 9 | [0x621aac8763c5d90ad8d1a07bfee887328c265e32](https://robinhoodchain.blockscout.com/address/0x621aac8763c5d90ad8d1a07bfee887328c265e32) | $3,792,605 | 119 | 119 | 0.0% | WETH/USDG |
| 10 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $3,508,714 | 232 | 189 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 292 addresses and accounts for 79.44% of estimated 24-hour pool turnover. Its entry cutoff is $119,412, compared with median wallet volume of $50.
Of 179,571 swaps, 179,571 have a USD estimate; 33,304 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 4,177 | 20,881 | 41,761 |
| Trading volume entry cutoff ≈ | $265,589 | $16,454 | $4,997 |
| Lifetime volume total ≈ | $9,454,085,389 | $10,593,626,633 | $10,784,145,175 |
| Volume in last 24h total ≈ | $175,248,463 | $195,214,054 | $197,891,510 |
| Lifetime volume median ≈ | $521,156 | $57,720 | $16,454 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 249 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 92 | 593 | 1082 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $2,445 | $2,708 | $1,607 |
| Lifetime deposits median, historical LPs only ≈ | $33,233 | $14,960 | $7,689 |

## Liquidity providers

Full LP history: complete. 7,327 historical owners; 4,920 owners with open shares; 4,919 positive, fully valued active portfolios.
Known active liquidity: $32,568,164. Cumulative deposits: $304,065,878; withdrawals: $271,596,273. Both token legs use synced spot quotes; repeated capital counts again in flows.
1 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $113,666 | 50 | 58.86% |
| Top 5% | $15,803 | 246 | 82.25% |
| Top 10% | $5,947 | 492 | 89.79% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $265,589 | 164 / 4,177 | 92 | $2,445 | $33,233 |
| Top 5% | $16,454 | 980 / 20,881 | 593 | $2,708 | $14,960 |
| Top 10% | $4,997 | 1,717 / 41,761 | 1,082 | $1,607 | $7,689 |

### LP snapshot verification

233 pools verified against pinned contract storage; 1,703 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26515000, 2026-11-28T16:42:35.000Z, hash 0xd8e287dbf0ef0dfc8ed24240cf490a13ade8b28cf168af2f252609459b3f52d5.
- BNB Chain: block 136266032, 2026-11-28T16:54:47.000Z, hash 0xfbf110766ecfe54ac102e6a9b3b3364c79504b2453378787bc2ea65d7841586f.
- Robinhood: block 125159918, 2026-11-28T16:55:21.000Z, hash 0x87d5b70c915fe334f52b40d400a41ca2f05feab0e83f2c4b3afd0e3c7d59efdb.
