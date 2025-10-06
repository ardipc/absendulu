import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  let day = new Date().toISOString().split("T")[0];

  let { data } = await locals.supabase.from("attendances")
    .select("*, site(name, address, companies(name))")
    .eq("email", locals.user?.email)
    .eq("date", day)
    .single();

  if (data && data.clock_in_ts && data.clock_out_ts) {
    redirect(302, `/dashboard/absensi/${day}`);
  }

	return {
		attendance: data
	};
};