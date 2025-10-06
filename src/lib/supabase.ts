import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { Cookies } from '@sveltejs/kit';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export const createSupabaseServerClient = (cookies: Cookies) => {
  return createServerClient(
    "https://lvwzvhzsfphyhswahgot.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2d3p2aHpzZnBoeWhzd2FoZ290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NzA3MzAsImV4cCI6MjA3MjQ0NjczMH0.JX5Y0xDjmWKet1G8D-CeL0o5cVh2dFZx7uBb30ltA5M",
    {
      cookies: {
        get(name) {
          return cookies.get(name)
        },
        set(name, value, options) {
          cookies.set(name, value, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            ...options
          })
        },
        remove(name, options) {
          cookies.delete(name, { path: '/', ...options })
        }
      }
    }
  )
}