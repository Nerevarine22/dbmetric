# Metric trader analysis

Indexed cutoff: 2026-11-17T09:38:47.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 16,089 | 163,592 | $330,451,435 | 76.93% | 34.47% |
| 7d | 86,041 | 921,713 | $2,363,027,053 | 87.37% | 23.07% |
| all | 299,236 | 4,545,757 | $7,489,817,170 | 84.90% | 10.97% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $43,391,667 | 37,853 | 37,853 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $35,519,246 | 346 | 307 | 0.0% | USDC/USDT |
| 3 | [0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce](https://etherscan.io/address/0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce) | $7,709,801 | 37 | 30 | 0.0% | USDC/USDT |
| 4 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $4,847,191 | 35 | 34 | 0.0% | USDC/USDT |
| 5 | [0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc](https://etherscan.io/address/0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc) | $4,630,545 | 46 | 41 | 0.0% | USDC/USDT |
| 6 | [0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80](https://etherscan.io/address/0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80) | $4,244,333 | 43 | 29 | 0.0% | USDC/USDT |
| 7 | [0x927723690aab3380e7fa6b30d68cfe62ae029d95](https://etherscan.io/address/0x927723690aab3380e7fa6b30d68cfe62ae029d95) | $3,758,078 | 49 | 47 | 0.0% | USDC/USDT |
| 8 | [0xfb4f294f514fe7d12b5c45370bbebf1070d2f314](https://etherscan.io/address/0xfb4f294f514fe7d12b5c45370bbebf1070d2f314) | $3,478,034 | 33 | 33 | 0.0% | USDC/USDT |
| 9 | [0xa084d752cf7930e46d4ec1fb9379334001b528b8](https://bscscan.com/address/0xa084d752cf7930e46d4ec1fb9379334001b528b8) | $3,302,976 | 787 | 787 | 100.0% | USDC/USDT |
| 10 | [0x17701ea4718c8228b26912d6dd81a64341a2d2b9](https://etherscan.io/address/0x17701ea4718c8228b26912d6dd81a64341a2d2b9) | $3,023,055 | 75 | 74 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 161 addresses and accounts for 76.93% of estimated 24-hour pool turnover. Its entry cutoff is $340,358, compared with median wallet volume of $96.
Of 163,592 swaps, 163,592 have a USD estimate; 51,834 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,993 | 14,962 | 29,924 |
| Trading volume entry cutoff ≈ | $241,016 | $18,978 | $5,933 |
| Lifetime volume total ≈ | $6,358,970,213 | $7,196,605,747 | $7,356,078,874 |
| Volume in last 24h total ≈ | $304,473,327 | $323,676,734 | $327,262,817 |
| Lifetime volume median ≈ | $495,577 | $63,366 | $18,976 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 155 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 62 | 401 | 759 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $5,535 | $2,612 | $1,601 |
| Lifetime deposits median, historical LPs only ≈ | $26,016 | $11,202 | $5,918 |

## Liquidity providers

Full LP history: complete. 6,185 historical owners; 4,559 owners with open shares; 4,559 positive, fully valued active portfolios.
Known active liquidity: $24,442,212. Cumulative deposits: $179,211,155; withdrawals: $154,604,302. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $96,031 | 46 | 58.51% |
| Top 5% | $11,976 | 228 | 82.66% |
| Top 10% | $4,705 | 456 | 89.79% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $241,016 | 104 / 2,993 | 62 | $5,535 | $26,016 |
| Top 5% | $18,978 | 601 / 14,962 | 401 | $2,612 | $11,202 |
| Top 10% | $5,933 | 1,132 / 29,924 | 759 | $1,601 | $5,918 |

### LP snapshot verification

171 pools verified against pinned contract storage; 1,035 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26433921, 2026-11-17T09:38:47.000Z, hash 0x92011bcca059d5ee3fd7fbcebcf357f4acd31ef08936db55e22ee283e320978d.
- BNB Chain: block 134098564, 2026-11-17T09:50:57.000Z, hash 0x8bc098ada37ef177c1dc25fc0e2ad81d49f8541c8552784dfc0897927e3426fb.
- Robinhood: block 116486891, 2026-11-17T09:51:32.000Z, hash 0x32d558c72c0fab1e8d4d15b5e95de6e777a9c92a5725240fb128b217db2fbfcf.
