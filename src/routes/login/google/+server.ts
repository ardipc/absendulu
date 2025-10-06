import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  const { data, error } = await locals.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${url.origin}/auth/callback`
    }
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: data.url }
  });
};
