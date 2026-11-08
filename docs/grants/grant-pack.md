# Grant Pack — Wenits.fun (siap kirim saat aplikasi dibuka)

> Status cek 2026-11-08: ketiga grant di bawah bertuliskan **"Applications Paused"**.
> Dokumen ini disiapkan supaya saat dibuka, lo tinggal copy-paste + lampirkan link.
> Satu-satunya grant yang bisa diajukan LANGSUNG hari ini: Solana Foundation via website mereka.

---

## 1. One-pager proyek (pakai untuk semua form)

**Nama:** Wenits.fun — Solana Degen Arena & Moon Radar
**Tagline:** Discover trending Solana memecoins and practice trading risk-free.
**Live URL:** https://wenits.fun (Vercel, API: https://wenits-fun-production.up.railway.app)
**Repo:** https://github.com/melviandanuw/wenits-fun (publik, grant-ready)
**Stack (verified dari repo):** Next.js 15.1 + React 19 (web :3000), Express 4 (API :8080), PostgreSQL, Redis, Python scraper. Solana: GeckoTerminal/DexScreener feeds, Jupiter (rencana), pump.fun (rencana $WenFUN fair launch).
**Status:** Live di dev mode. Moon Radar (live trending pools + Moon Score 0–100 + candles), Degen Arena (paper trading $10.000 virtual, anti double-spend, stale-price reject), Weekly board (top 100), X-gating opsional fail-closed.
**Kualitas:** 71 tests hijau di 14 suites (`services/api/__tests__` 12 suites + `apps/web/__tests__` 2 suites), idempotency anti double-spend, stale-price reject 15 detik.
**Payout rail (dalam progress):** integrasi MultiHopper untuk hadiah mingguan — lihat `docs/multihopper/plan.md`. Alur: settlement board → admin approve → Multi-Send ke winner → receipt on-chain.
**Angka (target Phase 1 exit gate):** 100 test users, retensi week-2 >20%, zero double-spends.
**Tim:** Co-founder + builder, Jakarta, Indonesia.
**Kontak:** (isi: nama, email, Telegram, X handle)

---

## 2A. Agentic Engineering Grants — $200 USDG (Global)

**Syarat:** deskripsi jelas apa yang dibangun + cara pakai AI tools. Produk Solana working. 50% upfront, 50% setelah ship + upload receipt subscription.
**Kondisi kode:** boleh private, tapi wajib share akses ke abhwshek@gmail.com untuk review.

**Draf jawaban "What do you want to build":**

> I am building Wenits.fun, a Solana memecoin discovery + risk-free paper-trading arena (live MVP: Next.js + Express + Postgres). Grant funds cover one month of AI coding Pro subscription to ship: (1) MultiHopper-routed arena prize payouts (Multi-Send to weekly winners with on-chain receipts), (2) Moon Score v2 + Safety Gate (HIGH RISK auto-block), (3) wallet connect for arena identity. Ship target: working payouts on devnet + demo video within 30 days. Repo: [link]. Live URL: [link].

**Draf jawaban "How will you use AI tools":**

> AI coding assistant (e.g. Claude Code / Cursor Pro) for scaffolding API routes, writing tests (existing Jest suite in apps/web/__tests__), and reviewing Solana transaction-building code. Subscription receipt uploaded at tranche 2.

**Lampiran:** live URL, repo link, 1 screenshot Radar + 1 screenshot Arena.

---

## 2B. The Touching Grass Fund (Indonesia) — s/d 500 USDG

**Syarat KHUSUS (verified 2026-11-08):**
1. Harus jadi **member Superteam Indonesia** dulu — non-member tidak bisa apply.
2. Aplikasi sedang **paused** — gabung member sekarang supaya saat dibuka lo prioritas.

**Cara jadi member (lakukan minggu ini):**
1. Buat profil di https://earn.superteam.fun (Sign Up, lengkapi skills: Frontend, Backend, Blockchain).
2. Join channel Superteam Indonesia (cari link di earn.superteam.fun atau X @SuperteamIDN).
3. Kerjakan 1 bounty kecil dulu (MozaikPay 500 USDC / KriptoK 200 USDC) — proof of work ini yang mempercepat approval member + grant.

**Draf jawaban saat dibuka:**

> Saya membangun Wenits.fun (Jakarta) — radar hype + arena paper-trading Solana untuk retail Indonesia yang ingin belajar memecoin tanpa rugi duit. Dana dipakai untuk: hosting + RPC ($15/bln), hadiah Season 1 arena (Des 2026), dan biaya integrasi payout on-chain. Milestone 30 hari: 100 test users Indonesia, 2 season mingguan selesai, laporan sponsor 1 halaman. Bukti: [live URL] [repo].

---

## 2C. Solana Foundation Grants — s/d $10.000 USDG (JALUR LANGSUNG, bisa hari ini)

**Catatan:** via Superteam USA status paused + khusus USA. Tapi teksnya sendiri bilang: *"You are free to apply directly on their website."*

**Apply langsung:** https://solana.org/grants (atau solana.foundation/grants — cek mana yang live)
**Syarat umum SF:** open-source segera setelah mainnet, proposal jelas, bukan USA-only.

**Draf proposal inti (1 paragraf, tempel ke form SF):**

> Wenits.fun is an open-source Solana onboarding funnel: a hype radar (GeckoTerminal/DexScreener feeds, Moon Score safety filter) feeding a risk-free paper-trading arena with weekly on-chain-settled seasons. Problem: retail memecoin users lose real money learning. Solution: learn free, compete weekly, winners paid via routed on-chain payouts. Ask: $[3.000–5.000] for 2 months to ship wallet connect, Safety Gate v2, and MultiHopper-routed prize distribution, targeting 300 season participants. Code open-sourced at mainnet. Milestones + budget table attached.

**Lampirkan:** milestone table (M1 wallet connect, M2 Safety Gate v2, M3 payout rail + 300 peserta), budget per milestone, repo link (WAJIB publik untuk SF).

---

## 3. Checklist sebelum kirim apa pun

- [ ] Live URL publik (deploy `apps/web` ke Vercel — `vercel.json` sudah ada)
- [ ] Repo publik bersih (hapus `.env`, secrets, `logs/`; cek `SECURITY.md`)
- [ ] 2 screenshot (Radar + Arena) + 1 demo video ≤2 menit
- [ ] Profil Earn lengkap + 1 bounty selesai (untuk jalur Indonesia)
- [ ] Wallet Solana khusus grant/payout (JANGAN wallet pribadi) — simpan seed offline

## 4. Urutan kerja yang disarankan

1. **Hari ini:** deploy Vercel + bersihkan repo (syarat semua grant).
2. **Minggu ini:** daftar Earn, gabung Superteam ID, ambil 1 bounty kecil.
3. **Saat grant dibuka / SF direct:** tempel draf dari dokumen ini.
