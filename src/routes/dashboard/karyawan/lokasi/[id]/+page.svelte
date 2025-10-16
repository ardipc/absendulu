<script lang="ts">
	import { goto } from '$app/navigation';

  let { data } = $props();

  let siteName = $state(data.site.name);
  let siteLat = $state(data.site.latitude);
  let siteLng = $state(data.site.longitude);
  let siteAddress = $state(data.site.address);
  let siteRadius = $state(data.site.radius);

  async function handleDelete(id: number) {
    // 👉 contoh simpan ke Supabase
    const { error } = await data.supabase
      .from('sites')
      .delete()
      .eq('id', data.site.id);

    if (error) console.error(error);
    goto('/dashboard/karyawan');
  }

  async function handleEdit(e: Event) {
    e.preventDefault();

    let body = { name: siteName, address: siteAddress, radius: siteRadius, latitude: siteLat, longitude: siteLng }

    // 👉 contoh simpan ke Supabase
    const { error } = await data.supabase
      .from('sites')
      .update(body)
      .eq('id', data.site.id);

    if (error) console.error(error);
    goto('/dashboard/karyawan');
  }
</script>

<main class="p-2 md:p-6 bg-gray-50 min-h-screen">
  <div class="max-w-md mx-auto mt-3 bg-white rounded-2xl shadow p-6">
    <h2 class="text-2xl font-bold mb-6 text-center">Lokasi</h2>

    <form onsubmit={handleEdit} class="space-y-4">
      <div>
        <label class="block text-gray-700 mb-1 font-medium">Lokasi</label>
        <input
          type="text"
          bind:value={siteName}
          placeholder="Nama lokasi"
          class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1 font-medium">Latitude</label>
        <input
          type="text"
          bind:value={siteLat}
          placeholder="Latitude"
          class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1 font-medium">Longitude</label>
        <input
          type="text"
          bind:value={siteLng}
          placeholder="Longitude"
          class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1 font-medium">Radius (meter)</label>
        <input
          type="number"
          bind:value={siteRadius}
          placeholder="Radius"
          class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 mb-1 font-medium">Alamat</label>
        <textarea
          bind:value={siteAddress}
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
      onclick={() => handleDelete(data.site.id)}
      class="w-full py-3 mt-4 text-white text-lg font-semibold bg-red-600 rounded-full hover:bg-red-700 transition"
    >
      Hapus
    </button>

    <div class="w-full flex justify-center mt-6">
      <a href="/dashboard/karyawan" class="text-center">Kembali</a>
    </div>

  </div>

</main>