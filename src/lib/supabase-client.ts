import { createBrowserClient } from '@supabase/ssr';

let supabaseUrl: string | undefined;
let supabaseAnonKey: string | undefined;

try {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
} catch {
  // Environment variables not available
}

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      throw new Error(
        'Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      );
    }
    throw new Error('Server-side Supabase client cannot be created without environment variables.');
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
