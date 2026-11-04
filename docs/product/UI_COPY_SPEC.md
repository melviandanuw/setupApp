# UI_COPY_SPEC — paste tanpa tafsir (dari UI_WORDING_PACK v0.2)

Status: SPEC LOCK | Date: 2026-11-03 | Owner: PM-1 → DEV
Sumber copy: `docs/product/UI_WORDING_PACK.md` v0.2
Sumber string lama: `apps/web/app/` per 2026-11-03 (home, radar, arena, gated, denied, roadmap, layout)
Lock konteks: arena-only. RISKY blokir + HIGH RISK. X nonaktif. Reward batch1 badge + spotlight. $WenFUN beku sampai Januari.
Bahasa dokumen: Indonesia. String UI: Inggris, paste persis termasuk kapital, tanda baca, `—`, `·`, `…`.

Aturan paste global:
- Paste string dalam backtick persis. Jangan parafrase, jangan ubah kapital, jangan tambah titik.
- `—` (em dash), `·` (middle dot), `…` (ellipsis) beda dari `-`, `·`, `...`. Copy-paste karakter, jangan ketik ulang.
- Kondisional `OFF` (X nonaktif): lock aktif = cabang OFF saja tampil. Hapus cabang ON dari render bila spec tulis "ganti blok", kecuali `gated/page.tsx` yang simpan dua mode (OFF tampil, ON dorman).
- Kode error (`PRICE_STALE`, `HIGH_RISK_BLOCKED`, dll) tidak berubah. Yang berubah hanya teks user setelah `—`.

---

## 1. Tabel mapping old → new (per file)

### 1.1 `app/layout.tsx` (nav + footer)

| # | Baris / komponen | String lama | String baru persis |
|---|---|---|---|
| L-01 | Nav links | `Home` `Moon Radar` `Degen Arena` `Roadmap` `How to Play` | TIDAK BERUBAH — verifikasi saja |
| L-02 | Nav CTA | `Enter Arena` | TIDAK BERUBAH — verifikasi saja |
| L-03 | Footer | `Wenits.fun · Solana paper trading · not financial advice · prices by GeckoTerminal + DexScreener` | `Wenits.fun · Solana paper trading · fantasy money, no real value · not financial advice · prices by GeckoTerminal + DexScreener` |

Aksi L-03: tambah klausa `fantasy money, no real value ·` setelah `paper trading ·`.

### 1.2 `app/page.tsx` (home)

| # | Baris / komponen | String lama | String baru persis |
|---|---|---|---|
| H-01 | Hero H1 (l.12) | `Trade memes. Zero ruin.` | TIDAK BERUBAH |
| H-02 | Hero sub (l.13) | `Live Solana hype radar plus $10,000 fantasy cash. No login. Jump straight in.` (cabang OFF; ada cabang ON `X login plus follow to enter.`) | `Track live Solana hype and practice with $10,000 fantasy cash. No login, no real money, no ruin.` — hapus kondisional, jadi statis |
| H-03 | Hero CTA (l.15-16) | `Enter Degen Arena` / `Open Moon Radar` | TIDAK BERUBAH |
| H-04 | Stat 1 label (l.19) | `fantasy cash each run` | `fantasy cash per run` (`$10K` tetap) |
| H-05 | Stat 2 (l.20) | `LIVE` / `Solana hype pools` | TIDAK BERUBAH |
| H-06 | Stat 3 angka (l.21) | `100` | `TOP 100` (label `weekly board seats` tetap) |
| H-07 | Panel judul (l.25) | `Hype right now` | TIDAK BERUBAH |
| H-08 | Panel loading (l.26) | `Tuning the screen…` | `Scanning live pools…` |
| H-09 | Panel baris top-3 (l.29) | format `$SYM` + `±x.x% in 24h` + skor | TIDAK BERUBAH (format tetap) |
| H-10 | Panel CTA (l.32) | `Full hype radar` | `Full hype radar →` (tambah ` →`) |
| H-11 | `#how` lead (l.37) | `Three moves. No KYC. Zero real losses.` | TIDAK BERUBAH |
| H-12 | 01 desc (l.39) | `Real Solana trending pools plus moon score. Never FOMO blind.` | `Real Solana trending pools plus a moon score. Practice reading hype before risking anything.` (judul `Scan the hype` tetap) |
| H-13 | 02 desc (l.40) | `Buy and sell with $10,000 fantasy cash. Double-click safe.` | `Buy and sell with $10,000 fantasy cash. Double-click safe — one order per click.` |
| H-14 | 03 desc (l.41) | `Biggest equity each week sits on the Top 100.` | `The biggest paper equity each week takes the Top 100.` |
| H-15 | `#how` CTA (l.43) | `Send it now` | `Start practicing` |

