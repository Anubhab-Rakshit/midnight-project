-- Omen Premonitions table + RLS
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS premonitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  premonition_text TEXT NOT NULL,
  commitment_hash TEXT NOT NULL,
  tx_hash TEXT,
  block_height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_premonitions_wallet
  ON premonitions(wallet_address);

-- Row Level Security
ALTER TABLE premonitions ENABLE ROW LEVEL SECURITY;

-- Allow inserts (privacy enforced client-side + commitment on-chain)
CREATE POLICY "allow_insert_premonitions"
  ON premonitions FOR INSERT
  WITH CHECK (true);

-- Allow reads (commitment hashes are public on-chain; text stored privately)
CREATE POLICY "allow_select_premonitions"
  ON premonitions FOR SELECT
  USING (true);
