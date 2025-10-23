<script lang="ts">
	import { goto } from '$app/navigation';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import {
		Edit,
		Building2,
		MapPin,
		Users,
		Plus,
		ChevronRight,
		Mail,
		Phone,
		Sparkles,
		CheckCircle2
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	// Simulasi user plan
	let isFreePlan = true;

	// Simulasi company
	interface Company {
		owner?: string;
		name: string;
		description: string;
		sites: Array<{
			id: string;
			name: string;
			address: string;
			radius: number;
		}>;
		employees: Array<{
			id: string;
			name: string;
			email: string;
			phone: string;
			role: string;
		}>;
	}
	let company: Company | null = $state(null);

	// Form input
	let companyName = $state('');
	let companyAddress = $state('');

	async function createCompany() {
		if (!companyName || !companyAddress) {
			alert('Nama & alamat perusahaan harus diisi');
			return;
		}
		const newCompany = { owner: data.user?.email, name: companyName, description: companyAddress };
		const create = await data.supabase.from('companies').insert([newCompany]).select();
		console.log(create);
		if (create.data && create.data.length > 0) {
			alert(`Company ${companyName} berhasil dibuat!`);
			checkingCompany();
		}
	}

	let loading = $state(true);

	onMount(() => {
		checkingCompany();
	});

	async function checkingCompany() {
		loading = true;

		const { data: response } = await data.supabase
			.from('companies')
			.select('*,sites(*),employees(*)')
			.eq('owner', data.user?.email);
		if (response?.length === 0) company = null;
		else if (response && response.length > 0) {
			company = response[0] as Company;
		} else {
			company = null;
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Manajemen Karyawan - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br p-4 md:p-8">
	{#if loading}
		<!-- Enhanced Loading State -->
		<div class="mx-auto max-w-6xl space-y-6">
			<div class="rounded-3xl bg-white p-8 shadow-lg">
				<Skeleton class="mb-4 h-10 w-64 rounded-xl" />
				<Skeleton class="mb-6 h-6 w-96 rounded-lg" />
				<div class="grid gap-4 md:grid-cols-2">
					<Skeleton class="h-48 rounded-2xl" />
					<Skeleton class="h-48 rounded-2xl" />
				</div>
			</div>
		</div>
	{/if}

	{#if !company && !loading}
		<!-- FORM CREATE COMPANY - Enhanced -->
		<div class="mx-auto max-w-3xl">
			<!-- Header with Icon -->
			<div class="mb-8 text-center">
				<div
					class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl"
				>
					<Building2 class="h-10 w-10 text-white" />
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-800">Buat Perusahaan Anda</h1>
				<p class="text-gray-600">Mulai kelola tim Anda dengan lebih efisien</p>
			</div>

			<!-- Plan Badge -->
			<div class="mb-8 flex justify-center">
				<div
					class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-white shadow-lg"
				>
					<Sparkles class="h-5 w-5" />
					<span class="font-semibold"
						>Paket {isFreePlan ? 'Gratis' : 'Pro'} - 1 Perusahaan & 1 Lokasi</span
					>
				</div>
			</div>

			<!-- Form Card -->
			<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
				<div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
					<h2 class="text-xl font-semibold text-white">Informasi Perusahaan</h2>
				</div>

				<div class="p-8">
					<div class="mb-6">
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Building2 class="h-4 w-4 text-blue-500" />
							Nama Perusahaan
						</label>
						<input
							type="text"
							value={companyName}
							onchange={(e) => (companyName = (e.target as HTMLInputElement).value)}
							placeholder="Masukkan nama perusahaan"
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
						/>
					</div>

					<div class="mb-8">
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<MapPin class="h-4 w-4 text-purple-500" />
							Alamat Perusahaan
						</label>
						<textarea
							value={companyAddress}
							rows="4"
							onchange={(e) => (companyAddress = (e.target as HTMLTextAreaElement).value)}
							placeholder="Masukkan alamat lengkap perusahaan"
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
						></textarea>
					</div>

					<button
						onclick={createCompany}
						class="group w-full rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
					>
						<span class="flex items-center justify-center gap-2">
							<Building2 class="h-5 w-5 transition-transform group-hover:rotate-12" />
							Buat Perusahaan Sekarang
						</span>
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if company && !loading}
		<!-- COMPANY DASHBOARD - Enhanced -->
		<div class="mx-auto max-w-6xl">
			<!-- Company Header Card -->
			<div
				class="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
			>
				<!-- Decorative Elements -->
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>

				<div class="relative z-10 flex items-start justify-between">
					<div class="flex items-center gap-4">
						<div
							class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
						>
							<Building2 class="h-8 w-8 text-white" />
						</div>
						<div class="text-white">
							<h1 class="mb-1 text-3xl font-bold">{company.name}</h1>
							<p class="flex items-center gap-2 text-lg opacity-90">
								<MapPin class="h-4 w-4" />
								{company.description}
							</p>
						</div>
					</div>
					<button
						type="button"
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
						onclick={() => goto(`/dashboard/karyawan/company`)}
					>
						<Edit class="h-5 w-5 text-white" />
					</button>
				</div>

				<!-- Stats Bar -->
				<div class="relative z-10 mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
					<div class="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-white/20 p-2">
								<MapPin class="h-5 w-5 text-white" />
							</div>
							<div class="text-white">
								<p class="text-2xl font-bold">{company.sites.length}</p>
								<p class="text-sm opacity-90">Lokasi Kerja</p>
							</div>
						</div>
					</div>
					<div class="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-white/20 p-2">
								<Users class="h-5 w-5 text-white" />
							</div>
							<div class="text-white">
								<p class="text-2xl font-bold">{company.employees.length}</p>
								<p class="text-sm opacity-90">Karyawan</p>
							</div>
						</div>
					</div>
					<div class="col-span-2 rounded-2xl bg-white/10 p-4 backdrop-blur-sm md:col-span-1">
						<div class="flex items-center gap-3">
							<div class="rounded-lg bg-white/20 p-2">
								<Sparkles class="h-5 w-5 text-white" />
							</div>
							<div class="text-white">
								<p class="text-2xl font-bold">{isFreePlan ? 'Gratis' : 'Pro'}</p>
								<p class="text-sm opacity-90">Paket Aktif</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Lokasi Kerja Section -->
			<div class="mb-8">
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="rounded-xl bg-green-100 p-3">
							<MapPin class="h-6 w-6 text-green-600" />
						</div>
						<div>
							<h2 class="text-2xl font-bold text-gray-800">Lokasi Kerja</h2>
							<p class="text-sm text-gray-600">Kelola lokasi untuk absensi karyawan</p>
						</div>
					</div>
				</div>

				{#if company.sites.length === 0}
					<!-- Empty State -->
					<div class="rounded-3xl bg-white p-12 text-center shadow-lg">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
						>
							<MapPin class="h-10 w-10 text-green-600" />
						</div>
						<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Lokasi Kerja</h3>
						<p class="mb-6 text-gray-600">
							Tambahkan lokasi kerja untuk mengaktifkan fitur absensi berbasis lokasi.
						</p>
						<button
							type="button"
							onclick={() => goto('/dashboard/karyawan/lokasi')}
							class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
						>
							<Plus class="h-5 w-5 transition-transform group-hover:rotate-90" />
							Buat Lokasi Kerja
						</button>
					</div>
				{:else}
					<!-- Sites List -->
					<div class="grid gap-4 md:grid-cols-2">
						{#each company.sites as site (site.id)}
							<a
								href={`/dashboard/karyawan/lokasi/${site.id}`}
								class="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
							>
								<div class="flex items-center gap-4 p-6">
									<div
										class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-2xl font-bold text-white shadow-lg"
									>
										{site.name.charAt(0).toUpperCase()}
									</div>
									<div class="flex-1">
										<h3 class="mb-1 text-lg font-bold text-gray-800 group-hover:text-green-600">
											{site.name}
										</h3>
										<p class="mb-2 flex items-center gap-1 text-sm text-gray-600">
											<MapPin class="h-4 w-4" />
											{site.address}
										</p>
										<div
											class="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
										>
											<CheckCircle2 class="h-3 w-3" />
											Radius: {site.radius}m
										</div>
									</div>
									<ChevronRight
										class="h-6 w-6 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-green-600"
									/>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Daftar Karyawan Section -->
			<div>
				<div class="mb-6 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="rounded-xl bg-blue-100 p-3">
							<Users class="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<h2 class="text-2xl font-bold text-gray-800">Daftar Karyawan</h2>
							<p class="text-sm text-gray-600">
								Kelola data karyawan ({company.employees.length}/10)
							</p>
						</div>
					</div>
				</div>

				{#if company.employees.length === 0}
					<!-- Empty State -->
					<div class="rounded-3xl bg-white p-12 text-center shadow-lg">
						<div
							class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100"
						>
							<Users class="h-10 w-10 text-blue-600" />
						</div>
						<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Karyawan</h3>
						<p class="mb-6 text-gray-600">Tambahkan karyawan untuk mengelola absensi.</p>
						<button
							type="button"
							onclick={() => goto('/dashboard/karyawan/form')}
							class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
						>
							<Plus class="h-5 w-5 transition-transform group-hover:rotate-90" />
							Tambah Karyawan
						</button>
					</div>
				{:else}
					<!-- Employees Grid -->
					<div class="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each company.employees as emp (emp.id)}
							<a
								href={`/dashboard/karyawan/view/${emp.id}`}
								class="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
							>
								<div class="p-6">
									<!-- Avatar and Role Badge -->
									<div class="mb-4 flex items-start justify-between">
										<div
											class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-bold text-white shadow-lg"
										>
											{emp.name.charAt(0).toUpperCase()}
										</div>
										<span
											class="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
										>
											{emp.role}
										</span>
									</div>

									<!-- Employee Info -->
									<h3
										class="mb-3 text-lg font-bold text-gray-800 transition-colors group-hover:text-blue-600"
									>
										{emp.name}
									</h3>

									<div class="space-y-2">
										<div class="flex items-center gap-2 text-sm text-gray-600">
											<Mail class="h-4 w-4 text-gray-400" />
											<span class="truncate">{emp.email}</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-gray-600">
											<Phone class="h-4 w-4 text-gray-400" />
											<span>{emp.phone}</span>
										</div>
									</div>

									<!-- View Details Arrow -->
									<div
										class="mt-4 flex items-center justify-end text-sm font-semibold text-blue-600"
									>
										<span class="transition-all group-hover:mr-2">Lihat Detail</span>
										<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
									</div>
								</div>
							</a>
						{/each}
					</div>

					<!-- Add More Button -->
					{#if company.employees.length < 10}
						<div class="flex justify-center">
							<button
								type="button"
								onclick={() => goto('/dashboard/karyawan/form')}
								class="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
							>
								<Plus class="h-5 w-5 transition-transform group-hover:rotate-90" />
								Tambah Karyawan Baru
							</button>
						</div>
					{:else}
						<div class="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 text-center">
							<p class="font-semibold text-amber-800">
								<Sparkles class="mr-2 inline h-5 w-5" />
								Anda telah mencapai batas maksimal karyawan (10) untuk paket Gratis
							</p>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</main>
