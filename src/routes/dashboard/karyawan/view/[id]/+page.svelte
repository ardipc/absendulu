<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { formatDate } from '$lib/utils.js';
	import {
		User,
		Mail,
		Phone,
		Briefcase,
		Save,
		Trash2,
		ArrowLeft,
		AlertCircle,
		CheckCircle,
		Calendar,
		Clock,
		FileText,
		MapPin,
		Shield,
		Sparkles,
		TrendingUp,
		Award
	} from '@lucide/svelte';

	let { data } = $props();

	let nama = $state(data.employee.name);
	let email = $state(data.employee.email);
	let role = $state(data.employee.role);
	let phone = $state(data.employee.phone);
	let isDeleting = $state(false);
	let isSaving = $state(false);
	let showDeleteConfirm = $state(false);

	async function handleDelete() {
		isDeleting = true;
		const { error } = await data.supabase.from('employees').delete().eq('id', data.employee.id);

		if (error) {
			console.error(error);
			alert('Gagal menghapus karyawan. Silakan coba lagi.');
			isDeleting = false;
		} else {
			goto('/dashboard/karyawan');
		}
	}

	async function handleEdit(e: Event) {
		e.preventDefault();
		isSaving = true;

		const employee = { name: nama, email, role, phone };

		const { error } = await data.supabase
			.from('employees')
			.update(employee)
			.eq('id', data.employee.id);

		if (error) {
			console.error(error);
			alert('Gagal menyimpan perubahan. Silakan coba lagi.');
			isSaving = false;
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

	function getRequestTypeColor(type: string) {
		switch (type) {
			case 'izin':
				return 'from-blue-400 to-blue-600';
			case 'sakit':
				return 'from-red-400 to-red-600';
			case 'cuti':
				return 'from-purple-400 to-purple-600';
			case 'dinas':
				return 'from-green-400 to-green-600';
			case 'koreksi':
				return 'from-orange-400 to-orange-600';
			default:
				return 'from-gray-400 to-gray-600';
		}
	}

	// Calculate statistics
	const totalPresent = $derived(
		data.attendances.filter((r: any) => r.status === 'SUBMIT' || r.status === 'APPROVED').length
	);
	const totalLate = $derived(
		data.attendances.filter((r: any) => {
			if (!r.clock_in_ts) return false;
			const clockInTime = new Date(r.clock_in_ts);
			const hours = clockInTime.getHours();
			const minutes = clockInTime.getMinutes();
			return hours > 8 || (hours === 8 && minutes > 15);
		}).length
	);
	const attendanceRate = $derived(
		data.attendances.length > 0 ? ((totalPresent / data.attendances.length) * 100).toFixed(1) : '0'
	);
</script>

<svelte:head>
	<title>Detail Karyawan - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
	<div class="mx-auto max-w-6xl">
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
				<User class="h-5 w-5 text-indigo-600" />
				<span class="font-semibold text-gray-800">Detail Karyawan</span>
			</div>
		</div>

		<!-- Profile Header Card -->
		<div
			class="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
		>
			<!-- Decorative Elements -->
			<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
			<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>

			<div class="relative z-10 flex flex-col items-center gap-6 md:flex-row">
				<!-- Avatar -->
				<div
					class="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 text-4xl font-bold text-white backdrop-blur-sm"
				>
					{nama.charAt(0).toUpperCase()}
				</div>

				<!-- Info -->
				<div class="flex-1 text-center md:text-left">
					<h1 class="mb-2 text-3xl font-bold text-white">{nama}</h1>
					<div class="flex flex-wrap items-center justify-center gap-3 md:justify-start">
						<div class="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1 backdrop-blur-sm">
							<Mail class="h-4 w-4 text-white" />
							<span class="text-sm text-white">{email}</span>
						</div>
						<div class="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1 backdrop-blur-sm">
							<Phone class="h-4 w-4 text-white" />
							<span class="text-sm text-white">{phone}</span>
						</div>
						<div class="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1 backdrop-blur-sm">
							<Briefcase class="h-4 w-4 text-white" />
							<span class="text-sm font-semibold text-white capitalize">{role}</span>
						</div>
					</div>
				</div>

				<!-- Stats -->
				<div class="grid grid-cols-3 gap-4">
					<div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
						<p class="text-2xl font-bold text-white">{totalPresent}</p>
						<p class="text-xs text-white/90">Hadir</p>
					</div>
					<div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
						<p class="text-2xl font-bold text-white">{totalLate}</p>
						<p class="text-xs text-white/90">Terlambat</p>
					</div>
					<div class="rounded-xl bg-white/20 p-4 text-center backdrop-blur-sm">
						<p class="text-2xl font-bold text-white">{attendanceRate}%</p>
						<p class="text-xs text-white/90">Rate</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Tabs Section -->
		<Tabs.Root value="account" class="w-full">
			<Tabs.List class="mb-6 grid h-16 w-full grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-lg">
				<Tabs.Trigger
					value="account"
					class="rounded-xl px-6 py-3 font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
				>
					<span class="flex items-center justify-center gap-2">
						<User class="h-4 w-4" />
						<span class="hidden sm:inline">Profil</span>
					</span>
				</Tabs.Trigger>
				<Tabs.Trigger
					value="kehadiran"
					class="rounded-xl px-6 py-3 font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
				>
					<span class="flex items-center justify-center gap-2">
						<Calendar class="h-4 w-4" />
						<span class="hidden sm:inline">Kehadiran</span>
					</span>
				</Tabs.Trigger>
				<Tabs.Trigger
					value="request"
					class="rounded-xl px-6 py-3 font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
				>
					<span class="flex items-center justify-center gap-2">
						<FileText class="h-4 w-4" />
						<span class="hidden sm:inline">Request</span>
					</span>
				</Tabs.Trigger>
			</Tabs.List>

			<!-- Tab Content: Profile -->
			<Tabs.Content value="account">
				<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
					<!-- Form Header -->
					<div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-white">
							<User class="h-6 w-6" />
							Edit Informasi Karyawan
						</h2>
					</div>

					<form onsubmit={handleEdit} class="p-8">
						<!-- Info Banner -->
						<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
							<div class="flex items-start gap-3">
								<div class="rounded-lg bg-blue-500 p-2">
									<Sparkles class="h-5 w-5 text-white" />
								</div>
								<div>
									<p class="font-semibold text-gray-900">Update Data</p>
									<p class="text-sm text-gray-600">
										Perubahan akan langsung diterapkan setelah disimpan
									</p>
								</div>
							</div>
						</div>

						<div class="space-y-6">
							<!-- Name -->
							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<User class="h-4 w-4 text-indigo-600" />
									Nama Lengkap
								</label>
								<input
									type="text"
									bind:value={nama}
									placeholder="Masukkan nama lengkap"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
								/>
							</div>

							<!-- Email -->
							<div>
								<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
									<Mail class="h-4 w-4 text-purple-600" />
									Email
								</label>
								<input
									type="email"
									bind:value={email}
									placeholder="email@example.com"
									required
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
								/>
							</div>

							<!-- Role -->
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
							</div>

							<!-- Phone -->
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
									class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none"
								/>
							</div>
						</div>

						<!-- Save Button -->
						<button
							type="submit"
							disabled={isSaving}
							class="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
										Menghapus karyawan akan menghapus semua data terkait. Tindakan ini tidak dapat
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
									Hapus Karyawan
								</button>
							{:else}
								<div class="space-y-3">
									<p class="text-center font-semibold text-red-900">
										Apakah Anda yakin ingin menghapus karyawan ini?
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
			</Tabs.Content>

			<!-- Tab Content: Attendance -->
			<Tabs.Content value="kehadiran">
				<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
					<div class="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-white">
							<Calendar class="h-6 w-6" />
							Riwayat Kehadiran
						</h2>
						<p class="mt-1 text-sm text-white/90">
							Total {data.attendances.length} data kehadiran
						</p>
					</div>

					<div class="p-6">
						{#if data.attendances.length === 0}
							<div class="py-16 text-center">
								<div
									class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"
								>
									<Calendar class="h-10 w-10 text-gray-400" />
								</div>
								<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Data</h3>
								<p class="text-gray-600">Belum ada riwayat kehadiran untuk karyawan ini</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each data.attendances as rec (rec.id)}
									{@const statusBadge = getStatusBadge(rec.status)}
									<div
										class="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all hover:scale-[1.02] hover:border-indigo-300 hover:shadow-xl"
									>
										<div
											class="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
										>
											<div class="flex-1">
												<div class="mb-2 flex items-center gap-2">
													<span class="font-bold text-gray-800">{rec.date}</span>
													<span
														class={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.color}`}
													>
														{statusBadge.text}
													</span>
												</div>
												<div class="flex items-center gap-2 text-sm text-gray-600">
													<MapPin class="h-4 w-4" />
													<span>{rec.sites?.name || 'N/A'}</span>
												</div>
											</div>

											<div class="flex gap-3">
												<div class="min-w-[100px] rounded-xl bg-gray-50 p-4 text-center">
													<p class="mb-1 text-xs font-semibold text-gray-500">Clock In</p>
													<p class="font-bold text-gray-800">
														{rec.clock_in_ts ? formatDate(rec.clock_in_ts, 'HH:mm:ss') : '-'}
													</p>
												</div>
												<div class="min-w-[100px] rounded-xl bg-gray-50 p-4 text-center">
													<p class="mb-1 text-xs font-semibold text-gray-500">Clock Out</p>
													<p class="font-bold text-gray-800">
														{rec.clock_out_ts ? formatDate(rec.clock_out_ts, 'HH:mm:ss') : '-'}
													</p>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</Tabs.Content>

			<!-- Tab Content: Requests -->
			<Tabs.Content value="request">
				<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
					<div class="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
						<h2 class="flex items-center gap-2 text-xl font-semibold text-white">
							<FileText class="h-6 w-6" />
							Riwayat Request
						</h2>
						<p class="mt-1 text-sm text-white/90">Total {data.requests.length} request</p>
					</div>

					<div class="p-6">
						{#if data.requests.length === 0}
							<div class="py-16 text-center">
								<div
									class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"
								>
									<FileText class="h-10 w-10 text-gray-400" />
								</div>
								<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Request</h3>
								<p class="text-gray-600">Belum ada riwayat request untuk karyawan ini</p>
							</div>
						{:else}
							<div class="space-y-3">
								{#each data.requests as rec (rec.id)}
									{@const colorClass = getRequestTypeColor(rec.type)}
									<div
										class="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all hover:scale-[1.02] hover:border-purple-300 hover:shadow-xl"
									>
										<div class="flex items-start gap-4 p-6">
											<div
												class={`flex-shrink-0 rounded-xl bg-gradient-to-br ${colorClass} p-4 shadow-lg`}
											>
												<FileText class="h-6 w-6 text-white" />
											</div>

											<div class="flex-1">
												<div class="mb-2 flex items-center gap-2">
													<h3 class="text-lg font-bold text-gray-800 capitalize">{rec.type}</h3>
												</div>
												<div class="mb-2 flex items-center gap-2 text-sm text-gray-600">
													<Calendar class="h-4 w-4" />
													<span>{rec.start_date}</span>
												</div>
												{#if rec.reason}
													<div class="mt-3 rounded-lg bg-gray-50 p-3">
														<p class="text-sm text-gray-700">{rec.reason}</p>
													</div>
												{/if}
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</Tabs.Content>
		</Tabs.Root>

		<!-- Performance Summary Card -->
		<div class="mt-6 rounded-3xl bg-white p-8 shadow-lg">
			<div class="mb-6 flex items-center gap-3">
				<div class="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3">
					<TrendingUp class="h-6 w-6 text-white" />
				</div>
				<h3 class="text-xl font-bold text-gray-800">Ringkasan Performa</h3>
			</div>

			<div class="grid gap-4 md:grid-cols-3">
				<div class="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-6">
					<div class="mb-2 flex items-center gap-2 text-green-700">
						<CheckCircle class="h-5 w-5" />
						<span class="text-sm font-semibold">Total Hadir</span>
					</div>
					<p class="text-3xl font-bold text-green-800">{totalPresent}</p>
					<p class="text-xs text-green-600">dari {data.attendances.length} hari kerja</p>
				</div>

				<div class="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-6">
					<div class="mb-2 flex items-center gap-2 text-orange-700">
						<Clock class="h-5 w-5" />
						<span class="text-sm font-semibold">Terlambat</span>
					</div>
					<p class="text-3xl font-bold text-orange-800">{totalLate}</p>
					<p class="text-xs text-orange-600">keterlambatan</p>
				</div>

				<div class="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
					<div class="mb-2 flex items-center gap-2 text-purple-700">
						<Award class="h-5 w-5" />
						<span class="text-sm font-semibold">Tingkat Kehadiran</span>
					</div>
					<p class="text-3xl font-bold text-purple-800">{attendanceRate}%</p>
					<p class="text-xs text-purple-600">attendance rate</p>
				</div>
			</div>
		</div>
	</div>
</main>
