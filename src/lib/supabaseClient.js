import { createClient } from '@supabase/supabase-js';

// ── Fill these in ──────────────────────────────────────────────
// Find both in your Supabase project: Settings → API
//   Project URL      → looks like https://xxxxxxxxxxxx.supabase.co
//   anon public key  → a long string labeled "anon" "public"
// The anon key is SAFE to have here, even though this file ends up
// in your public site's code. It is designed to be public; real
// security comes from Supabase's Row Level Security rules, not from
// hiding this key.
const SUPABASE_URL = 'https://ihxourpiqsrkksyplvyy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloeG91cnBpcXNya2tzeXBsdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNjI0MDgsImV4cCI6MjEwNTYzODQwOH0.zYhgR3QO48HH_zrM5bLNfnKlPzMGGjP0yNYk5_y0RCs';
// ────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
