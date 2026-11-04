# SYSTEM ARCHITECTURE — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01 | Source: Code inspection

## 1. Topology (as built)
```
apps/web (Next.js :3000)
 ├─ /api/coins (GeckoTerminal trending, 10/page, 2m mem cache)
 ├─ /api/pool (GeckoTerminal OHLC, 5m mem cache)
 └─ /arena /radar → fetch API directly + backend API
services/api (Express :8080)
 ├─ /auth/x/* (OAuth PKCE, JWT cookie)
 ├─ /trade (POST + /portfolio), /board/weekly, /market/coins|chart/:id
 ├─ PostgreSQL (users, portfolios, positions, trades, leaderboard_*)
 ├─ Redis (px:*, oauth:*, follow:*, radar:*) + memory fallback (radar-cache)
 └─ jobs/refollow sweep 30m
services/ai-scraper (Python stub: publishes trend note every 30s, sentiment() unused)
```

## 2. Data
Postgres: `db/schema.sql` — users (X identity + AES-GCM tokens + is_gated), portfolios ($10k default), positions (qty/avg_entry), trades (idempotency UNIQUE), leaderboard_weeks/entries.
Redis: `px:{mint}` {price,ts} — NO WRITER (O1). `oauth:{state}` 600s. `follow:{uid}` 300s. `radar:coins` 120s. `radar:chart:*` 300s.

## 3. Auth & gating
X OAuth2 PKCE S256, state 128-bit + httpOnly cookie + Redis one-time. JWT 12h httpOnly SameSite=lax. AES-256-GCM for X tokens. Toggle `X_LOGIN_REQUIRED` switches `dev-anon` vs real auth. Fail-closed on X errors.

## 4. Trade path
Zod → getPrice (stale 15s) → BEGIN → idempotency check → FOR UPDATE locks → balance/qty check → updates → insert → COMMIT. Duplicate → ok+duplicate:true. Rate: 10/10s. Body 50kb. Helmet.

## 5. Market path
Web-internal (no backend): GeckoTerminal trending + OHLC, per-page mem cache, stale-while-revalidate pattern in API variant. DexScreener path in `services/api/src/routes/market.js` (7 fixed pairs + moonScore). Two moonScore formulas exist (web vs api) — converge pending (Decision D6).

## 6. Decisions honored
Modular monolith (no split). Integration-first (DexScreener/GeckoTerminal). No custom AMM. Env secrets, no commits.

## 7. Gaps
O1 price writer. O2 mint mapping. O3 dev-anon portfolio. O4 board settlement. O5 scraper ingestion. No wallet adapter. No admin. No WS (claimed in README, not implemented — scraper `publish` has no subscriber).

## Version history
- v0.1 2026-11-01: Draft from inspection.
