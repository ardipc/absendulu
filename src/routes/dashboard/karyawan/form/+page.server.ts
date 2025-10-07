import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {

  let get = await locals.supabase.from("companies")
      .select("*")
      .eq("owner", locals.user?.email)
      .single();

	return {
		company: get.data
	};
};