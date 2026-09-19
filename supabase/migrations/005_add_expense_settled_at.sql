-- Meridian: close settlement rounds
-- Run this in Supabase Dashboard → SQL Editor
-- Adds:
--   - expenses.settled_at        → when the expense's round was settled (NULL = still open)
--   - settlements.settlement_hash → the on-chain plan hash committed for the round

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS settled_at TIMESTAMPTZ;

ALTER TABLE settlements ADD COLUMN IF NOT EXISTS settlement_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_expenses_circle_unsettled
  ON expenses(circle_address, settled_at);