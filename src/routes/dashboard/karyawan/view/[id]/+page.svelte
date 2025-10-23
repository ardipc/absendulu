<script lang="ts">
	import { goto } from '$app/navigation';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { formatDate } from '$lib/utils.js';

  let { data } = $props();
  console.log(data)

  let nama = $state(data.employee.name);
  let email = $state(data.employee.email);
  let role = $state(data.employee.role);
  let phone = $state(data.employee.phone);

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
  <Tabs.Root value="account" class="w-full">
    <Tabs.List class="w-full mb-2">
      <Tabs.Trigger value="account">Karyawan</Tabs.Trigger>
      <Tabs.Trigger value="kehadiran">Kehadiran</Tabs.Trigger>
      <Tabs.Trigger value="request">Requests</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
      <div class="mx-auto bg-white rounded-2xl shadow p-6">
        <form onsubmit={handleEdit} class="space-y-4">
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
    </Tabs.Content>
    <Tabs.Content value="kehadiran">
      <div class="space-y-2">
        {#each data.attendances as rec}
          {@const clockIn = rec.clock_in_ts?.split('T')}
          {@const clockOut = rec.clock_out_ts?.split('T')}
          {@const valClockIn = rec.clock_in_ts ? clockIn[1].split(".")[0] : "-"}
          {@const valClockOut = rec.clock_out_ts ? clockOut[1]?.split(".")[0] : "-"}
          <button
            type="button"
            class="bg-white p-4 shadow rounded-xl flex justify-between items-center w-full text-left"
            aria-label="Lihat detail absensi">
            <div>
              <p class="font-medium">{rec.date}</p>
              <p class="text-sm font-bold">{rec.sites.name}</p>
              <p class="text-xs">{rec.status}</p>
            </div>
            <div class="flex gap-2 not-last-of-type:justify-between text-center">
              <div class="border p-2 rounded-xl">
                <p class="text-xs font-bold">Clock In</p>
                <p class="text-sm text-gray-700">{rec.clock_in_ts ? formatDate(rec.clock_in_ts, "HH:mm:ss") : "-"}</p>
              </div>
              <div class="border p-2 rounded-xl">
                <p class="text-xs font-bold">Clock Out</p>
                <p class="text-sm text-gray-700">{rec.clock_out_ts ? formatDate(rec.clock_out_ts, "HH:mm:ss") : "-"}</p>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </Tabs.Content>
    <Tabs.Content value="request">
      <div class="space-y-2">
        {#each data.requests as rec}
          <button
            type="button"
            class="bg-white p-4 shadow rounded-xl flex justify-between items-center w-full text-left"
            aria-label="Lihat detail absensi">
            <div>
              <p class="font-medium">{String(rec.type).toUpperCase()}</p>
              <p class="text-sm font-bold">{rec.start_date}</p>
              <p class="text-xs mt-2">{rec.reason}</p>
            </div>
            <div class="flex gap-2 not-last-of-type:justify-between text-center">
              <div class="border p-2 rounded-xl">
                <p class="text-xs font-bold">Clock In</p>
              </div>
              <div class="border p-2 rounded-xl">
                <p class="text-xs font-bold">Clock Out</p>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </Tabs.Content>
  </Tabs.Root>

  

</main>