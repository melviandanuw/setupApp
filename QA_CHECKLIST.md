# QA Checklist — Wenits.fun (SQA sign-off)
Date: 2026-11-01 | Scope: auth, gating, trade, market, security, leaderboard, crypto, cache, moonscore
Run: `cd services/api && npx jest --runInBand --forceExit` + `cd apps/web && npx jest`

## Unit suites
| ID | Suite | File | Cases | What must hold |
|----|-------|------|-------|----------------|
| QA-01 | Auth session | auth.test.js | 5 | no cookie 401, bad sig 401, expired 401, cached follow true, logout clears cookie |
| QA-02 | Gating | gating.test.js | 5 | toggle OFF 404s all X routes, gated blocked trade, dev-anon passes when OFF |
| QA-03 | Trade | trade.test.js | 7 | bad mint/side/usd rejected 400, stale 503, duplicate true, insufficient handled |
| QA-04 | Market | market.test.js | 5 | 7 coins, moon 2-99 sorted desc, cache instant, DS down 502, chart 400/200 |
| QA-05 | Security | security.test.js | 4 | helmet headers, 50kb cap, rate-limit present, no secret leak |
| QA-06 | Leaderboard | leaderboard.test.js | 3 | DB down -> 200 offline:true (crash regression), empty [], sorted |
| QA-07 | Crypto | crypto.test.js | 5 | AES roundtrip, random IV, tamper fails, PKCE shape, missing key clean error |
| QA-08 | Cache | radar-cache.test.js | 2 | memory fallback works, expiry respected |
| QA-09 | Moonscore (web) | moonscore.test.js | 4 | pump high, dump low, bounds, neutral default |
| Legacy | flow | flow.test.js | 5 | old gating/race/dev-bypass still green |

## Manual E2E (after green)
1. `bash scripts/start-dev.sh` -> api 200, web 200.
2. `/radar` loads 7 coins < 3s (internal API, no CoinGecko).
3. `/arena` list instant skeleton, chart candles render.
4. Buy/sell with same idempotencyKey twice -> second `{duplicate:true}`.
5. `X_LOGIN_REQUIRED=true` + unfollow -> 403 FOLLOW_REQUIRED.
6. Kill: `bash scripts/stop-dev.sh` -> ports free.
