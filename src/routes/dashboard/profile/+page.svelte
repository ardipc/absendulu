<script lang="ts">
	import { goto } from '$app/navigation';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { User, Mail, Shield, LogOut, Edit, Calendar, Clock, CheckCircle } from '@lucide/svelte';

	let { data } = $props();
	let user = $state(data.user);

	async function logout() {
		await data.supabase.auth.signOut();
		window.location.href = '/';
	}

	function getInitials(name: string) {
		if (!name) return 'U';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
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
	<title>Profile - AbsenDulu</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br p-4 md:p-8">
	<div class="mx-auto max-w-4xl">
		{#if user}
			<!-- Header Card with Gradient Background -->
			<div
				class="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
			>
				<!-- Decorative circles -->
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>

				<div class="relative z-10 flex flex-col items-center text-center text-white">
					<!-- Profile Picture -->
					<div class="relative mb-4">
						{#if user.identities?.[0]?.identity_data?.avatar_url}
							<img
								src={user.identities[0].identity_data.avatar_url}
								class="h-32 w-32 rounded-full border-4 border-white shadow-xl"
								alt="Profile"
							/>
						{:else}
							<div
								class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-purple-500 text-4xl font-bold shadow-xl"
							>
								{getInitials(user.user_metadata?.full_name || user.email)}
							</div>
						{/if}
						<div
							class="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 shadow-lg"
						>
							<CheckCircle class="h-5 w-5 text-white" />
						</div>
					</div>

					<!-- Name and Email -->
					<h1 class="mb-2 text-3xl font-bold">
						{user.user_metadata?.full_name || 'Pengguna'}
					</h1>
					<p class="mb-1 text-lg opacity-90">{user.email}</p>
					<div class="mt-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
						<Shield class="h-4 w-4" />
						<span class="text-sm font-medium">{user.user_metadata?.role || 'User'}</span>
					</div>
				</div>
			</div>

			<!-- Info Cards Grid -->
			<div class="mb-6 grid gap-4 md:grid-cols-2">
				<!-- Personal Info Card -->
				<div class="rounded-2xl bg-white p-6 shadow-lg transition-transform hover:scale-105">
					<div class="mb-4 flex items-center gap-3">
						<div class="rounded-xl bg-blue-100 p-3">
							<User class="h-6 w-6 text-blue-600" />
						</div>
						<h3 class="text-lg font-semibold text-gray-800">Informasi Personal</h3>
					</div>
					<div class="space-y-3">
						<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
							<User class="mt-1 h-5 w-5 text-gray-400" />
							<div class="flex-1">
								<p class="text-xs font-medium text-gray-500">Nama Lengkap</p>
								<p class="text-sm font-semibold text-gray-800">
									{user.user_metadata?.full_name || 'Belum diatur'}
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
							<Mail class="mt-1 h-5 w-5 text-gray-400" />
							<div class="flex-1">
								<p class="text-xs font-medium text-gray-500">Email</p>
								<p class="text-sm font-semibold break-all text-gray-800">{user.email}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Account Info Card -->
				<div class="rounded-2xl bg-white p-6 shadow-lg transition-transform hover:scale-105">
					<div class="mb-4 flex items-center gap-3">
						<div class="rounded-xl bg-purple-100 p-3">
							<Shield class="h-6 w-6 text-purple-600" />
						</div>
						<h3 class="text-lg font-semibold text-gray-800">Informasi Akun</h3>
					</div>
					<div class="space-y-3">
						<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
							<Shield class="mt-1 h-5 w-5 text-gray-400" />
							<div class="flex-1">
								<p class="text-xs font-medium text-gray-500">Role</p>
								<p class="text-sm font-semibold text-gray-800">
									{user.user_metadata?.role || 'User'}
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
							<Calendar class="mt-1 h-5 w-5 text-gray-400" />
							<div class="flex-1">
								<p class="text-xs font-medium text-gray-500">Terdaftar Sejak</p>
								<p class="text-sm font-semibold text-gray-800">
									{formatDate(user.created_at)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Activity Stats Card -->
				<div class="rounded-2xl bg-white p-6 shadow-lg transition-transform hover:scale-105">
					<div class="mb-4 flex items-center gap-3">
						<div class="rounded-xl bg-green-100 p-3">
							<Clock class="h-6 w-6 text-green-600" />
						</div>
						<h3 class="text-lg font-semibold text-gray-800">Aktivitas</h3>
					</div>
					<div class="space-y-3">
						<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
							<Clock class="mt-1 h-5 w-5 text-gray-400" />
							<div class="flex-1">
								<p class="text-xs font-medium text-gray-500">Login Terakhir</p>
								<p class="text-sm font-semibold text-gray-800">
									{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Belum tersedia'}
								</p>
							</div>
						</div>
						<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
							<Mail class="mt-1 h-5 w-5 text-gray-400" />
							<div class="flex-1">
								<p class="text-xs font-medium text-gray-500">Status Email</p>
								<div class="flex items-center gap-2">
									<p class="text-sm font-semibold text-gray-800">
										{user.email_confirmed_at ? 'Terverifikasi' : 'Belum Terverifikasi'}
									</p>
									{#if user.email_confirmed_at}
										<CheckCircle class="h-4 w-4 text-green-500" />
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Provider Info Card -->
				<div class="rounded-2xl bg-white p-6 shadow-lg transition-transform hover:scale-105">
					<div class="mb-4 flex items-center gap-3">
						<div class="rounded-xl bg-orange-100 p-3">
							<User class="h-6 w-6 text-orange-600" />
						</div>
						<h3 class="text-lg font-semibold text-gray-800">Provider</h3>
					</div>
					<div class="space-y-3">
						{#if user.identities && user.identities.length > 0}
							{#each user.identities as identity (identity.id)}
								<div class="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
									<Shield class="mt-1 h-5 w-5 text-gray-400" />
									<div class="flex-1">
										<p class="text-xs font-medium text-gray-500">Login Via</p>
										<p class="text-sm font-semibold text-gray-800 capitalize">
											{identity.provider}
										</p>
									</div>
								</div>
							{/each}
						{:else}
							<p class="text-sm text-gray-500">Tidak ada informasi provider</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="grid gap-4 md:grid-cols-2">
				<button
					type="button"
					class="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
					onclick={() => goto('/dashboard/profile/edit')}
				>
					<Edit class="h-5 w-5 transition-transform group-hover:rotate-12" />
					<span class="text-lg font-semibold">Edit Profile</span>
				</button>

				<button
					type="button"
					class="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
					onclick={logout}
				>
					<LogOut class="h-5 w-5 transition-transform group-hover:translate-x-1" />
					<span class="text-lg font-semibold">Logout</span>
				</button>
			</div>
		{:else}
			<!-- Loading State -->
			<div class="space-y-4">
				<div class="rounded-3xl bg-white p-8">
					<div class="flex flex-col items-center">
						<Skeleton class="mb-4 h-32 w-32 rounded-full" />
						<Skeleton class="mb-2 h-8 w-48 rounded" />
						<Skeleton class="mb-4 h-6 w-64 rounded" />
					</div>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					<Skeleton class="h-64 rounded-2xl" />
					<Skeleton class="h-64 rounded-2xl" />
					<Skeleton class="h-64 rounded-2xl" />
					<Skeleton class="h-64 rounded-2xl" />
				</div>
			</div>
		{/if}
	</div>
</div>
