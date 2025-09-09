<script lang="ts">
  let isClockedIn = false;

  function handleAbsensi() {
    isClockedIn = !isClockedIn;
    alert(isClockedIn ? "Clock In berhasil!" : "Clock Out berhasil!");
  }

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const location = "Kantor Pusat"; 
</script>

<main class="pt-16 pb-20 px-4 bg-gray-50 flex flex-col items-center justify-center text-center">
  <!-- Info Hari -->
  <h1 class="text-lg font-semibold mb-1">{today}</h1>
  <p class="text-sm text-gray-500 mb-8">{location}</p>

  <!-- Tombol Absen -->
  <button class="cursor-pointer w-40 h-40 rounded-full flex items-center justify-center text-xl font-bold shadow-lg transition-all bg-blue-500 text-white hover:bg-blue-600 active:scale-95" onclick={handleAbsensi}>
    {isClockedIn ? "Clock Out" : "Clock In"}
  </button>

  <!-- Status -->
  <p class="mt-6 text-gray-600 text-sm">
    {isClockedIn ? "Anda sudah masuk, jangan lupa Clock Out saat pulang." : "Silakan tekan tombol untuk Clock In."}
  </p>
</main>