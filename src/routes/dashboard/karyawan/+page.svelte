<script lang="ts">
	import { goto } from "$app/navigation";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	import { Edit } from "@lucide/svelte";
	import { onMount } from "svelte";

  let { data } = $props();

  // Simulasi user plan
  let isFreePlan = true;

  // Simulasi company
  let company: { owner: string | undefined; name: string; description: string } | any[] | null = $state(null);

  // Form input
  let companyName = $state("");
  let companyAddress = $state("");

  async function createCompany() {
    if (!companyName || !companyAddress) {
      alert("Nama & alamat perusahaan harus diisi");
      return;
    }
    company = { owner: data.user.email, name: companyName, description: companyAddress };
    const create = await data.supabase.from("companies").insert([company]).select()
    console.log(create)
    alert(`Company ${company.name} berhasil dibuat!`);
  }

  let loading = $state(true)

  onMount(() => {
    checkingCompany()
  });

  async function checkingCompany() {
    loading = true

    const { data: response } = await data.supabase.from("companies").select("*,sites(*),employees(*)").eq("owner", data.user.email);
    if (response?.length === 0) company = null;
    else if (response) company = response[0];
    else company = null;

    loading = false
  }
</script>

<main class="p-2 md:p-6 bg-gray-50 min-h-screen">
  {#if loading}
    <div class="grid grid-cols-1 gap-2">
      <Skeleton class="h-[24px] w-full rounded" />
      <Skeleton class="h-[60px] w-full rounded" />
      <Skeleton class="h-[20px] w-full rounded" />
      <Skeleton class="h-[40px] w-full rounded" />
    </div>
  {/if}

  {#if !company && !loading}
    <!-- FORM CREATE COMPANY -->
    <h1 class="text-xl font-bold mb-4">Buat Perusahaan Anda</h1>
    <p class="text-sm text-gray-500 mb-6">
      Anda menggunakan paket <span class="font-semibold">{isFreePlan ? "Gratis" : "Pro"}</span>.
      Pada paket gratis, Anda hanya bisa membuat 1 perusahaan dan 1 lokasi.
    </p>

    <label class="block mb-2 text-sm font-medium">Nama Perusahaan</label>
    <input type="text" value={companyName} onchange={e => companyName = e.target.value}
      class="w-full p-4 border rounded-lg mb-4 focus:ring focus:ring-blue-200" />

    <label class="block mb-2 text-sm font-medium">Alamat Perusahaan</label>
    <textarea value={companyAddress} rows="3" onchange={e => companyAddress = e.target.value}
      class="w-full p-4 border rounded-lg mb-6 focus:ring focus:ring-blue-200"></textarea>

    <button onclick={createCompany}
      class="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600">
      Buat Perusahaan
    </button>

  {/if}

  {#if company && !loading}
    <!-- COMPANY DASHBOARD -->
    <div class="flex justify-between mb-3">
      <div>
        <h1 class="text-xl font-bold">{company.name}</h1>
        <p class="text-gray-600">{company.description}</p>
      </div>
      <button class="rounded-full" onclick={() => goto(`/dashboard/karyawan/company`)}>
        <Edit class="w-4 h-4 cursor-pointer" />
      </button>
    </div>

    <div class="mt-3 mb-6">
      <h2 class="font-bold text-xl mb-3">Lokasi Kerja</h2>
      {#if company.sites.length === 0}
        <p class="text-gray-500 mb-3">Belum ada lokasi kerja. Tambahkan lokasi kerja untuk mengaktifkan fitur absensi berbasis lokasi.</p>
      {:else}
        <ul class="mb-6">
          {#each company.sites as site}
            <a href={`/dashboard/karyawan/lokasi/${site.id}`}>
              <li class="mb-2 border p-2 rounded-lg flex gap-3 items-center">
                <img src="https://ui-avatars.com/api/?name={site.name}&background=random&size=64" alt="Avatar" class="w-10 h-10 rounded-full" />
                <div>
                  <p class="font-medium">{site.name}</p>
                  <p class="text-xs text-gray-500">{site.address}</p>
                  <p class="text-sm">Radius: {site.radius}m</p>
                </div>
              </li>
            </a>
          {/each}
        </ul>
      {/if}
      {#if company.sites.length === 0}
        <button type="button"
            onclick={() => goto('/dashboard/karyawan/lokasi')}
            class="w-full py-3 text-white text-lg font-semibold bg-green-600 rounded-full hover:bg-green-700 transition"
          >
          Buat Lokasi Kerja
        </button>
      {/if}
    </div>

    <div class="my-3">
      <h2 class="font-bold text-xl mb-3">Daftar Karyawan</h2>
      {#if company.employees.length === 0}
        <p class="text-gray-500 mb-3">Belum ada karyawan. Tambahkan karyawan untuk mengelola absensi.</p>
      {:else}
        <ul class="mb-6">
          {#each company.employees as emp}
            <a href={`/dashboard/karyawan/view/${emp.id}`} class="shadow-2xl">
              <li class="mb-2 border p-2 rounded-lg flex gap-3 items-center">
                <img src="https://ui-avatars.com/api/?name={emp.name}&background=random&size=64" alt="Avatar" class="w-10 h-10 rounded-full" />
                <div>
                  <p class="font-medium">{emp.name}</p>
                  <p class="text-xs">{emp.email} - {emp.phone}</p>
                  <p class="text-xs text-gray-500 italic">{emp.role}</p>
                </div>
              </li>
            </a>
          {/each}
        </ul>
      {/if}
      {#if company.employees.length < 10}
        <button type="button"
          onclick={() => goto('/dashboard/karyawan/form')}
          class="w-full py-3 text-white text-lg font-semibold bg-green-600 rounded-full hover:bg-green-700 transition"
        >
          Tambah Karyawan
        </button>
      {/if}
    </div>

  {/if}
</main>