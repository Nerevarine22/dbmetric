# Metric trader analysis

Indexed cutoff: 2026-11-17T09:55:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 16,024 | 163,356 | $330,336,762 | 76.87% | 34.53% |
| 7d | 85,964 | 922,469 | $2,364,547,284 | 87.36% | 23.07% |
| all | 299,303 | 4,547,563 | $7,493,567,864 | 84.91% | 10.97% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $43,250,734 | 37,856 | 37,856 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $35,586,975 | 349 | 310 | 0.0% | USDC/USDT |
| 3 | [0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce](https://etherscan.io/address/0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce) | $7,709,801 | 37 | 30 | 0.0% | USDC/USDT |
| 4 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $4,847,191 | 35 | 34 | 0.0% | USDC/USDT |
| 5 | [0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc](https://etherscan.io/address/0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc) | $4,630,545 | 46 | 41 | 0.0% | USDC/USDT |
| 6 | [0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80](https://etherscan.io/address/0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80) | $4,245,646 | 45 | 30 | 0.0% | USDC/USDT |
| 7 | [0x927723690aab3380e7fa6b30d68cfe62ae029d95](https://etherscan.io/address/0x927723690aab3380e7fa6b30d68cfe62ae029d95) | $3,998,794 | 53 | 50 | 0.0% | USDC/USDT |
| 8 | [0xfb4f294f514fe7d12b5c45370bbebf1070d2f314](https://etherscan.io/address/0xfb4f294f514fe7d12b5c45370bbebf1070d2f314) | $3,478,034 | 33 | 33 | 0.0% | USDC/USDT |
| 9 | [0xa084d752cf7930e46d4ec1fb9379334001b528b8](https://bscscan.com/address/0xa084d752cf7930e46d4ec1fb9379334001b528b8) | $3,298,975 | 788 | 788 | 100.0% | USDC/USDT |
| 10 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $3,017,108 | 67 | 67 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 161 addresses and accounts for 76.87% of estimated 24-hour pool turnover. Its entry cutoff is $340,803, compared with median wallet volume of $97.
Of 163,356 swaps, 163,356 have a USD estimate; 51,880 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,994 | 14,966 | 29,931 |
| Trading volume entry cutoff ≈ | $241,016 | $18,980 | $5,932 |
| Lifetime volume total ≈ | $6,362,598,583 | $7,200,302,959 | $7,359,802,469 |
| Volume in last 24h total ≈ | $304,341,732 | $323,557,964 | $327,140,080 |
| Lifetime volume median ≈ | $495,979 | $63,332 | $18,980 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 155.5 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 62 | 401 | 760 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $5,532 | $2,563 | $1,599 |
| Lifetime deposits median, historical LPs only ≈ | $26,010 | $11,179 | $5,917 |

## Liquidity providers

Full LP history: complete. 6,187 historical owners; 4,562 owners with open shares; 4,562 positive, fully valued active portfolios.
Known active liquidity: $24,600,915. Cumulative deposits: $179,388,509; withdrawals: $154,623,731. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $96,020 | 46 | 58.89% |
| Top 5% | $11,914 | 229 | 82.85% |
| Top 10% | $4,681 | 457 | 89.88% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $241,016 | 104 / 2,994 | 62 | $5,532 | $26,010 |
| Top 5% | $18,980 | 602 / 14,966 | 401 | $2,563 | $11,179 |
| Top 10% | $5,932 | 1,132 / 29,931 | 760 | $1,599 | $5,917 |

### LP snapshot verification

171 pools verified against pinned contract storage; 1,035 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26434004, 2026-11-17T09:55:23.000Z, hash 0x62bc8b13d8b82b78a48d2cacd3fa7bddaac58296b103165784d6fb1e24d74917.
- BNB Chain: block 134100796, 2026-11-17T10:07:42.000Z, hash 0x8732eed9a378e6a919cb7bbbee369e81d343209d87a09560d5cf1656ad4f3f15.
- Robinhood: block 116496333, 2026-11-17T10:08:17.000Z, hash 0xb300ff6c7b9e72d51920b12f525a9f385c5a74695f8faa3f19e141c1b7d40314.
