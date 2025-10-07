import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 13) // 14 days total

  let { data } = await locals.supabase.from("attendances")
    .select('date, clock_in_ts, clock_out_ts, status, sites(name)')
    .eq("email", locals.user?.email)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', today.toISOString().split('T')[0])
    .order('date', { ascending: false })

  return {
    attendances: data
  };
};