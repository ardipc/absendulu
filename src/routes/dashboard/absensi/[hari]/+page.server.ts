import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	let one = await locals.supabase.from("attendances")
        .select("*, site(name, address, companies(name))")
        .eq("email", locals.user.email)
        .eq("date", params.hari)
        .single();
      
  if (one) {
    return {
      slug: params.hari,
      attendance: one
    }
  }
};