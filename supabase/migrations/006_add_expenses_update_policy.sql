-- Meridian: allow closing settlement rounds
-- Run this in Supabase Dashboard → SQL Editor
-- expenses lacked an UPDATE policy, so markCircleExpensesSettled
-- silently matched 0 rows (balances never reset after settling).

CREATE POLICY "allow_update_expenses"
  ON expenses FOR UPDATE
  USING (true)
  WITH CHECK (true);