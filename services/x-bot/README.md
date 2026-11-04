# Bot X Wenits.fun — posting + komentar otomatis

Bot ini kerja 3 hal:
1. Posting sendiri tiap 2 jam (berita crypto + promo wenits.fun).
2. Komentar otomatis di postingan orang yang bahas memecoin Solana.
3. Balas otomatis kalau ada yang mention akun kamu.

## Cara pasang (5 langkah)

1. Buka https://developer.x.com, buat App baru.
2. Di App settings, nyalakan **OAuth 2.0**, tipe **Web App**, isi Callback URL bebas (misal https://wenits.fun/callback).
3. Ambil 2 token:
   - **Bearer Token** (di tab Keys and Tokens) → untuk cari postingan.
   - **Access Token user** (OAuth2, centang Read + Write) → untuk posting dan komentar. Token ini milik akun X yang mau jadi bot.
4. Salin file contoh jadi file asli, lalu isi token:
   ```
   cd services/x-bot
   cp .env.example .env
   ```
   Buka `.env`, isi `X_BEARER_TOKEN` dan `X_USER_ACCESS_TOKEN`.
5. Tes kering dulu (tidak posting beneran):
   ```
   npm install
   npm run dry
   ```
   Kalau keluar tulisan `DRY post:` dan `DRY comment`, berarti jalan. Lalu hidupkan beneran:
   ```
   npm run bot
   ```

## Atur jadwal dan batas

Buka file `.env`, ubah angka ini:
- `POST_INTERVAL_MIN=120` → posting tiap 120 menit.
- `COMMENT_INTERVAL_MIN=60` → jeda antar komentar 60 menit.
- `MAX_POST_DAY=6` → maksimal 6 postingan sehari.
- `MAX_COMMENT_DAY=15` → maksimal 15 komentar sehari.
- `COMMENT_KEYWORDS` → kata kunci postingan orang yang dikomentari. Pisahkan pakai koma.
- `PROMO_URL` → link situs kamu (wenits.fun).

## Catatan penting

- Akun X baru jangan agresif. Batas kecil di atas sudah aman. Naikkan pelan-pelan setelah 2 minggu.
- Bot simpan riwayat di folder `data/state.json` biar tidak posting dobel. Hapus file itu kalau mau reset.
- Kalau error `X_API_401`, token salah atau kedaluwarsa — buat token baru.
- Kalau error `X_RATE_LIMIT`, limit X habis — bot otomatis berhenti sendiri, jalan lagi besok. Kecilkan `MAX_*` kalau sering kena.
