<header class="bg-white">
  <nav aria-label="Global" class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
    <div class="flex lg:flex-1">
      <a href="/" class="-m-1.5 p-1.5">
        <span class="sr-only">Absendulu</span>
        <img src="/rectangle.png" alt="" class="h-10 w-auto" />
      </a>
    </div>
    <div class="flex lg:hidden">
      <button type="button" command="show-modal" commandfor="mobile-menu" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 cursor-pointer">
        <span class="sr-only">Open main menu</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <el-popover-group class="hidden lg:flex lg:gap-x-12">
      <a href="/" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Beranda</a>
      <a href="#fitur" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Fitur</a>
      <a href="#harga" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Harga</a>
      <a href="#tim" class="text-sm/6 font-semibold text-gray-900 cursor-pointer">Tim</a>
    </el-popover-group>
    <div class="hidden lg:flex lg:flex-1 lg:justify-end">
      <a href="/masuk" class="text-sm/6 font-semibold text-gray-900">Masuk <span aria-hidden="true">&rarr;</span></a>
    </div>
  </nav>
  <el-dialog>
    <dialog id="mobile-menu" class="backdrop:bg-transparent lg:hidden">
      <div tabindex="0" class="fixed inset-0 focus:outline-none">
        <el-dialog-panel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="/" class="-m-1.5 p-1.5">
              <span class="sr-only">Absendulu</span>
              <img src="/rectangle.png" alt="Absendulu" class="h-10 w-auto" />
            </a>
            <button type="button" command="close" commandfor="mobile-menu" class="-m-2.5 rounded-md p-2.5 text-gray-700 cursor-pointer">
              <span class="sr-only">Close menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
                <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="space-y-2 py-6">
                <a href="/" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Beranda</a>
                <a href="#fitur" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Fitur</a>
                <a href="#harga" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Harga</a>
                <a href="#tim" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Tim</a>
              </div>
              <div class="py-6">
                <a href="/masuk" class="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">Masuk</a>
              </div>
            </div>
          </div>
        </el-dialog-panel>
      </div>
    </dialog>
  </el-dialog>
</header>

<!-- Container -->
<div class="max-w-4xl mx-auto px-6 py-12">

  <!-- Title -->
  <h1 class="text-3xl font-bold text-gray-900 mb-4">Syarat dan Ketentuan - Absendulu</h1>
  <p class="text-gray-500 mb-10">Terakhir diperbarui: 23 Agustus 2025</p>

  <p class="mb-8">
    Dengan menggunakan aplikasi <strong>Absendulu</strong>, Anda setuju untuk mematuhi Syarat dan Ketentuan ini. 
    Harap baca dengan seksama sebelum menggunakan layanan kami.
  </p>

  <!-- Sections -->
  <div class="space-y-8">

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">1. Penerimaan Syarat</h2>
      <p class="text-gray-700">
        Dengan mendaftar dan menggunakan Absendulu, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. 
        Jika Anda tidak setuju, silakan berhenti menggunakan layanan kami.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">2. Penggunaan Layanan</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Anda wajib memberikan informasi yang benar dan akurat saat registrasi.</li>
        <li>Anda bertanggung jawab menjaga kerahasiaan akun dan password Anda.</li>
        <li>Penggunaan layanan untuk tujuan ilegal atau melanggar hukum dilarang.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">3. Hak & Kewajiban Pengguna</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Pengguna berhak mengakses dan menggunakan aplikasi sesuai fitur yang tersedia.</li>
        <li>Pengguna bertanggung jawab atas semua aktivitas yang dilakukan melalui akun mereka.</li>
        <li>Pengguna dilarang menyalahgunakan fitur, termasuk manipulasi data absensi.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">4. Hak & Kewajiban Absendulu</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Kami berhak menangguhkan atau menghapus akun yang melanggar Syarat dan Ketentuan.</li>
        <li>Kami berhak memperbarui, menambah, atau menghapus fitur tanpa pemberitahuan sebelumnya.</li>
        <li>Kami berkewajiban menjaga keamanan dan kerahasiaan data pengguna sesuai Kebijakan Privasi.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">5. Paket & Biaya</h2>
      <p class="text-gray-700">
        Absendulu menyediakan paket <strong>Gratisan</strong> dan <strong>Berbayar</strong>. 
        Ketentuan biaya, batasan fitur, serta kebijakan langganan dapat berubah sewaktu-waktu dan akan diinformasikan melalui website resmi.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">6. Batasan Tanggung Jawab</h2>
      <p class="text-gray-700">
        Absendulu tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat:
      </p>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Penyalahgunaan akun oleh pengguna lain.</li>
        <li>Kehilangan data akibat kesalahan pengguna.</li>
        <li>Gangguan teknis di luar kendali kami (misalnya jaringan internet atau server pihak ketiga).</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">7. Perubahan Syarat dan Ketentuan</h2>
      <p class="text-gray-700">
        Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke waktu. 
        Perubahan akan berlaku segera setelah dipublikasikan di website atau aplikasi Absendulu.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">8. Hukum yang Berlaku</h2>
      <p class="text-gray-700">
        Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di Republik Indonesia. 
        Sengketa yang timbul akan diselesaikan sesuai peraturan perundang-undangan yang berlaku.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">9. Kontak</h2>
      <p class="text-gray-700">Untuk pertanyaan lebih lanjut, silakan hubungi kami:</p>
      <p>WhatsApp: <a href="https://wa.me/6282334093822" class="text-blue-600 hover:underline">+62 823 3409 3822</a></p>
    </section>
  
  </div>
</div>
<!-- Footer -->
<footer class="bg-gray-900 text-gray-300 py-12">
  <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-5 gap-8">

    <!-- Logo & Brand -->
    <div class="md:col-span-1">
      <div class="flex items-center space-x-3 mb-4">
        <img src="/logo-white.png" alt="Logo" class="w-10 h-10 rounded-lg">
        <span class="text-white text-xl font-bold">Absendulu</span>
      </div>
      <p class="text-gray-400 text-sm">
        Solusi absensi karyawan modern berbasis geofence & PWA. Mudah, aman, dan tanpa mesin fingerprint.
      </p>
    </div>

    <!-- Quick Links -->
    <div>
      <h4 class="text-white font-semibold mb-3">Navigasi</h4>
      <ul class="space-y-2">
        <li><a href="/" class="hover:text-white">Beranda</a></li>
        <li><a href="#fitur" class="hover:text-white">Mulai Sekarang</a></li>
        <li><a href="/masuk" class="hover:text-white">Masuk</a></li>
      </ul>
    </div>

    <!-- Product -->
    <div>
      <h4 class="text-white font-semibold mb-3">Produk</h4>
      <ul class="space-y-2">
        <li><a href="#fitur" class="hover:text-white">Fitur</a></li>
        <li><a href="#harga" class="hover:text-white">Harga</a></li>
      </ul>
    </div>

    <!-- Legal -->
    <div>
      <h4 class="text-white font-semibold mb-3">Legal</h4>
      <ul class="space-y-2">
        <li><a href="/kebijakan-privasi" class="hover:text-white">Kebijakan Privasi</a></li>
        <li><a href="/syarat-ketentuan" class="hover:text-white">Syarat & Ketentuan</a></li>
      </ul>
    </div>

    <!-- Contact -->
    <div>
      <h4 class="text-white font-semibold mb-3">Kontak</h4>
      <ul class="space-y-2">
        <li>
          <a href="https://wa.me/6282334093822" target="_blank" class="hover:text-white">
            WhatsApp
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- Bottom -->
  <div class="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
    &copy; 2025 Absendulu. All rights reserved.
  </div>
</footer>
