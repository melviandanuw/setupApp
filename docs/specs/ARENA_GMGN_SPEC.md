# SPEC — Degen Arena GMGN-style
Status: Draft v0.1 | Date: 2026-11-02 | Owner: PM | Scope: Docs only, tanpa kode
Referensi: GMGN token page (https://gmgn.ai/sol/token/EpFTb2XcGiMyGLykZ9VYmyPWz2AHEwAggqSbwJpypump)
Batasan lock: Arena + Radar only, RISKY blokir trade, X nonaktif, reward badge + spotlight.

## 1. Tujuan
Arena jadi terminal paper-trading chart-first rasa GMGN: header compact, chart hero, panel BUY/SELL virtual. Safety Gate jalan di balik layar (logic-only), tanpa panel sendiri. Tanpa eksekusi on-chain, tanpa copy trading, tanpa smart money real.

## 2. Struktur layar ( chart-first, versi paper )
1. Header token compact: simbol, nama, logo, CA + copy + Solscan, dex + pool singkat.
2. Baris harga compact: harga kini, 24h, vol, liq, moon + verdict, badge HIGH RISK inline bila RISKY.
3. Chart hero: candle OHLC per jam (`GET /api/pool?pool=`), 168 titik, cache 5 menit, retry saat rate-limit. Fokus utama, ukuran penuh.
4. Panel trade compact bawah chart: Size USD + BUY / SELL + pesan hasil. RISKY: tombol disabled + alasan singkat inline (tanpa panel terpisah).
5. Panel posisi: mint singkat, qty, avg_entry (`GET /trade/portfolio`).
6. Tanpa panel keamanan terpisah. Tanpa leaderboard di arena.

## 3. Safety Gate (sesuai lock Co Founder L2)
Input: GeckoTerminal trending + DexScreener, tanpa AI realtime.
Aturan:
- `liq < $10.000` → REJECT.
- `vol24h / liq > 8` + umur pool < 6 jam → RISKY (WASH suspect).
- `|h24| > 500%` tanpa likuiditas naik → RISKY (MANIPULASI suspect).
- `price <= 0` atau `liq = 0` atau `vol = 0` → REJECT.
- Umur pool dari `pool_created_at`: `< 30 menit` → NEW-DEGEN, skor max 60.
- Imbalance trade DexScreener `buys : sells ≥ 95 : 5` + harga naik tajam → RISKY (HONEYPOT suspect).
- Duplikat ticker: hanya likuiditas terbesar tampil, sisanya REJECT.
Output: PASS tampil normal, RISKY tampil + HIGH RISK + trade diblokir, REJECT disembunyikan.

## 4. Moon Score v2 (ganti `moonScore` lama)
Rumus (clamp 2..99):
`50 + momentum(h24×1.2 + h6×0.8 + h1×0.4, cap) + min(vol/liq×3, 18) + min(log10(liq)×2, 10) − min(|h24|×0.4, 14) − penalti umur (<2 jam −15, <12 jam −8) − penalti RISKY −12`
Verdict: `≥75 MOON LIKELY`, `≥58 WATCH`, `≥40 COOLING`, `<40 AVOID / HIGH RISK`.
Label UI jujur: skor momentum + likuiditas, bukan jaminan, risiko rug tetap ada.
Catatan: dua implementasi lama (`apps/web/app/api/coins/route.ts` dan `services/api/src/routes/market.js` + `apps/web/__tests__/moonscore.test.js`) pensiun setelah spec ini dikunci.

## 5. Kontrak data (tidak ubah kode, acuan DEV nanti)
- List: `GET /api/coins?page=N` → `coins[]` berisi `sym, name, price, change24h, volume24h, liquidity, dex, pairUrl, image, poolAddress, tokenAddress, moon, verdict, status (PASS/RISKY), riskReason[]`.
- Chart: `GET /api/pool?pool=` → `candles[]`, error `BAD_POOL` / `CHART_FAILED`.
- Trade: `POST /trade` body `mint, side, usd|qty, idempotencyKey`; error `BAD_INPUT, UNKNOWN_MINT (lib/mints.js), PRICE_UNAVAILABLE, PRICE_STALE, INSUFFICIENT_CASH, INSUFFICIENT_QTY, duplicate:true`.
- Harga: Redis `px:{mint}` via `lib/price.js`, `PRICE_STALE_MS=15000`.
- Mint: hanya `PAIRS` di `lib/mints.js` (7 pair), alias simbol diterima, free-form ditolak.

## 6. Aturan trade (tetap dari PRD)
Server-authoritative: cek idempotency → `SELECT ... FOR UPDATE` → cek saldo/qty → update → insert trade. Duplikat → `{ok:true,duplicate:true}`. RISKY/REJECT ditolak sebelum kirim (`UNKNOWN_MINT` atau `HIGH_RISK_BLOCKED` — DEV tentukan string final sesuai konvensi error eksisting).

## 7. Out of scope (tiru GMGN tapi TIDAK dibangun)
Copy trading, smart money tracking, KOL alert, eksekusi on-chain real, TP/SL otomatis, multi-wallet batch, P&L wallet explorer, API trading. Alasan: butuh audit + RPC + legal, di luar lock Arena-only.

## 8. Acceptance criteria
- AC1: Token REJECT tidak muncul di radar/arena.
- AC2: Token RISKY muncul + badge HIGH RISK inline + tombol BUY/SELL disabled + alasan singkat (tanpa panel keamanan).
- AC3: Token PASS trade normal; duplikat idempotencyKey → `duplicate:true`.
- AC4: Harga stale (>15s) → 503 `PRICE_STALE`, tanpa perubahan saldo.
- AC5: Mint di luar `PAIRS` → 400 `UNKNOWN_MINT`.
- AC6: Chart rate-limit → tombol Retry, tanpa crash halaman. Chart hero ukuran penuh.
- AC7: Tanpa leaderboard di arena. Tanpa panel keamanan terpisah.

## 9. Handoff DEV (setelah spec dikunci)
Ubah hanya setelah approval: `apps/web/app/api/coins/route.ts` (gate + skor v2), `apps/web/app/arena/page.tsx` (chart hero + disable trade RISKY, hapus leaderboard + panel keamanan), `services/api/src/routes/trade.js` (blokir RISKY), tambah/ubah `apps/web/__tests__/moonscore.test.js` jadi vektor v2. `radar/page.tsx` ikut badge HIGH RISK inline bila perlu. File X tetap non-route.

## Version history
- v0.2 2026-11-02: Chart-first. Hapus panel keamanan + leaderboard dari arena. Safety Gate di balik layar.
- v0.1 2026-11-02: Draft PM dari referensi GMGN + lock L1-L5. Tanpa kode.
