import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'

import type { LayoutLoad } from './$types'

const VITE_SUPABASE_URL         = "https://lvwzvhzsfphyhswahgot.supabase.co";
const VITE_SUPABASE_ANON_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2d3p2aHpzZnBoeWhzd2FoZ290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NzA3MzAsImV4cCI6MjA3MjQ0NjczMH0.JX5Y0xDjmWKet1G8D-CeL0o5cVh2dFZx7uBb30ltA5M";

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth')

  const supabase = isBrowser()
    ? createBrowserClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          getAll() {
            return data.cookies
          },
        },
      })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { session, supabase, user }
}