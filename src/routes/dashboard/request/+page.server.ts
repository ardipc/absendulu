import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {

  let get = await locals.supabase.from("employees")
      .select("*, companies(*, sites(*))")
      .eq("email", locals.user?.email)
      .single();

	return {
		company: get.data
	};
};