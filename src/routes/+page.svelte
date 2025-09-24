<script lang="ts">
	import Footer from "$lib/components/footer.svelte";
  import Header from "$lib/components/header.svelte";
  import { onMount } from "svelte";

  let deferredPrompt: any;
  let showInstall = $state(false);

  let { data } = $props();
  console.log("index:", data)

  onMount(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // block default mini-infobar
      e.preventDefault();
      deferredPrompt = e;
      showInstall = true;
    });

    if (data?.user) {
      // redirect to dashboard if logged in
      window.location.href = "/dashboard";
    }
  });

  async function installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // munculkan popup bawaan browser
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted install");
      } else {
        console.log("User dismissed install");
      }
      deferredPrompt = null;
      showInstall = false;
    }
  }
</script>

{#if showInstall}
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
      <h2 class="text-lg font-bold mb-2">Pasang Absendulu</h2>
      <p class="text-gray-600 mb-4 text-sm">
        Tambahkan aplikasi ke layar utama agar lebih cepat diakses.
      </p>
      <div class="flex justify-center gap-4">
        <button
          onclick={() => showInstall = false}
          class="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
        >
          Nanti Saja
        </button>
        <button
          onclick={installApp}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Pasang
        </button>
      </div>
    </div>
  </div>
{/if}

<Header />

<!-- Hero -->
<div class="relative isolate p-6 lg:px-8">
  <div class="mx-auto max-w-2xl py-12 sm:py-12 lg:py-24">
    <div class="hidden sm:mb-8 sm:flex sm:justify-center">
      <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
        Kabar gembira untuk kita semua 🎤🎶
      </div>
    </div>
    <div class="text-center">
      <h1 class="text-3xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Absen Jadi Lebih Mudah, Cukup Buka Absendulu.</h1>
      <p class="mt-8 text-lg text-pretty text-gray-500 sm:text-xl/8">Sistem absensi pakai lokasi dan PWA. Bisa absen dari smartphone tanpa ribet, bahkan saat offline. Gratis untuk 1 perusahaan & 1 lokasi.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <a href="/masuk" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Coba Gratis Sekarang</a>
        <a href="#fitur" class="text-sm/6 font-semibold text-gray-900">Lihat Fitur <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>
  <div aria-hidden="true" class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"></div>
  </div>
</div>

<!-- Features -->
<div id="fitur" class="bg-white py-12 sm:py-24">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base/7 font-semibold text-indigo-600">Simple & Mudah</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">Absensi Lebih Akurat dengan Geofence</p>
      <p class="mt-6 text-lg/8 text-gray-700">Validasi lokasi karyawan menggunakan GPS. Absensi hanya bisa dilakukan di area kantor yang sudah ditentukan.</p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        
        <div class="relative pl-16">
          <dt class="text-base/7 font-semibold text-gray-900">
            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-white">
                <path d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            📍 Absensi Geofence
          </dt>
          <dd class="mt-2 text-base/7 text-gray-600">Validasi lokasi karyawan menggunakan GPS. Absensi hanya bisa dilakukan di area kantor yang sudah ditentukan.</dd>
        </div>

        <div class="relative pl-16">
          <dt class="text-base/7 font-semibold text-gray-900">
            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-white">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            🕒 Clock In / Out
          </dt>
          <dd class="mt-2 text-base/7 text-gray-600">Sistem otomatis merekam jam masuk dan pulang karyawan secara real-time tanpa risiko absensi ganda.</dd>
        </div>

        <div class="relative pl-16">
          <dt class="text-base/7 font-semibold text-gray-900">
            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-white">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            ✅ Approval Izin & Cuti
          </dt>
          <dd class="mt-2 text-base/7 text-gray-600">Karyawan dapat mengajukan izin langsung dari aplikasi, atasan bisa menyetujui atau menolak hanya dengan sekali klik.</dd>
        </div>
        <div class="relative pl-16">
          <dt class="text-base/7 font-semibold text-gray-900">
            <div class="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 text-white">
                <path d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            🏢 Multi Company
          </dt>
          <dd class="mt-2 text-base/7 text-gray-600">Kelola lebih dari satu perusahaan atau lokasi absensi dengan mudah. Gratis untuk 1 perusahaan & 1 lokasi, upgrade untuk akses penuh.</dd>
        </div>
      </dl>
    </div>
  </div>
</div>

<!-- Pricing -->
<div id="harga" class="relative isolate bg-white px-6 py-12 sm:py-24 lg:px-8">
  <div aria-hidden="true" class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" class="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"></div>
  </div>
  <div class="mx-auto max-w-4xl text-center">
    <h2 class="text-base/7 font-semibold text-indigo-600">Ini yang ditunggu</h2>
    <p class="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">Pilih Paket Sesuai Kebutuhan</p>
  </div>
  <p class="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl/8">Mulai gratis untuk 1 perusahaan & 1 lokasi. Upgrade ke Pro untuk fitur lebih lengkap dan fleksibel.</p>
  
  <div class="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
    <div class="rounded-3xl rounded-t-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
      <h3 id="tier-hobby" class="text-base/7 font-semibold text-indigo-600">Gratisan</h3>
      <p class="mt-4 flex items-baseline gap-x-2">
        <span class="text-5xl font-semibold tracking-tight text-gray-900">Rp 0</span>
        <span class="text-base text-gray-500">/month</span>
      </p>
      <p class="mt-6 text-base/7 text-gray-600">Cocok untuk tim kecil yang ingin mencoba absensi online dengan geofence tanpa biaya.</p>
      <ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10">
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-600">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          1 Company
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-600">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          1 Lokasi Geofence
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-600">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Maksimal 10 Karyawan
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-600">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Clock In / Out
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-600">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Aproval Izin & Cuti
        </li>
      </ul>
      <a href="/masuk" aria-describedby="tier-hobby" class="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 inset-ring inset-ring-indigo-200 hover:inset-ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10">Mulai Sekarang</a>
    </div>

    <div class="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
      <h3 id="tier-enterprise" class="text-base/7 font-semibold text-indigo-400">Berbayar</h3>
      <p class="mt-4 flex items-baseline gap-x-2">
        <span class="text-5xl font-semibold tracking-tight text-white">Rp 30.000</span>
        <span class="text-base text-gray-400">/month</span>
      </p>
      <p class="mt-6 text-base/7 text-gray-300">Dapatkan fleksibilitas mengelola banyak perusahaan, lokasi, dan karyawan dengan dukungan penuh.</p>
      <ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-300 sm:mt-10">
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Multi Company
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Multi Lokasi Geofence
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Unlimited Karyawan
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Clock In / Out
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Aproval Izin & Cuti
        </li>
      <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Prioritas Support
        </li>
        <li class="flex gap-x-3">
          <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="h-6 w-5 flex-none text-indigo-400">
            <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
          </svg>
          Custom Development
        </li>
      </ul>
      <a href="/langganan" aria-describedby="tier-enterprise" class="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:mt-10">Langganan Sekarang</a>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="bg-white">
  <div class="mx-auto max-w-7xl py-6 sm:px-6 sm:pt-16 lg:px-8">
    <div class="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-20 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
      <svg viewBox="0 0 1024 1024" aria-hidden="true" class="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
        <circle r="512" cx="512" cy="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fill-opacity="0.7" />
        <defs>
          <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
            <stop stop-color="#7775D6" />
            <stop offset="1" stop-color="#E935C1" />
          </radialGradient>
        </defs>
      </svg>
      <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
        <h2 class="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">Siap Tinggalkan Cara Lama? Saatnya Absendulu!.</h2>
        <p class="mt-6 text-lg/8 text-pretty text-gray-300">Gunakan sistem absensi modern berbasis geofence & PWA. Gratis untuk 1 perusahaan & 1 lokasi. Upgrade kapan saja sesuai kebutuhan.</p>
        <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
          <a href="/masuk" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Mulai Sekarang</a>
        </div>
      </div>
      <div class="relative mt-16 h-80 lg:mt-8">
        <img width="1824" height="1080" src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png" alt="App screenshot" class="absolute top-0 left-0 w-228 max-w-none rounded-md bg-white/5 ring-1 ring-white/10" />
      </div>
    </div>
  </div>
</div>

<!-- Team -->
<div id="tim" class="bg-white py-12 sm:py-24">
  <div class="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
    <div class="max-w-xl">
      <h2 class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">Tim Absendulu</h2>
      <p class="mt-6 text-lg/8 text-gray-600">Kami adalah kelompok individu yang dinamis yang bersemangat dengan apa yang kami lakukan dan berdedikasi untuk memberikan hasil terbaik bagi dosen kami.</p>
    </div>
    <ul role="list" class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
      <li>
        <div class="flex items-center gap-x-6">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-16 rounded-full outline-1 -outline-offset-1 outline-black/5" />
          <div>
            <h3 class="text-base/7 font-semibold tracking-tight text-gray-900">Reza</h3>
            <p class="text-sm/6 font-semibold text-indigo-600">Project Manager</p>
          </div>
        </div>
      </li>
      <li>
        <div class="flex items-center gap-x-6">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-16 rounded-full outline-1 -outline-offset-1 outline-black/5" />
          <div>
            <h3 class="text-base/7 font-semibold tracking-tight text-gray-900">Muhammad Didin</h3>
            <p class="text-sm/6 font-semibold text-indigo-600">Backend Engineer</p>
          </div>
        </div>
      </li>
      <li>
        <div class="flex items-center gap-x-6">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="size-16 rounded-full outline-1 -outline-offset-1 outline-black/5" />
          <div>
            <h3 class="text-base/7 font-semibold tracking-tight text-gray-900">Ahmad Ardiansyah</h3>
            <p class="text-sm/6 font-semibold text-indigo-600">Frontend Engineer</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>

<Footer />
