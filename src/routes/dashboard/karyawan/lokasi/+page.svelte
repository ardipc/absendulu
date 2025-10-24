<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		MapPin,
		Navigation,
		Ruler,
		MapPinned,
		Globe,
		ArrowLeft,
		Save,
		Loader2,
		Sparkles,
		Info,
		CheckCircle,
		AlertCircle
	} from '@lucide/svelte';

	let { data } = $props();

	let siteName = $state('');
	let siteLat = $state(0);
	let siteLng = $state(0);
	let siteAddress = $state('');
	let siteRadius = $state(100);
	let isSubmitting = $state(false);
	let isLoadingLocation = $state(false);
	let locationError = $state('');

	onMount(() => {
		// Ambil lokasi sekali
		if ('geolocation' in navigator) {
			isLoadingLocation = true;
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					siteLat = pos.coords.latitude;
					siteLng = pos.coords.longitude;
					isLoadingLocation = false;
					locationError = '';
				},
				(err) => {
					console.error('Error getting location:', err);
					siteLat = -7.250445; // Contoh fallback
					siteLng = 112.768845;
					isLoadingLocation = false;
					locationError = 'Tidak dapat mengambil lokasi otomatis. Gunakan koordinat default.';
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0
				}
			);
		}
	});

	function getCurrentLocation() {
		if ('geolocation' in navigator) {
			isLoadingLocation = true;
			locationError = '';
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					siteLat = pos.coords.latitude;
					siteLng = pos.coords.longitude;
					isLoadingLocation = false;
				},
				(err) => {
					console.error('Error getting location:', err);
					isLoadingLocation = false;
					locationError = 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.';
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0
				}
			);
		} else {
			locationError = 'Browser tidak mendukung geolocation.';
		}
	}

	async function createSite(e: Event) {
		e.preventDefault();

		if (!siteName || !siteAddress || !siteRadius || !siteLat || !siteLng) {
			alert('Semua form harus diisi');
			return;
		}

		isSubmitting = true;

		let body = {
			company: data.company.id,
			name: siteName,
			address: siteAddress,
			radius: siteRadius,
			latitude: siteLat,
			longitude: siteLng
		};

		const { error } = await data.supabase.from('sites').insert([body]).select();

		if (error) {
			console.log(error);
			alert('Gagal menyimpan lokasi. Silakan coba lagi.');
			isSubmitting = false;
		} else {
			goto(`/dashboard/karyawan`);
		}
	}
</script>

