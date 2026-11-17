# Metric trader analysis

Indexed cutoff: 2026-11-17T12:14:59.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 15,287 | 160,730 | $310,444,713 | 76.33% | 35.74% |
| 7d | 85,282 | 927,887 | $2,368,056,019 | 87.38% | 23.36% |
| all | 299,763 | 4,562,665 | $7,520,176,184 | 84.94% | 11.01% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $42,164,040 | 37,943 | 37,943 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $33,522,416 | 341 | 303 | 0.0% | USDC/USDT |
| 3 | [0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce](https://etherscan.io/address/0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce) | $6,903,811 | 38 | 30 | 0.0% | WETH/USDC |
| 4 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $5,524,367 | 38 | 37 | 0.0% | USDC/USDT |
| 5 | [0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc](https://etherscan.io/address/0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc) | $5,244,308 | 48 | 43 | 2.1% | USDC/USDT |
| 6 | [0x927723690aab3380e7fa6b30d68cfe62ae029d95](https://etherscan.io/address/0x927723690aab3380e7fa6b30d68cfe62ae029d95) | $4,036,117 | 57 | 53 | 0.0% | USDC/USDT |
| 7 | [0xb00b06073d459a5c0c9d6040b2a0e665642faced](https://etherscan.io/address/0xb00b06073d459a5c0c9d6040b2a0e665642faced) | $3,999,942 | 4 | 2 | 100.0% | USDC/USDT |
| 8 | [0xa084d752cf7930e46d4ec1fb9379334001b528b8](https://bscscan.com/address/0xa084d752cf7930e46d4ec1fb9379334001b528b8) | $3,346,151 | 793 | 793 | 100.0% | USDC/USDT |
| 9 | [0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80](https://etherscan.io/address/0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80) | $3,212,996 | 30 | 26 | 0.0% | USDC/USDT |
| 10 | [0xfb4f294f514fe7d12b5c45370bbebf1070d2f314](https://etherscan.io/address/0xfb4f294f514fe7d12b5c45370bbebf1070d2f314) | $2,989,145 | 31 | 31 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 153 addresses and accounts for 76.33% of estimated 24-hour pool turnover. Its entry cutoff is $340,358, compared with median wallet volume of $100.
Of 160,730 swaps, 160,730 have a USD estimate; 52,634 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,998 | 14,989 | 29,977 |
| Trading volume entry cutoff ≈ | $241,417 | $18,969 | $5,933 |
| Lifetime volume total ≈ | $6,387,313,508 | $7,226,480,257 | $7,386,157,432 |
| Volume in last 24h total ≈ | $285,459,741 | $303,756,416 | $307,345,383 |
| Lifetime volume median ≈ | $496,658 | $63,390 | $18,969 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 155 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 62 | 403 | 767 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $5,552 | $2,431 | $1,575 |
| Lifetime deposits median, historical LPs only ≈ | $26,043 | $11,258 | $5,872 |

## Liquidity providers

Full LP history: complete. 6,199 historical owners; 4,576 owners with open shares; 4,576 positive, fully valued active portfolios.
Known active liquidity: $24,673,996. Cumulative deposits: $191,683,958; withdrawals: $166,873,193. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $99,385 | 46 | 59.05% |
| Top 5% | $11,974 | 229 | 82.86% |
| Top 10% | $4,705 | 458 | 89.88% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $241,417 | 104 / 2,998 | 62 | $5,552 | $26,043 |
| Top 5% | $18,969 | 604 / 14,989 | 403 | $2,431 | $11,258 |
| Top 10% | $5,933 | 1,136 / 29,977 | 767 | $1,575 | $5,872 |

### LP snapshot verification

172 pools verified against pinned contract storage; 1,039 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26434699, 2026-11-17T12:14:59.000Z, hash 0x10513ca9b106629c3c8b331e729f960fc19dfe6affb8ecd62a2f4aff2f4caca5.
- BNB Chain: block 134119369, 2026-11-17T12:27:03.000Z, hash 0xfa605d4a9bd74a9e6fa61fafe4d2c7dcda30d1379921a6e0d876f82f77aecf6b.
- Robinhood: block 116576048, 2026-11-17T12:27:38.000Z, hash 0x7d0dc9d504e0d0831270072fda839d1d83b542987737b07c634a2c616f378816.