### 1.3 `app/radar/page.tsx`

| # | Baris / komponen | String lama | String baru persis |
|---|---|---|---|
| R-01 | H2 (l.39) | `Moon radar` | `Moon Radar` (R kapital) |
| R-02 | Lead (l.40) | `Live Solana hype — trending plus fresh pools, auto-refresh every 3 min. Moon score 0 to 100 blends 24h momentum, volume frenzy and liquidity depth. 10 coins per page, scroll for more. Not financial advice.` | `Live Solana trending and fresh pools, refreshed every 3 minutes. Moon Score 0–100 blends 24h momentum, volume frenzy, and liquidity depth. A high score is not a guarantee. Not financial advice.` (perhatikan en dash `–` di `0–100`, koma setelah `frenzy,`) |
| R-03 | Tombol refresh (l.42) | `Refresh now` | TIDAK BERUBAH |
| R-04 | Filter (l.43) | `All pools` / `Fresh under 48h` | TIDAK BERUBAH |
| R-05 | Filter (l.43) | `Established 7d plus` | `Established 7d+` |
| R-06 | Helper (l.44) | `Fresh means big chance, big risk. Established means liquid, slow moves.` | `Fresh = bigger moves, bigger risk. Established = deeper liquidity, slower moves.` |
| R-07 | Status (l.47-48) | `Page X · N coins · updated Ns ago` / `updating…` | TIDAK BERUBAH (format dinamis tetap) |
| R-08 | Loading awal (l.47) | `Loading live hype…` | TIDAK BERUBAH |
| R-09 | Error (l.50) | `Market hiccup — retrying in background, showing last data.` | `Feed hiccup — retrying in the background, showing last data.` (`Market`→`Feed`, tambah `the`) |
| R-10 | Empty filter (l.52) | `No hype pools right now. Hit refresh.` | `No pools match this filter right now. Hit Refresh or switch to All pools.` (R kapital di `Refresh`) |
| R-11 | Kartu tag (l.56) | `Moon likely` | `Moon Likely` |
| R-12 | Kartu tag (l.56) | `Avoid / high risk` | `Avoid · High Risk` (`/`→`·`, H R kapital) (`Watch`, `Cooling` tetap) |
| R-13 | Kartu badge new (l.58) | `New degen` | `New Degen` |
| R-14 | Kartu meta (l.63) | format `pool age … · liq/vol …x` | TIDAK BERUBAH |
| R-15 | Kartu link (l.64) | `Trade this` | `Open in arena` |
| R-16 | Kartu CA (l.65) | format `CA xxxx…xxxx` + Solscan | TIDAK BERUBAH |
| R-17 | Kaki (l.72) | `Wenits internal API · GeckoTerminal Solana trending · no CoinGecko, no backend dependency` | TIDAK BERUBAH |

Di luar spec (JANGAN UBAH): `Load 10 more` / `Loading…` skeleton / `End of hype stream — refresh for new pools.` — pack diam, biarkan apa adanya.

### 1.4 `app/arena/page.tsx`

