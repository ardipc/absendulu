// import { createServerClient } from '@supabase/ssr'
import type { LayoutServerLoad } from './$types'
// import { error } from '@sveltejs/kit';

// const VITE_SUPABASE_URL         = "https://lvwzvhzsfphyhswahgot.supabase.co";
// const VITE_SUPABASE_ANON_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2d3p2aHpzZnBoeWhzd2FoZ290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NzA3MzAsImV4cCI6MjA3MjQ0NjczMH0.JX5Y0xDjmWKet1G8D-CeL0o5cVh2dFZx7uBb30ltA5M";

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
// export const load: LayoutServerLoad = async ({ fetch, cookies, request }) => {
  
  const { session } = await safeGetSession()
  
  return {
    session,
    cookies: cookies.getAll(),
  }

  // const supabase = createServerClient(
  //   VITE_SUPABASE_URL,
  //   VITE_SUPABASE_ANON_KEY,
  //   { global: { fetch }, cookies, request }
  // );

  // const { data: { user } } = await supabase.auth.getUser();

  // if (error) {
  //   console.error("Auth error:", error.toString());
  // }
  
  // return { user };
}