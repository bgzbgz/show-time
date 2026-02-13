import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lutzzfaedkbsmbobmrzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dHp6ZmFlZGtic21ib2Jtcnp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDA0MDQsImV4cCI6MjA4NjM3NjQwNH0.o2gJba85vDl4NLS-C8Mq3OudWKxet-b0IqO9kazqb8U';

export const supabase = createClient(supabaseUrl, supabaseKey);