| # | Baris / komponen | String lama | String baru persis |
|---|---|---|---|
| A-01 | H2 (l.82) | `Degen arena` | `Degen Arena` (A kapital) |
| A-02 | Lead (l.83) | `Live Solana hype pools. Pick one, set USD size, hit BUY or SELL. Real pool candles. Dev mode, no login.` | `Pick a live Solana pool, set a USD size, hit Buy or Sell. Real pool candles, fantasy money. Stale prices and double orders are rejected automatically.` |
| A-03 | Mode line (baru, bawah lead) | (tidak ada) | Tambah baris: `Practice mode — no login.` |
| A-04 | Daftar judul (l.87) | `Hype now · page 1` | `Hype now` (hapus `· page 1`) |
| A-05 | Daftar empty (l.88) | `No pools yet — check radar.` | `No pools loaded yet — open the radar.` |
| A-06 | Badge RISKY inline (l.105) | `HIGH RISK — trade blocked` | `HIGH RISK — <reason>. Trading disabled.` (`<reason>` = `riskReason[0]` atau gabungan; lihat §2 catatan) |
| A-07 | Chart loading (l.43) | `Loading real pool chart…` | `Loading live pool chart…` (`real`→`live`) |
| A-08 | Chart error (l.45) | `Chart feed rate-limited.` | `Chart feed is rate-limited.` (tambah `is`) |
| A-09 | Chart retry (l.45) | `Retry chart` | TIDAK BERUBAH |
| A-10 | Label size (l.117) | `Size (USD)` | TIDAK BERUBAH |
| A-11 | Note double-click (l.118) | `double-click safe (idempotency key)` | `Double-click safe — one order per click.` (D kapital, hapus `(idempotency key)`) |
| A-12 | Tombol buy (l.121) | `Buy / long` | `Buy / Long` (L kapital) |
| A-13 | Tombol sell (l.122) | `Sell` | TIDAK BERUBAH |
| A-14 | Hasil sukses (l.70) | `BUY OK @ <price> (<notional> USD)` / `SELL OK @ ...` | TIDAK BERUBAH (format sudah cocok pack) |
| A-15 | Hasil `PRICE_STALE` / `PRICE_UNAVAILABLE` (l.73) | `FAILED: <code> — price feed stale, retry in a minute` | `FAILED: <code> — price feed is stale, retry in a minute.` (tambah `is` + titik) |
| A-16 | Hasil `HIGH_RISK_BLOCKED` (l.73) | `FAILED: HIGH_RISK_BLOCKED — RISKY token blocked by Safety Gate` | `FAILED: HIGH_RISK_BLOCKED — risky token blocked by Safety Gate.` (r kecil + titik) |
| A-17 | Hasil `UNKNOWN_MINT` (l.73) | `FAILED: UNKNOWN_MINT — unknown pool, pick from Hype now list` | `FAILED: UNKNOWN_MINT — unknown pool, pick from the Hype now list.` (tambah `the` + titik) |
| A-18 | Hasil `DB_UNAVAILABLE` (l.73) | `FAILED: DB_UNAVAILABLE — database offline, dev-anon trading paused` | `FAILED: DB_UNAVAILABLE — database offline, trading paused.` (hapus `dev-anon`) |
| A-19 | Hasil network (l.77) | `FAILED: network — api unreachable (<detail>)` | `FAILED: network — API unreachable.` (API kapital, hapus suffix `(...)`) |
| A-20 | Posisi judul (l.126) | `Your positions` | TIDAK BERUBAH |
| A-21 | Posisi empty (l.127) | `No positions yet. Buy one so the leaderboard learns your name.` | `No positions yet — your first buy shows up here.` |

Di luar spec (JANGAN UBAH): `sending…` (l.65), `Waiting for hype feed…` (l.115), `Cash $...` (l.107), `Chart error: ...` teknis (l.36), paragraf `Blocked: ... Pick another pool to trade.` (l.109 — pertahankan sampai Strategy kunci template; badge A-06 yang wajib baru), `More hype on the radar page.` (l.96).

### 1.5 `app/gated/page.tsx`

| # | Mode | String lama | String baru persis |
|---|---|---|---|
| G-01 | OFF tag | `dev mode` | `practice mode` |
| G-02 | OFF H1 | `GATING OFF` | `Practice mode` |
| G-03 | OFF body | `Relaxed mode — enter the arena directly.` (link inline) | `No gate right now — jump straight into the arena.` |
| G-04 | OFF CTA | (link inline `enter the arena directly`) | Tombol/CTA: `Enter the arena` (href `/arena` tetap) |
| G-05 | ON tag | `gated` | TIDAK BERUBAH (dorman, jangan hapus file) |
| G-06 | ON H1 | `FOLLOW FIRST, DEGEN` | `Follow first, degen` |
| G-07 | ON body | `Login worked but you have not followed the creator yet. Follow, then hit re-check.` | `Login worked, but the creator account is not followed yet. Follow it, then hit Re-check.` (koma setelah `worked,`, `it,` setelah `Follow`, R kapital `Re-check`) |
| G-08 | ON tombol | `Follow creator` / `Re-check` | TIDAK BERUBAH |

