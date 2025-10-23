<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		MapPin,
		Navigation,
		Ruler,
		Save,
		Trash2,
		ArrowLeft,
		AlertCircle,
		CheckCircle,
		Map,
		Sparkles,
		Target,
		Globe
	} from '@lucide/svelte';

	let { data } = $props();

	let siteName = $state(data.site.name);
	let siteLat = $state(data.site.latitude);
	let siteLng = $state(data.site.longitude);
	let siteAddress = $state(data.site.address);
	let siteRadius = $state(data.site.radius);
	let isDeleting = $state(false);
	let isSaving = $state(false);
	let showDeleteConfirm = $state(false);

	async function handleDelete() {
		isDeleting = true;
		const { error } = await data.supabase.from('sites').delete().eq('id', data.site.id);

		if (error) {
			console.error(error);
			alert('Gagal menghapus lokasi. Silakan coba lagi.');
			isDeleting = false;
		} else {
			goto('/dashboard/karyawan');
		}
	}

	async function handleEdit(e: Event) {
		e.preventDefault();
		isSaving = true;

		let body = {
			name: siteName,
			address: siteAddress,
			radius: siteRadius,
			latitude: siteLat,
			longitude: siteLng
		};

		const { error } = await data.supabase.from('sites').update(body).eq('id', data.site.id);

		if (error) {
			console.error(error);
			alert('Gagal menyimpan perubahan. Silakan coba lagi.');
			isSaving = false;
		} else {
			goto('/dashboard/karyawan');
		}
	}

	function getCurrentLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					siteLat = position.coords.latitude;
					siteLng = position.coords.longitude;
					alert('Lokasi berhasil dideteksi!');
				},
				(error) => {
					console.error(error);
					alert('Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.');
				}
			);
		} else {
			alert('Browser Anda tidak mendukung Geolocation API.');
		}
	}
</script>

