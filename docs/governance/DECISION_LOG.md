# DECISION LOG — Wenits.fun
Status: Draft v0.2 | Date: 2026-11-01 | Source: Co Founder lock 2026-11-01

## Approved (from pasted brief §3 + verified code)
- D-PROD-01: Hybrid Web3 audience. Different entries per segment. No forced full-feature use.
- D-PROD-02: Hybrid economy L1 points / L2 rewards / L3 on-chain future. Points ≠ value.
- D-PROD-03: Integration-first DeFi. No custom AMM/staking without business justification.
- D-TECH-01: Modular monolith. No microservices split.
- D-AUTH-01: `X_LOGIN_REQUIRED` toggle. OFF = dev bypass, ON = prod gate. Verified in `gating.js`, `routes/auth.js`.
- D-TRADE-01: Server-authoritative fantasy trade. Idempotency + FOR UPDATE + stale-price reject. Verified `routes/trade.js`.
- D-MARKET-01: GeckoTerminal + DexScreener, no CoinGecko. Verified web `/api/*` + api `/market/*`.
- D-SEC-01: Fail-closed gating. X error = still gated. Verified `x.js`, `refollow.js`.

## Locked by Co Founder (2026-11-01, strategic level — PM specs, DEV builds after)
- L1 Scope: Arena + Radar only. Staking/swap/token/PvP/mini-game/X gating frozen.
- L2 Filter: logic-only Safety Gate → Moon Score v2, no AI realtime. RISKY = block trade, tampil + MARK HIGH RISK. Verdict `<40 AVOID / HIGH RISK`.
- L3 X: simpan file nonaktif. Route mati, file tetap. $0 cost.
- L4 Reward batch 1: badge musim + spotlight. $0, manual sheet, min 5 trade.
- L5 Open-source: tunda sampai H-1 grant. Lindungi IP.
- Handoff PM: spec filter v2 (input GT, ambang gate, rumus skor, PASS/RISKY/REJECT, blokir trade), verdict baru + teks UI, reward batch 1 (badge, syarat, flag bot), dokumen Colosseum + Earn (problem 1 paragraf, 100 user, retensi minggu 2, bukti demo).
- Handoff DEV: tunggu spec PM. Tanpa ubah `apps/web/app/api/coins/route.ts`, `apps/web/app/radar/page.tsx`, `services/api/src/index.js` sebelum spec kunci.

## Pending approval (need operator decision)
- D1: Price writer source. Options: (a) GeckoTerminal poller → Redis `px:*` (recommend — matches radar source), (b) DexScreener poller, (c) Pyth on-chain. Recommend (a) for consistency.
- D2: Mint registry. Options: (a) poolAddress→mint map table (recommend), (b) allowlist 7 fixed mints, (c) free-form mint (reject — spoof risk).
- D3: `dev-anon` portfolio. Options: (a) ephemeral in-memory portfolio OFF-only (recommend for demo), (b) block trade OFF without X login, (c) auto-create DB row per session (pollutes users table — reject).
- D4: Leaderboard settlement cadence. Options: (a) weekly cron Monday 00:00 UTC + equity snapshot (recommend), (b) daily rolling, (c) manual trigger only.
- D5: Scraper direction. Options: (a) build X/Telegram ingestion + OpenRouter persist (needs keys + budget), (b) freeze as stub, remove WS claim from README (recommend short-term).
- D6: MoonScore convergence. Web formula vs API formula differ. Recommend single shared formula + test vectors.
- D7: Wallet connection priority. PRD Phase 1 requires it. Options: (a) Solana wallet-adapter next sprint (recommend), (b) defer to Phase 2.
- D8: `.env` real file in `services/api/` + no `.gitignore` + no git repo. Recommend: create `.gitignore`, rotate JWT/keys if ever pushed.

## Version history
- v0.2 2026-11-01: Tambah Co Founder lock L1-L5 + handoff PM/DEV. Tanpa ubah kode.
- v0.1 2026-11-01: Initial log. 8 pending.
