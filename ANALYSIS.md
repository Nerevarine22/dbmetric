# Metric trader analysis

Indexed cutoff: 2026-11-16T18:52:11.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 18,089 | 163,716 | $380,888,558 | 79.24% | 30.07% |
| 7d | 90,779 | 893,899 | $2,323,696,852 | 87.62% | 21.76% |
| all | 296,701 | 4,459,213 | $7,339,938,405 | 84.73% | 10.85% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $32,939,310 | 25,296 | 25,296 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $30,341,213 | 291 | 253 | 0.0% | USDC/USDT |
| 3 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $7,210,669 | 118 | 118 | 100.0% | USDC/USDT |
| 4 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $6,929,673 | 111 | 111 | 100.0% | USDC/USDT |
| 5 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $6,663,708 | 109 | 109 | 100.0% | USDC/USDT |
| 6 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,397,210 | 98 | 98 | 100.0% | USDC/USDT |
| 7 | [0xa5cf93558bf336e3a63432bbeed90326ab7f9c97](https://bscscan.com/address/0xa5cf93558bf336e3a63432bbeed90326ab7f9c97) | $6,257,538 | 103 | 103 | 100.0% | USDC/USDT |
| 8 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $6,168,419 | 104 | 104 | 100.0% | USDC/USDT |
| 9 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $5,902,971 | 98 | 98 | 100.0% | USDC/USDT |
| 10 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $5,706,655 | 104 | 104 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 181 addresses and accounts for 79.24% of estimated 24-hour pool turnover. Its entry cutoff is $292,831, compared with median wallet volume of $97.
Of 163,716 swaps, 163,716 have a USD estimate; 49,570 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,968 | 14,836 | 29,671 |
| Trading volume entry cutoff ≈ | $239,819 | $19,000 | $5,916 |
| Lifetime volume total ≈ | $6,219,053,521 | $7,049,044,921 | $7,207,143,076 |
| Volume in last 24h total ≈ | $353,015,727 | $374,049,050 | $377,201,222 |
| Lifetime volume median ≈ | $493,087 | $63,307 | $19,000 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 56 | 385 | 740 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $8,067 | $2,421 | $1,525 |
| Lifetime deposits median, historical LPs only ≈ | $25,603 | $11,314 | $5,760 |

## Liquidity providers

Full LP history: complete. 6,134 historical owners; 4,515 owners with open shares; 4,515 positive, fully valued active portfolios.
Known active liquidity: $23,843,101. Cumulative deposits: $177,586,203; withdrawals: $153,602,393. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $90,938 | 46 | 59.82% |
| Top 5% | $11,499 | 226 | 83.00% |
| Top 10% | $4,494 | 452 | 89.95% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $239,819 | 99 / 2,968 | 56 | $8,067 | $25,603 |
| Top 5% | $19,000 | 587 / 14,836 | 385 | $2,421 | $11,314 |
| Top 10% | $5,916 | 1,109 / 29,671 | 740 | $1,525 | $5,760 |

### LP snapshot verification

807 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26429503, 2026-11-16T18:52:11.000Z, hash 0xd0c99079b9b399fa2ee3419498292b458e76ac4049b10c20fa23a47557ce0f43.
- BNB Chain: block 133980395, 2026-11-16T19:04:30.000Z, hash 0x273d59f635d2c56eb88676fb410af2b63286200fa64fe89332a1d9c23fa1d527.
- Robinhood: block 115991184, 2026-11-16T19:05:04.000Z, hash 0x23a292eae6341272c2c72467e3c5e9d7b1eb4b7fb18e3fdcf7ed044914c56176.
