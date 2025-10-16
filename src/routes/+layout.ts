import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'

import type { LayoutLoad } from './$types'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  depends('supabase:auth')

  // if (isBrowser()) {
  //   console.log("Browser:", { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY });
  // } else {
  //   console.log("Server:", { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY });
  // }

  const supabase = isBrowser()
    ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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