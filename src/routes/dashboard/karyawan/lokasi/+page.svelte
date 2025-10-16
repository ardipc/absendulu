<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

  let { data } = $props();

  let siteName = $state("");
  let siteLat = $state(0);
  let siteLng = $state(0);
  let siteAddress = $state("");
  let siteRadius = $state(50);

  onMount(() => {
    // Ambil lokasi sekali
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          siteLat = pos.coords.latitude;
          siteLng = pos.coords.longitude;
        },
        (err) => {
          console.error("Error getting location:", err);
          siteLat = -7.250445; // Contoh fallback
          siteLng = 112.768845;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  })

  async function createSite(e: Event) {
    e.preventDefault()

    if (!siteName || !siteAddress || !siteRadius || !siteLat || !siteLng) {
      alert("Semua form harus diisi");
      return;
    }
    let body = { company: data.company.id, name: siteName, address: siteAddress, radius: siteRadius, latitude: siteLat, longitude: siteLng }
    
    const { error } = await data.supabase.from("sites").insert([body]).select()
    if (error) console.log(error)
    
    goto(`/dashboard/karyawan`)
  }

  async function handleDelete(id: number) {
    // 👉 contoh simpan ke Supabase
    const { error } = await data.supabase
      .from('employees')
      .delete()
      .eq('id', data.employee.id);

    if (error) console.error(error);
    goto('/dashboard/karyawan');
  }

  async function handleEdit(e: Event) {
    e.preventDefault();

    const employee = { name: nama, email, role, phone };

    // 👉 contoh simpan ke Supabase
    const { error } = await data.supabase
      .from('employees')
      .update(employee)
      .eq('id', data.employee.id);

    if (error) console.error(error);
    goto('/dashboard/karyawan');
  }
</script>

<main class="p-2 md:p-6 bg-gray-50 min-h-screen">
  <div class="max-w-md mx-auto mt-3 bg-white rounded-2xl shadow p-6">
    <h2 class="text-2xl font-bold mb-6 text-center">Lokasi</h2>

    <form onsubmit={createSite} class="space-y-4">
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
      onclick={() => handleDelete(data.employee.id)}
      class="w-full py-3 mt-4 text-white text-lg font-semibold bg-red-600 rounded-full hover:bg-red-700 transition"
    >
      Hapus
    </button>

    <div class="w-full flex justify-center mt-6">
      <a href="/dashboard/karyawan" class="text-center">Kembali</a>
    </div>

  </div>

</main>