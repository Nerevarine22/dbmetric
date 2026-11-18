# Metric trader analysis

Indexed cutoff: 2026-11-18T18:40:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 17,547 | 173,260 | $296,697,166 | 76.20% | 27.08% |
| 7d | 81,052 | 1,023,446 | $2,371,848,822 | 87.04% | 22.79% |
| all | 307,720 | 4,789,388 | $7,886,863,747 | 85.34% | 11.30% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $21,514,173 | 207 | 180 | 0.0% | USDC/USDT |
| 2 | [0x49da921ece5d10da0057266cfcae5043f498a2de](https://bscscan.com/address/0x49da921ece5d10da0057266cfcae5043f498a2de) | $17,862,636 | 21,637 | 21,637 | 100.0% | USDC/USDT |
| 3 | [0x259e7b199c9643c973747632cb5effe1d4a8c801](https://etherscan.io/address/0x259e7b199c9643c973747632cb5effe1d4a8c801) | $9,150,921 | 17 | 17 | 0.0% | USDC/USDT |
| 4 | [0xc33137a51e05922f23bcdf97da3f3c217c3ce4a8](https://etherscan.io/address/0xc33137a51e05922f23bcdf97da3f3c217c3ce4a8) | $5,330,242 | 10 | 10 | 0.0% | USDC/USDT |
| 5 | [0xff5c19bdc40ced71e3c8f38b7a09bf6f0b7abcbe](https://etherscan.io/address/0xff5c19bdc40ced71e3c8f38b7a09bf6f0b7abcbe) | $4,966,049 | 12 | 11 | 0.0% | USDC/USDT |
| 6 | [0x8cda33303e4d192c84127f778ffc5cf67d846e22](https://etherscan.io/address/0x8cda33303e4d192c84127f778ffc5cf67d846e22) | $4,780,685 | 30 | 18 | 0.0% | USDC/USDT |
| 7 | [0x32e5a17db695b812526e9140b4aea4f11fd05fdf](https://bscscan.com/address/0x32e5a17db695b812526e9140b4aea4f11fd05fdf) | $4,514,728 | 6,582 | 6,582 | 100.0% | USDC/USDT |
| 8 | [0x0e0674412aba2303ac2aa3e669b295c6269e2c9a](https://etherscan.io/address/0x0e0674412aba2303ac2aa3e669b295c6269e2c9a) | $4,346,064 | 8 | 8 | 0.0% | USDC/USDT |
| 9 | [0x927723690aab3380e7fa6b30d68cfe62ae029d95](https://etherscan.io/address/0x927723690aab3380e7fa6b30d68cfe62ae029d95) | $3,971,451 | 37 | 33 | 0.0% | USDC/USDT |
| 10 | [0xa7842153fde380a864726d0e91f14f6ffab7d46c](https://etherscan.io/address/0xa7842153fde380a864726d0e91f14f6ffab7d46c) | $3,896,200 | 21 | 20 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 176 addresses and accounts for 76.20% of estimated 24-hour pool turnover. Its entry cutoff is $269,473, compared with median wallet volume of $103.
Of 173,260 swaps, 173,260 have a USD estimate; 63,708 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 3,078 | 15,386 | 30,772 |
| Trading volume entry cutoff ≈ | $242,416 | $18,813 | $5,899 |
| Lifetime volume total ≈ | $6,730,297,093 | $7,587,309,458 | $7,749,539,583 |
| Volume in last 24h total ≈ | $269,142,337 | $289,039,586 | $292,613,209 |
| Lifetime volume median ≈ | $499,226 | $63,047 | $18,811 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 155 | 17 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 69 | 434 | 799 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | $0 | $0 | $0 |
| Active liquidity median, active LPs only ≈ | $6,916 | $2,123 | $1,518 |
| Lifetime deposits median, historical LPs only ≈ | $27,488 | $10,142 | $6,041 |

## Liquidity providers

Full LP history: complete. 6,315 historical owners; 4,635 owners with open shares; 4,635 positive, fully valued active portfolios.
Known active liquidity: $25,575,188. Cumulative deposits: $208,332,430; withdrawals: $182,653,933. Both token legs use synced spot quotes; repeated capital counts again in flows.
0 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $99,956 | 47 | 58.81% |
| Top 5% | $12,930 | 232 | 82.80% |
| Top 10% | $4,789 | 464 | 89.91% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $242,416 | 114 / 3,078 | 69 | $6,916 | $27,488 |
| Top 5% | $18,813 | 646 / 15,386 | 434 | $2,123 | $10,142 |
| Top 10% | $5,899 | 1,191 / 30,772 | 799 | $1,518 | $6,041 |

### LP snapshot verification

188 pools verified against pinned contract storage; 1,069 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26443804, 2026-11-18T18:40:23.000Z, hash 0x5bd7cdf6191135644b1eddfc09b04c475df776eaa818a58a8b8264f28145396d.
- BNB Chain: block 134362600, 2026-11-18T18:52:35.000Z, hash 0x8429a33cc7c2188c9058a13ff9cfdb5b20efb01066c61ef532eb442a098db303.
- Robinhood: block 117622491, 2026-11-18T18:53:09.000Z, hash 0x2ad624c0f7f85d39c616e2db5ef2a263147f545a6028320bee37eb1c3ee2d448.