<svelte:head>
	<title>Edit Lokasi - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 flex items-center justify-between">
			<button
				type="button"
				onclick={() => goto('/dashboard/karyawan')}
				class="group flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-gray-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
			>
				<ArrowLeft class="h-5 w-5 transition-transform group-hover:-translate-x-1" />
				Kembali
			</button>

			<div class="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 shadow-lg">
				<MapPin class="h-5 w-5 text-green-600" />
				<span class="font-semibold text-gray-800">Edit Lokasi</span>
			</div>
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
			<!-- Header Section -->
			<div
				class="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8"
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
						<Map class="h-10 w-10 text-white" />
					</div>
					<h1 class="mb-2 text-3xl font-bold text-white">Edit Lokasi Kerja</h1>
					<p class="text-lg text-white/90">Perbarui informasi lokasi dan radius geofence</p>
				</div>
			</div>

			<!-- Form Section -->
			<form onsubmit={handleEdit} class="p-8">
				<!-- Info Banner -->
				<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 p-6">
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-green-500 p-2">
							<Sparkles class="h-5 w-5 text-white" />
						</div>
						<div>
							<p class="font-semibold text-gray-900">Tips Geofence</p>
							<p class="text-sm text-gray-600">
								Pastikan koordinat GPS dan radius akurat. Radius menentukan area validasi absensi
								karyawan.
							</p>
						</div>
					</div>
				</div>

				<div class="space-y-6">
					<!-- Location Name -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<MapPin class="h-4 w-4 text-green-600" />
							Nama Lokasi
						</label>
						<input
							type="text"
							bind:value={siteName}
							placeholder="Masukkan nama lokasi"
							required
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
						/>
					</div>

					<!-- GPS Coordinates -->
					<div class="rounded-2xl bg-gray-50 p-6">
						<div class="mb-4 flex items-center justify-between">
							<h3 class="flex items-center gap-2 font-semibold text-gray-900">
								<Navigation class="h-5 w-5 text-emerald-600" />
								Koordinat GPS
							</h3>
							<button
								type="button"
								onclick={getCurrentLocation}
								class="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-600"
							>
								<Target class="h-4 w-4" />
								Deteksi Lokasi
							</button>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<Globe class="h-4 w-4 text-blue-600" />
									Latitude
								</label>
								<input
									type="number"
									step="any"
									bind:value={siteLat}
									placeholder="-6.200000"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
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
									placeholder="106.816666"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
								/>
							</div>
						</div>

						<div class="mt-4 rounded-lg bg-blue-50 p-3">
							<p class="text-xs text-blue-700">
								<CheckCircle class="mr-1 inline h-3 w-3" />
								Koordinat saat ini: {siteLat}, {siteLng}
							</p>
						</div>
					</div>

					<!-- Radius -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Ruler class="h-4 w-4 text-orange-600" />
							Radius Geofence (meter)
						</label>
						<input
							type="number"
							bind:value={siteRadius}
							placeholder="100"
							min="10"
							max="1000"
							required
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none"
						/>
						<div class="mt-2 flex items-center gap-2">
							<div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
								<div
									class="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
									style="width: {Math.min((siteRadius / 1000) * 100, 100)}%"
								></div>
							</div>
							<span class="text-sm font-semibold text-gray-700">{siteRadius}m</span>
						</div>
						<p class="mt-2 text-xs text-gray-500">
							Radius menentukan area di mana karyawan dapat melakukan absensi (10-1000 meter)
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
							placeholder="Masukkan alamat lengkap lokasi"
							required
							rows="4"
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
						></textarea>
					</div>
				</div>

				<!-- Save Button -->
				<button
					type="submit"
					disabled={isSaving}
					class="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
				>
					{#if isSaving}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
						></div>
						Menyimpan...
					{:else}
						<Save class="h-5 w-5" />
						Simpan Perubahan
					{/if}
				</button>
			</form>

			<!-- Danger Zone -->
			<div class="border-t-2 border-gray-100 bg-gray-50 p-8">
				<div class="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
					<div class="mb-4 flex items-start gap-3">
						<div class="rounded-lg bg-red-500 p-2">
							<AlertCircle class="h-5 w-5 text-white" />
						</div>
						<div class="flex-1">
							<h3 class="mb-1 text-lg font-bold text-red-900">Danger Zone</h3>
							<p class="text-sm text-red-700">
								Menghapus lokasi akan menghapus semua data absensi terkait. Tindakan ini tidak dapat
								dibatalkan!
							</p>
						</div>
					</div>

					{#if !showDeleteConfirm}
						<button
							type="button"
							onclick={() => (showDeleteConfirm = true)}
							class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-white px-6 py-3 font-bold text-red-600 transition-all hover:bg-red-50"
						>
							<Trash2 class="h-5 w-5" />
							Hapus Lokasi
						</button>
					{:else}
						<div class="space-y-3">
							<p class="text-center font-semibold text-red-900">
								Apakah Anda yakin ingin menghapus lokasi ini?
							</p>
							<div class="flex gap-3">
								<button
									type="button"
									onclick={() => (showDeleteConfirm = false)}
									class="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50"
								>
									Batal
								</button>
								<button
									type="button"
									onclick={handleDelete}
									disabled={isDeleting}
									class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
								>
									{#if isDeleting}
										<div
											class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
										></div>
										Menghapus...
									{:else}
										<Trash2 class="h-5 w-5" />
										Ya, Hapus
									{/if}
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Additional Info Cards -->
		<div class="mt-6 grid gap-4 md:grid-cols-3">
			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<div class="flex items-start gap-3">
					<div class="rounded-lg bg-green-100 p-2">
						<Target class="h-5 w-5 text-green-600" />
					</div>
					<div>
						<p class="font-semibold text-gray-900">Akurasi GPS</p>
						<p class="text-sm text-gray-600">
							Koordinat divalidasi saat absensi untuk akurasi maksimal
						</p>
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<div class="flex items-start gap-3">
					<div class="rounded-lg bg-orange-100 p-2">
						<Ruler class="h-5 w-5 text-orange-600" />
					</div>
					<div>
						<p class="font-semibold text-gray-900">Radius Fleksibel</p>
						<p class="text-sm text-gray-600">Sesuaikan radius dengan luas area kantor Anda</p>
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<div class="flex items-start gap-3">
					<div class="rounded-lg bg-blue-100 p-2">
						<CheckCircle class="h-5 w-5 text-blue-600" />
					</div>
					<div>
						<p class="font-semibold text-gray-900">Data Aman</p>
						<p class="text-sm text-gray-600">Semua perubahan tersimpan dengan aman</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
