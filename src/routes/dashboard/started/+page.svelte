<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		Building2,
		MapPin,
		Users,
		CheckCircle,
		ArrowRight,
		ArrowLeft,
		Save,
		Loader2,
		Sparkles,
		Globe,
		Phone,
		Mail,
		User,
		Briefcase,
		Shield
	} from '@lucide/svelte';

	let { data } = $props();

	let currentStep = $state(1);
	let isSubmitting = $state(false);

	// Company data
	let companyName = $state('');
	let companyAddress = $state('');
	let companyPhone = $state('');
	let companyId = $state<string | null>(null);

	// Location data
	let locationName = $state('');
	let locationAddress = $state('');
	let latitude = $state<number>(0);
	let longitude = $state<number>(0);
	let locationRadius = $state(100);
	let locationId = $state<string | null>(null);

	// Employee data
	let employeeName = $state('');
	let employeeEmail = $state('');
	let employeeRole = $state('');
	let employeePhone = $state('');

	const steps = [
		{
			number: 1,
			title: 'Buat Company',
			description: 'Daftarkan perusahaan Anda',
			icon: Building2,
			color: 'from-blue-500 to-cyan-500'
		},
		{
			number: 2,
			title: 'Tambah Lokasi',
			description: 'Tentukan lokasi absensi',
			icon: MapPin,
			color: 'from-green-500 to-emerald-500'
		},
		{
			number: 3,
			title: 'Entry Karyawan',
			description: 'Tambahkan karyawan pertama',
			icon: Users,
			color: 'from-purple-500 to-pink-500'
		}
	];

	const roles = [
		{ value: 'staff', label: 'Staff', icon: User, color: 'from-blue-500 to-cyan-500' },
		{
			value: 'supervisor',
			label: 'Supervisor',
			icon: Shield,
			color: 'from-green-500 to-emerald-500'
		},
		{ value: 'manager', label: 'Manager', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
		{ value: 'admin', label: 'Admin', icon: Sparkles, color: 'from-orange-500 to-red-500' }
	];

	onMount(() => {
		// Check if walkthrough is already completed
		const walkthroughCompleted = localStorage.getItem('walkthrough_completed');
		if (walkthroughCompleted === 'true') {
			goto('/dashboard');
		}
	});

	function nextStep() {
		if (currentStep < 3) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function getCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
				},
				(error) => {
					console.error('Error getting location:', error);
					latitude = -7.250445;
					longitude = 112.768845;
					alert('Tidak dapat mengambil lokasi. Pastikan Anda memberikan izin akses lokasi.');
				}
			);
		} else {
			alert('Geolocation tidak didukung oleh browser Anda.');
		}
	}

	async function handleCompanySubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		try {
			if (!data?.user) {
				alert('Sesi Anda telah berakhir. Silakan login kembali.');
				goto('/login');
				return;
			}

			const { data: companyData, error } = await data.supabase
				.from('companies')
				.insert([
					{
						name: companyName,
						description: companyAddress,
						owner: data.user?.email
					}
				])
				.select()
				.single();

			if (error) {
				console.error('Error creating company:', error);
				alert('Gagal membuat company. Silakan coba lagi.');
			} else {
				companyId = companyData.id;
				nextStep();
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			alert('Terjadi kesalahan. Silakan coba lagi.');
		} finally {
			isSubmitting = false;
		}
	}

	async function handleLocationSubmit(e: Event) {
		e.preventDefault();

		if (!companyId) {
			alert('Company ID tidak ditemukan. Silakan mulai dari awal.');
			currentStep = 1;
			return;
		}

		isSubmitting = true;

		try {
			const { data: result, error } = await data.supabase
				.from('sites')
				.insert([
					{
						name: locationName,
						latitude: parseFloat(latitude),
						longitude: parseFloat(longitude),
						radius: locationRadius,
						company: companyId,
						address: locationAddress
					}
				])
				.select()
				.single();

			if (error) {
				console.error('Error creating location:', error);
				alert('Gagal membuat lokasi. Silakan coba lagi.');
			} else {
				locationId = result.id;
				nextStep();
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			alert('Terjadi kesalahan. Silakan coba lagi.');
		} finally {
			isSubmitting = false;
		}
	}

	async function handleEmployeeSubmit(e: Event) {
		e.preventDefault();

		if (!companyId) {
			alert('Company ID tidak ditemukan. Silakan mulai dari awal.');
			currentStep = 1;
			return;
		}

		isSubmitting = true;

		try {
			const { error } = await data.supabase.from('employees').insert([
				{
					name: employeeName,
					email: employeeEmail,
					role: employeeRole,
					phone: employeePhone,
					company: companyId
				}
			]);

			if (error) {
				console.error('Error creating employee:', error);
				alert('Gagal menambahkan karyawan. Silakan coba lagi.');
				isSubmitting = false;
			} else {
				// Mark walkthrough as completed
				localStorage.setItem('walkthrough_completed', 'true');
				localStorage.setItem('company_id', companyId);

				// Show success message and redirect
				alert('Setup berhasil! Selamat datang di AbsenDulu 🎉');
				goto('/dashboard');
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			alert('Terjadi kesalahan. Silakan coba lagi.');
			isSubmitting = false;
		}
	}

	function skipWalkthrough() {
		if (
			confirm(
				'Apakah Anda yakin ingin melewati walkthrough? Anda dapat mengatur ini nanti di dashboard.'
			)
		) {
			localStorage.setItem('walkthrough_completed', 'true');
			goto('/dashboard');
		}
	}
</script>

<svelte:head>
	<title>Mulai Menggunakan AbsenDulu - Setup Awal</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="mb-8 text-center">
			<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-lg">
				<Sparkles class="h-5 w-5 text-indigo-600" />
				<span class="font-bold text-gray-800">Selamat Datang di AbsenDulu</span>
			</div>
			<h1 class="mb-2 text-4xl font-bold text-gray-900">Ayo Mulai Setup 🚀</h1>
			<p class="text-lg text-gray-600">
				Ikuti 3 langkah mudah untuk mulai menggunakan sistem absensi
			</p>
		</div>

		<!-- Progress Steps -->
		<div class="mb-8 flex items-center justify-center gap-4">
			{#each steps as step, index}
				{@const StepIcon = step.icon}
				<div class="flex items-center gap-4">
					<div class="flex flex-col items-center">
						<button
							type="button"
							onclick={() => {
								if (step.number < currentStep) {
									currentStep = step.number;
								}
							}}
							class={`group relative flex h-16 w-16 items-center justify-center rounded-full transition-all ${
								currentStep === step.number
									? `bg-gradient-to-br ${step.color} scale-110 shadow-lg`
									: currentStep > step.number
										? 'cursor-pointer bg-gradient-to-br from-green-500 to-emerald-500 shadow-md hover:scale-105'
										: 'bg-gray-300'
							}`}
						>
							{#if currentStep > step.number}
								<CheckCircle class="h-8 w-8 text-white" />
							{:else}
								<StepIcon class="h-8 w-8 text-white" />
							{/if}

							<!-- Tooltip -->
							<div
								class="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
							>
								{step.title}
							</div>
						</button>
						<span
							class={`mt-2 text-xs font-semibold ${currentStep === step.number ? 'text-gray-900' : 'text-gray-500'}`}
						>
							Step {step.number}
						</span>
					</div>

					{#if index < steps.length - 1}
						<div
							class={`h-1 w-12 rounded transition-all ${currentStep > step.number ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'}`}
						></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Main Card -->
		<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
			<!-- Step 1: Create Company -->
			{#if currentStep === 1}
				<div
					class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 p-8"
				>
					<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
					<div
						class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"
					></div>

					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
						>
							<Building2 class="h-10 w-10 text-white" />
						</div>
						<h2 class="mb-2 text-3xl font-bold text-white">Buat Company</h2>
						<p class="text-lg text-white/90">Daftarkan informasi perusahaan Anda</p>
					</div>
				</div>

				<form onsubmit={handleCompanySubmit} class="p-8">
					<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
						<div class="flex items-start gap-3">
							<div class="rounded-lg bg-blue-500 p-2">
								<Sparkles class="h-5 w-5 text-white" />
							</div>
							<div>
								<p class="font-semibold text-gray-900">Langkah Pertama</p>
								<p class="text-sm text-gray-600">
									Masukkan informasi dasar perusahaan Anda untuk memulai
								</p>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Building2 class="h-4 w-4 text-blue-600" />
								Nama Perusahaan
							</label>
							<input
								type="text"
								bind:value={companyName}
								placeholder="PT. Contoh Perusahaan"
								required
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
							/>
						</div>

						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<MapPin class="h-4 w-4 text-cyan-600" />
								Alamat
							</label>
							<textarea
								bind:value={companyAddress}
								placeholder="Jl. Contoh No. 123, Jakarta"
								required
								rows="3"
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none"
							></textarea>
						</div>
					</div>

					<div class="mt-8 flex gap-4">
						<button
							type="button"
							onclick={skipWalkthrough}
							class="flex-1 rounded-2xl border-2 border-gray-300 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50"
						>
							Lewati
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
						>
							{#if isSubmitting}
								<Loader2 class="h-5 w-5 animate-spin" />
								Menyimpan...
							{:else}
								Lanjutkan
								<ArrowRight class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</form>
			{/if}

			<!-- Step 2: Add Location -->
			{#if currentStep === 2}
				<div
					class="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 p-8"
				>
					<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
					<div
						class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"
					></div>

					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
						>
							<MapPin class="h-10 w-10 text-white" />
						</div>
						<h2 class="mb-2 text-3xl font-bold text-white">Tambah Lokasi</h2>
						<p class="text-lg text-white/90">Tentukan lokasi absensi dengan koordinat GPS</p>
					</div>
				</div>

				<form onsubmit={handleLocationSubmit} class="p-8">
					<div class="mb-8 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6">
						<div class="flex items-start gap-3">
							<div class="rounded-lg bg-green-500 p-2">
								<Globe class="h-5 w-5 text-white" />
							</div>
							<div>
								<p class="font-semibold text-gray-900">Lokasi Absensi</p>
								<p class="text-sm text-gray-600">
									Karyawan hanya bisa absen dalam radius yang ditentukan dari lokasi ini
								</p>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<MapPin class="h-4 w-4 text-green-600" />
								Nama Lokasi
							</label>
							<input
								type="text"
								bind:value={locationName}
								placeholder="Kantor Pusat"
								required
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
							/>
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<Globe class="h-4 w-4 text-blue-600" />
									Latitude
								</label>
								<input
									type="text"
									bind:value={latitude}
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
									type="text"
									bind:value={longitude}
									placeholder="106.816666"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
								/>
							</div>

							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<MapPin class="h-4 w-4 text-cyan-600" />
									Alamat
								</label>
								<textarea
									bind:value={locationAddress}
									placeholder="Jl. Contoh No. 123, Jakarta"
									required
									rows="3"
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 focus:outline-none"
								></textarea>
							</div>
						</div>

						<button
							type="button"
							onclick={getCurrentLocation}
							class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500 bg-green-50 py-3 font-semibold text-green-700 transition-all hover:bg-green-100"
						>
							<MapPin class="h-5 w-5" />
							Gunakan Lokasi Saat Ini
						</button>

						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<MapPin class="h-4 w-4 text-orange-600" />
								Radius (meter)
							</label>
							<input
								type="number"
								bind:value={locationRadius}
								min="10"
								max="1000"
								required
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none"
							/>
							<p class="mt-2 text-xs text-gray-500">
								Karyawan harus berada dalam radius {locationRadius} meter untuk dapat absen
							</p>
						</div>
					</div>

					<div class="mt-8 flex gap-4">
						<button
							type="button"
							onclick={prevStep}
							class="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 px-6 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50"
						>
							<ArrowLeft class="h-5 w-5" />
							Kembali
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
						>
							{#if isSubmitting}
								<Loader2 class="h-5 w-5 animate-spin" />
								Menyimpan...
							{:else}
								Lanjutkan
								<ArrowRight class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</form>
			{/if}

			<!-- Step 3: Add Employee -->
			{#if currentStep === 3}
				<div
					class="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-8"
				>
					<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
					<div
						class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"
					></div>

					<div class="relative z-10 text-center">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
						>
							<Users class="h-10 w-10 text-white" />
						</div>
						<h2 class="mb-2 text-3xl font-bold text-white">Entry Karyawan</h2>
						<p class="text-lg text-white/90">Tambahkan karyawan pertama Anda</p>
					</div>
				</div>

				<form onsubmit={handleEmployeeSubmit} class="p-8">
					<div class="mb-8 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-6">
						<div class="flex items-start gap-3">
							<div class="rounded-lg bg-purple-500 p-2">
								<Users class="h-5 w-5 text-white" />
							</div>
							<div>
								<p class="font-semibold text-gray-900">Langkah Terakhir</p>
								<p class="text-sm text-gray-600">
									Tambahkan karyawan pertama. Anda dapat menambahkan lebih banyak nanti
								</p>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<User class="h-4 w-4 text-purple-600" />
								Nama Lengkap
							</label>
							<input
								type="text"
								bind:value={employeeName}
								placeholder="John Doe"
								required
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
							/>
						</div>

						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Mail class="h-4 w-4 text-pink-600" />
								Email
							</label>
							<input
								type="email"
								bind:value={employeeEmail}
								placeholder="john@example.com"
								required
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
							/>
							<p class="mt-2 flex items-center gap-1 text-xs text-gray-500">
								<CheckCircle class="h-3 w-3" />
								Email akan digunakan untuk login karyawan
							</p>
						</div>

						<div>
							<label class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Briefcase class="h-4 w-4 text-indigo-600" />
								Role / Jabatan
							</label>
							<div class="grid gap-3 md:grid-cols-2">
								{#each roles as roleOption (roleOption.value)}
									{@const RoleIcon = roleOption.icon}
									<button
										type="button"
										onclick={() => (employeeRole = roleOption.value)}
										class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
											employeeRole === roleOption.value
												? 'border-purple-500 bg-purple-50 shadow-lg'
												: 'border-gray-200 bg-white hover:border-purple-300'
										}`}
									>
										<div
											class={`rounded-lg p-2 ${employeeRole === roleOption.value ? `bg-gradient-to-br ${roleOption.color}` : 'bg-gray-100 group-hover:bg-gray-200'}`}
										>
											<RoleIcon
												class={`h-5 w-5 ${employeeRole === roleOption.value ? 'text-white' : 'text-gray-600'}`}
											/>
										</div>
										<span
											class={`font-semibold ${employeeRole === roleOption.value ? 'text-purple-700' : 'text-gray-700'}`}
											>{roleOption.label}</span
										>
									</button>
								{/each}
							</div>
							{#if !employeeRole}
								<p class="mt-2 text-xs text-red-600">* Pilih salah satu role</p>
							{/if}
						</div>

						<div>
							<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Phone class="h-4 w-4 text-green-600" />
								Nomor Telepon
							</label>
							<input
								type="tel"
								bind:value={employeePhone}
								placeholder="081234567890"
								required
								class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
							/>
						</div>
					</div>

					<div class="mt-8 flex gap-4">
						<button
							type="button"
							onclick={prevStep}
							class="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 px-6 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50"
						>
							<ArrowLeft class="h-5 w-5" />
							Kembali
						</button>
						<button
							type="submit"
							disabled={isSubmitting || !employeeRole}
							class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
						>
							{#if isSubmitting}
								<Loader2 class="h-5 w-5 animate-spin" />
								Menyimpan...
							{:else}
								<Save class="h-5 w-5" />
								Selesai & Mulai
							{/if}
						</button>
					</div>
				</form>
			{/if}
		</div>

		<!-- Help Section -->
		<div class="mt-8 rounded-2xl bg-white p-6 shadow-lg">
			<div class="flex items-start gap-4">
				<div class="rounded-lg bg-indigo-100 p-3">
					<Sparkles class="h-6 w-6 text-indigo-600" />
				</div>
				<div>
					<p class="mb-1 font-bold text-gray-900">Butuh Bantuan?</p>
					<p class="text-sm text-gray-600">
						Jika Anda mengalami kesulitan, hubungi tim support kami di{' '}
						<a
							href="mailto:support@absendulu.com"
							class="font-semibold text-indigo-600 hover:underline">support@absendulu.com</a
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
