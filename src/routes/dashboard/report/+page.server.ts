import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;

	if (!user) {
		return {
			attendances: [],
			employees: [],
			sites: [],
			summary: null
		};
	}

	// Get query parameters for filtering
	const startDate = url.searchParams.get('start_date') || getDefaultStartDate();
	const endDate = url.searchParams.get('end_date') || getDefaultEndDate();
	const siteId = url.searchParams.get('site_id');
	const employeeEmail = url.searchParams.get('employee_email');

	// Get user's employee data to check role
	const { data: employeeData } = await locals.supabase
		.from('employees')
		.select('*, companies(*, sites(*))')
		.eq('email', user.email)
		.single();

	// Build attendance query
	let attendanceQuery = locals.supabase
		.from('attendances')
		.select('*, sites(name, address)')
		.gte('date', startDate)
		.lte('date', endDate)
		.order('date', { ascending: false });

	// Filter by site if specified
	if (siteId) {
		attendanceQuery = attendanceQuery.eq('site', siteId);
	}

	// Filter by employee email if specified
	if (employeeEmail) {
		attendanceQuery = attendanceQuery.eq('email', employeeEmail);
	} else if (!employeeData?.companies) {
		// If user is not linked to a company, only show their own data
		attendanceQuery = attendanceQuery.eq('email', user.email);
	}

	const { data: attendances } = await attendanceQuery;

	// Get employees list (for filter dropdown)
	let employeesQuery = locals.supabase
		.from('employees')
		.select('email, name, companies(name)')
		.order('name', { ascending: true });

	if (employeeData?.companies?.id) {
		employeesQuery = employeesQuery.eq('company', employeeData.companies.id);
	}

	const { data: employees } = await employeesQuery;

	// Get sites list (for filter dropdown)
	let sitesQuery = locals.supabase
		.from('sites')
		.select('id, name, address')
		.order('name', { ascending: true });

	if (employeeData?.companies?.id) {
		sitesQuery = sitesQuery.eq('company', employeeData.companies.id);
	}

	const { data: sites } = await sitesQuery;

	// Calculate summary statistics
	const summary = calculateSummary(attendances || []);

	return {
		attendances: attendances || [],
		employees: employees || [],
		sites: sites || [],
		summary,
		filters: {
			startDate,
			endDate,
			siteId,
			employeeEmail
		},
		userEmployee: employeeData
	};
};

function getDefaultStartDate(): string {
	const date = new Date();
	date.setDate(date.getDate() - 30); // Last 30 days
	return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
	return new Date().toISOString().split('T')[0];
}

interface Attendance {
	status: string;
	clock_in_ts?: string | null;
	clock_out_ts?: string | null;
	[key: string]: unknown;
}

function calculateSummary(attendances: Attendance[]) {
	const total = attendances.length;
	const present = attendances.filter(
		(a) => a.status === 'SUBMIT' || a.status === 'APPROVED'
	).length;
	const late = attendances.filter((a) => {
		if (!a.clock_in_ts) return false;
		const clockInTime = new Date(a.clock_in_ts);
		const hours = clockInTime.getHours();
		const minutes = clockInTime.getMinutes();
		// Consider late if clock in after 08:15
		return hours > 8 || (hours === 8 && minutes > 15);
	}).length;
	const absent = attendances.filter((a) => a.status === 'ABSENT').length;
	const pending = attendances.filter((a) => a.status === 'PENDING').length;

	// Calculate average work hours
	let totalWorkHours = 0;
	let countWithBothClocks = 0;

	attendances.forEach((a) => {
		if (a.clock_in_ts && a.clock_out_ts) {
			const clockIn = new Date(a.clock_in_ts);
			const clockOut = new Date(a.clock_out_ts);
			const diffMs = clockOut.getTime() - clockIn.getTime();
			const diffHours = diffMs / (1000 * 60 * 60);
			totalWorkHours += diffHours;
			countWithBothClocks++;
		}
	});

	const avgWorkHours = countWithBothClocks > 0 ? totalWorkHours / countWithBothClocks : 0;

	return {
		total,
		present,
		late,
		absent,
		pending,
		avgWorkHours: avgWorkHours.toFixed(2),
		attendanceRate: total > 0 ? ((present / total) * 100).toFixed(1) : '0'
	};
}
