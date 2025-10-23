<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils.js';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import {
		Calendar,
		MapPin,
		User,
		TrendingUp,
		Clock,
		CheckCircle,
		XCircle,
		AlertCircle,
		Download,
		Filter
	} from '@lucide/svelte';

	let { data } = $props();

	let showFilters = $state(false);
	let startDate = $state(data.filters?.startDate || '');
	let endDate = $state(data.filters?.endDate || '');
	let selectedSite = $state(data.filters?.siteId || '');
	let selectedEmployee = $state(data.filters?.employeeEmail || '');
	let loading = $state(false);

	function applyFilters() {
		loading = true;
		const params: string[] = [];

		if (startDate) params.push(`start_date=${encodeURIComponent(startDate)}`);
		if (endDate) params.push(`end_date=${encodeURIComponent(endDate)}`);
		if (selectedSite) params.push(`site_id=${encodeURIComponent(selectedSite)}`);
		if (selectedEmployee) params.push(`employee_email=${encodeURIComponent(selectedEmployee)}`);

		const queryString = params.length > 0 ? `?${params.join('&')}` : '';
		goto(`/dashboard/report${queryString}`);
	}

	function resetFilters() {
		startDate = '';
		endDate = '';
		selectedSite = '';
		selectedEmployee = '';
		goto('/dashboard/report');
	}

	function exportToCSV() {
		if (!data.attendances || data.attendances.length === 0) {
			alert('Tidak ada data untuk diekspor');
			return;
		}

		// Create CSV content
		const headers = [
			'Tanggal',
			'Email',
			'Lokasi',
			'Clock In',
			'Clock Out',
			'Durasi (jam)',
			'Status'
		];
		const rows = data.attendances.map((att: Record<string, unknown>) => {
			const clockIn = att.clock_in_ts ? formatDate(att.clock_in_ts as string, 'HH:mm:ss') : '-';
			const clockOut = att.clock_out_ts ? formatDate(att.clock_out_ts as string, 'HH:mm:ss') : '-';

			let duration = '-';
			if (att.clock_in_ts && att.clock_out_ts) {
				const diffMs =
					new Date(att.clock_out_ts as string).getTime() -
					new Date(att.clock_in_ts as string).getTime();
				duration = (diffMs / (1000 * 60 * 60)).toFixed(2);
			}

			const sites = att.sites as { name?: string } | null | undefined;
			return [att.date, att.email, sites?.name || '-', clockIn, clockOut, duration, att.status];
		});

		const csvContent = [
			headers.join(','),
			...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
		].join('\n');

		// Download CSV
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute('download', `laporan-absensi-${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'APPROVED':
				return 'text-green-600 bg-green-50';
			case 'SUBMIT':
				return 'text-blue-600 bg-blue-50';
			case 'PENDING':
				return 'text-yellow-600 bg-yellow-50';
			case 'ABSENT':
				return 'text-red-600 bg-red-50';
			case 'REJECTED':
				return 'text-gray-600 bg-gray-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	}

	function isLate(clockInTs: string | null) {
		if (!clockInTs) return false;
		const clockInTime = new Date(clockInTs);
		const hours = clockInTime.getHours();
		const minutes = clockInTime.getMinutes();
		return hours > 8 || (hours === 8 && minutes > 15);
	}

	function calculateDuration(clockIn: string | null, clockOut: string | null) {
		if (!clockIn || !clockOut) return '-';
		const diffMs = new Date(clockOut).getTime() - new Date(clockIn).getTime();
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}j ${minutes}m`;
	}
</script>

<svelte:head>
	<title>Laporan Absensi - AbsenDulu</title>
</svelte:head>

<div class="m-2 md:m-6">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">Laporan Absensi</h1>
			<p class="mt-1 text-sm text-gray-500">
				Periode: {formatDate(data.filters?.startDate || '', 'DD/MM/YYYY')} - {formatDate(
					data.filters?.endDate || '',
					'DD/MM/YYYY'
				)}
			</p>
		</div>
		<button
			type="button"
			onclick={() => (showFilters = !showFilters)}
			class="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
		>
			<Filter class="h-4 w-4" />
			Filter
		</button>
	</div>

	<!-- Filters Panel -->
	{#if showFilters}
		<div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<h3 class="mb-4 font-semibold text-gray-700">Filter Data</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<!-- Date Range -->
				<div>
					<label for="start-date" class="mb-1 block text-sm font-medium text-gray-700">
						Tanggal Mulai
					</label>
					<input
						id="start-date"
						type="date"
						bind:value={startDate}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="end-date" class="mb-1 block text-sm font-medium text-gray-700">
						Tanggal Selesai
					</label>
					<input
						id="end-date"
						type="date"
						bind:value={endDate}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<!-- Employee Filter -->
				{#if data.employees && data.employees.length > 0}
					<div>
						<label for="employee" class="mb-1 block text-sm font-medium text-gray-700">
							Karyawan
						</label>
						<select
							id="employee"
							bind:value={selectedEmployee}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Semua Karyawan</option>
							{#each data.employees as emp (emp.email)}
								<option value={emp.email}>{emp.name} ({emp.email})</option>
							{/each}
						</select>
					</div>
				{/if}

				<!-- Site Filter -->
				{#if data.sites && data.sites.length > 0}
					<div>
						<label for="site" class="mb-1 block text-sm font-medium text-gray-700"> Lokasi </label>
						<select
							id="site"
							bind:value={selectedSite}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Semua Lokasi</option>
							{#each data.sites as site (site.id)}
								<option value={site.id}>{site.name}</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>

			<!-- Filter Actions -->
			<div class="mt-4 flex gap-2">
				<button
					type="button"
					onclick={applyFilters}
					class="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
				>
					Terapkan Filter
				</button>
				<button
					type="button"
					onclick={resetFilters}
					class="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
				>
					Reset
				</button>
			</div>
		</div>
	{/if}

	<!-- Summary Cards -->
	{#if data.summary}
		<div class="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
			<div class="rounded-xl border-l-4 border-blue-500 bg-white p-4 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Total Absensi</p>
						<p class="text-2xl font-bold text-gray-800">{data.summary.total}</p>
					</div>
					<Calendar class="h-8 w-8 text-blue-500" />
				</div>
			</div>

			<div class="rounded-xl border-l-4 border-green-500 bg-white p-4 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Hadir</p>
						<p class="text-2xl font-bold text-gray-800">{data.summary.present}</p>
					</div>
					<CheckCircle class="h-8 w-8 text-green-500" />
				</div>
			</div>

			<div class="rounded-xl border-l-4 border-yellow-500 bg-white p-4 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Terlambat</p>
						<p class="text-2xl font-bold text-gray-800">{data.summary.late}</p>
					</div>
					<AlertCircle class="h-8 w-8 text-yellow-500" />
				</div>
			</div>

			<div class="rounded-xl border-l-4 border-red-500 bg-white p-4 shadow-sm">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-600">Tidak Hadir</p>
						<p class="text-2xl font-bold text-gray-800">{data.summary.absent}</p>
					</div>
					<XCircle class="h-8 w-8 text-red-500" />
				</div>
			</div>
		</div>

		<!-- Additional Stats -->
		<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div
				class="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-sm"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm opacity-90">Rata-rata Jam Kerja</p>
						<p class="mt-1 text-3xl font-bold">{data.summary.avgWorkHours} jam</p>
					</div>
					<Clock class="h-12 w-12 opacity-80" />
				</div>
			</div>

			<div
				class="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white shadow-sm"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm opacity-90">Tingkat Kehadiran</p>
						<p class="mt-1 text-3xl font-bold">{data.summary.attendanceRate}%</p>
					</div>
					<TrendingUp class="h-12 w-12 opacity-80" />
				</div>
			</div>
		</div>
	{/if}

	<!-- Export Button -->
	<div class="mb-4 flex justify-end">
		<button
			type="button"
			onclick={exportToCSV}
			class="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
		>
			<Download class="h-4 w-4" />
			Ekspor ke CSV
		</button>
	</div>

	<!-- Attendance List -->
	<div class="overflow-hidden rounded-xl bg-white shadow-sm">
		<div class="border-b border-gray-200 p-4">
			<h2 class="text-lg font-semibold text-gray-800">Detail Absensi</h2>
			<p class="mt-1 text-sm text-gray-500">
				Menampilkan {data.attendances?.length || 0} data absensi
			</p>
		</div>

		{#if loading}
			<div class="space-y-3 p-4">
				{#each Array(5) as _, i (i)}
					<Skeleton class="h-20 w-full rounded-lg" />
				{/each}
			</div>
		{:else if data.attendances && data.attendances.length > 0}
			<div class="divide-y divide-gray-200">
				{#each data.attendances as attendance (attendance.date + attendance.email)}
					<button
						type="button"
						class="w-full p-4 text-left transition-colors hover:bg-gray-50"
						onclick={() => goto(`/dashboard/absensi/${attendance.date}`)}
					>
						<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<!-- Left Side -->
							<div class="flex-1">
								<div class="mb-2 flex items-center gap-2">
									<Calendar class="h-4 w-4 text-gray-400" />
									<span class="font-semibold text-gray-800">{attendance.date}</span>
									<span
										class={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(attendance.status)}`}
									>
										{attendance.status}
									</span>
									{#if isLate(attendance.clock_in_ts)}
										<span
											class="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600"
										>
											Terlambat
										</span>
									{/if}
								</div>

								<div class="mb-1 flex items-center gap-2 text-sm text-gray-600">
									<User class="h-4 w-4" />
									<span>{attendance.email}</span>
								</div>

								{#if attendance.sites}
									<div class="flex items-center gap-2 text-sm text-gray-600">
										<MapPin class="h-4 w-4" />
										<span>{attendance.sites.name}</span>
									</div>
								{/if}
							</div>

							<!-- Right Side -->
							<div class="flex gap-3">
								<div class="min-w-[100px] rounded-lg bg-gray-50 p-3">
									<p class="mb-1 text-xs text-gray-500">Clock In</p>
									<p class="text-sm font-semibold text-gray-800">
										{attendance.clock_in_ts ? formatDate(attendance.clock_in_ts, 'HH:mm:ss') : '-'}
									</p>
								</div>

								<div class="min-w-[100px] rounded-lg bg-gray-50 p-3">
									<p class="mb-1 text-xs text-gray-500">Clock Out</p>
									<p class="text-sm font-semibold text-gray-800">
										{attendance.clock_out_ts
											? formatDate(attendance.clock_out_ts, 'HH:mm:ss')
											: '-'}
									</p>
								</div>

								<div class="min-w-[100px] rounded-lg bg-gray-50 p-3">
									<p class="mb-1 text-xs text-gray-500">Durasi</p>
									<p class="text-sm font-semibold text-gray-800">
										{calculateDuration(attendance.clock_in_ts, attendance.clock_out_ts)}
									</p>
								</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{:else}
			<div class="p-12 text-center">
				<div
					class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
				>
					<Calendar class="h-8 w-8 text-gray-400" />
				</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-800">Tidak Ada Data</h3>
				<p class="text-gray-500">Tidak ada data absensi untuk periode yang dipilih.</p>
			</div>
		{/if}
	</div>
</div>
