# Metric trader analysis

Indexed cutoff: 2026-11-25T19:46:11.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 27,101 | 203,846 | $250,298,506 | 79.34% | 30.92% |
| 7d | 129,830 | 1,884,843 | $2,399,541,448 | 80.77% | 15.66% |
| all | 388,822 | 6,680,452 | $10,306,909,047 | 85.97% | 10.81% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $35,892,886 | 108 | 108 | 100.0% | USDC/USDT |
| 2 | [0x32e5a17db695b812526e9140b4aea4f11fd05fdf](https://bscscan.com/address/0x32e5a17db695b812526e9140b4aea4f11fd05fdf) | $12,451,780 | 6,807 | 6,807 | 100.0% | USDC/USDT |
| 3 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $5,596,785 | 33 | 28 | 3.0% | USDC/USDT |
| 4 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $4,593,928 | 268 | 219 | 0.0% | USDC/USDT |
| 5 | [0x513baef24e881bbc4bff805b18b77f9628fda65f](https://bscscan.com/address/0x513baef24e881bbc4bff805b18b77f9628fda65f) | $3,316,761 | 273 | 273 | 100.0% | ANTB/USDT |
| 6 | [0x95dd2666643bf9a74201ae5cf88365898604b730](https://bscscan.com/address/0x95dd2666643bf9a74201ae5cf88365898604b730) | $3,180,384 | 263 | 263 | 100.0% | ANTB/USDT |
| 7 | [0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024](https://bscscan.com/address/0x00b89d5b39d119bd22d77e4ce1c9b183c79f1024) | $3,171,566 | 256 | 256 | 0.0% | ANTB/USDT |
| 8 | [0x47ff802449c24c80a3ec4d193f13c27051a7e27c](https://bscscan.com/address/0x47ff802449c24c80a3ec4d193f13c27051a7e27c) | $3,077,670 | 245 | 245 | 100.0% | ANTB/USDT |
| 9 | [0x76c8c37c107bc798abeb863650f8fb718d2a7234](https://bscscan.com/address/0x76c8c37c107bc798abeb863650f8fb718d2a7234) | $3,060,969 | 251 | 251 | 100.0% | ANTB/USDT |
| 10 | [0x4f3688fc742e6aad7970120a20e4c537959a9e4e](https://bscscan.com/address/0x4f3688fc742e6aad7970120a20e4c537959a9e4e) | $3,048,977 | 243 | 243 | 100.0% | ANTB/USDT |

## Interpretation

The top-volume cohort contains 272 addresses and accounts for 79.34% of estimated 24-hour pool turnover. Its entry cutoff is $122,469, compared with median wallet volume of $50.
Of 203,846 swaps, 203,832 have a USD estimate; 47,081 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,889 | 19,442 | 38,883 |
| Trading volume entry cutoff ≈ | $265,766 | $17,261 | $5,285 |
| Lifetime volume total ≈ | $8,861,189,872 | $9,968,841,552 | $10,156,069,943 |
| Volume in last 24h total ≈ | $221,069,281 | $243,804,317 | $246,600,776 |
| Lifetime volume median ≈ | $534,380 | $61,624 | $17,261 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 221 | 18 | 10 |
| Active UTC days median | 13 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 87 | 543 | 1007 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $4,349 | $2,310 | $1,515 |
| Lifetime deposits median, historical LPs only ≈ | $40,431 | $13,590 | $7,753 |

## Liquidity providers

Full LP history: complete. 7,095 historical owners; 4,943 owners with open shares; 4,941 positive, fully valued active portfolios.
Known active liquidity: $31,248,304. Cumulative deposits: $283,873,957; withdrawals: $252,581,001. Both token legs use synced spot quotes; repeated capital counts again in flows.
2 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $105,784 | 50 | 60.10% |
| Top 5% | $14,866 | 248 | 82.92% |
| Top 10% | $5,235 | 495 | 90.06% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $265,766 | 153 / 3,889 | 87 | $4,349 | $40,431 |
| Top 5% | $17,261 | 876 / 19,442 | 543 | $2,310 | $13,590 |
| Top 10% | $5,285 | 1,567 / 38,883 | 1,007 | $1,515 | $7,753 |

### LP snapshot verification

224 pools verified against pinned contract storage; 1,533 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26494376, 2026-11-25T19:46:11.000Z, hash 0x4ace62ca6842f9359f47aad48642a0d087304e49fdd59906d7df67a6501461e7.
- BNB Chain: block 135714787, 2026-11-25T19:58:17.000Z, hash 0x716a6b2e9f645e63288363cb90cac32935ff24d6b1d4f520af483cc601aa512e.
- Robinhood: block 123259044, 2026-11-25T19:58:43.000Z, hash 0x12df78ef66a2e7a251a0de6f7379b39fbda849350282cd2b7ba896476c2a7aeb.
