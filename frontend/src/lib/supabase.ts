/**
 * Supabase Client Configuration
 *
 * Uses the publishable/anon key. Safe for client-side use.
 * Database access is guarded by Row Level Security (RLS).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('[Supabase] Missing env vars VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
