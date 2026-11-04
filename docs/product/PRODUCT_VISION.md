# PRODUCT VISION — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01 | Owner: Product
Source of truth for direction. Does not promise token, returns, rewards.

## 1. Vision
One platform. Multiple experiences. One connected ecosystem.

## 2. Mission
Make Web3 accessible and engaging by combining intelligence, entertainment, competition, and decentralized utilities in one UX.

## 3. Positioning
Wenits.fun is a Web3 Entertainment & DeFi Ecosystem, not a dashboard, simulator, or game alone.

Current implementation (verified 2026-11-01):
- AI narrative dashboard → implemented as Moon Radar (`apps/web/app/radar`, `/api/coins`, `/api/pool`) via GeckoTerminal trending + DexScreener, moon score 0-100. No X/Telegram sentiment yet. Scraper is stub.
- Memecoin fantasy trading $10,000 → implemented in `services/api/src/routes/trade.js` + `/arena`. Server-authoritative, idempotency, stale-price reject. Price writer missing, mint mapping provisional.
- Social gating X follow → implemented (`/auth/x/*`, `gating.js`). Toggle `X_LOGIN_REQUIRED`.
- Weekly leaderboard → partial. API `GET /board/weekly` exists, falls back to `offline:true`. No settlement job. Web shows sample when empty.
- Points/XP, missions, staking, swap, admin → not implemented.

## 4. Modules (target)
A. AI Intelligence — narrative discovery, sentiment. AI output never investment advice.
B. Fantasy Trading — virtual balance, simulated buy/sell, tournaments. Server-authoritative.
C. Gaming & Play-to-Earn — missions, mini-games, PvP, seasons. Rules + fairness documented per game.
D. Reward Economy — budget-controlled, auditable. Points ≠ redeemable value unless defined.
E. Staking — evaluate native vs third-party. No guaranteed returns.
F. DeFi Hub — swap/LP via existing Solana protocols first. Surface IL, slippage, contract risk.
G. Social & Community — profiles, wallet identity, X verification, referrals, reputation.

## 5. Non-goals (MVP)
No native token spec. No custom AMM/staking. No wagering without legal review. No guaranteed predictions/returns.

## 6. Success (engagement first)
Activation: radar → arena trade. Retention: weekly leaderboard return. Integrity: zero double-spend, stale-price rejects work. Trust: AI labeled as sentiment, not prediction.

## 7. Design north star
Fun but not childish. hellomonday fluid + pump.fun trading UX. Usability over effects. Fast navigation, clear trade feedback, minimal onboarding.

## Version history
- v0.1 2026-11-01: Initial draft from repo inspection. No prior docs/ existed.
