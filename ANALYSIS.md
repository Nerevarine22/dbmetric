# Metric trader analysis

Indexed cutoff: 2026-11-18T09:59:35.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 15,530 | 179,250 | $251,493,250 | 73.63% | 28.93% |
| 7d | 81,558 | 998,202 | $2,347,063,302 | 87.05% | 23.67% |
| all | 304,986 | 4,727,250 | $7,745,959,281 | 85.17% | 11.25% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $28,930,457 | 33,123 | 33,123 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $11,402,134 | 174 | 150 | 0.0% | USDC/USDT |
| 3 | [0xb00b06073d459a5c0c9d6040b2a0e665642faced](https://etherscan.io/address/0xb00b06073d459a5c0c9d6040b2a0e665642faced) | $4,999,933 | 24 | 3 | 100.0% | USDC/USDT |
| 4 | [0x32e5a17db695b812526e9140b4aea4f11fd05fdf](https://bscscan.com/address/0x32e5a17db695b812526e9140b4aea4f11fd05fdf) | $4,797,444 | 6,884 | 6,884 | 100.0% | USDC/USDT |
| 5 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $4,320,462 | 40 | 34 | 0.0% | USDC/USDT |
| 6 | [0xc33137a51e05922f23bcdf97da3f3c217c3ce4a8](https://etherscan.io/address/0xc33137a51e05922f23bcdf97da3f3c217c3ce4a8) | $4,049,722 | 9 | 9 | 0.0% | USDC/USDT |
| 7 | [0xbee242d3a94420551c65f5b16d9a1c918910cccd](https://etherscan.io/address/0xbee242d3a94420551c65f5b16d9a1c918910cccd) | $3,872,647 | 44 | 41 | 0.0% | WETH/USDC |
| 8 | [0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80](https://etherscan.io/address/0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80) | $3,520,035 | 58 | 43 | 0.0% | USDC/USDT |
| 9 | [0x259e7b199c9643c973747632cb5effe1d4a8c801](https://etherscan.io/address/0x259e7b199c9643c973747632cb5effe1d4a8c801) | $3,475,713 | 11 | 11 | 0.0% | USDC/USDT |
| 10 | [0xbee355e5a9b1c5359796cf907138448b27f0ccca](https://etherscan.io/address/0xbee355e5a9b1c5359796cf907138448b27f0ccca) | $3,385,584 | 40 | 36 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 156 addresses and accounts for 73.63% of estimated 24-hour pool turnover. Its entry cutoff is $249,653, compared with median wallet volume of $115.
Of 179,250 swaps, 179,250 have a USD estimate; 68,150 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,050 | 15,250 | 30,499 |
| Trading volume entry cutoff ≈ | $241,668 | $18,899 | $5,916 |
| Lifetime volume total ≈ | $6,597,349,880 | $7,448,137,206 | $7,609,683,910 |
| Volume in last 24h total ≈ | $225,874,926 | $244,325,572 | $247,823,000 |
| Lifetime volume median ≈ | $497,470 | $63,079 | $18,899 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 155.5 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 64 | 424 | 783 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $8,072 | $2,137 | $1,532 |
| Lifetime deposits median, historical LPs only ≈ | $27,485 | $10,033 | $6,094 |

## Liquidity providers

Full LP history: complete. 6,281 historical owners; 4,626 owners with open shares; 4,626 positive, fully valued active portfolios.
Known active liquidity: $25,364,979. Cumulative deposits: $207,659,071; withdrawals: $182,217,383. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $99,865 | 47 | 59.55% |
| Top 5% | $12,084 | 232 | 82.91% |
| Top 10% | $4,757 | 463 | 89.95% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $241,668 | 108 / 3,050 | 64 | $8,072 | $27,485 |
| Top 5% | $18,899 | 638 / 15,250 | 424 | $2,137 | $10,033 |
| Top 10% | $5,916 | 1,172 / 30,499 | 783 | $1,532 | $6,094 |

### LP snapshot verification

185 pools verified against pinned contract storage; 1,058 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26441201, 2026-11-18T09:59:35.000Z, hash 0x733a5c45cd21b59ac36350e64aaaa3676720e92cc64b7336c8570f698be73885.
- BNB Chain: block 134293218, 2026-11-18T10:11:44.000Z, hash 0x58af068faa835f0585a3e3f40d8577015a3fde0833e4defd6ffe7a71819ac8a5.
- Robinhood: block 117320823, 2026-11-18T10:12:18.000Z, hash 0x78c49edf366b223e06ffb9ae9e641c98e30daea5173f3c1ef798d24e1c925254.
