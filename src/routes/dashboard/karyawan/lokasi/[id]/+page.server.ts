import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, params }) => {

  let get = await locals.supabase.from("sites")
      .select("*")
      .eq("id", params.id)
      .single();

	return {
		site: get.data,
	};
};