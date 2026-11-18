# Metric trader analysis

Indexed cutoff: 2026-11-18T01:25:59.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 13,142 | 163,828 | $237,276,180 | 71.93% | 33.31% |
| 7d | 81,690 | 965,592 | $2,319,936,861 | 87.00% | 23.66% |
| all | 302,119 | 4,664,552 | $7,651,262,409 | 85.05% | 11.16% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $35,231,132 | 36,818 | 36,818 | 100.0% | USDC/USDT |
| 2 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $14,358,082 | 213 | 181 | 0.0% | USDC/USDT |
| 3 | [0xbee584df29c8223df7347ada7d4de76175efcccf](https://etherscan.io/address/0xbee584df29c8223df7347ada7d4de76175efcccf) | $4,494,906 | 34 | 32 | 0.0% | USDC/USDT |
| 4 | [0xb00b06073d459a5c0c9d6040b2a0e665642faced](https://etherscan.io/address/0xb00b06073d459a5c0c9d6040b2a0e665642faced) | $3,999,942 | 4 | 2 | 100.0% | USDC/USDT |
| 5 | [0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80](https://etherscan.io/address/0x0000000000a6e36f8f51ea6d46828fc2e7e5fb80) | $3,849,914 | 50 | 35 | 0.0% | USDC/USDT |
| 6 | [0x32e5a17db695b812526e9140b4aea4f11fd05fdf](https://bscscan.com/address/0x32e5a17db695b812526e9140b4aea4f11fd05fdf) | $3,831,542 | 5,440 | 5,440 | 100.0% | USDC/USDT |
| 7 | [0xbee242d3a94420551c65f5b16d9a1c918910cccd](https://etherscan.io/address/0xbee242d3a94420551c65f5b16d9a1c918910cccd) | $3,737,113 | 42 | 40 | 0.0% | WETH/USDC |
| 8 | [0xbee355e5a9b1c5359796cf907138448b27f0ccca](https://etherscan.io/address/0xbee355e5a9b1c5359796cf907138448b27f0ccca) | $3,229,998 | 41 | 39 | 0.0% | USDC/USDT |
| 9 | [0xa084d752cf7930e46d4ec1fb9379334001b528b8](https://bscscan.com/address/0xa084d752cf7930e46d4ec1fb9379334001b528b8) | $3,167,822 | 750 | 750 | 100.0% | USDC/USDT |
| 10 | [0x815f5bb257e88b67216a344c7c83a3ea4ee74748](https://etherscan.io/address/0x815f5bb257e88b67216a344c7c83a3ea4ee74748) | $3,142,398 | 1 | 1 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 132 addresses and accounts for 71.93% of estimated 24-hour pool turnover. Its entry cutoff is $286,403, compared with median wallet volume of $112.
Of 163,828 swaps, 163,828 have a USD estimate; 62,563 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,022 | 15,106 | 30,212 |
| Trading volume entry cutoff ≈ | $242,610 | $18,978 | $5,953 |
| Lifetime volume total ≈ | $6,507,195,302 | $7,354,788,798 | $7,515,703,220 |
| Volume in last 24h total ≈ | $214,152,038 | $231,024,427 | $234,390,612 |
| Lifetime volume median ≈ | $497,899 | $63,599 | $18,976 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 156 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 65 | 417 | 787 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $9,232 | $2,287 | $1,526 |
| Lifetime deposits median, historical LPs only ≈ | $27,488 | $10,818 | $6,011 |

## Liquidity providers

Full LP history: complete. 6,255 historical owners; 4,627 owners with open shares; 4,627 positive, fully valued active portfolios.
Known active liquidity: $25,726,510. Cumulative deposits: $194,625,058; withdrawals: $168,803,038. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $99,923 | 47 | 59.21% |
| Top 5% | $12,194 | 232 | 83.03% |
| Top 10% | $4,811 | 463 | 90.03% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $242,610 | 108 / 3,022 | 65 | $9,232 | $27,488 |
| Top 5% | $18,978 | 620 / 15,106 | 417 | $2,287 | $10,818 |
| Top 10% | $5,953 | 1,160 / 30,212 | 787 | $1,526 | $6,011 |

### LP snapshot verification

177 pools verified against pinned contract storage; 1,052 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26438641, 2026-11-18T01:25:59.000Z, hash 0x81c82d72395c044e67802157dd571f8f38bf0cb402fb679924eadf7302f2f3f8.
- BNB Chain: block 134224832, 2026-11-18T01:38:21.000Z, hash 0x06b64407f6354c34d09f1d3515d1161c2613015a645cfb766a5c34c6f365d28a.
- Robinhood: block 117037991, 2026-11-18T01:38:56.000Z, hash 0xdf62319000c29bbd94a61ac8553368bdd9fb5d87eb603600fbf8631f1936beaf.
