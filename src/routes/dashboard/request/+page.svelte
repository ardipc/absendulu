<script lang="ts">
	import { onMount } from 'svelte';
	import { uploadFormData } from '$lib/upload';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import {
		FileText,
		Calendar,
		AlertCircle,
		Send,
		Paperclip,
		CheckCircle,
		Clock,
		XCircle,
		Upload,
		Briefcase,
		Heart,
		Plane,
		Edit3,
		Building2,
		Sparkles,
		ChevronRight
	} from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';

	let { data } = $props();

	let isSubmit = $state(false);
	interface Request {
		id: string;
		type: string;
		status: string;
		start_date: string;
		reason: string;
		created_at: string;
		companies: {
			name: string;
			description: string;
		};
	}
	let myReqs = $state<Request[]>([]);

	let isWorkIn = $state<boolean>(true);
	let loading = $state<boolean>(false);

	let type = $state('');
	let date = $state('');
	let note = $state('');

	let file = $state<File | null>(null);
	let fileInput: HTMLInputElement | null = null;

	function resetFile() {
		if (fileInput) {
			fileInput.value = '';
		}
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
		}
	}

	async function handleSubmit() {
		if (!type || !date || !note) {
			alert('Mohon lengkapi data request!');
			return;
		}

		isSubmit = true;

		let upload = await uploadFormData(data.supabase, file);

		let body = {
			company: data.company.company,
			employee: data.user?.email,
			reason: note,
			type,
			start_date: date,
			attachments: upload ? upload.fullPath : ''
		};

		let create = await data.supabase.from('requests').insert([body]);
		if (create.error) {
			alert('Gagal mengirim request. Silakan coba lagi.');
			console.error('Error creating request:', create.error);
		} else {
			alert('Request berhasil dikirim!');

			// Reset form
			type = '';
			date = '';
			note = '';
			file = null;

			resetFile();
			getMyRequest();

			isSubmit = false;
		}
	}

	onMount(() => {
		getMyRequest();
		getWorkIn();
	});

	async function getWorkIn() {
		loading = true;
		let get = await data.supabase
			.from('employees')
			.select('*, companies(*, sites(*))')
			.eq('email', data.user?.email)
			.single();

		if (get.status === 406) {
			isWorkIn = false;
		}

		loading = false;
	}

	async function getMyRequest() {
		let email = data.user?.email;
		if (!email) return;
		let { data: reqs } = await data.supabase
			.from('requests')
			.select('*, companies(name, description)')
			.eq('employee', email)
			.order('id', { ascending: false });
		if (reqs) {
			myReqs = reqs;
		}
	}

	function getRequestIcon(requestType: string) {
		switch (requestType) {
			case 'izin':
				return AlertCircle;
			case 'sakit':
				return Heart;
			case 'cuti':
				return Plane;
			case 'dinas':
				return Briefcase;
			case 'koreksi':
				return Edit3;
			default:
				return FileText;
		}
	}

	function getRequestColor(requestType: string) {
		switch (requestType) {
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

	function getStatusBadge(status: string) {
		switch (status) {
			case 'approved':
				return { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Disetujui' };
			case 'rejected':
				return { color: 'bg-red-100 text-red-700', icon: XCircle, text: 'Ditolak' };
			case 'pending':
				return { color: 'bg-yellow-100 text-yellow-700', icon: Clock, text: 'Menunggu' };
			default:
				return { color: 'bg-gray-100 text-gray-700', icon: Clock, text: 'Pending' };
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Request - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br p-4 md:p-8">

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

	{#if isWorkIn === true}

		{#if loading === true}
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


		{#if loading === false}
			<div class="mx-auto max-w-5xl">
				<!-- Header Section -->
				<div class="mb-8 text-center">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl"
					>
						<FileText class="h-10 w-10 text-white" />
					</div>
					<h1 class="mb-2 text-3xl font-bold text-gray-800">Request Management</h1>
					<p class="text-gray-600">Ajukan izin, cuti, atau request lainnya dengan mudah</p>
				</div>

				<!-- Tabs Container -->
				<Tabs.Root value="account" class="w-full">
					<Tabs.List class="mb-8 grid h-18 w-full grid-cols-2 gap-4 rounded-2xl bg-white p-2 shadow-lg">
						<Tabs.Trigger
							value="account"
							class="rounded-xl px-6 py-4 font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
						>
							<span class="flex items-center justify-center gap-2">
								<Send class="h-5 w-5" />
								Form Request
							</span>
						</Tabs.Trigger>
						<Tabs.Trigger
							value="request"
							class="rounded-xl px-6 py-4 font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
						>
							<span class="flex items-center justify-center gap-2">
								<FileText class="h-5 w-5" />
								My Requests
							</span>
						</Tabs.Trigger>
					</Tabs.List>

					<!-- Form Request Tab -->
					<Tabs.Content value="account">
						<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
							<!-- Form Header -->
							<div class="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
								<h2 class="flex items-center gap-2 text-xl font-semibold text-white">
									<Send class="h-6 w-6" />
									Buat Request Baru
								</h2>
								<p class="mt-1 text-sm text-white/90">
									Lengkapi form di bawah untuk mengajukan request
								</p>
							</div>

							<div class="p-8">
								<!-- Jenis Request -->
								<div class="mb-6">
									<label class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
										<Sparkles class="h-4 w-4 text-purple-500" />
										Jenis Request
									</label>
									<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
										<button
											type="button"
											onclick={() => (type = 'izin')}
											class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
												type === 'izin'
													? 'border-blue-500 bg-blue-50 shadow-lg'
													: 'border-gray-200 bg-white hover:border-blue-300'
											}`}
										>
											<div
												class={`rounded-lg p-2 ${type === 'izin' ? 'bg-blue-500' : 'bg-blue-100 group-hover:bg-blue-200'}`}
											>
												<AlertCircle
													class={`h-5 w-5 ${type === 'izin' ? 'text-white' : 'text-blue-600'}`}
												/>
											</div>
											<span
												class={`font-semibold ${type === 'izin' ? 'text-blue-700' : 'text-gray-700'}`}
												>Izin</span
											>
										</button>

										<button
											type="button"
											onclick={() => (type = 'sakit')}
											class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
												type === 'sakit'
													? 'border-red-500 bg-red-50 shadow-lg'
													: 'border-gray-200 bg-white hover:border-red-300'
											}`}
										>
											<div
												class={`rounded-lg p-2 ${type === 'sakit' ? 'bg-red-500' : 'bg-red-100 group-hover:bg-red-200'}`}
											>
												<Heart class={`h-5 w-5 ${type === 'sakit' ? 'text-white' : 'text-red-600'}`} />
											</div>
											<span
												class={`font-semibold ${type === 'sakit' ? 'text-red-700' : 'text-gray-700'}`}
												>Sakit</span
											>
										</button>

										<button
											type="button"
											onclick={() => (type = 'cuti')}
											class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
												type === 'cuti'
													? 'border-purple-500 bg-purple-50 shadow-lg'
													: 'border-gray-200 bg-white hover:border-purple-300'
											}`}
										>
											<div
												class={`rounded-lg p-2 ${type === 'cuti' ? 'bg-purple-500' : 'bg-purple-100 group-hover:bg-purple-200'}`}
											>
												<Plane
													class={`h-5 w-5 ${type === 'cuti' ? 'text-white' : 'text-purple-600'}`}
												/>
											</div>
											<span
												class={`font-semibold ${type === 'cuti' ? 'text-purple-700' : 'text-gray-700'}`}
												>Cuti</span
											>
										</button>

										<button
											type="button"
											onclick={() => (type = 'dinas')}
											class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
												type === 'dinas'
													? 'border-green-500 bg-green-50 shadow-lg'
													: 'border-gray-200 bg-white hover:border-green-300'
											}`}
										>
											<div
												class={`rounded-lg p-2 ${type === 'dinas' ? 'bg-green-500' : 'bg-green-100 group-hover:bg-green-200'}`}
											>
												<Briefcase
													class={`h-5 w-5 ${type === 'dinas' ? 'text-white' : 'text-green-600'}`}
												/>
											</div>
											<span
												class={`font-semibold ${type === 'dinas' ? 'text-green-700' : 'text-gray-700'}`}
												>Dinas Luar</span
											>
										</button>

										<button
											type="button"
											onclick={() => (type = 'koreksi')}
											class={`group flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:scale-105 ${
												type === 'koreksi'
													? 'border-orange-500 bg-orange-50 shadow-lg'
													: 'border-gray-200 bg-white hover:border-orange-300'
											}`}
										>
											<div
												class={`rounded-lg p-2 ${type === 'koreksi' ? 'bg-orange-500' : 'bg-orange-100 group-hover:bg-orange-200'}`}
											>
												<Edit3
													class={`h-5 w-5 ${type === 'koreksi' ? 'text-white' : 'text-orange-600'}`}
												/>
											</div>
											<span
												class={`font-semibold ${type === 'koreksi' ? 'text-orange-700' : 'text-gray-700'}`}
												>Koreksi</span
											>
										</button>
									</div>
								</div>

								<!-- Tanggal -->
								<div class="mb-6">
									<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
										<Calendar class="h-4 w-4 text-pink-500" />
										Tanggal
									</label>
									<input
										type="date"
										bind:value={date}
										class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none"
									/>
								</div>

								<!-- Keterangan -->
								<div class="mb-6">
									<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
										<FileText class="h-4 w-4 text-purple-500" />
										Keterangan
									</label>
									<textarea
										bind:value={note}
										rows="5"
										placeholder="Tuliskan alasan atau detail request..."
										class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
									></textarea>
								</div>

								<!-- Lampiran -->
								<div class="mb-8">
									<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
										<Paperclip class="h-4 w-4 text-orange-500" />
										Lampiran (Opsional)
									</label>
									<div
										class="group relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-all hover:border-orange-400 hover:bg-orange-50"
									>
										<input
											type="file"
											bind:this={fileInput}
											accept="image/*"
											onchange={handleFileChange}
											class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
										/>
										<div class="pointer-events-none">
											<div
												class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200"
											>
												<Upload class="h-8 w-8 text-orange-600" />
											</div>
											<p class="mb-1 text-sm font-semibold text-gray-700">
												{file ? file.name : 'Klik atau drag file ke sini'}
											</p>
											<p class="text-xs text-gray-500">PNG, JPG, atau JPEG (Max. 5MB)</p>
										</div>
									</div>
								</div>

								<!-- Submit Button -->
								<button
									onclick={handleSubmit}
									disabled={isSubmit}
									class="group w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
								>
									<span class="flex items-center justify-center gap-2">
										{#if isSubmit}
											<div
												class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
											></div>
											Mengirim...
										{:else}
											<Send class="h-5 w-5 transition-transform group-hover:translate-x-1" />
											Kirim Request
										{/if}
									</span>
								</button>
							</div>
						</div>
					</Tabs.Content>

					<!-- My Requests Tab -->
					<Tabs.Content value="request">
						<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
							<!-- Requests Header -->
							<div class="border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-600 p-6">
								<h2 class="flex items-center gap-2 text-xl font-semibold text-white">
									<FileText class="h-6 w-6" />
									Riwayat Request Anda
								</h2>
								<p class="mt-1 text-sm text-white/90">Total {myReqs.length} request yang diajukan</p>
							</div>

							<div class="p-6">
								{#if myReqs.length === 0}
									<!-- Empty State -->
									<div class="py-16 text-center">
										<div
											class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-purple-100"
										>
											<FileText class="h-12 w-12 text-purple-600" />
										</div>
										<h3 class="mb-2 text-xl font-bold text-gray-800">Belum Ada Request</h3>
										<p class="text-gray-600">Request yang Anda ajukan akan muncul di sini</p>
									</div>
								{:else}
									<!-- Requests List -->
									<div class="space-y-4">
										{#each myReqs as req (req.id)}
											{@const IconComponent = getRequestIcon(req.type)}
											{@const colorClass = getRequestColor(req.type)}
											{@const statusBadge = getStatusBadge(req.status)}
											{@const StatusIcon = statusBadge.icon}

											<div
												class="group overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all hover:scale-[1.02] hover:border-purple-300 hover:shadow-xl"
											>
												<div class="flex items-start gap-4 p-6">
													<!-- Icon -->
													<div
														class={`flex-shrink-0 rounded-xl bg-gradient-to-br ${colorClass} p-4 shadow-lg`}
													>
														<IconComponent class="h-6 w-6 text-white" />
													</div>

													<!-- Content -->
													<div class="flex-1">
														<div class="mb-2 flex flex-wrap items-start justify-between gap-2">
															<div>
																<h3 class="mb-1 text-lg font-bold text-gray-800 capitalize">
																	{req.type}
																</h3>
																<div class="flex items-center gap-2 text-sm text-gray-600">
																	<Building2 class="h-4 w-4" />
																	<span>{req.companies.name}</span>
																</div>
															</div>
															<span
																class={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.color}`}
															>
																<StatusIcon class="h-3 w-3" />
																{statusBadge.text}
															</span>
														</div>

														<div class="mb-3 flex items-center gap-2 text-sm text-gray-600">
															<Calendar class="h-4 w-4" />
															<span>{formatDate(req.start_date)}</span>
														</div>

														{#if req.reason}
															<div class="mb-3 rounded-lg bg-gray-50 p-3">
																<p class="text-sm text-gray-700">{req.reason}</p>
															</div>
														{/if}

														<div class="flex items-center gap-2 text-xs text-gray-500">
															<Clock class="h-3 w-3" />
															Diajukan pada {formatDate(req.created_at.split('T')[0])}
														</div>
													</div>

													<!-- Arrow -->
													<ChevronRight
														class="h-6 w-6 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-purple-600"
													/>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>
		{/if}

	{/if}
</main>