### 1.6 `app/denied/page.tsx`

| # | Komponen | String lama | String baru persis |
|---|---|---|---|
| D-01 | Tag | `denied` | TIDAK BERUBAH |
| D-02 | H1 | `NOPE. DENIED.` | `Nope. Denied.` |
| D-03 | Body | `You rejected the X permission. Go back, coward.` | `You declined the X permission, so we cannot let you in. Go back and try again.` (`rejected`→`declined`, hapus ejekan `coward`) |
| D-04 | CTA | `Back` (href `/`) | `Back to home` (href `/` tetap) |

### 1.7 `app/roadmap/page.tsx`

| # | Komponen | String lama | String baru persis |
|---|---|---|---|
| M-01 | Tag (l.31) | `Nov 2026 to Jan 2027 · v0.3` | TIDAK BERUBAH |
| M-02 | H2 (l.32) | `Roadmap` | TIDAK BERUBAH |
| M-03 | Lead (l.33) | `Three phases, one product: radar + arena. Reward game = season league. NFT = growth badge, not speculative PFP. $WenFUN stays frozen until January.` | TIDAK BERUBAH |
| M-04 | Kartu fase (l.36-60) | goal/exit/cost/risk/token | TIDAK BERUBAH di spec ini — ikut `docs/product/ROADMAP.md` v0.3 |
| M-05 | Blok rules (l.62-67) | `Phase rules` + isi | TIDAK BERUBAH |
| M-06 | Blok PM follow-ups (l.68-75) | seluruh blok | HAPUS (lihat §2) |
| M-07 | CTA (l.77-78) | `Trade while we ship` / `Scan the hype` | TIDAK BERUBAH |

---

## 2. Daftar hapus

1. **Arena leaderboard.** Hasil cek 2026-11-03: tidak ada komponen leaderboard mandiri di `app/arena/page.tsx`. Satu-satunya sisa kata leaderboard = empty-state posisi (l.127). Aksi: ganti string itu per A-21. Jangan tambah blok leaderboard baru. Spec v0.2 §2/§8 (`ARENA_GMGN_SPEC.md`) larang leaderboard di arena — tetap berlaku.
2. **Roadmap `PM follow-ups`.** Hapus seluruh blok `app/roadmap/page.tsx` l.68-75:
   `<b>PM follow-ups</b>` + 3 `<li>` (PRD per phase, season dates, 3 founder decisions). Blok `Phase rules` (l.62-67) dipertahankan. Tidak ada pengganti.
3. **Cabang ON di home hero** (H-02): hapus kondisional `X login plus follow to enter.` — hero jadi statis karena X nonaktif.
4. **Kata `dev-anon`, `dev mode`, `GATING OFF`, ejekan `coward`**: hapus via G-01/G-02/D-03/A-18. Tidak boleh muncul lagi di UI publik.
5. **Suffix debug network** `(e?.message||'fetch failed')` di pesan network arena: hapus, ganti string penuh per A-19.

Catatan badge A-06: template baru butuh `<reason>` dinamis dari `coin.riskReason`. Bila `riskReason` kosong, tampilkan `HIGH RISK — Trading disabled.` tanpa alasan. Paragraf `Blocked: ...` (l.109) dipertahankan sementara sampai Strategy kunci template kalimatnya — jangan hapus logika `risky` disable tombol.

---

## 3. Larangan (jangan sentuh)

