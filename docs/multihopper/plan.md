# MultiHopper — Rencana Build & Route (Wenits.fun)

> Challenge: MultiHopper Build & Route — hadiah 5.000 USDC (60/25/15) + revenue share 0,25%.
> Syarat: produk Solana working + integrasi MultiHopper + volume produksi ≥ $100.000 via integrasi.
> Deadline: 29 Des 2026. Status: Submissions Open, 69 submission, 36 hari tersisa.

## Ide: Arena Prize Payout Rail

Masalah: hadiah mingguan arena (badge + spotlight) manual via sheet (`REWARD_BATCH1.md`), $0 cash, tanpa bukti on-chain.
Solusi: pemenang mingguan dibayar via MultiHopper Multi-Send — 1x klik admin, N payout ter-routing, receipt tercatat.

Kenapa nyambung MultiHopper: kategori "Creator payouts" + "Treasury automation" dari daftar ide resmi. Dana hadiah tetap milik Wenits treasury, bukan pool campur.

## Arsitektur (ngikut pola repo)

```
settle-board.js (ada) → leaderboard_entries (ada)
        ↓
NEW  POST /payouts/prepare  (admin only)
     - baca top-N minggu berjalan (query sama kayak GET /board/weekly)
     - panggil MultiHopper: POST /transfers (1 transfer per winner, mh_live_ key)
     - simpan transferId + status=awaiting_signature ke tabel payouts baru
NEW  POST /payouts/confirm
     - admin sign + broadcast (sesuai quickstart: prepare → sign keeperFundingTx dulu → confirm-broadcast)
     - update payouts.status=processing → settled (via webhook GET /payouts/webhook)
NEW  GET /payouts/week/:id  → bukti publik (transferId, tx sig, amount, status)
Web  halaman /payouts: daftar pemenang + receipt link Solscan
```

Env baru (JANGAN commit): `MH_API_KEY` (mh_test_ / mh_live_), `MH_BASE_URL`, `PAYOUT_TREASURY_WALLET`, `PAYOUT_ADMIN_TOKEN`.

## File yang dibuat (skeleton)

- `services/api/src/lib/multihopper.js` — client tipis: `mh(endpoint, body)` + `estimate`, `createTransfer`, `prepareTransfer`, `confirmBroadcast`, `getTransfer`. Base URL + key dari env. Timeout 15 detik.
- `services/api/src/routes/payouts.js` — 4 endpoint di atas, admin guard via `PAYOUT_ADMIN_TOKEN` (header `x-admin-token`), validasi Zod, catat ke `payouts`.
- `db/migrate-payouts.sql` — tabel `payouts(id, week_id, user_id, amount_usd, token_mint, transfer_id, status, tx_sig, created_at)`.
- `services/api/__tests__/payouts.test.js` — mock fetch MultiHopper: prepare ok, confirm ok, admin token salah → 401.
- `apps/web/app/payouts/page.tsx` — halaman bukti publik (fetch GET /payouts/week/:id).
- `.env.example` — tambah 4 var MH_* (tanpa nilai).

## Bukti yang dikumpulkan untuk submission

1. Demo video ≤3 menit: arena → settlement → payout → Solscan receipt.
2. Ekspor transaksi: transferId, mainnet sig, timestamp, volume total.
3. Bukti user nyata: 2 season S1–S2 (jadwal roadmap Des 1–20), min 5 trade/winner, bot-flag review.
4. Repo + live URL + identifier integrasi (tanpa secret).

## Risiko jujur

- Ambang $100.000 volume produksi berat untuk arena paper-trading — volume yang dihitung HANYA payout treasury, bukan notional paper trade. Mitigasi: ajukan kategori "Creator payouts" dengan volume = total hadiah tersalur; kalau tidak lolos ambang, tetap dapat revenue share 0,25% + portofolio submission.
- 69 submission sudah masuk — diferensiasi = produk live + user nyata, bukan slide.
- Jangan campur dana user: treasury wallet terpisah, admin key terpisah, semua transfer tercatat di `payouts`.

## Langkah berikutnya (berurutan)

1. Skeleton kode (file di atas) — tanpa key asli, semua mock.
2. Daftar devnet key (`devnet.multihopper.com`), uji 1 transfer devnet SOL.
3. Onboarding produksi: chat builder MultiHopper, konfirmasi atribusi volume.
4. Deploy + kumpulkan volume Des 2026, submit sebelum 29 Des.
