<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Building2,
		MapPin,
		Save,
		Trash2,
		ArrowLeft,
		AlertCircle,
		CheckCircle,
		Edit3,
		Sparkles
	} from '@lucide/svelte';

	let { data } = $props();

	let name = $state(data.company.name);
	let description = $state(data.company.description);
	let isDeleting = $state(false);
	let isSaving = $state(false);
	let showDeleteConfirm = $state(false);

	async function handleDelete() {
		isDeleting = true;
		const { error } = await data.supabase.from('companies').delete().eq('id', data.company.id);

		if (error) {
			console.error(error);
			alert('Gagal menghapus perusahaan. Silakan coba lagi.');
			isDeleting = false;
		} else {
			goto('/dashboard/karyawan');
		}
	}

	async function handleEdit(e: Event) {
		e.preventDefault();
		isSaving = true;

		const { error } = await data.supabase
			.from('companies')
			.update({ name, description })
			.eq('id', data.company.id);

		if (error) {
			console.error(error);
			alert('Gagal menyimpan perubahan. Silakan coba lagi.');
			isSaving = false;
		} else {
			goto('/dashboard/karyawan');
		}
	}
</script>

<svelte:head>
	<title>Edit Perusahaan - AbsenDulu</title>
</svelte:head>

<main class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
	<div class="mx-auto max-w-3xl">
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
				<Building2 class="h-5 w-5 text-indigo-600" />
				<span class="font-semibold text-gray-800">Edit Perusahaan</span>
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

				<div class="relative z-10 text-center">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
					>
						<Edit3 class="h-10 w-10 text-white" />
					</div>
					<h1 class="mb-2 text-3xl font-bold text-white">Edit Informasi Perusahaan</h1>
					<p class="text-lg text-white/90">Perbarui data perusahaan Anda</p>
				</div>
			</div>

			<!-- Form Section -->
			<form onsubmit={handleEdit} class="p-8">
				<!-- Info Banner -->
				<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
					<div class="flex items-start gap-3">
						<div class="rounded-lg bg-blue-500 p-2">
							<Sparkles class="h-5 w-5 text-white" />
						</div>
						<div>
							<p class="font-semibold text-gray-900">Tips</p>
							<p class="text-sm text-gray-600">
								Pastikan informasi perusahaan akurat untuk memudahkan identifikasi dan pelaporan
							</p>
						</div>
					</div>
				</div>

				<div class="space-y-6">
					<!-- Company Name -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<Building2 class="h-4 w-4 text-indigo-600" />
							Nama Perusahaan
						</label>
						<input
							type="text"
							bind:value={name}
							placeholder="Masukkan nama perusahaan"
							required
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none"
						/>
					</div>

					<!-- Company Address -->
					<div>
						<label class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
							<MapPin class="h-4 w-4 text-purple-600" />
							Alamat Perusahaan
						</label>
						<textarea
							bind:value={description}
							placeholder="Masukkan alamat lengkap perusahaan"
							required
							rows="4"
							class="w-full rounded-xl border-2 border-gray-200 p-4 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none"
						></textarea>
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
								Menghapus perusahaan akan menghapus semua data terkait termasuk lokasi dan karyawan.
								Tindakan ini tidak dapat dibatalkan!
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
							Hapus Perusahaan
						</button>
					{:else}
						<div class="space-y-3">
							<p class="text-center font-semibold text-red-900">
								Apakah Anda yakin ingin menghapus perusahaan ini?
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

		<!-- Additional Info -->
		<div class="mt-6 rounded-2xl bg-white p-6 shadow-lg">
			<div class="flex items-start gap-3">
				<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
				<div>
					<p class="font-semibold text-gray-900">Data Aman</p>
					<p class="text-sm text-gray-600">
						Semua perubahan akan tersimpan dengan aman dan langsung diterapkan ke sistem
					</p>
				</div>
			</div>
		</div>
	</div>
</main>
