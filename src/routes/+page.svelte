<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Header from '$lib/components/header.svelte';
	import { onMount } from 'svelte';
	import {
		MapPin,
		Clock,
		Smartphone,
		Shield,
		TrendingUp,
		CheckCircle,
		Zap,
		Star,
		ArrowRight,
		Download,
		Globe,
		Award,
		BarChart3,
		Calendar,
		Image as ImageIcon,
		Sparkles
	} from '@lucide/svelte';

	let deferredPrompt: any = null;
	let showInstall = $state(false);

	let { data } = $props();

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstall = true;
		});

		if (data?.user) {
			window.location.href = '/dashboard';
		}
	});

	async function installApp() {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === 'accepted') {
				console.log('User accepted install');
			} else {
				console.log('User dismissed install');
			}
			deferredPrompt = null;
			showInstall = false;
		}
	}

	const features = [
		{
			icon: MapPin,
			color: 'from-blue-500 to-cyan-500',
			title: 'Absensi Geofence',
			description:
				'Validasi lokasi karyawan menggunakan GPS. Absensi hanya bisa dilakukan di area kantor yang sudah ditentukan dengan radius yang akurat.'
		},
		{
			icon: Clock,
			color: 'from-purple-500 to-pink-500',
			title: 'Clock In/Out Otomatis',
			description:
				'Sistem otomatis merekam jam masuk dan pulang karyawan secara real-time tanpa risiko manipulasi atau absensi ganda.'
		},
		{
			icon: ImageIcon,
			color: 'from-green-500 to-emerald-500',
			title: 'Verifikasi Selfie',
			description:
				'Setiap absensi dilengkapi dengan foto selfie untuk memastikan karyawan benar-benar hadir di lokasi yang ditentukan.'
		},
		{
			icon: Smartphone,
			color: 'from-orange-500 to-red-500',
			title: 'Progressive Web App',
			description:
				'Aplikasi bisa dipasang di smartphone tanpa perlu download dari app store. Ringan, cepat, dan bisa diakses offline.'
		},
		{
			icon: BarChart3,
			color: 'from-indigo-500 to-purple-500',
			title: 'Laporan Lengkap',
			description:
				'Dashboard analytics dengan statistik kehadiran, keterlambatan, dan performa karyawan. Export data ke CSV untuk analisis lebih lanjut.'
		},
		{
			icon: Calendar,
			color: 'from-pink-500 to-rose-500',
			title: 'Manajemen Izin & Cuti',
			description:
				'Karyawan dapat mengajukan izin langsung dari aplikasi. Atasan bisa menyetujui atau menolak hanya dengan sekali klik.'
		}
	];

	const benefits = [
		{
			icon: Zap,
			title: 'Hemat Waktu',
			description:
				'Proses absensi hanya butuh 10 detik. Tidak perlu antri atau isi formulir manual.'
		},
		{
			icon: Shield,
			title: 'Anti Manipulasi',
			description:
				'Kombinasi GPS, foto selfie, dan timestamp membuat absensi tidak bisa dimanipulasi.'
		},
		{
			icon: TrendingUp,
			title: 'Tingkatkan Produktivitas',
			description:
				'Monitoring kehadiran real-time membantu meningkatkan disiplin dan produktivitas tim.'
		},
		{
			icon: Globe,
			title: 'Akses Dimana Saja',
			description: 'Berbasis cloud, bisa diakses dari browser manapun, kapan saja, dimana saja.'
		}
	];

	const testimonials = [
		{
			name: 'Ahmad Rifai',
			role: 'HR Manager',
			company: 'PT Maju Jaya',
			content:
				'AbsenDulu mengubah cara kami mengelola kehadiran karyawan. Sangat akurat dan mudah digunakan!',
			rating: 5
		},
		{
			name: 'Siti Nurhaliza',
			role: 'CEO',
			company: 'CV Digital Solutions',
			content:
				'Fitur geofence-nya amazing! Tidak ada lagi absensi palsu. Recommended untuk semua perusahaan.',
			rating: 5
		},
		{
			name: 'Budi Santoso',
			role: 'Operations Manager',
			company: 'Toko Elektronik ABC',
			content:
				'Setup mudah, interface user-friendly, dan support team sangat responsif. Worth it banget!',
			rating: 5
		}
	];
