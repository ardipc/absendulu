import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	// Redirect to login if not authenticated
	if (!session || !user) {
		throw redirect(303, '/login');
	}

	// Check if user already has a company setup
	const { data: employeeData } = await locals.supabase
		.from('companies')
		.select('id')
		.eq('owner', user.email)
		.single();

	// If user already has company setup, redirect to dashboard
	if (employeeData && employeeData.id) {
		throw redirect(303, '/dashboard');
	}

	return {
		user
	};
};
