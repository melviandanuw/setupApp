# UI WORDING PACK — Wenits.fun (siap paste DEV)
Status: Draft v0.2 | Date: 2026-11-03 | Owner: Strategy → PM-1 | Scope: Docs only, tanpa kode
Sumber: copy aktif `apps/web/app/` (home, radar, arena, gated, denied, roadmap, layout). Lock: arena-only, RISKY blokir trade + MARK HIGH RISK, X nonaktif, reward batch1 badge+spotlight, $WenFUN beku.

## Aturan suara (semua menu)
- Fantasi dulu: sebut fantasy/paper money, bukan "earn".
- Jujur: skor tinggi ≠ jaminan. Risiko rug tetap.
- Pendek: 1 baris per aksi. Tanpa ejekan.
- Konsisten: "Moon Radar", "Degen Arena", "Buy / Long", "Sell", "Refresh now", "HIGH RISK".

## 1. Nav + footer (`app/layout.tsx`)
Nav tetap: Home · Moon Radar · Degen Arena · Roadmap · How to Play. CTA: `Enter Arena`.
Footer:
`Wenits.fun · Solana paper trading · fantasy money, no real value · not financial advice · prices by GeckoTerminal + DexScreener`

## 2. Home (`app/page.tsx`)
Hero:
- H1: `Trade memes. Zero ruin.`
- Sub: `Track live Solana hype and practice with $10,000 fantasy cash. No login, no real money, no ruin.`
- CTA: `Enter Degen Arena` / `Open Moon Radar`.
Stats:
- `$10K` / `fantasy cash per run`
- `LIVE` / `Solana hype pools`
- `TOP 100` / `weekly board seats`
Panel `Hype right now`:
- Loading: `Scanning live pools…`
- Baris top-3: `$SYM`, `±x.x% in 24h`, skor.
- CTA: `Full hype radar →`
How to play (`#how`):
- Lead: `Three moves. No KYC. Zero real losses.`
- 01 `Scan the hype` — `Real Solana trending pools plus a moon score. Practice reading hype before risking anything.`
- 02 `Send it in the arena` — `Buy and sell with $10,000 fantasy cash. Double-click safe — one order per click.`
- 03 `Climb the ranks` — `The biggest paper equity each week takes the Top 100.`
- CTA: `Start practicing`

## 3. Moon Radar (`app/radar/page.tsx`)
- H2: `Moon Radar`
- Lead: `Live Solana trending and fresh pools, refreshed every 3 minutes. Moon Score 0–100 blends 24h momentum, volume frenzy, and liquidity depth. A high score is not a guarantee. Not financial advice.`
- Tombol: `Refresh now` | `All pools` | `Fresh under 48h` | `Established 7d+`
- Helper: `Fresh = bigger moves, bigger risk. Established = deeper liquidity, slower moves.`
- Status: `Page X · N coins · updated Ns ago` / `updating…` / `Loading live hype…`
- Error: `Feed hiccup — retrying in the background, showing last data.`
- Empty filter: `No pools match this filter right now. Hit Refresh or switch to All pools.`
- Kartu: tag `Moon Likely` / `Watch` / `Cooling` / `Avoid · High Risk` (+ `New Degen`). Meta `pool age … · liq/vol …x`. Link `Open in arena`. `CA xxxx…xxxx` + Solscan.
- Kaki: `Wenits internal API · GeckoTerminal Solana trending · no CoinGecko, no backend dependency`

## 4. Degen Arena (`app/arena/page.tsx`)
- H2: `Degen Arena`
- Lead: `Pick a live Solana pool, set a USD size, hit Buy or Sell. Real pool candles, fantasy money. Stale prices and double orders are rejected automatically.`
- Mode: `Practice mode — no login.`
- Daftar: judul `Hype now`. Empty: `No pools loaded yet — open the radar.`
- Blok harga + badge inline bila RISKY: `HIGH RISK — <reason>. Trading disabled.`
- Chart: loading `Loading live pool chart…`; error `Chart feed is rate-limited.` + `Retry chart`.
- Trade: label `Size (USD)`; note `Double-click safe — one order per click.`; tombol `Buy / Long` / `Sell`.
- Hasil (code tetap, teks user):
  - Sukses: `BUY OK @ $price ($notional USD)` / `SELL OK @ ...`
  - `PRICE_STALE` / `PRICE_UNAVAILABLE` → `FAILED: <code> — price feed is stale, retry in a minute.`
  - `HIGH_RISK_BLOCKED` → `FAILED: HIGH_RISK_BLOCKED — risky token blocked by Safety Gate.`
  - `UNKNOWN_MINT` → `FAILED: UNKNOWN_MINT — unknown pool, pick from the Hype now list.`
  - `DB_UNAVAILABLE` → `FAILED: DB_UNAVAILABLE — database offline, trading paused.`
  - Network → `FAILED: network — API unreachable.`
- Posisi: judul `Your positions`. Empty: `No positions yet — your first buy shows up here.`
- Leaderboard di arena: HAPUS per spec v0.2 §2/§8. Sampai DEV hapus, biarkan label sample apa adanya.

## 5. Gated (`app/gated/page.tsx`)
Mode OFF (aktif):
- Tag: `practice mode`
- H1: `Practice mode`
- Body: `No gate right now — jump straight into the arena.`
- CTA: `Enter the arena`
Mode ON (dorman):
- Tag: `gated`
- H1: `Follow first, degen`
- Body: `Login worked, but the creator account is not followed yet. Follow it, then hit Re-check.`
- Tombol: `Follow creator` / `Re-check`

## 6. Denied (`app/denied/page.tsx`)
- Tag: `denied`
- H1: `Nope. Denied.`
- Body: `You declined the X permission, so we cannot let you in. Go back and try again.`
- CTA: `Back to home`

## 7. Roadmap (`app/roadmap/page.tsx`)
- Tag: `Nov 2026 to Jan 2027 · v0.3`
- H2: `Roadmap`
- Lead: `Three phases, one product: radar + arena. Reward game = season league. NFT = growth badge, not speculative PFP. $WenFUN stays frozen until January.`
- Kartu fase: goal/exit/cost/risk/token ikut `docs/product/ROADMAP.md` v0.3 (01/02/03, 80/15/5%).
- Blok `PM follow-ups`: internal only — sembunyikan dari publik.
- CTA: `Trade while we ship` / `Scan the hype`

## Handoff PM-1 → DEV
Paste strings Inggris atas ke: `app/page.tsx`, `app/radar/page.tsx`, `app/arena/page.tsx`, `app/gated/page.tsx`, `app/denied/page.tsx`, `app/layout.tsx`. Hapus blok leaderboard di arena + blok `PM follow-ups` di roadmap. Tanpa ubah error code backend, kontrak API.
