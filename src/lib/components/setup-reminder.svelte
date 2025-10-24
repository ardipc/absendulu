<script lang="ts">
	import { goto } from '$app/navigation';
	import { X, Building2, MapPin, Users, ArrowRight, Sparkles } from 'lucide-svelte';

	let showReminder = $state(true);

	function dismissReminder() {
		showReminder = false;
		localStorage.setItem('setup_reminder_dismissed', 'true');
	}

	function goToSetup() {
		localStorage.removeItem('walkthrough_completed');
		goto('/started');
	}

	// Check if reminder was already dismissed
	if (typeof window !== 'undefined') {
		const dismissed = localStorage.getItem('setup_reminder_dismissed');
		if (dismissed === 'true') {
			showReminder = false;
		}
	}
</script>

{#if showReminder}
	<div
		class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg"
	>
		<div class="rounded-xl bg-white p-6">
			<button
				onclick={dismissReminder}
				class="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
				aria-label="Dismiss reminder"
			>
				<X class="h-5 w-5" />
			</button>

			<div class="flex items-start gap-4">
				<div
					class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500"
				>
					<Sparkles class="h-6 w-6 text-white" />
				</div>

				<div class="flex-1">
					<h3 class="mb-2 text-lg font-bold text-gray-900">
						Lengkapi Setup untuk Pengalaman Terbaik
					</h3>
					<p class="mb-4 text-sm text-gray-600">
						Sepertinya Anda melewati proses setup awal. Lengkapi setup untuk menggunakan semua fitur
						AbsenDulu.
					</p>

					<div class="mb-4 grid gap-3 md:grid-cols-3">
						<div class="flex items-center gap-2">
							<div class="rounded-lg bg-blue-100 p-2">
								<Building2 class="h-4 w-4 text-blue-600" />
							</div>
							<span class="text-xs font-semibold text-gray-700">Buat Company</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="rounded-lg bg-green-100 p-2">
								<MapPin class="h-4 w-4 text-green-600" />
							</div>
							<span class="text-xs font-semibold text-gray-700">Tambah Lokasi</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="rounded-lg bg-purple-100 p-2">
								<Users class="h-4 w-4 text-purple-600" />
							</div>
							<span class="text-xs font-semibold text-gray-700">Entry Karyawan</span>
						</div>
					</div>

					<button
						onclick={goToSetup}
						class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
					>
						Mulai Setup Sekarang
						<ArrowRight class="h-4 w-4" />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
