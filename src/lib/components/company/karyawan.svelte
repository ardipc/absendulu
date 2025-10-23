<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		User,
		Mail,
		Phone,
		Briefcase,
		Save,
		ArrowLeft,
		Sparkles,
		UserPlus,
		CheckCircle,
		Shield
	} from '@lucide/svelte';

	let { data } = $props();

	let nama = $state('');
	let email = $state('');
	let role = $state('');
	let phone = $state('');
	let isSubmitting = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		const newEmployee = { company: data.company.id, name: nama, email, role, phone };

		const { error } = await data.supabase.from('employees').insert([newEmployee]);

		if (error) {
			console.error(error);
			alert('Gagal menambahkan karyawan. Silakan coba lagi.');
			isSubmitting = false;
		} else {
			goto('/dashboard/karyawan');
		}
	}

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
</script>

<svelte:head>
	<title>Tambah Karyawan - AbsenDulu</title>
</svelte:head>

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
			<UserPlus class="h-5 w-5 text-indigo-600" />
			<span class="font-semibold text-gray-800">Tambah Karyawan</span>
		</div>
	</div>

	<!-- Main Card -->
	<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
		<!-- Header Section -->
		<div
			class="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8"
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
					<UserPlus class="h-10 w-10 text-white" />
				</div>
				<h1 class="mb-2 text-3xl font-bold text-white">Tambah Karyawan Baru</h1>
				<p class="text-lg text-white/90">Lengkapi informasi karyawan untuk menambahkan ke sistem</p>
			</div>
		</div>

		<!-- Form Section -->
		<form onsubmit={handleSubmit} class="p-8">
			<!-- Info Banner -->
			<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
				<div class="flex items-start gap-3">
					<div class="rounded-lg bg-blue-500 p-2">
						<Sparkles class="h-5 w-5 text-white" />
					</div>
					<div>
						<p class="font-semibold text-gray-900">Tips Pengisian</p>
						<p class="text-sm text-gray-600">
							Pastikan data email valid karena akan digunakan untuk login karyawan ke sistem
						</p>
					</div>
				</div>
			</div>

			<div class="space-y-6">
				<!-- Name Field -->
				<div>
					<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
						<User class="h-4 w-4 text-indigo-600" />
						Nama Lengkap
					</label>
					<input
						type="text"
						bind:value={nama}
						placeholder="Masukkan nama lengkap karyawan"
						required
						class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
					/>
				</div>

				<!-- Email Field -->
				<div>
					<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Mail class="h-4 w-4 text-purple-600" />
						Email
					</label>
					<input
						type="email"
						bind:value={email}
						placeholder="contoh@email.com"
						required
						class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
					/>
					<p class="mt-2 flex items-center gap-1 text-xs text-gray-500">
						<CheckCircle class="h-3 w-3" />
						Email akan digunakan untuk login ke sistem
					</p>
				</div>

				<!-- Role Field -->
				<div>
					<label class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Briefcase class="h-4 w-4 text-pink-600" />
						Role / Jabatan
					</label>
					<div class="grid gap-3 md:grid-cols-2">
						{#each roles as roleOption (roleOption.value)}
							{@const RoleIcon = roleOption.icon}
							<button
								type="button"
								onclick={() => (role = roleOption.value)}
								class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
									role === roleOption.value
										? 'border-indigo-500 bg-indigo-50 shadow-lg'
										: 'border-gray-200 bg-white hover:border-indigo-300'
								}`}
							>
								<div
									class={`rounded-lg p-2 ${role === roleOption.value ? `bg-gradient-to-br ${roleOption.color}` : 'bg-gray-100 group-hover:bg-gray-200'}`}
								>
									<RoleIcon
										class={`h-5 w-5 ${role === roleOption.value ? 'text-white' : 'text-gray-600'}`}
									/>
								</div>
								<span
									class={`font-semibold ${role === roleOption.value ? 'text-indigo-700' : 'text-gray-700'}`}
									>{roleOption.label}</span
								>
							</button>
						{/each}
					</div>
					{#if !role}
						<p class="mt-2 text-xs text-red-600">* Pilih salah satu role</p>
					{/if}
				</div>

				<!-- Phone Field -->
				<div>
					<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
						<Phone class="h-4 w-4 text-green-600" />
						Nomor Telepon
					</label>
					<input
						type="tel"
						bind:value={phone}
						placeholder="081234567890"
						required
						pattern="[0-9]{(10, 13)}"
						class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
					/>
					<p class="mt-2 text-xs text-gray-500">Format: 081234567890 (10-13 digit)</p>
				</div>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				disabled={isSubmitting || !role}
				class="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
			>
				{#if isSubmitting}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
					Menyimpan...
				{:else}
					<Save class="h-5 w-5" />
					Simpan Karyawan
				{/if}
			</button>
		</form>

		<!-- Footer Info -->
		<div class="border-t-2 border-gray-100 bg-gray-50 p-6">
			<div class="flex items-start gap-3">
				<Shield class="h-5 w-5 flex-shrink-0 text-green-600" />
				<div>
					<p class="font-semibold text-gray-900">Data Aman & Terenkripsi</p>
					<p class="text-sm text-gray-600">
						Informasi karyawan disimpan dengan aman dan hanya dapat diakses oleh admin perusahaan
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Additional Info Cards -->
	<div class="mt-6 grid gap-4 md:grid-cols-2">
		<div class="rounded-2xl bg-white p-6 shadow-lg">
			<div class="flex items-start gap-3">
				<div class="rounded-lg bg-blue-100 p-2">
					<Mail class="h-5 w-5 text-blue-600" />
				</div>
				<div>
					<p class="font-semibold text-gray-900">Email Login</p>
					<p class="text-sm text-gray-600">
						Karyawan akan menggunakan email ini untuk masuk ke sistem absensi
					</p>
				</div>
			</div>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-lg">
			<div class="flex items-start gap-3">
				<div class="rounded-lg bg-purple-100 p-2">
					<UserPlus class="h-5 w-5 text-purple-600" />
				</div>
				<div>
					<p class="font-semibold text-gray-900">Batas Karyawan</p>
					<p class="text-sm text-gray-600">
						Paket gratis maksimal 10 karyawan. Upgrade untuk unlimited karyawan
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
