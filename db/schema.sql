-- Wenits.fun schema (PostgreSQL 15+)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x_user_id TEXT UNIQUE NOT NULL,
  x_username TEXT NOT NULL,
  x_access_token_enc TEXT NOT NULL,
  x_refresh_token_enc TEXT,
  is_gated BOOLEAN NOT NULL DEFAULT TRUE,
  last_follow_check TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE portfolios (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  cash_usd NUMERIC(18,2) NOT NULL DEFAULT 10000.00 CHECK (cash_usd >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE positions (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mint TEXT NOT NULL,
  qty NUMERIC(30,8) NOT NULL DEFAULT 0 CHECK (qty >= 0),
  avg_entry NUMERIC(30,8) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mint)
);
CREATE TABLE trades (
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
CREATE INDEX idx_trades_user_time ON trades(user_id, created_at DESC);
CREATE TABLE leaderboard_weeks (
  week_id TEXT PRIMARY KEY,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL
);
CREATE TABLE leaderboard_entries (
  week_id TEXT NOT NULL REFERENCES leaderboard_weeks(week_id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equity_usd NUMERIC(18,2) NOT NULL,
  rank INT,
  PRIMARY KEY (week_id, user_id)
);
