# Metric trader analysis

Indexed cutoff: 2026-11-16T12:48:35.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 17,118 | 141,234 | $345,403,177 | 78.00% | 29.17% |
| 7d | 91,595 | 874,314 | $2,273,292,305 | 87.54% | 21.45% |
| all | 294,807 | 4,406,983 | $7,222,562,923 | 84.58% | 10.74% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $25,883,601 | 259 | 210 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $21,853,699 | 16,243 | 16,243 | 100.0% | USDC/USDT |
| 3 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $7,310,281 | 107 | 107 | 100.0% | USDC/USDT |
| 4 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $7,084,014 | 88 | 88 | 100.0% | USDC/USDT |
| 5 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,871,577 | 92 | 92 | 100.0% | USDC/USDT |
| 6 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $6,771,793 | 105 | 105 | 100.0% | USDC/USDT |
| 7 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $6,466,372 | 93 | 93 | 100.0% | USDC/USDT |
| 8 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $6,382,167 | 98 | 98 | 100.0% | USDC/USDT |
| 9 | [0x95dd2666643bf9a74201ae5cf88365898604b730](https://bscscan.com/address/0x95dd2666643bf9a74201ae5cf88365898604b730) | $6,064,662 | 108 | 108 | 100.0% | USDC/USDT |
| 10 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $6,063,763 | 82 | 82 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 172 addresses and accounts for 78.00% of estimated 24-hour pool turnover. Its entry cutoff is $272,758, compared with median wallet volume of $93.
Of 141,234 swaps, 141,234 have a USD estimate; 42,795 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,949 | 14,741 | 29,481 |
| Trading volume entry cutoff ≈ | $239,027 | $19,046 | $5,910 |
| Lifetime volume total ≈ | $6,108,610,876 | $6,933,120,635 | $7,090,654,378 |
| Volume in last 24h total ≈ | $317,866,071 | $339,474,461 | $342,055,307 |
| Lifetime volume median ≈ | $492,949 | $63,232 | $19,046 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 57 | 379 | 738 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,916 | $2,361 | $1,498 |
| Lifetime deposits median, historical LPs only ≈ | $26,037 | $11,887 | $5,677 |

## Liquidity providers

Full LP history: complete. 6,111 historical owners; 4,508 owners with open shares; 4,508 positive, fully valued active portfolios.
Known active liquidity: $23,655,696. Cumulative deposits: $176,434,212; withdrawals: $152,643,553. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $92,639 | 46 | 59.42% |
| Top 5% | $11,296 | 226 | 83.03% |
| Top 10% | $4,456 | 451 | 89.98% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $239,027 | 98 / 2,949 | 57 | $6,916 | $26,037 |
| Top 5% | $19,046 | 577 / 14,741 | 379 | $2,361 | $11,887 |
| Top 10% | $5,910 | 1,102 / 29,481 | 738 | $1,498 | $5,677 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26427692, 2026-11-16T12:48:35.000Z, hash 0x099b0ce5a9b1f7df1f0d33962d50c79623f59d50442158bb13ae2311a64f5b8e.
- BNB Chain: block 133931923, 2026-11-16T13:00:49.000Z, hash 0x747fcd0fe1a65785ae7ffec2d1c4f1470ea5a94f0b9cae356618c712cf53fa44.
- Robinhood: block 115780266, 2026-11-16T13:01:24.000Z, hash 0xed6a372100253d36e7afe202a7ca213597dab6946d3da3ef884b8eb9774f5bdf.
