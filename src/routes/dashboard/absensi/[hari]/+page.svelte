<script lang="ts">
	import { goto } from '$app/navigation';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import {
		ArrowLeft,
		Calendar,
		Clock,
		MapPin,
		Navigation,
		User,
		Building2,
		CheckCircle,
		XCircle,
		AlertCircle,
		Image as ImageIcon,
		LogIn,
		LogOut,
		Timer,
		Briefcase,
		Award,
		Info
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	interface AttendanceData {
		email: string;
		date: string;
		status: string;
		clock_in_ts?: string;
		clock_out_ts?: string;
		clock_in_lat?: number;
		clock_in_lng?: number;
		clock_out_lat?: number;
		clock_out_lng?: number;
		clock_in_photo?: string;
		clock_out_photo?: string;
		site?: {
			name: string;
			address: string;
			companies?: {
				name: string;
			};
		};
	}

	let loading = $state(false);
	let attendance = $state<AttendanceData | null>(null);
	let workDuration = $state('0 jam 0 menit');

	async function getAttendance() {
		loading = true;
		let one = await data.supabase
			.from('attendances')
			.select('*, site(name, address, companies(name))')
			.eq('email', data.user?.email)
			.eq('date', data.slug)
			.single();

		if (one.data) {
			attendance = one.data;
			calculateWorkDuration();
		}

		loading = false;
	}

	function calculateWorkDuration() {
		if (!attendance?.clock_in_ts || !attendance?.clock_out_ts) {
			workDuration = 'Belum selesai';
			return;
		}

		const clockIn = new Date(attendance.clock_in_ts);
		const clockOut = new Date(attendance.clock_out_ts);
		const diffMs = clockOut.getTime() - clockIn.getTime();

		const hours = Math.floor(diffMs / (1000 * 60 * 60));
		const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		workDuration = `${hours} jam ${minutes} menit`;
	}

	onMount(() => {
		getAttendance();
	});

	function formatTime(dateString: string) {
		return new Date(dateString).toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'APPROVED':
				return {
					color: 'from-green-500 to-emerald-600',
					icon: CheckCircle,
					text: 'Disetujui',
					bg: 'bg-green-50',
					textColor: 'text-green-700'
				};
			case 'SUBMIT':
				return {
					color: 'from-blue-500 to-indigo-600',
					icon: AlertCircle,
					text: 'Menunggu Persetujuan',
					bg: 'bg-blue-50',
					textColor: 'text-blue-700'
				};
			case 'REJECTED':
				return {
					color: 'from-red-500 to-rose-600',
					icon: XCircle,
					text: 'Ditolak',
					bg: 'bg-red-50',
					textColor: 'text-red-700'
				};
			default:
				return {
					color: 'from-gray-500 to-gray-600',
					icon: AlertCircle,
					text: status,
					bg: 'bg-gray-50',
					textColor: 'text-gray-700'
				};
		}
	}

	function isLate(clockInTs: string) {
		const clockInTime = new Date(clockInTs);
		const hours = clockInTime.getHours();
		const minutes = clockInTime.getMinutes();
		return hours > 8 || (hours === 8 && minutes > 15);
	}
</script>

