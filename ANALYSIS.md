# Metric trader analysis

Indexed cutoff: 2026-11-16T14:50:47.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 17,404 | 148,750 | $363,146,318 | 79.06% | 29.70% |
| 7d | 91,265 | 879,907 | $2,298,497,384 | 87.66% | 21.56% |
| all | 295,664 | 4,425,396 | $7,274,277,358 | 84.65% | 10.78% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $27,784,288 | 277 | 232 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $25,372,805 | 19,048 | 19,048 | 100.0% | USDC/USDT |
| 3 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $7,385,023 | 112 | 112 | 100.0% | USDC/USDT |
| 4 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $7,325,589 | 105 | 105 | 100.0% | USDC/USDT |
| 5 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $7,236,320 | 103 | 103 | 100.0% | USDC/USDT |
| 6 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $7,000,256 | 102 | 102 | 100.0% | USDC/USDT |
| 7 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $6,799,878 | 104 | 104 | 100.0% | USDC/USDT |
| 8 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $6,402,344 | 90 | 90 | 100.0% | USDC/USDT |
| 9 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,281,769 | 92 | 92 | 100.0% | USDC/USDT |
| 10 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,249,819 | 83 | 83 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 175 addresses and accounts for 79.06% of estimated 24-hour pool turnover. Its entry cutoff is $270,414, compared with median wallet volume of $96.
Of 148,750 swaps, 148,750 have a USD estimate; 45,972 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,957 | 14,784 | 29,567 |
| Trading volume entry cutoff ≈ | $239,027 | $19,015 | $5,909 |
| Lifetime volume total ≈ | $6,158,032,250 | $6,984,256,368 | $7,142,006,389 |
| Volume in last 24h total ≈ | $336,060,178 | $356,759,790 | $359,622,392 |
| Lifetime volume median ≈ | $493,152 | $63,332 | $19,015 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 57 | 383 | 740 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,916 | $2,395 | $1,467 |
| Lifetime deposits median, historical LPs only ≈ | $26,092 | $11,742 | $5,769 |

## Liquidity providers

Full LP history: complete. 6,118 historical owners; 4,507 owners with open shares; 4,507 positive, fully valued active portfolios.
Known active liquidity: $23,608,708. Cumulative deposits: $176,760,145; withdrawals: $153,005,550. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $91,767 | 46 | 59.50% |
| Top 5% | $11,377 | 226 | 83.02% |
| Top 10% | $4,472 | 451 | 89.95% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $239,027 | 98 / 2,957 | 57 | $6,916 | $26,092 |
| Top 5% | $19,015 | 580 / 14,784 | 383 | $2,395 | $11,742 |
| Top 10% | $5,909 | 1,103 / 29,567 | 740 | $1,467 | $5,769 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26428301, 2026-11-16T14:50:47.000Z, hash 0x709426cd48ad0fc73614323938e360c6622063d744d892a6c4eaa980a05ec4d5.
- BNB Chain: block 133948201, 2026-11-16T15:02:58.000Z, hash 0x9cb9e33fee6060b2ab38c12da15a865f8d87ededea8a07aaedcf07dea59efbd4.
- Robinhood: block 115851517, 2026-11-16T15:03:33.000Z, hash 0x0f55997058c7a2c6c56579fa26b7565f8b30c09927fa0d906aa5e99c42c74467.
