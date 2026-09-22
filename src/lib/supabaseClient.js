import { createClient } from '@supabase/supabase-js';

// ── Fill these in ──────────────────────────────────────────────
// Find both in your Supabase project: Settings → API
//   Project URL      → looks like https://xxxxxxxxxxxx.supabase.co
//   anon public key  → a long string labeled "anon" "public"
// The anon key is SAFE to have here, even though this file ends up
// in your public site's code. It is designed to be public; real
// security comes from Supabase's Row Level Security rules, not from
// hiding this key.
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'PASTE_YOUR_ANON_PUBLIC_KEY_HERE';
// ────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
