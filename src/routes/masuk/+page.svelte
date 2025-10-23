<script lang="ts">
	import { Shield, Zap, CheckCircle, ArrowRight, Sparkles, Lock, User } from '@lucide/svelte';

	let isLoading = $state(false);

	async function signInWithGoogle() {
		isLoading = true;
		window.location.href = '/login/google';
	}

	const features = [
		{ icon: Shield, text: 'Keamanan Terjamin' },
		{ icon: Zap, text: 'Proses Cepat' },
		{ icon: CheckCircle, text: 'Login Sekali Klik' }
	];
</script>

<svelte:head>
	<title>Masuk - AbsenDulu</title>
	<meta name="description" content="Masuk ke AbsenDulu untuk mengelola absensi karyawan Anda" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
	<!-- Decorative Elements -->
	<div
		class="fixed -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-20 blur-3xl"
	></div>
	<div
		class="fixed -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 opacity-20 blur-3xl"
	></div>

	<div class="relative flex min-h-screen">
		<!-- Left Side - Branding -->
		<div
			class="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 lg:flex lg:w-1/2"
		>
			<!-- Decorative circles -->
			<div class="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white opacity-10"></div>
			<div class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white opacity-10"></div>
			<div
				class="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5"
			></div>

			<div class="relative z-10">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-3 text-white">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
					>
						<img src="/logo-white.png" class="h-8 w-8" alt="Logo" />
					</div>
					<span class="text-2xl font-bold">AbsenDulu</span>
				</a>
			</div>

			<div class="relative z-10">
				<h1 class="mb-6 text-5xl leading-tight font-bold text-white">
					Kelola Absensi dengan Lebih
					<span class="block text-yellow-300">Mudah & Akurat</span>
				</h1>
				<p class="mb-8 text-xl text-white/90">
					Sistem absensi modern dengan teknologi GPS geofence dan PWA. Trusted by hundreds of
					companies.
				</p>

				<!-- Features -->
				<div class="space-y-4">
					{#each features as feature (feature.text)}
						{@const IconComponent = feature.icon}
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
								<IconComponent class="h-5 w-5 text-white" />
							</div>
							<span class="text-lg font-semibold text-white">{feature.text}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="relative z-10">
				<div class="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
					<div class="mb-4 flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-bold text-white"
						>
							<User class="h-6 w-6" />
						</div>
						<div>
							<p class="font-semibold text-white">1000+ Perusahaan</p>
							<p class="text-sm text-white/80">Sudah mempercayai kami</p>
						</div>
					</div>
					<div class="flex gap-2">
						{#each [1, 2, 3, 4, 5] as _, i (i)}
							<svg class="h-5 w-5 fill-yellow-300 text-yellow-300" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Right Side - Login Form -->
		<div class="flex w-full items-center justify-center p-8 lg:w-1/2">
			<div class="w-full max-w-md">
				<!-- Mobile Logo -->
				<div class="mb-8 flex justify-center lg:hidden">
					<a href="/" class="flex items-center gap-3">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600"
						>
							<img src="/logo-white.png" class="h-8 w-8" alt="Logo" />
						</div>
						<span class="text-2xl font-bold text-gray-900">AbsenDulu</span>
					</a>
				</div>

				<!-- Login Card -->
				<div class="overflow-hidden rounded-3xl bg-white shadow-2xl">
					<!-- Header -->
					<div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
						>
							<Lock class="h-8 w-8 text-white" />
						</div>
						<h2 class="mb-2 text-3xl font-bold text-white">Selamat Datang!</h2>
						<p class="text-lg text-white/90">Masuk untuk melanjutkan ke dashboard</p>
					</div>

					<!-- Form Content -->
					<div class="p-8">
						<!-- Welcome Message -->
						<div class="mb-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6">
							<div class="flex items-start gap-3">
								<div class="rounded-lg bg-blue-500 p-2">
									<Sparkles class="h-5 w-5 text-white" />
								</div>
								<div>
									<p class="font-semibold text-gray-900">Login Mudah & Aman</p>
									<p class="text-sm text-gray-600">
										Gunakan akun Google Anda untuk masuk dengan sekali klik
									</p>
								</div>
							</div>
						</div>

						<!-- Google Login Button -->
						<button
							type="button"
							onclick={signInWithGoogle}
							disabled={isLoading}
							class="group relative w-full overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
						>
							<div
								class="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<div class="relative flex items-center justify-center gap-3">
								{#if isLoading}
									<div
										class="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-red-500"
									></div>
									<span class="text-lg font-bold text-gray-700 group-hover:text-white"
										>Memproses...</span
									>
								{:else}
									<svg
										class="h-6 w-6 text-red-500 group-hover:text-white"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<path
											d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
											fill="currentColor"
										/>
									</svg>
									<span class="text-lg font-bold text-gray-700 group-hover:text-white"
										>Masuk dengan Google</span
									>
									<ArrowRight
										class="h-5 w-5 text-gray-700 transition-transform group-hover:translate-x-1 group-hover:text-white"
									/>
								{/if}
							</div>
						</button>

						<!-- Security Note -->
						<div class="mt-6 rounded-xl bg-gray-50 p-4">
							<div class="flex items-start gap-3">
								<Shield class="h-5 w-5 flex-shrink-0 text-green-600" />
								<div>
									<p class="text-sm font-semibold text-gray-900">Login 100% Aman</p>
									<p class="text-xs text-gray-600">
										Data Anda dilindungi dengan enkripsi tingkat enterprise
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Footer -->
					<div class="border-t border-gray-100 bg-gray-50 p-6 text-center">
						<p class="text-sm text-gray-600">
							Dengan masuk, Anda menyetujui
							<a
								href="/syarat-ketentuan"
								class="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
								>Syarat & Ketentuan</a
							>
							dan
							<a
								href="/kebijakan-privasi"
								class="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
								>Kebijakan Privasi</a
							>
							kami
						</p>
					</div>
				</div>

				<!-- Back to Home -->
				<div class="mt-6 text-center">
					<a
						href="/"
						class="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-indigo-600"
					>
						<ArrowRight class="h-4 w-4 rotate-180" />
						<span class="font-semibold">Kembali ke Beranda</span>
					</a>
				</div>

				<!-- Additional Info -->
				<div class="mt-8 text-center lg:hidden">
					<p class="mb-4 text-sm font-semibold text-gray-700">Dipercaya oleh 1000+ Perusahaan</p>
					<div class="flex justify-center gap-2">
						{#each [1, 2, 3, 4, 5] as _, idx (idx)}
							<svg class="h-5 w-5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								/>
							</svg>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
