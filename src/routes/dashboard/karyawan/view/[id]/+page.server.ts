import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals, params }) => {

  let get = await locals.supabase.from("employees")
      .select("*")
      .eq("id", params.id)
      .single();

  let { data: attendances } = await locals.supabase.from("attendances")
    .select("*, sites(name)")
    .eq("email", get.data.email)
    .order('id', { ascending: false });

  let { data: requests } = await locals.supabase.from("requests")
    .select("*")
    .eq("employee", get.data.email)
    .order('id', { ascending: false });

	return {
		employee: get.data,
    attendances,
    requests
	};
};