# Metric trader analysis

Indexed cutoff: 2026-11-16T14:21:35.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 17,212 | 145,823 | $364,160,543 | 78.99% | 29.48% |
| 7d | 91,300 | 877,819 | $2,293,674,614 | 87.64% | 21.49% |
| all | 295,388 | 4,419,308 | $7,261,001,634 | 84.64% | 10.76% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $27,731,079 | 280 | 229 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $24,734,399 | 18,534 | 18,534 | 100.0% | USDC/USDT |
| 3 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $7,595,858 | 107 | 107 | 100.0% | USDC/USDT |
| 4 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $7,352,266 | 99 | 99 | 100.0% | USDC/USDT |
| 5 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $7,067,548 | 108 | 108 | 100.0% | USDC/USDT |
| 6 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,946,273 | 86 | 86 | 100.0% | USDC/USDT |
| 7 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $6,636,652 | 102 | 102 | 100.0% | USDC/USDT |
| 8 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $6,536,816 | 96 | 96 | 100.0% | USDC/USDT |
| 9 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,408,519 | 88 | 88 | 100.0% | USDC/USDT |
| 10 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $6,342,323 | 83 | 83 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 173 addresses and accounts for 78.99% of estimated 24-hour pool turnover. Its entry cutoff is $274,037, compared with median wallet volume of $94.
Of 145,823 swaps, 145,823 have a USD estimate; 44,266 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,954 | 14,770 | 29,539 |
| Trading volume entry cutoff ≈ | $239,649 | $19,018 | $5,903 |
| Lifetime volume total ≈ | $6,145,388,393 | $6,971,318,429 | $7,128,959,156 |
| Volume in last 24h total ≈ | $337,271,382 | $358,072,930 | $360,759,232 |
| Lifetime volume median ≈ | $493,223 | $63,271 | $19,018 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 57 | 382 | 741 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,916 | $2,341 | $1,485 |
| Lifetime deposits median, historical LPs only ≈ | $26,067 | $11,556 | $5,769 |

## Liquidity providers

Full LP history: complete. 6,117 historical owners; 4,506 owners with open shares; 4,506 positive, fully valued active portfolios.
Known active liquidity: $23,606,576. Cumulative deposits: $176,692,519; withdrawals: $152,962,374. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $89,788 | 46 | 59.53% |
| Top 5% | $11,358 | 226 | 83.00% |
| Top 10% | $4,465 | 451 | 89.94% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $239,649 | 98 / 2,954 | 57 | $6,916 | $26,067 |
| Top 5% | $19,018 | 579 / 14,770 | 382 | $2,341 | $11,556 |
| Top 10% | $5,903 | 1,103 / 29,539 | 741 | $1,485 | $5,769 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26428156, 2026-11-16T14:21:35.000Z, hash 0xa060eb64b3a12031879e17cce56bf03a255dabce012229e99f22ea4a8198c5c8.
- BNB Chain: block 133944317, 2026-11-16T14:33:49.000Z, hash 0x9ca8abe24bd497c4fb7288a4de782807f87373c2d146b015a654235d962d019f.
- Robinhood: block 115834354, 2026-11-16T14:34:24.000Z, hash 0x5e418a054e75188988aa9d5585802f7826f877fab8e512df044467c9bfd1e09d.
