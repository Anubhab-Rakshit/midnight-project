-- Meridian tables + RLS
-- Run this in Supabase Dashboard → SQL Editor

-- Circles: each row is a circle the user created or joined
CREATE TABLE IF NOT EXISTS circles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  circle_name TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  invite_secret TEXT NOT NULL,
  tx_hash TEXT,
  block_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_circles_wallet
  ON circles(wallet_address);

CREATE INDEX IF NOT EXISTS idx_circles_contract
  ON circles(contract_address);

-- Expenses: each row is a committed expense in a circle
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  circle_address TEXT NOT NULL,
  expense_label TEXT NOT NULL,
  commitment_hash TEXT NOT NULL,
  tx_hash TEXT,
  block_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_circle
  ON expenses(circle_address);

-- Settlements: each row is a completed settlement round
CREATE TABLE IF NOT EXISTS settlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_address TEXT NOT NULL,
  transfer_count INTEGER NOT NULL,
  tx_hash TEXT,
  block_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settlements_circle
  ON settlements(circle_address);

-- Row Level Security
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_circles"
  ON circles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_circles"
  ON circles FOR SELECT
  USING (true);

CREATE POLICY "allow_insert_expenses"
  ON expenses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_expenses"
  ON expenses FOR SELECT
  USING (true);

CREATE POLICY "allow_insert_settlements"
  ON settlements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_settlements"
  ON settlements FOR SELECT
  USING (true);
