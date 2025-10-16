<script lang="ts">
	import { goto } from '$app/navigation';
	
  let { data } = $props();

  let name = $state(data.company.name);
  let description = $state(data.company.description);

  async function handleDelete(id: number) {
    const { error } = await data.supabase
      .from('companies')
      .delete()
      .eq('id', data.company.id);

    if (error) console.error(error);
    goto('/dashboard/karyawan');
  }

  async function handleEdit() {
    // 👉 contoh simpan ke Supabase
    const { error } = await data.supabase
      .from('companies')
      .update({ name, description })
      .eq('id', data.company.id);

    if (error) console.error(error);
    goto('/dashboard/karyawan');
  }

</script>

<main class="p-2 md:p-6 bg-gray-50 min-h-screen">
  <div class="max-w-md mx-auto mt-3 bg-white rounded-2xl shadow p-6">
    <h2 class="text-2xl font-bold mb-6 text-center">Company</h2>

    <form onsubmit={handleEdit} class="space-y-4">
      <div>
        <label class="block text-gray-700 mb-1 font-medium">Company</label>
        <input
          type="text"
          bind:value={name}
          placeholder="Nama company"
          class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1 font-medium">Alamat</label>
        <textarea
          bind:value={description}
          placeholder="Alamat"
          class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required></textarea>
      </div>

      <button
        type="submit"
        class="w-full py-3 mt-4 text-white text-lg font-semibold bg-blue-600 rounded-full hover:bg-blue-700 transition"
      >
        Simpan
      </button>

    </form> 
      
    <button
      type="button"
      onclick={() => handleDelete(data.company.id)}
      class="w-full py-3 mt-4 text-white text-lg font-semibold bg-red-600 rounded-full hover:bg-red-700 transition"
    >
      Hapus
    </button>

    <div class="w-full flex justify-center mt-6">
      <a href="/dashboard/karyawan" class="text-center">Kembali</a>
    </div>

  </div>

</main>