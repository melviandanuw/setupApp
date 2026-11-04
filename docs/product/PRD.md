# PRD — Wenits.fun Core MVP
Status: Draft v0.1 | Date: 2026-11-01 | Owner: Product
Scope: Phase 1 only. No token, no staking, no swap.

## 1. Problem
Retail memecoin users FOMO blind. No safe place to test hype reads. No weekly competition loop.

## 2. Goals
- G1: Radar loads live hype <3s.
- G2: Paper trade $10,000 with zero double-spend.
- G3: Weekly board drives return visits.
- G4: X gate optional, fail-closed when ON.

## 3. Users
See USER_PERSONAS.md. Casual scanner, degen paper trader, creator-follower.

## 4. Functional requirements
### FR-AUTH
- FA1: `X_LOGIN_REQUIRED=false` → `/auth/x/*` returns 404 `X_LOGIN_DISABLED`, `/arena` accessible, `req.uid=dev-anon`.
- FA2: `X_LOGIN_REQUIRED=true` → OAuth PKCE S256, state 128-bit + httpOnly cookie + Redis TTL 10m + one-time delete. Scopes: users.read follows.read offline.access.
- FA3: Callback verifies state, exchanges code (10s timeout), fetches `/users/me`, checks follow, creates/updates `users` + `portfolios`, sets JWT httpOnly 12h, redirects `/arena` or `/gated`.
- FA4: Denied permission → `/denied`.
- FA5: Logout clears `wenits` cookie.

### FR-GATE
- FG1: `GET /auth/x/follow-status` checks Redis `follow:{uid}` 5m cache, else X API paginated (max 5 pages), updates `is_gated`, fail-closed on X error (502).
- FG2: Trade blocked when `is_gated=1` → 403 `FOLLOW_REQUIRED`.
- FG3: Background sweep every 30m re-checks stale `last_follow_check`. Unfollow → `is_gated=1`.

### FR-MARKET
- FM1: Web `GET /api/coins?page=N` 10/page from GeckoTerminal trending, moon score 0-100, 2m memory cache. No CoinGecko, no backend dependency.
- FM2: Web `GET /api/pool?pool=` OHLC hour limit 168, 5m cache.
- FM3: API `GET /market/coins` + `/market/chart/:id` via DexScreener/GeckoTerminal, Redis cache 120s/300s, stale-while-revalidate.
- FM4: Moon score formula documented in code. Labeled sentiment/hype, never investment advice.

### FR-TRADE
- FT1: `POST /trade` body: mint 32-64 chars, side buy/sell, usd|qty, idempotencyKey 8-64. Zod validation.
- FT2: Price from Redis `px:{mint}` + `PRICE_STALE_MS=15000`. Missing → 503 `PRICE_UNAVAILABLE`, stale → 503 `PRICE_STALE`.
- FT3: Transaction: check idempotency → `SELECT ... FOR UPDATE` → balance/qty check → update → insert trade. Duplicate → `{ok:true,duplicate:true}`. Unique constraint fallback.
- FT4: Buy requires usd, checks cash. Sell requires qty (or usd/price), checks position.
- FT5: `GET /trade/portfolio` returns cash + positions.
- FT6: Rate limits: auth 20/m, trade 10/10s, market 30/m. Body 50kb. Helmet headers.

### FR-BOARD
- FB1: `GET /board/weekly` latest `leaderboard_weeks` + top 100 ordered rank. DB down → `{entries:[],offline:true}`.
- FB2: Web shows sample only when entries empty, labeled as sample.

### FR-PROFILE/DASHBOARD (partial)
- FP1: Users table stores x_user_id, username, encrypted tokens, gating flags.
- FP2: Gaps: no wallet connection, no editable profile, no admin dashboard.

## 5. Non-functional
- Performance: radar p95 <3s, trade p95 <800ms, chart cache hit <200ms.
- Security: see SECURITY_REQUIREMENTS.md.
- Availability: market failures degrade to cached/sample, never crash trade path except price guard.

## 6. Acceptance criteria
- AC1: OFF mode: radar loads, buy/sell works, double idempotencyKey → duplicate:true.
- AC2: ON mode: login → gated when unfollowed → arena when followed → blocked within 30m after unfollow.
- AC3: Stale price (>15s) rejects trade 503.
- AC4: Board empty → sample labeled, DB down → offline:true 200.
- AC5: All 9 jest suites green.

## 7. Out of scope
Points/XP, missions, PvP, reward pools, token, staking, swap, LP, admin, wallet adapter.

## 8. Open issues (from code)
- O1: No price writer for `px:*`. Trade 503 until writer exists.
- O2: Arena mint mapping provisional (`padEnd`). Needs real mint registry.
- O3: `dev-anon` has no portfolio row → `NO_PORTFOLIO` when DB live.
- O4: No leaderboard settlement writer.
- O5: Scraper stub, no persisted sentiment.

## Version history
- v0.1 2026-11-01: Draft from code inspection.
