# USER FLOWS — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01 | Depends: PRD.md

## F1 — Radar scan (no auth)
1. User opens `/` → sees top 3 moonshots (SWR `/api/coins?page=1`, 120s refresh).
2. Clicks "Open Moon Radar" → `/radar` infinite scroll, 10/page, Refresh now.
3. Clicks coin → `/arena?pool=` with pool preselected.
Error: feed down → "Market feed unreachable — retrying." Empty → "No hype pools."

## F2 — Paper trade (OFF mode)
1. Open `/arena`. Coin list left, chart center, board right.
2. Select coin, set USD (default 10), BUY/SELL.
3. Client generates `idempotencyKey` (randomUUID), POST `API/trade`.
4. Success: `BUY OK @ price (notional)`. Fail: `FAILED: error`.
5. Positions + cash refresh (5s poll).
Edge: double-click same key → second returns `duplicate:true`. Stale/missing price → 503, no state change.

## F3 — X login (ON mode)
1. Home → Login with X → `GET /auth/x/login` → redirect twitter authorize (PKCE S256, state cookie + Redis 600s).
2a. Deny → `/denied`.
2b. Allow → `/auth/x/callback` verifies state, exchanges token (10s), fetches me, checks follow.
3. New user: insert users + portfolios($10,000 default). Existing: update tokens + gating.
4. Followed → set cookie `wenits` 12h → `/arena`. Unfollowed → `/gated` with Follow + Re-check.
Error: BAD_STATE (cookie mismatch / >10m), STATE_EXPIRED, TOKEN_EXCHANGE_FAILED (secret/callback mismatch), X_API_FAILED (fail-closed).

## F4 — Gated re-check
1. `/gated` → Follow → Re-check → `GET /auth/x/follow-status`.
2. Cached (5m) instant. Else live X paginated check, update DB + cache.
3. Background sweep 30m auto-gates unfollowers. Next trade → 403 FOLLOW_REQUIRED.

## F5 — Leaderboard view
1. `/arena` polls `GET /board/weekly` 15s.
2. Entries present → top 10 rendered with rank.
3. Empty → sample rows labeled "*sample — real data appears once Postgres is live".
4. DB down → `{entries:[],offline:true}` still 200.

## F6 — Chart view
1. Select coin → `GET /api/pool?pool=` (web) or `/market/chart/:id` (API).
2. Cached instant, background refresh. Missing → flat fallback line or "Pick a coin."

## Version history
- v0.1 2026-11-01: Draft from routes/pages.
