# QA TEST PLAN — Wenits.fun Core MVP
Status: Draft v0.1 | Date: 2026-11-01 | Source: QA_CHECKLIST.md (9 suites)

## 1. Scope
Auth, gating, trade, market, security, board, crypto, cache, moonscore. No code changes in this phase.

## 2. Suites (existing, must stay green)
- QA-01 auth.test.js (5): no cookie 401, bad sig 401, expired 401, cached follow, logout clears.
- QA-02 gating.test.js (5): OFF 404s X routes, gated blocks trade, dev-anon passes OFF.
- QA-03 trade.test.js (7): bad mint/side/usd 400, stale 503, duplicate true, insufficient.
- QA-04 market.test.js (5): 7 coins, moon 2-99 sorted, cache instant, DS down 502, chart 400/200.
- QA-05 security.test.js (4): helmet, 50kb cap, rate-limit, no leak.
- QA-06 leaderboard.test.js (3): DB down → 200 offline:true.
- QA-07 crypto.test.js (5): AES roundtrip, IV, tamper, PKCE, missing key.
- QA-08 radar-cache.test.js (2): memory fallback, expiry.
- QA-09 moonscore web (4): pump high, dump low, bounds, neutral.
- Legacy flow.test.js (5): old gating/race/dev-bypass.

Run: `cd services/api && npx jest --runInBand --forceExit` + `cd apps/web && npx jest`.

## 3. Critical paths (must verify post-foundation)
- Concurrent buy same idempotencyKey ×2 parallel → 1 row, second duplicate:true.
- Stale price (>15s) → 503, no balance change.
- Insufficient cash/qty → 400, no partial write.
- Unfollow → 403 within 30m.
- Board empty/DB down → labeled sample / offline:true.

## 4. Missing coverage (to add in build phase, not now)
- Price writer tests. Mint allowlist tests. Settlement job tests. Refresh-token tests. E2E (Playwright) radar→arena→board. Perf: radar p95, trade p95. Chaos: Redis down, Postgres down, DS/GT down.

## 5. Entry/exit
Entry: docs foundation approved. Exit: all suites green + manual E2E 6 steps in QA_CHECKLIST pass + gaps O1-O4 closed or waived.

## Version history
- v0.1 2026-11-01: Draft from checklist. No tests executed in this task (inspection only).
