# Metric trader analysis

Indexed cutoff: 2026-11-15T14:52:11.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 18,413 | 132,697 | $501,447,645 | 76.51% | 27.93% |
| 7d | 94,083 | 889,895 | $2,238,723,148 | 86.53% | 20.26% |
| all | 289,498 | 4,276,798 | $6,911,378,931 | 84.14% | 10.27% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0xb00b06073d459a5c0c9d6040b2a0e665642faced](https://etherscan.io/address/0xb00b06073d459a5c0c9d6040b2a0e665642faced) | $31,999,808 | 8 | 1 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $29,794,962 | 330 | 260 | 0.0% | USDC/USDT |
| 3 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $10,561,714 | 135 | 135 | 100.0% | USDC/USDT |
| 4 | [0x5ae90d59f100692f24b0f72acd99b7dc223046cc](https://bscscan.com/address/0x5ae90d59f100692f24b0f72acd99b7dc223046cc) | $10,411,682 | 169 | 169 | 100.0% | USDC/USDT |
| 5 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $10,269,996 | 143 | 143 | 100.0% | USDC/USDT |
| 6 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $9,928,679 | 151 | 151 | 100.0% | USDC/USDT |
| 7 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $9,926,736 | 150 | 150 | 100.0% | USDC/USDT |
| 8 | [0xa5cf93558bf336e3a63432bbeed90326ab7f9c97](https://bscscan.com/address/0xa5cf93558bf336e3a63432bbeed90326ab7f9c97) | $9,277,485 | 144 | 144 | 100.0% | USDC/USDT |
| 9 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $9,127,977 | 151 | 151 | 100.0% | USDC/USDT |
| 10 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $8,760,084 | 129 | 129 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 185 addresses and accounts for 76.51% of estimated 24-hour pool turnover. Its entry cutoff is $428,123, compared with median wallet volume of $100.
Of 132,697 swaps, 132,697 have a USD estimate; 44,145 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,895 | 14,475 | 28,950 |
| Trading volume entry cutoff ≈ | $237,472 | $19,163 | $5,958 |
| Lifetime volume total ≈ | $5,815,211,382 | $6,625,123,665 | $6,780,976,600 |
| Volume in last 24h total ≈ | $462,890,393 | $493,753,005 | $497,305,415 |
| Lifetime volume median ≈ | $483,185 | $63,293 | $19,162 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 58 | 363 | 689 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $5,135 | $2,129 | $1,276 |
| Lifetime deposits median, historical LPs only ≈ | $27,368 | $11,585 | $5,494 |

## Liquidity providers

Full LP history: complete. 5,999 historical owners; 4,416 owners with open shares; 4,416 positive, fully valued active portfolios.
Known active liquidity: $22,997,974. Cumulative deposits: $166,163,979; withdrawals: $143,044,455. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $93,032 | 45 | 59.51% |
| Top 5% | $11,021 | 221 | 83.23% |
| Top 10% | $4,370 | 442 | 90.14% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $237,472 | 96 / 2,895 | 58 | $5,135 | $27,368 |
| Top 5% | $19,163 | 558 / 14,475 | 363 | $2,129 | $11,585 |
| Top 10% | $5,958 | 1,047 / 28,950 | 689 | $1,276 | $5,494 |

### LP snapshot verification

795 pools verified against pinned contract storage; 368 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26421120, 2026-11-15T14:52:11.000Z, hash 0xf2c82bd23709feb14c422b30002ca90221f60b4cb5432811778b6beec1f4650b.
- BNB Chain: block 133756428, 2026-11-15T15:04:16.000Z, hash 0x75d207a233cc6c6673addb9162055204ecfe6adb194815acfb4d8479aa7d30b6.
- Robinhood: block 115046664, 2026-11-15T15:04:51.000Z, hash 0x90d8ba85670f2bc3cf0e88b74d1e5b4212444d6a3c918245071236dad7e906d8.
