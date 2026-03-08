// Jalur File: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client ini ringan dan bisa dipakai di Frontend maupun API Route (Backend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);