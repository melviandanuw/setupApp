# REWARD BATCH 1 — Badge Musim + Spotlight (L4)
Status: DEV-built, PM-spec pending detail. $0 cash. Manual sheet.

## Badge (computed di GET /board/weekly)
- Rank 1 = GOLD DEGEN, rank 2 = SILVER DEGEN, rank 3 = BRONZE DEGEN.
- Field `badge` di tiap entry + `season` di response.
- Tanpa kolom DB baru, tanpa nilai uang.

## Syarat klaim (manual review via sheet)
- Min 5 trade tercatat di `trades` minggu itu (cek: SELECT user_id, count(*) ...).
- Flag bot: >50 trade/hari dari 1 user, atau pola buy/sell identik berulang -> review manual, diskualifikasi sementara.

## Spotlight
- Winner tampil di board + share card PnL (screenshot manual).
- Entry Hall of Fame: catat week_id + username + badge di sheet.

## Sheet kolom
week_id | user_id | x_username | trades | equity | rank | badge | bot_flag | spotlight_done
