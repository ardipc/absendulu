<script lang="ts">
	import { goto } from "$app/navigation";

  let { data } = $props();

  let nama = $state("");
  let email = $state("");
  let role = $state("");
  let phone = $state("");

  async function handleSubmit(e: Event) {
    e.preventDefault();

    const newEmployee = { company: data.company.id, name: nama, email, role, phone };

    // 👉 contoh simpan ke Supabase
    const { data: insert, error } = await data.supabase
      .from('employees')
      .insert([newEmployee]);
    if (error) console.error(error);

    // Reset form setelah submit
    nama = email = role = phone = "";
    goto('/dashboard/karyawan');
  }
</script>

<div class="max-w-md mx-auto mt-3 bg-white rounded-2xl shadow p-6">
  <h2 class="text-2xl font-bold mb-6 text-center">Tambah Karyawan</h2>

  <form on:submit={handleSubmit} class="space-y-4">
    <div>
      <label class="block text-gray-700 mb-1 font-medium">Nama</label>
      <input
        type="text"
        bind:value={nama}
        placeholder="Masukkan nama lengkap"
        class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>

    <div>
      <label class="block text-gray-700 mb-1 font-medium">Email</label>
      <input
        type="email"
        bind:value={email}
        placeholder="Masukkan email"
        class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>

    <div>
      <label class="block text-gray-700 mb-1 font-medium">Role</label>
      <select
        bind:value={role}
        class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        required
      >
        <option value="" disabled selected>Pilih role</option>
        <option value="staff">Staff</option>
        <option value="supervisor">Supervisor</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <div>
      <label class="block text-gray-700 mb-1 font-medium">Nomor Telepon</label>
      <input
        type="tel"
        bind:value={phone}
        placeholder="Contoh: 081234567890"
        class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        required
      />
    </div>

    <button
      type="submit"
      class="w-full py-3 mt-4 text-white text-lg font-semibold bg-blue-600 rounded-full hover:bg-blue-700 transition"
    >
      Simpan
    </button>

    <div class="w-full flex justify-center">
      <a href="/dashboard/karyawan" class="text-center">Kembali</a>
    </div>
  </form>
</div>
