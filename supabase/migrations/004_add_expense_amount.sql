-- Add amount and expense_type to expenses table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS amount NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS expense_type TEXT NOT NULL DEFAULT 'equal';
