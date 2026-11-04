# Audit Wenits.fun
1. CSRF OAuth: state random 128-bit + cookie httpOnly + Redis TTL 10 mnt + one-time del. PKCE S256 wajib.
2. Token: JWT 12 jam httpOnly Secure SameSite=lax. X token AES-256-GCM di DB, tak pernah ke client. Tanpa LocalStorage.
3. OWASP: zod validasi, pg parameter binding (tanpa string concat), helmet header, rate-limit auth 20/mnt trade 10/10dtk, fetch timeout 8-10dtk cegah SSRF (hanya host api.x.com allowlist), price staleness 15dtk tolak trade saat delay.
4. Logic abuse: follow cache 5 mnt, re-check tiap request gated + job 30 mnt sweep, fail-closed (X error = tetap gated). Unfollow -> is_gated=1.
5. Double-spend: idempotency_key UNIQUE + SELECT FOR UPDATE + transaksi. Klik ganda = duplicate:true.
QA: tolak izin X -> /denied. Login belum follow -> /gated. Follow -> /arena. Race: kirim sama idempotencyKey 2x paralel, expect 1 row.