1. Tanpa ubah error code backend: `PRICE_STALE`, `PRICE_UNAVAILABLE`, `HIGH_RISK_BLOCKED`, `UNKNOWN_MINT`, `DB_UNAVAILABLE`, `BAD_INPUT`, `INSUFFICIENT_CASH`, `INSUFFICIENT_QTY`, `BAD_POOL`, `CHART_FAILED`, `duplicate:true`. Hanya teks user setelah `—` yang berubah.
2. Tanpa ubah kontrak API: `GET /api/coins?page=N`, `GET /api/pool?pool=`, `POST /trade` body `mint, side, usd|qty, idempotencyKey`, `GET /trade/portfolio`. Tanpa ubah field `coins[]`, `candles[]`, `positions[]`.
3. Tanpa ubah logika trade: idempotency key, `SELECT ... FOR UPDATE`, cek saldo/qty, `PRICE_STALE_MS=15000`, registry `PAIRS lib/mints.js`. Copy spec ini tidak otorisasi perubahan trade.
4. Tanpa ubah Safety Gate: threshold liq, rasio vol/liq, umur pool, verdict Moon Score v2, status `PASS/RISKY/REJECT`. Badge baru hanya label — ambang tetap ikut `ARENA_GMGN_SPEC.md` v0.2.
5. Tanpa ubah routing X: file X tetap non-route. `gated` mode ON dorman dipertahankan, jangan hapus file. Jangan aktifkan login X.
6. Tanpa ubah fase roadmap/token: `$WenFUN` beku, reward batch1 badge + spotlight. Copy kartu fase ikut `ROADMAP.md` v0.3 — bukan spec ini.
7. Tanpa tambah copy baru di luar tabel §1. String yang pack diam = biarkan. Bila ragu, tahan dan tanya Strategy.

---

## 4. Checklist verifikasi DEV (per file)

Checklist = buka → paste → simpan → render. Centang semua sebelum merge.

- [ ] `app/layout.tsx`: footer tampil `fantasy money, no real value ·`. Nav 5 link + CTA `Enter Arena` benar. Render `/` cek footer 1 baris.
- [ ] `app/page.tsx`: hero sub = H-02 statis (tanpa kondisional X). Stat `TOP 100`, label `fantasy cash per run`. Loading panel = `Scanning live pools…`. CTA = `Full hype radar →`. 01/02/03 desc = H-12/H-13/H-14. CTA bawah = `Start practicing`. Render `/` desktop + mobile, klik kedua CTA.
- [ ] `app/radar/page.tsx`: H2 `Moon Radar`. Lead = R-02 penuh (cek `0–100` en dash, `A high score is not a guarantee.`). Filter ketiga = `Established 7d+`. Helper = R-06 (`=` bukan `means`). Error toast = R-09 (`Feed hiccup`). Empty = R-10. Tag kartu: `Moon Likely`, `Avoid · High Risk`, `New Degen`. Link kartu = `Open in arena`. Render `/radar`, paksa empty filter + error (offline) untuk lihat R-09/R-10.
- [ ] `app/arena/page.tsx`: H2 `Degen Arena`. Lead = A-02 + baris `Practice mode — no login.`. Judul daftar `Hype now` (tanpa page 1). Empty = A-05. Pilih token RISKY: badge = `HIGH RISK — <reason>. Trading disabled.`, tombol Buy/Sell disabled. Chart loading = `Loading live pool chart…`, error = `Chart feed is rate-limited.` + `Retry chart`. Label `Size (USD)`, note = A-11. Tombol `Buy / Long` / `Sell`. Picu tiap error trade, cocokkan A-15 s/d A-19 persis (termasuk titik akhir). Posisi empty = A-21 (tanpa kata leaderboard). Render `/arena`, trade 1 buy + 1 sell kecil, cek double-click hanya 1 order.
- [ ] `app/gated/page.tsx`: mode OFF tampil tag `practice mode`, H1 `Practice mode`, body G-03, CTA `Enter the arena`. Mode ON (via override env) tampil G-06/G-07. Render `/gated` dua mode.
- [ ] `app/denied/page.tsx`: H1 `Nope. Denied.`, body D-03 (tanpa `coward`), CTA `Back to home` → `/`. Render `/denied`.
- [ ] `app/roadmap/page.tsx`: blok `PM follow-ups` hilang total (cari `PM follow-ups` = 0 hasil). `Phase rules` masih ada. CTA dua tombol tetap. Render `/roadmap`.
- [ ] Global: grep `coward`, `dev-anon`, `dev mode`, `GATING OFF`, `Tuning the screen`, `Never FOMO blind`, `Send it now`, `Trade this`, `Moon radar`, `Degen arena`, `Buy / long`, `idempotency key)`, `leaderboard learns your name`, `PM follow-ups` di `apps/web/app/` = 0 hasil (kecuali komentar kode yang memang disengaja — hapus lebih baik).
- [ ] Global: grep `HIGH RISK`, `fantasy money`, `not financial advice`, `Refresh now`, `Practice mode` tampil di tempat yang tabel tentukan.

