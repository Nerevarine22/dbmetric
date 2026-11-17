# Metric trader analysis

Indexed cutoff: 2026-11-17T18:59:59.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 13,264 | 157,801 | $249,570,549 | 73.02% | 36.45% |
| 7d | 82,709 | 944,709 | $2,322,626,755 | 87.12% | 23.52% |
| all | 301,055 | 4,617,928 | $7,591,030,121 | 84.99% | 11.09% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $38,320,853 | 37,076 | 37,076 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $23,204,833 | 272 | 241 | 0.0% | USDC/USDT |
| 3 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $4,869,153 | 35 | 33 | 0.0% | USDC/USDT |
| 4 | [0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce](https://etherscan.io/address/0xbee7c5fd94c72067d1dd447a4b7f4bc7bbf7ccce) | $4,541,896 | 28 | 23 | 0.0% | WETH/USDC |
| 5 | [0xb00b06073d459a5c0c9d6040b2a0e665642faced](https://etherscan.io/address/0xb00b06073d459a5c0c9d6040b2a0e665642faced) | $3,999,942 | 4 | 2 | 100.0% | USDC/USDT |
| 6 | [0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80](https://etherscan.io/address/0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80) | $3,382,811 | 36 | 29 | 0.0% | USDC/USDT |
| 7 | [0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc](https://etherscan.io/address/0xbee156a1f0c92a1c1da9b31595e4b88d163dcccc) | $3,366,430 | 38 | 36 | 2.6% | USDC/USDT |
| 8 | [0xa084d752cf7930e46d4ec1fb9379334001b528b8](https://bscscan.com/address/0xa084d752cf7930e46d4ec1fb9379334001b528b8) | $3,301,870 | 784 | 784 | 100.0% | USDC/USDT |
| 9 | [0x815f5bb257e88b67216a344c7c83a3ea4ee74748](https://etherscan.io/address/0x815f5bb257e88b67216a344c7c83a3ea4ee74748) | $3,142,398 | 1 | 1 | 0.0% | USDC/USDT |
| 10 | [0xbee242d3a94420551c65f5b16d9a1c918910cccd](https://etherscan.io/address/0xbee242d3a94420551c65f5b16d9a1c918910cccd) | $2,846,424 | 46 | 44 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 133 addresses and accounts for 73.02% of estimated 24-hour pool turnover. Its entry cutoff is $340,476, compared with median wallet volume of $112.
Of 157,801 swaps, 157,801 have a USD estimate; 60,917 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,011 | 15,053 | 30,106 |
| Trading volume entry cutoff ≈ | $241,826 | $18,982 | $5,947 |
| Lifetime volume total ≈ | $6,451,425,438 | $7,295,734,203 | $7,456,101,049 |
| Volume in last 24h total ≈ | $226,575,198 | $243,559,254 | $246,720,526 |
| Lifetime volume median ≈ | $497,345 | $63,565 | $18,981 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 156 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 61 | 408 | 778 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,917 | $2,324 | $1,552 |
| Lifetime deposits median, historical LPs only ≈ | $25,972 | $10,711 | $5,905 |

## Liquidity providers

Full LP history: complete. 6,231 historical owners; 4,601 owners with open shares; 4,601 positive, fully valued active portfolios.
Known active liquidity: $24,684,898. Cumulative deposits: $192,088,480; withdrawals: $167,264,221. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $96,641 | 47 | 59.29% |
| Top 5% | $11,768 | 231 | 82.76% |
| Top 10% | $4,693 | 461 | 89.80% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $241,826 | 104 / 3,011 | 61 | $6,917 | $25,972 |
| Top 5% | $18,982 | 612 / 15,053 | 408 | $2,324 | $10,711 |
| Top 10% | $5,947 | 1,149 / 30,106 | 778 | $1,552 | $5,905 |

### LP snapshot verification

174 pools verified against pinned contract storage; 1,046 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26436716, 2026-11-17T18:59:59.000Z, hash 0x88ef3fa5105d177ea59264b36dde79a1239db4484ef7e9f73599fc1a046b42ac.
- BNB Chain: block 134173363, 2026-11-17T19:12:16.000Z, hash 0x9c0d08fd47cf412b19840d0a124303458ffd42a3f6e9f7f253553a59fb866638.
- Robinhood: block 116814529, 2026-11-17T19:12:51.000Z, hash 0x809d9c645265f5c9a88b0aa85b84e759641e997a1359e3635587e004a185f9a8.
