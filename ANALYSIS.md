# Metric trader analysis

Indexed cutoff: 2026-11-27T04:52:59.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 25,816 | 217,890 | $153,890,340 | 70.95% | 25.18% |
| 7d | 123,684 | 1,902,404 | $2,186,398,103 | 79.63% | 16.62% |
| all | 400,194 | 6,962,754 | $10,527,588,358 | 86.06% | 10.80% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $9,413,106 | 38 | 38 | 100.0% | USDC/USDT |
| 2 | [0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb](https://robinhoodchain.blockscout.com/address/0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb) | $4,565,736 | 103 | 103 | 0.0% | WETH/USDG |
| 3 | [0x621aac8763c5d90ad8d1a07bfee887328c265e32](https://robinhoodchain.blockscout.com/address/0x621aac8763c5d90ad8d1a07bfee887328c265e32) | $4,465,540 | 100 | 100 | 0.0% | WETH/USDG |
| 4 | [0x26de5022701d96c36d47f33b1d1a1c48032b1e00](https://robinhoodchain.blockscout.com/address/0x26de5022701d96c36d47f33b1d1a1c48032b1e00) | $4,132,677 | 97 | 97 | 0.0% | WETH/USDG |
| 5 | [0x84e8004bd8984101aa62d4a433393019547b90d3](https://robinhoodchain.blockscout.com/address/0x84e8004bd8984101aa62d4a433393019547b90d3) | $3,897,654 | 88 | 88 | 0.0% | WETH/USDG |
| 6 | [0x0963545d05996d4b6deb88704ce25cbb3a73e52e](https://robinhoodchain.blockscout.com/address/0x0963545d05996d4b6deb88704ce25cbb3a73e52e) | $3,682,486 | 83 | 83 | 0.0% | WETH/USDG |
| 7 | [0x2e5ef37ade8afb712b8be858fec7389fe32857e2](https://bscscan.com/address/0x2e5ef37ade8afb712b8be858fec7389fe32857e2) | $3,303,242 | 51 | 26 | 62.7% | WETH/USDC |
| 8 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $1,847,353 | 6 | 6 | 0.0% | USDC/USDT |
| 9 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $1,777,938 | 210 | 175 | 0.0% | USDC/USDT |
| 10 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $1,661,147 | 30 | 28 | 13.3% | WETH/USDC |

## Interpretation

The top-volume cohort contains 259 addresses and accounts for 70.95% of estimated 24-hour pool turnover. Its entry cutoff is $98,681, compared with median wallet volume of $69.
Of 217,890 swaps, 217,890 have a USD estimate; 33,316 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 4,002 | 20,010 | 40,020 |
| Trading volume entry cutoff ≈ | $265,017 | $17,012 | $5,183 |
| Lifetime volume total ≈ | $9,060,082,278 | $10,185,681,605 | $10,375,203,325 |
| Volume in last 24h total ≈ | $119,374,290 | $145,946,701 | $149,885,365 |
| Lifetime volume median ≈ | $527,792 | $60,239 | $17,011 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 232.5 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 93 | 570 | 1040 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $1,945 | $2,754 | $1,561 |
| Lifetime deposits median, historical LPs only ≈ | $31,993 | $14,467 | $7,835 |

## Liquidity providers

Full LP history: complete. 7,210 historical owners; 4,951 owners with open shares; 4,950 positive, fully valued active portfolios.
Known active liquidity: $32,052,179. Cumulative deposits: $299,729,890; withdrawals: $267,770,936. Both token legs use synced spot quotes; repeated capital counts again in flows.
1 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $115,895 | 50 | 58.40% |
| Top 5% | $15,282 | 248 | 82.32% |
| Top 10% | $5,661 | 495 | 89.86% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $265,017 | 161 / 4,002 | 93 | $1,945 | $31,993 |
| Top 5% | $17,012 | 927 / 20,010 | 570 | $2,754 | $14,467 |
| Top 10% | $5,183 | 1,628 / 40,020 | 1,040 | $1,561 | $7,835 |

### LP snapshot verification

231 pools verified against pinned contract storage; 1,619 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26504275, 2026-11-27T04:52:59.000Z, hash 0xcfa93e52968af7da4f4c1728d71a2a0475a1cdfd736176b00ae174450cfb5eb0.
- BNB Chain: block 135979522, 2026-11-27T05:05:04.000Z, hash 0xdff67d391e155f980407934d73905ba8bfa50ce31e398c3e8daf816549ed2355.
- Robinhood: block 124006370, 2026-11-27T05:05:39.000Z, hash 0xe93e6ccc8ce51057e431b5b821e20d3527ec1f52c7e97eb3dc58433e0446081f.
