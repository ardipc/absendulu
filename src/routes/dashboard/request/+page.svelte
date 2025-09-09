<script lang="ts">
  let type = "";
  let date = "";
  let note = "";

  function handleSubmit() {
    if (!type || !date) {
      alert("Mohon lengkapi data request!");
      return;
    }
    alert(`Request berhasil dikirim:\nJenis: ${type}\nTanggal: ${date}\nKeterangan: ${note}`);
    // TODO: kirim ke Supabase / backend API
  }
</script>

<main class="bg-gray-50 py-3">
  <h1 class="text-xl font-bold mb-6">Form Request</h1>

  <!-- Jenis Request -->
  <label class="block mb-2 text-sm font-medium">Jenis Request</label>
  <select bind:value={type} class="w-full p-4 border rounded-lg mb-4 focus:ring focus:ring-blue-200">
    <option value="">Pilih jenis request</option>
    <option value="izin">Izin</option>
    <option value="sakit">Sakit</option>
    <option value="cuti">Cuti</option>
    <option value="dinas">Dinas Luar</option>
    <option value="koreksi">Koreksi Absensi</option>
  </select>

  <!-- Tanggal -->
  <label class="block mb-2 text-sm font-medium">Tanggal</label>
  <input
    type="date"
    bind:value={date}
    class="w-full p-4 border rounded-lg mb-4 focus:ring focus:ring-blue-200"
  />

  <!-- Keterangan -->
  <label class="block mb-2 text-sm font-medium">Keterangan</label>
  <textarea
    value={note}
    rows="4"
    placeholder="Tuliskan alasan atau detail request..."
    class="w-full p-4 border rounded-lg mb-6 focus:ring focus:ring-blue-200"
  ></textarea>

  <!-- Submit -->
  <button
    on:click={handleSubmit}
    class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 active:scale-95 transition"
  >
    Kirim Request
  </button>
</main>
