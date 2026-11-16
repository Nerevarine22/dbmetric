# Metric trader analysis

Indexed cutoff: 2026-11-16T15:58:11.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 17,630 | 153,291 | $376,764,186 | 79.23% | 30.27% |
| 7d | 91,065 | 883,157 | $2,311,282,109 | 87.68% | 21.67% |
| all | 296,039 | 4,435,824 | $7,299,190,869 | 84.69% | 10.82% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $30,130,673 | 280 | 239 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $27,445,028 | 20,730 | 20,730 | 100.0% | USDC/USDT |
| 3 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $7,537,251 | 117 | 117 | 100.0% | USDC/USDT |
| 4 | [0xb583dbf908fef2437072391188b687e1c3dc4655](https://bscscan.com/address/0xb583dbf908fef2437072391188b687e1c3dc4655) | $7,510,463 | 114 | 114 | 100.0% | USDC/USDT |
| 5 | [0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432](https://bscscan.com/address/0xbe1ca6fba5aedabc5cb0f7b4aeac1407e7e4a432) | $7,363,639 | 108 | 108 | 100.0% | USDC/USDT |
| 6 | [0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c](https://bscscan.com/address/0xe2f72d68f9db3b6f4ed442318b0eee9ebad2684c) | $7,089,460 | 105 | 105 | 100.0% | USDC/USDT |
| 7 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $7,023,636 | 100 | 100 | 100.0% | USDC/USDT |
| 8 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $6,689,843 | 105 | 105 | 100.0% | USDC/USDT |
| 9 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $6,654,169 | 85 | 85 | 100.0% | USDC/USDT |
| 10 | [0x525abc3bbb2230909281cd8588aaf1072c8189c1](https://bscscan.com/address/0x525abc3bbb2230909281cd8588aaf1072c8189c1) | $6,590,270 | 97 | 97 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 177 addresses and accounts for 79.23% of estimated 24-hour pool turnover. Its entry cutoff is $287,154, compared with median wallet volume of $98.
Of 153,291 swaps, 153,291 have a USD estimate; 47,725 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 2,961 | 14,802 | 29,604 |
| Trading volume entry cutoff ≈ | $238,781 | $19,000 | $5,910 |
| Lifetime volume total ≈ | $6,181,615,805 | $7,008,970,947 | $7,166,782,942 |
| Volume in last 24h total ≈ | $348,742,643 | $370,180,047 | $373,170,852 |
| Lifetime volume median ≈ | $493,152 | $63,239 | $18,999 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 153 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 57 | 381 | 739 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,916 | $2,418 | $1,482 |
| Lifetime deposits median, historical LPs only ≈ | $26,058 | $11,507 | $5,760 |

## Liquidity providers

Full LP history: complete. 6,122 historical owners; 4,506 owners with open shares; 4,506 positive, fully valued active portfolios.
Known active liquidity: $23,572,723. Cumulative deposits: $177,202,546; withdrawals: $153,493,696. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $91,044 | 46 | 59.49% |
| Top 5% | $11,312 | 226 | 83.01% |
| Top 10% | $4,466 | 451 | 89.95% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $238,781 | 98 / 2,961 | 57 | $6,916 | $26,058 |
| Top 5% | $19,000 | 581 / 14,802 | 381 | $2,418 | $11,507 |
| Top 10% | $5,910 | 1,105 / 29,604 | 739 | $1,482 | $5,760 |

### LP snapshot verification

806 pools verified against pinned contract storage; 378 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26428636, 2026-11-16T15:58:11.000Z, hash 0x54e31e25c33deee86db27ef6a7994e99d88f99e0b4404481ac6ed5e61abee3f7.
- BNB Chain: block 133957232, 2026-11-16T16:10:44.000Z, hash 0x713400fdb06c9a213063d5777db315a18459ab76846365267f0bbf46eba0f97d.
- Robinhood: block 115891609, 2026-11-16T16:11:18.000Z, hash 0xa49cca7acfb8e3b8051359e1510cd2a22998373674e36b5446c7121ca84bb626.