<svelte:head>
	<title>Detail Absensi - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br p-4 md:p-8">
	{#if loading}
		<!-- Enhanced Loading State -->
		<div class="mx-auto max-w-5xl space-y-6">
			<Skeleton class="h-16 w-full rounded-2xl" />
			<div class="grid gap-6 md:grid-cols-2">
				<Skeleton class="h-96 rounded-3xl" />
				<Skeleton class="h-96 rounded-3xl" />
			</div>
			<Skeleton class="h-64 rounded-3xl" />
		</div>
	{/if}

	{#if attendance && !loading}
		{@const statusBadge = getStatusBadge(attendance.status)}
		{@const StatusIcon = statusBadge.icon}

		<div class="mx-auto max-w-6xl">
			<!-- Header with Back Button -->
			<div class="mb-8 flex items-center justify-between">
				<button
					type="button"
					onclick={() => goto('/dashboard')}
					class="group flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-gray-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
				>
					<ArrowLeft class="h-5 w-5 transition-transform group-hover:-translate-x-1" />
					Kembali
				</button>

				<div class="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 shadow-lg">
					<Calendar class="h-5 w-5 text-indigo-600" />
					<span class="font-semibold text-gray-800">{formatDate(attendance.date)}</span>
				</div>
			</div>

			<!-- Status Banner -->
			<div
				class={`relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r ${statusBadge.color} p-8 shadow-2xl`}
			>
				<!-- Decorative Elements -->
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>

				<div class="relative z-10 flex flex-col items-center justify-between gap-4 md:flex-row">
					<div class="flex items-center gap-4">
						<div class="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
							<StatusIcon class="h-12 w-12 text-white" />
						</div>
						<div class="text-white">
							<h1 class="mb-1 text-3xl font-bold">Detail Absensi</h1>
							<p class="text-lg opacity-90">{statusBadge.text}</p>
						</div>
					</div>

					<!-- Late Badge if applicable -->
					{#if attendance.clock_in_ts && isLate(attendance.clock_in_ts)}
						<div class="rounded-2xl bg-orange-500/30 px-6 py-3 backdrop-blur-sm">
							<div class="flex items-center gap-2 text-white">
								<AlertCircle class="h-5 w-5" />
								<span class="font-bold">Terlambat</span>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Summary Cards -->
			<div class="mb-8 grid gap-4 md:grid-cols-3">
				<!-- Work Duration -->
				<div
					class="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105"
				>
					<div class="flex items-start justify-between">
						<div>
							<p class="mb-2 text-sm font-medium text-gray-600">Durasi Kerja</p>
							<p class="text-3xl font-bold text-gray-800">{workDuration}</p>
						</div>
						<div class="rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 p-3 shadow-lg">
							<Timer class="h-6 w-6 text-white" />
						</div>
					</div>
				</div>

				<!-- Location -->
				<div
					class="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<p class="mb-2 text-sm font-medium text-gray-600">Lokasi</p>
							<p class="text-lg font-bold text-gray-800">{attendance.site?.name || 'N/A'}</p>
							<p class="text-xs text-gray-500">{attendance.site?.address || ''}</p>
						</div>
						<div class="rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 p-3 shadow-lg">
							<MapPin class="h-6 w-6 text-white" />
						</div>
					</div>
				</div>

				<!-- Company -->
				<div
					class="overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105"
				>
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<p class="mb-2 text-sm font-medium text-gray-600">Perusahaan</p>
							<p class="text-lg font-bold text-gray-800">
								{attendance.site?.companies?.name || 'N/A'}
							</p>
							<p class="text-xs text-gray-500">{attendance.email}</p>
						</div>
						<div class="rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 p-3 shadow-lg">
							<Building2 class="h-6 w-6 text-white" />
						</div>
					</div>
				</div>
			</div>

			<!-- Clock In/Out Details Grid -->
			<div class="grid gap-8 lg:grid-cols-2">
				<!-- Clock In Card -->
				<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
					<!-- Header -->
					<div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
						<div class="flex items-center gap-3">
							<div class="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
								<LogIn class="h-6 w-6 text-white" />
							</div>
							<div class="text-white">
								<h3 class="text-xl font-bold">Clock In</h3>
								<p class="text-sm opacity-90">Waktu masuk kerja</p>
							</div>
						</div>
					</div>

					<div class="p-6">
						{#if attendance.clock_in_ts}
							<!-- Time Info -->
							<div class="mb-6 rounded-2xl bg-green-50 p-6">
								<div class="mb-4 flex items-center gap-2 text-green-700">
									<Clock class="h-5 w-5" />
									<span class="text-sm font-semibold">Waktu</span>
								</div>
								<p class="mb-1 text-3xl font-bold text-green-800">
									{formatTime(attendance.clock_in_ts)}
								</p>
								<p class="text-sm text-green-600">{formatDate(attendance.clock_in_ts)}</p>
							</div>

							<!-- Location Info -->
							<div class="mb-6 rounded-2xl bg-gray-50 p-6">
								<div class="mb-4 flex items-center gap-2 text-gray-700">
									<Navigation class="h-5 w-5" />
									<span class="text-sm font-semibold">Koordinat GPS</span>
								</div>
								<div class="space-y-2">
									<div class="flex items-center justify-between rounded-lg bg-white p-3">
										<span class="text-sm font-medium text-gray-600">Latitude</span>
										<span class="font-mono font-semibold text-gray-800"
											>{attendance.clock_in_lat?.toFixed(6) || '-'}</span
										>
									</div>
									<div class="flex items-center justify-between rounded-lg bg-white p-3">
										<span class="text-sm font-medium text-gray-600">Longitude</span>
										<span class="font-mono font-semibold text-gray-800"
											>{attendance.clock_in_lng?.toFixed(6) || '-'}</span
										>
									</div>
								</div>
							</div>

							<!-- Photo -->
							{#if attendance.clock_in_photo}
								<div class="rounded-2xl bg-gray-50 p-6">
									<div class="mb-4 flex items-center gap-2 text-gray-700">
										<ImageIcon class="h-5 w-5" />
										<span class="text-sm font-semibold">Foto Selfie</span>
									</div>
									<div class="overflow-hidden rounded-xl shadow-lg">
										<img
											src={`https://lvwzvhzsfphyhswahgot.supabase.co/storage/v1/object/public/${attendance.clock_in_photo}`}
											alt="Clock In"
											class="w-full object-cover"
										/>
									</div>
								</div>
							{:else}
								<div class="rounded-2xl bg-gray-50 p-8 text-center">
									<ImageIcon class="mx-auto mb-3 h-12 w-12 text-gray-400" />
									<p class="text-sm text-gray-600">Tidak ada foto</p>
								</div>
							{/if}
						{:else}
							<div class="py-16 text-center">
								<div
									class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
								>
									<XCircle class="h-8 w-8 text-gray-400" />
								</div>
								<p class="text-gray-600">Belum Clock In</p>
							</div>
						{/if}
					</div>
				</div>

				<!-- Clock Out Card -->
				<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
					<!-- Header -->
					<div class="bg-gradient-to-r from-red-500 to-rose-600 p-6">
						<div class="flex items-center gap-3">
							<div class="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
								<LogOut class="h-6 w-6 text-white" />
							</div>
							<div class="text-white">
								<h3 class="text-xl font-bold">Clock Out</h3>
								<p class="text-sm opacity-90">Waktu pulang kerja</p>
							</div>
						</div>
					</div>

					<div class="p-6">
						{#if attendance.clock_out_ts}
							<!-- Time Info -->
							<div class="mb-6 rounded-2xl bg-red-50 p-6">
								<div class="mb-4 flex items-center gap-2 text-red-700">
									<Clock class="h-5 w-5" />
									<span class="text-sm font-semibold">Waktu</span>
								</div>
								<p class="mb-1 text-3xl font-bold text-red-800">
									{formatTime(attendance.clock_out_ts)}
								</p>
								<p class="text-sm text-red-600">{formatDate(attendance.clock_out_ts)}</p>
							</div>

							<!-- Location Info -->
							<div class="mb-6 rounded-2xl bg-gray-50 p-6">
								<div class="mb-4 flex items-center gap-2 text-gray-700">
									<Navigation class="h-5 w-5" />
									<span class="text-sm font-semibold">Koordinat GPS</span>
								</div>
								<div class="space-y-2">
									<div class="flex items-center justify-between rounded-lg bg-white p-3">
										<span class="text-sm font-medium text-gray-600">Latitude</span>
										<span class="font-mono font-semibold text-gray-800"
											>{attendance.clock_out_lat?.toFixed(6) || '-'}</span
										>
									</div>
									<div class="flex items-center justify-between rounded-lg bg-white p-3">
										<span class="text-sm font-medium text-gray-600">Longitude</span>
										<span class="font-mono font-semibold text-gray-800"
											>{attendance.clock_out_lng?.toFixed(6) || '-'}</span
										>
									</div>
								</div>
							</div>

							<!-- Photo -->
							{#if attendance.clock_out_photo}
								<div class="rounded-2xl bg-gray-50 p-6">
									<div class="mb-4 flex items-center gap-2 text-gray-700">
										<ImageIcon class="h-5 w-5" />
										<span class="text-sm font-semibold">Foto Selfie</span>
									</div>
									<div class="overflow-hidden rounded-xl shadow-lg">
										<img
											src={`https://lvwzvhzsfphyhswahgot.supabase.co/storage/v1/object/public/${attendance.clock_out_photo}`}
											alt="Clock Out"
											class="w-full object-cover"
										/>
									</div>
								</div>
							{:else}
								<div class="rounded-2xl bg-gray-50 p-8 text-center">
									<ImageIcon class="mx-auto mb-3 h-12 w-12 text-gray-400" />
									<p class="text-sm text-gray-600">Tidak ada foto</p>
								</div>
							{/if}
						{:else}
							<div class="py-16 text-center">
								<div
									class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"
								>
									<AlertCircle class="h-8 w-8 text-gray-400" />
								</div>
								<p class="text-gray-600">Belum Clock Out</p>
								<p class="mt-2 text-sm text-gray-500">Anda masih dalam jam kerja</p>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Additional Info -->
			<div class="mt-8 rounded-3xl bg-white p-8 shadow-lg">
				<div class="mb-6 flex items-center gap-3">
					<div class="rounded-xl bg-blue-100 p-3">
						<Info class="h-6 w-6 text-blue-600" />
					</div>
					<h3 class="text-xl font-bold text-gray-800">Informasi Tambahan</h3>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-xl bg-gray-50 p-4">
						<div class="mb-2 flex items-center gap-2 text-gray-600">
							<User class="h-4 w-4" />
							<span class="text-sm font-semibold">Email</span>
						</div>
						<p class="font-semibold text-gray-800">{attendance.email}</p>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<div class="mb-2 flex items-center gap-2 text-gray-600">
							<Calendar class="h-4 w-4" />
							<span class="text-sm font-semibold">Tanggal</span>
						</div>
						<p class="font-semibold text-gray-800">{attendance.date}</p>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<div class="mb-2 flex items-center gap-2 text-gray-600">
							<Briefcase class="h-4 w-4" />
							<span class="text-sm font-semibold">Status</span>
						</div>
						<span class={`inline-flex items-center gap-2 font-semibold ${statusBadge.textColor}`}>
							<StatusIcon class="h-4 w-4" />
							{statusBadge.text}
						</span>
					</div>

					<div class="rounded-xl bg-gray-50 p-4">
						<div class="mb-2 flex items-center gap-2 text-gray-600">
							<Timer class="h-4 w-4" />
							<span class="text-sm font-semibold">Total Jam Kerja</span>
						</div>
						<p class="font-semibold text-gray-800">{workDuration}</p>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<button
					type="button"
					onclick={() => goto('/dashboard')}
					class="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
				>
					<ArrowLeft class="h-5 w-5" />
					Kembali ke Dashboard
				</button>

				<button
					type="button"
					onclick={() => goto('/dashboard/report')}
					class="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
				>
					<Award class="h-5 w-5" />
					Lihat Laporan
				</button>
			</div>
		</div>
	{/if}

	{#if !attendance && !loading}
		<!-- Not Found State -->
		<div class="mx-auto max-w-2xl">
			<div class="rounded-3xl bg-white p-16 text-center shadow-2xl">
				<div
					class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100"
				>
					<XCircle class="h-12 w-12 text-gray-400" />
				</div>
				<h3 class="mb-2 text-2xl font-bold text-gray-800">Data Tidak Ditemukan</h3>
				<p class="mb-8 text-gray-600">Data absensi untuk tanggal ini tidak tersedia.</p>
				<button
					type="button"
					onclick={() => goto('/dashboard')}
					class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
				>
					<ArrowLeft class="h-5 w-5" />
					Kembali ke Dashboard
				</button>
			</div>
		</div>
	{/if}
</main>
