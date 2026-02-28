import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

// Use service_role key — bypasses RLS so the backend can read/write all tables.
// Frontend never sees this key; all access is gated by backend auth middleware.
export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
