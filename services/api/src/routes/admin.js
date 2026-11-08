// One-shot DB bootstrap for Railway (no TCP proxy on trial).
// POST /admin/migrate + header x-admin-token = PAYOUT_ADMIN_TOKEN.
// Runs db/schema.sql + db/migrate-payouts.sql equivalent inline (rootDir=services/api has no db/ folder).
// Safe to call repeatedly (IF NOT EXISTS / ON CONFLICT).
const ex = require('express');
const R = ex.Router();
const SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x_user_id TEXT UNIQUE NOT NULL,
  x_username TEXT NOT NULL,
  x_access_token_enc TEXT NOT NULL,
  x_refresh_token_enc TEXT,
  is_gated BOOLEAN NOT NULL DEFAULT TRUE,
  last_follow_check TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS portfolios (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cash_usd NUMERIC(18,2) NOT NULL DEFAULT 10000.00 CHECK (cash_usd >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS positions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mint TEXT NOT NULL,
  qty NUMERIC(30,8) NOT NULL DEFAULT 0 CHECK (qty >= 0),
  avg_entry NUMERIC(30,8) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mint)
);
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mint TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy','sell')),
  qty NUMERIC(30,8) NOT NULL CHECK (qty > 0),
  price_usd NUMERIC(30,8) NOT NULL CHECK (price_usd > 0),
  notional_usd NUMERIC(18,2) NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_trades_user_time ON trades(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS leaderboard_weeks (
  week_id TEXT PRIMARY KEY,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  week_id TEXT NOT NULL REFERENCES leaderboard_weeks(week_id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equity_usd NUMERIC(18,2) NOT NULL,
  rank INT,
  PRIMARY KEY (week_id, user_id)
);
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_usd NUMERIC(18,2) NOT NULL CHECK (amount_usd > 0),
  token_mint TEXT NOT NULL,
  transfer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'prepared' CHECK (status IN ('prepared','processing','settled','failed')),
  tx_sig TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (week_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_payouts_week ON payouts(week_id);
CREATE INDEX IF NOT EXISTS idx_payouts_transfer ON payouts(transfer_id);
-- dev-anon seed (X_LOGIN_REQUIRED=false mode): paper trading identity.
INSERT INTO users (id, x_user_id, x_username, x_access_token_enc, is_gated)
VALUES ('00000000-0000-0000-0000-000000000001', 'dev-anon', 'dev-anon', 'dev', false)
ON CONFLICT (x_user_id) DO NOTHING;
INSERT INTO portfolios (user_id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
`;
const DEV_ANON = '00000000-0000-0000-0000-000000000001';
R.post('/migrate', async (req, res) => {
  const want = String(process.env.PAYOUT_ADMIN_TOKEN || '');
  if (!want || req.headers['x-admin-token'] !== want) return res.status(401).json({ error: 'ADMIN_ONLY' });
  try {
    const { pool } = require('../lib/db');
    await pool.query(SQL);
    const t = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY 1`);
    res.json({ ok: true, tables: t.rows.map(r => r.table_name) });
  } catch (e) { res.status(500).json({ error: 'MIGRATE_FAILED', detail: e.message }); }
});
module.exports = R;
