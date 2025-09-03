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
  <h1 class="text-3xl font-bold text-gray-900 mb-4">Kebijakan Privasi - Absendulu</h1>
  <p class="text-gray-500 mb-10">Terakhir diperbarui: 23 Agustus 2025</p>

  <p class="mb-8">
    Absendulu menghargai privasi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, 
    menggunakan, menyimpan, dan melindungi data pribadi pengguna dalam penggunaan aplikasi Absendulu.
  </p>

  <!-- Section -->
  <div class="space-y-8">
    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">1. Informasi yang Kami Kumpulkan</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li><strong>Informasi Akun</strong>: nama, email, nomor telepon.</li>
        <li><strong>Informasi Perusahaan</strong>: nama perusahaan, lokasi kantor.</li>
        <li><strong>Data Lokasi (GPS)</strong>: untuk memastikan kehadiran sesuai area geofence.</li>
        <li><strong>Data Absensi</strong>: waktu masuk, waktu pulang, izin, dan cuti.</li>
        <li><strong>Informasi Teknis</strong>: perangkat, browser, alamat IP, serta log aktivitas.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">2. Cara Kami Menggunakan Informasi</h2>
      <p class="text-gray-700">Data yang dikumpulkan digunakan untuk:</p>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Menyediakan layanan absensi berbasis geofence.</li>
        <li>Memvalidasi kehadiran karyawan sesuai lokasi.</li>
        <li>Mengelola data perusahaan, karyawan, dan laporan absensi.</li>
        <li>Mengirim notifikasi terkait aktivitas absensi atau izin.</li>
        <li>Meningkatkan keamanan dan performa aplikasi.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">3. Penyimpanan & Keamanan Data</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Data disimpan dengan sistem yang aman menggunakan enkripsi.</li>
        <li>Kami hanya menyimpan data selama diperlukan untuk keperluan operasional.</li>
        <li>Akses data dibatasi hanya untuk pihak yang berwenang.</li>
        <li>Kami <strong>tidak akan menjual atau menyewakan</strong> data pribadi Anda kepada pihak ketiga.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">4. Berbagi Informasi</h2>
      <p class="text-gray-700">Kami hanya membagikan data dengan:</p>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li><strong>Admin perusahaan</strong> yang berhak mengelola absensi karyawan.</li>
        <li><strong>Penyedia layanan pihak ketiga</strong> (server, cloud storage) yang membantu operasional aplikasi.</li>
        <li>Pihak berwenang jika diwajibkan oleh hukum.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">5. Hak Pengguna</h2>
      <ul class="list-disc list-inside space-y-1 text-gray-700">
        <li>Mengakses dan melihat data absensi Anda.</li>
        <li>Meminta perbaikan data yang tidak akurat.</li>
        <li>Menghapus akun (beserta data terkait sesuai kebijakan retention).</li>
        <li>Menolak pemberian izin lokasi (fitur absensi mungkin tidak berfungsi).</li>
      </ul>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">6. Cookie & Teknologi Pelacakan</h2>
      <p class="text-gray-700">
        Absendulu dapat menggunakan <strong>cookie</strong> untuk menyimpan preferensi login dan meningkatkan pengalaman pengguna. 
        Anda dapat menonaktifkan cookie melalui pengaturan browser.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">7. Perubahan Kebijakan</h2>
      <p class="text-gray-700">
        Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Perubahan akan diumumkan melalui aplikasi atau website resmi Absendulu.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">8. Hubungi Kami</h2>
      <p class="text-gray-700">Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami:</p>
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
