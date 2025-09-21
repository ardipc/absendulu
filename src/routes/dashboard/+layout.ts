import type { LayoutLoad } from './$types';
import { supabase } from '$lib/supabase';

export const load: LayoutLoad = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const getCompany = await supabase.from('employees').select('company').eq('email', session?.user.email).single();
  return { ...session, company: getCompany.data?.company ?? null };
};
