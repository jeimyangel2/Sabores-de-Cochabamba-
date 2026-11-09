import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log('[Supabase Server] Cliente inicializado correctamente para URL:', supabaseUrl);
  } catch (err) {
    console.warn('[Supabase Server] Error al inicializar cliente Supabase:', err);
  }
} else {
  console.log('[Supabase Server Info] Variables SUPABASE_URL / SUPABASE_KEY no detectadas en .env. Se usará modo persistente en disco/local.');
}

export function getSupabaseClient(): SupabaseClient | null {
  return supabase;
}

export function isSupabaseConfigured(): boolean {
  return !!supabase;
}
