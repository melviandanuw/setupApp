# SECURITY REQUIREMENTS — Wenits.fun
Status: Draft v0.1 | Date: 2026-11-01 | Source: SECURITY.md + code

## 1. Implemented (verified)
- OAuth: state 128-bit + httpOnly + Redis TTL + one-time del, PKCE S256.
- Session: JWT 12h httpOnly SameSite=lax. No LocalStorage.
- Secrets: AES-256-GCM X tokens, never to client. `TOKEN_ENC_KEY` 64-hex. Missing key fails clean.
- Input: zod validation, pg parameter binding (no concat), 50kb body cap, helmet headers.
- Network: fetch timeouts 8-12s, X allowlist via fixed hosts, price staleness 15s blocks trade.
- Abuse: rate-limit auth 20/m, trade 10/10s, market 30/m. Follow cache 5m + sweep 30m, fail-closed. Idempotency UNIQUE + FOR UPDATE txn.
- Tests: security.test.js (headers, cap, rate-limit, no leak). crypto.test.js (roundtrip, IV, tamper, PKCE).

## 2. Required (MVP close)
- R1: Price writer auth (only trusted writer can set `px:*`). Else price spoof → unfair fills.
- R2: Mint allowlist for trade. Reject unknown mints (currently length check only).
- R3: `dev-anon` isolation: no shared portfolio, no cross-user reads. Decision D3.
- R4: Leaderboard write auth + rank recompute in txn.
- R5: X token refresh flow (refresh_token stored but never used — expiry handling missing).
- R6: Secrets audit: `.env` real file exists in `services/api/` — ensure gitignored, rotate JWT if exposed.
- R7: CORS/cookie `secure` in prod, `NEXT_PUBLIC_API_URL` allowlist.

## 3. Web3 (future, none live)
Wallet sig verify, tx validation, replay protection, access control, reentrancy, precision, oracle/MEV, treasury multisig, upgrade authority — required before any swap/staking/token.

## 4. Residual risks
- DexScreener/GeckoTerminal spoof → moon score manipulation (display only, no trade pricing — contained).
- X API outage → fail-closed denies entry (availability tradeoff accepted).
- No WAF, no SIEM, no audit log table. Recommend `audit_log` before rewards.

## 5. Verification
`npx jest --runInBand` in `services/api`. Manual: double idempotencyKey, stale price, unfollow sweep. Never claim secure — claim mitigated + verified.

## Version history
- v0.1 2026-11-01: Draft from SECURITY.md + code.
