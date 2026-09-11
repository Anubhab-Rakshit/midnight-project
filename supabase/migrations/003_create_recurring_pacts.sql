-- Recurring pacts: scheduled circles that auto-net on a cadence
-- Run this in Supabase Dashboard → SQL Editor

-- Recurring pacts: a circle that repeats on a schedule
CREATE TABLE IF NOT EXISTS recurring_pacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  circle_address TEXT NOT NULL,
  pact_name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  day_of_month INTEGER CHECK (day_of_month BETWEEN 1 AND 31),
  is_active BOOLEAN DEFAULT true,
  last_settled_at TIMESTAMPTZ,
  next_settlement_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pacts_wallet
  ON recurring_pacts(wallet_address);

CREATE INDEX IF NOT EXISTS idx_pacts_circle
  ON recurring_pacts(circle_address);

CREATE INDEX IF NOT EXISTS idx_pacts_next_settlement
  ON recurring_pacts(next_settlement_at)
  WHERE is_active = true;

-- Pact members: who participates in each recurring pact
CREATE TABLE IF NOT EXISTS pact_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pact_id UUID NOT NULL REFERENCES recurring_pacts(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  member_name TEXT NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pact_id, wallet_address)
);

CREATE INDEX IF NOT EXISTS idx_pact_members_pact
  ON pact_members(pact_id);

-- Row Level Security
ALTER TABLE recurring_pacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pact_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_pacts"
  ON recurring_pacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_pacts"
  ON recurring_pacts FOR SELECT
  USING (true);

CREATE POLICY "allow_update_pacts"
  ON recurring_pacts FOR UPDATE
  USING (true);

CREATE POLICY "allow_insert_pact_members"
  ON pact_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_pact_members"
  ON pact_members FOR SELECT
  USING (true);

CREATE POLICY "allow_delete_pact_members"
  ON pact_members FOR DELETE
  USING (true);
