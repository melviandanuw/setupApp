# Wenits.fun — Degen Arena & Trend Tracker (Solana)

Platform gabungan: **AI narrative dashboard** + **memecoin paper trading $10.000** + **social gating X follow**. Stack: Next.js + Node Express + Python scraper + PostgreSQL + Redis + X API v2 + OpenRouter.

## Struktur repo

```
D:/Project/Wenits.fun/
├── README.md
├── HOW_TO_RUN.md
├── SECURITY.md
├── db/schema.sql
├── apps/web/
├── services/api/
└── services/ai-scraper/
```

## Arsitektur
```
apps/web (Next.js) ──HTTPS──> services/api (Node/Express)
                                    │ JWT httpOnly cookie + Redis sess
                                    ├── PostgreSQL (user, saldo, trade, leaderboard)
                                    ├── Redis (price cache, rate-limit, idempotency)
                                    ├── X API v2 (OAuth2 PKCE + follow check)
                                    └── services/ai-scraper (Python) ──> OpenRouter (Hermes AI) ──> WS ke web
```

## Alur Auth X Gating
1. `GET /auth/x/login` buat `state` + `code_verifier` random, simpan Redis 10 mnt (httpOnly cookie `oauth_state`), redirect ke `twitter.com/i/oauth2/authorize` + PKCE S256.
2. Callback `GET /auth/x/callback?code&state` verifikasi `state` sama, tukar `code` + `code_verifier` ke `api.x.com/2/oauth2/token`, ambil `users/me`, simpan token terenkripsi di DB, set JWT httpOnly cookie.
3. `GET /auth/x/follow-status` cek `users/:id/following` target `CREATOR_X_USER_ID`. Cache Redis 5 mnt. Fail-closed.
4. Background job tiap 30 mnt re-cek follow. Unfollow → `is_gated=1`, revoke akses trading/dashboard.

## DB
Lihat `db/schema.sql`. Saldo virtual 10000 saat user pertama dibuat. Trade pakai transaksi `SELECT ... FOR UPDATE`, harga dari Redis cache + staleness check, `idempotency_key` unique cegah double-spend.

## Jalankan (ringkas)

```bash
cp services/api/.env.example services/api/.env
psql $DATABASE_URL -f db/schema.sql
cd services/api && npm i && npm test
cd services/api && npm run dev
```

Detail penuh: **HOW_TO_RUN.md**.
