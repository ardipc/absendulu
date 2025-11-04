<script lang="ts">
	import { goto } from '$app/navigation';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { uploadBase64 } from '$lib/upload';
	import { onMount, onDestroy } from 'svelte';
	import {
		Camera,
		MapPin,
		CheckCircle,
		XCircle,
		RotateCcw,
		Send,
		User,
		Building2,
		AlertCircle,
		Sparkles,
		Clock,
		LogIn,
		LogOut,
		Navigation
	} from '@lucide/svelte';

	let { data } = $props();

	interface Work {
		name: string;
		companies: {
			name: string;
			sites: Array<{
				id: string;
				name: string;
				address: string;
			}>;
		};
	}

	interface Attendance {
		id: string;
		clock_in_ts?: string;
		clock_out_ts?: string;
	}

	let loading = $state(false);
	let sending = $state(false);
	let isWorkIn = $state(true);
	let work = $state<Work | null>(null);
	let attendance = $state<Attendance | null>(data.attendance);

	let videoElement: HTMLVideoElement | null = $state(null);
	let canvasElement: HTMLCanvasElement | null = $state(null);

	let stream: MediaStream | null = $state(null);
	let capturedImage: string | null = $state(null);

	let latitude: number | null = $state(null);
	let longitude: number | null = $state(null);

	let currentTime = $state('');

	// Update current time
	function updateTime() {
		const now = new Date();
		currentTime = now.toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	async function startCamera() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'user' }
			});
			if (videoElement) {
				videoElement.srcObject = stream;
				await videoElement.play();
			}
		} catch (err) {
			console.error('Camera access denied:', err);
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	async function getWorkIn() {
		loading = true;
		let get = await data.supabase
			.from('employees')
			.select('*, companies(*, sites(*))')
			.eq('email', data.user?.email)
			.single();

		if (get.data) {
			work = get.data;
		}

		if (get.status === 406) {
			isWorkIn = false;
		}

		loading = false;
	}

	onMount(() => {
		getWorkIn();
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (work) {
			startCamera();
		}
	});

	onDestroy(() => {
		stopCamera();
	});

	function capture() {
		if (canvasElement && videoElement) {
			const context = canvasElement.getContext('2d');
			canvasElement.width = videoElement.videoWidth;
			canvasElement.height = videoElement.videoHeight;
			if (context) {
				context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
				capturedImage = canvasElement.toDataURL('image/png');
			}
		}

		// Get location
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					latitude = pos.coords.latitude;
					longitude = pos.coords.longitude;
				},
				(err) => {
					console.error('Error getting location:', err);
					latitude = -7.250445;
					longitude = 112.768845;
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0
				}
			);
		}
	}

	function retry() {
		capturedImage = null;
		latitude = null;
		longitude = null;
		startCamera();
	}

	async function submitAbsensi() {
		sending = true;
		if (!capturedImage || !work) return;

		let payload: Record<string, unknown> = {
			site: work.companies.sites[0].id,
			email: data.user?.email,
			date: new Date().toISOString().split('T')[0],
			status: 'SUBMIT'
		};

		if (attendance) {
			payload = {
				...payload,
				clock_out_ts: new Date().toISOString(),
				clock_out_lat: latitude,
				clock_out_lng: longitude
			};
		} else {
			payload = {
				...payload,
				clock_in_ts: new Date().toISOString(),
				clock_in_lat: latitude,
				clock_in_lng: longitude
			};
		}

		try {
			const filePath = `absensi/${payload.date}_${Date.now()}.png`;
			const upload = await uploadBase64(data.supabase, capturedImage, filePath);

			if (upload) {
				if (attendance) {
					payload = { ...payload, clock_out_photo: upload.fullPath };
					const update = await data.supabase
						.from('attendances')
						.update(payload)
						.eq('id', attendance.id);
					if (update) {
						goto(`/dashboard/absensi/${payload.date}`);
					}
				} else {
					payload = { ...payload, clock_in_photo: upload.fullPath };
					const insert = await data.supabase.from('attendances').insert([payload]);
					if (insert) {
						goto(`/dashboard/absensi/${payload.date}`);
					}
				}
			}
		} catch (err) {
			console.error('Error submitting absensi:', err);
			alert('Terjadi kesalahan saat mengirim absensi.');
		}
	}

	function getCurrentDate() {
		return new Date().toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Absensi - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
	{#if loading}
		<!-- Enhanced Loading State -->
		<div class="mx-auto max-w-4xl space-y-6">
			<div class="rounded-3xl bg-white p-8 shadow-2xl">
				<Skeleton class="mb-4 h-12 w-64 rounded-xl" />
				<Skeleton class="mb-6 h-6 w-96 rounded-lg" />
				<Skeleton class="h-96 rounded-2xl" />
				<Skeleton class="mt-6 h-16 rounded-2xl" />
			</div>
		</div>
	{/if}

	{#if capturedImage}
		<!-- Captured Image Preview -->
		<div class="mx-auto max-w-4xl">
			<!-- Header -->
			<div class="mb-8 text-center">
				<div
					class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl"
				>
					<CheckCircle class="h-10 w-10 text-white" />
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">Preview Foto</h1>
				<p class="text-gray-600">Pastikan foto dan lokasi Anda sudah benar</p>
			</div>

			<!-- Preview Card -->
			<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
				<!-- Image -->
				<div class="relative">
					<img src={capturedImage} alt="Captured" class="w-full object-cover" />
					<div class="absolute top-4 right-4 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
						<p class="text-sm font-semibold text-white">{currentTime}</p>
					</div>
				</div>

				<div class="p-8">
					<!-- Location Info -->
					<div
						class={`mb-6 rounded-2xl p-6 ${latitude !== null && longitude !== null ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-pink-50'}`}
					>
						{#if latitude !== null && longitude !== null}
							<div class="flex items-start gap-4">
								<div class="rounded-xl bg-green-500 p-3">
									<Navigation class="h-6 w-6 text-white" />
								</div>
								<div class="flex-1">
									<h3 class="mb-2 flex items-center gap-2 text-lg font-bold text-green-800">
										<CheckCircle class="h-5 w-5" />
										Lokasi Berhasil Didapatkan
									</h3>
									<div class="space-y-1 text-sm text-green-700">
										<p class="flex items-center gap-2">
											<span class="font-semibold">Latitude:</span>
											<span class="rounded-lg bg-white/70 px-2 py-1">{latitude.toFixed(6)}</span>
										</p>
										<p class="flex items-center gap-2">
											<span class="font-semibold">Longitude:</span>
											<span class="rounded-lg bg-white/70 px-2 py-1">{longitude.toFixed(6)}</span>
										</p>
									</div>
									<div class="mt-3 h-64 w-full overflow-hidden rounded-xl">
										<iframe
											class="h-full w-full border-0"
											loading="lazy"
											allowfullscreen
											referrerpolicy="no-referrer-when-downgrade"
											src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
										></iframe>
									</div>
								</div>
							</div>
						{:else}
							<div class="flex items-start gap-4">
								<div class="rounded-xl bg-red-500 p-3">
									<XCircle class="h-6 w-6 text-white" />
								</div>
								<div class="flex-1">
									<h3 class="mb-1 text-lg font-bold text-red-800">Gagal Mendapatkan Lokasi</h3>
									<p class="text-sm text-red-700">
										Pastikan GPS Anda aktif dan izinkan akses lokasi
									</p>
								</div>
							</div>
						{/if}
					</div>

					<!-- Action Buttons -->
					<div class="grid gap-4 md:grid-cols-2">
						<button
							onclick={retry}
							class="group flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-6 py-4 font-bold text-gray-700 transition-all hover:scale-105 hover:border-gray-400 hover:shadow-lg active:scale-95"
						>
							<RotateCcw class="h-5 w-5 transition-transform group-hover:rotate-180" />
							Foto Ulang
						</button>

						<button
							disabled={sending}
							onclick={submitAbsensi}
							class={`group flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 ${
								sending
									? 'cursor-not-allowed bg-gray-400'
									: 'bg-gradient-to-r from-green-500 to-emerald-600'
							}`}
						>
							{#if sending}
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								Mengirimkan...
							{:else}
								<Send class="h-5 w-5 transition-transform group-hover:translate-x-1" />
								Absen Sekarang
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if !capturedImage}
		{#if work && !loading}
			<!-- Main Attendance Interface -->
			<div class="mx-auto max-w-4xl">
				<!-- Header with Time -->
				<div class="mb-8">
					<div
						class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl"
					>
						<!-- Decorative Elements -->
						<div
							class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"
						></div>
						<div
							class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"
						></div>

						<div class="relative z-10">
							<!-- Time Display -->
							<div class="mb-6 text-center">
								<div class="mb-2 flex items-center justify-center gap-2 text-white/90">
									<Clock class="h-5 w-5" />
									<span class="text-sm font-medium">{getCurrentDate()}</span>
								</div>
								<div
									class="inline-flex items-baseline gap-2 rounded-2xl bg-white/20 px-8 py-4 backdrop-blur-sm"
								>
									<span class="text-6xl font-bold text-white">{currentTime}</span>
								</div>
							</div>

							<!-- User Info -->
							<div class="flex items-center justify-center gap-4 text-white">
								<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
									<User class="h-6 w-6" />
								</div>
								<div class="text-left">
									<p class="text-lg font-bold">{work.name}</p>
									<p class="flex items-center gap-2 text-sm opacity-90">
										<Building2 class="h-4 w-4" />
										{work.companies.name}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{#if work.companies.sites.length > 0}
					<!-- Camera Section -->
					<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
						<!-- Location Info Header -->
						<div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
							<div class="flex items-center gap-3">
								<div class="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
									<MapPin class="h-6 w-6 text-white" />
								</div>
								<div class="text-white">
									<h3 class="text-lg font-bold">{work.companies.sites[0].name}</h3>
									<p class="text-sm opacity-90">{work.companies.sites[0].address}</p>
								</div>
							</div>
						</div>

						<!-- Camera Feed -->
						<div class="relative">
							<video
								bind:this={videoElement}
								autoplay
								playsinline
								class="w-full bg-black"
								style="aspect-ratio: 4/3;"
							>
								<track kind="captions" />
							</video>
							<canvas bind:this={canvasElement} class="hidden"></canvas>

							<!-- Camera Overlay -->
							<div class="pointer-events-none absolute inset-0">
								<!-- Corner Frames -->
								<div
									class="absolute top-8 left-8 h-16 w-16 border-t-4 border-l-4 border-white"
								></div>
								<div
									class="absolute top-8 right-8 h-16 w-16 border-t-4 border-r-4 border-white"
								></div>
								<div
									class="absolute bottom-8 left-8 h-16 w-16 border-b-4 border-l-4 border-white"
								></div>
								<div
									class="absolute right-8 bottom-8 h-16 w-16 border-r-4 border-b-4 border-white"
								></div>

								<!-- Center Guide -->
								<div class="absolute inset-0 flex items-center justify-center">
									<div class="rounded-full border-2 border-white p-2">
										<User class="h-8 w-8 text-white" />
									</div>
								</div>

								<!-- Status Badge -->
								<div class="absolute top-4 left-4">
									<div
										class="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm"
									>
										<div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
										<span class="text-sm font-semibold text-white">Live</span>
									</div>
								</div>

								<!-- Clock Type Badge -->
								<div class="absolute top-4 right-4">
									<div
										class={`flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm ${attendance ? 'bg-red-500/80' : 'bg-green-500/80'}`}
									>
										{#if attendance}
											<LogOut class="h-4 w-4 text-white" />
											<span class="text-sm font-bold text-white">Clock Out</span>
										{:else}
											<LogIn class="h-4 w-4 text-white" />
											<span class="text-sm font-bold text-white">Clock In</span>
										{/if}
									</div>
								</div>
							</div>
						</div>

						<!-- Capture Button -->
						<div class="p-8">
							<button
								onclick={capture}
								class={`group relative w-full overflow-hidden rounded-2xl py-6 font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95 ${
									attendance
										? 'bg-gradient-to-r from-red-500 to-pink-600'
										: 'bg-gradient-to-r from-green-500 to-emerald-600'
								}`}
							>
								<span class="relative z-10 flex items-center justify-center gap-3 text-xl">
									<Camera class="h-6 w-6 transition-transform group-hover:rotate-12" />
									{attendance ? 'Ambil Foto Clock Out' : 'Ambil Foto Clock In'}
								</span>
								<!-- Animated background -->
								<div
									class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
								></div>
							</button>

							<!-- Info Box -->
							<div class="mt-6 rounded-2xl bg-blue-50 p-4">
								<div class="flex items-start gap-3">
									<div class="rounded-lg bg-blue-500 p-2">
										<Sparkles class="h-5 w-5 text-white" />
									</div>
									<div class="flex-1">
										<h4 class="mb-1 font-semibold text-blue-900">Tips Absensi</h4>
										<ul class="space-y-1 text-sm text-blue-800">
											<li class="flex items-start gap-2">
												<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0" />
												<span>Pastikan wajah Anda terlihat jelas</span>
											</li>
											<li class="flex items-start gap-2">
												<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0" />
												<span>Aktifkan GPS untuk verifikasi lokasi</span>
											</li>
											<li class="flex items-start gap-2">
												<CheckCircle class="mt-0.5 h-4 w-4 flex-shrink-0" />
												<span>Pastikan pencahayaan cukup terang</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<!-- No Location Error -->
					<div class="rounded-3xl bg-white p-12 text-center shadow-2xl">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100"
						>
							<AlertCircle class="h-10 w-10 text-orange-600" />
						</div>
						<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Lokasi Kerja</h3>
						<p class="text-gray-600">Silakan hubungi admin untuk menambahkan lokasi kerja Anda.</p>
					</div>
				{/if}
			</div>
		{/if}

		{#if isWorkIn === false}
			<!-- Not Employed Error -->
			<div class="mx-auto max-w-2xl">
				<div class="rounded-3xl bg-white p-12 text-center shadow-2xl">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100"
					>
						<XCircle class="h-10 w-10 text-red-600" />
					</div>
					<h3 class="mb-2 text-xl font-bold text-gray-800">Tidak Terdaftar</h3>
					<p class="mb-6 text-gray-600">
						Anda tidak terdaftar di perusahaan manapun. Silakan hubungi admin untuk pendaftaran.
					</p>
					<button
						onclick={() => goto('/dashboard')}
						class="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
					>
						Kembali ke Dashboard
					</button>
				</div>
			</div>
		{/if}
	{/if}
</main>
