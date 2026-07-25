import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client (for API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client (for browser usage with anon key)
export const supabaseClient = createClient(
  supabaseUrl,
  // Use the same service key for MVP - in production, use anon key + RLS
  supabaseServiceKey
);

export default supabaseAdmin;
