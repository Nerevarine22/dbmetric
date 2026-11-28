# Metric trader analysis

Indexed cutoff: 2026-11-28T07:39:23.000Z. Networks: Ethereum, BNB Chain, Robinhood.
All-time registry coverage: complete.

| Window | Traders | Swaps | Estimated volume | Top 1% share | Top 10 share |
| --- | ---: | ---: | ---: | ---: | ---: |
| 24h | 29,393 | 191,877 | $309,410,482 | 82.25% | 37.24% |
| 7d | 122,235 | 1,763,711 | $2,039,048,616 | 81.98% | 20.51% |
| all | 412,453 | 7,180,099 | $10,869,682,013 | 86.35% | 10.79% |

## Top addresses over 24 hours

| Rank | Address | Estimated volume | Swaps | Transactions | Direct router | Favorite pool |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2](https://etherscan.io/address/0x7d96d9805433a9c1ea09530830f9d7bcf699a3e2) | $18,728,164 | 60 | 60 | 100.0% | USDC/USDT |
| 2 | [0x84e8004bd8984101aa62d4a433393019547b90d3](https://robinhoodchain.blockscout.com/address/0x84e8004bd8984101aa62d4a433393019547b90d3) | $15,718,461 | 465 | 465 | 0.0% | WETH/USDG |
| 3 | [0x621aac8763c5d90ad8d1a07bfee887328c265e32](https://robinhoodchain.blockscout.com/address/0x621aac8763c5d90ad8d1a07bfee887328c265e32) | $15,669,695 | 449 | 449 | 0.0% | WETH/USDG |
| 4 | [0x26de5022701d96c36d47f33b1d1a1c48032b1e00](https://robinhoodchain.blockscout.com/address/0x26de5022701d96c36d47f33b1d1a1c48032b1e00) | $15,045,242 | 444 | 444 | 0.0% | WETH/USDG |
| 5 | [0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb](https://robinhoodchain.blockscout.com/address/0xffb36ca005d09f4bb9808232aba9da5d7fb3ddcb) | $14,955,013 | 452 | 452 | 0.0% | WETH/USDG |
| 6 | [0x0963545d05996d4b6deb88704ce25cbb3a73e52e](https://robinhoodchain.blockscout.com/address/0x0963545d05996d4b6deb88704ce25cbb3a73e52e) | $14,483,331 | 430 | 430 | 0.0% | WETH/USDG |
| 7 | [0x638260cf240236b2714b59b1a18ddf06ee4b767b](https://etherscan.io/address/0x638260cf240236b2714b59b1a18ddf06ee4b767b) | $8,261,218 | 40 | 40 | 0.0% | USDC/USDT |
| 8 | [0x3980daa7eaad0b7e0c53cfc5c2760037270da54d](https://bscscan.com/address/0x3980daa7eaad0b7e0c53cfc5c2760037270da54d) | $5,628,999 | 8 | 5 | 75.0% | WETH/USDC |
| 9 | [0x5c3593481cba011737e36ded62f1797c9f6afce1](https://etherscan.io/address/0x5c3593481cba011737e36ded62f1797c9f6afce1) | $3,376,644 | 35 | 29 | 11.4% | USDC/USDT |
| 10 | [0xa7842153fde380a864726d0e91f14f6ffab7d46c](https://etherscan.io/address/0xa7842153fde380a864726d0e91f14f6ffab7d46c) | $3,371,612 | 20 | 20 | 100.0% | USDC/USDT |

## Interpretation

The top-volume cohort contains 294 addresses and accounts for 82.25% of estimated 24-hour pool turnover. Its entry cutoff is $134,382, compared with median wallet volume of $53.
Of 191,877 swaps, 191,877 have a USD estimate; 44,468 use current metadata prices rather than a stable-unit estimate.
Swaps and transaction counts are intentionally separate: multi-pool routes can inflate swap counts and sum turnover across several pools in one transaction. High volume alone does not establish profitability or identify an individual user.

Trader analysis covers transaction senders in registered canonical-factory pools. LP analysis below separately identifies position owners. Neither measures profits or wash-trading-adjusted end-user notional. USD values are estimates, not historical execution prices.

## Combined top-trader cohorts

All columns describe the same lifetime-volume-ranked addresses. Top 1% is nested in Top 5% and Top 10%; ties are included. Medians are group descriptions, not additional entry requirements. LP balances use the separate disclosed chain cutoffs.

| Metric | Top 1% | Top 5% | Top 10% |
| --- | ---: | ---: | ---: |
| Wallets | 4,125 | 20,623 | 41,246 |
| Trading volume entry cutoff ≈ | $266,156 | $16,638 | $5,043 |
| Lifetime volume total ≈ | $9,385,517,983 | $10,526,128,669 | $10,716,780,708 |
| Volume in last 24h total ≈ | $274,177,466 | $302,084,185 | $305,251,554 |
| Lifetime volume median ≈ | $523,885 | $58,659 | $16,638 |
| Volume in last 24h median ≈ | $0 | $0 | $0 |
| Swap transactions median | 244 | 18 | 10 |
| Active UTC days median | 14 | 4 | 2 |
| Pools created median | 0 | 0 | 0 |
| Active LPs | 91 | 585 | 1067 |
| Active liquidity median, all traders ≈ | $0 | $0 | $0 |
| Lifetime deposits median, all traders ≈ | Unavailable | Unavailable | Unavailable |
| Active liquidity median, active LPs only ≈ | $2,178 | $2,632 | $1,577 |
| Lifetime deposits median, historical LPs only ≈ | $32,448 | $15,351 | $7,614 |

## Liquidity providers

Full LP history: complete. 7,297 historical owners; 4,899 owners with open shares; 4,898 positive, fully valued active portfolios.
Known active liquidity: $32,416,044. Cumulative deposits: $303,137,656; withdrawals: $270,839,458. Both token legs use synced spot quotes; repeated capital counts again in flows.
1 active portfolios excluded from ranking; 0 pools failed valuation checks. Thresholds apply to positive, fully valued portfolios.

| LP cohort | Active capital entry cutoff | Wallets including ties | Share of valued capital |
| --- | ---: | ---: | ---: |
| Top 1% | $114,995 | 49 | 58.92% |
| Top 5% | $15,584 | 245 | 82.47% |
| Top 10% | $5,831 | 490 | 89.96% |

### Deposits of top traders

Groups are selected by lifetime swap volume. Medians describe LP participants in each trader group, not every trader. Active-value medians exclude unpriced portfolios; deposit medians include fully withdrawn historical LPs with priced flows.

| Trader group | Trader volume entry | Ever LP / traders | Active LPs | Median active LP | Median cumulative deposits |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top 1% | $266,156 | 163 / 4,125 | 91 | $2,178 | $32,448 |
| Top 5% | $16,638 | 965 / 20,623 | 585 | $2,632 | $15,351 |
| Top 10% | $5,043 | 1,695 / 41,246 | 1,067 | $1,577 | $7,614 |

### LP snapshot verification

233 pools verified against pinned contract storage; 1,680 pools reconstructed from complete LP and BinSwapped events.
- Ethereum: block 26512285, 2026-11-28T07:39:23.000Z, hash 0x43a57179f6e65456be4d674a32b9f0a821530430d3527616d16698a651c4837f.
- BNB Chain: block 136193617, 2026-11-28T07:51:27.000Z, hash 0xe47d28bf036c4740d92255799350cdc24ff4b0280a45e6f37f3a58f31793057e.
- Robinhood: block 124876178, 2026-11-28T07:52:01.000Z, hash 0x0cda324c7ae9142bdde7e95dcce15eca51003fdb10cbab1f82a6338e91b73f5e.
