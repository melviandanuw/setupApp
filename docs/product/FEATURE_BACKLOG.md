# FEATURE BACKLOG — Wenits.fun
Status: Draft v0.2 | Date: 2026-11-01 | Source: Co Founder lock (Arena + Radar only)
No tokenomics invented. No APY.

## Locked scope (Co Founder 2026-11-01)
Arena + Radar only. Beku: staking, swap/LP, token, PvP taruhan, mini-game, X gating aktif, AI sentiment realtime.
- RISKY = blokir trade, tampil + MARK HIGH RISK.
- Filter v2 + verdict baru = tugas PM, tanpa kode dulu.
- X = simpan file nonaktif.
- Reward batch 1 = badge musim + spotlight, manual sheet, min 5 trade.
- Open-source = tunda H-1 grant.

## Must Have (MVP close)
- [ ] B1 Price writer `px:*` (Redis hset price+ts). Unblocks all trades. Dep: Redis. Risk: stale source = trade halt.
- [ ] B2 Real mint registry (arena coin.id → trade mint). Remove `padEnd` hack. Dep: market source decision.
- [ ] B3 `dev-anon` portfolio decision: ephemeral row vs block trade in OFF mode. Dep: Decision D3.
- [ ] B4 Leaderboard settlement job (compute equity, write weeks/entries, rank). Dep: price writer.
- [ ] B5 Scraper decision: build ingestion or label stub + remove WS claim. Dep: Decision D5.
- [ ] B6 Wallet connection (Solana adapter) — PRD Phase 1 requirement, currently absent.
- [ ] B7 Admin dashboard (read-only: users, trades, board) — PRD requirement, currently absent.
- [ ] B8 Points/XP ledger design (no value yet) — PRD requirement.

## Should Have
- [ ] S1 User profiles page (username, follow status, stats).
- [ ] S2 Portfolio history + trade history UI.
- [ ] S3 Notifications (board end, price alert) — needs WS or polling contract.
- [ ] S4 SEO + performance pass (radar <3s p95).

## Could Have (Phase 2+)
- [ ] C1 Daily missions, achievements, Game Center, mini-games, PvP, seasons.
- [ ] C2 Reward engine + anti-Sybil.
- [ ] C3 Swap/staking/LP via Jupiter/Raydium/Orca (Phase 4).

## Won't Have (now)
- W1 Native token, supply, price, APY. Feasibility research only (Phase 3).
- W2 Custom AMM/staking contracts.
- W3 Wagering/chance mechanics without legal review.
- W4 Microservices split. Modular monolith stays.

## RICE notes
Reach/Impact/Confidence/Effort to be scored after B1-B5 decisions. Suggested weighting: Integrity (double-spend, stale) > Activation (radar→trade) > Retention (board) > Expansion (missions/DeFi).

## Version history
- v0.2 2026-11-01: Tambah locked scope Co Founder L1-L5. Tanpa ubah kode. PM spec dulu, DEV tunggu.
- v0.1 2026-11-01: Draft from gaps O1-O5.
