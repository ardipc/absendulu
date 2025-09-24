<script lang="ts">
	import { supabase } from "$lib/supabase";
	import { uploadFormData } from "$lib/upload";
  import * as Tabs from '$lib/components/ui/tabs/index.js';

  let { data } = $props();

  let isSubmit = $state(false);

  let type = $state("");
  let date = $state("");
  let note = $state("");

  let file: File | null = null;
  let fileInput: HTMLInputElement | null = null;

  function resetFile() {
    if (fileInput) {
      fileInput.value = ""; // reset the file input
    }
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      file = target.files[0];
    }
  }

  async function handleSubmit() {
    if (!type && !date && !note) {
      alert("Mohon lengkapi data request!");
      return;
    }

    isSubmit = true;

    let upload = await uploadFormData(file);
    
    let body = {
      company: data.company,
      employee: data.user.email,
      reason: note,
      type,
      start_date: date,
      attachments: upload ? upload.path : ''
    }

    let create = await supabase.from('requests').insert([body]);
    if (create.error) {
      alert("Gagal mengirim request. Silakan coba lagi.");
      console.error("Error creating request:", create.error);
    } else {
      alert("Request berhasil dikirim!");
      
      // Reset form
      type = "";
      date = "";
      note = "";
      file = null;

      resetFile();

      isSubmit = false;
    }
  }
</script>

<main class="bg-gray-50 p-2 md:p-6">
  <Tabs.Root value="account" class="w-full">
    <Tabs.List class="w-full mb-6">
      <Tabs.Trigger value="account">Form Request</Tabs.Trigger>
      <Tabs.Trigger value="password">My Requests</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
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
        bind:value={note}
        rows="4"
        placeholder="Tuliskan alasan atau detail request..."
        class="w-full p-4 border rounded-lg mb-4 focus:ring focus:ring-blue-200"
      ></textarea>

      <label class="block mb-2 text-sm font-medium">Lampiran</label>
      <input
        type="file"
        bind:this={fileInput}
        accept="image/*"
        onchange={handleFileChange}
        class="w-full border p-2 mb-8 rounded-lg"
      />

      <!-- Submit -->
      <button
        onclick={handleSubmit}
        disabled={isSubmit}
        class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 active:scale-95 transition"
        class:bg-gray-400={isSubmit}
      >
        {#if isSubmit}
          Mengirim...
        {:else}
          Kirim Request
        {/if}
      </button>
    </Tabs.Content>
    <Tabs.Content value="password">

    </Tabs.Content>
  </Tabs.Root>

</main>
