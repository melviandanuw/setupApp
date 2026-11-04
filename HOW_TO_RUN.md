# Cara Menjalankan Wenits.fun di Laptop Kamu

Halo! Ini panduan paling gampang buat nyalain Wenits.fun di komputer sendiri. Ikutin aja urut dari atas ke bawah, kayak masak mie instan. Semua perintah di bawah ini udah dites dan jalan.

## Kamu butuh apa dulu

Sebelum mulai, pastiin ini udah kepasang:

- Node.js versi 20 ke atas
- Python versi 3.11 ke atas
- PostgreSQL versi 18 (udah kepasang otomatis)
- Redis versi 3 (udah kepasang otomatis)

Buat ngecek udah kepasang atau belum, buka terminal baru (CMD atau PowerShell) terus jalanin ini:

```bash
node -v && python --version && psql --version && redis-cli ping
```

Hasil yang bener kayak gini:

```
v24.22.0
Python 3.14.9
psql (PostgreSQL) 18.6
PONG
```

Kalau `psql` masih dibilang "not recognized", tutup terminalnya terus buka lagi yang baru. PATH-nya udah dibenerin, cuma terminal lama aja yang masih pakai PATH basi.

## Cara cepat (disarankan)

Nggak perlu buka 3 terminal manual lagi. Sekarang ada launcher kayak project aether.

**Di Git Bash:**

```bash
bash scripts/start-dev.sh
```

**Di Windows (klik 2x):**

```
start-dev.bat
```

Script ini nyalain backend (:8080) + web (:3000) sekaligus, tulis log ke `logs/`, terus cek health otomatis. Kalau berhasil kamu lihat:

```
api : 200 -> http://127.0.0.1:8080/health
web : 200 -> http://localhost:3000
```

Buat matiin semuanya:

```bash
bash scripts/stop-dev.sh
```

atau klik `stop-dev.bat`.

Buat cek sehat apa enggak kapan aja:

```bash
bash scripts/healthcheck.sh
```

## Mode login X: ON atau OFF

Ada saklar baru namanya `X_LOGIN_REQUIRED` di `services/api/.env`.

- **Mode santai (development):** `X_LOGIN_REQUIRED=false`. Login X mati total. Kamu langsung bisa buka `/arena` dan coba buy/sell tanpa login. Endpoint `/auth/x/*` bales `X_LOGIN_DISABLED`. Ini default-nya sekarang.
- **Mode produksi:** `X_LOGIN_REQUIRED=true`. Login X wajib, follow wajib, baru bisa masuk arena. Buat nyalain ini kamu harus isi `X_CLIENT_ID`, `X_CLIENT_SECRET`, dan `CREATOR_X_USER_ID` dulu.

Ganti nilainya terus restart backend (`stop-dev` lalu `start-dev` lagi).

Web juga baca saklar yang sama lewat `apps/web/.env.local`:

```
NEXT_PUBLIC_X_LOGIN_REQUIRED=false
```

Samain sama backend biar tombol Login muncul/hilang dengan bener.

## Langkah 1: Daftarin aplikasi ke X (cuma kalau mau mode produksi)

Kalau masih mode santai, lewatin bagian ini.

1. Masuk ke X Developer Portal, bikin App baru, nyalain **OAuth 2.0**.
2. Buka tab **Settings** (bukan Keys & Tokens), cari **User authentication settings**, klik Set up / Edit.
3. Nyalakan OAuth 2.0, Type: Web App.
4. Isi Callback URI. Portal X izinin banyak baris, isi dua-duanya:
   - `http://localhost:8080/auth/x/callback` (buat dev)
   - `https://wenits.fun/auth/x/callback` (buat produksi nanti)
5. Website URL isi `https://wenits.fun`.
6. Centang scope: `users.read follows.read offline.access`.
7. Save. `Client ID` + `Client Secret` muncul di tab Keys and Tokens.

## Langkah 2: Isi file pengaturan (.env)

File contohnya udah ada, tinggal copy aja:

