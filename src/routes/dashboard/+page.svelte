<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils.js';
	import {
		Calendar,
		Clock,
		TrendingUp,
		Award,
		MapPin,
		FileText,
		LogIn,
		LogOut,
		CheckCircle,
		AlertCircle,
		Activity,
		Sparkles,
		ChevronRight,
		BarChart3,
		Target,
		Zap
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	const records = $state(data.attendances ?? []);
	let currentTime = $state('');
	let currentDate = $state('');

	// Update current time
	function updateTime() {
		const now = new Date();
		currentTime = now.toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		currentDate = now.toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	onMount(() => {
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	});

	// Get today's attendance
	const todayDate = new Date().toISOString().split('T')[0];
	const todayAttendance = $derived(records.find((r) => r.date === todayDate));

	// Calculate statistics
	const totalPresent = $derived(
		records.filter((r) => r.status === 'SUBMIT' || r.status === 'APPROVED').length
	);
	const totalLate = $derived(
		records.filter((r) => {
			if (!r.clock_in_ts) return false;
			const clockInTime = new Date(r.clock_in_ts);
			const hours = clockInTime.getHours();
			const minutes = clockInTime.getMinutes();
			return hours > 8 || (hours === 8 && minutes > 15);
		}).length
	);
	const totalAbsent = $derived(records.filter((r) => r.status === 'ABSENT').length);
	const attendanceRate = $derived(
		records.length > 0 ? ((totalPresent / records.length) * 100).toFixed(1) : '0'
	);

	// Get greeting based on time
	function getGreeting() {
		const hour = new Date().getHours();
		if (hour < 12) return 'Selamat Pagi';
		if (hour < 15) return 'Selamat Siang';
		if (hour < 18) return 'Selamat Sore';
		return 'Selamat Malam';
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'APPROVED':
				return { color: 'bg-green-100 text-green-700 border-green-200', text: 'Disetujui' };
			case 'SUBMIT':
				return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Submit' };
			case 'PENDING':
				return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Pending' };
			case 'ABSENT':
				return { color: 'bg-red-100 text-red-700 border-red-200', text: 'Tidak Hadir' };
			default:
				return { color: 'bg-gray-100 text-gray-700 border-gray-200', text: status };
		}
	}

	function calculateWorkDuration(clockIn: string | undefined, clockOut: string | undefined) {
		if (!clockIn || !clockOut) return '-';
		const diffMs = new Date(clockOut).getTime() - new Date(clockIn).getTime();
		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}j ${minutes}m`;
	}
</script>

<svelte:head>
	<title>Dashboard - AbsenDulu</title>
</svelte:head>

{#if data}
	<main class="min-h-screen bg-gradient-to-br p-4 md:p-8">
		<div class="mx-auto max-w-7xl">
			<!-- Header Section -->
			<div
				class="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-8 shadow-2xl"
			>
				<!-- Decorative Elements -->
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-white opacity-5"></div>

				<div class="relative z-10">
					<!-- Greeting and Time -->
					<div
						class="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
					>
						<div>
							<div class="mb-2 flex items-center gap-2">
								<Sparkles class="h-6 w-6 text-yellow-300" />
								<h1 class="text-3xl font-bold text-white md:text-4xl">
									{getGreeting()}, {data?.user?.email?.split('@')[0] || 'User'}!
								</h1>
							</div>
							<p class="flex items-center gap-2 text-lg text-white/90">
								<Calendar class="h-5 w-5" />
								{currentDate}
							</p>
						</div>
						<div class="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
							<div class="flex items-center gap-2 text-white/90">
								<Clock class="h-5 w-5" />
								<span class="text-sm font-medium">Waktu Sekarang</span>
							</div>
							<p class="text-3xl font-bold text-white">{currentTime}</p>
						</div>
					</div>

					<!-- Today's Status -->
					<div class="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
						<div class="flex flex-wrap items-center justify-between gap-4">
							<div>
								<h3 class="mb-2 text-lg font-semibold text-white">Status Absensi Hari Ini</h3>
								{#if todayAttendance}
									<div class="flex flex-wrap items-center gap-3">
										{#if todayAttendance.clock_in_ts}
											<div class="flex items-center gap-2 rounded-xl bg-green-500/30 px-4 py-2">
												<LogIn class="h-5 w-5 text-white" />
												<span class="font-semibold text-white"
													>Clock In: {formatDate(todayAttendance.clock_in_ts, 'HH:mm')}</span
												>
											</div>
										{/if}
										{#if todayAttendance.clock_out_ts}
											<div class="flex items-center gap-2 rounded-xl bg-red-500/30 px-4 py-2">
												<LogOut class="h-5 w-5 text-white" />
												<span class="font-semibold text-white"
													>Clock Out: {formatDate(todayAttendance.clock_out_ts, 'HH:mm')}</span
												>
											</div>
										{/if}
									</div>
								{:else}
									<div class="flex items-center gap-2 rounded-xl bg-yellow-500/30 px-4 py-2">
										<AlertCircle class="h-5 w-5 text-white" />
										<span class="font-semibold text-white">Belum absen hari ini</span>
									</div>
								{/if}
							</div>
							<button
								type="button"
								onclick={() => goto('/dashboard/absensi')}
								class="group flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-purple-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
							>
								<Zap class="h-5 w-5 transition-transform group-hover:rotate-12" />
								Absen Sekarang
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Statistics Cards -->
			<div class="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<!-- Total Hadir -->
				<div
					class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<p class="mb-2 text-sm font-medium text-gray-600">Total Hadir</p>
							<p class="mb-1 text-4xl font-bold text-gray-800">{totalPresent}</p>
							<p class="text-xs text-gray-500">dari {records.length} hari kerja</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 p-4 shadow-lg transition-transform group-hover:rotate-12"
						>
							<CheckCircle class="h-8 w-8 text-white" />
						</div>
					</div>
					<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
							style="width: {records.length > 0 ? (totalPresent / records.length) * 100 : 0}%"
						></div>
					</div>
				</div>

				<!-- Terlambat -->
				<div
					class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<p class="mb-2 text-sm font-medium text-gray-600">Terlambat</p>
							<p class="mb-1 text-4xl font-bold text-gray-800">{totalLate}</p>
							<p class="text-xs text-gray-500">keterlambatan</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 p-4 shadow-lg transition-transform group-hover:rotate-12"
						>
							<AlertCircle class="h-8 w-8 text-white" />
						</div>
					</div>
					<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-1000"
							style="width: {records.length > 0 ? (totalLate / records.length) * 100 : 0}%"
						></div>
					</div>
				</div>

				<!-- Tidak Hadir -->
				<div
					class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<p class="mb-2 text-sm font-medium text-gray-600">Tidak Hadir</p>
							<p class="mb-1 text-4xl font-bold text-gray-800">{totalAbsent}</p>
							<p class="text-xs text-gray-500">tidak hadir</p>
						</div>
						<div
							class="rounded-xl bg-gradient-to-br from-red-400 to-rose-500 p-4 shadow-lg transition-transform group-hover:rotate-12"
						>
							<Activity class="h-8 w-8 text-white" />
						</div>
					</div>
					<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
						<div
							class="h-full rounded-full bg-gradient-to-r from-red-400 to-rose-500 transition-all duration-1000"
							style="width: {records.length > 0 ? (totalAbsent / records.length) * 100 : 0}%"
						></div>
					</div>
				</div>

				<!-- Attendance Rate -->
				<div
					class="group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
				>
					<div class="flex items-start justify-between text-white">
						<div class="flex-1">
							<p class="mb-2 text-sm font-medium opacity-90">Tingkat Kehadiran</p>
							<p class="mb-1 text-4xl font-bold">{attendanceRate}%</p>
							<p class="text-xs opacity-80">performance rate</p>
						</div>
						<div
							class="rounded-xl bg-white/20 p-4 backdrop-blur-sm transition-transform group-hover:rotate-12"
						>
							<TrendingUp class="h-8 w-8" />
						</div>
					</div>
					<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
						<div
							class="h-full rounded-full bg-white transition-all duration-1000"
							style="width: {attendanceRate}%"
						></div>
					</div>
				</div>
			</div>

			<!-- Quick Actions -->
			<div class="mb-8">
				<h2 class="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
					<Zap class="h-6 w-6 text-purple-600" />
					Quick Actions
				</h2>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<button
						type="button"
						onclick={() => goto('/dashboard/absensi')}
						class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
					>
						<div
							class="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 p-4 shadow-lg"
						>
							<LogIn class="h-8 w-8 text-white" />
						</div>
						<h3 class="mb-2 text-lg font-bold text-gray-800">Absensi</h3>
						<p class="mb-3 text-sm text-gray-600">Clock in atau clock out</p>
						<div
							class="flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all group-hover:gap-2"
						>
							<span>Mulai</span>
							<ChevronRight class="h-4 w-4" />
						</div>
					</button>

					<button
						type="button"
						onclick={() => goto('/dashboard/report')}
						class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
					>
						<div
							class="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 p-4 shadow-lg"
						>
							<BarChart3 class="h-8 w-8 text-white" />
						</div>
						<h3 class="mb-2 text-lg font-bold text-gray-800">Laporan</h3>
						<p class="mb-3 text-sm text-gray-600">Lihat laporan lengkap</p>
						<div
							class="flex items-center gap-1 text-sm font-semibold text-green-600 transition-all group-hover:gap-2"
						>
							<span>Buka</span>
							<ChevronRight class="h-4 w-4" />
						</div>
					</button>

					<button
						type="button"
						onclick={() => goto('/dashboard/request')}
						class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
					>
						<div
							class="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 p-4 shadow-lg"
						>
							<FileText class="h-8 w-8 text-white" />
						</div>
						<h3 class="mb-2 text-lg font-bold text-gray-800">Request</h3>
						<p class="mb-3 text-sm text-gray-600">Ajukan izin atau cuti</p>
						<div
							class="flex items-center gap-1 text-sm font-semibold text-purple-600 transition-all group-hover:gap-2"
						>
							<span>Ajukan</span>
							<ChevronRight class="h-4 w-4" />
						</div>
					</button>

					<button
						type="button"
						onclick={() => goto('/dashboard/profile')}
						class="group overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
					>
						<div
							class="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 p-4 shadow-lg"
						>
							<Target class="h-8 w-8 text-white" />
						</div>
						<h3 class="mb-2 text-lg font-bold text-gray-800">Profile</h3>
						<p class="mb-3 text-sm text-gray-600">Kelola akun Anda</p>
						<div
							class="flex items-center gap-1 text-sm font-semibold text-orange-600 transition-all group-hover:gap-2"
						>
							<span>Lihat</span>
							<ChevronRight class="h-4 w-4" />
						</div>
					</button>
				</div>
			</div>

			<!-- Recent Attendance History -->
			<div>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="flex items-center gap-2 text-2xl font-bold text-gray-800">
						<Calendar class="h-6 w-6 text-purple-600" />
						Riwayat Absensi Terbaru
					</h2>
					<button
						type="button"
						onclick={() => goto('/dashboard/report')}
						class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-purple-600 transition-all hover:bg-purple-50"
					>
						Lihat Semua
						<ChevronRight class="h-4 w-4" />
					</button>
				</div>

				{#if records.length === 0}
					<!-- Empty State -->
					<div class="rounded-3xl bg-white p-16 text-center shadow-lg">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100"
						>
							<Calendar class="h-10 w-10 text-purple-600" />
						</div>
						<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Riwayat</h3>
						<p class="mb-6 text-gray-600">Mulai absensi untuk melihat riwayat Anda</p>
						<button
							type="button"
							onclick={() => goto('/dashboard/absensi')}
							class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
						>
							<LogIn class="h-5 w-5" />
							Absen Sekarang
						</button>
					</div>
				{:else}
					<div class="space-y-3">
						{#each records.slice(0, 7) as rec (rec.date)}
							{@const statusBadge = getStatusBadge(rec.status)}
							<button
								type="button"
								class="group w-full overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl"
								onclick={() => goto(`/dashboard/absensi/${rec.date}`)}
							>
								<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
									<!-- Left Section -->
									<div class="flex items-center gap-4">
										<div
											class="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100"
										>
											<span class="text-xs font-medium text-purple-600"
												>{new Date(rec.date).toLocaleDateString('id-ID', {
													weekday: 'short'
												})}</span
											>
											<span class="text-2xl font-bold text-purple-700"
												>{new Date(rec.date).getDate()}</span
											>
										</div>
										<div class="flex-1">
											<div class="mb-2 flex flex-wrap items-center gap-2">
												<h3 class="font-bold text-gray-800">{rec.date}</h3>
												<span
													class={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.color}`}
												>
													{statusBadge.text}
												</span>
											</div>
											<p class="mb-1 flex items-center gap-2 text-sm text-gray-600">
												<MapPin class="h-4 w-4" />
												{(rec.sites as unknown as { name: string })?.name || 'N/A'}
											</p>
											<p class="flex items-center gap-2 text-xs text-gray-500">
												<Clock class="h-3 w-3" />
												Durasi: {calculateWorkDuration(rec.clock_in_ts, rec.clock_out_ts)}
											</p>
										</div>
									</div>

									<!-- Right Section -->
									<div class="flex gap-3">
										<div class="min-w-[100px] rounded-xl bg-gray-50 p-4 text-center">
											<p class="mb-1 text-xs font-medium text-gray-500">Clock In</p>
											<p class="font-bold text-gray-800">
												{rec.clock_in_ts ? formatDate(rec.clock_in_ts, 'HH:mm') : '-'}
											</p>
										</div>
										<div class="min-w-[100px] rounded-xl bg-gray-50 p-4 text-center">
											<p class="mb-1 text-xs font-medium text-gray-500">Clock Out</p>
											<p class="font-bold text-gray-800">
												{rec.clock_out_ts ? formatDate(rec.clock_out_ts, 'HH:mm') : '-'}
											</p>
										</div>
										<div class="flex items-center">
											<ChevronRight
												class="h-6 w-6 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-purple-600"
											/>
										</div>
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Achievement Banner (Optional) -->
			{#if totalPresent >= 10 && parseFloat(attendanceRate) >= 90}
				<div
					class="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-8 shadow-2xl"
				>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<div class="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
								<Award class="h-12 w-12 text-white" />
							</div>
							<div class="text-white">
								<h3 class="mb-1 text-2xl font-bold">Pencapaian Luar Biasa! 🎉</h3>
								<p class="text-lg opacity-90">
									Tingkat kehadiran Anda {attendanceRate}%! Pertahankan performa hebat ini!
								</p>
							</div>
						</div>
						<Sparkles class="h-16 w-16 animate-pulse text-white" />
					</div>
				</div>
			{/if}
		</div>
	</main>
{/if}