</script>

<svelte:head>
	<title>AbsenDulu - Sistem Absensi Modern dengan Geofence & PWA</title>
	<meta
		name="description"
		content="Aplikasi absensi online dengan teknologi GPS geofence dan PWA. Gratis untuk 1 perusahaan & 1 lokasi. Mudah, cepat, dan akurat."
	/>
</svelte:head>

{#if showInstall}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
		<div class="mx-4 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
			<div class="mb-4 flex justify-center">
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
				>
					<Download class="h-8 w-8 text-white" />
				</div>
			</div>
			<h2 class="mb-2 text-center text-2xl font-bold text-gray-900">Pasang AbsenDulu</h2>
			<p class="mb-6 text-center text-gray-600">
				Tambahkan aplikasi ke layar utama agar lebih cepat diakses dan bisa digunakan offline.
			</p>
			<div class="flex gap-3">
				<button
					onclick={() => (showInstall = false)}
					class="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
				>
					Nanti Saja
				</button>
				<button
					onclick={installApp}
					class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
				>
					Pasang Sekarang
				</button>
			</div>
		</div>
	</div>
{/if}

<Header />

<!-- Hero Section -->
<div class="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
	<!-- Decorative Elements -->
	<div
		class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 opacity-20 blur-3xl"
	></div>
	<div
		class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 opacity-20 blur-3xl"
	></div>

	<div class="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<!-- Left Content -->
			<div>
				<div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
					<Sparkles class="h-4 w-4 text-indigo-600" />
					<span class="text-sm font-semibold text-indigo-600"
						>Gratis untuk 1 Perusahaan & 1 Lokasi</span
					>
				</div>

				<h1 class="mb-6 text-5xl leading-tight font-bold text-gray-900 lg:text-6xl">
					Absen Jadi Lebih
					<span class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
						>Mudah & Akurat</span
					>
				</h1>

				<p class="mb-8 text-xl leading-relaxed text-gray-600">
					Sistem absensi modern dengan teknologi GPS geofence dan PWA. Bisa absen dari smartphone
					tanpa ribet, bahkan saat offline. Perfect untuk bisnis dan organisasi.
				</p>

				<div class="flex flex-wrap gap-4">
					<a
						href="/masuk"
						class="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/50"
					>
						Coba Gratis Sekarang
						<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</a>
					<a
						href="#fitur"
						class="flex items-center gap-2 rounded-2xl border-2 border-gray-300 bg-white px-8 py-4 font-bold text-gray-700 transition-all hover:border-indigo-600 hover:text-indigo-600"
					>
						Lihat Fitur
						<ArrowRight class="h-5 w-5" />
					</a>
				</div>

				<!-- Stats -->
				<div class="mt-12 grid grid-cols-3 gap-6">
					<div>
						<p class="text-4xl font-bold text-indigo-600">99%</p>
						<p class="text-sm text-gray-600">Akurasi Lokasi</p>
					</div>
					<div>
						<p class="text-4xl font-bold text-purple-600">10 detik</p>
						<p class="text-sm text-gray-600">Proses Absensi</p>
					</div>
					<div>
						<p class="text-4xl font-bold text-pink-600">100%</p>
						<p class="text-sm text-gray-600">Anti Manipulasi</p>
					</div>
				</div>
			</div>

			<!-- Right Image/Illustration -->
			<div class="relative">
				<div class="relative z-10 overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
					<img
						src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=800&fit=crop"
						alt="Team collaboration"
						class="rounded-2xl"
					/>
				</div>
				<div
					class="absolute -right-6 -bottom-6 h-72 w-72 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-600 opacity-20"
				></div>
				<div
					class="absolute -top-6 -left-6 h-72 w-72 rounded-3xl bg-gradient-to-br from-pink-400 to-rose-600 opacity-20"
				></div>
			</div>
		</div>
	</div>
</div>

<!-- Features Section -->
<div id="fitur" class="bg-white py-24">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2">
				<Star class="h-4 w-4 text-indigo-600" />
				<span class="text-sm font-semibold text-indigo-600">Fitur Lengkap</span>
			</div>
			<h2 class="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
				Semua yang Anda Butuhkan untuk Absensi Modern
			</h2>
			<p class="mx-auto max-w-2xl text-xl text-gray-600">
				Teknologi terkini untuk mengelola kehadiran karyawan dengan lebih efisien dan akurat
			</p>
		</div>

		<!-- Features Grid -->
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each features as feature (feature.title)}
				{@const IconComponent = feature.icon}
				<div
					class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
				>
					<div
						class={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} p-4 shadow-lg`}
					>
						<IconComponent class="h-8 w-8 text-white" />
					</div>
					<h3 class="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
					<p class="text-gray-600">{feature.description}</p>

					<!-- Hover Effect -->
					<div
						class="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100"
					></div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Benefits Section -->
<div class="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-24 text-white">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-bold lg:text-5xl">Kenapa Memilih AbsenDulu?</h2>
			<p class="mx-auto max-w-2xl text-xl text-white/80">
				Lebih dari sekadar aplikasi absensi, kami memberikan solusi lengkap untuk bisnis Anda
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each benefits as benefit (benefit.title)}
				{@const IconComponent = benefit.icon}
				<div class="rounded-3xl bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/20">
					<div class="mb-4 inline-flex rounded-2xl bg-white/20 p-4">
						<IconComponent class="h-8 w-8" />
					</div>
					<h3 class="mb-2 text-xl font-bold">{benefit.title}</h3>
					<p class="text-white/80">{benefit.description}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Testimonials Section -->
<div class="bg-white py-24">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-16 text-center">
			<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2">
				<Award class="h-4 w-4 text-yellow-600" />
				<span class="text-sm font-semibold text-yellow-600">Trusted by Many</span>
			</div>
			<h2 class="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">Apa Kata Mereka?</h2>
			<p class="mx-auto max-w-2xl text-xl text-gray-600">
				Ratusan perusahaan sudah mempercayai AbsenDulu untuk mengelola kehadiran karyawan
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-3">
			{#each testimonials as testimonial (testimonial.name)}
				<div
					class="rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
				>
					<div class="mb-4 flex gap-1">
						{#each Array(testimonial.rating) as _star, i (i)}
							<Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
						{/each}
					</div>
					<p class="mb-6 text-gray-700">"{testimonial.content}"</p>
					<div class="flex items-center gap-4">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white"
						>
							{testimonial.name.charAt(0)}
						</div>
						<div>
							<p class="font-bold text-gray-900">{testimonial.name}</p>
							<p class="text-sm text-gray-600">{testimonial.role}</p>
							<p class="text-xs text-gray-500">{testimonial.company}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Pricing Section -->
<div id="harga" class="bg-gradient-to-br from-gray-50 to-white py-24">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-16 text-center">
			<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
				<CheckCircle class="h-4 w-4 text-green-600" />
				<span class="text-sm font-semibold text-green-600">Harga Terjangkau</span>
			</div>
			<h2 class="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl">
				Pilih Paket Sesuai Kebutuhan
			</h2>
			<p class="mx-auto max-w-2xl text-xl text-gray-600">
				Mulai gratis untuk 1 perusahaan & 1 lokasi. Upgrade ke Pro untuk fitur lebih lengkap
			</p>
		</div>

		<div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
			<!-- Free Plan -->
			<div class="rounded-3xl bg-white p-8 shadow-lg">
				<div class="mb-6">
					<h3 class="mb-2 text-2xl font-bold text-gray-900">Paket Gratis</h3>
					<div class="flex items-baseline gap-2">
						<span class="text-5xl font-bold text-gray-900">Rp 0</span>
						<span class="text-gray-600">/bulan</span>
					</div>
				</div>
				<p class="mb-6 text-gray-600">
					Cocok untuk tim kecil yang ingin mencoba absensi online dengan geofence tanpa biaya
				</p>
				<ul class="mb-8 space-y-4">
					<li class="flex items-center gap-3">
						<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
						<span class="text-gray-700">1 Perusahaan</span>
					</li>
					<li class="flex items-center gap-3">
						<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
						<span class="text-gray-700">1 Lokasi Geofence</span>
					</li>
					<li class="flex items-center gap-3">
						<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
						<span class="text-gray-700">Maksimal 10 Karyawan</span>
					</li>
					<li class="flex items-center gap-3">
						<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
						<span class="text-gray-700">Clock In / Out</span>
					</li>
					<li class="flex items-center gap-3">
						<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
						<span class="text-gray-700">Approval Izin & Cuti</span>
					</li>
					<li class="flex items-center gap-3">
						<CheckCircle class="h-5 w-5 flex-shrink-0 text-green-600" />
						<span class="text-gray-700">Laporan Basic</span>
					</li>
				</ul>
				<a
					href="/masuk"
					class="block rounded-2xl border-2 border-indigo-600 bg-white py-4 text-center font-bold text-indigo-600 transition-all hover:bg-indigo-50"
				>
					Mulai Gratis
				</a>
			</div>

			<!-- Pro Plan -->
			<div
				class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 shadow-2xl"
			>
				<div class="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10"></div>
				<div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white opacity-10"></div>

				<div class="relative">
					<div
						class="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm"
					>
						<Star class="h-4 w-4 text-yellow-300" />
						<span class="text-sm font-semibold text-white">Most Popular</span>
					</div>
					<div class="mb-6">
						<h3 class="mb-2 text-2xl font-bold text-white">Paket Pro</h3>
						<div class="flex items-baseline gap-2">
							<span class="text-5xl font-bold text-white">Rp 99K</span>
							<span class="text-white/80">/bulan</span>
						</div>
					</div>
					<p class="mb-6 text-white/90">
						Untuk perusahaan yang ingin fitur lengkap dan tanpa batasan
					</p>
					<ul class="mb-8 space-y-4">
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Unlimited Company</span>
						</li>
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Unlimited Lokasi</span>
						</li>
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Unlimited Karyawan</span>
						</li>
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Semua Fitur Gratis</span>
						</li>
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Laporan Advanced</span>
						</li>
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Priority Support</span>
						</li>
						<li class="flex items-center gap-3">
							<CheckCircle class="h-5 w-5 flex-shrink-0 text-white" />
							<span class="text-white">Custom Branding</span>
						</li>
					</ul>
					<a
						href="/masuk"
						class="block rounded-2xl bg-white py-4 text-center font-bold text-indigo-600 transition-all hover:scale-105 hover:shadow-2xl"
					>
						Upgrade ke Pro
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- CTA Section -->
<div class="bg-gradient-to-r from-indigo-600 to-purple-600 py-24">
	<div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
		<h2 class="mb-6 text-4xl font-bold text-white lg:text-5xl">
			Siap Modernisasi Sistem Absensi Anda?
		</h2>
		<p class="mb-8 text-xl text-white/90">
			Bergabunglah dengan ratusan perusahaan yang sudah merasakan kemudahan AbsenDulu
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a
				href="/masuk"
				class="group flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-indigo-600 shadow-2xl transition-all hover:scale-105"
			>
				Mulai Gratis Sekarang
				<ArrowRight class="h-5 w-5 transition-transform group-hover:translate-x-1" />
			</a>
			<a
				href="#fitur"
				class="flex items-center gap-2 rounded-2xl border-2 border-white px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
			>
				Pelajari Lebih Lanjut
			</a>
		</div>
	</div>
</div>

<Footer />
