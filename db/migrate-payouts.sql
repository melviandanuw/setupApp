-- Payout rail: weekly arena winners paid via MultiHopper.
-- No user funds: source = PAYOUT_TREASURY_WALLET only. Audit: every row links week + user + transfer.
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
