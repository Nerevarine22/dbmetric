# Metric trader analysis

Indexed cutoff: 2026-11-27T23:17:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 28,880 | 206,192 | $331,710,987 | 82.38% | 41.73% |
| 7d | 122,460 | 1,821,751 | $2,105,803,698 | 80.65% | 19.83% |
| all | 408,465 | 7,122,471 | $10,808,019,940 | 86.27% | 10.80% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $24,237,850 | 78 | 78 | 100.0% | USDC/USDT |
| 2 | [0x621aac8763c5d90ad8d1a07bfee887328c265e32](https://robinhoodchain.blockscout.com/address/0x621aac8763c5d90ad8d1a07bfee887328c265e32) | $19,318,306 | 540 | 540 | 0.0% | WETH/USDG |
| 3 | [0x84e8004bd8984101aa62d4a433393019547b90d3](https://robinhoodchain.blockscout.com/address/0x84e8004bd8984101aa62d4a433393019547b90d3) | $19,202,689 | 554 | 554 | 0.0% | WETH/USDG |
| 4 | [0x26de5022701d96c36d47f33b1d1a1c48032b1e00](https://robinhoodchain.blockscout.com/address/0x26de5022701d96c36d47f33b1d1a1c48032b1e00) | $18,207,069 | 526 | 526 | 0.0% | WETH/USDG |
| 5 | [0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb](https://robinhoodchain.blockscout.com/address/0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb) | $18,057,988 | 537 | 537 | 0.0% | WETH/USDG |
| 6 | [0x0963545d05996d4b6deb88704ce25cbb3a73e52e](https://robinhoodchain.blockscout.com/address/0x0963545d05996d4b6deb88704ce25cbb3a73e52e) | $18,025,008 | 519 | 519 | 0.0% | WETH/USDG |
| 7 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $8,255,260 | 40 | 40 | 0.0% | USDC/USDT |
| 8 | [0x3980daa7eaad0b7e0c53cfc5c2760037270da54d](https://bscscan.com/address/0x3980daa7eaad0b7e0c53cfc5c2760037270da54d) | $5,628,999 | 8 | 5 | 75.0% | WETH/USDC |
| 9 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $3,749,411 | 32 | 27 | 21.9% | USDC/USDT |
| 10 | [0x1d042c727d3f0b228a7438378e531773d1d8e353](https://etherscan.io/address/0x1d042c727d3f0b228a7438378e531773d1d8e353) | $3,741,362 | 196 | 160 | 0.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 289 addresses and accounts for 82.38% of estimated 24-hour pool turnover. Its entry cutoff is $138,197, compared with median wallet volume of $55.
Of 206,192 swaps, 206,192 have a USD estimate; 47,414 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 4,085 | 20,424 | 40,847 |
| Trading volume entry cutoff ≈ | $266,565 | $16,833 | $5,107 |
| Lifetime volume total ≈ | $9,323,622,746 | $10,464,009,370 | $10,654,933,282 |
| Volume in last 24h total ≈ | $293,510,738 | $323,982,251 | $327,644,526 |
| Lifetime volume median ≈ | $525,385 | $59,354 | $16,833 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 239 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 90 | 578 | 1055 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $2,083 | $2,678 | $1,617 |
| Lifetime deposits median, historical LPs only ≈ | $32,448 | $14,938 | $7,705 |

## Liquidity providers

Full LP history: complete. 7,282 historical owners; 4,893 owners with open shares; 4,892 positive, fully valued active portfolios.
Known active liquidity: $32,185,993. Cumulative deposits: $302,173,650; withdrawals: $270,100,120. Both token legs use synced spot quotes; repeated capital counts again in flows.
1 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $114,993 | 49 | 58.79% |
| Top 5% | $15,509 | 245 | 82.39% |
| Top 10% | $5,720 | 490 | 89.86% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $266,565 | 163 / 4,085 | 90 | $2,083 | $32,448 |
| Top 5% | $16,833 | 956 / 20,424 | 578 | $2,678 | $14,938 |
| Top 10% | $5,107 | 1,678 / 40,847 | 1,055 | $1,617 | $7,705 |

### LP snapshot verification

232 pools verified against pinned contract storage; 1,673 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26509782, 2026-11-27T23:17:23.000Z, hash 0x3fb7bc3b1e003d1f65ea6c9bd94cb6c8dbab4aa2605e88076491cd48e5ea6b5e.
- BNB Chain: block 136126754, 2026-11-27T23:29:43.000Z, hash 0x2168ca6602ae778315f6a006ee3eeea831a7b503753c9f383d9d889f3e8de3fe.
- Robinhood: block 124618693, 2026-11-27T23:30:17.000Z, hash 0x561b5728bd3e95d75b28422826b828b889565ad60c57c17e2f93fa736e247085.
