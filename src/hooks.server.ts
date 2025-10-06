import { createServerClient } from '@supabase/ssr'
import { 
  type Handle, 
  // redirect 
} from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const VITE_SUPABASE_URL         = "https://lvwzvhzsfphyhswahgot.supabase.co";
const VITE_SUPABASE_ANON_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2d3p2aHpzZnBoeWhzd2FoZ290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NzA3MzAsImV4cCI6MjA3MjQ0NjczMH0.JX5Y0xDjmWKet1G8D-CeL0o5cVh2dFZx7uBb30ltA5M";

const supabase: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' })
        })
      },
    },
  })

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null }
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser()
    if (error) {
      // JWT validation has failed
      return { session: null, user: null }
    }

    return { session, user }
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    },
  })
}

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  // if (!event.locals.session && event.url.pathname.startsWith('/private')) {
  //   redirect(303, '/auth')
  // }

  // if (event.locals.session && event.url.pathname === '/auth') {
  //   redirect(303, '/private')
  // }

  return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)