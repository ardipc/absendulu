import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const GET = async (event: { url: URL; locals: { supabase: SupabaseClient } }) => {
	const {
		url,
		locals: { supabase }
	} = event;

	const code = url.searchParams.get('code') as string;
	const next = url.searchParams.get('next') ?? '/dashboard';

	if (code) {
		const { error, data } = await supabase.auth.exchangeCodeForSession(code);
		if (!error && data.session) {
			// Check if user already has a company setup
			const { data: employeeData } = await supabase
				.from('companies')
				.select('id')
				.eq('owner', data.session.user.email)
				.single();

			// If no company found, redirect to walkthrough
			if (!employeeData || !employeeData.id) {
				throw redirect(303, '/dashboard/started');
			}

			// Otherwise, redirect to requested page or dashboard
			throw redirect(303, `/${next.slice(1)}`);
		}
	}

	throw redirect(303, '/auth/auth-code-error');
};
