# Metric trader analysis

Indexed cutoff: 2026-11-16T11:13:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 16,864 | 135,555 | $319,747,540 | 77.31% | 29.14% |
| 7d | 91,915 | 871,498 | $2,261,533,877 | 87.53% | 21.51% |
| all | 294,144 | 4,393,656 | $7,185,211,599 | 84.52% | 10.72% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $24,068,764 | 253 | 204 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $18,708,140 | 13,795 | 13,795 | 100.0% | USDC/USDT |
| 3 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $6,993,762 | 101 | 101 | 100.0% | USDC/USDT |
| 4 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,601,759 | 82 | 82 | 100.0% | USDC/USDT |
| 5 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $6,470,885 | 100 | 100 | 100.0% | USDC/USDT |
| 6 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $6,389,126 | 82 | 82 | 100.0% | USDC/USDT |
| 7 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,230,397 | 78 | 78 | 100.0% | USDC/USDT |
| 8 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $6,187,886 | 92 | 92 | 100.0% | USDC/USDT |
| 9 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $5,784,483 | 78 | 78 | 100.0% | USDC/USDT |
| 10 | [0x95dd2666643bf9a74201ae5cf88365898604b730](https://bscscan.com/address/0x95dd2666643bf9a74201ae5cf88365898604b730) | $5,728,861 | 100 | 100 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 169 addresses and accounts for 77.31% of estimated 24-hour pool turnover. Its entry cutoff is $252,733, compared with median wallet volume of $93.
Of 135,555 swaps, 135,555 have a USD estimate; 41,544 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,942 | 14,708 | 29,415 |
| Trading volume entry cutoff ≈ | $238,781 | $19,085 | $5,921 |
| Lifetime volume total ≈ | $6,072,975,451 | $6,896,009,262 | $7,053,428,534 |
| Volume in last 24h total ≈ | $292,186,798 | $313,843,911 | $316,531,275 |
| Lifetime volume median ≈ | $490,668 | $63,226 | $19,085 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 57 | 377 | 732 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,917 | $2,367 | $1,448 |
| Lifetime deposits median, historical LPs only ≈ | $26,486 | $11,933 | $5,784 |

## Liquidity providers

Full LP history: complete. 6,101 historical owners; 4,498 owners with open shares; 4,498 positive, fully valued active portfolios.
Known active liquidity: $23,739,733. Cumulative deposits: $176,547,020; withdrawals: $152,693,259. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $96,517 | 45 | 58.95% |
| Top 5% | $11,534 | 225 | 83.03% |
| Top 10% | $4,473 | 450 | 90.02% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $238,781 | 97 / 2,942 | 57 | $6,917 | $26,486 |
| Top 5% | $19,085 | 574 / 14,708 | 377 | $2,367 | $11,933 |
| Top 10% | $5,921 | 1,094 / 29,415 | 732 | $1,448 | $5,784 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26427217, 2026-11-16T11:13:23.000Z, hash 0xbad34deee809ccc21e15599b3095c232b576c27fd9e052ed001218a6b7052101.
- BNB Chain: block 133919244, 2026-11-16T11:25:40.000Z, hash 0xddfd41b7075ad82708144df61e3d8e4b9d5dff0ba8121bebce948b6be90408b3.
- Robinhood: block 115724963, 2026-11-16T11:26:14.000Z, hash 0xfd8d9d056628294145833d38a2c6c0036495e751f14c46638f3c4ceaf4c45e40.
