# Metric trader analysis

Indexed cutoff: 2026-11-16T16:49:47.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 17,704 | 155,667 | $377,233,030 | 79.42% | 30.24% |
| 7d | 90,923 | 885,535 | $2,318,156,641 | 87.70% | 21.66% |
| all | 296,270 | 4,442,682 | $7,312,981,747 | 84.70% | 10.82% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $30,437,225 | 281 | 241 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $29,068,884 | 22,064 | 22,064 | 100.0% | USDC/USDT |
| 3 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $7,529,136 | 118 | 118 | 100.0% | USDC/USDT |
| 4 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $7,377,966 | 111 | 111 | 100.0% | USDC/USDT |
| 5 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $7,277,806 | 114 | 114 | 100.0% | USDC/USDT |
| 6 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $6,638,637 | 105 | 105 | 100.0% | USDC/USDT |
| 7 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,528,096 | 94 | 94 | 100.0% | USDC/USDT |
| 8 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $6,442,571 | 102 | 102 | 100.0% | USDC/USDT |
| 9 | [0xa5cf93558bf336e3a63432bbeed90326ab7f9c97](https://bscscan.com/address/0xa5cf93558bf336e3a63432bbeed90326ab7f9c97) | $6,398,272 | 100 | 100 | 100.0% | USDC/USDT |
| 10 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,368,032 | 102 | 102 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 178 addresses and accounts for 79.42% of estimated 24-hour pool turnover. Its entry cutoff is $283,956, compared with median wallet volume of $97.
Of 155,667 swaps, 155,667 have a USD estimate; 48,149 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,963 | 14,814 | 29,627 |
| Trading volume entry cutoff ≈ | $239,736 | $19,000 | $5,910 |
| Lifetime volume total ≈ | $6,194,311,214 | $7,022,573,036 | $7,180,489,995 |
| Volume in last 24h total ≈ | $349,677,471 | $370,573,890 | $373,638,540 |
| Lifetime volume median ≈ | $493,152 | $63,271 | $19,000 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 58 | 382 | 738 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $8,084 | $2,426 | $1,525 |
| Lifetime deposits median, historical LPs only ≈ | $26,072 | $11,488 | $5,771 |

## Liquidity providers

Full LP history: complete. 6,125 historical owners; 4,509 owners with open shares; 4,509 positive, fully valued active portfolios.
Known active liquidity: $23,738,205. Cumulative deposits: $177,413,998; withdrawals: $153,541,722. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $91,474 | 46 | 59.68% |
| Top 5% | $11,378 | 226 | 83.06% |
| Top 10% | $4,474 | 451 | 89.98% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $239,736 | 100 / 2,963 | 58 | $8,084 | $26,072 |
| Top 5% | $19,000 | 583 / 14,814 | 382 | $2,426 | $11,488 |
| Top 10% | $5,910 | 1,105 / 29,627 | 738 | $1,525 | $5,771 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26428892, 2026-11-16T16:49:47.000Z, hash 0x226159fc2441424b19097dcf9fcbe9d22a452ee4e5794eb69c2c25507babc96b.
- BNB Chain: block 133964074, 2026-11-16T17:02:04.000Z, hash 0x5c777706ddc59f4113b6e9e2b09cf4ee55c6c028e0c9745d0d86dafa3e5fada0.
- Robinhood: block 115920623, 2026-11-16T17:02:39.000Z, hash 0x1e83c75692f84caefb1a064a3a772fe09bd56e914bf55e2b0ef983991bc23a97.