---

## 5. Kriteria done + risiko bila string meleset

Done bila:
1. File ini + `UI_WORDING_PACK.md` v0.2 jadi satu-satunya acuan copy; semua baris §1 berstatus paste/verifikasi.
2. Checklist §4 semua centang + bukti render 7 rute (`/`, `/radar`, `/arena`, `/gated`, `/denied`, `/roadmap`, footer layout).
3. Grep larangan §3 bersih: 0 error code berubah, 0 kontrak API berubah, 0 threshold Safety Gate berubah (bukti diff hanya sentuh string).
4. Blok §2 hilang: `PM follow-ups` 0 hasil, kata `leaderboard` 0 hasil di `apps/web/app/arena/`.

Risiko bila string meleset:
- Klausa `fantasy money` / `no real money` hilang → user kira uang asli. Risiko legal + komplain refund.
- `A high score is not a guarantee` hilang → user anggap skor = jaminan. Risiko FOMO, rug blame ke Wenits.
- `HIGH RISK` / `Trading disabled` salah kapital atau alasan kosong → user paksa trade token RISKY. Risiko loss + Safety Gate dicap pajangan.
- `Double-click safe — one order per click` hilang → user double-klik, kira double order. Risiko support ticket + sengketa saldo paper.
- Ejekan (`coward`, `Never FOMO blind`) lolos → citra produk kasar. Risiko screenshot viral.
- `Established 7d+` / filter helper salah → user salah baca risiko fresh vs established. Risiko trade buta di pool baru.

---

## Keputusan pending (butuh Strategy, bukan DEV)

1. Template paragraf `Blocked: <reasons>... Pick another pool to trade.` (arena l.109) belum dikunci pack — badge A-06 saja yang lock. Opsi: (a) biarkan l.109 apa adanya, (b) selaraskan ke `HIGH RISK — <reason>. Trading disabled. Pick another pool to trade.` Minta satu kalimat final.
2. `ARENA_GMGN_SPEC.md` §6 tulis "DEV tentukan string final" untuk `HIGH_RISK_BLOCKED` — pack v0.2 sudah kunci `FAILED: HIGH_RISK_BLOCKED — risky token blocked by Safety Gate.` Konfirmasi pack menang atas §6.
3. String transient `sending…`, `Waiting for hype feed…`, `Connecting to live hype…`, `Market unreachable — retrying.`, `Load 10 more`, `End of hype stream…` pack diam. Konfirmasi biarkan (rekomendasi PM-1: biarkan).
4. Kartu fase roadmap ikut `ROADMAP.md` v0.3 — PM-1 tidak verifikasi ulang isi fase di spec ini. Konfirmasi tidak ada drift antara roadmap page vs ROADMAP.md.
5. Gated OFF tampil sebagai tombol penuh vs link inline — struktur tombol diserah ke DEV, copy CTA lock `Enter the arena`.

---

## Addendum A — Roadmap redesign + copy lock v0.3.1 (2026-11-03)

Status: ADDENDUM LOCK | Owner: PM-1 → DEV | Scope: `app/roadmap/page.tsx` + `app/globals.css` (roadmap section only)
TypeUI: cosmic + dithered (tokens `apps/web/app/tokens.css`, type Audiowide/Manrope/JetBrains Mono, accents `#22d3ee`/`#e879f9`); fundamentals: hierarchy, proximity, 44px touch target, `prefers-reduced-motion`, progressbar naming.
Founder input: roadmap frontend messy, not intuitive, not attractive. Scope redesign = layout / hierarchy / progress / exit-gate / mobile only. Phase content, token freeze, error codes: no change.

### A.1 Copy lock (no drift)

