# ASSUMPTIONS — Wenits.fun
Status: Draft v0.2 | Date: 2026-11-01 | Source: Co Founder lock 2026-11-01

## Facts (verified in code)
- F1: Trade needs Redis `px:{mint}` else 503. No writer exists.
- F2: Arena sends provisional mint (`padEnd`). Not a real Solana mint.
- F3: OFF mode uses shared `dev-anon` uid with no portfolio row.
- F4: Board read works, write path absent.
- F5: Scraper publishes to Redis channel with no subscriber. README WS claim inaccurate.
- F6: Two moonScore implementations (web + api) with different weights.
- F7: No wallet adapter, no admin, no points tables, no reward pools, no swap/staking.
- F8: `services/api/.env` real file present. No `.gitignore`. Not a git repo (per `git status`).
- F9 (Co Founder lock): Scope Arena + Radar only. RISKY block trade + MARK HIGH RISK. X simpan nonaktif. Reward batch 1 badge + spotlight manual. Open-source tunda H-1 grant. Filter v2 = tugas PM, tanpa kode dulu.

## Assumptions (need validation)
- A1: GeckoTerminal trending free tier sustains MVP traffic. Validate: monitor 429 rate.
- A2: DexScreener 7 fixed pairs stay liquid. Validate: monthly pair review.
- A3: X API v2 free/basic quota covers follow checks + sweep. Validate: usage dashboard.
- A3x (supersedes A3): X dibuang total per Co Founder. Asumsi biaya $0 tanpa X. Guest/wallet ganti X, Sybil via limit + review manual. Validasi: abuse rate minggu 1-4.
- A4: Single Redis + Postgres handle MVP concurrency. Validate: load test 100 concurrent trades.
- A5: Weekly board cadence drives retention. Validate: WAU after 4 weeks.
- A6: Users accept paper balance with zero redemption. Validate: onboarding copy test.
- A7: Sponsor-funded rewards viable later. Validate: 2 sponsor conversations before Phase 3.

## Risks if wrong
- A1/A2 wrong → radar empty, arena unusable. Mitigation: multi-source fallback + cache.
- A3 wrong → gating outages. Mitigation: fail-closed + status page.
- A3x wrong (tanpa X, Sybil naik) → leaderboard kotor. Mitigation: min 5 trade, flag win rate >90% + holding <60 dtk, review manual, hadiah non-cash.
- A4 wrong → race/oversell. Mitigation: txn + idempotency already present, add load test.

## Version history
- v0.2 2026-11-01: Tambah F9 Co Founder lock + A3x tanpa X. Tanpa ubah kode.
- v0.1 2026-11-01: Initial list from inspection.
