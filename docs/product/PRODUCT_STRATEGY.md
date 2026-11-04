# PRODUCT STRATEGY — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01 | Depends: PRODUCT_VISION.md

## 1. Strategic bets
1. Engagement before finance. Validate radar → arena → leaderboard loop before staking/swap/token.
2. Integration first. Use DexScreener, GeckoTerminal, Jupiter/Raydium/Orca SDKs. No custom AMM.
3. Server-authoritative fantasy. All balance/price/leaderboard decisions in backend. Client displays only.
4. Gating as growth. X follow gate optional via `X_LOGIN_REQUIRED`. Default OFF for dev, ON for prod.

## 2. Audience entry points
- Casual: `/radar` → moon score, no login.
- Degen: `/arena` → $10,000 paper trade, leaderboard.
- Social: X login → follow check → gated/denied/arena.
No wallet connection implemented. No admin dashboard implemented.

## 3. Moat
Live Solana hype + paper execution + weekly competition in one loop. Speed (<3s radar), anti-cheat (idempotency, stale-price reject), transparent sample-vs-real leaderboard.

## 4. What not to do now
No token spec, no APY, no price predictions, no wagering, no custom staking/LP, no microservices split.

## 5. Strategic metrics
Activation: % radar visitors placing 1 paper trade.
Retention: WAU returning for weekly board.
Integrity: duplicate-trade rate, stale-reject rate, follow-bypass attempts = 0.
Performance: radar p95 <3s, trade p95 <800ms.

## 6. Constraints from repo
- Price writer missing. `px:*` in Redis has no producer. Trade depends on it.
- Arena mint mapping provisional (`padEnd(32,'1').slice(0,44)`). Breaks auditability.
- `dev-anon` has no portfolio row. Trade returns `NO_PORTFOLIO` when DB live.
- Scraper is stub. No X/Telegram ingestion, no OpenRouter scoring persisted.
- Leaderboard has no settlement job. `leaderboard_weeks/entries` never written.

## Version history
- v0.1 2026-11-01: Draft from inspection. No prior strategy doc.
