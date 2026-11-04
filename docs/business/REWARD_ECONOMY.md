# REWARD ECONOMY — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01 | Depends: BUSINESS_MODEL.md
No pool amounts. No token. Design rules only.

## 1. Layers (from approved direction)
- L1 Points (off-chain engagement): XP, reputation, mission points, achievements, seasonal progression. Non-redeemable by default.
- L2 Rewards (controlled distribution): seasonal/sponsored/game/community incentives. Each needs funding + budget + rules + eligibility + anti-abuse.
- L3 On-chain (future): native token/staking/LP only after feasibility. Never assume token must exist.

## 2. Accounting separation
- Virtual balances (`portfolios.cash_usd`, `positions`): simulation only, resettable, zero redemption.
- Non-transferable points: separate ledger (not built — see B8).
- Off-chain reward liabilities: separate ledger with budget cap (not built).
- On-chain assets: user wallets + protocol positions (not built).
Never mix ledgers. Each state change transactional + idempotent.

## 3. Current implementation
- Virtual $10,000 default (`portfolios.cash_usd DEFAULT 10000.00`). No XP tables. No reward tables. Leaderboard reads only.
- Anti-abuse present: idempotency, stale-price reject, follow gate, rate limits. Missing: Sybil detection, wash-trade detection, budget enforcer.

## 4. Rules for any future reward
1. Define funding source + tx proof.
2. Cap budget on-chain or in DB with check constraint.
3. Publish distribution rule + eligibility before season.
4. Enforce idempotent claims (one claim per user/season).
5. Log every allocation with audit trail.
6. Sweep abuse (multi-account, self-trade) before payout.
7. Never present projected rewards as guaranteed.

## 5. Anti-patterns blocked
- No APY display. No token price promises. No deposit-funded payouts. No duplicative claims. No leaderboard manipulation via stale fills (stale guard covers).

## Version history
- v0.1 2026-11-01: Draft. No amounts invented.
