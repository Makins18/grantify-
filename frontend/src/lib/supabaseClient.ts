import { createClient } from '@supabase/supabase-js';

// Fallback to a safe placeholder so the app doesn't crash at module-load
// when env vars aren't set yet. Replace with real values in .env.local.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