- Tag, H2, lead: no change. `Nov 2026 to Jan 2027 · v0.3` · `Roadmap` · `Three phases, one product: radar + arena. Reward game = season league. NFT = growth badge, not speculative PFP. $WenFUN stays frozen until January.`
- `PHASES` array (goal / scope / exit / cost / risk / token): no change, ikut `docs/product/ROADMAP.md` v0.3.
- `RULES` array (Phase rules): no change.
- CTAs: no change. `Trade while we ship` (`/arena`), `Scan the hype` (`/radar`).
- Progress values: no change (01 `80%`, 02 `15%`, 03 `5%`). No invented metrics.
- `Blocked` paragraph stays (arena): `HIGH RISK — <reasons>. Trading disabled. Pick another pool to trade.` — Buy/Sell disabled on RISKY/REJECT per `ARENA_GMGN_SPEC.md` §6 + AC2. Pack copy wins for `HIGH_RISK_BLOCKED` string (§6 wording superseded).
- Transient strings stay: `sending…`, `Waiting for hype feed…`, `Connecting to live hype…`, `Market unreachable — retrying.`, `Load 10 more`, `End of hype stream…` — pack diam, biarkan.

### A.2 Layout / hierarchy (what changed, why)

1. Status strip: `.well` gets `role='status'`. Reason: screen reader announces current phase without entering timeline. Copy inside strip reuses M-02–M-04 strings only, no new claims.
2. Single vertical timeline: rail line + node dots (mint = live, cyan = next, paper-3 = queued). Reason: founder "messy" = prior auto-fit grid read as three equal cards with no order. Timeline shows sequence 01→02→03 at a glance. Mobile keeps same DOM order.
3. Progress label: `Progress` → `Progress · Phase {n}`. Reason: prior label ambiguous on small screens which bar belongs to which phase.
4. Exit gate: disclosure `<button aria-expanded + aria-controls>` → `<div id='rm-exit-{n}'>`. Underline accent on toggle (affordance), 44px min-height touch target. Reason: prior toggle looked like plain text; exit-gate content (acceptance criteria) is the hierarchy's second level and must be keyboard-discoverable.
5. Motion cut: removed `rm-orbit` ring + `rm-gate-now` pulse from live card and `globals.css`. Kept: `rm-reveal` stagger + `rm-progress` sweep + reduced-motion guard. Reason: orbit/pulse added noise, conveyed no state; node dot + `Live now` badge already signal current phase. Accessibility wins over decoration (fundamentals conflict rule).
6. Overflow: live card `overflow:visible` → default clip. Reason: orbit ring overflow caused horizontal scroll on 360px viewports.

### A.3 Tokens used (no new tokens)

- Rail gradient: `var(--color-accent)` → `var(--color-accent-2)` → `var(--color-rule)`.
- Node: `var(--color-mint)` live / `var(--color-accent)` next / `var(--color-paper-3)` queued, border `var(--color-rule)`.
- Meter fill: live = animated accent sweep; others `var(--color-accent-2)` / `var(--color-accent)` by pct.
- Toggle underline: `var(--color-accent-2)`. Spacing: grid `gap:16`, card padding `22` desktop / `16` mobile (existing scale).

### A.4 Mobile (≤40rem)

- Timeline indent `padding-left:28px`, node `left:-24px`, card padding `16px`.
- CTA row stacks: `.rm-cta{flex-direction:column;align-items:stretch}`, links full-width, `min-height:44px`.
- No horizontal scroll: rail + nodes inside padding budget; card overflow clipped.

### A.5 DEV verify (roadmap only, appends §4)

- [ ] `/roadmap` desktop: tag/H2/lead/CTAs byte-identical to M-01–M-03/M-07; status strip shows `Phase 01 · Radar + Arena lock — 80%`.
- [ ] Timeline: 3 nodes in order, live node mint glow; rail visible; cards stagger in.
- [ ] Progress bars: `80/15/5%`, `role=progressbar` + `aria-valuenow` correct, label `Phase {n} progress`.
- [ ] Toggle: keyboard focus visible, `aria-expanded` flips, `aria-controls` targets `rm-exit-{n}`; min touch height 44px.
- [ ] Mobile 360px: no horizontal scroll, nodes aligned to rail, CTAs stacked full-width.
- [ ] `prefers-reduced-motion`: reveal + sweep static, content fully visible.
- [ ] Grep `rm-orbit|rm-gate-now` in `app/roadmap/` = 0 hasil; `PHASES`/`RULES`/copy strings untouched (diff layout only).
- [ ] No screenshots from localhost used as evidence; no metrics invented.