<svelte:head>
	<title>Tambah Lokasi - AbsenDulu</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
	<!-- Decorative Background Elements -->
	<div
		class="fixed -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 opacity-10 blur-3xl"
	></div>
	<div
		class="fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 opacity-10 blur-3xl"
	></div>

	<div class="relative mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8">
			<button
				type="button"
				onclick={() => goto('/dashboard/karyawan')}
				class="group mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-gray-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
			>
				<ArrowLeft class="h-5 w-5 transition-transform group-hover:-translate-x-1" />
				Kembali
			</button>

			<div class="flex items-center justify-between">
				<div>
					<h1 class="mb-2 text-4xl font-bold text-gray-900">Tambah Lokasi Baru</h1>
					<p class="text-lg text-gray-600">
						Tentukan lokasi absensi dengan koordinat GPS dan geofence
					</p>
				</div>
				<div
					class="hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 shadow-lg md:block"
				>
					<MapPin class="h-10 w-10 text-white" />
				</div>
			</div>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
			<!-- Header Section -->
			<div
				class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8"
			>
				<!-- Decorative Elements -->
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div
					class="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5"
				></div>

				<div class="relative z-10 text-center">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
					>
						<MapPinned class="h-10 w-10 text-white" />
					</div>
					<h2 class="mb-2 text-3xl font-bold text-white">Lokasi Absensi</h2>
					<p class="text-lg text-white/90">
						Karyawan hanya dapat absen dalam radius yang ditentukan
					</p>
				</div>
			</div>

			<!-- Form Section -->
			<form onsubmit={createSite} class="p-8">
				<!-- Info Banner -->
				<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-blue-500 p-2">
							<Info class="h-5 w-5 text-white" />
						</div>
						<div>
							<p class="font-semibold text-gray-900">Tips Pengaturan Lokasi</p>
							<p class="text-sm text-gray-600">
								Gunakan tombol "Ambil Lokasi Saat Ini" untuk mendapatkan koordinat GPS secara
								otomatis, atau masukkan koordinat secara manual.
							</p>
						</div>
					</div>
				</div>

				<div class="space-y-6">
					<!-- Location Name -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<MapPin class="h-4 w-4 text-blue-600" />
							Nama Lokasi
						</label>
						<input
							type="text"
							bind:value={siteName}
							placeholder="Kantor Pusat, Cabang Jakarta, dll"
							required
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
						/>
					</div>

					<!-- GPS Coordinates Section -->
					<div
						class="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-6"
					>
						<div class="mb-4 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Globe class="h-5 w-5 text-indigo-600" />
								<h3 class="font-bold text-gray-900">Koordinat GPS</h3>
							</div>
							<button
								type="button"
								onclick={getCurrentLocation}
								disabled={isLoadingLocation}
								class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
							>
								{#if isLoadingLocation}
									<Loader2 class="h-4 w-4 animate-spin" />
									Mengambil...
								{:else}
									<Navigation class="h-4 w-4" />
									Ambil Lokasi Saat Ini
								{/if}
							</button>
						</div>

						{#if locationError}
							<div class="mb-4 flex items-start gap-2 rounded-lg bg-yellow-50 p-3">
								<AlertCircle class="h-5 w-5 flex-shrink-0 text-yellow-600" />
								<p class="text-sm text-yellow-800">{locationError}</p>
							</div>
						{/if}

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<Globe class="h-4 w-4 text-green-600" />
									Latitude
								</label>
								<input
									type="number"
									step="any"
									bind:value={siteLat}
									placeholder="-7.250445"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-3 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
								/>
							</div>

							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<Globe class="h-4 w-4 text-purple-600" />
									Longitude
								</label>
								<input
									type="number"
									step="any"
									bind:value={siteLng}
									placeholder="112.768845"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-3 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
								/>
							</div>
						</div>

						<div class="mt-4 rounded-lg bg-blue-50 p-3">
							<div class="flex items-start gap-2">
								<CheckCircle class="h-4 w-4 flex-shrink-0 text-blue-600" />
								<p class="text-xs text-blue-800">
									Koordinat saat ini: <strong>{siteLat.toFixed(6)}, {siteLng.toFixed(6)}</strong>
								</p>
							</div>
						</div>
					</div>

					<!-- Radius -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Ruler class="h-4 w-4 text-orange-600" />
							Radius Geofence (meter)
						</label>
						<div class="space-y-3">
							<input
								type="range"
								bind:value={siteRadius}
								min="10"
								max="1000"
								step="10"
								class="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-orange-200 to-red-200"
								style="background: linear-gradient(to right, #fed7aa 0%, #fed7aa {(siteRadius /
									1000) *
									100}%, #e5e7eb {(siteRadius / 1000) * 100}%, #e5e7eb 100%);"
							/>
							<div class="flex items-center justify-between">
								<span class="text-sm text-gray-600">10m</span>
								<div
									class="rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2 font-bold text-white shadow-lg"
								>
									{siteRadius} meter
								</div>
								<span class="text-sm text-gray-600">1000m</span>
							</div>
						</div>
						<p class="mt-2 text-xs text-gray-500">
							Karyawan harus berada dalam radius <strong>{siteRadius} meter</strong> dari lokasi ini
							untuk dapat melakukan absensi
						</p>
					</div>

					<!-- Address -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<MapPin class="h-4 w-4 text-pink-600" />
							Alamat Lengkap
						</label>
						<textarea
							bind:value={siteAddress}
							placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi"
							required
							rows="4"
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
						></textarea>
					</div>
				</div>

				<!-- Submit Button -->
				<button
					type="submit"
					disabled={isSubmitting}
					class="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				>
					{#if isSubmitting}
						<Loader2 class="h-5 w-5 animate-spin" />
						Menyimpan...
					{:else}
						<Save class="h-5 w-5" />
						Simpan Lokasi
					{/if}
				</button>
			</form>

			<!-- Footer Info -->
			<div class="border-t-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 p-6">
				<div class="flex items-start gap-3">
					<Sparkles class="h-5 w-5 flex-shrink-0 text-blue-600" />
					<div>
						<p class="font-semibold text-gray-900">Geofence Technology</p>
						<p class="text-sm text-gray-600">
							Sistem akan secara otomatis memvalidasi lokasi karyawan saat melakukan absensi
							menggunakan teknologi GPS geofencing
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Info Cards -->
		<div class="mt-6 grid gap-4 md:grid-cols-3">
			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
					<MapPin class="h-6 w-6 text-blue-600" />
				</div>
				<h3 class="mb-2 font-bold text-gray-900">GPS Akurat</h3>
				<p class="text-sm text-gray-600">
					Menggunakan koordinat GPS dengan akurasi tinggi untuk menentukan lokasi
				</p>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
					<Ruler class="h-6 w-6 text-green-600" />
				</div>
				<h3 class="mb-2 font-bold text-gray-900">Radius Fleksibel</h3>
				<p class="text-sm text-gray-600">
					Atur radius geofence dari 10 meter hingga 1 kilometer sesuai kebutuhan
				</p>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
					<Globe class="h-6 w-6 text-purple-600" />
				</div>
				<h3 class="mb-2 font-bold text-gray-900">Multi Lokasi</h3>
				<p class="text-sm text-gray-600">
					Tambahkan beberapa lokasi untuk cabang atau area kerja yang berbeda
				</p>
			</div>
		</div>
	</div>
</div>
