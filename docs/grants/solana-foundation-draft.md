# Solana Foundation Grant — Draf Proposal Wenits.fun

> Apply: https://solana.org/grants (jalur langsung, bukan via Superteam USA yang paused).
> Syarat SF: open-source saat/sesudah mainnet, milestone jelas, budget per milestone.
> Status draf ini: siap tempel ke form, tinggal isi [bracket].

## Project title

Wenits.fun — Risk-free memecoin discovery + paper-trading arena with on-chain weekly payouts

## One-liner

Retail users learn Solana memecoins free: hype radar → paper trade $10k virtual → weekly winners paid on-chain via MultiHopper.

## Problem (2 kalimat)

Retail memecoin users lose real money learning. No safe place to test hype reads, no fair competition rails for beginners.

## Solution (3 bullet)

- Moon Radar: live Solana trending pools, Moon Score 0–100, Safety Gate auto-block HIGH RISK.
- Degen Arena: paper buy/sell, server-side fairness (idempotency anti double-spend, stale-price reject 15s).
- Weekly board: top-100 by equity, winners paid via routed on-chain transfers with public receipts.

## Traction (jujur, verified repo)

- Live MVP dev mode: Next.js 15 + Express + Postgres + Redis.
- 71 tests hijau, 14 suites (API 12 + web 2).
- Target Phase 1 exit gate: 100 test users, week-2 retention >20%, zero double-spends.

## Ask

$[3.000–5.000] untuk 2 bulan.

| Milestone | Isi | Budget | Bukti selesai |
|---|---|---|---|
| M1 — Wallet connect + arena identity | wallet-adapter, link wallet↔user, tampil di board | $800 | live URL + test |
| M2 — Safety Gate v2 + Moon Score final | threshold lock, audit log block, halaman metodologi | $1.200 | spec + test + demo |
| M3 — Payout rail + 300 peserta | MultiHopper Multi-Send ke winner, halaman /payouts publik, 2 season, laporan sponsor 1 halaman | $2.000–3.000 | receipts Solscan + laporan |

## Open source

Repo publik [link] saat M1. Lisensi MIT. Tidak ada token sale, tidak ada janji return.

## Team

[ Nama — role — X/GitHub — kota Jakarta, Indonesia. 1–2 orang cukup, jujur. ]

## Links

- Live: [URL Vercel]
- Repo: [URL publik bersih]
- Demo video ≤2 menit: [URL]
- Plan MultiHopper: docs/multihopper/plan.md (di repo)
