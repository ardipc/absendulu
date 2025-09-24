import { supabase } from '$lib/supabase';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  // console.log("dashboard", session);
  const getCompany = await supabase.from('employees').select('company').eq('email', session?.user.email).single();
  return { ...session, company: getCompany.data?.company ?? null };
};
