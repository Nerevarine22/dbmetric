# Metric trader analysis

Indexed cutoff: 2026-11-13T14:43:35.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 23,144 | 145,633 | $317,328,883 | 75.15% | 24.53% |
| 7d | 84,790 | 739,366 | $1,554,853,963 | 84.25% | 16.39% |
| all | 275,179 | 3,994,943 | $6,005,086,720 | 82.83% | 8.62% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0xb00b06073d459a5c0c9d6040b2a0e665642faced](https://bscscan.com/address/0xb00b06073d459a5c0c9d6040b2a0e665642faced) | $20,001,382 | 19 | 5 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $14,964,464 | 345 | 298 | 0.0% | USDC/USDT |
| 3 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $9,305,459 | 84 | 52 | 7.1% | USDC/USDT |
| 4 | [0x95480d3f27658e73b2785d30beb0c847d78294c7](https://etherscan.io/address/0x95480d3f27658e73b2785d30beb0c847d78294c7) | $6,459,008 | 36 | 24 | 0.0% | USDC/USDT |
| 5 | [0x927723690aab3380e7fa6b30d68cfe62ae029d95](https://etherscan.io/address/0x927723690aab3380e7fa6b30d68cfe62ae029d95) | $5,199,775 | 133 | 114 | 0.0% | USDC/USDT |
| 6 | [0xce0917a9a155448d0697ea5b724c7cea94aa968d](https://bscscan.com/address/0xce0917a9a155448d0697ea5b724c7cea94aa968d) | $5,036,284 | 1,701 | 1,701 | 100.0% | USDC/USDT |
| 7 | [0xfb4f294f514fe7d12b5c45370bbebf1070d2f314](https://etherscan.io/address/0xfb4f294f514fe7d12b5c45370bbebf1070d2f314) | $4,951,856 | 88 | 86 | 0.0% | USDC/USDT |
| 8 | [0xa7842153fde380a864726d0e91f14f6ffab7d46c](https://etherscan.io/address/0xa7842153fde380a864726d0e91f14f6ffab7d46c) | $4,371,106 | 15 | 13 | 100.0% | USDC/USDT |
| 9 | [0x17701ea4718c8228b26912d6dd81a64341a2d2b9](https://etherscan.io/address/0x17701ea4718c8228b26912d6dd81a64341a2d2b9) | $4,044,885 | 60 | 60 | 0.0% | USDC/USDT |
| 10 | [0xd8555ae1e7d6ecd0f9f08d6051b682b22e1ebecc](https://etherscan.io/address/0xd8555ae1e7d6ecd0f9f08d6051b682b22e1ebecc) | $3,503,682 | 93 | 86 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 232 addresses and accounts for 75.15% of estimated 24-hour pool turnover. Its entry cutoff is $226,279, compared with median wallet volume of $100.
Of 145,633 swaps, 145,633 have a USD estimate; 44,818 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Liquidity providers

Full LP history: complete. 5,686 historical owners; 4,179 owners with open shares; 4,179 positive, fully valued active portfolios.
Known active liquidity: $21,207,800. Cumulative deposits: $128,829,695; withdrawals: $107,443,431. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $87,944 | 42 | 59.37% |
| Top 5% | $11,009 | 209 | 82.86% |
| Top 10% | $4,273 | 418 | 89.94% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $230,972 | 88 / 2,752 | 50 | $5,231 | $18,985 |
| Top 5% | $19,161 | 503 / 13,759 | 315 | $1,954 | $11,633 |
| Top 10% | $6,027 | 952 / 27,518 | 609 | $1,276 | $5,616 |

### LP snapshot verification

769 pools verified against pinned contract storage; 352 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26406716, 2026-11-13T14:43:35.000Z, hash 0x1fed92023157c57c51d0c8490b1f8df18cfee2c49d3d532cf3af8f36ca992fe4.
- BNB Chain: block 133371439, 2026-11-13T14:55:58.000Z, hash 0x0f11f085a0525a467a0983c286e346a8f37e2d5d794f431c724d606961d67b4f.
- Robinhood: block 113440739, 2026-11-13T14:56:33.000Z, hash 0xa1acaeba0de03c477abd73948e36abb5b4f60394efc812671b00d245c36f3df1.
