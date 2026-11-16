# Metric trader analysis

Indexed cutoff: 2026-11-16T12:08:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 16,996 | 138,200 | $332,952,330 | 77.73% | 29.20% |
| 7d | 91,600 | 871,831 | $2,264,238,104 | 87.49% | 21.46% |
| all | 294,502 | 4,400,687 | $7,204,533,213 | 84.55% | 10.73% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $24,797,700 | 252 | 204 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $20,537,768 | 15,212 | 15,212 | 100.0% | USDC/USDT |
| 3 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $7,309,120 | 106 | 106 | 100.0% | USDC/USDT |
| 4 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,933,356 | 85 | 85 | 100.0% | USDC/USDT |
| 5 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $6,621,216 | 102 | 102 | 100.0% | USDC/USDT |
| 6 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,557,420 | 87 | 87 | 100.0% | USDC/USDT |
| 7 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $6,548,660 | 89 | 89 | 100.0% | USDC/USDT |
| 8 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $6,341,690 | 95 | 95 | 100.0% | USDC/USDT |
| 9 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $5,792,450 | 87 | 87 | 100.0% | USDC/USDT |
| 10 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $5,785,389 | 80 | 80 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 170 addresses and accounts for 77.73% of estimated 24-hour pool turnover. Its entry cutoff is $267,256, compared with median wallet volume of $91.
Of 138,200 swaps, 138,200 have a USD estimate; 42,086 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,946 | 14,726 | 29,451 |
| Trading volume entry cutoff ≈ | $238,942 | $19,075 | $5,915 |
| Lifetime volume total ≈ | $6,091,222,278 | $6,915,220,294 | $7,072,708,305 |
| Volume in last 24h total ≈ | $305,217,289 | $327,080,574 | $329,702,794 |
| Lifetime volume median ≈ | $492,774 | $63,213 | $19,075 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 58 | 378 | 736 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $5,188 | $2,323 | $1,466 |
| Lifetime deposits median, historical LPs only ≈ | $26,028 | $11,877 | $5,724 |

## Liquidity providers

Full LP history: complete. 6,107 historical owners; 4,506 owners with open shares; 4,506 positive, fully valued active portfolios.
Known active liquidity: $23,646,365. Cumulative deposits: $176,345,003; withdrawals: $152,567,032. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $92,773 | 46 | 59.44% |
| Top 5% | $11,287 | 226 | 83.04% |
| Top 10% | $4,445 | 451 | 89.99% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $238,942 | 98 / 2,946 | 58 | $5,188 | $26,028 |
| Top 5% | $19,075 | 575 / 14,726 | 378 | $2,323 | $11,877 |
| Top 10% | $5,915 | 1,099 / 29,451 | 736 | $1,466 | $5,724 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26427492, 2026-11-16T12:08:23.000Z, hash 0xf4de674aed96d37039203b25f9980b5f7a082b8ff19cfc9a7cc173f03d9068db.
- BNB Chain: block 133926558, 2026-11-16T12:20:33.000Z, hash 0x4444a37995aed7b9bf710d9d2745aced3cf6cb2b40dc5201bcc7b0655b118136.
- Robinhood: block 115756723, 2026-11-16T12:21:08.000Z, hash 0x6157b9810b41a0c5f27b69751f85de92d213a9e723068c970d0c16af8524ad6c.
