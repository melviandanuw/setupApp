# USER PERSONAS — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01

## P1 — Casual Scanner "Raka"
- Context: Retail, mobile, 10 min/day. Wants hype without noise.
- Entry: `/radar` directly, no login.
- Needs: Top 10 hype, moon score, price + 24h + vol/liq, chart link.
- Frustration: Slow feeds, jargon, forced signup.
- Success: Finds 3 moonshots <60s.
- Current fit: Good. Radar meets needs. No login required. OFF mode default helps.

## P2 — Degen Paper Trader "Sinta"
- Context: Active memecoin trader, desktop, wants practice without ruin.
- Entry: `/arena`, $10,000 virtual.
- Needs: Fast coin list, real candles, USD size input, BUY/SELL feedback, positions, leaderboard rank.
- Frustration: Double-fill on double-click, stale price fills, fake leaderboard.
- Success: 5 paper trades/week, climbs board.
- Current fit: Partial. Trade + idempotency + stale guard exist. Blocked by: no price writer (O1), provisional mint mapping (O2), sample leaderboard unlabeled risk.

## P3 — Creator Follower "Bagas"
- Context: Follows creator on X, expects gated perks.
- Entry: X login → follow check → arena.
- Needs: Clear login, gated explanation, follow CTA, re-check, logout.
- Frustration: Silent 401, unclear why blocked, state expiry confusion.
- Success: Login → arena in <2 min when following.
- Current fit: Good when ON. Flows `/denied`, `/gated`, `FOLLOW_REQUIRED` exist. OFF mode bypasses entirely (dev decision).

## Anti-personas (MVP)
- Yield farmer seeking APY → no staking yet.
- Real-money swapper → no swap yet.
- Bot farmer → anti-Sybil not built.

## Journey summary
Raka: home → radar → pool chart → (optional) arena.
Sinta: home → arena → select coin → set USD → BUY/SELL → positions → board.
Bagas (ON): home → Login X → callback → gated|arena → follow-status → arena → re-check job.

## Version history
- v0.1 2026-11-01: Draft from implemented routes/pages.