```bash
cd D:/Project/Wenits.fun
cp services/api/.env.example services/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Terus buka file `services/api/.env`, isi kayak gini:

```
PORT=8080
DATABASE_URL=postgres://wenits:wenits@localhost:5432/wenits
REDIS_URL=redis://localhost:6379
JWT_SECRET=<isi-teks-acak-minimal-32-karakter>
TOKEN_ENC_KEY=<isi-64-huruf-hex>
X_LOGIN_REQUIRED=false
X_CLIENT_ID=<dari-portal-X, kosongin aja kalau mode santai>
X_CLIENT_SECRET=<dari-portal-X, kosongin aja kalau mode santai>
X_REDIRECT_URI=http://localhost:8080/auth/x/callback
CREATOR_X_USER_ID=<angka-id-akun-kamu>
FRONTEND_URL=http://localhost:3000
PRICE_STALE_MS=15000
```

Buat bikin teks acak yang aman, jalanin ini terus copy hasilnya:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Catatan database: proyek ini belum pakai database beneran buat trading-nya (masih mock di test). `DATABASE_URL` di atas buat nanti pas schema-nya udah di-apply. Backend + web jalan normal tanpa Postgres nyala.

## Langkah 3: Jalanin semuanya

```bash
cd D:/Project/Wenits.fun
bash scripts/start-dev.sh
```

Terus buka di browser:

- Web: `http://localhost:3000`
- Arena: `http://localhost:3000/arena`
- Health API: `http://127.0.0.1:8080/health` (harusnya `{"ok":true}`)
- Logo: `http://localhost:3000/logo/Wenitsfun_logo_landscape_w.png`

Log ada di `logs/api.log` dan `logs/web.log` kalau ada yang aneh.

## Cara ngetesnya gampang

**Mode santai (sekarang):**

1. Buka `http://localhost:3000`, klik Masuk Degen Arena.
2. Coba beli/jual koin pura-pura. Tanpa login harusnya langsung bisa.
3. Coba klik beli dua kali cepat-cepat pakai kode yang sama. Yang kedua harusnya bales `{"duplicate":true}`. Berarti anti double-bayarnya jalan.

**Mode produksi (`X_LOGIN_REQUIRED=true`):**

1. Buka `http://localhost:3000`, klik Login X.
2. Kalau kamu klik Tolak di X, kamu dilempar ke `/denied`. Itu normal.
3. Kalau login tapi belum follow akun kreator, masuk ke `/gated`. Klik Follow, terus Re-check.
4. Kalau udah follow, masuk ke `/arena`.
5. Kalau unfollow lagi, akses dikunci `FOLLOW_REQUIRED` dalam 30 menit.

## AI scraper (opsional)

Nggak wajib buat web jalan. Kalau mau nyalain analisa sentimen:

```bash
cd D:/Project/Wenits.fun/services/ai-scraper
pip install -r requirements.txt
python scraper.py
```

Jangan lupa isi dulu `OPENROUTER_API_KEY` sebelum jalanin. Atau sekalian lewat launcher:

```bash
WITH_SCRAPER=1 bash scripts/start-dev.sh
```

## Kalau ada yang error

Santai, ini yang paling sering kejadian:

- `psql not recognized`: terminal masih pakai PATH lama. Tutup, buka terminal baru.
- `BAD_STATE`: kelamaan di halaman login X (lebih dari 10 menit). Ulangi login dari awal.
- `TOKEN_EXCHANGE_FAILED`: Client Secret atau Callback URL salah ketik. Samain sama portal X. Ingat redirect_uri harus persis sama.
- `X_LOGIN_DISABLED` (404): wajar, artinya saklar lagi OFF. Mau login beneran? Set `true` + isi kredensial X.
- `PRICE_STALE` atau `PRICE_UNAVAILABLE`: harga di Redis kosong. Jalanin pemberi harga / scraper.
- `FOLLOW_REQUIRED` terus: beneran belum follow, atau cache belum refresh. Tunggu 5 menit, klik Re-check.
- `TOKEN_ENC_KEY_MISSING`: lupa isi `TOKEN_ENC_KEY` di `.env`. Bikin pakai perintah random tadi, restart backend.
- Port udah dipakai: launcher bilang `already`. Mau instance fresh? `bash scripts/stop-dev.sh` dulu baru start lagi.

Udah itu aja. Satu perintah `bash scripts/start-dev.sh`, buka `http://localhost:3000`, Wenits.fun kamu hidup.
